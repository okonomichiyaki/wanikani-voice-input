export function createRecognition(lang: string, callback: (transcript: string, isFinal: boolean) => void): SpeechRecognition | null {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('[wanikani-voice-input] web speech not supported by this browser!');
    return null;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang;

  recognition.onresult = (event) => {
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

export function setLanguage(recognition: SpeechRecognition, newLanguage: string): void {
  if (recognition.lang != newLanguage) {
    recognition.stop();
    recognition.lang = newLanguage;
  }
}
