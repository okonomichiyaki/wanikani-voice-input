import { test, expect } from 'vitest';
import { Numerals } from './numerals';

const numerals = new Numerals();

function getCandidates(raw: string) {
  return numerals
    .getCandidates(raw)
    .map((c) => c.data)
    .sort();
}

test('convert numerals to characters', () => {
  expect(getCandidates('30代')).toStrictEqual(['三十代']);
  expect(getCandidates('20日')).toStrictEqual(['二十日']);
});

test('convert numbers to words', () => {
  expect(getCandidates('10 days')).toStrictEqual(['Ten days']);
});
