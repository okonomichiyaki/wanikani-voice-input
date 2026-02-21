import { Dictionary, DictionaryEntry } from './candidates/types';

function addEntry(dictionary: Dictionary, key: string, entries: DictionaryEntry[]): void {
  if (!dictionary[key]) {
    dictionary[key] = [];
  }
  dictionary[key].push(...entries);
}

export function loadDictionary(): Dictionary {
  let words: Record<string, DictionaryEntry[]> = JSON.parse(GM_getResourceText("jmdict"));
  let kanji: Record<string, DictionaryEntry[]> = JSON.parse(GM_getResourceText("kanjidic2"));
  let dictionary: Dictionary = {};
  for (const [k, v] of Object.entries(words)) {
    addEntry(dictionary, k, v);
  }
  for (const [k, v] of Object.entries(kanji)) {
    addEntry(dictionary, k, v);
  }
  return dictionary;
}
