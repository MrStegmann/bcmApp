export type MatchStatus = "pending" | "inProgress" | "finished";

export enum MatchStatusEnum {
  PENDING = "pending",
  IN_PROGRESS = "inProgress",
  FINISHED = "finished",
}

export interface MatchFormData {
  round: string;
  timeStamp: string; // Format: "dd/mm/aaaa - hh:mm"
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
  startMatch: (matchId: number) => Promise<boolean>;
  finishMatch: (matchId: number, finalScores?: Record<string, number>) => Promise<boolean>;
}
