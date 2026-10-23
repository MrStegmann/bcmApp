# Tasks: Match Detail View & Advanced Analytics

**Input**: Design documents from `specs/009-match-detail-view/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/match-detail-contracts.md](./contracts/match-detail-contracts.md), [quickstart.md](./quickstart.md)  
**Tests**: Included per Constitution Principle I (Test-Driven Development First - Non-negotiable)  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, and feature scaffolding

- [X] T001 Install `react-native-svg` dependency in package.json
- [X] T002 [P] Create feature directory structure under src/features/match-detail/
- [X] T003 [P] Define TypeScript types, domain models, and component prop interfaces in src/features/match-detail/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema expansion, migrations, pure calculation engine, geometry helpers, and state store

**⚠️ CRITICAL**: Must complete before user story UI implementation begins

- [X] T004 Extend games table definition with period fouls columns in src/db/schema.ts
- [X] T005 Add non-destructive database migrations for period fouls columns in src/db/index.ts
- [X] T006 [P] Write unit tests for basketball formulas and division-by-zero guards in src/features/match-detail/__tests__/calculations.test.ts
- [X] T007 Implement pure calculations engine for 8 advanced metrics and player valuation in src/features/match-detail/utils/calculations.ts
- [X] T008 [P] Write unit tests for 8-axis radar geometry and normalization in src/features/match-detail/__tests__/radarGeometry.test.ts
- [X] T009 Implement radar geometry, metric normalization, and SVG polygon generator in src/features/match-detail/utils/radarGeometry.ts
- [X] T010 [P] Write unit tests for match detail Zustand store actions and state transitions in src/features/match-detail/__tests__/useMatchDetailStore.test.ts
- [X] T011 Implement Zustand store with match data loading, period parsing, and DB update actions in src/features/match-detail/store/useMatchDetailStore.ts

**Checkpoint**: Foundation ready - all shared calculations, store actions, geometry, and database schemas ready for UI development.

---

## Phase 3: User Story 1 - Match Summary, Final Score & Period Breakdown (Priority: P1) 🎯 MVP

**Goal**: Render cumulative final score and quarter-by-quarter breakdown of points and fouls for both home and rival teams for finished matches.

**Independent Test**: Render a completed match; verify cumulative score header and period table displaying accurate points and fouls for Q1-Q4 (and Extra when played) without displaying extra time when not played.

### Tests for User Story 1 ⚠️
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T012 [P] [US1] Component tests for match score header in src/features/match-detail/__tests__/components/MatchSummaryHeader.test.tsx
- [X] T013 [P] [US1] Component tests for period points and fouls breakdown table in src/features/match-detail/__tests__/components/PeriodBreakdownTable.test.tsx

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement MatchSummaryHeader component in src/features/match-detail/components/MatchSummaryHeader.tsx
- [X] T015 [P] [US1] Implement PeriodBreakdownTable component in src/features/match-detail/components/PeriodBreakdownTable.tsx
- [X] T016 [US1] Assemble base MatchDetailView component displaying header and period breakdown in src/features/match-detail/MatchDetailView.tsx
- [X] T017 [US1] Create public barrel export in src/features/match-detail/index.ts
- [X] T018 [US1] Update match list routing in src/page/GameList.tsx to navigate finished matches to MatchDetailView

**Checkpoint**: User Story 1 (MVP) is fully functional and independently testable from GameList.

---

## Phase 4: User Story 2 - Value-Sorted Match Roster & Player Detail Inspection (Priority: P1)

**Goal**: Render roster sorted descending by Valuation with interactive player buttons displaying jersey, name, minutes, points, and value, revealing full box scores upon tap.

**Independent Test**: Supply match roster with varied valuations; verify descending order with secondary tie-breakers, tap player button, and verify modal displays full statistical counts.

### Tests for User Story 2 ⚠️
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T019 [P] [US2] Component tests for value-sorted roster list in src/features/match-detail/__tests__/components/RosterValuationList.test.tsx
- [X] T020 [P] [US2] Component tests for player detailed box score modal in src/features/match-detail/__tests__/components/PlayerDetailModal.test.tsx

### Implementation for User Story 2

- [X] T021 [P] [US2] Implement RosterValuationList component with value-sorted player buttons in src/features/match-detail/components/RosterValuationList.tsx
- [X] T022 [P] [US2] Implement PlayerDetailModal component with full box score breakdown in src/features/match-detail/components/PlayerDetailModal.tsx
- [X] T023 [US2] Integrate roster list and player detail modal into src/features/match-detail/MatchDetailView.tsx

**Checkpoint**: User Stories 1 and 2 work seamlessly together with interactive player detail inspection.

---

## Phase 5: User Story 3 - Advanced Team Statistics & Polygon Visualization (Priority: P2)

**Goal**: Render the 8 advanced team efficiency metrics badges and interactive 8-axis SVG radar polygon chart below the roster list.

**Independent Test**: Supply match totals; verify all 8 efficiency metrics display mathematically correct values with zero-division safety, and SVG radar polygon renders axes, labels, and plot points.

### Tests for User Story 3 ⚠️
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T024 [P] [US3] Component tests for 8-axis SVG radar chart in src/features/match-detail/__tests__/components/PolygonRadarChart.test.tsx
- [X] T025 [P] [US3] Component tests for team advanced statistics section in src/features/match-detail/__tests__/components/TeamAdvancedAnalytics.test.tsx

### Implementation for User Story 3

- [X] T026 [P] [US3] Implement PolygonRadarChart component using react-native-svg in src/features/match-detail/components/PolygonRadarChart.tsx
- [X] T027 [P] [US3] Implement TeamAdvancedAnalytics container with metric badges and radar chart in src/features/match-detail/components/TeamAdvancedAnalytics.tsx
- [X] T028 [US3] Integrate team advanced statistics section into src/features/match-detail/MatchDetailView.tsx

**Checkpoint**: Tactical efficiency metrics and polygon radar visualizer render smoothly.

---

## Phase 6: User Story 4 - Match Data & Player Stats Edit Mode (Priority: P2)

**Goal**: Allow editing period points & fouls (both teams) and player individual statistics, saving updates to SQLite, and immediately recalculating dependent metrics.

**Independent Test**: Tap Edit button, adjust period scores/fouls and player stats, tap Save; verify SQLite persistence and updated totals in view. Open Edit, modify values, tap Cancel; verify values remain unchanged.

### Tests for User Story 4 ⚠️
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T029 [P] [US4] Component tests for match and player statistics edit modal in src/features/match-detail/__tests__/components/MatchEditModal.test.tsx
- [X] T030 [US4] Integration tests for edit mode saving, persistence, and recalculation in src/features/match-detail/__tests__/MatchDetailView.test.tsx

### Implementation for User Story 4

- [X] T031 [P] [US4] Implement MatchEditModal component with period and player stat inputs in src/features/match-detail/components/MatchEditModal.tsx
- [X] T032 [US4] Connect edit modal trigger, buffer management, and persistence actions in src/features/match-detail/store/useMatchDetailStore.ts and src/features/match-detail/MatchDetailView.tsx
- [X] T033 [US4] Update live match finalization in src/features/play-match/PlayMatch.tsx to persist period fouls to games table

**Checkpoint**: All 4 user stories complete with full post-game editing and real-time recalculation.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, responsive refinement, and quality gates

- [X] T034 [P] Verify strict TypeScript compilation with zero errors across all files via npx tsc --noEmit
- [X] T035 Run full Jest test suite across the application to ensure zero regressions in src/
- [X] T036 Execute manual verification scenarios from specs/009-match-detail-view/quickstart.md
- [X] T037 Refine NativeWind responsive styling, contrast, and layout across phone and tablet viewport sizes in src/features/match-detail/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user story UI development.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion. Delivers the core MVP.
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion. Can run in parallel with US1 or sequentially after US1.
- **User Story 3 (Phase 5)**: Depends on Phase 2 completion (specifically `calculations.ts` and `radarGeometry.ts`). Can run in parallel with US1/US2.
- **User Story 4 (Phase 6)**: Depends on Phase 2 (schema and store) and integrates with US1/US2/US3 components.
- **Polish (Phase 7)**: Depends on all user stories being implemented.

### User Story Dependencies

- **User Story 1 (P1)**: Independent of other stories; requires Foundational Phase.
- **User Story 2 (P1)**: Independent of US3/US4; shares roster items prepared in Foundational Phase.
- **User Story 3 (P2)**: Independent of US2/US4; consumes team aggregations from calculations engine.
- **User Story 4 (P2)**: Modifies data reflected across US1, US2, and US3.

### Parallel Opportunities

- All Phase 1 and Phase 2 tasks marked `[P]` can run concurrently.
- Within each User Story, tests marked `[P]` can be developed concurrently before implementation.
- `MatchSummaryHeader` (`T014`) and `PeriodBreakdownTable` (`T015`) can be implemented in parallel.
- `RosterValuationList` (`T021`) and `PlayerDetailModal` (`T022`) can be implemented in parallel.
- `PolygonRadarChart` (`T026`) and `TeamAdvancedAnalytics` (`T027`) can be implemented in parallel.

---

## Parallel Execution Examples

### User Story 1
```bash
# Concurrently develop test suites:
Task T012: src/features/match-detail/__tests__/components/MatchSummaryHeader.test.tsx
Task T013: src/features/match-detail/__tests__/components/PeriodBreakdownTable.test.tsx

# Concurrently implement subcomponents:
Task T014: src/features/match-detail/components/MatchSummaryHeader.tsx
Task T015: src/features/match-detail/components/PeriodBreakdownTable.tsx
```

### User Story 2
```bash
# Concurrently develop test suites:
Task T019: src/features/match-detail/__tests__/components/RosterValuationList.test.tsx
Task T020: src/features/match-detail/__tests__/components/PlayerDetailModal.test.tsx

# Concurrently implement components:
Task T021: src/features/match-detail/components/RosterValuationList.tsx
Task T022: src/features/match-detail/components/PlayerDetailModal.tsx
```

### User Story 3
```bash
# Concurrently develop visualizer tests:
Task T024: src/features/match-detail/__tests__/components/PolygonRadarChart.test.tsx
Task T025: src/features/match-detail/__tests__/components/TeamAdvancedAnalytics.test.tsx

# Concurrently implement visualizer components:
Task T026: src/features/match-detail/components/PolygonRadarChart.tsx
Task T027: src/features/match-detail/components/TeamAdvancedAnalytics.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1: Header, Period Breakdown, Route integration).
3. Validate independent MVP test: Finished matches in `GameList` open `MatchDetailView` with cumulative score and quarter breakdown of points and fouls.

### Incremental Delivery
1. Foundation + Phase 3: Deliver MVP (high-level score & foul desglose).
2. Phase 4: Add value-sorted roster & player box score drill-down.
3. Phase 5: Add advanced efficiency metrics & polygon radar visualization.
4. Phase 6: Add post-game edit mode for correcting scores, fouls, and individual stats.
5. Phase 7: Run full automated suite (`tsc`, `jest`) and quickstart validation scenarios.
