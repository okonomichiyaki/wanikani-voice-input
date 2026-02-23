import { isJapanese } from 'wanakana';
import { Candidate } from './types';

export class ConvertWo {
  order: number;

  constructor(_dictionary?: unknown) {
    this.order = 1;
  }

  getCandidates(raw: string): Candidate[] {
    const candidates: Candidate[] = [];
    if (isJapanese(raw) && raw.indexOf('を') >= 0) {
      const chars = raw.split('');
      const data = chars.map((c) => (c === 'を' ? 'お' : c)).join('');
      candidates.push({ type: 'convert wo', data });
    }
    return candidates;
  }
}
