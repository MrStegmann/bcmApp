# Tasks: Navigation and Header Refactor

**Input**: Design documents from `/specs/004-nav-and-header-refactor/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: TDD First approach (Jest tests written/updated for store and component behaviors).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to ([US1], [US2], [US3])
- Includes exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and initial store declarations

- [x] T001 Verify project TypeScript compilation and Jest runner baseline via `npx tsc --noEmit` and `npx jest`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state management extensions in `MenuStore.ts` required before UI components consume header action states

- [x] T002 Update `MenuStoreState` interface and initial state in `src/store/MenuStore.ts` to include `headerAction` and `setHeaderAction`
- [x] T003 [P] Add unit tests in `src/__tests__/store/MenuStore.test.ts` for `headerAction` state transitions and clearing logic

**Checkpoint**: Foundational store state ready - user story implementation can begin

---

## Phase 3: User Story 1 - Streamlined Bottom Navbar with Home Button (Priority: P1) 🎯 MVP

**Goal**: Remove Fees and Calendar links/options from bottom menu and add `Home` button that returns to `MAIN` team overview panel.

**Independent Test**: Render `ClubProfile` and `BottomNavBar`, verify 5 bottom items (`Plantilla`, `Partidos`, `Entrenamientos`, `Home`, `Volver`), verify tapping `Home` triggers return to `MAIN`, and verify 0 references to Fees or Calendar.

### Tests for User Story 1

- [x] T004 [P] [US1] Update `src/__tests__/components/ClubProfile.test.tsx` to assert 5 bottom items including `Home` and 0 Fees/Calendar items
- [x] T005 [P] [US1] Update `src/__tests__/components/BottomNavBar.test.tsx` to test `Home` button selection and rendering

### Implementation for User Story 1

- [x] T006 [US1] Update bottom menu configuration in `src/page/ClubProfile.tsx` to include `TopMenuEnums.MAIN` ("Home") and strip `CALENDAR` / Fees
- [x] T007 [US1] Update `src/components/BottomNavBar.tsx` to cleanly render `Home` tab icon and handle navigation back to main panel

**Checkpoint**: User Story 1 complete - bottom navbar cleanly updated with Home button and no Fees/Calendar links.

---

## Phase 4: User Story 2 - Header Action Buttons for Creation Flows (Priority: P2)

**Goal**: Display a functional "Add" button in the top header for `Players`, `Matches`, and `Sessions` (Entrenamientos) views.

**Independent Test**: Navigate to `Players`, `Matches`, or `Sessions` view, verify the header renders an "Add" button, and verify tapping it triggers the creation flow.

### Tests for User Story 2

- [x] T008 [P] [US2] Create unit test suite in `src/__tests__/components/Header.test.tsx` for `headerAction` rendering and press callbacks

### Implementation for User Story 2

- [x] T009 [US2] Update `src/components/Header.tsx` to subscribe to `headerAction` from `MenuStore` and render top-right action button
- [x] T010 [P] [US2] Update `src/page/PlayerList.tsx` to set `headerAction` for adding players on mount/focus and clear on unmount
- [x] T011 [P] [US2] Update `src/page/GameList.tsx` to set `headerAction` for adding matches on mount/focus and clear on unmount
- [x] T012 [P] [US2] Update `src/page/TrainingList.tsx` to set `headerAction` for adding training sessions on mount/focus and clear on unmount

**Checkpoint**: User Story 2 complete - header action buttons dynamically available on all target views.

---

## Phase 5: User Story 3 - Mobile Safe Area Margins (Priority: P3)

**Goal**: Ensure top margin on `Header` and bottom margin on `BottomNavBar` to prevent overlap with device status bar and system gesture bar.

**Independent Test**: Verify NativeWind container classes (`pt-3`/`mt-1`, `pb-4`/`mb-1`) on `Header` and `BottomNavBar` in tests.

### Implementation for User Story 3

- [x] T013 [P] [US3] Add top safe margin / padding classes to header container in `src/components/Header.tsx`
- [x] T014 [P] [US3] Add bottom safe margin / padding classes to navbar container in `src/components/BottomNavBar.tsx`

**Checkpoint**: User Story 3 complete - layout safe area margins applied cleanly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, TypeScript type checks, and automated test execution across full suite.

- [x] T015 Run full TypeScript validation via `npx tsc --noEmit`
- [x] T016 Run full Jest test suite via `npx jest` to ensure 100% test pass rate
- [x] T017 Validate manual quickstart guide scenarios in `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS User Story 2.
- **User Story 1 (Phase 3)**: Can proceed independently or in parallel with Phase 2.
- **User Story 2 (Phase 4)**: Depends on Foundational Phase 2 (`headerAction` in `MenuStore`).
- **User Story 3 (Phase 5)**: Can proceed in parallel with US1 and US2.
- **Polish (Phase 6)**: Depends on completion of US1, US2, and US3.

---

## Parallel Opportunities

- T004, T005, T008 can be developed in parallel (different test files).
- T010, T011, T012 can be implemented in parallel (different page components).
- T013 and T014 can be implemented in parallel (`Header.tsx` vs `BottomNavBar.tsx`).

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup & Foundational tasks (T001 - T003).
2. Complete User Story 1 (T004 - T007).
3. Verify bottom navbar has Home button and no Fees/Calendar.

### Incremental Delivery

1. Deliver MVP (US1).
2. Add Header Action Buttons (US2: T008 - T012).
3. Apply Safe Area Spacing (US3: T013 - T014).
4. Run final verification (T015 - T017).
