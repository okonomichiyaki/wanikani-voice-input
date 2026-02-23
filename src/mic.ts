function _setupMicButton(): void {
  const menu = document.querySelector('div.character-header__menu-navigation');
  if (!menu) return;
  const item = document.createElement('div');
  item.classList.add('character-header__menu-navigation-link');
  item.style.cssText = 'margin-left: 10px;';
  const link = document.createElement('a');
  link.title = 'Toggle voice input';
  link.classList.add('summary-button');

  let state = true;
  const icon = document.createElement('i');
  icon.classList.add('wk-icon');
  icon.classList.add('fa-solid');
  icon.classList.add('fa-microphone');

  link.onclick = function () {
    if (state) {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-light');
    } else {
      icon.classList.remove('fa-light');
      icon.classList.add('fa-solid');
    }
    state = !state;
  };

  link.appendChild(icon);
  item.appendChild(link);
  menu.appendChild(item);
}
