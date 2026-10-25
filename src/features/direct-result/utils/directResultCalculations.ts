import { Game, Player } from "../../../types/database";
import { DirectResultBuffer, PeriodKey, PeriodScoreInput, PlayerStatInput } from "../types";
import { calculatePlayerValuation as baseCalculateValuation } from "../../../store/GameStore";

/**
 * Sanitizes input values ensuring a non-negative integer is returned.
 * Returns 0 if empty, invalid, or negative.
 */
export function sanitizePositiveInteger(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    const parsed = parseInt(trimmed, 10);
    if (isNaN(parsed) || parsed < 0) return 0;
    return parsed;
  }
  if (typeof value === "number") {
    if (isNaN(value) || value < 0) return 0;
    return Math.floor(value);
  }
  return 0;
}

export interface PeriodTotalsResult {
  totalTeamPoints: number;
  totalRivalPoints: number;
  totalTeamFouls: number;
  totalRivalFouls: number;
}

/**
 * Calculates cumulative totals for regulation quarters (Q1-Q4) and optional extra period.
 */
export function calculatePeriodTotals(
  periods: Record<PeriodKey, PeriodScoreInput> | null | undefined,
  hasExtraTime: boolean
): PeriodTotalsResult {
  const result: PeriodTotalsResult = {
    totalTeamPoints: 0,
    totalRivalPoints: 0,
    totalTeamFouls: 0,
    totalRivalFouls: 0,
  };

  if (!periods) return result;

  const regulationKeys: PeriodKey[] = ["q1", "q2", "q3", "q4"];
  for (const key of regulationKeys) {
    const p = periods[key];
    if (p) {
      result.totalTeamPoints += sanitizePositiveInteger(p.teamPoints);
      result.totalRivalPoints += sanitizePositiveInteger(p.rivalPoints);
      result.totalTeamFouls += sanitizePositiveInteger(p.teamFouls);
      result.totalRivalFouls += sanitizePositiveInteger(p.rivalFouls);
    }
  }

  if (hasExtraTime && periods.extra) {
    result.totalTeamPoints += sanitizePositiveInteger(periods.extra.teamPoints);
    result.totalRivalPoints += sanitizePositiveInteger(periods.extra.rivalPoints);
    result.totalTeamFouls += sanitizePositiveInteger(periods.extra.teamFouls);
    result.totalRivalFouls += sanitizePositiveInteger(periods.extra.rivalFouls);
  }

  return result;
}

/**
 * Calculates player total points from made free throws, 2-pointers, and 3-pointers.
 */
export function calculatePlayerPoints(stat: Pick<PlayerStatInput, "t1a" | "t2a" | "t3a"> | null | undefined): number {
  if (!stat) return 0;
  const t1a = sanitizePositiveInteger(stat.t1a);
  const t2a = sanitizePositiveInteger(stat.t2a);
  const t3a = sanitizePositiveInteger(stat.t3a);
  return t1a * 1 + t2a * 2 + t3a * 3;
}

/**
 * Calculates FIBA PIR valuation using the standard valuation formula.
 */
export function calculateValuation(stat: any): number {
  return baseCalculateValuation(stat);
}

/**
 * Validates direct result buffer ensuring shot attempts are >= made shots,
 * non-negative values, etc.
 */
export function validateDirectResult(buffer: DirectResultBuffer): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!buffer) {
    return { isValid: false, errors: ["Buffer is missing"] };
  }

  // Validate player stats consistency
  if (buffer.players) {
    for (const [playerId, stat] of Object.entries(buffer.players)) {
      if (stat.t1i < stat.t1a) {
        errors.push(`Player ${playerId}: Free throw attempts (${stat.t1i}) cannot be less than made (${stat.t1a})`);
      }
      if (stat.t2i < stat.t2a) {
        errors.push(`Player ${playerId}: 2PT attempts (${stat.t2i}) cannot be less than made (${stat.t2a})`);
      }
      if (stat.t3i < stat.t3a) {
        errors.push(`Player ${playerId}: 3PT attempts (${stat.t3i}) cannot be less than made (${stat.t3a})`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Builds an initial empty DirectResultBuffer for a game and roster players.
 */
export function buildInitialDirectResultBuffer(
  players: Player[],
  existingGame?: Game | null
): DirectResultBuffer {
  const defaultPeriod = (): PeriodScoreInput => ({
    teamPoints: 0,
    teamFouls: 0,
    rivalPoints: 0,
    rivalFouls: 0,
  });

  const periods: Record<PeriodKey, PeriodScoreInput> = {
    q1: defaultPeriod(),
    q2: defaultPeriod(),
    q3: defaultPeriod(),
    q4: defaultPeriod(),
    extra: defaultPeriod(),
  };

  if (existingGame) {
    periods.q1 = {
      teamPoints: sanitizePositiveInteger(existingGame.resultC1),
      teamFouls: sanitizePositiveInteger(existingGame.foulsC1),
      rivalPoints: sanitizePositiveInteger(existingGame.resultC1Opponent),
      rivalFouls: sanitizePositiveInteger(existingGame.foulsC1Opponent),
    };
    periods.q2 = {
      teamPoints: sanitizePositiveInteger(existingGame.resultC2),
      teamFouls: sanitizePositiveInteger(existingGame.foulsC2),
      rivalPoints: sanitizePositiveInteger(existingGame.resultC2Opponent),
      rivalFouls: sanitizePositiveInteger(existingGame.foulsC2Opponent),
    };
    periods.q3 = {
      teamPoints: sanitizePositiveInteger(existingGame.resultC3),
      teamFouls: sanitizePositiveInteger(existingGame.foulsC3),
      rivalPoints: sanitizePositiveInteger(existingGame.resultC3Opponent),
      rivalFouls: sanitizePositiveInteger(existingGame.foulsC3Opponent),
    };
    periods.q4 = {
      teamPoints: sanitizePositiveInteger(existingGame.resultC4),
      teamFouls: sanitizePositiveInteger(existingGame.foulsC4),
      rivalPoints: sanitizePositiveInteger(existingGame.resultC4Opponent),
      rivalFouls: sanitizePositiveInteger(existingGame.foulsC4Opponent),
    };
    periods.extra = {
      teamPoints: sanitizePositiveInteger(existingGame.resultExtra),
      teamFouls: sanitizePositiveInteger(existingGame.foulsExtra),
      rivalPoints: sanitizePositiveInteger(existingGame.resultExtraOpponent),
      rivalFouls: sanitizePositiveInteger(existingGame.foulsExtraOpponent),
    };
  }

  const hasExtraTime = Boolean(
    existingGame &&
      (Number(existingGame.resultExtra || 0) > 0 ||
        Number(existingGame.resultExtraOpponent || 0) > 0 ||
        Number(existingGame.foulsExtra || 0) > 0 ||
        Number(existingGame.foulsExtraOpponent || 0) > 0)
  );

  const playerRecords: Record<number, PlayerStatInput> = {};
  for (const p of players) {
    playerRecords[p.id] = {
      playerId: p.id,
      minutes: 0,
      t1a: 0,
      t1i: 0,
      t2a: 0,
      t2i: 0,
      t3a: 0,
      t3i: 0,
      oreb: 0,
      dreb: 0,
      asis: 0,
      rec: 0,
      per: 0,
      falt: 0,
    };
  }

  return {
    periods,
    players: playerRecords,
    hasExtraTime,
  };
}
