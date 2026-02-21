import kansuji from 'kansuji';
import { ToWords } from 'to-words';
import { isJapanese } from 'wanakana';
import { Candidate } from './types';

function anyJapanese(s: string): boolean {
  return s.split('').some(c => isJapanese(c));
}

export class Numerals {
  order: number;

  constructor() {
    this.order = 0;
  }

  getCandidates(raw: string): Candidate[] {
    const match = raw.match(/\d+/);
    if (!match) {
      return [];
    }
    const candidates: Candidate[] = [];
    const type = 'numeral';
    const part = match[0];

    if (!anyJapanese(raw)) {
      const toWords = new ToWords();
      let converted = toWords.convert(Number(part));
      let data = raw.replace(part, converted);
      candidates.push({data, type});
    }

    if (raw === part || anyJapanese(raw)) {
      let converted = kansuji(part);
      let data = raw.replace(part, converted);
      candidates.push({data, type});
    }

    return candidates;
  }
}
