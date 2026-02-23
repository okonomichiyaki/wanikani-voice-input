import { Dictionary, DictionaryEntry } from './candidates/types';

function addEntry(dictionary: Dictionary, key: string, entries: DictionaryEntry[]): void {
  if (!dictionary[key]) {
    dictionary[key] = [];
  }
  dictionary[key].push(...entries);
}

export function loadDictionary(): Dictionary {
  const words = JSON.parse(GM_getResourceText('jmdict')) as Record<string, DictionaryEntry[]>;
  const kanji = JSON.parse(GM_getResourceText('kanjidic2')) as Record<string, DictionaryEntry[]>;
  const dictionary: Dictionary = {};
  for (const [k, v] of Object.entries(words)) {
    addEntry(dictionary, k, v);
  }
  for (const [k, v] of Object.entries(kanji)) {
    addEntry(dictionary, k, v);
  }
  return dictionary;
}
