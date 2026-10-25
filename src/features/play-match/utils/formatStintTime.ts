/**
 * Pure utility function to format continuous player stint time from seconds into `mm:ss` format.
 * Examples:
 * - 0 -> "00:00"
 * - 45 -> "00:45"
 * - 60 -> "01:00"
 * - 120 -> "02:00"
 * - 725 -> "12:05"
 */
export function formatStintTime(seconds?: number | null): string {
  const total = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
