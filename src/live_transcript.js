export function createTranscriptContainer(position) {
  const container = document.createElement('div');
  container.id = "wanikani-voice-input-transcript-container";
  let style = "width: 100%; position: absolute; display: flex; align-items: center; justify-content: center; pointer-events: none;";
  if (position === "top" || position === "bottom") {
    style = style + ` ${position}: 0px`;
  } else if (position === "center") {
    style = style + ` top: 45vh`;
  }
  container.style = style;

  const transcript = document.createElement('p');
  transcript.style = "color: black; background-color: gold; font-size: 5vh;";

  container.appendChild(transcript);
  document.body.appendChild(container);
}

export function setTranscript(text) {
  const transcript = document.querySelector('div#wanikani-voice-input-transcript-container p');
  const old = transcript.textContent;
  if (!old.startsWith(text) // HACK for "fast mode" waiting for final
      || text === "") {
    transcript.textContent = text;
  }
}
