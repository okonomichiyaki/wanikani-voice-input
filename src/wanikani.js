// standalone functions to interact with WaniKani web app

const Selectors = {
  Category: 'span.quiz-input__question-category',
  Type: 'span.quiz-input__question-type',
  Prompt: 'div.character-header__characters',
  LessonMeaning: 'div.character-header__meaning',
  Synonyms: '#quiz-user-synonyms script',
  Subjects: '#quiz-queue > script[data-quiz-queue-target="subjects"]',
  Next: 'div.quiz-input__input-container button',
};

function getOtherMeanings() {
  const sections = document.querySelectorAll('section.subject-section');
  for (const section of sections) {
    const title = section.querySelector('span.subject-section__title-text');
    const content = section.querySelector('section.subject-section__content');
    if (title && title.textContent === 'Other Meanings') {
      return content.textContent;
    }
  }
  return [];
}

export function checkDom() {
  for (const selector of Object.keys(Selectors)) {
    const el = document.querySelector(Selectors[selector]);
    if (!el) {
      console.error(`[wanikani-voice-input] failed to find ${selector}: ${Selectors[selector]}`);
    }
  }
}

// returns `radical`, `kanji`, or `vocabulary`
function getCategory() {
  const category = document.querySelector(Selectors.Category);
  if (category) {
    return category.textContent.trim().toLowerCase();
  }
  return null;
}

// returns `name` (radical only), `meaning`, or `reading`
function getType() {
  const type = document.querySelector(Selectors.Type);
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
  const el = document.querySelector(Selectors.Prompt);
  if (!el) {
    return null;
  }
  let prompt = el.textContent; // kanji, vocab
  if (prompt === '' && el.childNodes.length > 0 && el.childNodes[0].getAttribute('aria-label')) {
    prompt = el.childNodes[0].getAttribute('aria-label').toLowerCase(); // radical
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
  const script = document.querySelector(Selectors.Synonyms);
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
  const script = document.querySelector(Selectors.Subjects);
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
  const button = document.querySelector(Selectors.Next);
  if (button) {
    button.click();
    return true;
  }
  return false;
}

export function markWrong() {
  const lang = getLanguage();
  const incorrect = lang === "en-US" ? "aaa" : "あああ";
  submitAnswer(incorrect);
}

export function inputAnswer(input) {
  const userResponse = document.querySelector('#user-response');
  if (userResponse) {
    userResponse.value = input;
  }
}

export function submitAnswer(input) {
  inputAnswer(input);
  return clickNext();
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

/* inspects event from `didAnswerQuestion` and returns true if question passed */
export function didAnswerCorrectly(e) {
  if (typeof e.detail !== 'object' || typeof e.detail.results !== 'object') {
    console.error('[wanikani-voice-input] didAnswerCorrectly got unexpected event, WaniKani code change?', e);
    return false;
  }
  const results = e.detail.results;
  const detail = e.detail;
  if (typeof results.action !== 'string') {
    console.error('[wanikani-voice-input] didAnswerCorrectly got unexpected event, WaniKani code change?', e);
    return false;
  }
  return results.action === 'pass';
}
