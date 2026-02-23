import { Settings, WKOF } from './types';

const gold = '#ffd700';
const black = '#000000';
const defaults: Settings = {
  lightning: false,
  lightning_delay: 0.1,
  mistake_delay: 0.1,
  transcript: true,
  transcript_background: gold,
  transcript_foreground: black,
  transcript_position: 'top',
  transcript_delay: 5,
  transcript_count: 1,
  transcript_clear: false,
};
const config = {
  script_id: 'wanikani-voice-input',
  title: 'Voice Input',
  content: {
    lightning: {
      type: 'checkbox',
      label: 'Lightning mode',
      default: false,
      hover_tip:
        'If enabled, automatically advance to the next flashcard on correct answers. If enabled, please disable lightning mode from any other scripts.',
    },
    lightning_delay: {
      type: 'number',
      label: 'Lightning delay',
      hover_tip: 'Duration in seconds before lightning mode advances to the next card',
      min: 0,
      default: 0.1,
    },
    mistake_delay: {
      type: 'number',
      label: 'Mistake delay',
      hover_tip: 'Duration in seconds before lightning mode displays info on mistake',
      min: 0,
      default: 0.1,
    },
    transcript: {
      type: 'checkbox',
      label: 'Live transcript',
      default: true,
      hover_tip: 'If enabled, displays a live transcript of dictation',
    },
    transcript_background: {
      type: 'color',
      label: 'Transcript background color',
      hover_tip: 'Background color for the live transcript',
      default: gold,
    },
    transcript_foreground: {
      type: 'color',
      label: 'Transcript text color',
      hover_tip: 'Text color for the live transcript',
      default: black,
    },
    transcript_position: {
      type: 'dropdown',
      label: 'Transcript position',
      hover_tip: 'Position on the page for the live transcript',
      default: 'top',
      content: {
        top: 'Top',
        bottom: 'Bottom',
      },
    },
    transcript_delay: {
      type: 'number',
      label: 'Transcript delay',
      hover_tip: 'Duration in seconds before live transcripts disappear',
      min: 0,
      default: 5.0,
    },
    transcript_count: {
      type: 'number',
      label: 'Transcript count',
      hover_tip: 'How many live transcripts to show (recommend setting position to bottom if this is more then 1)',
      min: 1,
      default: 1,
    },
    transcript_clear: {
      type: 'checkbox',
      label: 'Clear transcript between flashcards',
      default: false,
      hover_tip: 'If enabled, clears the live transcript between flashcards',
    },
  },
};

export function isLightningOn(): boolean {
  return getSettings().lightning;
}

export function getSettings(): Settings {
  if (unsafeWindow.wkof) {
    return unsafeWindow.wkof.settings['wanikani-voice-input'];
  }
  return defaults;
}

export function initializeSettings(wkof: WKOF): Promise<Settings> {
  function openSettings() {
    const dialog = new wkof.Settings(config);
    dialog.open();
  }
  wkof.Menu.insert_script_link({
    name: 'wanikani-voice-input',
    submenu: 'Settings',
    title: 'Voice Input',
    on_click: openSettings,
  });
  return wkof.Settings.load('wanikani-voice-input', defaults);
}
