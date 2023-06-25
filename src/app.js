import {checkAnswer} from './flashcards.js';
import {createRecognition, setLanguage} from './recognition.js';
import * as wk from './wanikani.js';
import { initializeSettings } from './settings.js';
import { createTranscriptContainer, setTranscript } from './live_transcript.js';

function handleSpeechRecognition(state, commands, recognition, raw, final) {
  let newState = state;
  let answer = null;
  let command = null;
  let lightning = false;
  let transcript = raw;

  if (state === "Ready") {
    let result = checkAnswer(recognition, raw, final);
    console.log('[wanikani-voice-input]', result);
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
  if (state === "Ready" && final && commands[raw]) {
    command = commands[raw];
  }

  return { newState, transcript, answer, command, lightning };
}

function contextHasChanged(prev) {
  const curr = wk.getContext();
  return prev.prompt !== curr.prompt || prev.category !== curr.category || prev.type !== curr.type;
}

function main() {
  console.log('[wanikani-voice-input]');
  createTranscriptContainer();

  let state = "Flipping";
  let previous = wk.getContext();
  let result = null;

  function setState(newState) {
    console.log(`[wanikani-voice-input] >> ${newState}`);
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
    'next': next,
    'つぎ': next,
    '次': next,
    'NEXT': next,
    'ねくすと': next,
    'ネクスト': next,
  };

  const lang = wk.getLanguage();
  const recognition = createRecognition(lang, function(recognition, raw, final) {
    console.log('[wanikani-voice-input]', wk.getContext());
    let outcome = handleSpeechRecognition(state, commands, recognition, raw, final);
    setTranscript(outcome.transcript);
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
    if (state === "Flipping" && context) {
      setState("Ready");
      previous = context;
      setTranscript("");
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

function onUpdate() {
  const lightning = window.wkof.settings['wanikani-voice-input'].lightning;
  console.log('[wanikani-voice-input] onUpdate', lightning);
}

function onStart() {
  console.log('[wanikani-voice-input] onStart');
  wk.checkDom();
  main();

}

if (window.wkof) {
  const wkof = window.wkof;
  initializeSettings(wkof, onStart, onUpdate);
} else {
  console.log('[wanikani-voice-input] wkof not found?');
  onStart();
}

function isLightningOn() {
  if (window.wkof && window.wkof.settings['wanikani-voice-input']) {
    return window.wkof.settings['wanikani-voice-input'].lightning;
  }
  return true;
}
