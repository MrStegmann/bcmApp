# Tasks: Direct Match Result & Stats Entry (Set Completed Match)

**Input**: Design documents from `/specs/017-set-completed-match/`  
**Prerequisites**: [plan.md](file:///j:/GitHub/BasketApp/bcmApp/specs/017-set-completed-match/plan.md), [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/017-set-completed-match/spec.md), [research.md](file:///j:/GitHub/BasketApp/bcmApp/specs/017-set-completed-match/research.md), [data-model.md](file:///j:/GitHub/BasketApp/bcmApp/specs/017-set-completed-match/data-model.md), [contracts/](file:///j:/GitHub/BasketApp/bcmApp/specs/017-set-completed-match/contracts/)

**Constitution Alignment**: Adheres strictly to Principle I (Test-Driven Development First - Red-Green-Refactor) and Principle II (Feature-Based Architecture in `src/features/direct-result/`). All test tasks are written first and must fail before corresponding implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize feature directory, types, and barrel exports.

- [X] T001 Create feature directory structure and define TypeScript interfaces in `src/features/direct-result/types/index.ts`
- [X] T002 [P] Create initial public barrel export in `src/features/direct-result/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core calculation utilities, FIBA PIR valuation formulas, and validation helpers required across all user stories.

**⚠️ CRITICAL**: Foundational utilities must be implemented and tested before user story integration.

- [X] T003 [P] Unit tests for calculation and validation helpers in `src/features/direct-result/__tests__/utils/directResultCalculations.test.ts`
- [X] T004 Implement calculation and validation helpers (period totals, FIBA PIR valuation, input sanitation) in `src/features/direct-result/utils/directResultCalculations.ts`

**Checkpoint**: Foundation ready - calculations and validation helpers tested and functional.

---

## Phase 3: User Story 1 - Action Buttons 2-Column Grid & Direct Result Button (Priority: P1)

**Goal**: Organize action buttons on match cards into a structured 2-column grid and provide a dedicated "Set Result" button enabled strictly for pending matches and disabled/hidden for live or finished matches.

**Independent Test**: Load match cards with various statuses (`pending`, `inProgress`, `finished`) and verify that buttons render in a 2-column grid container, with the "Set Result" button enabled for pending matches and disabled/hidden for in-progress and finished matches.

### Tests for User Story 1 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T005 [P] [US1] Unit and component tests for 2-column action grid and "Set Result" button states in `src/__tests__/components/GameCards.test.tsx`

### Implementation for User Story 1

- [X] T006 [US1] Update action button container layout to 2-column grid and add "Set Result" button in `src/components/GameCards.tsx`

**Checkpoint**: At this point, User Story 1 is fully functional and independently testable. Match cards render the 2-column action grid with the "Set Result" button correctly conditioned on match status.

---

## Phase 4: User Story 2 - Period-by-Period Score & Foul Entry (Priority: P1)

**Goal**: Provide input fields for both team and opponent points and fouls across all 4 regulation periods plus optional overtime, with real-time cumulative score recalculation and non-negative value validation.

**Independent Test**: Render `PeriodScoresSection`, input points and fouls across Q1-Q4, verify cumulative totals match the sum of period inputs, test the overtime toggle, and verify negative numbers are rejected.

### Tests for User Story 2 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US2] Component tests for period scores and fouls input with live calculations in `src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx`

### Implementation for User Story 2

- [X] T008 [US2] Implement PeriodScoresSection component with regulation (Q1-Q4) and overtime inputs in `src/features/direct-result/components/PeriodScoresSection.tsx`

**Checkpoint**: User Story 2 is fully functional and independently testable. Period score inputs accurately compute totals and handle overtime toggling.

---

## Phase 5: User Story 3 - Per-Player Roster Statistics Entry (Priority: P1)

**Goal**: Display roster players and allow isolated data entry of individual basketball statistics (shooting made/attempted, rebounds, assists, steals, turnovers, personal fouls, minutes) with real-time points and FIBA PIR valuation calculation.

**Independent Test**: Render `PlayerStatsSection`, enter distinct statistics for multiple players, verify that each player's inputs are strictly isolated, verify that points and valuation calculate correctly, and verify empty roster handling.

### Tests for User Story 3 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US3] Component tests for roster player stats entry and isolated calculations in `src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx`

### Implementation for User Story 3

- [X] T010 [US3] Implement PlayerStatsSection component with player list and isolated stat inputs in `src/features/direct-result/components/PlayerStatsSection.tsx`

**Checkpoint**: User Story 3 is fully functional and independently testable. Player statistics are recorded with complete isolation between roster members.

---

## Phase 6: User Story 4 - Direct Match Completion & State Transition on Save (Priority: P1)

**Goal**: Provide a comprehensive full-screen modal (`DirectResultModal`) coordinating period and player stat tabs, validating inputs, persisting scores and player stats atomically, transitioning match status directly to `finished`, and refreshing `GameList`.

**Independent Test**: Open modal from a pending match card, fill period scores and roster stats, tap "Save", verify that data persists to SQLite, verify match status transitions to `finished`, modal closes, and `GameList` displays the finished match without the "Set Result" button.

### Tests for User Story 4 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US4] Component tests for DirectResultModal tab switching, cancel, and save validation in `src/features/direct-result/__tests__/components/DirectResultModal.test.tsx`
- [X] T012 [P] [US4] Integration tests for GameList direct result opening, save persistence, and list refresh in `src/__tests__/page/GameListDirectResult.test.tsx`

### Implementation for User Story 4

- [X] T013 [US4] Implement DirectResultModal component coordinating tabs, validation, and callbacks in `src/features/direct-result/components/DirectResultModal.tsx`
- [X] T014 [US4] Export DirectResultModal and public types in `src/features/direct-result/index.ts`
- [X] T015 [US4] Integrate DirectResultModal into GameList and handle atomic persistence and direct transition to finished in `src/page/GameList.tsx`

**Checkpoint**: All user stories are complete and integrated. Users can set results directly, save with a single click, and see matches transition directly to finished.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Regression testing, strict TypeScript verification, test suite execution, and manual walkthrough validation.

- [X] T016 [P] Verify and update existing GameCards tests for 2-column layout in `src/__tests__/components/GameCardsRosterButton.test.tsx`
- [X] T017 Run TypeScript verification across the codebase with `npx tsc --noEmit`
- [X] T018 Run full Jest test suite to ensure zero regressions across all features
- [X] T019 Perform end-to-end manual verification following `specs/017-set-completed-match/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS User Stories 2, 3, 4.
- **User Story 1 (Phase 3)**: Depends on Phase 1 completion. Can proceed in parallel with Phase 2 (operates on `GameCards.tsx` independent of direct-result calculations).
- **User Story 2 (Phase 4)**: Depends on Phase 2 (uses calculation helpers).
- **User Story 3 (Phase 5)**: Depends on Phase 2 (uses valuation calculation helpers).
- **User Story 4 (Phase 6)**: Depends on Phase 3 (Set Result button trigger), Phase 4 (`PeriodScoresSection`), and Phase 5 (`PlayerStatsSection`).
- **Polish (Phase 7)**: Depends on completion of all user story phases.

### User Story Dependencies

- **User Story 1 (P1)**: Independent of US2 and US3. Can be tested and reviewed immediately.
- **User Story 2 (P2)**: Independent of US1 and US3. Can be tested in isolation.
- **User Story 3 (P3)**: Independent of US1 and US2. Can be tested in isolation.
- **User Story 4 (P4)**: Assembles US1 (trigger), US2 (period component), and US3 (player stats component) into the final workflow.

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel.
- **Phase 2**: T003 (test) runs before T004 (implementation).
- **Phase 3 & Phase 2**: T005 and T006 can be developed in parallel with T003 and T004.
- **Phase 4 & Phase 5**: T007/T008 (`PeriodScoresSection`) and T009/T010 (`PlayerStatsSection`) can be developed in parallel as they target separate files.
- **Phase 6**: T011 and T012 (tests) can run in parallel before T013/T014/T015.
- **Phase 7**: T016 can run in parallel with type checking.

---

## Parallel Example: User Story 2 & User Story 3

```bash
# Developer A working on Period Scores (US2):
Task T007: "Component tests for period scores and fouls input in src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx"
Task T008: "Implement PeriodScoresSection component in src/features/direct-result/components/PeriodScoresSection.tsx"

# Developer B working in parallel on Player Stats (US3):
Task T009: "Component tests for roster player stats entry in src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx"
Task T010: "Implement PlayerStatsSection component in src/features/direct-result/components/PlayerStatsSection.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + Foundational)

1. Complete Phase 1: Setup (`src/features/direct-result/types/index.ts`, `src/features/direct-result/index.ts`)
2. Complete Phase 2: Foundational calculation helpers (`directResultCalculations.ts`)
3. Complete Phase 3: User Story 1 (2-column grid layout and "Set Result" button on match cards)
4. **STOP and VALIDATE**: Verify match cards display the 2-column grid with the "Set Result" button correctly enabled for pending matches and disabled for live/finished matches.

### Incremental Delivery

1. **Increment 1 (US1)**: 2-column action grid in `GameCards.tsx` + "Set Result" button.
2. **Increment 2 (US2)**: Period score entry section with auto-totals and overtime toggle.
3. **Increment 3 (US3)**: Player statistics entry section with isolated player inputs.
4. **Increment 4 (US4)**: Full `DirectResultModal` lifecycle in `GameList.tsx` with atomic save and direct status transition to `finished`.
5. **Increment 5 (Polish)**: Full test suite, TypeScript check, and quickstart walkthrough.

---

## Notes

- All tasks strictly follow `- [ ] [TaskID] [P?] [Story?] Description with file path`.
- Tests are mandated by Constitution Principle I (TDD First) and written prior to implementation.
- Commit after each task or logical group.
- Verify tests fail (Red) before writing code that turns them green.
