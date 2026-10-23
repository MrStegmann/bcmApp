/**
 * UI and State Contracts for Home View Feature
 * Feature: 011-update-home-view
 */

import type { Game, Player } from "../../../src/types/database";

export interface PeriodScoreItem {
  period: "Q1" | "Q2" | "Q3" | "Q4" | "OT";
  teamScore: number;
  rivalScore: number;
}

export interface NextMatchEntry {
  id: number;
  teamId: number;
  opponent: string;
  date: string;
  round: string;
  status: "pending";
  hasRoster: boolean;
}

export interface RecentMatchSummary {
  id: number;
  teamId: number;
  opponent: string;
  date: string;
  round: string;
  status: "finished";
  teamTotalScore: number;
  rivalTotalScore: number;
  isWinning: boolean;
  periods: PeriodScoreItem[];
}

export interface GlobalTeamAverages {
  posesiones: number;
  oer: number;
  der: number;
  efg: number;
  orb: number;
  ast: number;
  tov: number;
  ftr: number;
  completedMatchesCount: number;
}

// Component Prop Contracts
export interface HomeViewProps {
  teamId?: number;
  onSelectMatch?: (match: Game) => void;
  onNavigateToGames?: () => void;
}

export interface NextMatchCardProps {
  nextMatch: NextMatchEntry | null;
  onConfigureRoster: (match: NextMatchEntry) => void;
}

export interface RecentMatchesColumnProps {
  matches: RecentMatchSummary[];
  onSelectMatch: (matchId: number) => void;
}

export interface RecentMatchCardProps {
  match: RecentMatchSummary;
  onPress: () => void;
}

export interface GlobalStatsCardProps {
  stats: GlobalTeamAverages;
}

// Store Interface Contract
export interface HomeViewState {
  teamId: number | null;
  nextMatch: NextMatchEntry | null;
  recentMatches: RecentMatchSummary[];
  globalStats: GlobalTeamAverages;
  allGames: Game[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadDashboard: (teamId: number) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  saveRosterCallup: (gameId: number, playerIds: number[]) => Promise<void>;
}
