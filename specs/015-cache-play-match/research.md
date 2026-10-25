# Research: Play Match Background Caching & Resilient Recovery

**Feature**: Caching the Play Match  
**Feature Branch**: `015-cache-play-match`  
**Status**: Completed  
**Date**: 2026-10-25  

---

## 1. Local Storage Engine & Persistence Mechanism

### Context & Requirements
- Requirement FR-001 / FR-004: In-progress match state must be stored in local non-volatile storage.
- Constitution Principle III: Local persistence must use Drizzle ORM paired with `expo-sqlite`. Schema alterations must be type-safe with explicit foreign key actions.
- Performance: Storage writes must be non-blocking, asynchronous, and fast without main-thread UI hitches.

### Decision
Implement a dedicated `match_cache` table using **Drizzle ORM** with `expo-sqlite` in `src/features/play-match/db/schema.ts` and export it to the centralized schema (`src/db/schema.ts`).

### Schema Definition
```typescript
export const matchCache = sqliteTable("match_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  matchId: integer("match_id")
    .notNull()
    .unique()
    .references(() => games.id, { onDelete: "cascade" }),
  stateJson: text("state_json").notNull(),
  version: integer("version").notNull().default(1),
  lastUpdated: text("last_updated")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
```

### Rationale
1. **Constitution Compliance**: Principle III mandates Drizzle ORM + Expo SQLite for local persistence.
2. **Relational Integrity**: Foreign key cascading (`onDelete: "cascade"`) ensures that if a user deletes a game from `GameCards`, any associated in-progress cache is automatically removed by SQLite, preventing orphaned cache records.
3. **Performance under WAL**: Expo SQLite runs with WAL (Write-Ahead Logging) enabled in `bcmapp.db`, allowing background writes without locking read queries.
4. **Single-row Atomic Upsert**: Using SQLite `INSERT ... ON CONFLICT(match_id) DO UPDATE SET state_json = ?, last_updated = ?` guarantees atomic snapshot persistence.

### Alternatives Considered
- **`@react-native-async-storage/async-storage`**: While installed in `package.json`, AsyncStorage lacks foreign key constraints, cascading deletions, and relational typing. Orphaned caches would require manual garbage collection when games are deleted.
- **Expo FileSystem (`expo-file-system`)**: Writing individual JSON files to the application sandbox adds manual file locking and path management overhead without any performance benefit over SQLite WAL.

---

## 2. Background Synchronization & Debouncing Strategy

### Context & Requirements
- Requirement FR-002: Caching must be completely silent (no toasts, loaders, spinners).
- Requirement FR-003: System must throttle or debounce frequent background write operations to prevent main UI thread contention during rapid scoring events and clock ticks.
- Requirement SC-002: Zero UI interruptions, maintaining fluid 60 fps interactions during rapid tap bursts.

### Decision
Use a decoupled **MatchCacheManager** that subscribes to `usePlayMatchStore` changes with a dual-trigger synchronization strategy:
1. **Debounced Sync (Trailing 800ms)**: For high-frequency state updates such as timer ticks, rapid scoring button taps, and fouls.
2. **Immediate Flush Sync**: For critical structural events, such as period progression (`nextPeriod`), player substitution (`confirmSwap`), timeouts, and application lifecycle backgrounding (`AppState` transitioning to `"background"` or `"inactive"`).

### Synchronization Architecture
```
usePlayMatchStore (Zustand)
       │
       ▼ (State Change Notification)
MatchCacheManager (Subscriber)
       │
       ├── High-Frequency (Points, Ticks) ──> Debounce Window (800ms) ──┐
       │                                                                ▼
       └── Critical / AppState Change ────> Immediate Flush ────> matchCacheRepository.upsertCache()
                                                                       │ (Async SQLite WAL write)
                                                                       ▼
                                                                  bcmapp.db (match_cache)
```

### Rationale
- Clock ticks occur every second, and rapid scoring sequences can trigger 3-5 state updates within two seconds. An 800ms debounce collapses multiple consecutive mutations into a single disk write.
- AppState integration (`AppState.addEventListener("change", ...)`) ensures that when iOS or Android backgrounds the app or the user switches apps, any pending debounced state is flushed immediately before OS suspension.

### Alternatives Considered
- **Synchronous disk write on every action**: Triggers dozens of SQLite transactions per minute, leading to unnecessary I/O thrashing and battery consumption on mobile devices.
- **Zustand `persist` middleware with AsyncStorage**: Default Zustand persist middleware saves synchronously or unthrottled on every single state slice mutation, which creates performance bottlenecks when timer ticks occur every second.

---

## 3. State Rehydration & Crash Recovery Flow

### Context & Requirements
- Requirement FR-005: Check for existing match cache upon mounting `PlayMatch` view.
- Requirement FR-006: Restore active match view to the exact state captured in local cache.
- Requirement SC-003: Rehydration in under 1.0 second (target < 500ms).
- Edge Case: Clock must resume in a paused state (`isTimerRunning: false`) to avoid time drift and let scorekeepers verify real-world clock time with game officials.

### Decision
In `PlayMatch.tsx` component mount:
1. `MatchCacheManager.getCachedSession(match.id)` is queried.
2. If a cached session is found and valid:
   - Hydrate `usePlayMatchStore` using an explicit action `hydrateFromCache(cachedPayload)`.
   - Enforce `isTimerRunning = false` so the game clock remains paused until the user explicitly taps "Start".
   - If the session is older than 48 hours (stale session edge case), prompt user via an alert: "Partida en progreso encontrada. ¿Deseas reanudar o reiniciar el partido?".
3. If no cache exists: proceed with normal database initialization `initMatch(match.id, roster)`.

### Rationale
- Pausing the timer on rehydration prevents clock drift across crashes or suspensions.
- Direct store rehydration from validated JSON takes < 50ms, easily beating the 1.0s target.

### Alternatives Considered
- **Auto-resuming the timer**: Unsafe because elapsed real-world time while the app was closed or crashed does not equal official game clock time. Basketball rules require game clock to stop on whistle and pause between play.

---

## 4. Cache Eviction & Purging Strategy

### Context & Requirements
- Requirement FR-007: Purge temporary match cache immediately on "Save & Finish" (`handleFinishMatch`).
- Requirement FR-008: Purge temporary match cache when user confirms discarding or resetting an unfinished session.
- Requirement SC-004: 100% of temporary cache entries purged upon match finalization.

### Decision
Expose `clearMatchCache(matchId: number): Promise<void>` in `matchCacheRepository.ts`.
- In `handleFinishMatch`: After `db.update(games)` and `playerStats` records are saved, call `await clearMatchCache(match.id)` before `onFinishMatch()`.
- In session discard/reset flows: When the user confirms discarding an unfinished match or restarting fresh, call `await clearMatchCache(match.id)` and reinitialize store with fresh roster.

### Rationale
- Completely isolates in-flight cache from historical match stats.
- Guarantees zero residual cache data remains once a game is officially finalized in SQLite.

---

## 5. Resilient Fallback on Corrupted or Incompatible Payloads

### Context & Requirements
- Requirement FR-009: Validate integrity and structure of cached data before rehydration.
- Requirement SC-005: 100% of corrupted or invalid cache scenarios recover safely without crashing.
- Requirement FR-011: Silent handling of write errors without displaying unhandled error popups.

### Decision
1. **Schema Versioning**: Include `version: 1` in `CachedMatchPayload`.
2. **Payload Validator**: Implement `validateMatchCachePayload(data: unknown): data is CachedMatchPayload` in `src/features/play-match/utils/cacheValidation.ts`.
   - Checks presence and type of: `matchId` (number), `periods` (valid record of q1-q4, extra), `players` (array), `timeouts` (valid budget), `activePeriod` (valid PeriodKey).
3. **Corruption Recovery**:
   - If `JSON.parse()` fails or `validateMatchCachePayload()` returns `false`, log a silent warning via `console.warn`.
   - Call `clearMatchCache(match.id)` to purge the broken record.
   - Fallback transparently to normal fresh match initialization from DB.

### Rationale
- Completely protects the app from crashes caused by truncated writes, schema changes, or corrupted storage.
- Meets User Story 4 and SC-005 with zero disruption to the user.
