import { test, expect } from 'vitest';
import { ConvertWo } from './convert_wo';

const cw = new ConvertWo();


function getCandidates(raw: string) {
  return cw.getCandidates(raw).map(c => c.data);
}

test('particle wo present', () => {
  expect(getCandidates('みさを')).toStrictEqual(['みさお']);
});

test('particle wo absent', () => {
  expect(getCandidates('みさお').sort()).toStrictEqual([]);
});
