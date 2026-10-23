import {
  AdvancedTeamStats,
  PlayerRosterItem,
  RawTeamTotals,
} from "../types";

/**
 * Computes player valuation conforming to standard basketball formula:
 * (madeShots + rebounds + assists + steals) - (turnovers + fouls + missedShots)
 */
export function calculatePlayerValuation(stat: {
  t1a?: number;
  t1i?: number;
  t2a?: number;
  t2i?: number;
  t3a?: number;
  t3i?: number;
  oreb?: number;
  dreb?: number;
  asis?: number;
  rec?: number;
  per?: number;
  falt?: number;
} | null): number {
  if (!stat) return 0;
  const t1a = Number(stat.t1a || 0);
  const t1i = Number(stat.t1i || 0);
  const t2a = Number(stat.t2a || 0);
  const t2i = Number(stat.t2i || 0);
  const t3a = Number(stat.t3a || 0);
  const t3i = Number(stat.t3i || 0);
  const oreb = Number(stat.oreb || 0);
  const dreb = Number(stat.dreb || 0);
  const asis = Number(stat.asis || 0);
  const rec = Number(stat.rec || 0);
  const per = Number(stat.per || 0);
  const falt = Number(stat.falt || 0);

  const madeShots = t1a + t2a + t3a;
  const missedT1 = Math.max(0, t1i - t1a);
  const missedT2 = Math.max(0, t2i - t2a);
  const missedT3 = Math.max(0, t3i - t3a);

  return (
    madeShots +
    oreb +
    dreb +
    asis +
    rec -
    per -
    falt -
    missedT1 -
    missedT2 -
    missedT3
  );
}

/**
 * Computes the 8 advanced team statistics conforming to domain formulas:
 * 1. Posesiones (total) = 0.96 * (2PA + 3PA + 0.44 * 1PA + oreb - per)
 * 2. OER = (Total Points / Posesiones) * 100
 * 3. DER = (Total Rival Points / Posesiones) * 100
 * 4. eFG% = 100 * ((2PM + 3PM + 0.5 * 3PM) / (2PA + 3PA))
 * 5. ORB% = 100 * (oreb / ((2PA - 2PM) + (3PA - 3PM) + 0.44 * (1PA - 1PM)))
 * 6. AST% = 100 * (asis / (2PA + 3PA + 0.44 * 1PA + per))
 * 7. TOV% = 100 * (per / Posesiones)
 * 8. FTR = 100 * (1PM / (2PA + 3PA))
 * All formulas are guarded against division by zero (returning 0.0).
 */
export function calculateAdvancedStats(
  totals: RawTeamTotals
): AdvancedTeamStats {
  const t1a = Number(totals.t1a || 0);
  const t1i = Number(totals.t1i || 0);
  const t2a = Number(totals.t2a || 0);
  const t2i = Number(totals.t2i || 0);
  const t3a = Number(totals.t3a || 0);
  const t3i = Number(totals.t3i || 0);
  const oreb = Number(totals.oreb || 0);
  const asis = Number(totals.asis || 0);
  const per = Number(totals.per || 0);
  const totalPoints = Number(totals.totalPoints || 0);
  const totalRivalPoints = Number(totals.totalRivalPoints || 0);

  // 1. Posesiones (total)
  const fga = t2i + t3i;
  const rawPosesiones = 0.96 * (fga + 0.44 * t1i + oreb - per);
  const posesiones = Math.max(0, rawPosesiones);

  // 2. OER
  const oer = posesiones > 0 ? (totalPoints / posesiones) * 100 : 0.0;

  // 3. DER
  const der = posesiones > 0 ? (totalRivalPoints / posesiones) * 100 : 0.0;

  // 4. eFG%
  const fgmAdjusted = t2a + t3a + 0.5 * t3a;
  const efg = fga > 0 ? 100 * (fgmAdjusted / fga) : 0.0;

  // 5. ORB%
  const missed2 = Math.max(0, t2i - t2a);
  const missed3 = Math.max(0, t3i - t3a);
  const missed1 = Math.max(0, t1i - t1a);
  const orbDenominator = missed2 + missed3 + 0.44 * missed1;
  const orb = orbDenominator > 0 ? 100 * (oreb / orbDenominator) : 0.0;

  // 6. AST%
  const astDenominator = fga + 0.44 * t1i + per;
  const ast = astDenominator > 0 ? 100 * (asis / astDenominator) : 0.0;

  // 7. TOV%
  const tov = posesiones > 0 ? 100 * (per / posesiones) : 0.0;

  // 8. FTR
  const ftr = fga > 0 ? 100 * (t1a / fga) : 0.0;

  return {
    posesiones,
    oer,
    der,
    efg,
    orb,
    ast,
    tov,
    ftr,
  };
}

/**
 * Aggregates individual player statistics into raw team totals.
 */
export function aggregateTeamTotals(
  players: PlayerRosterItem[],
  totalRivalPoints: number
): RawTeamTotals {
  const totals: RawTeamTotals = {
    totalPoints: 0,
    totalRivalPoints,
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

  for (const p of players) {
    totals.totalPoints += Number(p.points || 0);
    totals.t1a += Number(p.t1a || 0);
    totals.t1i += Number(p.t1i || 0);
    totals.t2a += Number(p.t2a || 0);
    totals.t2i += Number(p.t2i || 0);
    totals.t3a += Number(p.t3a || 0);
    totals.t3i += Number(p.t3i || 0);
    totals.oreb += Number(p.oreb || 0);
    totals.dreb += Number(p.dreb || 0);
    totals.asis += Number(p.asis || 0);
    totals.rec += Number(p.rec || 0);
    totals.per += Number(p.per || 0);
    totals.falt += Number(p.falt || 0);
  }

  return totals;
}
