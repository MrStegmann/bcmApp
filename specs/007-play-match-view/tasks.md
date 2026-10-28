# Tasks: Play Match View

**Input**: Design documents from `specs/007-play-match-view/` (`plan.md`, `spec.md`, `data-model.md`, `contracts/play-match-contracts.ts`, `research.md`, `quickstart.md`)

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included per **Principle I (Test-Driven Development First - NON-NEGOTIABLE)** of the project constitution (`.specify/memory/constitution.md`). Tests MUST be written and fail before implementation code.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5, US6, US7)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, types synchronization, and core formatting utilities

- [X] T001 [P] Synchronize type definitions and contracts in `src/features/play-match/types/index.ts` from `specs/007-play-match-view/contracts/play-match-contracts.ts` (including `ResponsiveCourtLayout`, `ManualTimeModalProps.onResetExtraTimeCrono`, `TimeScoreFoulsControllerProps` without overtime reset, and `ThrowStatBreakdown`)
- [X] T002 [P] Verify and update player identification unit tests in `src/features/play-match/__tests__/utils/formatPlayerIdentifier.test.ts` asserting jersey number exclusivity, fallback name abbreviation, and edge cases
- [X] T003 [P] Implement player identifier formatting pure utility in `src/features/play-match/utils/formatPlayerIdentifier.ts` handling jersey exclusivity, name trimming, and graceful fallback
- [X] T004 [P] Implement throw statistics formatting pure utility in `src/features/play-match/utils/formatThrowStat.ts` supporting `s/a (#%)` formatting and `0/0 (0%)` zero-attempt fallback

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and state machine foundation that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Verify Drizzle SQLite database schema in `src/db/schema.ts` for games and player stats tables
- [X] T006 [P] Setup store test suite for core state initialization, period structure, and tickTimer in `src/features/play-match/__tests__/store/usePlayMatchStore.test.ts`
- [X] T007 Implement centralized state machine foundation, initial period data, and timer tick updates in `src/features/play-match/store/usePlayMatchStore.ts`
- [X] T008 [P] Create roster initialization and player mapper helper functions in `src/features/play-match/utils/roster.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Game Clock, Period Control & Isolated Period Scoring (Priority: P1) 🎯 MVP

**Goal**: Dedicated controller for game periods (`q1`, `q2`, `q3`, `q4`, `extra`), chronometer (1-tap start/stop, 3-second hold manual time modal), isolated period scores/fouls, dynamic total score computation, and extra-time reset relocated inside `ManualTimeModal` (+1 timeout, scores/fouls preserved, standalone reset button completely removed from main screen).

**Independent Test**: Can be tested independently by starting/stopping timer via 1-tap, setting timer via 3-second hold, advancing period via 1-tap, picking arbitrary period via 3-second hold modal, logging period points/fouls, verifying the main screen layout remains free of standalone reset buttons during extra time, and resetting extra time to 05:00 from within `ManualTimeModal` while verifying scores and team fouls are preserved with +1 timeout awarded.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US1] Unit test period transitions, crono actions, manual time adjustment, and extra time reset in `src/features/play-match/__tests__/store/usePlayMatchStore.test.ts`
- [X] T010 [P] [US1] Component test for `TimeScoreFoulsController` (1-tap next period, 3-sec hold modal, crono toggle, 3-sec hold manual time modal, verifying complete absence of standalone extra-time reset button) in `src/features/play-match/__tests__/components/TimeScoreFoulsController.test.tsx`
- [X] T011 [P] [US1] Component test for period selection modal in `src/features/play-match/__tests__/components/PeriodSelectModal.test.tsx`
- [X] T012 [P] [US1] Component test for manual time entry modal asserting overtime reset option presence and trigger during extra period in `src/features/play-match/__tests__/components/ManualTimeModal.test.tsx`

### Implementation for User Story 1

- [X] T013 [US1] Implement period transitions, 3-second hold selection, crono tick/pause, and extra time reset in `src/features/play-match/store/usePlayMatchStore.ts`
- [X] T014 [P] [US1] Implement period selection modal dialog in `src/features/play-match/components/PeriodSelectModal.tsx`
- [X] T015 [P] [US1] Implement manual time configuration modal dialog with overtime reset action when in extra period in `src/features/play-match/components/ManualTimeModal.tsx`
- [X] T016 [US1] Implement Component 1 period controller, crono widget, and isolated period score/foul indicators removing standalone extra-time reset button in `src/features/play-match/components/TimeScoreFoulsController.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP ready!)

---

## Phase 4: User Story 2 - Court Canvas, Stint Tracking & Player Statistics Logging/Subtraction (Priority: P1)

**Goal**: Half-court canvas with 5 active positions, stint tracking (continuous on-court minutes starting at 0 and resetting upon re-entering from bench), exclusive jersey number display with name fallback, 1-tap stats modal with assist selection ("non assistant"), 2-second hold stat subtraction modal with automatic cascading assist deduction on 2pt/3pt baskets, and foul auto-pause.

**Independent Test**: Tap court player circle to record stats/assists/fouls, verify crono pauses on personal foul, hold court player for 2s to open subtraction modal, verify cascading assist deduction when decrementing a 2pt/3pt basket, verify stint minutes increment while on court and reset to 0 upon return from bench, and verify bench players cannot trigger 2s hold subtraction.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T017 [P] [US2] Unit test stint accumulation, stint reset on court entry, score event tracking, stat subtraction, cascading assist reversal, and foul auto-pause in `src/features/play-match/__tests__/store/usePlayMatchStore.test.ts`
- [X] T018 [P] [US2] Component test for `HalfCourtCanvas` (exclusive jersey number, stint display, 2s hold subtraction trigger, empty position tap) in `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx`
- [X] T019 [P] [US2] Component test for `PlayerStatsModal` (shot logging, assist prompt, non-assistant option, rebounds, personal fouls) in `src/features/play-match/__tests__/components/PlayerStatsModal.test.tsx`
- [X] T020 [P] [US2] Component test for `PlayerStatSubtractionModal` (stat decrement, cascading assist deduction, floor at 0) in `src/features/play-match/__tests__/components/PlayerStatSubtractionModal.test.tsx`
- [X] T021 [P] [US2] Component test for `QuickAssignPlayerModal` in `src/features/play-match/__tests__/components/QuickAssignPlayerModal.test.tsx`

### Implementation for User Story 2

- [X] T022 [US2] Implement stint tracking, `ScoreEventLink` history, `subtractPlayerStat` with cascading assist deduction, and foul auto-pause in `src/features/play-match/store/usePlayMatchStore.ts`
- [X] T023 [P] [US2] Implement player stat subtraction modal with cascading assist reversal in `src/features/play-match/components/PlayerStatSubtractionModal.tsx`
- [X] T024 [P] [US2] Update player stats modal with assist prompt ("non assistant" option) and foul logging in `src/features/play-match/components/PlayerStatsModal.tsx`
- [X] T025 [P] [US2] Implement quick assign player modal for empty court positions in `src/features/play-match/components/QuickAssignPlayerModal.tsx`
- [X] T026 [US2] Update half-court canvas with 5 position buttons, exclusive jersey number display, continuous stint minutes, and 2-second hold subtraction gesture in `src/features/play-match/components/HalfCourtCanvas.tsx`
- [X] T027 [US2] Update court canvas wrapper container in `src/features/play-match/components/TeamManagementCanvas.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Team Management, Bench, Unrestricted Swap Mode & Timeout Control (Priority: P2)

**Goal**: Horizontal bench scroll list with exclusive jersey number / name fallback, unrestricted Swap Mode accessible and executable at any time (running or paused clock) enforcing $N\text{ in} = N\text{ out}$, incoming players stint timer initialized to 0, timeout quota rules (2 for Q1-Q2, 3 for Q3-Q4, 1 for extra + resets).

**Independent Test**: Execute substitutions while clock is running, execute substitutions while clock is paused, verify incoming players reset stint minutes to 0, verify bench players display cumulative minutes, verify bench circles ignore 2s hold, and verify timeout quota controls.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T028 [P] [US3] Unit test unrestricted swap mode (running vs paused clock), stint reset to 0, and timeout quota calculations in `src/features/play-match/__tests__/store/usePlayMatchStore.test.ts`
- [X] T029 [P] [US3] Component test for `TeamManagementPanel` (unrestricted swap button, equal exchange validation, timeout buttons, bench circles) in `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx`
- [X] T030 [P] [US3] Component test for `StartingFiveModal` in `src/features/play-match/__tests__/components/StartingFiveModal.test.tsx`

### Implementation for User Story 3

- [X] T031 [US3] Implement unrestricted swap action, stint reset on substitution, and timeout quota management in `src/features/play-match/store/usePlayMatchStore.ts`
- [X] T032 [US3] Update team management panel to enable swap mode at any time (running or paused), render bench player circles with exclusive jersey number / name fallback, and provide timeout quota controls in `src/features/play-match/components/TeamManagementPanel.tsx`
- [X] T033 [P] [US3] Update starting five selection modal with 5-player quota validation and initial lineup assignment in `src/features/play-match/components/StartingFiveModal.tsx`

**Checkpoint**: User Stories 1, 2, and 3 are functional and integrated

---

## Phase 6: User Story 4 - Rival Control Panel (Full-Width, Period Score & Fouls) (Priority: P2)

**Goal**: Full-width (100% width) rival panel with controls for rival period score (+1, +2, +3, -1) and rival period team fouls (+1, -1, auto-pausing crono), completely omitting redundant rival total points counter.

**Independent Test**: Verify rival panel spans 100% container width, contains no duplicate total points counter element, updates active period rival scores (+1, +2, +3, -1), updates rival fouls (+1, -1), and halts running chronometer on rival foul increment.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T034 [P] [US4] Unit test rival period score adjustments and rival foul chronometer pause in `src/features/play-match/__tests__/store/usePlayMatchStore.test.ts`
- [X] T035 [P] [US4] Component test for `RivalPanelControl` (full-width layout, omission of rival total score element, score/foul handlers) in `src/features/play-match/__tests__/components/RivalPanelControl.test.tsx`

### Implementation for User Story 4

- [X] T036 [US4] Implement rival period score and foul mutations with automatic clock pause on +1 foul in `src/features/play-match/store/usePlayMatchStore.ts`
- [X] T037 [US4] Redesign rival control panel to occupy full width (100% width), remove duplicate rival total score element, and wire score/foul buttons in `src/features/play-match/components/RivalPanelControl.tsx`

**Checkpoint**: All user stories 1 through 4 are independently functional and integrated

---

## Phase 7: User Story 5 - Bench Player Statistics Information Modal (Priority: P2)

**Goal**: Dedicated, high-prominence read-only modal opened by tapping any bench player when Swap Mode is inactive, displaying total minutes and points at the top, shooting stats in `s/a (#%)` format (with `0/0 (0%)` when attempts = 0), complete statline (rebounds, assists, steals, turnovers, fouls, valuation), with dismissals via cross (`✕`) button and backdrop tap, and Swap Mode isolation.

**Independent Test**: Tap bench player when Swap Mode is inactive -> verify modal opens displaying header minutes/points prominence, verify 1pt/2pt/3pt formatted strictly as `s/a (#%)` with `0/0 (0%)` zero-attempt handling, verify full statline, verify tap cross button dismisses, verify tap backdrop overlay dismisses, verify tap inside container does not dismiss, and verify tapping bench player during Swap Mode toggles substitution selection and suppresses modal.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T038 [P] [US5] Component test for `BenchPlayerStatsModal` in `src/features/play-match/__tests__/components/BenchPlayerStatsModal.test.tsx` asserting header minutes/points prominence, `s/a (#%)` shooting statistics, complete statline, cross button dismissal, backdrop click-outside dismissal, inside touch non-dismissal, and visual layering
- [X] T039 [P] [US5] Component test for `TeamManagementPanel` bench player click interactions in `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx` asserting bench player tap opens stats modal when Swap Mode is inactive and toggles substitution selection when Swap Mode is active

### Implementation for User Story 5

- [X] T040 [P] [US5] Implement `BenchPlayerStatsModal` component in `src/features/play-match/components/BenchPlayerStatsModal.tsx` with header minutes/points prominence, `s/a (#%)` throw statistics, full statline, cross button, and backdrop overlay tap dismissal
- [X] T041 [US5] Update `TeamManagementPanel` in `src/features/play-match/components/TeamManagementPanel.tsx` to handle bench player clicks for modal display when Swap Mode is inactive while preserving substitution selection when Swap Mode is active
- [X] T042 [US5] Integrate `BenchPlayerStatsModal` state and handlers in `src/features/play-match/PlayMatch.tsx` and container in `src/page/PlayMatch.tsx`

**Checkpoint**: At this point, User Stories 1 through 5 are fully functional and testable independently

---

## Phase 8: User Story 6 - Responsive Viewport Adaptation & Compact Player Circle Scaling (Priority: P1)

**Goal**: Fluid scaling of the half-court canvas and surrounding layout based on available screen height/width, preventing canvas clipping or on-court players from collapsing behind the bench management panel on small mobile devices; scale down player circle representations across both court and bench to a compact scale (`w-11 h-11` or `w-12 h-12`), displaying exclusively the jersey number (or fallback `[First Initial]. [Last Name]`), divisor line, and minutes/points (`${stintMin}min / ${pts}pts` on court, `${min}min / ${pts}pts` on bench).

**Independent Test**: Can be tested on small mobile viewports (e.g., 360x640, 375x667) by rendering the Play Match view, verifying all 5 on-court positions and the horizontal bench list are visible simultaneously without vertical scrolling or overlap with control panels, and verifying player circles render at compact dimensions while preserving legible text.

### Tests for User Story 6

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T043 [P] [US6] Unit test dynamic court coordinate scaling across varying canvas dimensions in `src/features/play-match/__tests__/utils/courtArcPositions.test.ts`
- [X] T044 [P] [US6] Component test for `HalfCourtCanvas` in `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx` asserting responsive coordinate layout and scaled-down compact player circle dimensions (`w-11 h-11` or `w-12 h-12`)
- [X] T045 [P] [US6] Component test for `TeamManagementPanel` in `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx` asserting compact bench player circle dimensions (`w-11 h-11` or `w-12 h-12`), tight horizontal spacing, and legible text
- [X] T046 [P] [US6] Component test for `TeamManagementCanvas` in `src/features/play-match/__tests__/components/TeamManagementCanvas.test.tsx` asserting dynamic container layout bounds without fixed height overflow

### Implementation for User Story 6

- [X] T047 [P] [US6] Implement dynamic responsive court arc position calculation utility in `src/features/play-match/utils/courtArcPositions.ts` scaling coordinates proportionally to canvas width and height
- [X] T048 [US6] Update `HalfCourtCanvas` in `src/features/play-match/components/HalfCourtCanvas.tsx` to dynamically measure container dimensions via `onLayout`, position player slots via `courtArcPositions`, and render compact circles (`w-11 h-11` / `w-12 h-12`)
- [X] T049 [US6] Update `TeamManagementCanvas` in `src/features/play-match/components/TeamManagementCanvas.tsx` with responsive flex-1 layout container preventing vertical overflow
- [X] T050 [US6] Update `TeamManagementPanel` in `src/features/play-match/components/TeamManagementPanel.tsx` with compact bench circle dimensions (`w-11 h-11` / `w-12 h-12`) and tight item margins
- [X] T051 [US6] Update screen layout distribution in `src/features/play-match/PlayMatch.tsx` and `src/page/PlayMatch.tsx` ensuring court canvas and bench panel adapt fluidly without vertical occlusion

**Checkpoint**: At this point, User Story 6 provides responsive layout and compact circles across all mobile viewport sizes

---

## Phase 9: User Story 7 - Enlarged Score-Only Application Header (Priority: P2)

**Goal**: Application Header displaying exclusively the live total match score (`${teamTotalScore} - ${rivalTotalScore}`), completely omitting local and rival team names, rendered in enlarged high-contrast typography while keeping back and save action buttons accessible.

**Independent Test**: Load a live match, verify the App Header renders only the total score (e.g. `102 - 98` or `0 - 0`) in enlarged typography, verify team names are completely omitted from the header, and verify back/exit and save/finish actions remain functional and visible.

### Tests for User Story 7

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T052 [P] [US7] Component test for `Header` in `src/__tests__/components/Header.test.tsx` asserting enlarged score-only mode renders without local or rival team names
- [X] T053 [P] [US7] Integration test for Play Match header presentation in `src/features/play-match/__tests__/page/PlayMatch.test.tsx` asserting score-only configuration and live score updates

### Implementation for User Story 7

- [X] T054 [US7] Update `src/components/Header.tsx` to support score-only display mode with enlarged typography and omitted team names for match play
- [X] T055 [US7] Configure `PlayMatch.tsx` in `src/features/play-match/PlayMatch.tsx` to display live total score in score-only format in the App Header

**Checkpoint**: All 7 User Stories are independently functional and integrated

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end integration, barrel exports, regression validation, and documentation verification

- [X] T056 [P] Integration test suite asserting complete end-to-end match play workflow including responsive layout, compact circles, score-only header, and bench stats modal in `src/features/play-match/__tests__/page/PlayMatch.test.tsx`
- [X] T057 [P] Update public barrel exports and module boundaries in `src/features/play-match/index.ts` to export all components, utilities, and types
- [X] T058 Validate all quickstart.md validation scenarios (Scenarios 1 through 13) and run full test suite with TypeScript type check (`npm test`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Period & crono controls, manual time modal with overtime reset action (blocks match clock loop)
  - User Story 2 (P1): Court canvas, stint tracking, stats & subtraction
  - User Story 3 (P2): Team management panel, unrestricted swap & timeouts
  - User Story 4 (P2): Rival control panel (100% width, no total score)
  - User Story 5 (P2): Bench player statistics modal (depends on bench items from US3 and formatThrowStat utility from US5/Setup)
  - User Story 6 (P1): Responsive viewport adaptation & compact player circle scaling (depends on court canvas from US2 and bench from US3)
  - User Story 7 (P2): Enlarged score-only application header (depends on store scores from US1)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with crono loop from US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Integrates with roster from US2 but independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent rival score/foul adjustments
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Operates on bench players from US3 roster state
- **User Story 6 (P1)**: Can start after US2 & US3 - Refines layout geometry and circle dimensions across court and bench
- **User Story 7 (P2)**: Can start after Foundational (Phase 2) - Operates on total score in Header

### Within Each User Story

- Tests MUST be written and fail before implementation (TDD Red-Green-Refactor)
- Store mutations & actions before UI components
- Pure formatting utilities and isolated modals before parent container integration
- Story complete and verified before moving to next priority

### Parallel Opportunities

- Phase 1 setup tasks T001, T002, T003, T004 can execute in parallel
- Foundational tasks T005, T006, T008 can execute in parallel
- After Phase 2 completes, user story test tasks can be authored in parallel:
  - T009, T010, T011, T012 for US1
  - T017, T018, T019, T020, T021 for US2
  - T028, T029, T030 for US3
  - T034, T035 for US4
  - T038, T039 for US5
  - T043, T044, T045, T046 for US6
  - T052, T053 for US7
- Within US1: T014 and T015 modals can be built in parallel
- Within US2: T023, T024, T025 modals can be built in parallel
- Within US6: T047 (utility), T049 (canvas wrapper), T050 (panel sizing) can be built in parallel
- Within Polish: T056, T057 can be developed in parallel

---

## Parallel Example: User Story 6

```bash
# Launch test creation for User Story 6 together:
Task: T043 "Unit test dynamic court coordinate scaling across varying canvas dimensions in src/features/play-match/__tests__/utils/courtArcPositions.test.ts"
Task: T044 "Component test for HalfCourtCanvas in src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx"
Task: T045 "Component test for TeamManagementPanel in src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx"
Task: T046 "Component test for TeamManagementCanvas in src/features/play-match/__tests__/components/TeamManagementCanvas.test.tsx"

# Build utility and components for User Story 6 in parallel:
Task: T047 "Implement dynamic responsive court arc position calculation utility in src/features/play-match/utils/courtArcPositions.ts"
Task: T049 "Update TeamManagementCanvas in src/features/play-match/components/TeamManagementCanvas.tsx"
Task: T050 "Update TeamManagementPanel in src/features/play-match/components/TeamManagementPanel.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Clock, Period & Isolated Period Scoring with Overtime Reset in modal)
4. **STOP and VALIDATE**: Verify timer start/pause, 3s hold modals, and period scoring independently
5. Deploy/demo initial MVP clock controller

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (P1) → Test independently → Deliver MVP!
3. Add User Story 2 (P1) → Court canvas, stint tracking & stat subtraction with cascading assist deduction
4. Add User Story 3 (P2) → Team management panel, unrestricted swap & timeout quotas
5. Add User Story 4 (P2) → Full-width rival panel without duplicate total score
6. Add User Story 5 (P2) → Bench player statistics information modal with shooting percentages and backdrop dismissal
7. Add User Story 6 (P1) → Responsive viewport adaptation & compact player circle scaling
8. Add User Story 7 (P2) → Enlarged score-only application header
9. Polish & Cross-Cutting → Full test suite & type validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Strict adherence to Constitution Principle I (TDD first) and Principle II (feature encapsulation)
- Commit after each task or logical group
