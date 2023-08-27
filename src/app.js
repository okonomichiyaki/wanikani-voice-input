import {checkAnswer} from './flashcards.js';
import {createRecognition, setLanguage} from './recognition.js';
import * as wk from './wanikani.js';
import { initializeSettings, getSettings, isLightningOn, isSudachiOn } from './settings.js';
import { createTranscriptContainer, logTranscript } from './live_transcript.js';
import { loadDictionary } from './dict.js';

import { ToHiragana } from './candidates/to_hiragana.js';
import { BasicDictionary } from './candidates/basic_dictionary.js';
import { SuruVerbs } from './candidates/suru_verbs.js';
import { RepeatingSubstring } from './candidates/repeating.js';
import { FuzzyVowels } from './candidates/fuzzy_vowels.js';
import { MultipleWords } from './candidates/multiple.js';

function onStart() {
  const context = wk.getContext();
  if (context.page === 'review' || context.page === 'lesson' || context.page === 'quiz') {
    startListener();
  }
  if (context.page === 'entry' && process.env.NODE_ENV !== 'production') {
    startListener();
  }
}

function handleSpeechRecognition(transformers, state, commands, raw, final) {
  let newState = state;
  let answer = null;
  let command = null;
  let lightning = false;
  let transcript = raw;


  if (state === "Ready") {
    const context = wk.getContext();

    const result = checkAnswer(context, transformers, raw);
    console.log('[wanikani-voice-input]', raw, result);
    if (result.candidate && transcript !== result.candidate.data) {
      transcript = transcript + ` (${result.candidate.data})`;
    }
    if (result.success) {
      if (final) {
        newState = "Flipping";
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
    newState = "Flipping";
    lightning = isLightningOn();
  }
  if ((state === "Ready" || state === "Flipping") && final && commands[raw]) {
    command = commands[raw];
  }

  return { newState, transcript, answer, command, lightning };
}

function contextHasChanged(prev) {
  const curr = wk.getContext();
  if (prev.prompt !== curr.prompt || prev.category !== curr.category || prev.type !== curr.type) {
    return curr;
  } else {
    return null;
  }
}

function startListener() {
  createTranscriptContainer(getSettings());
  const dictionary = loadDictionary();

  let state = "Flipping";
  let previous = wk.getContext();
  let result = null;

  function setState(newState) {
    //console.log(`[wanikani-voice-input] >> ${newState}`);
    state = newState;
  }

  function next() {
    wk.clickNext();
    setState("Flipping");
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
    new BasicDictionary(dictionary),
    new SuruVerbs(dictionary),
    new RepeatingSubstring(),
    new MultipleWords(dictionary),
  ];

  const lang = wk.getLanguage();
  const recognition = createRecognition(lang, function(raw, final) {
    logTranscript(getSettings(), raw);
    let outcome = handleSpeechRecognition(transformers, state, commands, raw, final);
    logTranscript(getSettings(), outcome.transcript);
    if (state !== outcome.newState) {
      setState(outcome.newState);
    }
    if (outcome.answer) {
      wk.submitAnswer(outcome.answer);
    }
    if (outcome.lightning) {
      setTimeout(wk.clickNext, 100);
    }
    if (outcome.command) {
      outcome.command();
    }
  });

  // watch to trigger language change on next card:
  function mutationCallback(mutations, observer) {
    const lang = wk.getLanguage();
    setLanguage(recognition, lang);
    const context = contextHasChanged(previous);
//    console.log('mutationCallback', previous, context);
    if (state === "Flipping" && context) {
      setState("Ready");
      previous = context;
    }
  }
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, config);

  // lightning mode and auto show info on wrong:
  window.addEventListener("didAnswerQuestion", function(e) {
    if (wk.didAnswerCorrectly(e)) {
      if (state === "Ready") { // for manual input
        state = "Flipping";
        if (isLightningOn()) {
          setTimeout(wk.clickNext, 100);
        }
      }
    } else {
      if (isLightningOn()) {
        setTimeout(wk.clickInfo, 100);
      }
    }
  });

  recognition.start();
  state = "Ready";
};

if (unsafeWindow.wkof) {
  const wkof = unsafeWindow.wkof;
  initializeSettings(wkof, onStart);
} else {
  onStart();
}
