import { Game } from "../../../types/database";
import { parseMatchTimestamp } from "../../../utils/dateValidation";

/**
 * Parses match date strings into epoch milliseconds for robust chronological sorting.
 * Supports date-only format "dd/mm/aaaa", legacy format "dd/mm/aaaa - hh:mm", and ISO strings.
 * Returns 0 if invalid or empty.
 */
export function parseMatchDate(dateStr?: string | null): number {
  if (!dateStr || typeof dateStr !== "string") {
    return 0;
  }

  const trimmed = dateStr.trim();
  if (!trimmed) {
    return 0;
  }

  // 1. Try application standard format ("dd/mm/aaaa - hh:mm")
  const parsed = parseMatchTimestamp(trimmed);
  if (parsed instanceof Date && !isNaN(parsed.getTime())) {
    return parsed.getTime();
  }

  // 2. Fall back to native Date.parse for ISO or other standard formats
  const nativeTimestamp = Date.parse(trimmed);
  if (!isNaN(nativeTimestamp)) {
    return nativeTimestamp;
  }

  return 0;
}

/**
 * Sorts pending matches ascending (earliest scheduled match first).
 * Tie-breaker 1: round ascending (numeric)
 * Tie-breaker 2: match ID ascending
 */
export function sortPendingMatches(matches: Game[]): Game[] {
  return [...matches].sort((a, b) => {
    const timeA = parseMatchDate(a.date);
    const timeB = parseMatchDate(b.date);

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    const roundA = Number(a.round) || 0;
    const roundB = Number(b.round) || 0;
    if (roundA !== roundB) {
      return roundA - roundB;
    }

    return (a.id || 0) - (b.id || 0);
  });
}

/**
 * Sorts finished matches descending (most recently completed match first).
 * Tie-breaker: match ID descending
 */
export function sortFinishedMatches(matches: Game[]): Game[] {
  return [...matches].sort((a, b) => {
    const timeA = parseMatchDate(a.date);
    const timeB = parseMatchDate(b.date);

    if (timeA !== timeB) {
      return timeB - timeA;
    }

    return (b.id || 0) - (a.id || 0);
  });
}

/**
 * Safely formats round identifier into a display label (e.g., 1 -> "Jornada 1", "Jornada 2" -> "Jornada 2").
 * Coerces numeric and string values safely to prevent runtime type errors with `.startsWith`.
 */
export function formatRoundLabel(round?: string | number | null): string {
  if (round == null) {
    return "";
  }
  const str = String(round).trim();
  if (!str) {
    return "";
  }
  return str.toLowerCase().startsWith("jornada") ? str : `Jornada ${str}`;
}

