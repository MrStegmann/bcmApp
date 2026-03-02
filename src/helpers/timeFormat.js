export function timeFormat(totalMilliseconds) {
  const ONE_MINUTE_MS = 60000;

  const ms = Math.floor(totalMilliseconds);

  if (ms >= ONE_MINUTE_MS) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  } else {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    const formattedSeconds = String(seconds).padStart(2, "0");
    const formattedMilliseconds = Math.floor(milliseconds / 10);

    return `${formattedSeconds}.${formattedMilliseconds}`;
  }
}
