import { Numerals } from './numerals.js';

const numerals = new Numerals();

function getCandidates(raw) {
  return numerals.getCandidates(raw).map(c => c.data).sort();
}

test('convert numerals to characters', () => {
  expect(getCandidates('30代')).toStrictEqual(['三十代']);
  expect(getCandidates('20日')).toStrictEqual(['二十日']);
});
