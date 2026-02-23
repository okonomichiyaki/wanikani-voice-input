import { Candidate } from './candidates/types';

export interface WKOFItemMeaning {
  meaning: string;
  accepted_answer: boolean;
}

export interface WKOFItemReading {
  reading: string;
  accepted_answer: boolean;
}

export interface WKOFItemData {
  slug: string;
  characters: string;
  meanings?: WKOFItemMeaning[];
  auxiliary_meanings?: WKOFItemMeaning[];
  readings?: WKOFItemReading[];
}

export interface WKOFItem {
  id: number;
  data: WKOFItemData;
}

export type WKOFData = WKOFItem[];

export interface WKContext {
  page: string;
  prompt: string | null;
  category: string | null;
  type: string | null;
  meanings: string[];
  readings: string[];
  items: WKOFItem[];
}

export interface Settings {
  lightning: boolean;
  lightning_delay: number;
  mistake_delay?: number;
  transcript: boolean;
  transcript_background: string;
  transcript_foreground: string;
  transcript_position: string;
  transcript_delay: number;
  transcript_count: number;
  transcript_clear: boolean;
}

export interface WKOF {
  include(modules: string): void;
  ready(modules: string): Promise<void>;
  settings: Record<string, Settings>;
  Menu: {
    insert_script_link(config: { name: string; submenu: string; title: string; on_click: () => void }): void;
  };
  Settings: {
    new (config: object): { open(): void };
    load(scriptId: string, defaults: Partial<Settings>): Promise<Settings>;
  };
  ItemData: {
    get_items(): Promise<WKOFData>;
    get_index(items: WKOFData, indexType: string): Record<string, WKOFItem[]>;
  };
  on_pageload(patterns: string[], callback: (url: string) => void): void;
}

export interface Transcript {
  raw: string;
  final: boolean;
  matched?: string;
}

export interface CheckResult {
  candidate: Candidate | null;
  answer: string | null;
  meanings: string[];
  readings: string[];
  candidates: Candidate[];
}
