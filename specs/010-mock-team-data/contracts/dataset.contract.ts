import { MatchStatus } from "../../../src/types/match";

/**
 * Tactical basketball positions supported by the application.
 */
export type BasketballPosition =
  | "Point Guard"
  | "Shooting Guard"
  | "Small Forward"
  | "Power Forward"
  | "Center"
  | "Base"
  | "Escolta"
  | "Alero"
  | "Ala-Pívot"
  | "Pívot";

/**
 * Representation of a player's profile in the mock dataset.
 */
export interface MockPlayerConfig {
  firstName: string;
  lastName: string;
  number: string;
  position: BasketballPosition;
  notes?: string;
}

/**
 * Representation of an individual player box score for a finished game.
 */
export interface MockPlayerStatConfig {
  playerNumber: string; // Used to resolve foreign key to player by jersey number
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
  valuation: number;
}

/**
 * Representation of a mock game fixture.
 */
export interface MockGameConfig {
  opponent: string;
  round: string;
  date: string; // Format: "DD/MM/YYYY - HH:MM"
  status: MatchStatus;
  // Team scores & fouls
  resultC1?: number;
  resultC2?: number;
  resultC3?: number;
  resultC4?: number;
  resultExtra?: number;
  foulsC1?: number;
  foulsC2?: number;
  foulsC3?: number;
  foulsC4?: number;
  foulsExtra?: number;
  // Opponent scores & fouls
  resultC1Opponent?: number;
  resultC2Opponent?: number;
  resultC3Opponent?: number;
  resultC4Opponent?: number;
  resultExtraOpponent?: number;
  foulsC1Opponent?: number;
  foulsC2Opponent?: number;
  foulsC3Opponent?: number;
  foulsC4Opponent?: number;
  foulsExtraOpponent?: number;
  // Box score player stats (required if status === 'finished')
  playerStats?: MockPlayerStatConfig[];
}

/**
 * Representation of a team and its complete associated dataset.
 */
export interface MockTeamDatasetConfig {
  name: string;
  category: string;
  players: MockPlayerConfig[];
  games: MockGameConfig[];
}
