import { MockTeamDatasetConfig } from "./dataset.contract";

/**
 * Return summary from running database seeding.
 */
export interface SeedSummaryResult {
  teamsCount: number;
  playersCount: number;
  gamesCount: number;
  finishedGamesCount: number;
  pendingGamesCount: number;
  playerStatsCount: number;
}

/**
 * Result of dataset integrity validation.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * API Contract for database seeding & reset.
 */
export interface SeederServiceContract {
  /**
   * Drops all existing records in cascading order (playerStats -> games -> players -> teams).
   */
  clearDatabase: () => Promise<void>;

  /**
   * Seeds the database with the provided mock dataset or default dataset.
   */
  seedDatabase: (dataset?: MockTeamDatasetConfig) => Promise<SeedSummaryResult>;

  /**
   * Validates dataset mathematical and relational integrity prior to insertion.
   */
  validateDataset: (dataset: MockTeamDatasetConfig) => ValidationResult;
}
