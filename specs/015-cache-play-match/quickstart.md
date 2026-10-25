# Quickstart Validation Guide: Play Match Background Caching

**Feature**: Caching the Play Match  
**Feature Branch**: `015-cache-play-match`  
**Status**: Completed  
**Date**: 2026-10-25  

This guide provides end-to-end validation scenarios for testing silent background caching, crash recovery, finalization cache purging, and corruption resilience.

---

## Prerequisites & Environment Setup

1. Node.js environment configured with Expo SDK 57 and Jest.
2. Ensure database is initialized with test schema:
   ```bash
   npm test -- --testPathPattern="PlayMatch"
   ```

---

## Scenario 1: Silent Background Caching During Live Play

### Objective
Verify that active match stats, scores, and timer are continuously cached in SQLite in the background without UI interruption.

### Steps
1. Navigate to an in-progress or new match in `PlayMatch`.
2. Record points for on-court players (e.g. 2PT, 3PT) and a personal foul.
3. Advance timer by starting the clock for 15 seconds, then pause.
4. Perform a substitution via `SubstitutionPanel`.
5. Check database record in `match_cache` table for `match_id`:
   - Verify `state_json` contains updated scores, periods, player fouls, and timeout counts.
   - Confirm zero visual loading indicators or notification toasts were rendered on screen.

### Expected Outcome
- The `match_cache` table holds the latest snapshot.
- User experience was smooth at 60 fps with zero blocking prompts.

---

## Scenario 2: Crash Simulation & Automatic Rehydration

### Objective
Verify that force-killing the app or unmounting unexpectedly restores the exact game state upon re-entry.

### Steps
1. Start an active match and record specific score numbers (e.g., Team 14 - Rival 11, Q2, 3 fouls).
2. Simulate unexpected app termination or force-close (or unmount `PlayMatch` unexpectedly).
3. Relaunch the application and select the same match from `GameCards`.
4. Observe the state rehydration on view mount.

### Expected Outcome
- Scores immediately read Team 14 - Rival 11.
- Active quarter is Q2.
- Player individual stat lines match pre-crash stats.
- Game timer is loaded at the saved remaining time in **PAUSED** mode.

---

## Scenario 3: Cache Purge on "Save & Finish"

### Objective
Verify that completing and saving a match completely purges the temporary cache record from SQLite.

### Steps
1. In `PlayMatch`, record the final score and events.
2. Tap the header "Finalizar" (save) action.
3. Confirm "Finalizar y Guardar" in the alert modal.
4. Inspect `match_cache` in SQLite:
   - Query `SELECT * FROM match_cache WHERE match_id = ?`.

### Expected Outcome
- Query returns 0 rows.
- Permanent match data is saved in `games` and `player_stats`.
- Navigating back to matches displays the finished match; opening it shows the read-only `MatchDetailView`.

---

## Scenario 4: Corruption & Invalid Payload Fallback

### Objective
Verify that malformed or truncated cache data does not crash the application.

### Steps
1. Inject a corrupted JSON string (`"{{invalid-json--truncated"`) into `match_cache.state_json` for a match.
2. Navigate to that match in `PlayMatch`.
3. Observe view loading behavior and application logs.

### Expected Outcome
- The view gracefully falls back to loading roster data from the database.
- A warning is logged silently without crashing the app.
- Corrupted cache entry is cleaned up.

---

## Running Automated Validation Tests

Run the dedicated test suites verifying these scenarios:

```bash
# Run unit & integration tests for cache repository, service, and store sync
npm test -- --testPathPattern="cache"

# Run end-to-end PlayMatch view integration tests
npm test -- --testPathPattern="PlayMatch"
```
