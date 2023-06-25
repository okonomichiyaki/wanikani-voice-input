
const JMDICT_URL = "https://raw.githubusercontent.com/okonomichiyaki/wanikani-voice-input/main/data/jmdict.json";
const KANJIDIC2_URL = "https://raw.githubusercontent.com/okonomichiyaki/wanikani-voice-input/main/data/kanjidic2.json";

function addEntry(dictionary, key, entry) {
  if (!dictionary[key]) {
    dictionary[key] = [];
  }
  dictionary[key].push(entry);
}

async function loadJson(url) {
  const response = await fetch(url);
  return response.json();
}

export async function loadDictionary() {
  let words = await loadJson(JMDICT_URL);
  let kanji = await loadJson(KANJIDIC2_URL);
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
