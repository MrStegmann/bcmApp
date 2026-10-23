import { PlayerIdentifierInput } from "../types";

/**
 * Pure utility function to format player identification for player representation circles.
 * Priority:
 * 1. Exclusively renders `jerseyName` when present and non-empty.
 * 2. If jerseyName is missing/empty, safely falls back to `[First Initial]. [Last Name]`.
 * 3. Handles edge cases: single name (last or first only), number-only, whitespace, or missing names ("Jugador").
 */
export function formatPlayerIdentifier(player?: PlayerIdentifierInput | null): string {
  if (!player) {
    return "Jugador";
  }

  const trimmedJersey = player.jerseyName != null ? String(player.jerseyName).trim() : "";
  if (trimmedJersey.length > 0) {
    return trimmedJersey;
  }

  const trimmedFirst = player.firstName != null ? String(player.firstName).trim() : "";
  const trimmedLast = player.lastName != null ? String(player.lastName).trim() : "";

  const capitalize = (s: string) => (s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  if (trimmedFirst.length > 0 && trimmedLast.length > 0) {
    const initial = trimmedFirst.charAt(0).toUpperCase();
    return `${initial}. ${capitalize(trimmedLast)}`;
  }

  if (trimmedLast.length > 0) {
    return capitalize(trimmedLast);
  }

  if (trimmedFirst.length > 0) {
    return capitalize(trimmedFirst);
  }

  const trimmedNumber = player.number != null ? String(player.number).trim() : "";
  if (trimmedNumber.length > 0) {
    return `#${trimmedNumber}`;
  }

  return "Jugador";
}
