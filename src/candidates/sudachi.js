import { toHiragana, isJapanese, isKanji } from 'wanakana';

export class Sudachi {
  constructor(dictionary) {
    this.order = 0;
  }
  getCandidates(raw) {
    const window = unsafeWindow;
    const candidates = [];
    if (window.tokenize && window.TokenizeMode) {
      const data = JSON.parse(window.tokenize("今日は良い天気なり。", window.TokenizeMode.C));
      const candidate = data.map(d => toHiragana(d.dictionary_form)).join('');
      candidates.push(candidate);
    }
    return candidates;
  }
}
