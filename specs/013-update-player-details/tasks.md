# Tasks: Update Player Contract, Form, and Details

**Input**: Design documents from `/specs/013-update-player-details/`
**Prerequisites**: [plan.md](file:///j:/GitHub/BasketApp/bcmApp/specs/013-update-player-details/plan.md), [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/013-update-player-details/spec.md), [research.md](file:///j:/GitHub/BasketApp/bcmApp/specs/013-update-player-details/research.md), [data-model.md](file:///j:/GitHub/BasketApp/bcmApp/specs/013-update-player-details/data-model.md), [contracts/](file:///j:/GitHub/BasketApp/bcmApp/specs/013-update-player-details/contracts/)

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and mock contracts synchronization

- [X] T001 [P] Update player types in `src/types/database.ts` to reflect updated schema
- [X] T002 [P] Update MockPlayerConfig in `src/types/mockData.ts` to remove position/notes and add optional jerseyName

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, migrations, and mock data foundation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Update Drizzle ORM players schema in `src/db/schema.ts` (remove position/notes, add jerseyName)
- [X] T004 Update SQLite table creation DDL and ALTER TABLE migration in `src/db/index.ts`
- [X] T005 [P] Update mock player fixtures in `src/db/mock/mockTeamData.ts` to remove position/notes and add jerseyName
- [X] T006 [P] Update dataset validation rules in `src/db/mock/mockDataValidator.ts` to remove position requirement
- [X] T007 Validate foundational mock dataset changes by updating and executing tests in `src/__tests__/db/mockDataValidator.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Modernized Player Profile Creation and Editing (Priority: P1) 🎯 MVP

**Goal**: Manage player profiles with First Name, Last Name, Number, and optional Jersey Name, omitting obsolete position and notes fields from forms and persistence.

**Independent Test**: Can be tested independently by navigating to player creation and editing forms, confirming input fields (First Name, Last Name, Number, optional Jersey Name) render without position or notes, saving a player with/without jerseyName, and verifying persisted data.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (TDD Non-Negotiable)**

- [X] T008 [P] [US1] Create unit tests for player persistence with optional jerseyName in `src/__tests__/store/PlayerStore.test.ts`
- [X] T009 [P] [US1] Create component tests for PlayerForm rendering, validations, and submission in `src/__tests__/components/PlayerForm.test.tsx`

### Implementation for User Story 1

- [X] T010 [US1] Update PlayerStore CRUD operations for jerseyName in `src/store/PlayerStore.ts`
- [X] T011 [US1] Update PlayerController add/edit methods in `src/hooks/useDB.ts` to handle jerseyName
- [X] T012 [US1] Update PlayerForm component in `src/components/PlayerForm.tsx` to add jerseyName input and remove position/notes
- [X] T013 [US1] Update player create and edit handlers in `src/page/PlayerList.tsx` to forward jerseyName to PlayerController

**Checkpoint**: At this point, User Story 1 is fully functional and independently testable (MVP complete)

---

## Phase 4: User Story 2 - Player Detail View with Played Matches List (Priority: P1)

**Goal**: Display a list of matches in which the player participated situated directly beneath the global player statistics card, showing rival name, match round, date, and a fallback empty state.

**Independent Test**: Can be tested independently by navigating to PlayerDetail for players with recorded match participation and players without, verifying the played matches list renders beneath global stats with opponent name, round, and empty state fallback message.

### Tests for User Story 2 ⚠️

- [X] T014 [P] [US2] Create component tests for PlayerDetail played matches list and empty state in `src/__tests__/components/PlayerDetail.test.tsx`

### Implementation for User Story 2

- [X] T015 [US2] Implement loadPlayerPlayedMatches query in `src/hooks/useDB.ts` joining playerStats and games tables
- [X] T016 [US2] Update PlayerDetail in `src/components/PlayerDetail.tsx` to fetch and render played matches list with opponent name, round, date, and empty state

**Checkpoint**: At this point, User Stories 1 AND 2 are fully functional and independently testable

---

## Phase 5: User Story 3 - Direct Navigation to Match Detail View (Priority: P2)

**Goal**: Provide an interactive action button on each played match card in PlayerDetail that opens MatchDetailView directly and returns smoothly without lost player state.

**Independent Test**: Can be tested independently by tapping the match action button on any played match card in PlayerDetail, verifying MatchDetailView renders for that game, and verifying back navigation restores PlayerDetail.

### Tests for User Story 3 ⚠️

- [X] T017 [P] [US3] Create component and drill-down navigation tests in `src/__tests__/components/PlayerDetail.navigation.test.tsx`

### Implementation for User Story 3

- [X] T018 [US3] Add match detail action button with testID to played match cards in `src/components/PlayerDetail.tsx`
- [X] T019 [US3] Implement selectedMatch state and conditional MatchDetailView rendering with onReturn in `src/components/PlayerDetail.tsx`

**Checkpoint**: All user stories are independently functional and integrated

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, legacy test fixtures update, and full workspace verification

- [X] T020 [P] Update legacy mock player data in existing test suites in `src/__tests__/page/PlayMatch.integration.test.tsx`
- [X] T021 [P] Update legacy mock player data in existing test suites in `src/__tests__/components/StartingFiveModal.test.tsx` and `src/__tests__/components/SubstitutionPanel.test.tsx`
- [X] T022 Run strict TypeScript check across the entire workspace via `tsc --noEmit`
- [X] T023 Run full regression test suite across the application via `npm test -- --watchAll=false`
- [X] T024 Validate all feature scenarios per `specs/013-update-player-details/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3 - P1)**: Depends on Foundational completion. Delivers MVP.
- **User Story 2 (Phase 4 - P1)**: Depends on Foundational completion. Can run in parallel with or after US1.
- **User Story 3 (Phase 5 - P2)**: Depends on User Story 2 played match cards.
- **Polish (Phase 6)**: Depends on completion of all user story implementations.

### User Story Dependencies

- **US1 (P1)**: Independent of US2 and US3.
- **US2 (P1)**: Depends on player ID and games data in database; independent of US1 form implementation.
- **US3 (P2)**: Augments US2 played match items with the navigation button and transitions to MatchDetailView.

### Within Each User Story

- TDD tests MUST be written and fail before writing implementation code.
- Store/hook queries before UI component rendering.
- Verify story completion and tests green before advancing to next phase.

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel.
- **Phase 2**: T005 and T006 can run in parallel after T003/T004.
- **Phase 3 (US1)**: Tests T008 and T009 can be written in parallel.
- **Phase 4 (US2)**: Test T014 can be written in parallel with US1 work once Phase 2 is complete.
- **Phase 6**: T020 and T021 can run in parallel.

---

## Parallel Execution Examples

### User Story 1
```bash
# Tests (write in parallel, verify failure):
Task: T008 [P] [US1] Create unit tests in src/__tests__/store/PlayerStore.test.ts
Task: T009 [P] [US1] Create component tests in src/__tests__/components/PlayerForm.test.tsx

# Implementation:
Task: T010 [US1] Update PlayerStore CRUD operations in src/store/PlayerStore.ts
Task: T011 [US1] Update PlayerController in src/hooks/useDB.ts
Task: T012 [US1] Update PlayerForm in src/components/PlayerForm.tsx
Task: T013 [US1] Update PlayerList in src/page/PlayerList.tsx
```

### User Story 2
```bash
# Test:
Task: T014 [P] [US2] Create component tests in src/__tests__/components/PlayerDetail.test.tsx

# Implementation:
Task: T015 [US2] Implement loadPlayerPlayedMatches query in src/hooks/useDB.ts
Task: T016 [US2] Update PlayerDetail played matches list in src/components/PlayerDetail.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`src/types/database.ts`, `src/types/mockData.ts`)
2. Complete Phase 2: Foundational (`schema.ts`, `db/index.ts`, mock data)
3. Complete Phase 3: User Story 1 (PlayerStore, PlayerForm, PlayerList)
4. **STOP and VALIDATE**: Test User Story 1 independently (`npm test -- src/__tests__/components/PlayerForm.test.tsx`)
5. Roster registration MVP is ready and deployable.

### Incremental Delivery

1. Setup + Foundational -> Core database & schema ready
2. Add US1 -> Roster creation and editing with optional `jerseyName` works
3. Add US2 -> PlayerDetail displays played matches list with opponent & round
4. Add US3 -> Direct drill-down to MatchDetailView from played matches list
5. Polish -> Test suite updates and regression verification
