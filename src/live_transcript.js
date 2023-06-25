function getContainerStyle() {
  let position = 'top';
  if (window.wkof) {
    position = window.wkof.settings['wanikani-voice-input'].transcript_position;
  }
  let style = "width: 100%; position: absolute; display: flex; align-items: center; justify-content: center; pointer-events: none;";
  if (position === "top" || position === "bottom") {
    style = style + ` ${position}: 0px`;
  } else if (position === "center") {
    style = style + ` top: 45vh`;
  }
  return style;
}

function getTranscriptStyle() {
  let fgcolor = 'black';
  let bgcolor = 'gold';
  if (window.wkof) {
    fgcolor = window.wkof.settings['wanikani-voice-input'].transcript_foreground;
    bgcolor = window.wkof.settings['wanikani-voice-input'].transcript_background;
  }
  return `color: ${fgcolor}; background-color: ${bgcolor}; font-size: 5vh;`;
}

export function createTranscriptContainer() {
  const container = document.createElement('div');
  container.id = "wanikani-voice-input-transcript-container";
  container.style = getContainerStyle();

  const transcript = document.createElement('p');
  transcript.style = getTranscriptStyle();

  container.appendChild(transcript);
  document.body.appendChild(container);
}

export function setTranscript(text) {
  if (window.wkof && !window.wkof.settings['wanikani-voice-input'].transcript) {
    return;
  }
  const container = document.querySelector('div#wanikani-voice-input-transcript-container');
  container.style = getContainerStyle();
  const transcript = document.querySelector('div#wanikani-voice-input-transcript-container p');
  transcript.style = getTranscriptStyle();
  const old = transcript.textContent;
  if (!old.startsWith(text) // HACK for "fast mode" waiting for final
      || text === "") {
    transcript.textContent = text;
  }
}
