# Tasks: Apply CourtVision Kinetic Design

**Input**: Design documents from `specs/016-apply-new-design/`  
**Prerequisites**: [plan.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/plan.md), [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/spec.md), [research.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/research.md), [data-model.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/data-model.md), [contracts/](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/contracts/)

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3], [US4])
- Exact file paths are specified in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project-wide token configuration and styling setup

- [X] T001 Configure CourtVision Kinetic design tokens in `tailwind.config.js` per `contracts/tailwind-theme.contract.json` (defining surfaces, athletic slates, court-orange, tactical-blue, typography, spacing, border radiuses, and backward-compatible `danish-*` aliases)
- [X] T002 [P] Verify and update global Tailwind CSS directives and theme utilities in `index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core framework primitives and shell layout components that MUST be restyled before domain user stories

**⚠️ CRITICAL**: No user story implementation should begin until foundational components are styled and stable

- [X] T003 [P] Restyle primary, secondary, outline, and destructive button variants in `src/framework/Button.tsx` with 48px touch heights and CourtVision Kinetic styling
- [X] T004 [P] Restyle input field and focus states in `src/framework/Input.tsx` with dark slate `#0F172A` background, `#334155` border, and `#0EA5E9` focus ring
- [X] T005 [P] Restyle info alert dialog in `src/framework/ModalInfo.tsx` with `#171F33` slate container and `#334155` border
- [X] T006 [P] Restyle destructive confirmation modal in `src/framework/DeleteModal.tsx` with Level 2 elevation and `#93000A` danger button
- [X] T007 [P] Restyle application root container and canvas background in `App.tsx` to `#0B1326` athletic slate canvas ground
- [X] T008 [P] Restyle app header bar in `src/components/Header.tsx` with dark slate surface, `#334155` bottom divider, and white title typography
- [X] T009 [P] Restyle navigation tabs and active state indicators in `src/components/BottomNavBar.tsx` with court orange `#F97316` active icons

**Checkpoint**: Foundation ready — all framework primitives and the application shell reflect CourtVision Kinetic tokens

---

## Phase 3: User Story 1 - Experience CourtVision Kinetic Visual Aesthetics (Priority: P1) 🎯 MVP

**Goal**: Restyle all screens, cards, modals, tables, and charts across all application domains to reflect the CourtVision Kinetic design system (deep athletic slate, court orange accents, tactical sky blue highlights, clean borders, and Space Grotesk/Inter typography).

**Independent Test**: Navigate through primary views (Home, Club, Players, Matches, Match Detail, and Live Match) and confirm that colors, cards, borders, badges, and typography visually match `DESIGN.md` without unstyled or fallback states.

### Tests for User Story 1

- [X] T010 [P] [US1] Create unit test verifying CourtVision Kinetic design token compilation and theme mapping in `src/__tests__/design-tokens.test.ts`

### Implementation for User Story 1

#### Domain Batch 1: Club Management Views
- [X] T011 [P] [US1] Restyle club management screen containers and action buttons in `src/page/ClubManage.tsx`
- [X] T012 [P] [US1] Restyle club profile header, stats cards, and action triggers in `src/page/ClubProfile.tsx`
- [X] T013 [P] [US1] Restyle club creation/edit form fields, labels, and submit buttons in `src/components/ClubForm.tsx`
- [X] T014 [P] [US1] Restyle club list items, elevated cards, and selector controls in `src/components/ClubList.tsx`

#### Domain Batch 2: Player & Roster Management Views
- [X] T015 [P] [US1] Restyle player list screen, filter tabs, and add-player triggers in `src/page/PlayerList.tsx`
- [X] T016 [P] [US1] Restyle player roster cards and jersey number badges in `src/components/PlayerCards.tsx`
- [X] T017 [P] [US1] Restyle player detail profile, metric containers, and action buttons in `src/components/PlayerDetail.tsx`
- [X] T018 [P] [US1] Restyle player form inputs, position selectors, and submission buttons in `src/components/PlayerForm.tsx`
- [X] T019 [P] [US1] Restyle match roster selection modal dialog and selection checkboxes in `src/components/RosterSelectionModal.tsx`

#### Domain Batch 3: Match History & Overview Views
- [X] T020 [P] [US1] Restyle game list screen, status filters, and match cards layout in `src/page/GameList.tsx`
- [X] T021 [P] [US1] Restyle match preview cards, score displays, and status badges in `src/components/GameCards.tsx`
- [X] T022 [P] [US1] Restyle match creation and schedule form in `src/components/GameForm.tsx`
- [X] T023 [P] [US1] Restyle match results summary cards, win/loss pills, and scores in `src/components/GamesResults.tsx`
- [X] T024 [P] [US1] Restyle legacy game detail screen, quarter tabs, and box score tables in `src/components/GameDetail.tsx`

#### Domain Batch 4: Home View Feature Module
- [X] T025 [P] [US1] Restyle global statistics summary card in `src/features/home-view/components/GlobalStatsCard.tsx`
- [X] T026 [P] [US1] Restyle upcoming match card in `src/features/home-view/components/NextMatchCard.tsx`
- [X] T027 [P] [US1] Restyle recent match preview card in `src/features/home-view/components/RecentMatchCard.tsx`
- [X] T028 [P] [US1] Restyle recent matches column container in `src/features/home-view/components/RecentMatchesColumn.tsx`

#### Domain Batch 5: Match Detail Feature Module
- [X] T029 [P] [US1] Restyle match detail container and layout in `src/features/match-detail/MatchDetailView.tsx`
- [X] T030 [P] [US1] Restyle match summary header scoreboard in `src/features/match-detail/components/MatchSummaryHeader.tsx`
- [X] T031 [P] [US1] Restyle match stats graphics and comparison bars in `src/features/match-detail/components/MatchStatsGraphic.tsx`
- [X] T032 [P] [US1] Restyle period breakdown score table in `src/features/match-detail/components/PeriodBreakdownTable.tsx`
- [X] T033 [P] [US1] Restyle roster valuation list and player performance rows in `src/features/match-detail/components/RosterValuationList.tsx`
- [X] T034 [P] [US1] Restyle team radar chart container and tactical blue stroke styling in `src/features/match-detail/components/PolygonRadarChart.tsx`
- [X] T035 [P] [US1] Restyle match editing modal dialog in `src/features/match-detail/components/MatchEditModal.tsx`
- [X] T036 [P] [US1] Restyle match share and export modal dialog in `src/features/match-detail/components/MatchShareModal.tsx`
- [X] T037 [P] [US1] Restyle player match performance detail modal in `src/features/match-detail/components/PlayerDetailModal.tsx`
- [X] T038 [P] [US1] Restyle advanced team analytics panel in `src/features/match-detail/components/TeamAdvancedAnalytics.tsx`

#### Domain Batch 6: Live Match & Court Controls
- [X] T039 [US1] Restyle live match screen orchestrator and main HUD in `src/features/play-match/PlayMatch.tsx`
- [X] T040 [P] [US1] Restyle half-court tactical canvas and shot markers in `src/features/play-match/components/HalfCourtCanvas.tsx`
- [X] T041 [P] [US1] Restyle court boundary lines, key markings, and shot pins in `src/components/HalfCourt.tsx`
- [X] T042 [P] [US1] Restyle quarter selection dialog in `src/features/play-match/components/PeriodSelectModal.tsx`
- [X] T043 [P] [US1] Restyle manual game clock edit modal in `src/features/play-match/components/ManualTimeModal.tsx`
- [X] T044 [P] [US1] Restyle quick player assignment dialog in `src/features/play-match/components/QuickAssignPlayerModal.tsx`
- [X] T045 [P] [US1] Restyle stat correction / subtraction modal in `src/features/play-match/components/PlayerStatSubtractionModal.tsx`
- [X] T046 [P] [US1] Restyle opponent score, foul counters, and timeout triggers in `src/features/play-match/components/RivalPanelControl.tsx`
- [X] T047 [P] [US1] Restyle opponent control panel in `src/components/RivalControlPanel.tsx`
- [X] T048 [P] [US1] Restyle starting five lineup selector modal in `src/features/play-match/components/StartingFiveModal.tsx`
- [X] T049 [P] [US1] Restyle legacy starting five modal in `src/components/StartingFiveModal.tsx`
- [X] T050 [P] [US1] Restyle in-app alert banner in `src/components/Alerts.tsx`

**Checkpoint**: User Story 1 complete — all views across the entire app display CourtVision Kinetic styling

---

## Phase 4: User Story 2 - Pure Visual Restyling with Zero Functional Regressions (Priority: P1)

**Goal**: Ensure 100% preservation of all component state logic, hooks, handlers, Zustand stores, and Drizzle SQLite operations across the entire application.

**Independent Test**: Execute the automated test suite (`npm test`) across all 87 test suites and confirm 100% pass rate (503+ tests) with zero modifications to test assertions or application logic.

### Tests for User Story 2

- [X] T051 [P] [US2] Verify automated test suite pass rate for shell and framework components in `src/__tests__/components/Header.test.tsx` and `src/__tests__/components/BottomNavBar.test.tsx`
- [X] T052 [P] [US2] Verify automated test suite pass rate for club and roster components in `src/__tests__/components/ClubManage.test.tsx` and `src/__tests__/components/PlayerDetail.test.tsx`
- [X] T053 [P] [US2] Verify automated test suite pass rate for match history and scheduling in `src/__tests__/components/GameCards.test.tsx` and `src/__tests__/components/GameForm.test.tsx`
- [X] T054 [P] [US2] Verify automated test suite pass rate for home-view and match-detail components in `src/features/home-view/__tests__/` and `src/features/match-detail/__tests__/`
- [X] T055 [US2] Verify automated test suite pass rate for play-match feature and court operations in `src/features/play-match/__tests__/` and `src/__tests__/page/PlayMatch.test.tsx`

### Implementation for User Story 2

- [X] T056 [US2] Audit all modified components to verify zero modifications were made to component props interfaces, hooks, state store actions, or database persistence logic
- [X] T057 [US2] Execute full test suite (`npm test`) and resolve any styling class syntax issues or missing token definitions to restore 100% test pass rate

**Checkpoint**: User Stories 1 AND 2 complete — all screens restyled with verified zero regressions in functional tests

---

## Phase 5: User Story 3 - Ergonomic Touch Targets and Glancable Metrics (Priority: P2)

**Goal**: Ensure sideline scorekeeping controls meet the 48x48px accessible touch standard and render high-contrast, glanceable stat typography.

**Independent Test**: Measure and verify hit areas on mobile viewports for quick-scoring buttons, substitution slots, and clock controls, confirming minimum 48px hit dimensions.

### Tests for User Story 3

- [X] T058 [P] [US3] Verify quick-scoring and substitution touch target rendering in `src/__tests__/components/PlayerStatsModal.test.tsx` and `src/__tests__/components/SubstitutionPanel.test.tsx`

### Implementation for User Story 3

- [X] T059 [P] [US3] Restyle quick-scoring modal in `src/components/PlayerStatsModal.tsx` ensuring all scoring and foul buttons meet minimum 48x48px touch targets (`min-h-[48px] min-w-[48px]`)
- [X] T060 [P] [US3] Restyle live match player stats modal in `src/features/play-match/components/PlayerStatsModal.tsx` with 48x48px scoring touch targets and high-contrast stat indicators
- [X] T061 [P] [US3] Restyle bench player quick stats modal in `src/features/play-match/components/BenchPlayerStatsModal.tsx` with 48x48px hit areas
- [X] T062 [P] [US3] Restyle bench substitution controls in `src/components/SubstitutionPanel.tsx` with 48x48px touch targets and clear active/bench status indicators
- [X] T063 [P] [US3] Restyle team management bench roster and substitution canvas in `src/features/play-match/components/TeamManagementCanvas.tsx` with 48px minimum hit heights
- [X] T064 [P] [US3] Restyle player substitution list and court rotation panel in `src/features/play-match/components/TeamManagementPanel.tsx` ensuring 48x48px touch targets for player slots
- [X] T065 [P] [US3] Restyle game clock controller, score adjusters, and foul triggers in `src/features/play-match/components/TimeScoreFoulsController.tsx` with bold `stat-display` typography and 48x48px hit areas

**Checkpoint**: User Story 3 complete — all sideline interactive triggers adhere to 48px ergonomic touch standards

---

## Phase 6: User Story 4 - Consistent Cross-Platform Rendering on iOS and Android (Priority: P2)

**Goal**: Ensure spacing, margins, font fallbacks, and dark theme colors render consistently across iOS and Android without clipping, font loading errors, or overflow.

**Independent Test**: Start Expo development server with clean cache and verify zero unresolved classes or platform warnings across simulated viewports.

### Tests for User Story 4

- [X] T066 [US4] Execute Expo bundler cache validation (`npx expo start -c`) to verify NativeWind compiles all design tokens with zero Tailwind warnings

### Implementation for User Story 4

- [X] T067 [P] [US4] Verify font family fallbacks for Space Grotesk and Inter in `tailwind.config.js` to ensure cross-platform font rendering on iOS and Android without native asset linking
- [X] T068 [P] [US4] Audit responsive padding and layout boundaries on compact 360px mobile viewports in `src/page/ClubManage.tsx`, `src/page/PlayerList.tsx`, and `src/page/GameList.tsx`
- [X] T069 [P] [US4] Audit responsive layout and horizontal constraints on live tracking screen in `src/features/play-match/PlayMatch.tsx` to prevent clipping on small screen devices

**Checkpoint**: All user stories complete — application fully restyled, verified cross-platform, with zero regressions

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, full documentation validation, and comprehensive quality checks

- [X] T070 [P] Audit all components to eliminate any remaining hardcoded inline hex colors or unmapped legacy styles in `src/` component tree
- [X] T071 Run complete end-to-end quickstart validation scenarios defined in `specs/016-apply-new-design/quickstart.md`
- [X] T072 Run full automated test suite (`npm test`) to guarantee all 87 test suites and 503+ tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — core visual restyling MVP
- **User Story 2 (Phase 4)**: Runs alongside and immediately follows User Story 1 component restyling to guarantee 0 regressions
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2); can execute in parallel with or after US1 live match tasks
- **User Story 4 (Phase 6)**: Depends on Setup (Phase 1) and US1/US3 completion to validate cross-platform compilation
- **Polish (Phase 7)**: Depends on completion of all user story phases

### User Story Dependencies

- **US1 (P1)**: Independent of other stories once Foundational (Phase 2) is complete
- **US2 (P1)**: Verifies US1 and foundational components; blocks release if any regression is detected
- **US3 (P2)**: Focuses specifically on touch target constraints within sideline dialogs and substitution controls; builds on US1 components
- **US4 (P2)**: Focuses on font fallbacks and layout boundary constraints across platforms; validates outputs from US1, US2, and US3

### Within Each User Story

1. Write / run targeted tests to verify baseline status
2. Execute component restyling across distinct domain files
3. Re-run tests to confirm functional integrity
4. Validate story acceptance scenarios before moving forward

### Parallel Opportunities

- **Phase 1**: T002 can run in parallel with T001 once tokens are drafted.
- **Phase 2**: T003 through T009 touch separate files (`Button.tsx`, `Input.tsx`, `ModalInfo.tsx`, `DeleteModal.tsx`, `App.tsx`, `Header.tsx`, `BottomNavBar.tsx`) and can execute in parallel.
- **Phase 3 (US1)**: All tasks within separate domain batches marked with `[P]` touch distinct component files and can run in parallel.
- **Phase 4 (US2)**: Test verification tasks T051–T054 run against distinct test suites in parallel.
- **Phase 5 (US3)**: Tasks T059–T065 touch separate modals and control panels and can run in parallel.
- **Phase 6 (US4)**: T067, T068, and T069 touch different files and can run in parallel.

---

## Parallel Execution Examples

### Parallel Example: Foundational Primitives (Phase 2)

```bash
# Execute framework primitives in parallel:
Task: "Restyle primary, secondary, outline, and destructive button variants in src/framework/Button.tsx"
Task: "Restyle input field and focus states in src/framework/Input.tsx"
Task: "Restyle info alert dialog in src/framework/ModalInfo.tsx"
Task: "Restyle destructive confirmation modal in src/framework/DeleteModal.tsx"
Task: "Restyle application root container and canvas background in App.tsx"
Task: "Restyle app header bar in src/components/Header.tsx"
Task: "Restyle navigation tabs and active state indicators in src/components/BottomNavBar.tsx"
```

### Parallel Example: User Story 1 Domain Batches

```bash
# Batch 1 (Club Management):
Task: "Restyle club management screen containers in src/page/ClubManage.tsx"
Task: "Restyle club profile header in src/page/ClubProfile.tsx"
Task: "Restyle club creation/edit form in src/components/ClubForm.tsx"
Task: "Restyle club list items in src/components/ClubList.tsx"

# Batch 4 (Home View Feature):
Task: "Restyle global statistics summary card in src/features/home-view/components/GlobalStatsCard.tsx"
Task: "Restyle upcoming match card in src/features/home-view/components/NextMatchCard.tsx"
Task: "Restyle recent match preview card in src/features/home-view/components/RecentMatchCard.tsx"
Task: "Restyle recent matches column container in src/features/home-view/components/RecentMatchesColumn.tsx"
```

### Parallel Example: User Story 3 Ergonomic Controls

```bash
# Execute sideline modal and touch target updates in parallel:
Task: "Restyle quick-scoring modal in src/components/PlayerStatsModal.tsx"
Task: "Restyle live match player stats modal in src/features/play-match/components/PlayerStatsModal.tsx"
Task: "Restyle bench player quick stats modal in src/features/play-match/components/BenchPlayerStatsModal.tsx"
Task: "Restyle bench substitution controls in src/components/SubstitutionPanel.tsx"
Task: "Restyle team management canvas in src/features/play-match/components/TeamManagementCanvas.tsx"
Task: "Restyle game clock controller in src/features/play-match/components/TimeScoreFoulsController.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1: Setup** (`tailwind.config.js` token engine).
2. Complete **Phase 2: Foundational** (shell and primitives).
3. Complete **Phase 3: User Story 1** (batch-by-batch visual restyling of application screens).
4. Run `npm test` to verify **Zero Functional Regressions** (US2 checkpoint).
5. **STOP and VALIDATE**: Confirm the application looks and feels like CourtVision Kinetic.

### Incremental Delivery

1. **Increment 1 (Foundation & Shell)**: Tokens + Framework components + Header & Bottom Nav.
2. **Increment 2 (Club & Team Management)**: Club and Player management views restyled.
3. **Increment 3 (Matches & Analytics)**: Game list, Game cards, Home View, and Match Detail restyled.
4. **Increment 4 (Live Match Tracking & Ergonomics)**: Play match HUD, Court markings, and 48px touch targets.
5. **Increment 5 (Cross-Platform Polish & Verification)**: Font fallbacks, responsive constraints, and test suite gate.

---

## Notes

- All changes MUST be restricted to `className` strings, `tailwind.config.js`, and static inline style removals.
- Zero modifications to component props APIs, Zustand store logic, Drizzle queries, or event handlers.
- 100% of the 87 Jest test suites (503+ tests) must pass at every checkpoint.
