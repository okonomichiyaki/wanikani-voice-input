// standalone functions to interact with WaniKani web app

// returns `radical`, `kanji`, or `vocabulary`
function getCategory() {
  const category = document.querySelector('#turbo-body > div.quiz > div.quiz-input > label > span.quiz-input__question-category');
  if (category) {
    return category.textContent.trim().toLowerCase();
  }
  return null;
}

// returns `name` (radical only), `meaning`, or `reading`
function getType() {
  const type = document.querySelector('#turbo-body > div.quiz > div.quiz-input > label > span.quiz-input__question-type');
  if (type) {
    return type.textContent.trim().toLowerCase();
  }
  return null;
}

export function getLanguage() {
  const t = getType();
  if (t === "meaning" || t === "name") {
    return 'en-US';
  }
  if (t === "reading") {
    return 'ja-JP';
  }
  return 'en-US';
}

// returns flashcard "front"
export function getPrompt() {
  const el = document.querySelector('div.character-header__characters');
  if (!el) {
    return null;
  }
  let prompt = el.textContent;
  if (prompt === '' && el.childNodes.length > 0 && el.childNodes[0].alt) {
    prompt = el.childNodes[0].alt.toLowerCase();
  }
  if (prompt === '') {
    return null;
  }
  return prompt;
}

// returns unique flashcard context: prompt + category + type
export function getContext() {
  const prompt = getPrompt();
  const category = getCategory();
  const type = getType();
  return {prompt, category, type};
}

// looks up user synonym by (wanikani subject) id
export function getUserSynonyms(id) {
  const script = document.querySelector('#quiz-user-synonyms script');
  if (script) {
    const data = JSON.parse(script.textContent);
    if (data[id]) {
      return data[id];
    }
  }
  return [];
}

// flashcard "backs" for this review session
export function getSubjects() {
  const script = document.querySelector('#quiz-queue > script[data-quiz-queue-target="subjects"]');
  if (!script) {
    return null;
  }
  const subjects = JSON.parse(script.textContent);
  const result = {};
  for (const subject of subjects) {
    if (subject.primary_reading_type) {
      const readings = subject[subject.primary_reading_type].map(function (r) { return {reading: r}; });
      subject.readings = readings;
    }
    if (subject.type === 'Radical') {
      subject.readings = [];
    }
    const synonyms = getUserSynonyms(subject.id);
    subject.meanings.push(...synonyms);
    const keys = [subject.id, subject.characters];
    for (const meaning of subject.meanings) {
      keys.push(meaning.toLowerCase());
    }
    for (const key of keys) {
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(subject);
    }
  }
  return result;
}

export function clickNext() {
  const buttons = document.querySelectorAll('#turbo-body > div.quiz > div.quiz-input > div > div.quiz-input__input-container > form > button > i');
  if (buttons.length > 0) {
    buttons.item(0).click();
    return true;
  }
  return false;
}

export function markWrong() {
  const lang = getLanguage();
  const incorrect = lang === "en-US" ? "aaa" : "あああ";
  inputAnswer(incorrect);
}

export function inputAnswer(input) {
  const userResponse = document.querySelector('#user-response');
  if (userResponse) {
    userResponse.value = input;
    return clickNext();
  }
  return false;
}

function isNotAlreadyOpen() {
  const info = document.getElementById('information');
  if (!info) {
    return true;
  }
  const classes = new Array(info.classList);
  return !classes.some(c => c.toString().includes('open'));
}

export function clickInfo() {
  const menuItems = document.querySelectorAll('#additional-content a');
  for (let item of menuItems) {
    if (item.textContent.includes("Item Info")) {
      if (isNotAlreadyOpen()) {
        item.click();
      }
      return;
    }
  }
}
