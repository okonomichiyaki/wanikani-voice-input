const gold = '#ffd700';
const black = '#000000';

export function isLightningOn() {
  return getSettings().lightning;
}

export function isSudachiOn() {
  return getSettings().sudachi;
}

export function getSettings() {
  if (unsafeWindow.wkof) {
    return unsafeWindow.wkof.settings['wanikani-voice-input'];
  }
  return {
    lightning: false,
    sudachi: false,
    transcript: true,
    transcript_background: gold,
    transcript_foreground: black,
    transcript_position: "top"
  };
}

export function initializeSettings(wkof, onStart) {
  wkof.include('Menu,Settings');
  wkof.ready('Menu,Settings')
    .then(installMenu)
    .then(loadSettings)
    .then(onStart);

  function installMenu() {
    wkof.Menu.insert_script_link({
      name:      'wanikani-voice-input',
      submenu:   'Settings',
      title:     'Voice Input',
      on_click:  openSettings
    });
  }

  function loadSettings() {
    return wkof.Settings.load('wanikani-voice-input');
  }

  function openSettings() {
    var config = {
      script_id: 'wanikani-voice-input',
      title: 'Voice Input',
      content: {
        lightning: {
          type: 'checkbox',
          label: 'Lightning mode',
          default: false,
          hover_tip: 'If enabled, automatically advance to the next flashcard on correct answers. If enabled, please disable lightning mode from any other scripts.',
        },
        transcript: {
          type: 'checkbox',
          label: 'Live transcript',
          default: true,
          hover_tip: 'If enabled, displays a live transcript of dictation'
        },
        transcript_background: {
          type: 'color',
          label: 'Transcript background color',
          hover_tip: 'Background color for the live transcript',
          default: gold
        },
        transcript_foreground: {
          type: 'color',
          label: 'Transcript text color',
          hover_tip: 'Text color for the live transcript',
          default: black
        },
        transcript_position: {
          type: 'dropdown',
          label: 'Transcript position',
          hover_tip: 'Position on the page for the live transcript',
          default: 'top',
          content: {
            top: 'Top',
            bottom: 'Bottom'
          }
        },
        sudachi: {
          type: 'checkbox',
          label: 'Use Sudachi',
          default: false,
          hover_tip: 'If enabled, will download and use Sudachi, a morphological analyzer. This library may improve accuracy for some items but it is large (150 MB). Download is cached but start up time for review sessions will be slower while the library loads.',
        },
      }
    };
    var dialog = new wkof.Settings(config);
    dialog.open();
  }
}
