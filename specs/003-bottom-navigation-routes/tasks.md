# Tasks: Bottom Menu Navigation & Routing Performance Improvement

**Input**: Design documents from `/specs/003-bottom-navigation-routes/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/navigation-contracts.ts](./contracts/navigation-contracts.ts), [quickstart.md](./quickstart.md)

**Tests**: Test tasks included per Constitution Principle I (TDD First with Jest).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- File paths are explicitly specified in task descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verification of navigation contracts and baseline interfaces

- [X] T001 Verify bottom navigation contracts in `specs/003-bottom-navigation-routes/contracts/navigation-contracts.ts`
- [X] T002 [P] Verify top menu enums and navigation types in `src/types/enums.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state stores and header location banner that MUST be ready before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Enhance `MenuStore` state with `headerTitle`, `activeTab`, and `bottomMenuItems` in `src/store/MenuStore.ts`
- [X] T004 [P] Refactor `Header.tsx` to serve as a top location indicator banner in `src/components/Header.tsx`
- [X] T005 [P] Write unit tests for `MenuStore` state and `Header` component in `src/__tests__/store/MenuStore.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Bottom Menu Bar Navigation & Current View Indicator (Priority: P1) 🎯 MVP

**Goal**: Implement `BottomNavBar.tsx` and integrate with `ClubManage.tsx` and `ClubProfile.tsx` for thumb-friendly tab switching and top header title updates.

**Independent Test**: Execute Jest unit test asserting `BottomNavBar` rendering, tab clicks, `MenuStore` tab transitions, and top header title rendering.

### Tests for User Story 1 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Write unit tests asserting `BottomNavBar` rendering, active tab highlighting, and click handlers in `src/__tests__/components/BottomNavBar.test.tsx`

### Implementation for User Story 1

- [X] T007 [P] [US1] Create `BottomNavBar.tsx` component with NativeWind styling and safe area handling in `src/components/BottomNavBar.tsx`
- [X] T008 [US1] Integrate `BottomNavBar` and `Header` title state in `src/page/ClubManage.tsx`
- [X] T009 [US1] Integrate `BottomNavBar` and tab state synchronization in `src/page/ClubProfile.tsx`

**Checkpoint**: At this point, User Story 1 (Bottom Navigation MVP) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Removal of Team Settings View & Streamlined Team Layout (Priority: P2)

**Goal**: Remove `EDIT_TEAM` link and `ClubForm` settings view branch from team layout navigation.

**Independent Test**: Execute Jest unit test asserting absence of settings link inside `ClubProfile` tab list and verifying clean tab options.

### Tests for User Story 2 (TDD First) ⚠️

- [X] T010 [P] [US2] Write unit test asserting removal of settings link and view from `ClubProfile` tab list in `src/__tests__/components/ClubProfile.test.tsx`

### Implementation for User Story 2

- [X] T011 [US2] Remove `EDIT_TEAM` tab item and `ClubForm` settings view branch from `src/page/ClubProfile.tsx`

**Checkpoint**: User Stories 1 AND 2 work independently.

---

## Phase 5: User Story 3 - High-Performance View Routing & Transition State (Priority: P3)

**Goal**: Optimize view routing performance to guarantee tab transitions execute in <100ms without flicker.

**Independent Test**: Execute Jest performance unit test validating tab switching state update speed.

### Tests for User Story 3 (TDD First) ⚠️

- [X] T012 [P] [US3] Write unit test asserting tab state transition performance in `src/__tests__/store/MenuStore.test.ts`

### Implementation for User Story 3

- [X] T013 [US3] Optimize view rendering and tab state selector memoization in `src/page/ClubProfile.tsx`

**Checkpoint**: All user stories are now fully functional and type-safe.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, type checks, and test suite validation

- [X] T014 [P] Validate TypeScript compilation with zero errors using `npx tsc --noEmit`
- [X] T015 Execute full Jest test suite using `npx jest` to confirm 100% test pass rate
- [X] T016 Execute quickstart validation scenarios documented in `specs/003-bottom-navigation-routes/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1). BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2).
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2). Integrates with US1 components.
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2). Integrates with US1 tab switching.
- **Polish (Phase 6)**: Depends on all user stories completing.

### Parallel Opportunities

- **Phase 1**: T001 and T002 run in parallel.
- **Phase 2**: T004 and T005 run in parallel.
- **Phase 3 (US1)**: T006 test and T007 `BottomNavBar.tsx` component creation run in parallel.
- **Phase 4 (US2)**: T010 test runs in parallel.
- **Phase 5 (US3)**: T012 test runs in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001 - T002)
2. Complete Phase 2: Foundational (T003 - T005)
3. Complete Phase 3: User Story 1 (T006 - T009)
4. **STOP and VALIDATE**: Test bottom navigation bar & header title updates independently.

### Incremental Delivery

1. Deliver US1 → Bottom navigation bar & header title active (MVP!).
2. Deliver US2 → Team settings view removed from layout.
3. Deliver US3 → Routing performance optimized (<100ms transitions).
4. Final Polish → 100% Jest tests & `tsc --noEmit` clean compilation.
