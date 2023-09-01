function addEntry(dictionary, key, entries) {
  if (!dictionary[key]) {
    dictionary[key] = [];
  }
  dictionary[key].push(...entries);
}

export function loadDictionary() {
  let words = JSON.parse(GM_getResourceText("jmdict"));
  let kanji = JSON.parse(GM_getResourceText("kanjidic2"));
  let dictionary = {};
  for (const [k, v] of Object.entries(words)) {
    addEntry(dictionary, k, v);
  }
  for (const [k, v] of Object.entries(kanji)) {
    addEntry(dictionary, k, v);
  }
  const entries = Object.keys(dictionary).length;
  console.log(`[wanikani-voice-input] got dictionary with ${entries} entries`);
  return dictionary;
}
