export function onNavigationSuccess(callback) {
  if (unsafeWindow.navigation) {
    unsafeWindow.navigation.addEventListener('navigatesuccess', callback);
  }
}
