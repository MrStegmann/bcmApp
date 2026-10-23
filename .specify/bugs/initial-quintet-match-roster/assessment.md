# Bug Assessment: Initial Quintet Modal Displays All Team Players Instead of Match Roster

- **Slug**: initial-quintet-match-roster
- **Created**: 2026-10-22
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
# Initial Quintet in Play Match View
## Overview
When the user enter the Play Match View for the first time and the select quintet modal appears, is show a list of ALL players in the team instead the players that are in the roaster of the match.
## What Shall happens
Only the players in the roaster for the match shall appears to be selected in the initial quintet.
```

## Symptom

When navigating into the Play Match View (`PlayMatch.tsx`) for the first time and the "Seleccionar 5 Inicial" (`StartingFiveModal.tsx`) dialog opens, the list contains every player registered to the team instead of filtering exclusively to the players called up in the match roster.

## Reproduction

1. Ensure the active club/team has more than 5 players registered (e.g., 8–12 players).
2. Create or select a pending match in `GameList.tsx`.
3. In the "Declarar Convocatoria" modal (`RosterSelectionModal`), select a subset of players for the match roster (e.g., 7 players).
4. Confirm the roster to proceed to the match view.
5. The Play Match View mounts and opens the "Seleccionar 5 Inicial" modal (`StartingFiveModal`).
6. Observe that all team players are listed as selectable options, including those who were not included in the match roster.

## Suspected Code Paths

- `src/features/play-match/PlayMatch.tsx:226-264` — `loadMatchData` fetches all team players via `PlayerController.getAll(match.teamId)` and match records via `existingStats = await db.select().from(playerStats).where(eq(playerStats.gameId, match.id))`. However, it maps all `teamPlayers` directly to `roster` instead of filtering by `existingStats`.
- `src/features/play-match/PlayMatch.tsx:376-380` — Renders `<StartingFiveModal visible={isStartingFiveModalOpen} roster={players} ... />` using the store's `players` state, which holds all team players.
- `src/features/play-match/components/StartingFiveModal.tsx:50-90` — Maps over `roster` prop to display selectable players.
- `src/features/play-match/store/usePlayMatchStore.ts:102-146` — `initMatch(match.id, roster)` sets the full `roster` as the in-game players, which also leaks non-called-up players onto the bench.

## Root Cause Hypothesis

In `PlayMatch.tsx`, `loadMatchData` retrieves `teamPlayers` for `match.teamId` and `existingStats` from `playerStats` for `match.id`. The match roster (called-up players) is represented in the database as rows in `playerStats` matching `gameId === match.id`. Instead of filtering `teamPlayers` to only include players present in `existingStats`, `loadMatchData` maps across all `teamPlayers` unconditionally when generating the `roster` array passed into `initMatch(match.id, roster)`. Consequently, the match store and the `StartingFiveModal` receive the entire team rather than the match's designated roster.

Confidence: **high**

## Proposed Remediation

**Preferred**:
In `PlayMatch.tsx`, filter `teamPlayers` during `loadMatchData` before generating `roster`:
1. Extract the set of called-up player IDs from `existingStats`:
   `const calledUpIds = new Set(existingStats.map((s) => s.playerId));`
2. If `existingStats.length > 0`, filter `teamPlayers` to only include players whose `id` exists in `calledUpIds`. (If `existingStats` is empty as a fallback for legacy matches, retain all `teamPlayers`).
3. Map only the filtered roster players to `InGamePlayer` objects and pass them to `initMatch(match.id, roster)`.
4. This ensures `StartingFiveModal` and bench player management strictly present the players declared in the match roster.

**Alternatives**:
- Filter `players` only at the `StartingFiveModal` level (`roster={players.filter(...)}`).
  *Trade-off*: Leaves non-called-up players in the bench roster and quick-assign menus, allowing illegal player substitutions during live match play.

**Files likely to change**:
- `src/features/play-match/PlayMatch.tsx`
- `src/features/play-match/__tests__/page/PlayMatch.test.tsx`

**Tests to add or update**:
- Test in `PlayMatch.test.tsx` verifying that when a match has specific roster entries in `playerStats`, `PlayMatch` initializes only those players in `roster` and `StartingFiveModal`.
- Test verifying graceful fallback when a match has no entries in `playerStats`.

## Risks & Considerations

- **Graceful Fallback**: If an existing/legacy match in the database has no `playerStats` entries, the fallback should gracefully allow team players so the view does not crash or leave an empty starting five modal.
- **Roster Size Edge Cases**: Ensure that if the roster has exactly 5 players or more than 5 players, `StartingFiveModal` and initial lineup selection work as expected.

## Open Questions

- None.
