import {
  Team,
  NewTeam,
  Player,
  NewPlayer,
  Game,
  NewGame,
  PlayerStat,
  NewPlayerStat,
  Training,
  NewTraining,
} from "./database";
import { TopMenuEnums } from "./enums";

// 1. CLUB / TEAM STORE CONTRACT
export interface ClubState {
  currentTeam: Team | null;
  teamsList: Team[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTeams: () => Promise<Team[]>;
  selectTeam: (teamId: number) => void;
  createTeam: (team: NewTeam) => Promise<Team | null>;
  deleteTeam: (teamId: number) => Promise<boolean>;
  setCurrentTeam: (team: Team | null) => void;
}

// 2. PLAYER STORE CONTRACT
export interface PlayerState {
  playersList: Player[];
  selectedPlayer: Player | null;
  isLoading: boolean;

  // Actions
  fetchPlayers: (teamId: number) => Promise<Player[]>;
  createPlayer: (player: NewPlayer) => Promise<Player | null>;
  updatePlayer: (playerId: number, data: Partial<NewPlayer>) => Promise<boolean>;
  deletePlayer: (playerId: number) => Promise<boolean>;
  setSelectedPlayer: (player: Player | null) => void;
}

// 3. GAME STORE CONTRACT
export interface GameState {
  gamesList: Game[];
  selectedGame: Game | null;
  playerStats: Record<number, PlayerStat>; // playerId -> stat
  isLoading: boolean;

  // Actions
  fetchGames: (teamId: number) => Promise<Game[]>;
  createGame: (game: NewGame) => Promise<Game | null>;
  deleteGame: (gameId: number) => Promise<boolean>;
  fetchGamePlayerStats: (gameId: number) => Promise<Record<number, PlayerStat>>;
  savePlayerStats: (gameId: number, stats: NewPlayerStat[]) => Promise<boolean>;
  setSelectedGame: (game: Game | null) => void;
}

// 4. TRAINING STORE CONTRACT
export interface TrainingState {
  trainingsList: Training[];
  selectedTraining: Training | null;
  isLoading: boolean;

  // Actions
  fetchTrainings: (teamId: number) => Promise<Training[]>;
  createTraining: (training: NewTraining) => Promise<Training | null>;
  deleteTraining: (trainingId: number) => Promise<boolean>;
  setSelectedTraining: (training: Training | null) => void;
}

// 5. MENU STORE CONTRACT
export interface MenuState {
  activeTab: TopMenuEnums;
  setActiveTab: (tab: TopMenuEnums) => void;
}

