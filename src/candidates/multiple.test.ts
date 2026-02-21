import { test, expect } from 'vitest';

// extracted from jmdict:
const dictionary = {
  "南極": [
    {
      "id": "1460180",
      "type": "word",
      "kanji": [
        "南極"
      ],
      "kana": [
        "なんきょく"
      ]
    }
  ],
  "県": [
    {
      "id": "1258810",
      "type": "word",
      "kanji": [
        "県",
        "縣"
      ],
      "kana": [
        "けん"
      ]
    }
  ]
};

import { MultipleWords } from './multiple.js';

const multiple = new MultipleWords(dictionary);

function getCandidates(raw) {
  return multiple.getCandidates(raw).map(c => c.data).sort();
}

test('null returns no candidates', () => {
  expect(getCandidates(null)).toStrictEqual([]);
});

test('empty returns no candidates', () => {
  expect(getCandidates("")).toStrictEqual([]);
});

test('match two words merged to one reading', () => {
  expect(getCandidates('南極 県')).toStrictEqual(['なんきょくけん'].sort());
});
