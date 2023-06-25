export function isLightningOn() {
  return getSettings().lightning;
}

export function getSettings() {
  if (unsafeWindow.wkof) {
    return unsafeWindow.wkof.settings['wanikani-voice-input'];
  }
  return {
    lightning: true,
    transcript: true,
    transcript_background: "#ffd700", // gold
    transcript_foreground: "#000000", // black
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
          default: true,
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
          default: '#ffd700'
        },
        transcript_foreground: {
          type: 'color',
          label: 'Transcript text color',
          hover_tip: 'Text color for the live transcript',
          default: '#000000'
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
        }
      }
    };
    var dialog = new wkof.Settings(config);
    dialog.open();
  }
}
