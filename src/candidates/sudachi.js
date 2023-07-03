import { toHiragana, isJapanese, isKanji } from 'wanakana';

export class Sudachi {
  constructor(window) {
    this.window = window;
    this.order = 0;
  }
  getCandidates(raw) {
    const candidates = [];
    if (isJapanese(raw) && this.window.tokenize && this.window.TokenizeMode) {
      const data = JSON.parse(this.window.tokenize(raw, this.window.TokenizeMode.C));
      const candidate = data.map(d => toHiragana(d.dictionary_form)).join('');
      candidates.push({data: candidate, type: "sudachi"});
    }
    return candidates;
  }
}
