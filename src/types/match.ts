import { Game, Player, PlayerStat } from "./database";

export type MatchStatus = "pending" | "inProgress" | "finished";

export enum MatchStatusEnum {
  PENDING = "pending",
  IN_PROGRESS = "inProgress",
  FINISHED = "finished",
}

export interface MatchFormData {
  round: string;
  date: string; // Format: "dd/mm/aaaa" (e.g. "23/10/2026")
  timeStamp?: string; // Backward compatibility alias matching date
  rivalTeamName: string;
  opponent?: string;
  teamId: number;
}

export interface MatchFormValidationErrors {
  round?: string;
  date?: string;
  timeStamp?: string;
  rivalTeamName?: string;
}

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

export interface DateValidationContract {
  applyDateMask: (rawText: string) => string;
  validateMatchDate: (value: string) => DateValidationResult;
  parseMatchDate: (value: string) => Date | null;
}

export interface RosterSelectionModalProps {
  visible: boolean;
  isMandatory: boolean; // false for creation flow, true for start match flow
  availablePlayers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    number: string | number;
    position?: string | null;
  }>;
  selectedPlayerIds: number[];
  onTogglePlayer: (playerId: number) => void;
  onConfirm: (selectedPlayerIds: number[]) => void;
  onSkip?: () => void;
  onClose: () => void;
}

export interface MatchStateTransitionContract {
  startMatch: (matchId: number) => Promise<boolean>;
  finishMatch: (matchId: number, finalScores?: Record<string, number>) => Promise<boolean>;
}

// -------------------------------------------------------------
// Live Match (Play Match View) Domain Types & Component Contracts
// -------------------------------------------------------------

export type QuarterKey = "c1" | "c2" | "c3" | "c4" | "extra";

export interface InGamePlayer {
  id: number;
  firstName: string;
  lastName: string;
  number: string;
  position?: string | null;
  isOnCourt: boolean;
  secondsPlayed: number;
  t1a: number; // 1pt made (tiros libres anotados)
  t1i: number; // 1pt attempted (tiros libres intentados)
  t2a: number; // 2pt made (tiros de 2 anotados)
  t2i: number; // 2pt attempted (tiros de 2 intentados)
  t3a: number; // 3pt made (tiros de 3 anotados)
  t3i: number; // 3pt attempted (tiros de 3 intentados)
  oreb: number; // rebotes ofensivos
  dreb: number; // rebotes defensivos
  asis: number; // asistencias
  rec: number; // recuperaciones (robos)
  per: number; // perdidas
  falt: number; // faltas personales
  valuation: number; // valoracion
}

export interface QuarterData {
  key: QuarterKey;
  label: string;
  remainingSeconds: number;
  teamScore: number;
  rivalScore: number;
  teamFouls: number;
  rivalFouls: number;
  isCompleted: boolean;
}

export interface TimeoutBudget {
  firstHalfRemaining: number;
  secondHalfRemaining: number;
  extraTimeRemaining: number;
}

export interface PlayMatchProps {
  match: Game;
  onFinishMatch: () => void;
  onReturn: () => void;
}

export interface HalfCourtProps {
  courtPlayers: InGamePlayer[];
  onSelectPlayer: (player: InGamePlayer) => void;
  isChangeMode: boolean;
  selectedPlayerIds: number[];
}

export interface StartingFiveModalProps {
  visible: boolean;
  roster: InGamePlayer[];
  onConfirmStartingFive: (selectedPlayerIds: number[]) => void;
}

export type StatActionType =
  | "t1"
  | "t2"
  | "t3"
  | "fault"
  | "oreb"
  | "dreb"
  | "rec"
  | "per"
  | "asis";

export interface PlayerStatsModalProps {
  visible: boolean;
  player: InGamePlayer | null;
  onClose: () => void;
  onRecordStat: (
    playerId: number,
    statType: StatActionType,
    scored?: boolean,
    assistingPlayerId?: number | null
  ) => void;
  courtTeammates: InGamePlayer[];
}

export interface RivalControlPanelProps {
  activeQuarterKey: QuarterKey;
  rivalQuarterScore: number;
  rivalQuarterFouls: number;
  totalRivalScore: number;
  onAdjustRivalScore: (points: number) => void;
  onAdjustRivalFouls: (delta: number) => void;
}

export interface SubstitutionPanelProps {
  isChangeMode: boolean;
  isTimerRunning: boolean;
  onToggleChangeMode: () => void;
  benchPlayers: InGamePlayer[];
  selectedCourtIds: number[];
  selectedBenchIds: number[];
  onToggleBenchPlayer: (playerId: number) => void;
  onConfirmSubstitution: () => void;
  onCancelSubstitution: () => void;
}
