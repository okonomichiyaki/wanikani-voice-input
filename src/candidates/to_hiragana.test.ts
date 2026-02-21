import { test, expect } from 'vitest';
import { ToHiragana } from './to_hiragana.js';

const toh = new ToHiragana();


function getCandidates(raw) {
  return toh.getCandidates(raw).map(c => c.data).sort();
}

test('choonpu with hiragana', () => {
  expect(getCandidates('えー').sort()).toStrictEqual(['えー'].sort());
});

test('choonpu with katakana', () => {
  expect(getCandidates('エー').sort()).toStrictEqual(['ええ'].sort());
});
