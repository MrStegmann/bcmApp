export function timeFormat(ms) {
  if (ms >= 60000) {
    const minutos = (ms / 60000).toFixed(0); // dos decimales, por ejemplo "1.25 min"
    return `${minutos}'`;
  } else {
    const segundos = (ms / 1000).toFixed(0);
    return `${segundos}"`;
  }
}
