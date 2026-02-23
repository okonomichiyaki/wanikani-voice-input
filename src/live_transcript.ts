import { Settings, Transcript } from './types';

function getContainerStyle(settings: Settings): string {
  const position = settings.transcript_position;
  let style =
    'width: 100%; position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;';
  if (position === 'top' || position === 'bottom') {
    style = style + ` ${position}: 0px`;
  } else if (position === 'center') {
    style = style + ` top: 45vh`;
  }
  return style;
}

function getTranscriptStyle(settings: Settings): string {
  const fgcolor = settings.transcript_foreground;
  const bgcolor = settings.transcript_background;
  return `color: ${fgcolor}; background-color: ${bgcolor}; font-size: 5vh; pointer-events: auto;`;
}

export function createTranscriptContainer(settings: Settings): void {
  const container = document.createElement('div');
  container.id = 'wanikani-voice-input-transcript-container';
  container.style.cssText = getContainerStyle(settings);
  document.body.appendChild(container);
}

export function removeTranscriptContainer(): void {
  const container = document.getElementById('wanikani-voice-input-transcript-container');
  if (container) {
    container.remove();
  }
}

let COUNTER = 1;

export function clearTranscript(): void {
  const container = document.querySelector('div#wanikani-voice-input-transcript-container');
  if (container) {
    container.textContent = '';
  }
}

function clearTranscriptWith(id: string): void {
  const t = document.getElementById(id);
  if (t) {
    const parent = t.parentElement;
    if (parent) {
      parent.removeChild(t);
    }
  }
}

function clearTranscriptFn(id: string): () => void {
  return function () {
    clearTranscriptWith(id);
  };
}

export function logTranscript(settings: Settings, transcript: Transcript): void {
  if (!settings.transcript) {
    return;
  }
  const previous = document.getElementById(`transcript-${COUNTER - 1}`) as (HTMLElement & { raw?: string }) | null;

  // handle overwriting (or not) previous transcript without (or with) match:
  if (previous && transcript.raw === previous.raw && !transcript.matched) {
    return;
  }
  if (previous && transcript.raw === previous.raw && transcript.matched) {
    clearTranscriptWith(`transcript-${COUNTER - 1}`);
  }

  const newText = '\u{1F3A4}' + transcript.raw + (transcript.matched ? ` (${transcript.matched})` : '');
  const current = COUNTER++;
  const id = `transcript-${current}`;
  const el = document.createElement('p') as HTMLParagraphElement & { raw?: string };
  el.raw = transcript.raw;
  el.id = id;
  el.style.cssText = getTranscriptStyle(settings);
  el.textContent = newText;

  const container = document.querySelector<HTMLDivElement>('div#wanikani-voice-input-transcript-container');
  if (!container) return;
  container.style.cssText = getContainerStyle(settings);
  container.appendChild(el);

  // eventually fade new transcript:
  setTimeout(clearTranscriptFn(id), settings.transcript_delay * 1000);

  // clear old transcripts:
  const start = current - settings.transcript_count;
  const end = current - 10;
  for (let i = start; i >= end && i >= 0; i--) {
    clearTranscriptWith(`transcript-${i}`);
  }
}
