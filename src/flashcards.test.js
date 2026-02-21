import { test, expect } from 'vitest';
import { ToHiragana } from './candidates/to_hiragana.js';
import { BasicDictionary } from './candidates/basic_dictionary.js';
import { checkAnswer } from './flashcards.js';

test('do not return reading when context is for english', () => {
  const context = {
    meanings: ['sendai'],
    readings: ['せんだい'],
    prompt: '仙台',
    category: 'vocabulary',
    type: 'meaning'
  };
  // extracted from jmdict:
  const dictionary = {
    "せんだい": [
      {
        "id": "1388080",
        "type": "word",
        "kanji": [
          "先代"
        ],
        "kana": [
          "せんだい"
        ]
      },
      {
        "id": "2164680",
        "type": "word",
        "kanji": [
          "仙台",
          "仙臺"
        ],
        "kana": [
          "せんだい"
        ]
      }
    ]
  };
  const transformers = [
    new ToHiragana(),
    new BasicDictionary(dictionary),
  ];
  const raw = 'sendai';
  const result = checkAnswer(context, transformers, raw);
  expect(result.success).toBe(true);
  expect(result.answer).toBe('sendai');
});


test('levenshtein distance for punctuation', () => {
  const context = {
    meanings: ['Cold Hearted'],
    readings: ['はくじょう'],
    prompt: '薄情',
    category: 'vocabulary',
    type: 'meaning'
  };
  const dictionary = {};
  const transformers = [
    new ToHiragana(),
    new BasicDictionary(dictionary),
  ];
  const raw = 'cold-hearted';
  const result = checkAnswer(context, transformers, raw);
  expect(result.success).toBe(true);
  expect(result.answer).toBe('Cold Hearted');
});
