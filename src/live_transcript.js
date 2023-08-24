function getContainerStyle(settings) {
  let position = settings.transcript_position;
  let style = 'width: 100%; position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;';
  if (position === 'top' || position === 'bottom') {
    style = style + ` ${position}: 0px`;
  } else if (position === 'center') {
    style = style + ` top: 45vh`;
  }
  return style;
}

function getTranscriptStyle(settings) {
  let fgcolor = settings.transcript_foreground;
  let bgcolor = settings.transcript_background;
  return `color: ${fgcolor}; background-color: ${bgcolor}; font-size: 5vh; pointer-events: auto;`;
}

export function createTranscriptContainer(settings) {
  const container = document.createElement('div');
  container.id = 'wanikani-voice-input-transcript-container';
  container.style = getContainerStyle(settings);
  document.body.appendChild(container);
}

let COUNTER = 1;

function clearTranscriptWith(id) {
  const t = document.getElementById(id);
  if (t) {
    const parent = t.parentElement;
    parent.removeChild(t);
  }
}

function clearTranscriptFn(id) {
  return function() {
    clearTranscriptWith(id);
  };
}

export function logTranscript(settings, text) {
  if (!settings.transcript) {
    return;
  }
  const newText = '🎤' + text;
  const previous = document.getElementById(`transcript-${COUNTER - 1}`);
  if (previous && newText === previous.textContent) {
    return;
  }

  const current = COUNTER++;
  const id = `transcript-${current}`;
  const transcript = document.createElement('p');
  transcript.id = id;
  transcript.style = getTranscriptStyle(settings);
  transcript.textContent = newText;

  const container = document.querySelector('div#wanikani-voice-input-transcript-container');
  container.appendChild(transcript);

  // eventually fade new transcript:
  setTimeout(clearTranscriptFn(id), settings.transcript_delay * 1000);

  // clear old transcripts:
  const start = current - settings.transcript_count;
  const end = current - 10;
  for (let i = start; i >= end && i >= 0; i--) {
    clearTranscriptWith(`transcript-${i}`);
  }
}
