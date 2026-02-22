export function onNavigationSuccess(callback: () => void): void {
  if (unsafeWindow.navigation) {
    unsafeWindow.navigation.addEventListener('navigatesuccess', callback);
  }
}
