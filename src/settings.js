export function initializeSettings(wkof, onStart, onUpdate) {
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
      on_save: onUpdate,
      content: {
        lightning: {
          type: 'checkbox',
          label: 'Lightning Mode',
          default: true,
          hover_tip: 'Automatically advanced to the next flashcard',
        },
      }
    };
    var dialog = new wkof.Settings(config);
    dialog.open();
  }
}
