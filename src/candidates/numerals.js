import kansuji from 'kansuji';
import { ToWords } from 'to-words';

export class Numerals {
  constructor() {
    this.order = 0;
  }

  getCandidates(raw) {
    const match = raw.match(/\d+/);
    if (!match) {
      return [];
    }
    const candidates = [];
    const type = 'numeral';
    const part = match[0];

    if (part === raw) {
      const toWords = new ToWords();
      let data = toWords.convert(raw);
      candidates.push({data, type});
    }

    const converted = kansuji(part);
    let data = raw.replace(part, converted);
    candidates.push({data, type});
    return candidates;
  }
}
