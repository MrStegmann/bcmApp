# Bug Fix: Initial Quintet Modal Displays All Team Players Instead of Match Roster

- **Slug**: initial-quintet-match-roster
- **Fixed**: 2026-10-22T12:38:00+02:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Filtered team players during match initialization in `PlayMatch` by matching player IDs against the match roster stored in `playerStats`. This prevents non-called-up players from appearing in the Starting Five modal and bench roster while maintaining graceful fallback for legacy matches.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/play-match/utils/roster.ts` | added | Extracted `buildMatchRoster` pure utility to filter players by called-up `playerStats` IDs with legacy match fallback. |
| `src/features/play-match/PlayMatch.tsx` | modified | Integrated `buildMatchRoster` into `loadMatchData` to initialize the store and Starting Five modal with called-up players only. |
| `src/features/play-match/__tests__/page/PlayMatch.test.tsx` | modified | Added test suite covering match roster filtering, legacy match fallback, and player stats mapping. |

## Diff Highlights (optional)

```typescript
export function buildMatchRoster(
  teamPlayers: any[],
  existingStats: any[]
): InGamePlayer[] {
  const calledUpIds = new Set((existingStats || []).map((s: any) => s.playerId));
  const activePlayers =
    existingStats && existingStats.length > 0
      ? (teamPlayers || []).filter((p: any) => calledUpIds.has(p.id))
      : (teamPlayers || []);

  return activePlayers.map((p: any) => {
    const stat = (existingStats || []).find((s: any) => s.playerId === p.id);
    return {
      id: p.id,
      firstName: p.firstName || p.first_name || "Jugador",
      lastName: p.lastName || p.last_name || `#${p.number}`,
      number: String(p.number || "0"),
      position: p.position || null,
      isOnCourt: false,
      courtPositionIndex: null,
      secondsPlayed: (stat?.minutes || 0) * 60,
      ...
    };
  });
}
```

## Tests Added or Updated

- `src/features/play-match/__tests__/page/PlayMatch.test.tsx::Roster Filtering (Bug Fix: initial-quintet-match-roster)`:
  - `should filter team players down strictly to the called-up match roster defined in playerStats` — Pins down that non-called-up team players are excluded from the in-game roster.
  - `should gracefully fall back to all team players if playerStats is empty (legacy match support)` — Pins down fallback behavior when opening matches created without prior roster declaration.
  - `should correctly populate InGamePlayer statistics and properties from playerStats` — Verifies mapping of minutes and box score stats into in-game player state.

## Local Verification

- Commands run:
  - `npx jest PlayMatch.test.tsx` → PASS (12/12 tests passing)
  - `npx jest PlayMatch` → PASS (5 test suites, 44/44 tests passing)
  - `npx jest StartingFiveModal` → PASS (2 test suites, 7/7 tests passing)
- Manual checks: Verified `StartingFiveModal` receives the filtered `players` list from `usePlayMatchStore`, ensuring only the declared match roster is selectable for the starting five.

## Deviations from Assessment

Extracted the roster building and filtering logic into `src/features/play-match/utils/roster.ts` rather than inlining solely in `PlayMatch.tsx` to maintain feature modularity and avoid React Native Flow/untranspiled module errors in Node-based Jest runner.

## Follow-ups

- None.
