
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
        // TODO
        max_apprentice: {
          type: 'number',
          label: 'Maximum Apprentice Items',
          default: 100,
          hover_tip: 'The maximum number of apprentice items to allow.',
        },
      }
    };
    var dialog = new wkof.Settings(config);
    dialog.open();
  }
}
