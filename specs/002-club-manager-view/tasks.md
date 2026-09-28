# Tasks: Refactor Club Manager View Page

**Input**: Design documents from `/specs/002-club-manager-view/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contracts.ts](./contracts/ui-contracts.ts), [quickstart.md](./quickstart.md)

**Tests**: Test tasks included per Constitution Principle I (TDD First with Jest).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- File paths are explicitly specified in task descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Infrastructure verification and contract setup

- [X] T001 Verify feature task configuration in `specs/002-club-manager-view/tasks.md`
- [X] T002 [P] Verify TypeScript UI contract definitions in `specs/002-club-manager-view/contracts/ui-contracts.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schemas and stores that MUST be verified before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Verify Drizzle relational schema for `teams` entity in `src/db/schema.ts`
- [X] T004 [P] Verify `ClubStore` state interface and CRUD methods in `src/store/ClubStore.ts`
- [X] T005 [P] Verify `MenuStore` menu actions in `src/store/MenuStore.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Team Selection & Dashboard Entry (Priority: P1) 🎯 MVP

**Goal**: Display created team cards in `ClubManage.tsx`, enable team selection to set `ClubStore.currentTeam` and enter team dashboard, and render clean empty state when no teams exist.

**Independent Test**: Execute Jest test asserting team list rendering, team selection, and empty state prompt.

### Tests for User Story 1 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Write unit test asserting team list render, team selection, and empty state rendering in `src/__tests__/components/ClubManage.test.tsx`

### Implementation for User Story 1

- [X] T007 [P] [US1] Refactor `ClubList.tsx` to use NativeWind `className` styling and typed props in `src/components/ClubList.tsx`
- [X] T008 [US1] Refactor `ClubManage.tsx` main view layout and team selection navigation flow in `src/page/ClubManage.tsx`

**Checkpoint**: At this point, User Story 1 (Team Selection & Entry MVP) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Team Creation & Editing (Priority: P2)

**Goal**: Support adding new teams and updating existing team name/category via `ClubForm.tsx` with inline input validation.

**Independent Test**: Execute Jest unit test for team creation, edit form prefill, and empty team name validation error.

### Tests for User Story 2 (TDD First) ⚠️

- [X] T009 [P] [US2] Write unit test asserting team form submission, update prefill, and inline validation in `src/__tests__/components/ClubManage.test.tsx`

### Implementation for User Story 2

- [X] T010 [P] [US2] Refactor `ClubForm.tsx` to handle create and edit modes with NativeWind input styling in `src/components/ClubForm.tsx`
- [X] T011 [US2] Integrate `ClubForm` submission handler with `ClubStore.createTeam` and `ClubStore.updateTeam` in `src/page/ClubManage.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 work independently.

---

## Phase 5: User Story 3 - Team Deletion & Confirmation (Priority: P3)

**Goal**: Provide team deletion trigger on team cards with `DeleteModal.tsx` confirmation, cascading SQLite removal, and instant UI list updates.

**Independent Test**: Execute Jest unit test for delete modal prompt and team deletion confirmation.

### Tests for User Story 3 (TDD First) ⚠️

- [X] T012 [P] [US3] Write unit test asserting team deletion confirmation and modal toggle in `src/__tests__/components/ClubManage.test.tsx`

### Implementation for User Story 3

- [X] T013 [P] [US3] Refactor `DeleteModal.tsx` to support team deletion messaging in `src/framework/DeleteModal.tsx`
- [X] T014 [US3] Integrate team deletion trigger and modal handlers in `src/page/ClubManage.tsx`

**Checkpoint**: All user stories are now fully functional and type-safe.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, type checks, and test suite validation

- [X] T015 [P] Validate TypeScript compilation with zero errors using `npx tsc --noEmit`
- [X] T016 Execute Jest test suite using `npx jest` to confirm 100% test pass rate
- [X] T017 Execute quickstart validation scenarios documented in `specs/002-club-manager-view/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1). BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2).
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2). Integrates with US1 components.
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2). Integrates with US1 list cards.
- **Polish (Phase 6)**: Depends on all user stories completing.

### Parallel Opportunities

- **Phase 1**: T001 and T002 run in parallel.
- **Phase 2**: T003, T004, and T005 run in parallel.
- **Phase 3 (US1)**: T006 test and T007 `ClubList.tsx` refactor run in parallel.
- **Phase 4 (US2)**: T009 test and T010 `ClubForm.tsx` refactor run in parallel.
- **Phase 5 (US3)**: T012 test and T013 `DeleteModal.tsx` refactor run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001 - T002)
2. Complete Phase 2: Foundational (T003 - T005)
3. Complete Phase 3: User Story 1 (T006 - T008)
4. **STOP and VALIDATE**: Test team list rendering & selection independently.

### Incremental Delivery

1. Deliver US1 → Team listing & active selection operational (MVP!).
2. Deliver US2 → Team creation & editing form operational.
3. Deliver US3 → Team deletion with safety modal operational.
4. Final Polish → 100% Jest tests & `tsc --noEmit` clean compilation.
