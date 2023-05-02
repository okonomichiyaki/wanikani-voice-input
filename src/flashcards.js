import * as wk from './wanikani.js';
import { clickSelector } from './util.js';
import { raw } from './dict.js';
import { toHiragana, isJapanese, isKanji } from 'wanakana';

function lookup(s) {
  const result = raw[s];
  if (result) {
    return result;
  }
  return [];
}

const homonyms = {
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

  '3': 'さん',
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
  '借りに': 'かりに'
};

function getReadings(entries) {
  return entries.flatMap(entry => {
    if (entry.type === 'word') {
      return entry['kana'].map(toHiragana);
    }
    if (entry.type === 'character') {
      return entry.readings.map(r => {
        let value = r.value;
        if (value.includes('.')) {
          value = value.split('.')[0];
        }
        return toHiragana(value);
      });
    }
    return [];
  });
}

function readingMatches(transcript, normalized, prompt, readings) {
  return transcript === prompt || normalized === prompt || readings.some(r => r === normalized || r === homonyms[normalized]);
}

function normalize(s) {
  return s.toLowerCase().replaceAll(' ', '');
}

function meaningMatches(normalized, meanings) {
  return meanings.some(m => { return normalize(m) === normalize(normalized); });
}

export function checkAnswer(recognition, raw, final) {
  const subjects = wk.getSubjects();
  const prompt = wk.getPrompt();
  if (!prompt) {
    console.log("[wanikani-voice-input] failed to find prompts");
    return undefined;
  }
  const items = subjects[prompt];
  if (!items || items.length < 1) {
    console.log(`[wanikani-voice-input] failed to find item: ${prompt}`);
    return undefined;
  }

  const readings = [];
  const meanings = [];
  for (const item of items) {
    readings.push(...item['readings'].map(r => r.reading));
    meanings.push(...item['meanings']);
    const synonyms = wk.getUserSynonyms(item['id']);
    meanings.push(...synonyms);
  }

  let candidates = [];
  let transcript = raw;
  if (isJapanese(raw)) {
    transcript = toHiragana(raw);
    transcript = normalize(transcript);
    if (transcript.endsWith('する')) {
      const entries = lookup(transcript.substring(0, transcript.length - 2));
      candidates = getReadings(entries).map(r => r + 'する');
    } else {
      const entries = lookup(transcript);
      candidates = getReadings(entries);
    }
  }
  if (candidates.length === 0) {
    candidates.push(transcript);
  }
  for (const candidate of candidates) {
    const meaningMatch = meaningMatches(candidate, meanings);
    const readingMatch = readingMatches(transcript, candidate, prompt, readings);

    console.log("[wanikani-voice-input]", { prompt, transcript, final, candidate, meaningMatch, readingMatch, meanings, readings });

    if (readingMatch) {
      return readings[0];
    }
    if (meaningMatch) {
      return meanings[0];
    }
  }

  return undefined;
}
