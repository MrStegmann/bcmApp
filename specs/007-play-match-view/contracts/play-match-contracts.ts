/**
 * Play Match View - Interface & Type Contracts
 * Spec: 007-play-match-view
 */

import { Game } from "../../../src/types/database";

export type PeriodKey = "q1" | "q2" | "q3" | "q4" | "extra";

export interface PeriodData {
  key: PeriodKey;
  label: string;             // "Q1", "Q2", "Q3", "Q4", "EXTRA"
  remainingSeconds: number;  // 600 for Q1-Q4 (10min), 300 for EXTRA (5min)
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
  position?: string | null;
  isOnCourt: boolean;
  courtPositionIndex?: number | null; // 0..4 for position on court
  secondsPlayed: number;
  t1a: number; // 1pt made
  t1i: number; // 1pt missed
  t2a: number; // 2pt made
  t2i: number; // 2pt missed
  t3a: number; // 3pt made
  t3i: number; // 3pt missed
  oreb: number; // Offensive rebound
  dreb: number; // Defensive rebound
  asis: number; // Assists
  rec: number;  // Ball recuperation (steals)
  per: number;  // Ball lost (turnovers)
  falt: number; // Personal fouls
  valuation: number;
}

export interface TimeoutBudget {
  firstHalfRemaining: number;  // Initialized to 2 (shared for q1 & q2)
  secondHalfRemaining: number; // Initialized to 3 (shared for q3 & q4)
  extraTimeRemaining: number;  // Initialized to 1, +1 per crono reset
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
  onResetExtraTimeCrono: () => void;
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
  onSelectBenchPlayer: (player: InGamePlayer) => void;
  onToggleSwapMode: () => void;
  onConfirmSwap: () => void;
  onCancelSwap: () => void;
  onIncreaseTimeout: () => void;
  onDecreaseTimeout: () => void;
}

// ==========================================
// Component 3: Rival Panel Control
// ==========================================
export interface RivalPanelControlProps {
  activePeriod: PeriodKey;
  rivalPeriodScore: number;
  rivalPeriodFouls: number;
  totalRivalScore: number;
  onAdjustRivalScore: (points: number) => void; // +1, +2, +3, -1
  onAdjustRivalFouls: (delta: number) => void;  // +1, -1
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

// ==========================================
// Player Identification Contract
// ==========================================
export interface PlayerIdentifierInput {
  number?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export type FormatPlayerIdentifierFn = (player: PlayerIdentifierInput) => string;

