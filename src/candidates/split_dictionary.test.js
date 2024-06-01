import { SplitDictionary } from './split_dictionary.js';

const dictionary = {
  "僕": [
    {
      "id": "999",
      "type": "word",
      "kanji": [
        "僕"
     ],
      "kana": [
        "ぼく"
      ]
    }
  ]
};

test('split kanji followed by kana', () => {
  const sd = new SplitDictionary(dictionary);
  expect(sd.getCandidates('僕や').map(c => c.data)).toStrictEqual(['ぼくや']);
});
