export function findRepeatingSubstring(s) {
  let len = s.length;
  for (let i = Math.floor(len / 2); i > 0; i--) {
    if (len % i === 0) {
      let match = true;
      let sub = s.slice(0, i);
      for (let j = i; j < len; j += i) {
        if (s.slice(j, j + i) !== sub) {
          match = false;
          break;
        }
      }
      if (match) return sub;
    }
  }
  return null;
}
