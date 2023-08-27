import { BasicDictionary } from './basic_dictionary.js';

const nums = '０１２３４５６７８９'.split('');
const chars = '0一二三四五六七八九';

export class Numerals {
  constructor(dictionary) {
    this.order = 0;
    this.basicDictionary = new BasicDictionary(dictionary);
  }

  getCandidates(raw) {
    if (!raw.match(/\d+/)) {
      return [];
    }
    let withnums = raw;
    for (let i = 0; i < nums.length; i++) {
      withnums = withnums.replaceAll(i.toString(), nums[i]);
    }
    const candidates = this.basicDictionary.getCandidates(withnums);

    let withchars = raw;
    for (let i = 0; i < chars.length; i++) {
      withchars = withchars.replaceAll(i.toString(), chars[i]);
    }
    candidates.push({data: withchars});
    for (const c of candidates) {
      c.type = 'numeral';
    }
    return candidates;
  }
}
