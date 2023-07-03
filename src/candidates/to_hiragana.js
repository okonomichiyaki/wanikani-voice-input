import { toHiragana, isJapanese } from 'wanakana';

export class ToHiragana {
  constructor(dictionary) {
    this.order = 0;
  }

  getCandidates(raw) {
    const candidates = [];
    if (isJapanese(raw)) {
      const hiragana = toHiragana(raw);
      candidates.push({"type": "hiragana", data: hiragana});
    }
    return candidates;
  }
}
