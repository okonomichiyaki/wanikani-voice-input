import kansuji from 'kansuji';

export class Numerals {
  constructor() {
    this.order = 0;
  }

  getCandidates(raw) {
    const match = raw.match(/\d+/);
    if (!match) {
      return [];
    }
    const part = match[0];
    const converted = kansuji(part);
    const data = raw.replace(part, converted);
    const type = 'numeral';
    return [{data, type}];
  }
}
