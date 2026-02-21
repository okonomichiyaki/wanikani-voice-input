export interface Candidate {
  type: string;
  data: string;
}

export interface WordEntry {
  type: 'word';
  id: string;
  kanji: string[];
  kana: string[];
}

export interface CharacterEntry {
  type: 'character';
  id: string;
  readings: { value: string }[];
}

export type DictionaryEntry = WordEntry | CharacterEntry;
export type Dictionary = Record<string, DictionaryEntry[]>;
