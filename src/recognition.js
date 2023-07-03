import { getSettings } from './settings.js';
import { setIndicator, clearIndicator } from './live_transcript.js';

export function createRecognition(lang, callback) {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('[wanikani-voice-input] web speech not supported by this browser!');
    return null;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang;

  recognition.onresult = (event) => {
    console.info('[wanikani-voice-input] onresult', event);

    setIndicator(getSettings(), '🎤');
    const start = Date.now();
    let wasFinal = false;
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript.trim();
      const final = event.results[i].isFinal;
      callback(transcript, final);
      wasFinal = wasFinal || final;
    }
    if (wasFinal) {
      const elapsed = Date.now() - start;
      setTimeout(clearIndicator, Math.min(0, 750 - elapsed));
    }
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech') {
      return;
    }
    console.error('[wanikani-voice-input] error occurred in recognition:', event.error);
  };

  recognition.onend = () => {
    recognition.start();
  };

  return recognition;
}

export function setLanguage(recognition, newLanguage) {
  if (recognition.lang != newLanguage) {
    recognition.stop();
    recognition.lang = newLanguage;
  }
}
