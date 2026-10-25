/**
 * Type and Interface Contracts for Matches & New Match Workflow
 * (Includes Date-Only Auto-Masking & On-Demand Match List Roster Management)
 */

import { Game, Player } from "../../../src/types/database";

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
  /**
   * Auto-formats raw numeric text into dd/mm/aaaa structure, stripping non-numeric characters.
   */
  applyDateMask: (rawText: string) => string;

  /**
   * Validates calendar boundaries, month length, leap years, and dd/mm/aaaa format.
   */
  validateMatchDate: (value: string) => DateValidationResult;

  /**
   * Parses dd/mm/aaaa (or legacy dd/mm/aaaa - hh:mm) into a JavaScript Date instance.
   */
  parseMatchDate: (value: string) => Date | null;
}

export interface GameCardsProps {
  games: Game[];
  onSelect: (game: Game) => void;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
  onSelectRoster?: (game: Game) => void;
}

export interface RosterSelectionModalProps {
  visible: boolean;
  isMandatory: boolean; // false for creation flow or on-demand editing, true for start match flow
  title?: string;
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

export interface PlayMatchProps {
  matchId: number;
  onFinishMatch: () => void;
  onReturn: () => void;
}

export interface MatchStateTransitionContract {
  /**
   * Transition match from 'pending' to 'inProgress' upon starting the chronograph.
   */
  startMatch: (matchId: number) => Promise<boolean>;

  /**
   * Transition match from 'inProgress' to 'finished' upon saving final match results.
   */
  finishMatch: (matchId: number, finalScores?: Record<string, number>) => Promise<boolean>;
}

export interface MatchRosterActionContract {
  /**
   * Retrieves current called-up players for a specific match.
   */
  getRosterForMatch: (matchId: number) => Promise<Player[]>;

  /**
   * Persists the updated roster player IDs for an upcoming match.
   */
  saveRosterForMatch: (matchId: number, playerIds: number[]) => Promise<void>;

  /**
   * Determines if the roster button should be enabled based on match status.
   */
  isRosterButtonEnabled: (status?: string | null) => boolean;
}
