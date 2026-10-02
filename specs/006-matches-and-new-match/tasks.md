# Tasks: Matches & New Match Workflow

**Input**: Design documents from `specs/006-matches-and-new-match/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/match-contracts.ts](./contracts/match-contracts.ts)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story adhering to Test-Driven Development (TDD).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are provided in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Types and database schema updates for match lifecycle and fields.

- [X] T001 Define match domain types, status enums, and form contracts in `src/types/match.ts`
- [X] T002 [P] Update database schema in `src/db/schema.ts` and infer types in `src/types/database.ts` to include `status`, text `round`, and `createdAt`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation helpers and store state machine that MUST be complete before UI stories.

**⚠️ CRITICAL**: Foundational tasks must complete before user story UI implementation.

- [X] T003 [P] Unit test date/time format validation (`dd/mm/aaaa - hh:mm`) in `src/__tests__/utils/dateValidation.test.ts`
- [X] T004 [P] Implement date/time validation helper in `src/utils/dateValidation.ts`
- [X] T005 [P] Unit tests for `GameStore` sorting by recency and state transitions in `src/__tests__/store/GameStore.test.ts`
- [X] T006 Update `src/store/GameStore.ts` and `src/hooks/useDB.ts` with recency sorting (most recent match first), status updates, and lifecycle transitions (`startMatch`, `finishMatch`)

**Checkpoint**: Foundation ready - store, schema, and validation logic verified with tests.

---

## Phase 3: User Story 1 - Create Match with Mandatory Fields and Optional Roster (Priority: P1) 🎯 MVP

**Goal**: Allow users to create matches requiring `round`, `timeStamp` (`dd/mm/aaaa - hh:mm`), and `rivalTeamName`, present an optional roster modal with a skip option, and redirect to the matches list with the new match at the top.

**Independent Test**: Fill the match creation form, submit valid fields, test both skipping and selecting roster players in the modal, and verify the match is persisted in `pending` status at the top of the matches list.

### Tests for User Story 1 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Component tests for `GameForm` mandatory field validation (`round`, `timeStamp`, `rivalTeamName`) in `src/__tests__/components/GameForm.test.tsx`
- [X] T008 [P] [US1] Component tests for `RosterSelectionModal` in optional mode (skip button and player selection) in `src/__tests__/components/RosterSelectionModal.test.tsx`

### Implementation for User Story 1

- [X] T009 [US1] Implement reusable `RosterSelectionModal` component in `src/components/RosterSelectionModal.tsx`
- [X] T010 [US1] Update `src/components/GameForm.tsx` to require and validate `round` (string), `timeStamp` (`dd/mm/aaaa - hh:mm`), and `rivalTeamName` (string)
- [X] T011 [US1] Update `src/page/GameList.tsx` creation flow to trigger `RosterSelectionModal` upon valid form submission and redirect to the sorted matches list

**Checkpoint**: User Story 1 is fully functional and testable independently as an MVP.

---

## Phase 4: User Story 2 - Mandatory Roster Enforcement Before Match Start (Priority: P1)

**Goal**: Block starting any pending match that has no roster declared by presenting a mandatory roster modal that cannot be skipped and requires at least 1 player before game entry.

**Independent Test**: Tap a pending match with no roster in the matches list, verify that the blocking modal prevents starting the game until a roster is selected and confirmed.

### Tests for User Story 2 (TDD First) ⚠️

- [X] T012 [P] [US2] Component tests for mandatory roster check and blocking modal on match click in `src/__tests__/components/GameListRosterEnforcement.test.tsx`

### Implementation for User Story 2

- [X] T013 [US2] Update `src/page/GameList.tsx` to check roster existence when tapping a pending match, display `RosterSelectionModal` in mandatory mode if missing, and persist roster before initiating match play

**Checkpoint**: User Story 1 AND User Story 2 work independently with full test coverage.

---

## Phase 5: User Story 3 - Match State Lifecycle Management & Live Match Play (Priority: P2)

**Goal**: Implement `PlayMatch.tsx` screen with a live chronograph, transition match status from `pending` to `inProgress` when the timer starts, and transition to `finished` when saving and finishing the match.

**Independent Test**: Start a match with a valid roster, verify navigation to `PlayMatch.tsx`, start the chronograph and verify `inProgress` transition, click "Save & Finish" and verify `finished` transition in the matches list.

### Tests for User Story 3 (TDD First) ⚠️

- [X] T014 [P] [US3] Component & integration tests for `PlayMatch` chronograph and state transitions in `src/__tests__/page/PlayMatch.test.tsx`

### Implementation for User Story 3

- [X] T015 [US3] Implement `PlayMatch.tsx` screen in `src/page/PlayMatch.tsx` with chronograph controls, score tracking, and "Save & Finish" confirmation
- [X] T016 [US3] Integrate navigation to `PlayMatch.tsx` within `src/page/GameList.tsx` when a match is started

**Checkpoint**: All three match states (`pending`, `inProgress`, `finished`) and screen transitions function seamlessly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UI status badge indicators, comprehensive regression suite, and validation against quickstart scenarios.

- [X] T017 [P] Update `src/components/GameCards.tsx` to display status badges (`pending`, `inProgress`, `finished`) and format timestamps
- [X] T018 Execute full test suite (`npm test`) and fix any regression issues across existing components
- [X] T019 Validate end-to-end scenarios documented in `specs/006-matches-and-new-match/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (MVP target)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (`RosterSelectionModal` from US1)
- **User Story 3 (Phase 5)**: Depends on Phase 4 (Match entry trigger from US2)
- **Polish (Phase 6)**: Depends on Phases 3-5

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003, T004, and T005 can run in parallel during Foundational phase
- T007 and T008 (US1 tests) can run in parallel
- T012 (US2 test) and T014 (US3 test) can be authored in parallel with their respective phases
- T017 (GameCards UI polish) can run in parallel with PlayMatch styling

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 (Setup) and Phase 2 (Foundational)
2. Complete Phase 3 (User Story 1)
3. Validate: Match creation with mandatory fields, optional roster modal, and recency sorting

### Incremental Delivery
1. Add User Story 2: Enforce mandatory roster before match start
2. Add User Story 3: Implement `PlayMatch.tsx` live chronograph and three-state machine
3. Execute Phase 6 Polish & full test suite
