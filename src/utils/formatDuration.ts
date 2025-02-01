export function formatDurationFromSeconds(seconds?: number) {
  if (!seconds) return
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';
  if (hours > 0) result += `${hours}h `
  if (minutes > 0 || hours > 0) result += `${minutes}m `
  if (seconds < 60) result += `${remainingSeconds}s`

  return result.trim();
}