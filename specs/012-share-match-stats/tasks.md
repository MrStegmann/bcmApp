# Tasks: Share Match Stats Graphic & Export

**Input**: Design documents from `/specs/012-share-match-stats/`  
**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/share-service-contract.ts](./contracts/share-service-contract.ts), [constitution.md](../../.specify/memory/constitution.md)

**Tests**: Non-negotiable per Constitution Principle I (Test-Driven Development First). All tests must follow Red-Green-Refactor with Jest and React Native Testing Library.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Every task includes an explicit file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and required mobile export libraries

- [X] T001 Install `react-native-view-shot`, `expo-sharing`, and `expo-media-library` dependencies in package.json
- [X] T002 [P] Create Jest mock configurations for view-shot, sharing, and media-library in src/features/match-detail/__tests__/mocks/shareMocks.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data types and store state that MUST be complete before user stories can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Define export data contracts (`FormattedPlayerBoxScore`, `FormattedTeamTotals`, `FormattedPeriodScore`, `FormattedAdvancedStats`, `MatchShareGraphicData`, `ShareActionOutcome`) in src/features/match-detail/types/share.ts
- [X] T004 [P] Re-export share types in src/features/match-detail/types/index.ts
- [X] T005 [P] Add unit tests for share modal state transitions (`isShareModalOpen`, `openShareModal`, `closeShareModal`, `isSharingProcessing`, `setSharingProcessing`) in src/features/match-detail/__tests__/useMatchDetailStore.test.ts
- [X] T006 Implement share modal visibility and processing actions in src/features/match-detail/store/useMatchDetailStore.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Match Summary PNG Graphic Generation (Priority: P1) 🎯 MVP

**Goal**: Generate a structured, high-resolution (1280px width) PNG visual box score matching the reference layout with header metadata, 24-column player table, `EQUIPO` summary row, advanced metrics table, and period breakdown (`Parciales`), protected against division by zero.

**Independent Test**: Provide completed match data to `formatMatchShareData` and render `MatchStatsGraphic`; assert that all 24 columns, team totals, advanced metrics, and period scores render cleanly with 0% / 0.0 fallbacks and zero visual clipping.

### Tests for User Story 1 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Unit tests for match data formatting and zero-denominator fallbacks in src/features/match-detail/__tests__/utils/shareDataFormatter.test.ts
- [X] T008 [P] [US1] Component tests for box score table, 24 columns, headers, totals, and advanced stats layout in src/features/match-detail/__tests__/components/MatchStatsGraphic.test.tsx

### Implementation for User Story 1

- [X] T009 [US1] Implement `formatMatchShareData` utility with safe percentages, team aggregations, and period mappings in src/features/match-detail/utils/shareDataFormatter.ts
- [X] T010 [US1] Implement `MatchStatsGraphic` high-resolution layout component (1280px fixed width, NativeWind styling, shaded highlight columns, forwardRef) in src/features/match-detail/components/MatchStatsGraphic.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (data formatting and visual layout pass all assertions)

---

## Phase 4: User Story 2 - Match Detail View Action Integration (Priority: P1)

**Goal**: Integrate a visible "Compartir Estadísticas" action button into Match Detail View for finished matches that triggers `MatchShareModal` with an interactive graphic preview and loading feedback.

**Independent Test**: Navigate to `MatchDetailView` for a finished match, verify the "Compartir Estadísticas" button is visible and active (hidden or disabled for pending/in-progress matches), and tap it to verify the preview modal opens.

### Tests for User Story 2 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US2] Component tests for "Compartir Estadísticas" button display on finished vs pending matches in src/features/match-detail/__tests__/components/MatchSummaryHeader.test.tsx
- [X] T012 [P] [US2] Component tests for `MatchShareModal` preview rendering, close action, and loading spinner in src/features/match-detail/__tests__/components/MatchShareModal.test.tsx
- [X] T013 [P] [US2] Integration test verifying share modal trigger in src/features/match-detail/__tests__/MatchDetailView.test.tsx

### Implementation for User Story 2

- [X] T014 [US2] Add "Compartir Estadísticas" button with share icon to finished games in src/features/match-detail/components/MatchSummaryHeader.tsx
- [X] T015 [US2] Implement `MatchShareModal` with preview scroll container, close header, and loading indicators in src/features/match-detail/components/MatchShareModal.tsx
- [X] T016 [US2] Mount `MatchShareModal` and bind to `useMatchDetailStore` in src/features/match-detail/MatchDetailView.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (user can open preview modal from finished match details)

---

## Phase 5: User Story 3 - Save Image to Device & Native Sharing / WhatsApp (Priority: P2)

**Goal**: Provide native export capabilities to save the generated box score PNG directly to the device photo gallery via `expo-media-library` (with permission handling) or dispatch it directly to WhatsApp and other communication apps via `expo-sharing`.

**Independent Test**: Mock device sharing and gallery saving; verify tapping "Compartir / WhatsApp" captures the graphic and dispatches the native share sheet with the PNG file attached, and tapping "Guardar en Galería" requests permission and saves to library with toast/alert feedback.

### Tests for User Story 3 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T017 [P] [US3] Unit tests for `matchShareService` mocking `captureRef`, `expo-sharing`, and `expo-media-library` (permission granted/denied, error handling) in src/features/match-detail/__tests__/services/matchShareService.test.ts
- [X] T018 [P] [US3] Component tests for Save and Share button trigger handlers and alert feedback in src/features/match-detail/__tests__/components/MatchShareModal.test.tsx

### Implementation for User Story 3

- [X] T019 [US3] Implement `matchShareService` (`captureViewToPng`, `shareImageFile`, `saveImageToGallery` with permission checks) in src/features/match-detail/services/matchShareService.ts
- [X] T020 [US3] Wire "Compartir / WhatsApp" and "Guardar en Galería" action buttons to `matchShareService` with user alerts in src/features/match-detail/components/MatchShareModal.tsx
- [X] T021 [P] [US3] Export share components, types, and services from public barrel in src/features/match-detail/index.ts

**Checkpoint**: All user stories should now be independently functional (full capture, gallery saving, and WhatsApp sharing operational)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Type safety verification, full test suite execution, and end-to-end documentation validation

- [X] T022 [P] Verify TypeScript strict compliance with zero type errors via `tsc --noEmit` across src/features/match-detail/
- [X] T023 Run full Jest test suite across all match-detail tests (`npm test -- src/features/match-detail/`)
- [X] T024 Validate manual testing scenarios per specs/012-share-match-stats/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Core data formatter & graphic layout component
  - User Story 2 (P1): Header button, preview modal, and view integration (depends on US1 graphic)
  - User Story 3 (P2): Share and gallery export services & modal wiring (depends on US1 & US2)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Uses `MatchStatsGraphic` from US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Hooks export actions into `MatchShareModal` from US2

### Within Each User Story

- TDD Rule: Tests MUST be written and fail before implementing logic
- Formatters & models before UI components
- UI components before view integration
- Services before UI action binding
- Story complete before moving to next phase

### Parallel Opportunities

- **Phase 1**: T002 mock configs can be drafted while T001 packages install
- **Phase 2**: T004 type exports and T005 store tests can run in parallel
- **Phase 3 (US1)**: T007 formatter tests and T008 graphic component tests can run in parallel
- **Phase 4 (US2)**: T011 header tests, T012 modal tests, and T013 integration tests can run in parallel
- **Phase 5 (US3)**: T017 service tests and T018 modal button handler tests can run in parallel
- **Phase 6**: T022 TypeScript check and T024 quickstart verification can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch test creation for User Story 1 in parallel:
Task: "Unit tests for match data formatting and zero-denominator fallbacks in src/features/match-detail/__tests__/utils/shareDataFormatter.test.ts"
Task: "Component tests for box score table, 24 columns, headers, totals, and advanced stats layout in src/features/match-detail/__tests__/components/MatchStatsGraphic.test.tsx"

# Once tests are failing, implement the data formatter and visual component:
Task: "Implement formatMatchShareData utility with safe percentages in src/features/match-detail/utils/shareDataFormatter.ts"
Task: "Implement MatchStatsGraphic high-resolution layout component in src/features/match-detail/components/MatchStatsGraphic.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + Story 2 Preview)

1. Complete Phase 1: Setup (dependencies & test mocks)
2. Complete Phase 2: Foundational (types & store state)
3. Complete Phase 3: User Story 1 (data formatter & `MatchStatsGraphic`)
4. **STOP and VALIDATE**: Verify graphic renders all 24 columns, totals, advanced stats, and period scores with zero division errors
5. Complete Phase 4: User Story 2 (add header button & open `MatchShareModal` preview)
6. **STOP and VALIDATE**: Test modal preview directly in the app

### Incremental Delivery

1. Setup + Foundational → Core prerequisites ready
2. Add User Story 1 → Graphic rendered & verified (MVP milestone 1)
3. Add User Story 2 → Match Detail View triggers preview modal (MVP milestone 2)
4. Add User Story 3 → Direct gallery saving and WhatsApp sharing operational (Complete feature)
5. Polish → Strict TypeScript check, 100% test coverage, and quickstart run

---

## Notes

- All tasks strictly adhere to `- [ ] [TaskID] [P?] [Story?] Description with file path` format
- `[P]` tasks = distinct files with no incomplete task dependencies
- `[Story]` label maps task to specific user story ([US1], [US2], [US3])
- 100% adherence to Constitution Principle I (TDD First) with unit and component tests
- Roster columns, team totals, advanced metrics, and period breakdown strictly adhere to the reference box score sheet
