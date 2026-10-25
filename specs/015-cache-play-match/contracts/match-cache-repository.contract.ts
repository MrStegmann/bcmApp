/**
 * Match Cache Repository Contract
 * Defines low-level SQLite Drizzle ORM operations for the match_cache table.
 */

export interface IMatchCacheRepository {
  /**
   * Retrieves the raw cache record for a given match ID.
   * Returns null if no cached record exists.
   */
  getCache(matchId: number): Promise<{
    id: number;
    matchId: number;
    stateJson: string;
    version: number;
    lastUpdated: string;
  } | null>;

  /**
   * Upserts the serialized match state into SQLite.
   * Overwrites any existing record for this matchId atomically.
   */
  saveCache(matchId: number, stateJson: string, version?: number): Promise<void>;

  /**
   * Deletes the cache record associated with the given match ID.
   * Resolves silently if no record exists.
   */
  removeCache(matchId: number): Promise<void>;
}
