/**
 * Date and time validation utilities for match timestamps.
 * Standard format: "dd/mm/aaaa" (e.g. "23/10/2026")
 * Legacy format: "dd/mm/aaaa - hh:mm" (e.g. "15/10/2026 - 19:30")
 */

const DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const TIMESTAMP_REGEX = /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})$/;

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Strips non-numeric characters and formats into dd/mm/aaaa as user types.
 */
export function applyDateMask(rawText: string): string {
  if (!rawText || typeof rawText !== "string") return "";

  let cleaned = rawText.replace(/\D/g, "").slice(0, 8);

  if (cleaned.length >= 5) {
    return cleaned.replace(/^(\d{2})(\d{2})(\d{0,4})$/, "$1/$2/$3");
  } else if (cleaned.length >= 3) {
    return cleaned.replace(/^(\d{2})(\d{0,2})$/, "$1/$2");
  }

  return cleaned;
}

/**
 * Validates a date string in dd/mm/aaaa format, verifying calendar validity,
 * variable month lengths, and leap years.
 */
export function validateMatchDate(value: string): DateValidationResult {
  if (!value || typeof value !== "string" || !value.trim()) {
    return {
      isValid: false,
      error: "Debe introducir la fecha del partido",
    };
  }

  const trimmed = value.trim();
  const match = trimmed.match(DATE_REGEX);
  if (!match) {
    return {
      isValid: false,
      error: "Formato de fecha inválido. Utilice dd/mm/aaaa",
    };
  }

  const [, dayStr, monthStr, yearStr] = match;
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      error: "Mes inválido en la fecha del partido",
    };
  }

  if (day < 1) {
    return {
      isValid: false,
      error: "Día inválido en la fecha del partido",
    };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    return {
      isValid: false,
      error: "Fecha inválida en el calendario",
    };
  }

  return { isValid: true };
}

export function isValidMatchDate(value: string): boolean {
  return validateMatchDate(value).isValid;
}

/**
 * Parses dd/mm/aaaa (or legacy dd/mm/aaaa - hh:mm) into a JavaScript Date instance.
 */
export function parseMatchDate(value: string): Date | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();

  // 1. Try date-only format
  const dateMatch = trimmed.match(DATE_REGEX);
  if (dateMatch) {
    const [, dayStr, monthStr, yearStr] = dateMatch;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (month < 1 || month > 12 || day < 1) return null;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return null;

    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // 2. Try legacy timestamp format
  const tsMatch = trimmed.match(TIMESTAMP_REGEX);
  if (tsMatch) {
    const [, dayStr, monthStr, yearStr, hourStr, minuteStr] = tsMatch;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (month < 1 || month > 12) return null;
    if (hour < 0 || hour > 23) return null;
    if (minute < 0 || minute > 59) return null;
    if (day < 1) return null;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return null;

    const date = new Date(year, month - 1, day, hour, minute);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Backward-compatible timestamp parser supporting both legacy timestamps and date-only strings.
 */
export function parseMatchTimestamp(value: string): Date | null {
  return parseMatchDate(value);
}

export function isValidMatchTimestamp(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  return TIMESTAMP_REGEX.test(value.trim()) && parseMatchDate(value) !== null;
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

