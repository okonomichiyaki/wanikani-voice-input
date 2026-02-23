import { checkAnswer } from './flashcards';
import { createRecognition, setLanguage, acquireMicStream, stopRecognition, releaseMicStream } from './recognition';
import * as wk from './wanikani';
import { initializeSettings, getSettings, isLightningOn } from './settings';
import {
  createTranscriptContainer,
  logTranscript,
  clearTranscript,
  removeTranscriptContainer,
} from './live_transcript';
import { loadDictionary } from './dict';
import { ToHiragana } from './candidates/to_hiragana';
import { ConvertWo } from './candidates/convert_wo';
import { BasicDictionary } from './candidates/basic_dictionary';
import { SplitDictionary } from './candidates/split_dictionary';
import { SuruVerbs } from './candidates/suru_verbs';
import { RepeatingSubstring } from './candidates/repeating';
import { MultipleWords } from './candidates/multiple';
import { Numerals } from './candidates/numerals';
import { WKOFData, WKContext, Transcript, WKOF } from './types';

interface Transformer {
  order: number;
  getCandidates(raw: string): import('./candidates/types').Candidate[];
}

interface SpeechOutcome {
  newState: string;
  transcript: Transcript;
  answer: string | null;
  command: (() => void) | null;
  lightning: boolean;
}

let activeCleanup: (() => void) | null = null;

function isRelevantPage(context: WKContext): boolean {
  if (context.page === 'review' || context.page === 'lesson' || context.page === 'quiz') {
    return true;
  }
  if (context.page === 'entry' && process.env.NODE_ENV !== 'production') {
    return true;
  }
  return false;
}

async function handleNavigation(wkof: WKOF): Promise<void> {
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }

  wkof.include('ItemData');
  await wkof.ready('ItemData');

  const items = await wkof.ItemData.get_items();
  const context = wk.getContext(items);

  if (context && isRelevantPage(context)) {
    console.log('[wanikani-voice-input]', 'initializing: ', context);
    wkof.include('Menu,Settings');
    await wkof.ready('Menu,Settings');
    await initializeSettings(wkof);
    void startListener(items);
  }
}

function handleSpeechRecognition(
  items: WKOFData,
  transformers: Transformer[],
  state: string,
  commands: Record<string, () => void>,
  transcript: Transcript,
): SpeechOutcome {
  let newState = state;
  let answer: string | null = null;
  let command: (() => void) | null = null;
  let lightning = false;
  const { raw, final } = transcript;

  if (state === 'Ready') {
    const context = wk.getContext(items);
    if (!context) {
      return { newState, transcript, answer, command, lightning };
    }

    const result = checkAnswer(context, transformers, raw);
    console.log('[wanikani-voice-input]', transcript, result, context);
    if (result.candidate && transcript.raw !== result.candidate.data) {
      transcript.matched = result.candidate.data;
    }
    if (result.answer) {
      if (final) {
        answer = result.answer;
      } else {
        newState = 'Waiting';
        answer = result.answer;
      }
    }
  }
  if (state === 'Waiting' && final) {
    newState = 'Ready';
    lightning = isLightningOn();
  }
  if (state === 'Ready' && final && commands[raw]) {
    command = commands[raw];
  }

  return { newState, transcript, answer, command, lightning };
}

async function startListener(items: WKOFData): Promise<void> {
  createTranscriptContainer(getSettings());
  const dictionary = loadDictionary();

  let state = 'Ready';
  let context = wk.getContext(items);

  function setState(newState: string): void {
    state = newState;
  }

  function next(): void {
    wk.clickNext();
    setState('Ready');
  }

  const commands: Record<string, () => void> = {
    wrong: wk.markWrong,
    incorrect: wk.markWrong,
    mistake: wk.markWrong,
    不正解: wk.markWrong,
    ふせいかい: wk.markWrong,
    間違い: wk.markWrong,
    まちがい: wk.markWrong,
    だめ: wk.markWrong,
    ダメ: wk.markWrong,
    駄目: wk.markWrong,
    next: next,
    つぎ: next,
    次: next,
    NEXT: next,
    ねくすと: next,
    ネクスト: next,
  };

  const transformers: Transformer[] = [
    new ToHiragana(),
    new ConvertWo(),
    new BasicDictionary(dictionary),
    new SplitDictionary(dictionary),
    new SuruVerbs(dictionary),
    new RepeatingSubstring(),
    new MultipleWords(dictionary),
    new Numerals(),
  ];

  const lang = wk.getLanguage();
  const recognition = createRecognition(lang, function (raw: string, final: boolean) {
    logTranscript(getSettings(), { raw, final });
    const outcome = handleSpeechRecognition(items, transformers, state, commands, { raw, final });
    logTranscript(getSettings(), outcome.transcript);
    if (state !== outcome.newState) {
      setState(outcome.newState);
    }
    if (outcome.answer) {
      wk.submitAnswer(outcome.answer);
    }
    if (outcome.command) {
      outcome.command();
    }

    // clear transcript if enabled, after utterance is over:
    const newContext = wk.getContext(items);
    if (final && wk.didContextChange(context, newContext)) {
      context = newContext;
      if (getSettings().transcript_clear) {
        clearTranscript();
      }
    }
  });

  // watch to trigger language change on next card:
  function mutationCallback(_mutations: MutationRecord[], _observer: MutationObserver): void {
    const lang = wk.getLanguage();
    if (recognition) {
      setLanguage(recognition, lang);
    }

    // clear transcript if enabled, for manual input:
    if (state === 'Ready') {
      const newContext = wk.getContext(items);
      if (wk.didContextChange(context, newContext)) {
        context = newContext;
        if (getSettings().transcript_clear) {
          clearTranscript();
        }
      }
    }
  }
  const config: MutationObserverInit = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, config);

  // lightning mode and auto show info on wrong:
  function didAnswerQuestionHandler(e: Event): void {
    if (wk.didAnswerCorrectly(e)) {
      if (isLightningOn()) {
        setTimeout(wk.clickNext, getSettings().lightning_delay * 1000);
      }
    } else {
      if (isLightningOn()) {
        setTimeout(wk.clickInfo, getSettings().mistake_delay! * 1000);
      }
    }
  }
  window.addEventListener('didAnswerQuestion', didAnswerQuestionHandler);

  if (recognition) {
    await acquireMicStream();
    recognition.start();
  }
  state = 'Ready';

  activeCleanup = () => {
    console.log('[wanikani-voice-input]', 'cleaning up');
    if (recognition) {
      stopRecognition(recognition);
    }
    releaseMicStream();
    observer.disconnect();
    window.removeEventListener('didAnswerQuestion', didAnswerQuestionHandler);
    removeTranscriptContainer();
  };
}

if (unsafeWindow.wkof) {
  const wkof = unsafeWindow.wkof;
  wkof.on_pageload(['/*'], () => void handleNavigation(wkof));
} else {
  const script = 'Voice Input';
  const msg = `${script} requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?`;
  if (confirm(msg)) {
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
  }
}
