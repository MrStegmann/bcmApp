# Tasks: Suppress Notification Popups

**Input**: Design documents from `/specs/014-suppress-notification-popups/`
**Prerequisites**: [plan.md](file:///j:/GitHub/BasketApp/bcmApp/specs/014-suppress-notification-popups/plan.md), [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/014-suppress-notification-popups/spec.md), [data-model.md](file:///j:/GitHub/BasketApp/bcmApp/specs/014-suppress-notification-popups/data-model.md), [contracts/notification-service.contract.ts](file:///j:/GitHub/BasketApp/bcmApp/specs/014-suppress-notification-popups/contracts/notification-service.contract.ts), [research.md](file:///j:/GitHub/BasketApp/bcmApp/specs/014-suppress-notification-popups/research.md), [quickstart.md](file:///j:/GitHub/BasketApp/bcmApp/specs/014-suppress-notification-popups/quickstart.md)

**Tests**: Tests are strictly required per Constitution Principle I (TDD First with Jest and React Native Testing Library). Test tasks are placed at the beginning of each User Story phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize directory structure and shared TypeScript definitions for the notifications feature.

- [x] T001 Create notification feature directories in `src/features/notifications/` (`db/`, `services/`, `store/`, `hooks/`, `components/`, `__tests__/`)
- [x] T002 [P] Define core notification domain types and interfaces in `src/features/notifications/types.ts` per contract specification

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database tables, repository interfaces, and baseline Zustand store required before user stories can proceed.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Define `notifications` and `notification_settings` Drizzle schema in `src/features/notifications/db/schema.ts`
- [x] T004 Register notification schemas and export tables in `src/db/schema.ts`
- [x] T005 [P] Add SQLite table creation SQL and column migrations for `notifications` and `notification_settings` in `src/db/index.ts`
- [x] T006 Implement base SQLite repository structure with singleton settings upsert in `src/features/notifications/db/repository.ts`
- [x] T007 Implement foundational Zustand store with baseline state and reset action in `src/features/notifications/store/useNotificationStore.ts`

**Checkpoint**: Foundation ready - notification database tables, repository scaffold, and baseline store are established.

---

## Phase 3: User Story 1 - Distraction-Free Active Match Experience (Priority: P1) 🎯 MVP

**Goal**: Completely suppress incoming visual notification popups during active basketball match sessions so court view and game controls remain unobstructed, while safely logging notifications.

**Independent Test**: Launch an active match session, trigger a simulated notification, and verify that `evaluateSuppression().shouldShowAlert` evaluates to `false` with `reason = 'match'`, leaving gameplay controls unobstructed and logging the message.

### Tests for User Story 1 (TDD First) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US1] Unit tests for match-mode suppression evaluation logic in `src/features/notifications/__tests__/services/notificationEvaluator.test.ts`
- [x] T009 [P] [US1] Integration tests for match lifecycle sync and suppression state in `src/features/notifications/__tests__/store/useNotificationStore.test.ts`

### Implementation for User Story 1

- [x] T010 [US1] Implement deterministic suppression evaluator rules for match mode in `src/features/notifications/services/notificationEvaluator.ts`
- [x] T011 [US1] Implement `setMatchActive` state actions and active match sync in `src/features/notifications/store/useNotificationStore.ts`
- [x] T012 [US1] Integrate match session start and stop triggers with notification store in `src/features/play-match/store/usePlayMatchStore.ts`
- [x] T013 [US1] Implement notification manager handler to process incoming notifications and suppress popups during active matches in `src/features/notifications/services/notificationManager.ts`

**Checkpoint**: User Story 1 is functional and testable independently. Live matches operate free of visual popup interruptions.

---

## Phase 4: User Story 2 - Smooth In-App Navigation Without Visual Popups (Priority: P1)

**Goal**: Suppress visual notification popups while the application is active in the foreground during general navigation, and seamlessly permit system banners when in the background or device locked.

**Independent Test**: Navigate to any general view (ClubManage, TeamView, Stats), send a simulated notification, and confirm visual popups are suppressed. Transition AppState to background and verify `shouldShowAlert` becomes `true`.

### Tests for User Story 2 (TDD First) ⚠️

- [x] T014 [P] [US2] Unit tests for AppState foreground vs background suppression transitions in `src/features/notifications/__tests__/services/notificationEvaluator.test.ts`
- [x] T015 [P] [US2] Unit tests for React Native AppState event listener hook in `src/features/notifications/__tests__/hooks/useNotificationLifecycle.test.ts`

### Implementation for User Story 2

- [x] T016 [US2] Implement `useNotificationLifecycle` hook listening to `AppState.addEventListener` in `src/features/notifications/hooks/useNotificationLifecycle.ts`
- [x] T017 [US2] Mount `useNotificationLifecycle` and initialize notification manager in `App.tsx`
- [x] T018 [US2] Connect foreground state transitions to evaluator and store in `src/features/notifications/services/notificationManager.ts`

**Checkpoint**: User Stories 1 and 2 operate independently. General foreground use suppresses visual popups, while backgrounding restores OS banner behavior within 50ms.

---

## Phase 5: User Story 3 - In-App Notification Center & History (Priority: P2)

**Goal**: Provide an accessible in-app notification center where suppressed messages are safely stored, viewable chronologically, marked as read, or cleared.

**Independent Test**: Receive multiple suppressed notifications, open the notification center in <= 2 taps from the header, verify all items render in order, tap "Marcar todo como leído" to clear unread badge, and tap "Limpiar historial" to show empty state.

### Tests for User Story 3 (TDD First) ⚠️

- [x] T019 [P] [US3] Unit tests for notification persistence, pagination, read status, and unread counts in `src/features/notifications/__tests__/services/notificationRepository.test.ts`
- [x] T020 [P] [US3] Component tests for notification center button and unread count badge in `src/features/notifications/__tests__/components/NotificationCenterButton.test.tsx`
- [x] T021 [P] [US3] Component tests for notification center modal list, read actions, and empty state in `src/features/notifications/__tests__/components/NotificationCenterModal.test.tsx`

### Implementation for User Story 3

- [x] T022 [US3] Implement notification queries (`listNotifications`, `getUnreadCount`, `markAsRead`, `markAllAsRead`, `clearAll`) in `src/features/notifications/db/repository.ts`
- [x] T023 [US3] Implement unread count and inbox sync actions in `src/features/notifications/store/useNotificationStore.ts`
- [x] T024 [US3] Implement `NotificationCenterButton` with unread badge counter and NativeWind styles in `src/features/notifications/components/NotificationCenterButton.tsx`
- [x] T025 [US3] Implement `NotificationCenterModal` with message list, empty state, and action buttons in `src/features/notifications/components/NotificationCenterModal.tsx`
- [x] T026 [US3] Integrate `NotificationCenterButton` into the global header in `src/components/Header.tsx`

**Checkpoint**: User Stories 1, 2, and 3 are fully operational. Suppressed notifications are preserved, viewable, and manageable.

---

## Phase 6: User Story 4 - Customizable Notification Suppression Settings (Priority: P3)

**Goal**: Provide a settings modal allowing users to independently toggle notification suppression for live matches and general in-app usage, persisted in SQLite across app restarts.

**Independent Test**: Open settings, toggle "Mute in App" to false while keeping "Mute in Match" true, and verify incoming notifications display visual banners during general navigation but remain suppressed in match mode. Verify toggles persist across app restart.

### Tests for User Story 4 (TDD First) ⚠️

- [x] T027 [P] [US4] Unit tests for loading and saving settings in `src/features/notifications/__tests__/services/notificationRepository.test.ts`
- [x] T028 [P] [US4] Component tests for settings modal toggles and immediate persistence in `src/features/notifications/__tests__/components/NotificationSettingsModal.test.tsx`

### Implementation for User Story 4

- [x] T029 [US4] Implement `getSettings` and `saveSettings` upsert functions in `src/features/notifications/db/repository.ts`
- [x] T030 [US4] Implement `loadSettings` and `updateSettings` store actions in `src/features/notifications/store/useNotificationStore.ts`
- [x] T031 [US4] Implement `NotificationSettingsModal` with NativeWind toggles and descriptions in `src/features/notifications/components/NotificationSettingsModal.tsx`
- [x] T032 [US4] Wire settings modal open button into `NotificationCenterModal` in `src/features/notifications/components/NotificationCenterModal.tsx`

**Checkpoint**: All user stories (US1-US4) are complete, customizable, and testable independently.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Public barrel exports, full automated validation, type checks, and verification against quickstart scenarios.

- [x] T033 [P] Export public feature API (components, hooks, store, types) in `src/features/notifications/index.ts`
- [x] T034 Run full Jest test suite across `src/features/notifications/` and existing features to verify zero regressions
- [x] T035 Run TypeScript compiler check (`npx tsc --noEmit`) to verify zero type errors
- [x] T036 Execute manual quickstart verification scenarios per `specs/014-suppress-notification-popups/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories.
- **User Stories (Phases 3 - 6)**: All depend on Foundational phase completion.
  - Phase 3 (US1 - Match Mode Suppression) and Phase 4 (US2 - In-App Suppression) can be executed in priority order or in parallel.
  - Phase 5 (US3 - Notification Center) depends on repository persistence from Phase 2 and integrates with US1/US2.
  - Phase 6 (US4 - Settings) builds upon repository and store persistence.
- **Polish (Phase 7)**: Depends on all user stories (US1 - US4) being completed.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational (Phase 2). No dependency on other user stories.
- **User Story 2 (P1)**: Starts after Foundational (Phase 2). Evaluator rules complement US1; independently testable.
- **User Story 3 (P2)**: Starts after Foundational (Phase 2). Consumes notification records persisted by US1/US2.
- **User Story 4 (P3)**: Starts after Foundational (Phase 2). Modifies settings evaluated by US1/US2.

### Within Each User Story

- TDD tests MUST be written and run to verify failure before implementing code.
- Data access / models before services.
- Services before UI components.
- Core component logic before integration wiring.

### Parallel Opportunities

- **Phase 1**: T001 and T002 can be started together.
- **Phase 2**: T003, T005, and T007 touch distinct files and can run in parallel once T001/T002 finish.
- **Phase 3 (US1)**: Test tasks T008 and T009 can be written concurrently.
- **Phase 4 (US2)**: Test tasks T014 and T015 can be written concurrently.
- **Phase 5 (US3)**: Test tasks T019, T020, and T021 can run in parallel.
- **Phase 6 (US4)**: Test tasks T027 and T028 can run in parallel.

---

## Parallel Execution Examples

### Parallel Example: User Story 1 (Match Mode Suppression)

```bash
# Launch test creation in parallel:
Task T008: "Unit tests for match-mode suppression evaluation logic in src/features/notifications/__tests__/services/notificationEvaluator.test.ts"
Task T009: "Integration tests for match lifecycle sync and suppression state in src/features/notifications/__tests__/store/useNotificationStore.test.ts"

# After tests fail (Red), implement core logic:
Task T010: "Implement deterministic suppression evaluator rules in src/features/notifications/services/notificationEvaluator.ts"
Task T011: "Implement setMatchActive state actions in src/features/notifications/store/useNotificationStore.ts"
```

### Parallel Example: User Story 3 (Notification Center)

```bash
# Launch UI and Repository tests concurrently:
Task T019: "Unit tests for notification persistence in src/features/notifications/__tests__/services/notificationRepository.test.ts"
Task T020: "Component tests for button in src/features/notifications/__tests__/components/NotificationCenterButton.test.tsx"
Task T021: "Component tests for modal in src/features/notifications/__tests__/components/NotificationCenterModal.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1: Setup** (T001 - T002).
2. Complete **Phase 2: Foundational** (T003 - T007) - creates database tables and store foundation.
3. Complete **Phase 3: User Story 1** (T008 - T013) - delivers distraction-free live matches immediately.
4. **STOP and VALIDATE**: Run Scenario 1 from `specs/014-suppress-notification-popups/quickstart.md`.
5. The core user pain point (heads-up popups blocking match play) is completely solved.

### Incremental Delivery

1. **Increment 1 (MVP)**: Setup + Foundational + User Story 1 (Distraction-Free Live Matches).
2. **Increment 2**: User Story 2 (General In-App Navigation Suppression & Background Resumption).
3. **Increment 3**: User Story 3 (In-App Notification Center, Header Icon, History, Unread Badge).
4. **Increment 4**: User Story 4 (User Preferences & Settings Modal).
5. **Increment 5**: Polish, TypeScript check, and full test suite regression pass.
