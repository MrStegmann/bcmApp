/**
 * Type and Interface Contracts for Matches & New Match Workflow
 */

export type MatchStatus = "pending" | "inProgress" | "finished";

export interface MatchFormData {
  round: string;
  timeStamp: string; // "dd/mm/aaaa - hh:mm"
  rivalTeamName: string;
  teamId: number;
}

export interface MatchFormValidationErrors {
  round?: string;
  timeStamp?: string;
  rivalTeamName?: string;
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
