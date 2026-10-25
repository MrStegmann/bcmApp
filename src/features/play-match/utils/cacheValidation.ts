import { CachedMatchPayload } from "../types/cache";
import { PeriodKey } from "../types";

const VALID_PERIODS: PeriodKey[] = ["q1", "q2", "q3", "q4", "extra"];
const SUPPORTED_VERSION = 1;

/**
 * Type guard and structural validator for CachedMatchPayload.
 * Ensures the payload has all required properties and valid values before rehydrating into the store.
 */
export function validateMatchCachePayload(
  payload: unknown
): payload is CachedMatchPayload {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  const p = payload as Record<string, any>;

  // 1. Version check
  if (p.version !== SUPPORTED_VERSION) {
    return false;
  }

  // 2. matchId check
  if (typeof p.matchId !== "number" || !Number.isInteger(p.matchId) || p.matchId <= 0) {
    return false;
  }

  // 3. activePeriod check
  if (typeof p.activePeriod !== "string" || !VALID_PERIODS.includes(p.activePeriod as PeriodKey)) {
    return false;
  }

  // 4. periods check
  if (!p.periods || typeof p.periods !== "object" || Array.isArray(p.periods)) {
    return false;
  }

  for (const key of VALID_PERIODS) {
    const period = p.periods[key];
    if (
      !period ||
      typeof period !== "object" ||
      typeof period.remainingSeconds !== "number" ||
      typeof period.teamScore !== "number" ||
      typeof period.rivalScore !== "number" ||
      typeof period.teamFouls !== "number" ||
      typeof period.rivalFouls !== "number"
    ) {
      return false;
    }
  }

  // 5. players check
  if (!Array.isArray(p.players)) {
    return false;
  }

  // 6. timeouts check
  if (
    !p.timeouts ||
    typeof p.timeouts !== "object" ||
    typeof p.timeouts.firstHalfRemaining !== "number" ||
    typeof p.timeouts.secondHalfRemaining !== "number" ||
    typeof p.timeouts.extraTimeRemaining !== "number"
  ) {
    return false;
  }

  // 7. swap check
  if (
    !p.swap ||
    typeof p.swap !== "object" ||
    typeof p.swap.isSwapMode !== "boolean" ||
    !Array.isArray(p.swap.selectedCourtPlayerIds) ||
    !Array.isArray(p.swap.selectedBenchPlayerIds)
  ) {
    return false;
  }

  // 8. scoreEvents check
  if (!Array.isArray(p.scoreEvents)) {
    return false;
  }

  // 9. savedAt timestamp check
  if (
    typeof p.savedAt !== "string" ||
    p.savedAt.trim() === "" ||
    Number.isNaN(Date.parse(p.savedAt))
  ) {
    return false;
  }

  return true;
}
