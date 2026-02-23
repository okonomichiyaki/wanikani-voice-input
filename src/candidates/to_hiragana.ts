import { toHiragana, isJapanese } from 'wanakana';
import { Candidate } from './types';

export class ToHiragana {
  order: number;

  constructor(_dictionary?: unknown) {
    this.order = 0;
  }

  getCandidates(raw: string): Candidate[] {
    const candidates: Candidate[] = [];
    if (isJapanese(raw)) {
      const hiragana = toHiragana(raw, { convertLongVowelMark: true });
      candidates.push({ type: 'hiragana', data: hiragana });
    }
    return candidates;
  }
}
