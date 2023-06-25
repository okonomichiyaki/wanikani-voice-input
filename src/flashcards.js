import * as wk from './wanikani.js';
import { clickSelector } from './util.js';
import { toHiragana, isJapanese, isKanji } from 'wanakana';
import levenshtein from 'js-levenshtein';
import { findRepeatingSubstring } from './repeating.js';

function lookup(dictionary, s) {
  const result = dictionary[s];
  if (result) {
    return result;
  }
  return [];
}

const homonyms = {
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
  '最速': 'さいそく'
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

function literalMatches(candidate, prompt) {
  const data = candidate.data;
  if (normalize(data) === normalize(prompt)) {
    return prompt;
  }
  return null;
}

function readingMatches(candidate, readings) {
  const data = candidate.data;
  for (const r of readings) {
    if (r === data || r === homonyms[data.toLowerCase()]) {
      return r;
    }
  }
  return null;
}

function normalize(s) {
  // TODO remove punctuation
  return s.toLowerCase().replaceAll(' ', '');
}

function meaningMatches(candidate, meanings) {
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

function error(message) {
  return {
    error: true,
    message: message
  };
}

function incorrect() {
  return {
    error: false,
    message: "incorrect answer",
  };
}

function success(candidate, answer) {
  return {
    success: true,
    message: "correct answer",
    candidate: candidate,
    answer: answer
  };
}

export function checkAnswer(dictionary, raw) {
  const subjects = wk.getSubjects();
  const prompt = wk.getPrompt();
  if (!prompt) {
    return error("failed to find flashcard prompt");
  }
  const items = subjects[prompt];
  if (!items || items.length < 1) {
    return error(`failed to find item: ${prompt}`);
  }

  const readings = [];
  const meanings = [];
  for (const item of items) {
    if (item['readings']) {
      readings.push(...item['readings'].map(r => r.reading));
    }
    meanings.push(...item['meanings']);
    const synonyms = wk.getUserSynonyms(item['id']);
    meanings.push(...synonyms);
  }

  let candidates = [];
  candidates.push({type: "raw", data: raw});

  if (isJapanese(raw)) {
    let hiragana = toHiragana(raw);
    if (hiragana !== raw) {
      candidates.push({"type": "hiragana", data: hiragana});
    }

    if (hiragana.endsWith('する')) {
      const entries = lookup(dictionary, hiragana.substring(0, hiragana.length - 2));
      const rs = getReadings(entries).map(r => r + 'する');
      for (let r of rs) {
        candidates.push({type: "する", data: r});
      }
    } else {
      const entries = lookup(dictionary, hiragana);
      const rs = getReadings(entries);
      for (let r of rs) {
        candidates.push({type: "dictionary", data: r});
      }
    }

    const substr = findRepeatingSubstring(hiragana);
    if (substr) {
      candidates.push({type: "repeating", data: substr});
    }
  }

  let result = incorrect();
  for (const candidate of candidates) {
    const meaningMatch = meaningMatches(candidate, meanings);
    const readingMatch = readingMatches(candidate, readings);
    const literal = literalMatches(candidate, prompt);

    if (readingMatch) {
      result = success(candidate, readingMatch);
    } else if (meaningMatch) {
      result = success(candidate, meaningMatch);
    } else if (literal && readings.length > 0) {
      result = success(candidate, readings[0]); // TODO indicate literal match?
    }
  }

  result.candidates = candidates;
  result.meanings = meanings;
  result.readings = readings;
  return result;
}
