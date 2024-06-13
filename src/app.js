import {checkAnswer} from './flashcards.js';
import {createRecognition, setLanguage} from './recognition.js';
import * as wk from './wanikani.js';
import { initializeSettings, getSettings, isLightningOn } from './settings.js';
import { createTranscriptContainer, logTranscript, clearTranscript } from './live_transcript.js';
import { loadDictionary } from './dict.js';

import { ToHiragana } from './candidates/to_hiragana.js';
import { ConvertWo } from './candidates/convert_wo.js';
import { BasicDictionary } from './candidates/basic_dictionary.js';
import { SplitDictionary } from './candidates/split_dictionary.js';
import { SuruVerbs } from './candidates/suru_verbs.js';
import { RepeatingSubstring } from './candidates/repeating.js';
import { FuzzyVowels } from './candidates/fuzzy_vowels.js';
import { MultipleWords } from './candidates/multiple.js';
import { Numerals } from './candidates/numerals.js';

function onStart(settings, items) {
  const context = wk.getContext(items);
  if (!context) {
    return;
  }
  if (context.page === 'review' || context.page === 'lesson' || context.page === 'quiz') {
    startListener(items);
  }
  if (context.page === 'entry' && process.env.NODE_ENV !== 'production') {
    startListener(items);
  }
}

function handleSpeechRecognition(items, transformers, state, commands, raw, final) {
  let newState = state;
  let answer = null;
  let command = null;
  let lightning = false;
  let transcript = {raw};

  if (state === "Ready") {
    const context = wk.getContext(items);

    const result = checkAnswer(context, transformers, raw);
    console.log('[wanikani-voice-input]', raw, result, context);
    if (result.candidate && transcript.raw !== result.candidate.data) {
      transcript.matched = result.candidate.data;
    }
    if (result.success) {
      if (final) {
        answer = result.answer;
      } else {
        newState = "Waiting";
        answer = result.answer;
      }
    } else if (result.error) {
      transcript = "!! " + result.message + " !!";
    }
  }
  if (state === "Waiting" && final) {
    newState = "Ready";
    lightning = isLightningOn();
  }
  if (state === "Ready" && final && commands[raw]) {
    command = commands[raw];
  }

  return { newState, transcript, answer, command, lightning };
}

function startListener(items) {
  createTranscriptContainer(getSettings());
  const dictionary = loadDictionary();

  let state = "Ready";
  let context = wk.getContext(items);
  let result = null;

  function setState(newState) {
    //console.log(`[wanikani-voice-input] >> ${newState}`);
    state = newState;
  }

  function next() {
    wk.clickNext();
    setState("Ready");
  }

  const commands = {
    'wrong': wk.markWrong,
    'incorrect': wk.markWrong,
    'mistake': wk.markWrong,
    '不正解': wk.markWrong,
    'ふせいかい': wk.markWrong,
    '間違い': wk.markWrong,
    'まちがい': wk.markWrong,
    'だめ': wk.markWrong,
    'ダメ': wk.markWrong,
    '駄目': wk.markWrong,
    'next': next,
    'つぎ': next,
    '次': next,
    'NEXT': next,
    'ねくすと': next,
    'ネクスト': next,
  };

  const transformers = [
    new ToHiragana(),
    new ConvertWo(),
    new BasicDictionary(dictionary),
    new SplitDictionary(dictionary),
    new SuruVerbs(dictionary),
    new RepeatingSubstring(),
    new MultipleWords(dictionary),
    new Numerals()
  ];

  const lang = wk.getLanguage();
  const recognition = createRecognition(lang, function(raw, final) {
    logTranscript(getSettings(), {raw});
    let outcome = handleSpeechRecognition(items, transformers, state, commands, raw, final);
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
  function mutationCallback(mutations, observer) {
    const lang = wk.getLanguage();
    setLanguage(recognition, lang);

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
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, config);

  // lightning mode and auto show info on wrong:
  window.addEventListener("didAnswerQuestion", function(e) {
    if (wk.didAnswerCorrectly(e)) {
      if (isLightningOn()) {
        setTimeout(wk.clickNext, getSettings().lightning_delay * 1000);
      }
    } else {
      if (isLightningOn()) {
        setTimeout(wk.clickInfo, getSettings().mistake_delay * 1000);
      }
    }
  });

  recognition.start();
  state = "Ready";
};

async function loadWkof(wkof) {
  wkof.include('Menu,Settings,ItemData');
  await wkof.ready('Menu,Settings,ItemData');
  const settings = initializeSettings(wkof);
  const items = await wkof.ItemData.get_items();
  onStart(settings, items);
}

if (unsafeWindow.wkof) {
  const wkof = unsafeWindow.wkof;
  loadWkof(unsafeWindow.wkof);
} else {
  const script = 'Voice Input';
  const msg = `${script} requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?`;
  if (confirm(msg)) {
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
  }
}
