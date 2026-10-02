/**
 * Date and time validation utilities for match timestamps.
 * Expected format: "dd/mm/aaaa - hh:mm" (e.g. "15/10/2026 - 19:30")
 */

const TIMESTAMP_REGEX = /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})$/;

export function parseMatchTimestamp(value: string): Date | null {
  if (!value || typeof value !== "string") return null;

  const match = value.trim().match(TIMESTAMP_REGEX);
  if (!match) return null;

  const [, dayStr, monthStr, yearStr, hourStr, minuteStr] = match;
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (month < 1 || month > 12) return null;
  if (hour < 0 || hour > 23) return null;
  if (minute < 0 || minute > 59) return null;
  if (day < 1) return null;

  // Validate days in month (handling leap years)
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return null;

  const date = new Date(year, month - 1, day, hour, minute);
  return isNaN(date.getTime()) ? null : date;
}

export function isValidMatchTimestamp(value: string): boolean {
  return parseMatchTimestamp(value) !== null;
}

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateMatchTimestamp(value: string): DateValidationResult {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: "Debe introducir la fecha del partido",
    };
  }

  if (!isValidMatchTimestamp(value)) {
    return {
      isValid: false,
      error: "Formato de fecha inválido. Utilice dd/mm/aaaa - hh:mm",
    };
  }

  return { isValid: true };
}
