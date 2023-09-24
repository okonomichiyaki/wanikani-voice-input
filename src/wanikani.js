// standalone functions to interact with WaniKani web app

const Selectors = {
  EntryPrompt: 'span.page-header__icon.page-header__icon',
  EntryMeaning: '#section-meaning > section:nth-child(1) > div:nth-child(1) > p',
  EntryAltMeanings: '#section-meaning > section:nth-child(1) > div:nth-child(2) > p',
  EntryKanjiReading: '.subject-readings__reading--primary .subject-readings__reading-items',
  EntryVocabReading: '.reading-with-audio__reading',
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
  if (document.location.href.match('vocabulary')) {
    return 'vocabulary';
  }
  if (document.location.href.match('kanji')) {
    return 'kanji';
  }
  if (document.location.href.match('radicals')) {
    return 'radical';
  }
  return null;
}

// returns `name` (radical only), `meaning`, or `reading`
function getType() {
  const type = document.querySelector(Selectors.Type);
  if (type) {
    return type.textContent.trim().toLowerCase();
  }
  if (document.location.href.match('#reading')) {
    return 'reading';
  }
  if (document.location.href.match('#meaning')) {
    return 'meaning';
  }
  if (document.location.href.match('vocabulary')) {
    return 'reading';
  }
  if (document.location.href.match('kanji')) {
    return 'reading';
  }
  if (document.location.href.match('radicals')) {
    return 'name';
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

// returns flashcard "front" from single entry pages
function getPromptFromEntry() {
  const el = document.querySelector(Selectors.EntryPrompt);
  if (!el) {
    return null;
  }
  let prompt = el.textContent;
  if (prompt === '') {
    return null;
  }
  return prompt;
}

// returns flashcard "front" during quizzes
export function getPrompt() {
  const el = document.querySelector(Selectors.Prompt);
  if (!el) {
    return getPromptFromEntry();
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
  // extra study: https://www.wanikani.com/subjects/extra_study?queue_type=recent_lessons
  // main review: https://www.wanikani.com/subjects/review
  // lesson intro: https://www.wanikani.com/subjects/6259/lesson?queue=6259-6260-6261-6262-6263
  // lesson quiz: https://www.wanikani.com/subjects/lesson/quiz?queue=6259-6260-6261-6262-6263
  // entry: https://www.wanikani.com/(vocabulary|radicals|kanji)/*

  let page = '';
  if (document.location.href.match('review')) {
    page = 'review';
  }
  if (document.location.href.match('lesson')) {
    page = 'lesson';
  }
  if (document.location.href.match('quiz')) {
    page = 'quiz';
  }
  if (document.location.href.match('vocabulary|radicals|kanji')) {
    page = 'entry';
  }
  const prompt = getPrompt();
  const subjects = getSubjects();
  const items = prompt && subjects ? subjects[prompt] : [];
  const category = getCategory();
  const type = getType();

  const readings = [];
  const meanings = [];
  for (const item of items) {
    if (item['readings']) {
      readings.push(...item['readings'].map(r => r.reading));
    }
    meanings.push(...item['meanings']);
    const synonyms = getUserSynonyms(item['id']);
    meanings.push(...synonyms);
  }

  return { page, prompt, category, type, meanings, readings };
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

// flashcard "backs" for a single entry page
function getEntrySubjects() {
  const prompt = getPromptFromEntry();
  const meaning = document.querySelector(Selectors.EntryMeaning);
  let reading = document.querySelector(Selectors.EntryKanjiReading);
  if (!reading) {
    reading = document.querySelector(Selectors.EntryVocabReading);
  }
  if (!prompt || !meaning || !reading) {
    return null;
  }
  const result = {};
  const subject = {};
  subject.meanings = [meaning.textContent];
  subject.readings = [{reading: reading.textContent.trim()}];
  result[meaning.textContent] = [subject];
  result[subject.readings[0]] = [subject];
  result[prompt] = [subject];

  const alts = document.querySelector(Selectors.EntryAltMeaning);
  if (alts) {
    const meanings = alts.textContent.split(',').map(t => t.trim());
    for (const m of meanings) {
      result[m] = [subject];
    }
    subject.meanings.push(...meanings);
  }

  return result;
}

// flashcard "backs" for this review session
export function getSubjects() {
  const script = document.querySelector(Selectors.Subjects);
  if (!script) {
    return getEntrySubjects();
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
