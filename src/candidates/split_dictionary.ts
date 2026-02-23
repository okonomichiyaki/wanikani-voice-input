import { isKana, isKanji } from 'wanakana';
import { BasicDictionary } from './basic_dictionary';
import { Candidate, Dictionary } from './types';

function takeWhile(xs: string[], f: (x: string) => boolean): string[] {
  const result: string[] = [];
  for (const x of xs) {
    if (f(x)) {
      result.push(x);
    } else {
      return result;
    }
  }
  return result;
}

function dropWhile(xs: string[], f: (x: string) => boolean): string[] {
  let i = 0;
  while (f(xs[i])) {
    i++;
  }
  return xs.slice(i, xs.length);
}

export class SplitDictionary {
  order: number;
  basicDictionary: BasicDictionary;

  constructor(dictionary: Dictionary) {
    this.order = 0;
    this.basicDictionary = new BasicDictionary(dictionary);
  }

  getCandidates(raw: string): Candidate[] {
    const candidates: Candidate[] = [];

    const chars = raw.split('');
    const kanaPre = takeWhile(chars, isKana).join('');
    const kanjiPost = dropWhile(chars, isKana).join('');
    for (const c of this.basicDictionary.getCandidates(kanjiPost)) {
      candidates.push({ type: 'split dictionary', data: kanaPre + c.data });
    }
    const kanjiPre = takeWhile(chars, isKanji).join('');
    const kanaPost = dropWhile(chars, isKanji).join('');
    for (const c of this.basicDictionary.getCandidates(kanjiPre)) {
      candidates.push({ type: 'split dictionary', data: c.data + kanaPost });
    }

    return candidates;
  }
}
