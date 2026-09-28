# Tasks: Database & Contracts Refactor

**Input**: Design documents from `/specs/001-db-contracts-refactor/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Test tasks included in accordance with Constitution Principle I (TDD First).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- File paths are explicitly specified in task descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and folder structure setup

- [x] T001 Create project folder structure for database, types, stores, and hooks in `src/db/`, `src/types/`, `src/store/`, `src/hooks/`
- [x] T002 [P] Configure TypeScript compiler options in `tsconfig.json`
- [x] T003 [P] Verify Drizzle ORM and Expo SQLite dependencies in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schema definitions and type contracts that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Setup SQLite connection initialization file using `expo-sqlite` and `drizzle-orm` in `src/db/index.ts`
- [x] T005 [P] Define Drizzle relational schemas for all 7 entities (`teams`, `players`, `games`, `player_stats`, `trainings`, `training_players`, `fees`) in `src/db/schema.ts`
- [x] T006 [P] Define TypeScript entity and DTO type contracts in `src/types/database.ts`
- [x] T007 [P] Define TopMenuEnums and UI navigation type contracts in `src/types/enums.ts`
- [x] T008 [P] Define Zustand state store interfaces in `src/types/store.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Type-Safe Relational Persistence & Connection (Priority: P1) 🎯 MVP

**Goal**: Initialize SQLite database, execute seed data, enforce foreign key cascade rules, and ensure CRUD persistence operations pass unit tests.

**Independent Test**: Execute SQLite connection test and relational cascading delete test using Jest.

### Tests for User Story 1 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009 [P] [US1] Write unit test for Drizzle database connection and schema instantiation in `src/__tests__/db/connection.test.ts`
- [x] T010 [P] [US1] Write unit test for relational foreign key cascading deletes (Teams -> Players, Games, Trainings, Fees) in `src/__tests__/db/cascade.test.ts`

### Implementation for User Story 1

- [x] T011 [US1] Implement SQLite WAL mode and foreign key pragmas in `src/db/index.ts`
- [x] T012 [P] [US1] Implement Drizzle schema relations mapping in `src/db/schema.ts`
- [x] T013 [P] [US1] Implement seed data generator for Teams, Roster, Games, and Practice sessions in `src/db/seed.ts`

**Checkpoint**: At this point, User Story 1 database persistence is fully functional and testable independently.

---

## Phase 4: User Story 2 - Complete JavaScript to TypeScript Contract Migration (Priority: P2)

**Goal**: Migrate all controllers and Zustand stores from JS to TS, eliminating missing file imports (`DBProvider`, `useDB`, `ClubStore`, `MenuStore`).

**Independent Test**: Run Zustand store unit tests asserting state updates and controller actions.

### Tests for User Story 2 (TDD First) ⚠️

- [x] T014 [P] [US2] Write unit test for `ClubStore` state transitions and team selection in `src/__tests__/store/ClubStore.test.ts`
- [x] T015 [P] [US2] Write unit test for `PlayerStore` roster CRUD actions in `src/__tests__/store/PlayerStore.test.ts`
- [x] T016 [P] [US2] Write unit test for `GameStore` box score statistics valuation logic in `src/__tests__/store/GameStore.test.ts`

### Implementation for User Story 2

- [x] T017 [P] [US2] Implement TypeScript `ClubStore` in `src/store/ClubStore.ts`
- [x] T018 [P] [US2] Implement TypeScript `PlayerStore` in `src/store/PlayerStore.ts`
- [x] T019 [P] [US2] Implement TypeScript `GameStore` in `src/store/GameStore.ts`
- [x] T020 [P] [US2] Implement TypeScript `TrainingStore` in `src/store/TrainingStore.ts`
- [x] T021 [P] [US2] Implement TypeScript `FeesStore` in `src/store/FeesStore.ts`
- [x] T022 [P] [US2] Implement TypeScript `MenuStore` in `src/store/MenuStore.ts`
- [x] T023 [US2] Implement TypeScript unified database hook `useDB` in `src/hooks/useDB.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 work independently.

---

## Phase 5: User Story 3 - Robust Component Data Flow & Zero Fetch Errors (Priority: P3)

**Goal**: Migrate UI screens and components to TypeScript, updating imports and ensuring zero undefined property crashes.

**Independent Test**: Run component render tests and verify zero TypeScript compilation errors with `npx tsc --noEmit`.

### Tests for User Story 3 (TDD First) ⚠️

- [x] T024 [P] [US3] Write unit test asserting empty state rendering for `PlayerList` and `GameList` components in `src/__tests__/components/EmptyStates.test.tsx`

### Implementation for User Story 3

- [x] T025 [US3] Refactor `App.js` to `App.tsx` removing broken `DBProvider` wrapper and initializing SQLite connection in `App.tsx`
- [x] T026 [P] [US3] Refactor page views (`ClubManage.tsx`, `ClubProfile.tsx`, `PlayerList.tsx`, `GameList.tsx`, `TrainingList.tsx`, `Calendar.tsx`) to TypeScript in `src/page/`
- [x] T027 [P] [US3] Refactor player components (`PlayerCards.tsx`, `PlayerDetail.tsx`, `PlayerForm.tsx`) to TypeScript in `src/components/`
- [x] T028 [P] [US3] Refactor game components (`GameCards.tsx`, `GameDetail.tsx`, `GameForm.tsx`, `GamesResults.tsx`) to TypeScript in `src/components/`
- [x] T029 [P] [US3] Refactor training components (`TraningCards.tsx`, `TrainingDetail.tsx`, `TrainingForm.tsx`, `TrainingPlayer.tsx`) to TypeScript in `src/components/`
- [x] T030 [P] [US3] Refactor framework UI components (`Button.tsx`, `Input.tsx`, `DeleteModal.tsx`, `ModalInfo.tsx`) to TypeScript in `src/framework/`

**Checkpoint**: All user stories are now fully functional and type-safe.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, type checks, and test suite validation

- [x] T031 [P] Validate TypeScript compilation with zero errors using `npx tsc --noEmit`
- [x] T032 Execute Jest test suite using `npm test` to confirm 100% test pass rate
- [x] T033 Execute quickstart validation scenarios documented in `specs/001-db-contracts-refactor/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1). BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2).
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2). Integrates with US1 schemas.
- **User Story 3 (Phase 5)**: Depends on US1 and US2 stores/hooks.
- **Polish (Phase 6)**: Depends on all user stories completing.

### Parallel Opportunities

- **Phase 1**: T002 and T003 run in parallel.
- **Phase 2**: T005, T006, T007, T008 run in parallel.
- **Phase 3 (US1)**: T009 and T010 tests run in parallel; T012 and T013 run in parallel.
- **Phase 4 (US2)**: T014, T015, T016 tests run in parallel; T017 through T022 stores run in parallel.
- **Phase 5 (US3)**: T026, T027, T028, T029, T030 component refactors run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001 - T003)
2. Complete Phase 2: Foundational (T004 - T008)
3. Complete Phase 3: User Story 1 (T009 - T013)
4. **STOP and VALIDATE**: Test database connection & schema cascades independently.

### Incremental Delivery

1. Deliver US1 → Database schema & SQLite persistence operational.
2. Deliver US2 → Zustand stores & TS contracts operational.
3. Deliver US3 → UI components & screens fully connected with zero fetch errors.
4. Final Polish → 100% Jest tests & `tsc --noEmit` clean compilation.
