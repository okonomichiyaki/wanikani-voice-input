import {checkAnswer} from './flashcards.js';
import {createRecognition, setLanguage} from './recognition.js';
import * as wk from './wanikani.js';
import { initializeSettings } from './settings.js';
import { createTranscriptContainer, setTranscript } from './live_transcript.js';

function contextHasChanged(prev) {
  const curr = wk.getContext();
  return prev.prompt !== curr.prompt || prev.category !== curr.category || prev.type !== curr.type;
}

function main() {
  console.log('[wanikani-voice-input]');
  createTranscriptContainer("top");

  let state = "Flipping";
  let previous = wk.getContext();
  let answer = null;

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
  };

  const lang = wk.getLanguage();
  const recognition = createRecognition(lang, function(recognition, transcript, final) {
    console.log('[wanikani-voice-input]', wk.getContext());
    setTranscript(transcript);
    if (state === "Ready") {
      answer = checkAnswer(recognition, transcript, final);
      if (answer) {
        if (final) {
          setState("Flipping");
          wk.submitAnswer(answer);
        } else {
          setState("Waiting");
          wk.submitAnswer(answer);
        }
        return;
      }
    }
    if (state === "Waiting" && final) {
      setState("Flipping");
      setTimeout(wk.clickNext, 100);
      return;
    }
    if (state === "Ready" && final && commands[transcript]) {
      commands[transcript]();
    }
  });

  // watch to trigger language change on next card:
  function mutationCallback(mutations, observer) {
    const lang = wk.getLanguage();
    setLanguage(recognition, lang);
    if (state === "Flipping") {
      const context = contextHasChanged(previous);
      if (context) {
        setState("Ready");
        previous = context;
        answer = null;
        setTranscript("");
      }
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
        setTimeout(wk.clickNext, 100);
      }
    } else {
      setTimeout(wk.clickInfo, 100);
    }
  });

  recognition.start();
  state = "Ready";
};

function onUpdate() {
  console.log('[wanikani-voice-input] onUpdate');
//  console.log('New maximum is ' + wkof.settings.settings_demo_01.max_apprentice);
}

function onStart() {
  console.log('[wanikani-voice-input] onStart');
}

if (window.wkof) {
  const wkof = window.wkof;
  initializeSettings(wkof, onStart, onUpdate);
} else {
  console.log('[wanikani-voice-input] wkof not found?');
}
