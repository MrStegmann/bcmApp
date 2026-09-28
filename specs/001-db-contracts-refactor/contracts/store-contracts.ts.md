# TypeScript Store & Hook Contracts

This document defines the contracts for Zustand state stores and database access hooks across the application.

```typescript
import { Team, NewTeam, Player, NewPlayer, Game, NewGame, PlayerStat, NewPlayerStat, Training, NewTraining, Fee, NewFee } from "./database-schema.ts.md";

// 1. CLUB / TEAM STORE CONTRACT
export interface ClubState {
  currentTeam: Team | null;
  teamsList: Team[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTeams: () => Promise<void>;
  selectTeam: (teamId: number) => void;
  createTeam: (team: NewTeam) => Promise<Team | null>;
  deleteTeam: (teamId: number) => Promise<boolean>;
}

// 2. PLAYER STORE CONTRACT
export interface PlayerState {
  playersList: Player[];
  selectedPlayer: Player | null;
  isLoading: boolean;

  // Actions
  fetchPlayers: (teamId: number) => Promise<void>;
  createPlayer: (player: NewPlayer) => Promise<Player | null>;
  updatePlayer: (playerId: number, data: Partial<NewPlayer>) => Promise<boolean>;
  deletePlayer: (playerId: number) => Promise<boolean>;
}

// 3. GAME STORE CONTRACT
export interface GameState {
  gamesList: Game[];
  selectedGame: Game | null;
  playerStats: Record<number, PlayerStat>; // playerId -> stat
  isLoading: boolean;

  // Actions
  fetchGames: (teamId: number) => Promise<void>;
  createGame: (game: NewGame) => Promise<Game | null>;
  deleteGame: (gameId: number) => Promise<boolean>;
  fetchGamePlayerStats: (gameId: number) => Promise<void>;
  savePlayerStats: (gameId: number, stats: NewPlayerStat[]) => Promise<boolean>;
}

// 4. TRAINING STORE CONTRACT
export interface TrainingState {
  trainingsList: Training[];
  selectedTraining: Training | null;
  isLoading: boolean;

  // Actions
  fetchTrainings: (teamId: number) => Promise<void>;
  createTraining: (training: NewTraining) => Promise<Training | null>;
  deleteTraining: (trainingId: number) => Promise<boolean>;
}

// 5. FEES STORE CONTRACT
export interface FeesState {
  feesList: Fee[];
  isLoading: boolean;

  // Actions
  fetchFees: (teamId: number) => Promise<void>;
  createFee: (fee: NewFee) => Promise<Fee | null>;
  toggleFeePayment: (feeId: number, paidStatus: boolean) => Promise<boolean>;
  deleteFee: (feeId: number) => Promise<boolean>;
}

// 6. TOP MENU ENUMS CONTRACT
export enum TopMenuEnums {
  ROSTER = "ROSTER",
  GAMES = "GAMES",
  TRAINING = "TRAINING",
  CALENDAR = "CALENDAR",
  MANAGE = "MANAGE",
}

// 7. MENU STORE CONTRACT
export interface MenuState {
  activeTab: TopMenuEnums;
  setActiveTab: (tab: TopMenuEnums) => void;
}
```
