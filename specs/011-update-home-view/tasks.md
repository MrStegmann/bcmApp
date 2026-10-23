# Tasks: Update Home View Page

**Input**: Design documents from `/specs/011-update-home-view/`
**Prerequisites**: [plan.md](file:///j:/GitHub/BasketApp/bcmApp/specs/011-update-home-view/plan.md), [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/011-update-home-view/spec.md), [research.md](file:///j:/GitHub/BasketApp/bcmApp/specs/011-update-home-view/research.md), [data-model.md](file:///j:/GitHub/BasketApp/bcmApp/specs/011-update-home-view/data-model.md), [contracts/](file:///j:/GitHub/BasketApp/bcmApp/specs/011-update-home-view/contracts/)
**Tests**: Mandatory per Constitution Principle I (Test-Driven Development First). All tests must be written first and fail before implementing corresponding components and business logic.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `[US1]`, `[US2]`, `[US3]`)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, directory scaffolding, and core type definitions.

- [X] T001 Create feature directory structure in `src/features/home-view/` (`components/`, `store/`, `types/`, `utils/`, `__tests__/`)
- [X] T002 [P] Define domain and component TypeScript contracts in `src/features/home-view/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core calculation helpers, date parsing utilities, and shared store infrastructure that MUST be complete before user stories can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Unit tests for date parsing, sorting, and tie-breaking in `src/features/home-view/__tests__/matchDateHelper.test.ts`
- [X] T004 Implement date parsing and chronological sorting helper in `src/features/home-view/utils/matchDateHelper.ts`
- [X] T005 [P] Unit tests for store state management and batch data fetching in `src/features/home-view/__tests__/useHomeViewStore.test.ts`
- [X] T006 Implement base Zustand store and batch Drizzle ORM queries in `src/features/home-view/store/useHomeViewStore.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Next Match Ahead & Quick Roster Callup (Priority: P1) 🎯 MVP

**Goal**: Displays the earliest chronologically scheduled uninitialized fixture (rival name and date) at the top of the home view, with a quick-action button to configure player roster callups via `RosterSelectionModal`, or the exact fallback text `"Sin próximos partidos agendados"` when no pending matches exist.

**Independent Test**: Create an uninitialized fixture for a team, verify opponent name and date appear at the top, verify "Configurar Convocatoria" button appears when no players are called up, test roster configuration via modal, and verify fallback `"Sin próximos partidos agendados"` appears when no pending matches exist.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Unit and component tests for NextMatchCard in `src/features/home-view/__tests__/components/NextMatchCard.test.tsx`

### Implementation for User Story 1

- [X] T008 [US1] Implement `NextMatchCard` component in `src/features/home-view/components/NextMatchCard.tsx`
- [X] T009 [US1] Implement roster callup verification and persistence action in `src/features/home-view/store/useHomeViewStore.ts`
- [X] T010 [US1] Integrate `RosterSelectionModal` for upcoming match roster configuration in `src/features/home-view/HomeView.tsx`

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently (MVP ready).

---

## Phase 4: User Story 2 - Recent Match History & Period Score Breakdown (Priority: P1)

**Goal**: Displays up to 3 most recently finished games in a vertical column (sorted newest first), showing total cumulative score, period-by-period score breakdown directly underneath each match, and an interactive action to open `MatchDetailView`.

**Independent Test**: Load a team with 3 or more finished matches, verify exactly the last 3 matches are displayed vertically in reverse chronological order (newest first), validate final score and period scores underneath, and tap the detail button to open the Match Detail View. Verify clean empty state when 0 matches played.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US2] Component tests for RecentMatchesColumn and RecentMatchCard in `src/features/home-view/__tests__/components/RecentMatchesColumn.test.tsx`

### Implementation for User Story 2

- [X] T012 [P] [US2] Implement `RecentMatchCard` component with total score and period breakdown sub-row in `src/features/home-view/components/RecentMatchCard.tsx`
- [X] T013 [US2] Implement `RecentMatchesColumn` component rendering up to 3 finished games in a vertical column in `src/features/home-view/components/RecentMatchesColumn.tsx`
- [X] T014 [US2] Integrate match detail selection navigation callback from recent matches in `src/features/home-view/HomeView.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 both work and are independently testable.

---

## Phase 5: User Story 3 - Global Team Advanced Statistics Averages (Priority: P2)

**Goal**: Displays aggregated arithmetic means across all completed matches for the eight advanced efficiency metrics (`Posesiones`, `OER`, `DER`, `eFG%`, `ORB%`, `AST%`, `TOV%`, `FTR`), with division-by-zero safeguards and clean percentage formatting.

**Independent Test**: Provide recorded stats across multiple completed games, compute arithmetic mean of each of the 8 metrics, verify `GlobalStatsCard` displays the exact computed averages with correct numerical and percentage formatting, and verify 0 completed games renders `0.0`/`0.0%` safely without NaN/Infinity.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T015 [P] [US3] Unit tests for statsCalculator in `src/features/home-view/__tests__/statsCalculator.test.ts`
- [X] T016 [P] [US3] Component tests for GlobalStatsCard in `src/features/home-view/__tests__/components/GlobalStatsCard.test.tsx`

### Implementation for User Story 3

- [X] T017 [US3] Implement advanced metric calculation and arithmetic mean aggregation in `src/features/home-view/utils/statsCalculator.ts`
- [X] T018 [US3] Implement `GlobalStatsCard` component with responsive summary grid in `src/features/home-view/components/GlobalStatsCard.tsx`
- [X] T019 [US3] Wire global stats calculation into `useHomeViewStore.ts` during batch data fetch in `src/features/home-view/store/useHomeViewStore.ts`

**Checkpoint**: All three user stories are now independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Assemble the three sections in exact vertical order within `HomeView`, integrate with `ClubProfile.tsx`, export public feature boundary, and validate end-to-end scenarios.

- [X] T020 [P] Integration tests for HomeView container in `src/features/home-view/__tests__/HomeView.test.tsx`
- [X] T021 Implement `HomeView.tsx` container assembling the 3 sections in vertical order within a root `ScrollView` in `src/features/home-view/HomeView.tsx`
- [X] T022 Export feature public API and types from barrel file in `src/features/home-view/index.ts`
- [X] T023 Update `ClubProfile.tsx` to render `<HomeView />` when `option === TopMenuEnums.MAIN`, handling navigation to `MatchDetailView` and returning in `src/page/ClubProfile.tsx`
- [X] T024 [P] Update and run page tests in `src/__tests__/components/ClubProfile.test.tsx` verifying HomeView rendering and tab switching
- [X] T025 Validate end-to-end scenarios against `specs/011-update-home-view/quickstart.md` and verify full test suite passes via `npm test`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories.
- **User Stories (Phases 3, 4, 5)**: Depend on Foundational (Phase 2) completion.
  - User stories can proceed in parallel (if staffed) or sequentially in priority order:
    - US1 (P1, MVP) → US2 (P1) → US3 (P2)
- **Polish (Phase 6)**: Depends on all user story phases being completed.

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Foundational (Phase 2). Delivers standalone MVP.
- **User Story 2 (P1)**: Depends on Foundational (Phase 2). Interacts with `HomeView` navigation callback. Independently testable.
- **User Story 3 (P2)**: Depends on Foundational (Phase 2). Interacts with batch data fetch in `useHomeViewStore`. Independently testable.

### Within Each User Story

- Tests MUST be written and fail first before implementation (TDD non-negotiable).
- Calculation utilities and models before UI components.
- Components before container wiring.
- Story complete and verified before proceeding to next phase.

---

## Parallel Execution Opportunities

### Parallel Example: User Story 1
```bash
# Launch test and store preparation in parallel:
Task: "T007 [P] [US1] Unit and component tests for NextMatchCard in src/features/home-view/__tests__/components/NextMatchCard.test.tsx"
Task: "T009 [US1] Implement roster callup verification and persistence action in src/features/home-view/store/useHomeViewStore.ts"
```

### Parallel Example: User Story 2
```bash
# Launch test and card implementation in parallel:
Task: "T011 [P] [US2] Component tests for RecentMatchesColumn and RecentMatchCard in src/features/home-view/__tests__/components/RecentMatchesColumn.test.tsx"
Task: "T012 [P] [US2] Implement RecentMatchCard component with total score and period breakdown sub-row in src/features/home-view/components/RecentMatchCard.tsx"
```

### Parallel Example: User Story 3
```bash
# Launch calculator test and card test in parallel:
Task: "T015 [P] [US3] Unit tests for statsCalculator in src/features/home-view/__tests__/statsCalculator.test.ts"
Task: "T016 [P] [US3] Component tests for GlobalStatsCard in src/features/home-view/__tests__/components/GlobalStatsCard.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`src/features/home-view/types/index.ts`).
2. Complete Phase 2: Foundational (Date helper and base store).
3. Complete Phase 3: User Story 1 (`NextMatchCard`, roster modal, `"Sin próximos partidos agendados"`).
4. **STOP and VALIDATE**: Verify User Story 1 displays upcoming match or empty state, launches roster modal, and passes all tests.

### Incremental Delivery

1. Setup + Foundational → Solid data fetching & parsing base.
2. Add User Story 1 → Coach can immediately see next game & configure roster (MVP!).
3. Add User Story 2 → Coach can review recent match outcomes and drill into match detail.
4. Add User Story 3 → Coach can analyze global team efficiency averages.
5. Polish & Integrate → Assemble into `ClubProfile.tsx` with smooth scrolling and robust regression testing.

### Parallel Team Strategy

With multiple developers:
- Developer A: User Story 1 (`NextMatchCard` & roster workflow).
- Developer B: User Story 2 (`RecentMatchesColumn` & period breakdowns).
- Developer C: User Story 3 (`statsCalculator` & `GlobalStatsCard`).
All converge seamlessly in Phase 6 within `HomeView.tsx`.
