import * as wk from './wanikani';
import { clickSelector } from './util';
import { toHiragana, isJapanese, isKanji } from 'wanakana';
import levenshtein from 'js-levenshtein';
import { Candidate } from './candidates/types';
import { WKContext, CheckResult } from './types';

interface Transformer {
  order: number;
  getCandidates(raw: string): Candidate[];
}

const homonyms: Record<string, string> = {
  'b': 'び',
  'ezone': 'いぞん',
  'gt': 'じき',
  'g': 'じ',
  'ec2': 'いしつ',
  'ec 2': 'いしつ',
  'ec': 'いし',
  'agar': 'あがる',
  'ol': 'おえる',
  'ob': 'おび',
  'k': 'けい',
  'c': 'し',
  'cd': 'しり',
  'ck': 'しけい',
  'y': 'わい',
  'uber': 'うば',
  'hulu': 'ふる',
  'canyou': 'かんゆう',
  'LINE': 'らい',

  '2': 'つ',
  '3': 'さん',
  '5': 'ご',
  '9': 'きゅう',
  '10': 'じゅ',
  'x': 'じゅ',
  '1000': 'せん',

  'ワーく': 'わく',
  '西国': 'さいこく',
  '帰って': 'かえって',
  'を呼ぶ': 'およぶ',
  '掌蹠': 'しょうせき',
  '件名': 'けんめい',
  '加藤': 'かとう',
  '貨物線': 'かもつせん',
  '短足': 'たんそく',
  '5回': 'ごかい',
  'けえき': 'けいき',
  '覗いて': 'のぞいて',
  '廃病': 'はいびょう',
  '正観': 'せいかん',
  '借りに': 'かりに',
  '全開': 'ぜんかい',
  '九大': 'きゅうだい',
  '最速': 'さいそく',
  '龍騎': 'りゅうき',
  '流星': 'りゅうせい',
  '京丹': 'きょうたん',
  '広陵': 'こうりょう',
  '招かれる': 'まねかれる',
  '県境': 'けんきょう',
  '胆汁': 'たんじゅう',
  '県名': 'けんめい',
  '長江': 'ちょうこう',
  '性感': 'せいかん'
};

function literalMatches(candidate: Candidate, prompt: string | null): string | null {
  if (!isJapanese(candidate.data)) {
    return null;
  }
  const data = candidate.data;
  if (prompt && normalize(data) === normalize(prompt)) {
    return prompt;
  }
  return null;
}

function readingMatches(candidate: Candidate, readings: string[]): string | null {
  const data = candidate.data;
  for (const r of readings) {
    if (r === data || r === homonyms[data.toLowerCase()]) {
      return r;
    }
  }
  return null;
}

function normalize(s: string): string {
  // TODO remove punctuation? currently relying on levenshtein for that
  const n = s.toLowerCase().replaceAll(' ', '');
  if (isJapanese(n)) {
    return toHiragana(n);
  }
  return n;
}

function meaningMatches(candidate: Candidate, meanings: string[]): string | null {
  const data = candidate.data;
  for (const m of meanings) {
    if (normalize(m) === normalize(data)) {
      return m;
    }
    if (levenshtein(normalize(m), normalize(data)) < 2) {
      return m;
    }
  }
  return null;
}

function error(message: string): CheckResult {
  return {
    error: true,
    message: message
  };
}

function incorrect(context: WKContext, candidates: Candidate[]): CheckResult {
  return {
    success: false,
    error: false,
    message: "incorrect answer",
    meanings: context.meanings,
    readings: context.readings,
    candidates
  };
}

function success(context: WKContext, candidates: Candidate[], candidate: Candidate, answer: string): CheckResult {
  return {
    success: true,
    message: "correct answer",
    candidate,
    answer,
    meanings: context.meanings,
    readings: context.readings,
    candidates
  };
}

function groupBy<T>(xs: T[], k: keyof T): Record<string, T[]> {
  return xs.reduce(function(rv: Record<string, T[]>, x: T) {
    const key = String(x[k]);
    (rv[key] = rv[key] || []).push(x);
    return rv;
  }, {});
}

export function checkAnswer(context: WKContext, transformers: Transformer[], raw: string): CheckResult {
  const { meanings, readings, prompt } = context;

  let candidates: Candidate[] = [];
  candidates.push({type: "raw", data: raw});

  const byOrder = groupBy(transformers, 'order');
  const keys = Object.keys(byOrder).map(k => parseInt(k)).sort();

  // generate candidates from transformers, in order
  // output from transformers at one level are additional inputs for later levels
  for (const key of keys) {
    const ts = byOrder[key];
    const newCandidates: Candidate[] = [];
    for (const t of ts) {
      for (const c of candidates) {
        newCandidates.push(...t.getCandidates(c.data));
      }
    }
    candidates.push(...newCandidates);
  }

  for (const candidate of candidates) {
    const meaningMatch = meaningMatches(candidate, meanings);
    const readingMatch = readingMatches(candidate, readings);
    const literal = literalMatches(candidate, prompt);

    if (readingMatch && context.type === 'reading') {
      return success(context, candidates, candidate, readingMatch);
    } else if (meaningMatch && (context.type === 'name' || context.type === 'meaning')) {
      return success(context, candidates, candidate, meaningMatch);
    } else if (literal && readings.length > 0) {
      return success(context, candidates, candidate, readings[0]); // TODO indicate literal match?
    }
  }

  return incorrect(context, candidates);
}
