import { toHiragana, isJapanese, isKanji } from 'wanakana';
import { setTranscript } from '../live_transcript.js';
import { isSudachiOn, getSettings } from '../settings.js';

export function initialize(window) {
  if (!window.tokenize && !window.TokenizeMode && isSudachiOn()) {
    const id = setInterval(function() {
      if (window.tokenize && window.TokenizeMode) {
        clearInterval(id);
        setTranscript(getSettings(), 'Finished loading Sudachi.');
        setTimeout(() => setTranscript(getSettings(), ''), 2000);
      }
    }, 500);
    setTranscript(getSettings(), 'Loading Sudachi...');
    window.wkof.load_file('https://unpkg.com/sudachi@0.1.5/sudachi.js', true)
      .then(function(raw) {
        const el = document.createElement('script');
        const code = raw + '; window.tokenize = tokenize; window.TokenizeMode = TokenizeMode;';
        el.textContent = code;
        el.type = 'module';
        document.head.appendChild(el);
    });
  }
}

export class Sudachi {
  constructor(window) {
    this.window = window;
    this.order = 0;
  }
  getCandidates(raw) {
    const candidates = [];
    if (isJapanese(raw) && this.window.tokenize && this.window.TokenizeMode) {
      const data = JSON.parse(this.window.tokenize(raw, this.window.TokenizeMode.C));
      const candidate = data.map(d => toHiragana(d.dictionary_form)).join('');
      candidates.push({data: candidate, type: "sudachi"});
    }
    return candidates;
  }
}
