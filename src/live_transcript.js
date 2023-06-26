function getContainerStyle(settings) {
  let position = settings.transcript_position;
  let style = "width: 100%; position: absolute; display: flex; align-items: center; justify-content: center; pointer-events: none;";
  if (position === "top" || position === "bottom") {
    style = style + ` ${position}: 0px`;
  } else if (position === "center") {
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
  container.id = "wanikani-voice-input-transcript-container";
  container.style = getContainerStyle(settings);

  const transcript = document.createElement('p');
  transcript.style = getTranscriptStyle(settings);

  container.appendChild(transcript);
  document.body.appendChild(container);
}

export function setTranscript(settings, text) {
  if (!settings.transcript) {
    return;
  }
  const container = document.querySelector('div#wanikani-voice-input-transcript-container');
  container.style = getContainerStyle(settings);
  const transcript = document.querySelector('div#wanikani-voice-input-transcript-container p');
  transcript.style = getTranscriptStyle(settings);
  const old = transcript.textContent;
  if (!old.startsWith(text) // HACK for "fast mode" waiting for final
      || text === "") {
    transcript.textContent = text;
  }
}
