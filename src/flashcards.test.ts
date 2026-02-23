import { test, expect } from 'vitest';
import { ToHiragana } from './candidates/to_hiragana';
import { BasicDictionary } from './candidates/basic_dictionary';
import { checkAnswer } from './flashcards';
import { WKContext } from './types';
import { Dictionary } from './candidates/types';

test('do not return reading when context is for english', () => {
  const context: WKContext = {
    meanings: ['sendai'],
    readings: ['せんだい'],
    prompt: '仙台',
    category: 'vocabulary',
    type: 'meaning',
    page: 'review',
    items: [],
  };
  // extracted from jmdict:
  const dictionary: Dictionary = {
    せんだい: [
      {
        id: '1388080',
        type: 'word',
        kanji: ['先代'],
        kana: ['せんだい'],
      },
      {
        id: '2164680',
        type: 'word',
        kanji: ['仙台', '仙臺'],
        kana: ['せんだい'],
      },
    ],
  };
  const transformers = [new ToHiragana(), new BasicDictionary(dictionary)];
  const raw = 'sendai';
  const result = checkAnswer(context, transformers, raw);
  expect('success' in result && result.success).toBe(true);
  expect('answer' in result && result.answer).toBe('sendai');
});

test('levenshtein distance for punctuation', () => {
  const context: WKContext = {
    meanings: ['Cold Hearted'],
    readings: ['はくじょう'],
    prompt: '薄情',
    category: 'vocabulary',
    type: 'meaning',
    page: 'review',
    items: [],
  };
  const dictionary: Dictionary = {};
  const transformers = [new ToHiragana(), new BasicDictionary(dictionary)];
  const raw = 'cold-hearted';
  const result = checkAnswer(context, transformers, raw);
  expect('success' in result && result.success).toBe(true);
  expect('answer' in result && result.answer).toBe('Cold Hearted');
});
