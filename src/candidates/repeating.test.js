import { findRepeatingSubstring } from './repeating.js';

test('find repeating substring of length 2 x 1', () => {
  expect(findRepeatingSubstring('aa')).toBe('a');
});

test('find repeating substring of length 3 x 2', () => {
  expect(findRepeatingSubstring('ababab')).toBe('ab');
});

test('find repeating substring singleton', () => {
  expect(findRepeatingSubstring('ababa')).toBe(null);
});
