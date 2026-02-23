import { isKana } from 'wanakana';
import { WKContext, WKOFItem, WKOFItemMeaning, WKOFItemReading, WKOFData, WKOF } from './types';

// standalone functions to interact with WaniKani web app

const Selectors: Record<string, string> = {
  EntryPrompt: 'span.page-header__icon.page-header__icon',
  Category: 'span.quiz-input__question-category',
  Type: 'span.quiz-input__question-type',
  Prompt: 'div.character-header__characters',
  Synonyms: '#quiz-user-synonyms script',
  Next: 'div.quiz-input__input-container button',
};

export function checkDom(): void {
  for (const selector of Object.keys(Selectors)) {
    const el = document.querySelector(Selectors[selector]);
    if (!el) {
      console.error(`[wanikani-voice-input] failed to find ${selector}: ${Selectors[selector]}`);
    }
  }
}

// returns `radical`, `kanji`, or `vocabulary`
function getCategory(): string | null {
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
function getType(): string | null {
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

export function getLanguage(): string {
  const t = getType();
  if (t === 'meaning' || t === 'name') {
    return 'en-US';
  }
  if (t === 'reading') {
    return 'ja-JP';
  }
  return 'en-US';
}

// returns flashcard "front" from single entry pages
function getPromptFromEntry(): string | null {
  const el = document.querySelector(Selectors.EntryPrompt);
  if (!el) {
    return null;
  }
  const prompt = el.textContent;
  if (prompt === '') {
    return null;
  }
  return prompt;
}

// returns flashcard "front" during quizzes
export function getPrompt(): string | null {
  const el = document.querySelector(Selectors.Prompt);
  if (!el) {
    return getPromptFromEntry();
  }
  let prompt = el.textContent; // kanji, vocab
  if (prompt === '' && el.childNodes.length > 0 && (el.childNodes[0] as Element).getAttribute('aria-label')) {
    prompt = (el.childNodes[0] as Element).getAttribute('aria-label')!.toLowerCase(); // radical
  }
  if (prompt === '') {
    return null;
  }
  return prompt;
}

function getMeaningsFromItems(items: WKOFItem[]): string[] {
  const meanings: WKOFItemMeaning[] = [];
  for (const item of items) {
    if (item && item.data && item.data.meanings) {
      meanings.push(...item.data.meanings.filter((m) => m.accepted_answer));
    }
    if (item && item.data && item.data.auxiliary_meanings) {
      meanings.push(...item.data.auxiliary_meanings.filter((m) => m.accepted_answer));
    }
  }
  return meanings.map((m) => m.meaning);
}

function getReadingsFromItems(items: WKOFItem[]): string[] {
  const readings: WKOFItemReading[] = [];
  for (const item of items) {
    if (item && item.data && item.data.readings) {
      readings.push(...item.data.readings.filter((r) => r.accepted_answer));
    }
  }
  return readings.map((r) => r.reading);
}

// flashcard "backs" for this card
function getItems(allItems: WKOFData, category: string | null, slug: string | null): WKOFItem[] {
  const items: WKOFItem[] = [];
  if (unsafeWindow.wkof) {
    const wkof: WKOF = unsafeWindow.wkof;
    const type_index = wkof.ItemData.get_index(allItems, 'item_type');
    const index = type_index[category as string];
    if (index) {
      items.push(...index.filter((i) => i.data.slug === slug || i.data.characters === slug));
    }
  }
  return items;
}

// returns unique flashcard context: prompt + category + type
export function getContext(allItems: WKOFData): WKContext | null {
  // extra study: https://www.wanikani.com/subjects/extra_study?queue_type=recent_lessons
  // main review: https://www.wanikani.com/subjects/review
  // lesson intro: https://www.wanikani.com/subjects/6259/lesson?queue=6259-6260-6261-6262-6263
  // lesson quiz: https://www.wanikani.com/subjects/lesson/quiz?queue=6259-6260-6261-6262-6263
  // entry: https://www.wanikani.com/(vocabulary|radicals|kanji)/*

  let page: string | null = null;
  if (document.location.href.match('review')) {
    page = 'review';
  }
  if (document.location.href.match('lesson')) {
    page = 'lesson';
  }
  if (document.location.href.match('quiz')) {
    page = 'quiz';
  }
  if (document.location.href.match('recent-mistakes')) {
    page = 'quiz';
  }
  if (document.location.href.match('extra_study')) {
    page = 'quiz';
  }
  if (document.location.href.match('vocabulary|radicals|kanji')) {
    page = 'entry';
  }
  if (!page) {
    return null;
  }
  const prompt = getPrompt();
  let category = getCategory();
  if (category === 'vocabulary' && prompt && isKana(prompt)) {
    category = 'kana_vocabulary';
  }
  const type = getType();
  const items = getItems(allItems, category, prompt);
  const readings = getReadingsFromItems(items);
  const meanings = getMeaningsFromItems(items);
  for (const item of items) {
    const synonyms = getUserSynonyms(item['id']);
    meanings.push(...synonyms);
  }
  return { page, prompt, category, type, meanings, readings, items };
}

export function didContextChange(oldContext: WKContext | null, newContext: WKContext | null): boolean {
  const newPrompt = newContext && newContext.prompt;
  const oldPrompt = oldContext && oldContext.prompt;
  const newType = newContext && newContext.type;
  const oldType = oldContext && oldContext.type;
  return newPrompt !== oldPrompt || newType !== oldType;
}

// looks up user synonym by (wanikani subject) id
export function getUserSynonyms(id: number): string[] {
  const script = document.querySelector(Selectors.Synonyms);
  if (script) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: Record<string, string[]> = JSON.parse(script.textContent);
    if (data[id]) {
      return data[id];
    }
  }
  return [];
}

export function clickNext(): boolean {
  const button = document.querySelector<HTMLElement>(Selectors.Next);
  if (button) {
    button.click();
    return true;
  }
  return false;
}

export function markWrong(): void {
  const lang = getLanguage();
  const incorrect = lang === 'en-US' ? 'aaa' : 'あああ';
  submitAnswer(incorrect);
}

export function inputAnswer(input: string): void {
  const userResponse = document.querySelector('#user-response');
  if (userResponse) {
    userResponse.value = input;
  }
}

export function submitAnswer(input: string): boolean {
  inputAnswer(input);
  return clickNext();
}

function isNotAlreadyOpen(): boolean {
  const info = document.getElementById('information');
  if (!info) {
    return true;
  }
  const classes = new Array(info.classList);
  return !classes.some((c) => c.toString().includes('open'));
}

export function clickInfo(): void {
  const menuItems = document.querySelectorAll('#additional-content a');
  for (const item of menuItems) {
    if (item.textContent.includes('Item Info')) {
      if (isNotAlreadyOpen()) {
        (item as HTMLElement).click();
      }
      return;
    }
  }
}

/* inspects event from `didAnswerQuestion` and returns true if question passed */
export function didAnswerCorrectly(e: Event): boolean {
  const detail: unknown = (e as CustomEvent).detail;
  if (
    typeof detail !== 'object' ||
    detail === null ||
    !('results' in detail) ||
    typeof (detail as Record<string, unknown>).results !== 'object'
  ) {
    console.error('[wanikani-voice-input] didAnswerCorrectly got unexpected event, WaniKani code change?', e);
    return false;
  }
  const results = (detail as { results: Record<string, unknown> }).results;
  if (typeof results.action !== 'string') {
    console.error('[wanikani-voice-input] didAnswerCorrectly got unexpected event, WaniKani code change?', e);
    return false;
  }
  return results.action === 'pass';
}
