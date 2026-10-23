/**
 * Contract: Player API & Form Interfaces
 * Defines the public interfaces for player creation, updates, and store interactions.
 */

export interface PlayerContract {
  id: number;
  teamId: number;
  firstName: string;
  lastName: string;
  number: string;
  jerseyName?: string | null;
  createdAt: string;
}

export interface PlayerFormData {
  id?: number;
  teamId: number;
  firstName: string;
  lastName: string;
  number: string;
  jerseyName?: string | null;
}

export interface PlayerFormProps {
  onSubmit: (data: PlayerFormData) => void;
  onCancel?: () => void;
  playerData?: Partial<PlayerContract> | null;
}

export interface PlayerControllerInterface {
  getAll: (teamId?: number) => Promise<PlayerContract[]>;
  load: (cb?: (playersList: PlayerContract[]) => void, teamId?: number) => Promise<PlayerContract[]>;
  loadStats: (playerId: number, cb?: (statsList: any[]) => void) => Promise<any[]>;
  loadPlayedMatches: (playerId: number) => Promise<PlayedMatchContract[]>;
  add: (data: PlayerFormData) => Promise<PlayerContract | null>;
  edit: (id: number, data: Partial<PlayerFormData>) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
}

export interface PlayedMatchContract {
  gameId: number;
  opponent: string;
  round: string;
  date: string;
  status: string;
  resultC1?: number | null;
  resultC2?: number | null;
  resultC3?: number | null;
  resultC4?: number | null;
  resultExtra?: number | null;
  resultC1Opponent?: number | null;
  resultC2Opponent?: number | null;
  resultC3Opponent?: number | null;
  resultC4Opponent?: number | null;
  resultExtraOpponent?: number | null;
}
