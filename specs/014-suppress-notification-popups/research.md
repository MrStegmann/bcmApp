# Phase 0 Research: Suppress Notification Popups

**Feature**: `014-suppress-notification-popups`  
**Date**: 2026-10-25  
**Status**: Completed  

## 1. Foreground Notification Suppression Mechanism

### Context & Problem
Mobile operating systems (iOS and Android) display visual heads-up banners or popups when push or local notifications arrive. The user requirement mandates that while the user is actively using the application—and especially during a live basketball match—incoming visual notification popups MUST NOT obstruct the screen or disrupt user focus. When the app is backgrounded or the screen is locked, standard system notification delivery must resume as normal.

### Research Findings & Technical Choices
- **Expo Notifications Architecture**: In the Expo ecosystem, incoming notification display in the foreground is controlled via `Notifications.setNotificationHandler`. This handler is invoked whenever a notification arrives while the app is in foreground. The handler returns:
  ```ts
  {
    shouldShowAlert: boolean, // controls visual heads-up banner popup
    shouldPlaySound: boolean, // controls audible chime
    shouldSetBadge: boolean,  // controls app icon badge
  }
  ```
- Setting `shouldShowAlert: false` prevents any popup banner from overlaying the user interface.
- Setting `shouldPlaySound: false` prevents abrupt acoustic interruption during tense game moments.
- Concurrently, `Notifications.addNotificationReceivedListener` captures the notification payload so that it is routed into the local notification inbox without losing metadata.
- **Adaptive Service Architecture**: Since local testing, Jest environments, and devices running standalone test builds need deterministic suppression without requiring external APNS/FCM network triggers, we define an internal `NotificationManager` abstraction:
  - Supports pluggable notification providers (Expo Notifications when available, plus in-app/simulated notifications for testing and internal broadcasts).
  - Centralizes the suppression decision evaluator:
    ```ts
    shouldSuppress(context: { appState: AppStateStatus; isMatchActive: boolean; settings: NotificationSettings }): boolean
    ```

### Decision
Implement an adaptive `NotificationManager` in `src/features/notifications/services/` that configures Expo's notification handler dynamically based on the current evaluation state, while providing a listener that automatically logs suppressed notifications to the Drizzle SQLite repository.

### Rationale
- Decouples notification interception from UI presentation.
- Guarantees 100% testability with Jest without native device mocks.
- Allows instant reactivity when `AppState` changes or when an active match starts or ends.

### Alternatives Considered
- **Direct OS Do Not Disturb (DND) mode manipulation**: Requires dangerous system-level permissions, invasive user configuration, and is prohibited on iOS sandbox without special MDM entitlements. Rejected.
- **Custom Native Android Channels only**: Inflexible across iOS and Android, breaks Expo managed workflow, and does not provide uniform in-app history capture. Rejected.

---

## 2. Real-Time App Lifecycle & Match Mode Tracking

### Context & Problem
Suppression must instantaneously activate when the app enters the foreground (`'active'`) and when a match is started, and must deactivate when the app enters the background or the match concludes.

### Research Findings & Technical Choices
- **App Lifecycle Detection**: React Native provides the native `AppState` API:
  ```ts
  import { AppState, AppStateStatus } from "react-native";
  ```
  `AppState.addEventListener("change", (nextState: AppStateStatus) => ...)` reliably triggers whenever the app transitions between `"active"`, `"background"`, and `"inactive"`.
- **Match Mode Tracking**: The application already uses `usePlayMatchStore` (`src/features/play-match/store/usePlayMatchStore.ts`) to manage live matches. A match is active when `matchId > 0` and the `PlayMatch` view is mounted.
- When `PlayMatch` mounts, it can signal match activation via `useNotificationStore.getState().setMatchActive(true, match.id)`. On unmount or match finalization (`handleFinishMatch`), it signals `setMatchActive(false)`.

### Decision
Create a lightweight Zustand store `useNotificationStore` that maintains:
- `appState: AppStateStatus`
- `isMatchActive: boolean`
- `activeMatchId: number | null`
- `unreadCount: number`
- `settings: NotificationSettings`

A hook `useNotificationLifecycle` mounted at the top-level (in `App.tsx` or `ClubManage.tsx`) subscribes to `AppState` changes and keeps the store updated in real time.

### Rationale
- Zustand store state is synchronously readable (`useNotificationStore.getState()`) by the notification handler without triggering unnecessary re-renders.
- Latency between lifecycle/match transitions is under 5ms, well within the 500ms requirement (SC-004).

---

## 3. Local Persistence with Drizzle ORM & Expo SQLite

### Context & Problem
Suppressed notifications must never be lost (SC-003: 0% message loss). They must be persisted locally in SQLite along with timestamps, payload data, and read status. Suppression settings must also persist across application restarts (FR-010).

### Research Findings & Technical Choices
- Constitution Principle III mandates type-safe persistence using Drizzle ORM and `expo-sqlite`.
- We define two tables in Drizzle SQLite:
  1. `notifications`:
     - `id`: integer primary key auto-increment
     - `external_id`: text (optional UUID/remote notification ID)
     - `title`: text not null
     - `body`: text not null
     - `data_json`: text (JSON string of custom attributes)
     - `received_at`: text not null ISO string
     - `is_read`: integer not null default 0 (boolean flag)
     - `suppressed_reason`: text not null ('foreground' | 'match' | 'none')
  2. `notification_settings`:
     - `id`: integer primary key default 1 (singleton configuration row)
     - `mute_in_app`: integer not null default 1 (boolean: true)
     - `mute_in_match`: integer not null default 1 (boolean: true)
     - `sound_enabled`: integer not null default 0 (boolean: false during suppression)
     - `updated_at`: text not null ISO string

### Decision
Define schemas in `src/features/notifications/db/schema.ts` (and expose via `src/db/schema.ts` and `initDatabase()`). Implement repository functions:
- `saveNotification(record)`
- `getNotifications(limit, offset)`
- `markNotificationAsRead(id)`
- `markAllNotificationsAsRead()`
- `clearAllNotifications()`
- `getNotificationSettings()`
- `updateNotificationSettings(settings)`

### Rationale
- Adheres strictly to Principle III (Drizzle type inference `$inferSelect`, `$inferInsert`).
- Fully local and offline-first; survives app restarts and crashes.

---

## 4. In-App Notification Center & Settings UI

### Context & Problem
Users whose notifications were suppressed need a frictionless way to review messages in 2 taps or fewer (SC-006) and configure suppression preferences (US4).

### Research Findings & Technical Choices
- `Header.tsx` currently provides header actions and can host a Notification Center icon with an unread badge.
- A modal component `NotificationCenterModal` presents:
  - Unread badge counter.
  - Chronological list of notifications with title, body, and timestamp.
  - "Marcar todo como leído" (Mark all as read) and "Limpiar historial" (Clear history) actions.
  - Friendly empty state when no notifications exist.
  - Fast gear button to open `NotificationSettingsModal` containing toggles for:
    - "Silenciar mientras la app está abierta" (Mute in foreground).
    - "Silenciar durante partidos en vivo" (Mute during live match).
- Styled using NativeWind utility classes (`className`) adhering to Constitution Principle V.

### Decision
Expose `NotificationCenterButton`, `NotificationCenterModal`, and `NotificationSettingsModal` from `src/features/notifications/components/`.

---

## 5. Summary of Architecture Decisions

| Area | Decision | Constitution / Spec Reference |
|------|----------|-------------------------------|
| **Feature Structure** | `src/features/notifications/` with `index.ts` public exports | Principle II (Feature-Based Architecture) |
| **Suppression Handler** | Pluggable `NotificationManager` with dynamic rules evaluator | FR-004, FR-005, SC-001, SC-002 |
| **State Layer** | `useNotificationStore` (Zustand) tracking app state & match focus | Principle IV (Predictable State Management) |
| **Persistence Layer** | Drizzle ORM schemas `notifications` and `notification_settings` in SQLite | Principle III (Drizzle & expo-sqlite) |
| **Styling** | NativeWind utility classes (`className`) | Principle V (NativeWind Utility-First) |
| **Testing** | 100% Jest unit & RNTL component tests before implementation | Principle I (TDD First) |
