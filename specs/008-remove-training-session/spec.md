# Feature Specification: Remove Training Session

**Feature Branch**: `008-remove-training-session`

**Created**: 2026-10-22

**Status**: Draft

**Input**: User description: "The task is remove from the application the view of Training session, Training List, and the Database of the training sessión. No reference, or orphan data of the traning session shall be in the application."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Streamlined Navigation and Removal of Training Views (Priority: P1)

As a club manager or coach, I want the application navigation and user interface to be completely free of training session elements, so that my workflow focuses exclusively on team rosters, players, and match management without encountering obsolete or non-functional screens.

**Why this priority**: Ensuring users do not see, click, or land on removed or deprecated screens is the primary user-facing goal of this feature.

**Independent Test**: Can be tested independently by navigating through all primary navigation menus, tabs, club management screens, and player profiles, verifying that zero buttons, cards, list items, or links to training sessions are visible or accessible.

**Acceptance Scenarios**:

1. **Given** a user navigating the application's primary menu and navigation bars, **When** reviewing the available destinations, **Then** no navigation tab, menu item, or shortcut for "Trainings" or "Training Sessions" exists.
2. **Given** a user viewing a team dashboard or club manager screen, **When** inspecting available management sections, **Then** only active sections (such as Teams, Players, and Matches) are displayed and no training summary or training list card appears.
3. **Given** a user viewing an individual player profile, **When** reviewing player details and activity history, **Then** no training attendance metrics, training notes, or training list entries appear.
4. **Given** an attempt to navigate directly to a previously registered training view or link, **When** the navigation action is evaluated, **Then** the application safely directs the user to the main dashboard without displaying a blank screen or generating an error.

---

### User Story 2 - Complete Data Purge and Data Store Sanitization (Priority: P1)

As an application maintainer and user, I want all persistent data storage and records dedicated to training sessions and attendance to be permanently removed from the application data store upon update, so that device storage is reclaimed and existing team and player records remain clean with zero orphan links.

**Why this priority**: Complete removal of underlying training structures guarantees that no stale, dangling, or corrupting data fragments remain in local storage, preserving total data integrity for teams and players.

**Independent Test**: Can be tested independently by launching the updated application with a pre-populated data store and verifying that training entities and attendance records are permanently purged, while all teams, players, match statistics, and game records remain fully intact and operational.

**Acceptance Scenarios**:

1. **Given** an existing application installation with historical training data, **When** the updated application launches, **Then** all stored training session records and training attendance logs are permanently deleted.
2. **Given** teams and players that previously had linked training sessions, **When** inspecting those teams and players after the update, **Then** all team information, roster memberships, and player profiles are fully preserved without integrity errors.
3. **Given** existing match records and in-game statistics, **When** querying or displaying match data, **Then** all match summaries, player stats, and scoring records remain completely unaffected.
4. **Given** the sanitized data store, **When** creating, editing, or deleting teams and players, **Then** all standard operations proceed smoothly without triggering any integrity or dangling reference errors.

---

### User Story 3 - Elimination of Runtime State and Background Overhead (Priority: P2)

As an end user, I want the application runtime to operate without initializing, caching, or monitoring training session states, so that device memory and battery consumption are minimized and app responsiveness is maximized.

**Why this priority**: Removing unnecessary state slices and background data listeners prevents memory leaks and ensures lean runtime operation.

**Independent Test**: Can be tested independently by observing state transitions across application views and verifying that no training data structures or observers are loaded into memory.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** switching active teams or browsing rosters, **Then** the application state contains only active domain data with zero state management resources allocated to trainings.
2. **Given** a user carrying out match or roster actions, **When** updates are processed, **Then** no side-effects or event notifications related to training sessions are dispatched.

---

### Edge Cases

- **Existing Stored Data Migration**: When an existing user upgrades an installation that contains populated training records, the data store initialization must safely drop or clean those records without interrupting or invalidating existing team or player identities.
- **Direct Link / Deep Route Handling**: If the application receives a navigation request directed to a deprecated training view (e.g., from an external shortcut or residual cached route), it must fall back gracefully to the primary overview screen rather than crashing or freezing.
- **Player Creation & Team Deletion Lifecycle**: Deleting a team or player must continue to function cleanly with cascading deletions affecting only remaining valid relationships (e.g., matches and match statistics), with no failures resulting from missing training tables.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST remove all user interface views, forms, list components, and detail cards related to training sessions and training attendance.
- **FR-002**: The system MUST remove all navigation controls, menu items, header action buttons, and bottom navigation tabs that reference training sessions.
- **FR-003**: The system MUST safely handle deprecated route requests by redirecting to the default home screen or club overview screen without crashing.
- **FR-004**: The system MUST permanently remove all training session and training participant/attendance data collections from local persistent storage.
- **FR-005**: The system MUST ensure that dropping training records does NOT alter, corrupt, or delete any team records, player records, game records, or match statistics.
- **FR-006**: The system MUST eliminate all runtime application state stores, data hooks, and event handlers dedicated to training sessions.
- **FR-007**: The system MUST preserve 100% of existing functionality across all remaining operational domains (Teams, Players, Matches, and Live Match Play).

### Key Entities

- **Training Session (Removed)**: Formerly represented scheduled team practice sessions, including date, session sequence, warmup drills, core exercises, and cooldown notes. Completely removed from the system domain.
- **Training Participant / Attendance (Removed)**: Formerly represented player participation records linked to specific training sessions, including attendance status and player notes. Completely removed from the system domain.
- **Team (Retained)**: Represents sports teams. All linkages to former training sessions are severed; roster memberships, team metadata, and match associations remain fully intact.
- **Player (Retained)**: Represents team athletes. All linkages to former training attendance records are severed; profiles, numbers, positions, and game statistics remain fully intact.
- **Game / Match (Retained)**: Represents competitive basketball games and associated live statistics. Completely unaffected by the removal of training sessions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of user-facing screens, navigation menus, and dialogs are free of training session controls, labels, and entry points.
- **SC-002**: Persistent local storage contains zero training session or attendance data records following application startup.
- **SC-003**: 100% of existing team profiles, player rosters, and match records remain fully preserved and operational with zero broken relationships.
- **SC-004**: Zero application crashes, unresponsive screens, or unhandled navigation errors occur across all user journeys following the removal.
- **SC-005**: All automated verification test suites for the application pass with 100% success rate with training-specific tests removed and updated.

## Assumptions

- Users of the application no longer require training session planning, drill logging, or practice attendance tracking within this application.
- Historical training session data does not require export, archival, or conversion into other formats prior to deletion.
- Remaining feature workflows (Team Management, Player Rosters, Match Scheduling, and Live Match Play) are fully independent of training sessions and require no behavioral adjustments other than removing navigation touchpoints to trainings.
