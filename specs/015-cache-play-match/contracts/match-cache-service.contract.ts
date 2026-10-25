/**
 * Match Cache Service Contract
 * Coordinates silent debounced persistence, corruption validation,
 * rehydration, and cache eviction for active match sessions.
 */

import { CachedMatchPayload } from "../../../src/features/play-match/types/cache";

export interface IMatchCacheService {
  /**
   * Loads and validates the in-progress match session from persistence.
   * If corrupted or invalid, purges the damaged record and returns null.
   */
  loadSession(matchId: number): Promise<CachedMatchPayload | null>;

  /**
   * Persists an in-progress match snapshot silently.
   * If immediate is true, flushes to SQLite immediately.
   * If immediate is false (default), debounces by 800ms to eliminate UI stutter.
   */
  saveSession(payload: CachedMatchPayload, immediate?: boolean): Promise<void>;

  /**
   * Permanently purges any existing cache record for the match.
   * Used during "Save & Finish" or session discard/abandonment.
   */
  purgeSession(matchId: number): Promise<void>;

  /**
   * Determines whether a cached session is considered stale (e.g. > 48 hours).
   */
  isCacheStale(payload: CachedMatchPayload, maxAgeHours?: number): boolean;

  /**
   * Flushes any currently pending debounced write immediately.
   */
  flushPendingWrite(): Promise<void>;
}
