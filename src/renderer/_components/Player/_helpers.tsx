export function formatSecondsToTime(seconds?: number) {
  if (typeof seconds === 'undefined' || isNaN(seconds)) {
    return '-:--';
  }

  const minutes = Math.floor(seconds / 60);
  const newSeconds = String(Math.floor(seconds % 60));
  const pad = '00';
  return `${minutes}:${(pad + newSeconds).substring(newSeconds.length)}`;
}
