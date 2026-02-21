export function clickSelector(s: string): void {
  setTimeout(() => {
    const node = document.querySelector(s);
    if (node) {
      (node as HTMLElement).click();
    }
  }, 500);
}
