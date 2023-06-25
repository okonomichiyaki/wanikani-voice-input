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

function collectCharacters(filename) {
  let dictionary = {};
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
  return dictionary;
}

if (process.argv.length < 4) {
  console.log('strips out unneeded data from KANJIDIC2 file. usage: node kanjidic2.js <path/to/kanjidic2.json> <outfile>');
} else {
  const dictionary = collectCharacters(process.argv[2]);
  fs.writeFileSync(process.argv[3], JSON.stringify(dictionary));
}
