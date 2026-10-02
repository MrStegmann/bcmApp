# Tasks: Navbar Icons, Go Back Button & Residual Cleanup

**Input**: Design documents from `/specs/005-navbar-icons-and-back-button/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/navigation-header.contract.md](./contracts/navigation-header.contract.md), [quickstart.md](./quickstart.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`, `US4`, `US5`)
- Exact file paths are specified in descriptions.

---

## Phase 1: Setup & Residual Cleanup (US5)

**Purpose**: Prune all deprecated Calendar and Fees files, database schemas, seeders, and controllers. Establish baseline testing integrity.

- [x] T001 Run baseline TypeScript checks (`npx tsc --noEmit`) and Jest suite (`npx jest`)
- [x] T002 [P] [US5] Delete deprecated `src/page/Calendar.tsx` and `src/store/FeesStore.ts`
- [x] T003 [P] [US5] Remove `fees` table and relations from `src/db/schema.ts`
- [x] T004 [P] [US5] Remove `seedFees` seeder from `src/db/seed.ts` and `FeesController` from `src/hooks/useDB.ts`
- [x] T005 [P] [US5] Remove `Fee` types and references from `src/types/database.ts` and `src/types/store.ts`
- [x] T006 [P] [US5] Clean residual fees and calendar references from `src/components/PlayerDetail.tsx` and `src/page/ClubProfile.tsx`
- [x] T007 [US5] Update database tests in `src/__tests__/db/connection.test.ts` and `src/__tests__/db/cascade.test.ts` to assert cleaned schema

**Checkpoint**: Deprecated Calendar & Fees code fully purged, database tests passing with 0 errors.

---

## Phase 2: Foundational (MenuStore State)

**Purpose**: Core state management for header back navigation prerequisite for form and detail views.

- [x] T008 [P] Write unit tests for `headerBackAction` and `setHeaderBackAction` in `src/__tests__/store/MenuStore.test.ts`
- [x] T009 Implement `HeaderBackAction` interface and `headerBackAction` state/setter in `src/store/MenuStore.ts`

**Checkpoint**: MenuStore foundation ready with verified `headerBackAction` state transitions.

---

## Phase 3: User Story 1 - Icon-Only Navbar with Home as First Item (Priority: P1) 🎯 MVP

**Goal**: Deliver a clean, text-free bottom navigation bar with "Home" (Inicio) positioned as the first anchor item on the far left.

**Independent Test**: Mount the team profile screen and verify that navbar items display only icons without text labels, with Home at index 0 on the far left.

### Tests for User Story 1

- [x] T010 [P] [US1] Write unit tests for icon-only rendering and Home at index 0 in `src/__tests__/components/BottomNavBar.test.tsx` and `src/__tests__/components/ClubProfile.test.tsx`

### Implementation for User Story 1

- [x] T011 [US1] Update `src/components/BottomNavBar.tsx` to remove `<Text>` label rendering and keep exclusively icons
- [x] T012 [US1] Update `src/page/ClubProfile.tsx` to position `MAIN` (Home) as the first item (index 0) in the `bottomMenuItems` array

**Checkpoint**: User Story 1 complete - bottom navbar displays only icons with Home on the far left.

---

## Phase 4: User Story 4 - Straight-Edged Header Visual Styling (Priority: P4)

**Goal**: Update the Header component styling to have straight horizontal bottom corners (removing `rounded-b-3xl`).

**Independent Test**: Inspect the Header component across views to verify square/straight bottom borders without rounded curvature.

### Tests for User Story 4

- [x] T013 [P] [US4] Write unit tests asserting straight bottom corners on Header container in `src/__tests__/components/Header.test.tsx`

### Implementation for User Story 4

- [x] T014 [US4] Update `src/components/Header.tsx` to remove `rounded-b-3xl` and preserve straight border layout with safe area insets

**Checkpoint**: User Story 4 complete - header features a sleek straight horizontal bottom edge.

---

## Phase 5: User Story 2 & 3 - Header "Go Back" Navigation for Forms & Detail Views (Priority: P2 & P3)

**Goal**: Enable left-aligned "Go Back" button in the Header to cancel/return from all create/edit forms and detail views across Players, Games, and Trainings.

**Independent Test**: Open any form or detail view in Players, Games, or Trainings, tap the header's left "Go Back" button, and confirm return to the list view.

### Tests for User Story 2 & 3

- [x] T015 [P] [US2] Write unit tests in `src/__tests__/components/Header.test.tsx` for left "Go Back" button rendering and onPress execution

### Implementation for User Story 2 & 3

- [x] T016 [US2] Update `src/components/Header.tsx` to render a left-aligned `<TouchableOpacity>` with chevron-left icon when `headerBackAction` is set, or `<View className="w-10" />` when null
- [x] T017 [P] [US2] Connect `setHeaderBackAction` in `src/page/PlayerList.tsx` on create/edit form open and reset on close/unmount
- [x] T018 [P] [US2] Connect `setHeaderBackAction` in `src/page/GameList.tsx` on create/edit form open and reset on close/unmount
- [x] T019 [P] [US2] Connect `setHeaderBackAction` in `src/page/TrainingList.tsx` on create/edit form open and reset on close/unmount
- [x] T020 [P] [US3] Connect `setHeaderBackAction` in `src/page/PlayerList.tsx` on player detail open and reset on close/unmount
- [x] T021 [P] [US3] Connect `setHeaderBackAction` in `src/page/GameList.tsx` on game detail open and reset on close/unmount
- [x] T022 [P] [US3] Connect `setHeaderBackAction` in `src/page/TrainingList.tsx` on training detail open and reset on close/unmount

**Checkpoint**: User Stories 2 & 3 complete - Header left Go Back button seamlessly returns from all forms and detail views.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, TypeScript type checks, and automated test execution across full suite.

- [x] T023 Run full TypeScript validation via `npx tsc --noEmit`
- [x] T024 Run full Jest test suite via `npx jest` to ensure 100% test pass rate across all suites
- [x] T025 Validate manual quickstart guide scenarios in `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Residual Cleanup (Phase 1)**: No dependencies - cleans baseline technical debt.
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS User Stories 2 and 3.
- **User Story 1 (Phase 3)**: Can proceed independently after Phase 1.
- **User Story 4 (Phase 4)**: Can proceed in parallel with US1.
- **User Story 2 & 3 (Phase 5)**: Depends on Foundational Phase 2 (`headerBackAction` in `MenuStore`).
- **Polish (Phase 6)**: Depends on completion of all user story phases.

---

## Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005, T006 can execute in parallel.
- **Phase 3 & 4**: US1 (T010-T012) and US4 (T013-T014) can execute in parallel.
- **Phase 5**: Sub-view integration tasks (T017, T018, T019, T020, T021, T022) can execute in parallel across different page files once T016 is complete.

---

## Implementation Strategy

### MVP First (User Story 1 & Phase 1)
1. Complete Phase 1 (Residual Cleanup) to ensure clean schema and baseline stability.
2. Complete Phase 3 (User Story 1) to deliver icon-only navbar with Home as first item.
3. Validate User Story 1 independently.

### Incremental Delivery
1. Add Phase 2 & 4 (MenuStore back action + Straight header styling).
2. Add Phase 5 (US2 & US3 - Header back navigation across all forms and details).
3. Execute Phase 6 (Full validation suite & quickstart verification).
