import { Game } from "../../../types/database";
import {
  PeriodBreakdownItem,
  PlayerRosterItem,
  AdvancedTeamStats,
  MatchShareGraphicData,
  FormattedPlayerBoxScore,
  FormattedTeamTotals,
  FormattedPeriodScore,
  FormattedAdvancedStats,
} from "../types";

export interface FormatMatchShareDataParams {
  match: Game;
  teamName: string;
  periods: PeriodBreakdownItem[];
  players: PlayerRosterItem[];
  advancedStats: AdvancedTeamStats;
}

function formatSafePercentage(made: number, attempts: number): string {
  if (!attempts || attempts <= 0 || !made || made <= 0) {
    return "0%";
  }
  const pct = Math.round((made / attempts) * 100);
  return `${pct}%`;
}

function formatSafeNumber(value: number | undefined | null, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value) || !isFinite(value) || value <= 0) {
    return (0).toFixed(decimals);
  }
  return value.toFixed(decimals);
}

function formatSafePercentMetric(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value) || !isFinite(value) || value <= 0) {
    return "0.0%";
  }
  return `${value.toFixed(1)}%`;
}

export function formatPeriodCode(id: string, label: string): string {
  switch (id) {
    case "q1":
      return "C1";
    case "q2":
      return "C2";
    case "q3":
      return "C3";
    case "q4":
      return "C4";
    case "extra":
      return "Extra";
    default:
      if (label.includes("1")) return "C1";
      if (label.includes("2")) return "C2";
      if (label.includes("3")) return "C3";
      if (label.includes("4")) return "C4";
      if (label.toLowerCase().includes("extra")) return "Extra";
      return label;
  }
}

/**
 * Sanitizes a string for use as a safe filename component.
 * Removes illegal filesystem characters (\ / : * ? " < > |),
 * collapses whitespace and underscores, and trims edges.
 */
export function sanitizeFileNamePart(part?: string | null): string {
  if (!part) return "";
  return part
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Formats a PNG share image filename based on the rival team and match round:
 * e.g., "CB_Granollers_Jornada_4.png", "CB_Prat_Jornada_1.png", or "Rival_Jornada_1.png".
 */
export function formatShareImageFileName(
  opponent?: string | null,
  round?: string | number | null
): string {
  const sanitizedOpponent = sanitizeFileNamePart(opponent) || "Rival";

  let roundStr = "";
  if (round !== undefined && round !== null) {
    const rawRound = String(round).trim();
    if (rawRound.length > 0) {
      if (/^\d+$/.test(rawRound)) {
        roundStr = `Jornada_${rawRound}`;
      } else {
        roundStr = sanitizeFileNamePart(rawRound);
      }
    }
  }

  const baseName = roundStr ? `${sanitizedOpponent}_${roundStr}` : sanitizedOpponent;
  return `${baseName}.png`;
}

export function formatMatchShareData(params: FormatMatchShareDataParams): MatchShareGraphicData {
  const { match, teamName, periods, players, advancedStats } = params;

  // 1. Header Metadata
  const homeTeamName = teamName || "Mi Equipo";
  const rivalTeamName = match.opponent || "Rival";

  let roundAndDate = "";
  if (match.round && match.date) {
    roundAndDate = `${match.round} - ${match.date}`;
  } else if (match.round) {
    roundAndDate = match.round;
  } else if (match.date) {
    roundAndDate = match.date;
  } else {
    roundAndDate = "Partido";
  }

  // 2. Players Box Score
  const formattedPlayers: FormattedPlayerBoxScore[] = players.map((p) => {
    const minutes = Number(p.minutes || 0);
    const seconds = Number(p.seconds || 0);
    const t1a = Number(p.t1a || 0);
    const t1i = Number(p.t1i || 0);
    const t2a = Number(p.t2a || 0);
    const t2i = Number(p.t2i || 0);
    const t3a = Number(p.t3a || 0);
    const t3i = Number(p.t3i || 0);
    const dreb = Number(p.dreb || 0);
    const oreb = Number(p.oreb || 0);
    const treb = dreb + oreb;
    const asis = Number(p.asis || 0);
    const rec = Number(p.rec || 0);
    const per = Number(p.per || 0);
    const falt = Number(p.falt || 0);
    const pts = p.points !== undefined ? Number(p.points) : t1a * 1 + t2a * 2 + t3a * 3;
    const val = Number(p.valuation || 0);

    return {
      jerseyNumber: p.jerseyNumber || "-",
      playerName: p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Jugador",
      minutes,
      seconds,
      pts,
      t2a,
      t2i,
      t2p: formatSafePercentage(t2a, t2i),
      t3a,
      t3i,
      t3p: formatSafePercentage(t3a, t3i),
      t1a,
      t1i,
      t1p: formatSafePercentage(t1a, t1i),
      dreb,
      oreb,
      treb,
      asis,
      rec,
      per,
      tapF: 0,
      tapC: 0,
      falt,
      faltR: 0,
      val,
    };
  });

  // 3. Team Totals (EQUIPO)
  let totalMinutes = 0;
  let totalPts = 0;
  let totalT2a = 0;
  let totalT2i = 0;
  let totalT3a = 0;
  let totalT3i = 0;
  let totalT1a = 0;
  let totalT1i = 0;
  let totalDreb = 0;
  let totalOreb = 0;
  let totalTreb = 0;
  let totalAsis = 0;
  let totalRec = 0;
  let totalPer = 0;
  let totalFalt = 0;
  let totalVal = 0;

  for (const row of formattedPlayers) {
    totalMinutes += row.minutes;
    totalPts += row.pts;
    totalT2a += row.t2a;
    totalT2i += row.t2i;
    totalT3a += row.t3a;
    totalT3i += row.t3i;
    totalT1a += row.t1a;
    totalT1i += row.t1i;
    totalDreb += row.dreb;
    totalOreb += row.oreb;
    totalTreb += row.treb;
    totalAsis += row.asis;
    totalRec += row.rec;
    totalPer += row.per;
    totalFalt += row.falt;
    totalVal += row.val;
  }

  const totals: FormattedTeamTotals = {
    label: "EQUIPO",
    minutes: totalMinutes,
    pts: totalPts,
    t2a: totalT2a,
    t2i: totalT2i,
    t2p: formatSafePercentage(totalT2a, totalT2i),
    t3a: totalT3a,
    t3i: totalT3i,
    t3p: formatSafePercentage(totalT3a, totalT3i),
    t1a: totalT1a,
    t1i: totalT1i,
    t1p: formatSafePercentage(totalT1a, totalT1i),
    dreb: totalDreb,
    oreb: totalOreb,
    treb: totalTreb,
    asis: totalAsis,
    rec: totalRec,
    per: totalPer,
    tapF: 0,
    tapC: 0,
    falt: totalFalt,
    faltR: 0,
    val: totalVal,
  };

  // 4. Period Scores Breakdown
  let sumHomeScore = 0;
  let sumRivalScore = 0;

  const formattedPeriods: FormattedPeriodScore[] = periods.map((period) => {
    const homeScore = Number(period.teamPoints || 0);
    const rivalScore = Number(period.rivalPoints || 0);
    sumHomeScore += homeScore;
    sumRivalScore += rivalScore;

    return {
      period: formatPeriodCode(period.id, period.label),
      homeScore,
      rivalScore,
    };
  });

  formattedPeriods.push({
    period: "Final",
    homeScore: sumHomeScore,
    rivalScore: sumRivalScore,
  });

  // 5. Advanced Metrics Block
  const formattedAdvancedStats: FormattedAdvancedStats = {
    posesiones: formatSafeNumber(advancedStats.posesiones, 1),
    oer: formatSafeNumber(advancedStats.oer, 1),
    der: formatSafeNumber(advancedStats.der, 1),
    efg: formatSafePercentMetric(advancedStats.efg),
    orb: formatSafePercentMetric(advancedStats.orb),
    ast: formatSafePercentMetric(advancedStats.ast),
    tov: formatSafePercentMetric(advancedStats.tov),
    tlr: formatSafePercentMetric(advancedStats.ftr),
  };

  return {
    homeTeamName,
    rivalTeamName,
    roundAndDate,
    players: formattedPlayers,
    totals,
    periods: formattedPeriods,
    advancedStats: formattedAdvancedStats,
  };
}
