/**
 * Calculation Contract for Global Team Advanced Statistics
 * Feature: 011-update-home-view
 */

import type { PlayerStat } from "../../../src/types/database";
import type { GlobalTeamAverages } from "./home-view.contract";

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

export interface StatsCalculatorContract {
  /**
   * Computes the 8 advanced efficiency metrics for a single match.
   */
  computeGameAdvancedMetrics(
    playerStats: PlayerStat[],
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
  };

  /**
   * Computes the arithmetic mean across all completed matches for the 8 metrics.
   * If matches is empty, returns all zeros safely without NaN/Infinity.
   */
  computeGlobalAverages(gameRecords: GameStatsRecord[]): GlobalTeamAverages;
}
