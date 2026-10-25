# Feature Specification: Suppress Notification Popups

**Feature Branch**: `014-suppress-notification-popups`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "The task is to avoid opups mobile notification during the use of the application. To avoid the user friction while is using the application, and, overall, during a match, the notification can frustrate the user experience. We NEED to avoid the notification popups when the user is using the application."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Distraction-Free Active Match Experience (Priority: P1)

As a coach, scorekeeper, or team manager actively tracking a live basketball match, I want incoming notification popups and visual banners to be completely suppressed while a match is ongoing, so that my view of the court, timers, and scoring buttons is never blocked at critical game moments.

**Why this priority**: During live match tracking, momentary visual obstructions can cause missed calls, lost timing sync, or accidental mis-taps, directly ruining the core utility of the app.

**Independent Test**: Can be tested independently by launching an active match session, triggering a simulated notification, and verifying that no visual popup banner appears across the screen while the notification content is silently logged.

**Acceptance Scenarios**:

1. **Given** a user is currently engaged in an active match session, **When** any incoming notification arrives, **Then** no system or heads-up notification popup is displayed on the screen.
2. **Given** a user is actively recording game events, **When** notifications arrive in rapid succession, **Then** gameplay controls and match timers remain unobstructed and responsive with zero visual popup overlays.
3. **Given** an active match is ended or exited, **When** subsequent notifications arrive, **Then** normal notification presentation behavior resumes according to user preferences.

---

### User Story 2 - Smooth In-App Navigation Without Visual Popups (Priority: P1)

As an app user navigating teams, players, statistics, or club settings, I want visual notification popups suppressed whenever the app is actively open in the foreground, so that I can browse and manage data without intrusive banners dropping down over headers, forms, or navigation bars.

**Why this priority**: Unwanted heads-up popups while actively using an app cause frustration and accidental taps; suppressing them in the foreground provides a clean, premium user experience.

**Independent Test**: Can be tested independently by opening the app to any general screen (e.g. Home, Team Management, Player Details), sending a notification, and verifying that no visual popup banner appears over the app UI.

**Acceptance Scenarios**:

1. **Given** the user is actively using the app in the foreground, **When** a notification is received, **Then** the visual popup banner is suppressed from displaying over the active screen.
2. **Given** the user transitions the app into the background or locks the device, **When** a notification arrives, **Then** standard device notification popups and lock-screen alerts appear as normal.
3. **Given** the user brings the app back to the foreground from the background, **When** the foreground state is restored, **Then** popup suppression is immediately reactivated without delay.

---

### User Story 3 - In-App Notification Center & History (Priority: P2)

As an app user whose notification popups were suppressed while using the app or scoring a match, I want to access an in-app notification center or history log where suppressed messages are safely stored, so that I never miss important announcements, score updates, or system alerts.

**Why this priority**: Suppressing popups must not result in permanent data loss; users need peace of mind that messages can be reviewed at their convenience.

**Independent Test**: Can be tested independently by triggering notifications while in foreground/match mode, navigating to the in-app notification center, and confirming that all suppressed notifications are listed with correct details and timestamps.

**Acceptance Scenarios**:

1. **Given** one or more notifications were suppressed while using the app or scoring a match, **When** the user opens the notification center/inbox, **Then** all received notifications are visible in chronological order.
2. **Given** unread suppressed notifications exist in the inbox, **When** the user views them, **Then** they are marked as read and can be cleared or dismissed.
3. **Given** no notifications have been received, **When** the user opens the notification center, **Then** a friendly empty state message is shown.

---

### User Story 4 - Customizable Notification Suppression Settings (Priority: P3)

As a user with specific notification preferences, I want the ability to customize whether notifications are suppressed during general app use and/or specifically during live matches, so that I can tailor the distraction-free experience to my personal workflow.

**Why this priority**: Providing user settings allows flexibility for users who may still want urgent popups outside of matches or who prefer manual control over notification behavior.

**Independent Test**: Can be tested independently by opening app settings, changing the match-mode or in-app suppression toggle, and verifying that notification popup delivery respects the modified preference immediately.

**Acceptance Scenarios**:

1. **Given** the user is in app settings, **When** viewing the notification preferences section, **Then** toggles for "Mute Popups in Match Mode" and "Mute Popups While App is Open" are accessible with clear descriptions.
2. **Given** a user turns off general in-app popup suppression while keeping match-mode suppression enabled, **When** a notification arrives during regular browsing, **Then** the popup is permitted, but **When** a notification arrives during an active match, **Then** the popup remains suppressed.
3. **Given** a user changes a notification suppression setting, **When** returning to the app, **Then** the new preference is persisted across app restarts and applied immediately without requiring an app reload.

---

### Edge Cases

- **Immediate Foreground-Background Transitions**: When a user rapidly switches between the app and external apps, notification suppression rules adapt instantaneously without race conditions or missed state updates.
- **Emergency / System Broadcast Alerts**: Operating system emergency broadcasts (such as weather or civil safety alerts) bypass in-app suppression and are displayed per OS-level mandatory requirements.
- **Match Interruption or Crash Recovery**: If a match session is unexpectedly interrupted, minimized, or restored from saved state, the match-mode suppression flag accurately reflects the active session state upon resume.
- **High Volume Burst of Notifications**: If multiple notifications arrive simultaneously during a tense game sequence, all messages are captured into the in-app history without UI stutter or memory degradation.
- **Mid-Match Settings Modification**: If a user temporarily exits a match to adjust notification preferences, returning to the match immediately honors the newly saved settings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST detect when the application is active in the foreground and track the foreground/background lifecycle state in real time.
- **FR-002**: The system MUST maintain a dedicated match-mode status flag indicating whether the user is currently participating in an active live match session.
- **FR-003**: The system MUST activate the match-mode status flag upon initiating or resuming an active match, and MUST deactivate it upon completing, abandoning, or exiting the match.
- **FR-004**: The system MUST suppress visual heads-up notification popups and banners whenever the application is actively in the foreground, subject to user configuration.
- **FR-005**: The system MUST suppress visual heads-up notification popups and banners whenever match-mode status is active, subject to user configuration.
- **FR-006**: The system MUST route all suppressed notifications into a local in-app notification repository without loss of message payload or metadata.
- **FR-007**: The system MUST allow users to view, review, and clear recorded notifications within an in-app notification center or history interface.
- **FR-008**: The system MUST allow standard operating system notification popups to appear normally when the application is in the background or inactive, unless configured otherwise by system-level settings.
- **FR-009**: The system MUST provide user-configurable settings allowing users to independently toggle notification suppression for:
  - Active match sessions (default: enabled).
  - General in-app usage (default: enabled).
- **FR-010**: The system MUST persist notification suppression preferences locally so that selections survive application restarts.
- **FR-011**: The system MUST apply suppression rule changes instantaneously upon lifecycle state transitions or match state changes without perceptible lag or application restarts.

### Key Entities *(include if feature involves data)*

- **App Lifecycle State**: Represents the current operating status of the application (Foreground Active, Background, or Inactive).
- **Match Focus State**: Represents whether an active gameplay tracking session is currently in progress, including associated match identifier and session active flag.
- **Notification Record**: Represents an incoming notification message containing identifier, title, body content, timestamp, source/type, and read status.
- **Notification Suppression Preferences**: User configuration specifying whether notifications should be visually suppressed during active matches and/or during general in-app foreground usage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of incoming notification popups are suppressed from visual overlay while a match session is active with match-mode suppression enabled.
- **SC-002**: 100% of incoming notification popups are suppressed from visual overlay while the user is actively navigating the foreground application with in-app suppression enabled.
- **SC-003**: 0% loss of notification messages: 100% of suppressed notifications are recorded in the in-app notification history.
- **SC-004**: System notification popups resume normal display within 500 milliseconds of the application transitioning to the background or a match concluding.
- **SC-005**: State transitions between suppressed and normal notification modes occur seamlessly without causing UI frame drops, latency, or crashes.
- **SC-006**: Users can access their suppressed notification history in 2 taps or fewer from any primary view.

## Assumptions

- Operating system platforms (iOS and Android) support application-level control over whether foreground notifications present visual heads-up banners.
- Emergency broadcasts and critical device-level alerts managed exclusively by the OS bypass application-level suppression.
- Default settings have suppression enabled for both match mode and general in-app use to provide immediate friction-free usability out of the box.
- The in-app notification history is stored locally on the device and does not require active network connectivity to function.
