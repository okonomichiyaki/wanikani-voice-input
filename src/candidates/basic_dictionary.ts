import { toHiragana, isJapanese } from 'wanakana';
import { Candidate, Dictionary, DictionaryEntry } from './types';

// TODO: create dictionary class and move this there
function lookup(dictionary: Dictionary, s: string): DictionaryEntry[] {
  const result = dictionary[s];
  if (result) {
    return result;
  }
  return [];
}

function getReadings(entries: DictionaryEntry[]): string[] {
  return entries.flatMap(entry => {
    if (entry.type === 'word') {
      return entry['kana'].map(k => toHiragana(k));
    }
    if (entry.type === 'character') {
      return entry.readings.map(r => {
        let value = r.value;
        if (value.includes('.')) {
          value = value.split('.')[0];
        }
        return toHiragana(value);
      });
    }
    return [];
  });
}

export class BasicDictionary {
  order: number;
  dictionary: Dictionary;

  constructor(dictionary: Dictionary) {
    this.order = 0;
    this.dictionary = dictionary;
  }

  getCandidates(raw: string): Candidate[] {
    if (!isJapanese(raw)) {
      return [];
    }
    const candidates: Candidate[] = [];
    const hiragana = toHiragana(raw);
    const entries = lookup(this.dictionary, hiragana);
    const rs = getReadings(entries);
    for (let r of rs) {
      candidates.push({type: "dictionary", data: r});
    }
    return candidates;
  }
}
