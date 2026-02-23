import { test, expect } from 'vitest';
import { FuzzyVowels } from './fuzzy_vowels';

const fuzzy = new FuzzyVowels();

function getCandidates(raw: string) {
  return fuzzy
    .getCandidates(raw)
    .map((c) => c.data)
    .sort();
}

test('generate long vowel candidates', () => {
  expect(getCandidates('しょ')).toStrictEqual(['しいょ', 'しょう', 'しょお'].sort());
});

test('generate long vowel candidates with tenten', () => {
  expect(getCandidates('で')).toStrictEqual(['でい', 'でえ'].sort());
});

test('generate short vowel candidates', () => {
  expect(getCandidates('しょう')).toStrictEqual(['しいょう', 'しょ'].sort());
});

test('handle kanji', () => {
  expect(getCandidates('しょ軍')).toStrictEqual(['しいょ軍', 'しょう軍', 'しょお軍'].sort());
});
