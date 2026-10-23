import { PlayerStat } from "../../../types/database";
import { GlobalTeamAverages } from "../types";

export interface GameStatsRecord {
  gameId: number;
  totalPoints: number;
  totalRivalPoints: number;
  playerStats: PlayerStat[];
}

export interface MetricSummaryItem {
  key: keyof Omit<GlobalTeamAverages, "completedMatchesCount">;
  label: string;
  name: string;
  value: number;
  formattedValue: string;
  isPercentage: boolean;
  benchmarkDescription: string;
}

/**
 * Computes the 8 advanced efficiency metrics for a single match:
 * 1. Posesiones = 0.96 * (2PA + 3PA + 0.44 * 1PA + OREB - PER)
 * 2. OER = (Total Points / Posesiones) * 100
 * 3. DER = (Total Rival Points / Posesiones) * 100
 * 4. eFG% = 100 * ((2PM + 3PM + 0.5 * 3PM) / (2PA + 3PA))
 * 5. ORB% = 100 * (OREB / ((2PA - 2PM) + (3PA - 3PM) + 0.44 * (1PA - 1PM)))
 * 6. AST% = 100 * (AST / (2PA + 3PA + 0.44 * 1PA + PER))
 * 7. TOV% = 100 * (PER / Posesiones)
 * 8. FTR = 100 * (1PM / (2PA + 3PA))
 */
export function computeGameAdvancedMetrics(
  playerStatsList: PlayerStat[],
  totalPoints: number,
  totalRivalPoints: number
): {
  posesiones: number;
  oer: number;
  der: number;
  efg: number;
  orb: number;
  ast: number;
  tov: number;
  ftr: number;
} {
  let t1a = 0;
  let t1i = 0;
  let t2a = 0;
  let t2i = 0;
  let t3a = 0;
  let t3i = 0;
  let oreb = 0;
  let asis = 0;
  let per = 0;

  for (const s of playerStatsList) {
    t1a += Number(s.t1a || 0);
    t1i += Number(s.t1i || 0);
    t2a += Number(s.t2a || 0);
    t2i += Number(s.t2i || 0);
    t3a += Number(s.t3a || 0);
    t3i += Number(s.t3i || 0);
    oreb += Number(s.oreb || 0);
    asis += Number(s.asis || 0);
    per += Number(s.per || 0);
  }

  // 1. Posesiones (total)
  const fga = t2i + t3i;
  const rawPos = 0.96 * (fga + 0.44 * t1i + oreb - per);
  const posesiones = Math.max(0, rawPos);

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
 * Computes arithmetic average across completed games for each of the 8 metrics.
 * Returns safe zeros if games list is empty.
 */
export function computeGlobalAverages(gameRecords: GameStatsRecord[]): GlobalTeamAverages {
  const count = gameRecords.length;
  if (count === 0) {
    return {
      posesiones: 0,
      oer: 0,
      der: 0,
      efg: 0,
      orb: 0,
      ast: 0,
      tov: 0,
      ftr: 0,
      completedMatchesCount: 0,
    };
  }

  let sumPos = 0;
  let sumOer = 0;
  let sumDer = 0;
  let sumEfg = 0;
  let sumOrb = 0;
  let sumAst = 0;
  let sumTov = 0;
  let sumFtr = 0;

  for (const record of gameRecords) {
    const m = computeGameAdvancedMetrics(
      record.playerStats,
      record.totalPoints,
      record.totalRivalPoints
    );
    sumPos += m.posesiones;
    sumOer += m.oer;
    sumDer += m.der;
    sumEfg += m.efg;
    sumOrb += m.orb;
    sumAst += m.ast;
    sumTov += m.tov;
    sumFtr += m.ftr;
  }

  return {
    posesiones: sumPos / count,
    oer: sumOer / count,
    der: sumDer / count,
    efg: sumEfg / count,
    orb: sumOrb / count,
    ast: sumAst / count,
    tov: sumTov / count,
    ftr: sumFtr / count,
    completedMatchesCount: count,
  };
}

/**
 * Formats metric value with percentage or standard decimal.
 */
export function formatMetricValue(value: number, isPercentage: boolean): string {
  const safeVal = isNaN(value) || !isFinite(value) ? 0 : value;
  if (isPercentage) {
    return `${safeVal.toFixed(1)}%`;
  }
  return safeVal.toFixed(1);
}

/**
 * Returns structured metrics summary list with benchmark guides for presentation.
 */
export function getMetricSummaryItems(stats: GlobalTeamAverages): MetricSummaryItem[] {
  return [
    {
      key: "posesiones",
      label: "POS",
      name: "Posesiones",
      value: stats.posesiones,
      formattedValue: formatMetricValue(stats.posesiones, false),
      isPercentage: false,
      benchmarkDescription: "Ritmo de juego por partido",
    },
    {
      key: "oer",
      label: "OER",
      name: "Eficiencia Ofensiva",
      value: stats.oer,
      formattedValue: formatMetricValue(stats.oer, false),
      isPercentage: false,
      benchmarkDescription: "Puntos anotados por 100 posesiones (>100 bueno)",
    },
    {
      key: "der",
      label: "DER",
      name: "Eficiencia Defensiva",
      value: stats.der,
      formattedValue: formatMetricValue(stats.der, false),
      isPercentage: false,
      benchmarkDescription: "Puntos recibidos por 100 posesiones (<100 bueno)",
    },
    {
      key: "efg",
      label: "eFG%",
      name: "Tiro Efectivo",
      value: stats.efg,
      formattedValue: formatMetricValue(stats.efg, true),
      isPercentage: true,
      benchmarkDescription: "Efectividad ajustada por triples (>50% bueno)",
    },
    {
      key: "orb",
      label: "ORB%",
      name: "Rebote Ofensivo",
      value: stats.orb,
      formattedValue: formatMetricValue(stats.orb, true),
      isPercentage: true,
      benchmarkDescription: "% rebotes ofensivos sobre disponibles (>30%)",
    },
    {
      key: "ast",
      label: "AST%",
      name: "Asistencias",
      value: stats.ast,
      formattedValue: formatMetricValue(stats.ast, true),
      isPercentage: true,
      benchmarkDescription: "% posesiones finalizadas en asistencia",
    },
    {
      key: "tov",
      label: "TOV%",
      name: "Pérdidas",
      value: stats.tov,
      formattedValue: formatMetricValue(stats.tov, true),
      isPercentage: true,
      benchmarkDescription: "Pérdidas de balón por 100 posesiones (<15%)",
    },
    {
      key: "ftr",
      label: "FTR",
      name: "Frecuencia Libres",
      value: stats.ftr,
      formattedValue: formatMetricValue(stats.ftr, true),
      isPercentage: true,
      benchmarkDescription: "Tiros libres anotados por tiros de campo",
    },
  ];
}
