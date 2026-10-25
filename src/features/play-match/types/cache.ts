import {
  InGamePlayer,
  PeriodData,
  PeriodKey,
  ScoreEventLink,
  SwapState,
  TimeoutBudget,
} from "./index";

/**
 * In-memory domain snapshot for caching active play match state.
 */
export interface CachedMatchPayload {
  version: number;
  matchId: number;
  activePeriod: PeriodKey;
  periods: Record<PeriodKey, PeriodData>;
  players: InGamePlayer[];
  timeouts: TimeoutBudget;
  swap: SwapState;
  scoreEvents: ScoreEventLink[];
  savedAt: string;
}

/**
 * Match Cache Repository Contract
 * Defines low-level SQLite Drizzle ORM operations for the match_cache table.
 */
export interface IMatchCacheRepository {
  getCache(matchId: number): Promise<{
    id: number;
    matchId: number;
    stateJson: string;
    version: number;
    lastUpdated: string;
  } | null>;

  saveCache(matchId: number, stateJson: string, version?: number): Promise<void>;

  removeCache(matchId: number): Promise<void>;
}

/**
 * Match Cache Service Contract
 * Coordinates silent debounced persistence, corruption validation,
 * rehydration, and cache eviction for active match sessions.
 */
export interface IMatchCacheService {
  loadSession(matchId: number): Promise<CachedMatchPayload | null>;
  saveSession(payload: CachedMatchPayload, immediate?: boolean): Promise<void>;
  purgeSession(matchId: number): Promise<void>;
  isCacheStale(payload: CachedMatchPayload, maxAgeHours?: number): boolean;
  flushPendingWrite(): Promise<void>;
}
