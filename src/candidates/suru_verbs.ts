import { toHiragana } from 'wanakana';
import { BasicDictionary } from './basic_dictionary';
import { Candidate, Dictionary } from './types';

export class SuruVerbs {
  order: number;
  basicDictionary: BasicDictionary;

  constructor(dictionary: Dictionary) {
    this.order = 0;
    this.basicDictionary = new BasicDictionary(dictionary);
  }

  getCandidates(raw: string): Candidate[] {
    const hiragana = toHiragana(raw);
    const candidates: Candidate[] = [];
    if (hiragana.endsWith('する')) {
      const root = hiragana.substring(0, hiragana.length - 2);
      const readings = this.basicDictionary.getCandidates(root);
      for (const r of readings) {
        candidates.push({ type: 'する', data: r.data + 'する' });
      }
    }
    return candidates;
  }
}
