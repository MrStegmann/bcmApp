import { Game, Player } from "../../../types/database";

export type PeriodKey = "q1" | "q2" | "q3" | "q4" | "extra";

export interface PeriodScoreInput {
  teamPoints: number;
  teamFouls: number;
  rivalPoints: number;
  rivalFouls: number;
}

export interface PlayerStatInput {
  playerId: number;
  statId?: number;
  minutes: number;
  t1a: number;
  t1i: number;
  t2a: number;
  t2i: number;
  t3a: number;
  t3i: number;
  oreb: number;
  dreb: number;
  asis: number;
  rec: number;
  per: number;
  falt: number;
}

export interface DirectResultBuffer {
  periods: Record<PeriodKey, PeriodScoreInput>;
  players: Record<number, PlayerStatInput>;
  hasExtraTime: boolean;
}

export interface DirectResultModalProps {
  visible: boolean;
  match: Game | null;
  availablePlayers: Player[];
  onSave: (matchId: number, buffer: DirectResultBuffer) => Promise<boolean | void>;
  onClose: () => void;
  isSaving?: boolean;
}

export interface PeriodScoresSectionProps {
  buffer: DirectResultBuffer;
  hasExtraTime: boolean;
  onToggleExtraTime: (enabled: boolean) => void;
  onUpdatePeriod: (
    period: PeriodKey,
    field: keyof PeriodScoreInput,
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
    field: keyof Omit<PlayerStatInput, "playerId" | "statId">,
    value: string
  ) => void;
}
