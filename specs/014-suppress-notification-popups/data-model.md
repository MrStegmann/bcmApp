# Data Model: Suppress Notification Popups

**Feature**: `014-suppress-notification-popups`  
**Date**: 2026-10-25  
**Status**: Completed  

## 1. Entities & Data Schema

### 1.1 Notification Record (`notifications` table)

Stores incoming notifications that were received (and potentially suppressed) while using the application.

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  externalId: text("external_id"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  dataJson: text("data_json"),
  receivedAt: text("received_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isRead: integer("is_read").notNull().default(0), // 0 = unread, 1 = read
  suppressedReason: text("suppressed_reason").notNull().default("none"), // 'foreground' | 'match' | 'none'
});
```

#### TypeScript Types (Drizzle Inference)
```typescript
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { notifications } from "./schema";

export type NotificationRecord = InferSelectModel<typeof notifications>;
export type NewNotificationRecord = InferInsertModel<typeof notifications>;

export type SuppressedReason = "foreground" | "match" | "none";

export interface NotificationPayload {
  externalId?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  suppressedReason?: SuppressedReason;
}
```

---

### 1.2 Notification Suppression Settings (`notification_settings` table)

Persists user preferences for visual and audible notification suppression. Stored as a singleton configuration row (`id = 1`).

```typescript
export const notificationSettings = sqliteTable("notification_settings", {
  id: integer("id").primaryKey().default(1),
  muteInApp: integer("mute_in_app").notNull().default(1),       // 1 = true (default enabled)
  muteInMatch: integer("mute_in_match").notNull().default(1),   // 1 = true (default enabled)
  soundEnabled: integer("sound_enabled").notNull().default(0), // 0 = false (silent during suppression)
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
```

#### TypeScript Types
```typescript
export type NotificationSettingsRecord = InferSelectModel<typeof notificationSettings>;
export type NewNotificationSettingsRecord = InferInsertModel<typeof notificationSettings>;

export interface NotificationSettings {
  muteInApp: boolean;
  muteInMatch: boolean;
  soundEnabled: boolean;
  updatedAt?: string;
}
```

---

### 1.3 In-Memory State Models (Zustand Store)

Tracks real-time ephemeral state: app lifecycle, active match status, cached settings, and unread notification counter.

```typescript
import { AppStateStatus } from "react-native";

export interface NotificationStoreState {
  // Ephemeral lifecycle & context
  appState: AppStateStatus;
  isMatchActive: boolean;
  activeMatchId: number | null;

  // Cached settings
  settings: NotificationSettings;
  isSettingsLoaded: boolean;

  // Inbox cache & counters
  unreadCount: number;
  recentNotifications: NotificationRecord[];

  // Actions
  setAppState: (state: AppStateStatus) => void;
  setMatchActive: (active: boolean, matchId?: number | null) => void;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;
  addReceivedNotification: (payload: NotificationPayload) => Promise<NotificationRecord>;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
}
```

---

## 2. Validation Rules & Constraints

| Field / State | Rule | Action on Violation |
|---|---|---|
| `notifications.title` | Required, non-empty string (trimmed length >= 1) | Fallback to `"Notificación"` |
| `notifications.body` | Required string | Fallback to empty string `""` |
| `notifications.isRead` | Must be `0` or `1` | Coerced to `0` or `1` via `Boolean(isRead) ? 1 : 0` |
| `notifications.suppressedReason` | Must be one of `'foreground'`, `'match'`, `'none'` | Default to `'foreground'` if suppressed |
| `notification_settings.id` | Singleton ID = 1 | Upsert using `INSERT OR REPLACE` or check-then-update |
| `muteInApp` / `muteInMatch` | Boolean values | Stored as integer 1 (true) or 0 (false) |
| Active Match ID | When `isMatchActive` is true, `activeMatchId` must be a valid positive integer | Set to `null` if match inactive |

---

## 3. State Transitions

### 3.1 Notification Lifecycle
```
[ Incoming Notification ]
           │
           ▼
[ Evaluator: shouldSuppress() ]
    ├── True  ──► Set shouldShowAlert=false ──► Suppressed popup
    │                                                   │
    └── False ──► Set shouldShowAlert=true  ──► System popup shown
                                                        │
                                                        ▼
                                       [ Persist in SQLite (isRead=0) ]
                                                        │
                                                        ▼
                                         [ User Views in Notification Center ]
                                                        │
                                                        ▼
                                             [ Mark as Read (isRead=1) ]
                                                        │
                                                        ▼
                                             [ Clear All / Dismissed ]
```

### 3.2 Suppression Evaluation State Matrix

The suppression decision function `shouldSuppressNotification(context)` evaluates the following deterministic truth table:

| AppState | Match Active | `muteInApp` | `muteInMatch` | Visual Popup Banner (`shouldShowAlert`) | Suppressed Reason |
|---|---|---|---|---|---|
| `"active"` (foreground) | No (`false`) | `true` | Any | **FALSE (Suppressed)** | `'foreground'` |
| `"active"` (foreground) | Yes (`true`) | Any | `true` | **FALSE (Suppressed)** | `'match'` |
| `"active"` (foreground) | Yes (`true`) | `false` | `false` | **TRUE (Permitted)** | `'none'` |
| `"active"` (foreground) | No (`false`) | `false` | Any | **TRUE (Permitted)** | `'none'` |
| `"background"` / `"inactive"` | Any | Any | Any | **TRUE (Permitted by OS)** | `'none'` |

*Note*: When the app is in the background or device locked, the OS manages banner presentation natively per FR-008.
