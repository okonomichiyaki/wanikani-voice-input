import { Candidate } from './types';

export function findRepeatingSubstring(s: string): string | null {
  let len = s.length;
  for (let i = Math.floor(len / 2); i > 0; i--) {
    if (len % i === 0) {
      let match = true;
      let sub = s.slice(0, i);
      for (let j = i; j < len; j += i) {
        if (s.slice(j, j + i) !== sub) {
          match = false;
          break;
        }
      }
      if (match) return sub;
    }
  }
  return null;
}

export class RepeatingSubstring {
  order: number;

  constructor() {
    this.order = 1;
  }
  getCandidates(raw: string): Candidate[] {
    const candidates: Candidate[] = [];
    const substr = findRepeatingSubstring(raw);
    if (substr) {
      candidates.push({type: "repeating", data: substr});
    }
    return candidates;
  }
}
