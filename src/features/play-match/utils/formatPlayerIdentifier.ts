import { PlayerIdentifierInput } from "../types";

/**
 * Pure utility function to format player identification for player representation circles.
 * Priority:
 * 1. If `jerseyName` is present, trimmed, and non-empty, returns it.
 * 2. If `jerseyName` is missing, empty, or whitespace, returns fallback "F. Lastname" ([First Initial]. [Last Name]).
 * 3. Handles edge cases:
 *    - Only lastName: Capitalized lastName
 *    - Only firstName: Capitalized firstName
 *    - Neither: "Jugador"
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

  return "Jugador";
}

