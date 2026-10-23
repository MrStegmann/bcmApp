# Tasks: Matches & New Match Workflow (Date-Only Mask & Roster Enforcement)

**Input**: Design documents from `specs/006-matches-and-new-match/`  
**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/match-contracts.ts](./contracts/match-contracts.ts)  

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story adhering to Test-Driven Development (TDD) as mandated by the project constitution.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)
- File paths are explicitly specified in every task description

## Path Conventions

- Mobile app with source at `src/` and tests at `src/__tests__/` or co-located `src/features/**/__tests__/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and contracts initialization for date-only match creation and form validation.

- [X] T001 Update match contracts and form types in src/types/match.ts
- [X] T002 [P] Sync interface definitions in specs/006-matches-and-new-match/contracts/match-contracts.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation utilities, date auto-masking helpers, and backward-compatible match date sorting that MUST be complete before UI form stories.

**⚠️ CRITICAL**: Foundational tasks must complete before user story UI implementation.

- [X] T003 [P] Add unit tests for date-only auto-masking and Gregorian calendar/leap year validation in src/__tests__/utils/dateValidation.test.ts
- [X] T004 Implement applyDateMask, validateMatchDate, and backward-compatible parseMatchTimestamp in src/utils/dateValidation.ts
- [X] T005 [P] Add unit tests for date-only and legacy timestamp parsing and sorting in src/features/home-view/__tests__/matchDateHelper.test.ts
- [X] T006 Update match date parsing and recency sorting to support date-only format in src/features/home-view/utils/matchDateHelper.ts

**Checkpoint**: Foundation ready - date-only masking, validation, and recency sorting verified with unit tests.

---

## Phase 3: User Story 1 - Create Match with Date-Only Numeric Input and Optional Roster (Priority: P1) 🎯 MVP

**Goal**: Enable coaches/scorers to create a match by entering `round`, date (`dd/mm/aaaa` without time/hour), and `rivalTeamName` with numeric-only keyboard restriction and automatic slash formatting (`23102026` -> `23/10/2026`), followed by an optional roster modal with a skip option and placement at the top of the matches list.

**Independent Test**: Open Match Creation form, verify date field shows "Fecha" label and placeholder "dd/mm/aaaa" with no hour/minute selection, enter digits and verify automatic `/` masking and rejection of non-numeric characters, fill round and rival team name, test skipping or selecting roster, and verify match is saved in `pending` status at the top of the list.

### Tests for User Story 1 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Add unit and component tests for date-masking, numeric restrictions, and deletion in src/__tests__/components/InputDateMask.test.tsx
- [X] T008 [P] [US1] Update GameForm component tests for date-only validation, labels, and submission payload in src/__tests__/components/GameForm.test.tsx

### Implementation for User Story 1

- [X] T009 [US1] Update Input component in src/framework/Input.tsx to restrict input to numbers and apply dd/mm/aaaa auto-formatting mask
- [X] T010 [US1] Update GameForm component in src/components/GameForm.tsx to use date-only field, remove hour/time elements, and format submission payload
- [X] T011 [US1] Verify match creation and optional roster prompt flow integration in src/page/GameList.tsx

**Checkpoint**: User Story 1 is fully functional and testable independently as an MVP.

---

## Phase 4: User Story 2 - Mandatory Roster Enforcement Before Match Start (Priority: P1)

**Goal**: Block entering the live match screen for any `pending` match that has no declared roster by presenting a blocking roster modal (no skip button) that requires at least 1 player to proceed.

**Independent Test**: Tap a pending match with zero roster players in the matches list, verify the modal blocks navigation and disables confirmation until at least 1 player is selected, confirm selection, and verify navigation to live match view.

### Tests for User Story 2 (TDD First) ⚠️

- [X] T012 [P] [US2] Verify and expand mandatory roster enforcement unit tests in src/__tests__/components/GameListRosterEnforcement.test.tsx

### Implementation for User Story 2

- [X] T013 [US2] Verify mandatory roster modal blocking behavior and minimum 1 player constraint in src/page/GameList.tsx

**Checkpoint**: User Stories 1 AND 2 operate independently with complete verification.

---

## Phase 5: User Story 3 - Match State Lifecycle Management (Priority: P2)

**Goal**: Manage match lifecycle states (`pending` -> `inProgress` -> `finished`), starting the chronograph in `PlayMatch.tsx` transitions state to `inProgress`, and tapping "Save & Finish" transitions state to `finished` with proper badge indicators in `GameCards.tsx`.

**Independent Test**: Open a match with a roster in `PlayMatch.tsx`, start the chronograph and confirm status updates to `inProgress`, tap "Save & Finish" and confirm status updates to `finished`, and verify match cards display corresponding status badges.

### Tests for User Story 3 (TDD First) ⚠️

- [X] T014 [P] [US3] Verify unit tests for match lifecycle state transitions and chronograph start in src/__tests__/store/GameStore.test.ts

### Implementation for User Story 3

- [X] T015 [US3] Verify chronograph start (inProgress) and game completion (finished) transitions in src/page/PlayMatch.tsx
- [X] T016 [P] [US3] Verify status badge rendering and date-only display in src/components/GameCards.tsx

**Checkpoint**: Complete match lifecycle management verified across all three states.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Full regression validation, quickstart verification, and performance confirmation.

- [X] T017 Execute full test suite (npm test) and resolve any regressions across all test suites
- [X] T018 Validate all verification scenarios documented in specs/006-matches-and-new-match/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user story work
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (MVP target)
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion; integrates with roster modal from US1
- **User Story 3 (Phase 5)**: Depends on Phase 2 completion; integrates with match entry from US2
- **Polish (Phase 6)**: Depends on completion of all user story phases

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependency on US2 or US3.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). Uses `RosterSelectionModal`.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). Uses matches started via US2.

### Within Each User Story

- Tests MUST be written FIRST and verified to fail (Red) before implementation (Green)
- Core components before integration
- Checkpoint validation before moving to next story

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003 and T005 can run in parallel during Foundational test authoring
- T007 and T008 (US1 tests) can run in parallel
- T012 (US2 test) and T014 (US3 test) can be authored in parallel with their respective phases
- T016 (GameCards UI badge verification) can run in parallel with T015 (PlayMatch verification)

---

## Parallel Example: User Story 1

```bash
# Launch both test tasks for User Story 1 in parallel:
Task: "Add unit and component tests for date-masking, numeric restrictions, and deletion in src/__tests__/components/InputDateMask.test.tsx"
Task: "Update GameForm component tests for date-only validation, labels, and submission payload in src/__tests__/components/GameForm.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`src/types/match.ts`)
2. Complete Phase 2: Foundational (`dateValidation.ts`, `matchDateHelper.ts`)
3. Complete Phase 3: User Story 1 (`Input.tsx`, `GameForm.tsx`, `GameList.tsx`)
4. **STOP and VALIDATE**: Verify date-only input, numeric restriction, auto-masking `dd/mm/aaaa`, and match creation
5. Demo / Review MVP

### Incremental Delivery

1. Setup + Foundational -> Foundation verified
2. Add User Story 1 -> Date-only mask & match creation verified (MVP!)
3. Add User Story 2 -> Mandatory roster enforcement verified
4. Add User Story 3 -> Match lifecycle & chronograph verified
5. Phase 6 -> Full test suite pass (`npm test`) and quickstart scenario verification

---

## Notes

- All tasks strictly follow format `- [ ] [TaskID] [P?] [Story?] Description with file path`
- Strict adherence to Constitution Principle I (TDD First)
- Mobile numeric keypad (`keyboardType="number-pad"` or `"numeric"`)
- Full backward compatibility with existing legacy timestamps (`dd/mm/aaaa - hh:mm`)
