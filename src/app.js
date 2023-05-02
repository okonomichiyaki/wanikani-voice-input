import {checkAnswer} from './flashcards.js';
import {createRecognition, setLanguage} from './recognition.js';
import * as wk from './wanikani.js';


function contextHasChanged(prev) {
  const curr = wk.getContext();
  return prev.prompt !== curr.prompt || prev.category !== curr.category || prev.type !== curr.type;
}

function main() {
  console.log('[wanikani-voice-input]');

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
    if (state === "Ready") {
      answer = checkAnswer(recognition, transcript, final);
      if (answer) {
        if (final) {
          setState("Flipping");
          wk.submitAnswer(answer);
          setTimeout(wk.clickNext, 100);
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
      }
    }
  }
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, config);

  // lightning mode and auto show info on wrong:
  window.addEventListener("didAnswerQuestion", function(e) {
    const detail = e.detail;
    if (detail.results.passed) {
      if (state === "Ready") { // for manual input
        state = "Flipping";
        setTimeout(wk.clickNext, 100);
      }
    } else {
      setTimeout(wk.clickInfo, 100);
    }
  });

  window.addEventListener("didAnswerQuestion", function(e) {
    console.log(`[wanikani-voice-input] handleAnswer`, e);
  });

  recognition.start();
  state = "Ready";
};

function setup() {
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
setup();
