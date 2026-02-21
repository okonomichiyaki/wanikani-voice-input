declare module 'wanakana' {
  export function toHiragana(input: string, options?: { convertLongVowelMark?: boolean }): string;
  export function isJapanese(input: string): boolean;
  export function isKana(input: string): boolean;
  export function isKanji(input: string): boolean;
}
