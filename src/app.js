import {checkAnswer} from './flashcards.js';
import {createRecognition, setLanguage} from './recognition.js';
import * as wk from './wanikani.js';
import { initializeSettings } from './settings.js';

function contextHasChanged(prev) {
  const curr = wk.getContext();
  return prev.prompt !== curr.prompt || prev.category !== curr.category || prev.type !== curr.type;
}

function createTranscriptContainer(position) {
  const container = document.createElement('div');
  container.id = "wanikani-voice-input-transcript-container";
  let style = "width: 100%; position: absolute; display: flex; align-items: center; justify-content: center;";
  if (position === "top" || position === "bottom") {
    style = style + ` ${position}: 0px`;
  } else if (position === "center") {
    style = style + ` top: 45vh`;
  }
  container.style = style;

  const transcript = document.createElement('p');
  transcript.style = "color: black; background-color: gold; font-size: 5vh;";

  container.appendChild(transcript);
  document.body.appendChild(container);
}

function setTranscript(text) {
  const transcript = document.querySelector('div#wanikani-voice-input-transcript-container p');
  transcript.textContent = text;
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

function setupMicButton() {
  const menu = document.querySelector('div.character-header__menu-navigation');
  const item = document.createElement('div');
  item.classList.add('character-header__menu-navigation-link');
  item.style = 'margin-left: 10px;';
  const link = document.createElement('a');
  link.title = 'Toggle voice input';
  link.classList.add('summary-button');

  let state = true;
  link.onclick = function(e) {
    console.log(`[wanikani-voice-input] >> mic click`);
    if (state) {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-light');
    } else {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-light');
    }
    state = !state;
  };

  const icon = document.createElement('i');
  icon.classList.add('wk-icon');
  icon.classList.add('fa-solid');
  icon.classList.add('fa-microphone');

  link.appendChild(icon);
  item.appendChild(link);
  menu.appendChild(item);
}

wk.checkDom();
main();

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
