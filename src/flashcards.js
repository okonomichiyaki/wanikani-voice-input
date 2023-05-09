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
  'c': 'し',
  'ck': 'しけい',
  'y': 'わい',

  '2': 'つ',
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
  return transcript === prompt || normalized === prompt || readings.some(r => r === normalized || r === homonyms[normalized.toLowerCase()]);
}

function normalize(s) {
  return s.toLowerCase().replaceAll(' ', '');
}

function meaningMatches(normalized, meanings) {
  return meanings.some(m => { return normalize(m) === normalize(normalized); });
}

function findRepeatingSubstring(s) {
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

  let transcript = normalize(raw);
  let candidates = [];
  if (isJapanese(raw)) {
    transcript = toHiragana(raw);
    console.log(`[wanikani-voice-input] toHiragana candidate=${transcript} `);
    candidates.push(transcript);
    if (transcript.endsWith('する')) {
      const entries = lookup(transcript.substring(0, transcript.length - 2));
      const rs = getReadings(entries).map(r => r + 'する');
      for (let r of rs) {
        console.log(`[wanikani-voice-input] する candidate=${r} `);
      }
      candidates.push(...rs);
    } else {
      const entries = lookup(transcript);
      const rs = getReadings(entries);
      for (let r of rs) {
        console.log(`[wanikani-voice-input] lookup candidate=${r} `);
      }
      candidates.push(...rs);
    }

    const substr = findRepeatingSubstring(transcript);
    if (substr) {
      candidates.push(substr);
      console.log(`[wanikani-voice-input] repeating candidate=${substr} `);
    }
  } else {
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
