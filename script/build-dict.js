/**
 * strips out unneeded data from JMDICT and KANJIDIC2 files
 * combines both datasets into a single hash keyed on Character/Word
 */

var fs = require('fs');

function readingType(s) {
  if (s === 'ja_on') {
    return 'on';
  }
  if (s === 'ja_kun') {
    return 'kun';
  }
  return s;
}

function addEntry(dictionary, key, entry) {
  if (!dictionary[key]) {
    dictionary[key] = [];
  }
  dictionary[key].push(entry);
}

function collectWords(filename, dictionary) {
  let data = fs.readFileSync(filename, {encoding: 'utf8'});
  let words = JSON.parse(data)['words'];
  for (const word of words) {
    const kana = word['kana'].map(k => k['text']);
    const entry = {
      id: word['id'],
      type: 'word',
      kanji: word['kanji'].map(k => k['text']),
      kana: kana
    };
    for (const k of word['kanji']) {
      const text = k['text'];
      addEntry(dictionary, text, entry);
    }
    for (const k of kana) {
      addEntry(dictionary, k, entry);
    }
  }
}

function collectCharacters(filename, dictionary) {
  let data = fs.readFileSync(filename, {encoding: 'utf8'});
  let characters = JSON.parse(data)['characters'];

  for (const character of characters) {
    const readings = character['readingMeaning']['groups'].flatMap(g => {
      return g['readings'].filter(r => r['type'].includes('ja')).map(r => {
        return {type: readingType(r['type']), value: r['value']};
      });
    });
    const entry = {
      literal: character['literal'],
      type: 'character',
      readings: readings
    };

    const text = character['literal'];
    addEntry(dictionary, text, entry);

    for (const reading of readings) {
      addEntry(dictionary, reading, entry);
    }
  }
}

if (process.argv.length < 5) {
  console.log('usage: node build-dict.js <path/to/jmdict.json> <path/to/kanjidic2.json> <outfile>');
} else {
  const dictionary = {};
  collectWords(process.argv[2], dictionary);
  collectCharacters(process.argv[3], dictionary);
  fs.writeFileSync(process.argv[4], JSON.stringify(dictionary));
}
