# Quickstart Validation Guide: Suppress Notification Popups

**Feature**: `014-suppress-notification-popups`  
**Date**: 2026-10-25  
**Status**: Ready for Validation  

This guide provides runnable scenarios to validate that notification popups are suppressed during live match sessions and active foreground app usage, while ensuring that all notifications are safely captured in the in-app notification center.

---

## 1. Prerequisites

1. Node.js (v20+) and project dependencies installed (`npm install`).
2. SQLite database initialized with migrations:
   ```bash
   npm test
   ```
3. Development server can be started via:
   ```bash
   npx expo start -c
   ```

---

## 2. Validation Scenarios

### Scenario 1: Distraction-Free Match Session (P1 - User Story 1)

**Goal**: Verify that when a user is in an active match, incoming notifications do not show a visual banner overlay, and match timers/buttons remain completely unobstructed.

1. **Setup**:
   - Launch app or run Jest component test suite `src/features/notifications/__tests__/services/notificationEvaluator.test.ts`.
   - Set match mode active via `useNotificationStore.getState().setMatchActive(true, 101)`.
2. **Action**:
   - Trigger an incoming notification payload: `{ title: "League Notice", body: "Tomorrow game postponed" }`.
3. **Expected Outcome**:
   - `evaluateSuppression().shouldShowAlert` evaluates to `false`.
   - `suppressedReason` is recorded as `'match'`.
   - No popup banner renders over the court canvas or match timer.
   - The notification is persisted into the database with `isRead = 0`.

---

### Scenario 2: Foreground App Usage (P1 - User Story 2)

**Goal**: Verify that while navigating clubs, teams, or statistics in the foreground, visual notification popups are muted.

1. **Setup**:
   - Set app state to `'active'` with match mode inactive (`isMatchActive = false`).
   - Default setting `muteInApp` is `true`.
2. **Action**:
   - Trigger incoming notification.
3. **Expected Outcome**:
   - `evaluateSuppression().shouldShowAlert` evaluates to `false`.
   - `suppressedReason` is recorded as `'foreground'`.
   - Unread notification counter increments by 1.

---

### Scenario 3: Background & Device Locked Transitions (FR-008)

**Goal**: Verify that when the user leaves the app or locks the device, standard OS popups are allowed.

1. **Setup**:
   - Simulate `AppState.change` to `'background'`.
2. **Action**:
   - Trigger incoming notification.
3. **Expected Outcome**:
   - Suppression rule allows standard OS banner presentation (`shouldShowAlert = true`, reason `'none'`).
   - Transition happens in < 50ms upon `AppState` update.

---

### Scenario 4: In-App Notification Center & History (P2 - User Story 3)

**Goal**: Verify that users can open the notification center in <= 2 taps and review suppressed messages.

1. **Setup**:
   - Simulate receiving 3 suppressed notifications.
2. **Action**:
   - Tap the Notification Center bell icon in `Header` (`testID="header-notification-center-button"`).
3. **Expected Outcome**:
   - `NotificationCenterModal` opens immediately.
   - All 3 notifications are listed in chronological order with title, body, and timestamp.
   - Tapping "Marcar todo como leído" updates `isRead = 1` and resets the unread badge to 0.
   - Tapping "Limpiar historial" empties the list and displays the empty state message.

---

### Scenario 5: User Settings Toggle (P3 - User Story 4)

**Goal**: Verify that users can toggle "Mute in Match Mode" or "Mute in App" and settings persist across restarts.

1. **Setup**:
   - Open Notification Settings modal.
2. **Action**:
   - Toggle "Silenciar en la app" to OFF (`muteInApp = false`).
   - Close modal and restart/reload store via `loadSettings()`.
3. **Expected Outcome**:
   - Settings row in SQLite persists `mute_in_app = 0`.
   - Subsequent incoming notifications in general foreground allow visual alerts, while active match mode continues to suppress popups.

---

## 3. Automated Test Execution

Execute the full Jest test suite verifying evaluator logic, store actions, SQLite persistence, and UI components:

```bash
# Run all notification tests
npx jest src/features/notifications

# Verify whole test suite passes without regression
npm test
```
