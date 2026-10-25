/**
 * DirectResultModal Component Contract
 * Feature: 017-set-completed-match
 */

import { Game, Player } from "../../../src/types/database";
import { DirectResultBuffer } from "../../../src/features/direct-result/types";

export interface DirectResultModalProps {
  /**
   * Controls modal visibility
   */
  visible: boolean;

  /**
   * The pending game to set result for
   */
  match: Game | null;

  /**
   * Team roster players available for recording statistics
   */
  availablePlayers: Player[];

  /**
   * Callback invoked when user confirms and saves the direct result
   */
  onSave: (matchId: number, buffer: DirectResultBuffer) => Promise<boolean | void>;

  /**
   * Callback invoked when user cancels or dismisses the modal without changes
   */
  onClose: () => void;

  /**
   * Indicates whether async saving operation is in progress
   */
  isSaving?: boolean;
}

export interface PeriodScoresSectionProps {
  buffer: DirectResultBuffer;
  hasExtraTime: boolean;
  onToggleExtraTime: (enabled: boolean) => void;
  onUpdatePeriod: (
    period: "q1" | "q2" | "q3" | "q4" | "extra",
    field: "teamPoints" | "teamFouls" | "rivalPoints" | "rivalFouls",
    value: string
  ) => void;
  totalTeamPoints: number;
  totalRivalPoints: number;
}

export interface PlayerStatsSectionProps {
  players: Player[];
  playerStats: DirectResultBuffer["players"];
  onUpdateStat: (
    playerId: number,
    field: keyof DirectResultBuffer["players"][number],
    value: string
  ) => void;
}
