# Phase 0 Research: Update Home View Page

**Feature**: `011-update-home-view`
**Date**: 2026-10-23
**Status**: Completed

---

## 1. Feature Architecture & Public Boundary

### Decision
Structure the home view as a self-contained feature module located at `src/features/home-view/`:
- `HomeView.tsx`: Main orchestrator container component rendering the three vertical sections.
- `components/`:
  - `NextMatchCard.tsx`: Top section rendering earliest pending match or empty state, with quick roster action.
  - `RecentMatchesColumn.tsx`: Middle section rendering the vertical column of up to 3 finished games.
  - `RecentMatchCard.tsx`: Individual match card rendering total scores, period score breakdown, and detail action.
  - `GlobalStatsCard.tsx`: Bottom section rendering the 8 advanced efficiency metric averages in a responsive grid.
- `store/useHomeViewStore.ts`: Dedicated Zustand store managing home view state, match queries, and roster state.
- `types/index.ts`: Strict TypeScript contracts and component props.
- `utils/`:
  - `matchDateHelper.ts`: Deterministic sorting and date parsing for pending and finished matches.
  - `statsCalculator.ts`: Batch aggregation and arithmetic mean calculations for the 8 advanced metrics.
- `__tests__/`: Co-located unit and integration tests.
- `index.ts`: Clean public API exporting `HomeView` and public types.

`ClubProfile.tsx` (the screen container) imports `HomeView` from `../features/home-view` and renders it when `option === TopMenuEnums.MAIN`.

### Rationale
- Strictly aligns with Constitution Principle II (Feature-Based Architecture Pattern) and the `feature-arch` guidelines (`struct-feature-folders`, `struct-feature-self-contained`, `import-public-api`).
- Decouples the presentation and calculation logic from `ClubProfile.tsx`, keeping `ClubProfile` focused solely on top-level tab switching and back navigation.
- Isolates tests so that `HomeView` logic, date sorting, and metric math can be tested in isolation with 100% test coverage.

### Alternatives Considered
- **Direct inlining into `ClubProfile.tsx`**: Rejected because `ClubProfile.tsx` is an app-level page router. Inlining 3 complex sections would bloat the component beyond 400 lines and violate feature encapsulation.
- **Placing cards in `src/components/`**: Rejected because `src/components/` is intended for shared generic UI primitives (buttons, modals, headers), not domain-specific dashboard sections.

---

## 2. Advanced Efficiency Metrics Calculation Strategy

### Decision
Calculate the 8 advanced metrics (`Posesiones`, `OER`, `DER`, `eFG%`, `ORB%`, `AST%`, `TOV%`, `FTR`) on a per-completed-match basis using the established domain formulas (identical to `calculateAdvancedStats` in Feature 009), and then compute the arithmetic mean across all completed matches for each metric:
$$\text{Average}(M) = \frac{1}{N} \sum_{i=1}^{N} M_i$$
When $N = 0$, all metrics safely return `0.0` or empty state without triggering `NaN`, `Infinity`, or division-by-zero errors.

### Rationale
- Explicitly mandates conformance to FR-014 ("The Global Stats Component MUST compute the statistical arithmetic average (media) across all completed matches for each of the eight metrics") and SC-007 (±0.01 precision).
- Per-game metrics reflect the team's typical game profile and offensive/defensive ratings rather than being skewed by outlier high-possession or overtime games.
- Division-by-zero safeguards protect both per-game denominators and the zero-games-played edge case.

### Alternatives Considered
- **Pooled season aggregation (cumulative totals formula)**: Summing all stats across the entire season and running formulas once. Rejected because the feature specification explicitly requests "la media de cada stats presente en los partidos" (the arithmetic average of each stat present in the matches) and FR-014 defines arithmetic mean across completed matches.
- **SQLite SQL aggregation**: Rejected because formulas like $0.96 \times (FGA + 0.44 \times 1PA + OREB - PER)$ and conditional branch checks are significantly more robust, maintainable, and unit-testable in TypeScript.

---

## 3. Match Chronology, Date Parsing, & Tie-Breaking

### Decision
Implement `parseMatchDate(dateStr: string): number` in `matchDateHelper.ts`:
1. Use `parseMatchTimestamp` from `src/utils/dateValidation.ts` for `"dd/mm/aaaa - hh:mm"`.
2. Fall back to standard `Date.parse(dateStr)` for ISO or other standard timestamps.
3. If unparseable or empty, return `0`.

For **Next Match**:
- Filter matches where `status === "pending"`.
- Sort ascending: primary key = parsed timestamp; secondary key = `Number(round) || 0`; tertiary key = `id`.
- The earliest match is selected. If no matches match, return `null` and display exact string `"Sin próximos partidos agendados"`.

For **Recent Matches**:
- Filter matches where `status === "finished"`.
- Sort descending: primary key = parsed timestamp; secondary key = `id`.
- Slice the first 3 matches.

### Rationale
- Robust against variations in date storage across mock datasets and user input.
- Deterministic ordering ensures that two fixtures on the same day will always sort consistently.
- Matches spec requirements FR-002, FR-007, FR-008, and Edge Cases.

### Alternatives Considered
- **Lexicographical string sorting**: Fails completely for `"dd/mm/aaaa"` format because day prefix precedes month and year.
- **Adding an external library (`date-fns`/`dayjs`)**: Unnecessary overhead since the project already contains `parseMatchTimestamp` which handles the application's standard date format.

---

## 4. Batch Data Fetching & SQLite Optimization

### Decision
In `useHomeViewStore`, avoid N+1 query patterns:
1. Fetch all games for the current team: `db.select().from(games).where(eq(games.teamId, teamId))`.
2. Filter finished games and extract their IDs: `finishedGameIds = finishedGames.map(g => g.id)`.
3. If `finishedGameIds.length > 0`, fetch player stats using a single query:
   `db.select().from(playerStats).where(inArray(playerStats.gameId, finishedGameIds))`.
4. Group player stats by `gameId` in-memory and compute metrics in parallel.
5. For the next match, check roster callup presence by querying `playerStats` for `nextMatch.id`.

### Rationale
- Conforms to Constitution Principle III (Type-Safe Local Persistence) and `feature-arch` rule `fquery-avoid-n-plus-one`.
- Single batch query ensures sub-100ms load time even with 20+ matches in a season, easily meeting SC-001 (< 1 second).

### Alternatives Considered
- **Querying player stats match-by-match in a loop**: Rejected as an N+1 antipattern that causes noticeable frame drops on mobile devices.

---

## 5. UI Layout, Score Breakdown, & Match Detail Navigation

### Decision
1. **Vertical Order**: Layout uses a root `ScrollView` with three distinct sections from top to bottom:
   - Section 1: Next Match Card.
   - Section 2: Last Three Matches Column.
   - Section 3: Global Stats Card.
2. **Score Breakdown**:
   - Total score: Home team total vs Rival total.
   - Period scores: Direct horizontal row or compact sub-table showing P1, P2, P3, P4 (and Extra when `resultExtra > 0 || resultExtraOpponent > 0`).
3. **Interactivity**:
   - Next match: Roster button triggers `RosterSelectionModal`. On confirmation, callups are persisted and state reloaded.
   - Recent match: Clicking match card or detail icon invokes `onSelectMatch(game)`, transitioning `ClubProfile` to `MatchDetailView`. When returning, `HomeView` automatically refreshes its data.

### Rationale
- Exactly satisfies FR-001, FR-010, FR-011, FR-012, FR-017, and SC-009.
- NativeWind utility styling provides consistent dark mode visual hierarchy matching existing design tokens (`bg-danish-dark-gray`, `text-danish-white`, `border-danish-red`, `border-danish-gold`).

---
