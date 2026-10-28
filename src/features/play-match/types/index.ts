/**
 * Feature 007: Play Match View
 * Type definitions and component contracts synchronized from contracts/play-match-contracts.ts
 */

import { Game } from "../../../types/database";

export type PeriodKey = "q1" | "q2" | "q3" | "q4" | "extra";

export interface PeriodData {
  key: PeriodKey;
  label: string; // "Q1", "Q2", "Q3", "Q4", "EXTRA"
  remainingSeconds: number; // 600 for Q1-Q4 (10min), 300 for EXTRA (5min)
  teamScore: number;
  rivalScore: number;
  teamFouls: number;
  rivalFouls: number;
  isCompleted: boolean;
}

export interface InGamePlayer {
  id: number;
  firstName: string;
  lastName: string;
  number?: string | null;
  jerseyName?: string | null;
  position?: string | null;
  isOnCourt: boolean;
  courtPositionIndex?: number | null; // 0..4 for position on court
  secondsPlayed: number; // Cumulative total seconds played across all stints (for DB box scores)
  stintSeconds: number; // Continuous seconds played in current on-court stint (displayed on court circles)
  t1a: number; // 1pt made
  t1i: number; // 1pt missed
  t2a: number; // 2pt made
  t2i: number; // 2pt missed
  t3a: number; // 3pt made
  t3i: number; // 3pt missed
  oreb: number; // Offensive rebound
  dreb: number; // Defensive rebound
  asis: number; // Assists
  rec: number; // Ball recuperation (steals)
  per: number; // Ball lost (turnovers)
  falt: number; // Personal fouls
  valuation: number;
}

/**
 * Historical record of a scoring event with assist linkage
 * Used for automatic cascading assist subtraction.
 */
export interface ScoreEventLink {
  id: string;
  scoringPlayerId: number;
  period: PeriodKey;
  shotType: "t2a" | "t3a";
  points: 2 | 3;
  assistingPlayerId?: number | null;
  timestamp: number;
}

export interface TimeoutBudget {
  firstHalfRemaining: number; // Initialized to 2 (shared for q1 & q2)
  secondHalfRemaining: number; // Initialized to 3 (shared for q3 & q4)
  extraTimeRemaining: number; // Initialized to 1, +1 per crono reset
}

export interface SwapState {
  isSwapMode: boolean;
  selectedCourtPlayerIds: number[];
  selectedBenchPlayerIds: number[];
}

export type StatActionType =
  | "t1a"
  | "t1i"
  | "t2a"
  | "t2i"
  | "t3a"
  | "t3i"
  | "oreb"
  | "dreb"
  | "fault"
  | "asis"
  | "lost"
  | "recovers";

// ==========================================
// Component 1: Time, Score & Fouls Controller
// ==========================================
export interface TimeScoreFoulsControllerProps {
  activePeriod: PeriodKey;
  periodData: PeriodData;
  totalTeamScore: number;
  totalRivalScore: number;
  isTimerRunning: boolean;
  onNextPeriod: () => void;
  onOpenPeriodSelectModal: () => void;
  onToggleTimer: () => void;
  onOpenManualTimeModal: () => void;
}

// ==========================================
// Component 2: Team Management & Court Canvas
// ==========================================
export interface TeamManagementCanvasProps {
  courtPlayers: (InGamePlayer | null)[]; // Exactly 5 slots (or null if unassigned)
  benchPlayers: InGamePlayer[];
  isSwapMode: boolean;
  isTimerRunning: boolean;
  selectedCourtPlayerIds: number[];
  selectedBenchPlayerIds: number[];
  availableTimeouts: number;
  onSelectCourtPosition: (positionIndex: number, player: InGamePlayer | null) => void;
  onLongPressCourtPosition?: (positionIndex: number, player: InGamePlayer) => void; // 2-second hold listener for stat subtraction
  onSelectBenchPlayer: (player: InGamePlayer) => void;
  onToggleSwapMode: () => void;
  onConfirmSwap: () => void;
  onCancelSwap: () => void;
  onIncreaseTimeout: () => void;
  onDecreaseTimeout: () => void;
}

export interface ResponsiveCourtLayout {
  width: number;
  height: number;
  scaleFactor: number;
  positions: { index: number; x: number; y: number }[];
}

export interface HalfCourtCanvasProps {
  courtPlayers: (InGamePlayer | null)[];
  isSwapMode: boolean;
  selectedCourtPlayerIds: number[];
  onSelectCourtPosition: (positionIndex: number, player: InGamePlayer | null) => void;
  onLongPressCourtPosition?: (positionIndex: number, player: InGamePlayer) => void; // 2-second hold listener for stat subtraction
  layout?: ResponsiveCourtLayout;
}

export interface TeamManagementPanelProps {
  benchPlayers: InGamePlayer[];
  isSwapMode: boolean;
  isTimerRunning: boolean;
  selectedCourtCount: number;
  selectedBenchPlayerIds: number[];
  availableTimeouts: number;
  onSelectBenchPlayer: (player: InGamePlayer) => void;
  onToggleSwapMode: () => void;
  onConfirmSwap: () => void;
  onCancelSwap: () => void;
  onIncreaseTimeout: () => void;
  onDecreaseTimeout: () => void;
}

// ==========================================
// Component 3: Rival Panel Control (Full-Width, No Duplicate Total Score)
// ==========================================
export interface RivalPanelControlProps {
  activePeriod: PeriodKey;
  rivalPeriodScore?: number;
  rivalPeriodFouls?: number;
  totalRivalScore?: number; // Optional backwards compatibility if needed
  onAdjustRivalScore: (points: number) => void; // +1, +2, +3, -1
  onAdjustRivalFouls: (delta: number) => void; // +1, -1
}

// ==========================================
// Modals Contracts
// ==========================================
export interface PlayerStatsModalProps {
  visible: boolean;
  player: InGamePlayer | null;
  courtTeammates: InGamePlayer[];
  onClose: () => void;
  onRecordStat: (
    playerId: number,
    statType: StatActionType,
    assistingPlayerId?: number | null // null for "non assistant"
  ) => void;
}

export interface PlayerStatSubtractionModalProps {
  visible: boolean;
  player: InGamePlayer | null;
  onClose: () => void;
  onSubtractStat: (playerId: number, statType: StatActionType) => void;
}

export interface PeriodSelectModalProps {
  visible: boolean;
  currentPeriod: PeriodKey;
  onSelectPeriod: (period: PeriodKey) => void;
  onClose: () => void;
}

export interface ManualTimeModalProps {
  visible: boolean;
  currentSeconds: number;
  periodKey: PeriodKey;
  onSaveTime: (newSeconds: number) => void;
  onClose: () => void;
  onResetExtraTimeCrono?: () => void;
}

export interface QuickAssignPlayerModalProps {
  visible: boolean;
  targetPositionIndex?: number | null;
  positionIndex?: number;
  benchPlayers?: InGamePlayer[];
  availableBenchPlayers?: InGamePlayer[];
  onAssignPlayer: (playerId: number, positionIndex: number) => void;
  onClose: () => void;
}

export interface StartingFiveModalProps {
  visible: boolean;
  roster: InGamePlayer[];
  onConfirmStartingFive: (selectedPlayerIds: number[]) => void;
}

// ==========================================
// Page Root Container Props
// ==========================================
export interface PlayMatchProps {
  match: Game;
  onFinishMatch: () => void;
  onReturn: () => void;
}

export interface BenchPlayerStatsModalProps {
  visible: boolean;
  player: InGamePlayer | null;
  onClose: () => void;
}

// ==========================================
// Player Identification Contract
// ==========================================
export interface PlayerIdentifierInput {
  number?: string | null;
  jerseyName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export type FormatPlayerIdentifierFn = (player: PlayerIdentifierInput) => string;

// ==========================================
// Throw Statistics Formatting Contract
// ==========================================
export interface ThrowStatBreakdown {
  category: "1pt" | "2pt" | "3pt";
  succeed: number;
  missed: number;
  attempts: number;
  percentage: number;
  formatted: string; // e.g. "4/5 (80%)" or "0/0 (0%)"
}

export type FormatThrowStatFn = (succeed: number, missed: number) => string;

export * from "./cache";
