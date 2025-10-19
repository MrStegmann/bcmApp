export function timeFormat(ms) {
  const minuts = Math.floor(ms / 60000).toFixed(0);
  const seconds = Math.floor((ms % 60000) / 1000).toFixed(1);

  return `${minuts}:${seconds}`;
}
