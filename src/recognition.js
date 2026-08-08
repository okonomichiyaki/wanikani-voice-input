const MIN_INDICATE = 100;

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
    //console.info('[wanikani-voice-input] onresult', event);

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript.trim();
      const final = event.results[i].isFinal;
      callback(transcript, final);
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

// keep a persistent mic stream so macOS doesn't flicker the mic indicator every time SpeechRecognition internally stops/restarts
let persistentStream;

export async function acquireMicStream() {
  if (persistentStream) return;
  try {
    persistentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (e) {
    console.error('[wanikani-voice-input] failed to acquire persistent mic stream:', e);
  }
}

export function stopRecognition(recognition) {
  recognition.onend = () => {};
  recognition.abort();
}

export function releaseMicStream() {
  if (persistentStream) {
    persistentStream.getTracks().forEach(track => track.stop());
    persistentStream = null;
  }
}
