# Research & Technical Decisions: Direct Match Result & Stats Entry

**Feature**: Direct Match Result & Stats Entry (`017-set-completed-match`)  
**Date**: 2026-10-25  
**Status**: Completed  

---

## Technical Decisions & Rationale

### 1. 2-Column Action Buttons Grid Layout (`GameCards.tsx`)

- **Decision**: Update the action button container in `GameCards.tsx` from a single horizontal flex row to a 2-column flex-wrap grid container (`flex flex-row flex-wrap w-[92px] gap-1.5 justify-end`).
- **Rationale**:
  - The card currently features up to 3 action buttons (Roster, Edit, Delete). Adding the 4th button ("Set Result" / Direct Finish) in a single row causes horizontal overflow and card distortion on standard mobile screens (360px-390px width).
  - A 2-column grid (`w-[92px]` with 2 items per row, each `min-w-[42px] min-h-[42px]`) produces a clean, balanced 2x2 grid when 4 actions are present (Roster, Set Result, Edit, Delete for pending matches).
  - For finished matches where "Set Result" is omitted/hidden, the layout gracefully displays the remaining actions (Edit, Delete, and Roster disabled/hidden) without broken alignment.
- **Alternatives Considered**:
  - *Single horizontal row with 4 buttons*: Rejected because total width (`4 * 40px + gaps`) exceeds available space, compressing team names and scores.
  - *Kebab / Dropdown Action Menu*: Rejected because it introduces tap friction and hides primary workflows behind an extra interaction step.

---

### 2. Direct Result Action Button Visibility & Behavior

- **Decision**: Render a dedicated "Set Result" button (`testID={`set-result-button-${game.id}`}`) with a distinct icon (e.g. `check-square` from `Feather` or `scoreboard-outline` / `clipboard-check-outline`) in `GameCards`.
  - Condition: Rendered / interactable **strictly** when `game.status === 'pending'` or `!game.status`.
  - For `inProgress` or `finished` matches: Button is hidden or disabled with low opacity (`opacity-30`), preventing any conflicting state mutation.
- **Rationale**: Live matches have active game clocks, period intervals, and real-time event logs managed by `PlayMatch`. Allowing direct score overwrite on live games would corrupt cache and runtime clocks. Finished games already have their result and are edited via `MatchEditModal` in `MatchDetailView`.
- **Alternatives Considered**:
  - *Showing the button for all matches*: Rejected because overriding a live in-progress match causes race conditions with background timers and SQLite cache state.

---

### 3. Direct Result Entry Modal vs Dedicated Page

- **Decision**: Implement a full-screen React Native Modal component (`DirectResultModal`) housed in `src/features/direct-result/components/DirectResultModal.tsx`.
- **Rationale**:
  - A modal preserves the user's location in `GameList` without adding complex stack navigator routes or transient navigation parameters.
  - Full-screen presentation gives sufficient screen real estate for two distinct tabs:
    1. **Period Scores Tab**: Q1, Q2, Q3, Q4, and optional Overtime points & fouls for both team and opponent, with auto-calculated cumulative scores.
    2. **Player Stats Tab**: Roster list with isolated stat inputs (minutes, made/attempted shooting, rebounds, assists, steals, turnovers, fouls, auto-calculated points and valuation).
  - NativeWind utility styling provides visual consistency with the existing `MatchEditModal` and dark mode theme (`bg-surface`, `bg-slate-card`, `border-slate-border`, `text-primary`).
- **Alternatives Considered**:
  - *Full screen stack route*: Rejected because `GameList` manages modal flows (`GameForm`, `DeleteModal`, `RosterSelectionModal`) cleanly in local component state.

---

### 4. Roster Resolution Strategy for Unstarted Matches

- **Decision**: Seamlessly support both pre-called rosters and empty/unselected rosters:
  - When opening `DirectResultModal`:
    1. Check `GameController.getCalledUpPlayers(game.id)`.
    2. If called-up players exist, populate the player stats tab with those players.
    3. If no roster has been called up yet for this game, fetch all players of the current team via `PlayerController.loadStatsByTeam(teamId)`. Allow user to record stats for any team member, and automatically register them in `player_stats` upon save.
    4. Provide an optional "Select Roster" shortcut inside the modal if the user wishes to filter down to a 12-player roster.
- **Rationale**: In manual post-game result recording, coaches frequently haven't configured a match roster prior to the game. Blocking them with a mandatory separate modal adds unnecessary friction.
- **Alternatives Considered**:
  - *Hard requirement to open RosterSelectionModal first*: Rejected because it introduces double modal steps and degrades usability for quick post-game score entry.

---

### 5. Atomic Persistence & State Transition

- **Decision**: On tapping "Save" (or "Finalizar Partido"):
  1. Validate period scores and player stats (ensure all numbers are non-negative, numeric format).
  2. Sum period scores to determine total score:
     - `teamTotal = resultC1 + resultC2 + resultC3 + resultC4 + (resultExtra || 0)`
     - `opponentTotal = resultC1Opponent + resultC2Opponent + resultC3Opponent + (resultExtraOpponent || 0)`
  3. Batch persist player stats using `GameStore.batchSavePlayerStats` (with calculated valuations).
  4. Update match record with all period scores, period fouls, and transition `status` directly to `"finished"`.
  5. Close modal and invoke `onComplete` callback, which triggers `GameList`'s `getData()` to update the UI immediately.
- **Rationale**: Ensures atomic-like progression where a match is never left half-persisted or in an ambiguous status.
- **Alternatives Considered**:
  - *Two separate save actions (one for scores, one for stats)*: Rejected because the user expects a single "Save" button to complete the match directly.

---

### 6. Architecture & File Placement (Constitution Compliance)

- **Decision**:
  - Feature folder: `src/features/direct-result/`
    - `components/DirectResultModal.tsx`
    - `components/PeriodScoresSection.tsx`
    - `components/PlayerStatsSection.tsx`
    - `types/index.ts`
    - `index.ts` (public barrel export)
    - `__tests__/components/DirectResultModal.test.tsx`
    - `__tests__/components/PeriodScoresSection.test.tsx`
    - `__tests__/components/PlayerStatsSection.test.tsx`
  - Integration:
    - `src/components/GameCards.tsx`: 2-column grid layout, "Set Result" button, `onSetResult` prop.
    - `src/__tests__/components/GameCards.test.tsx`: Tests for 2-column grid layout and Set Result button.
    - `src/page/GameList.tsx`: Modal state, handlers for opening `DirectResultModal`, confirming save, refreshing match list.
- **Rationale**: Adheres strictly to Principle II (Feature-Based Architecture) and Principle I (Test-Driven Development).
