var fs = require('fs');

function addEntry(dictionary, key, entry) {
  if (!dictionary[key]) {
    dictionary[key] = [];
  }
  dictionary[key].push(entry);
}

function collectWords(filename) {
  let dictionary = {};
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
  return dictionary;
}

if (process.argv.length < 4) {
  console.log('strips out unneeded data from JMDICT file. usage: node jmdict.js <path/to/jmdict.json> <outfile>');
} else {
  const dictionary = collectWords(process.argv[2]);
  fs.writeFileSync(process.argv[3], JSON.stringify(dictionary));
}
