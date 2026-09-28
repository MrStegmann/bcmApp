# Feature Specification: Refactor Club Manager View Page

**Feature Directory**: `specs/002-club-manager-view`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "Refactor the ClubManage.tsx Page to adapt it to best practice and better performance. ClubManage.tsx is the entry point of the application and show the list of teams created, at this point the user must be able to create, edit, delete or entry to the dashboard of the team selected."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Team Selection & Dashboard Entry (Priority: P1)

As a coach or club administrator, I want to view all registered teams on the main manager page and select a team so that I can enter its active management context and access roster, games, and trainings.

**Why this priority**: Selecting a team is the primary entry flow of the application. Without team selection, no other club features (roster, box scores, attendance, fees) can be accessed.

**Independent Test**: Can be tested by rendering `ClubManage` with existing teams in state, clicking on a team card, and verifying that `ClubStore.currentTeam` is set and the active club dashboard view displays.

**Acceptance Scenarios**:

1. **Given** one or more teams exist in local database, **When** the user opens `ClubManage`, **Then** all teams are displayed in a responsive, smooth card grid with team names and categories.
2. **Given** the team list is displayed, **When** the user taps a team card, **Then** that team becomes the active team in `ClubStore` and the view transitions to the selected team's dashboard.
3. **Given** no teams exist in the system, **When** the user opens `ClubManage`, **Then** an friendly empty state prompt is displayed inviting the user to create their first team.

---

### User Story 2 - Team Creation & Editing (Priority: P2)

As a club administrator, I want to create new teams or edit existing team names and categories so that I can keep team organization details accurate and current.

**Why this priority**: Users need to add new teams for new seasons or edit existing team information when categories or names change.

**Independent Test**: Can be tested by filling out `ClubForm` with valid data, submitting, and verifying that the database and `ClubStore.teamsList` immediately reflect the new/updated team.

**Acceptance Scenarios**:

1. **Given** the user is on `ClubManage`, **When** they tap the "Añadir Equipo" button, **Then** the `ClubForm` is presented cleanly.
2. **Given** the `ClubForm` is open, **When** the user enters a valid team name and category and submits, **Then** the new team is created in SQLite, added to `ClubStore`, and shown in the team list.
3. **Given** an existing team card, **When** the user taps the edit action, **Then** the form opens populated with current team data, and submitting updates the team details in local storage.
4. **Given** the form is active, **When** the user submits an empty team name, **Then** an inline validation error message ("Debes introducir el nombre del club") is displayed without submitting.

---

### User Story 3 - Team Deletion & Confirmation (Priority: P3)

As a club administrator, I want to delete a team with explicit confirmation so that obsolete team records can be removed safely without accidental data loss.

**Why this priority**: Deleting a team is a destructive operation; providing confirmation prevents accidental deletion while allowing clean maintenance of old teams.

**Independent Test**: Can be tested by triggering team deletion, verifying that the `DeleteModal` appears, confirming deletion, and verifying that the team and its associated roster are removed from SQLite and store state.

**Acceptance Scenarios**:

1. **Given** a team card in the list, **When** the user taps the delete action, **Then** a confirmation modal (`DeleteModal`) appears displaying the target team's name.
2. **Given** the confirmation modal is visible, **When** the user confirms deletion, **Then** the team is removed from SQLite, associated cascading records are deleted, and the UI list updates instantly.
3. **Given** the confirmation modal is visible, **When** the user taps cancel, **Then** the modal closes and no data is modified.

---

### Edge Cases

- What happens when a user attempts to select a team while background database initialization is still loading? The component must display an accessible loading indicator and block selection until storage is ready.
- How does the system handle extremely long team names or categories? Text elements must wrap cleanly with ellipsis fallback to prevent layout breaks on small mobile screens.
- What happens if the local database write fails during team creation or deletion? An alert banner from `AlertStore` must inform the user of the error without crashing the application.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `ClubManage` MUST render a list of teams fetched from `ClubStore` using smooth, performant list scrolling.
- **FR-002**: `ClubManage` MUST provide a header action to create a new team, opening `ClubForm`.
- **FR-003**: `ClubManage` MUST validate all team input fields before executing database insertion or updates.
- **FR-004**: `ClubManage` MUST update `ClubStore.currentTeam` upon team selection and notify active menu views.
- **FR-005**: `ClubManage` MUST display a confirmation dialog (`DeleteModal`) before executing team deletion.
- **FR-006**: `ClubManage` MUST handle empty state gracefully when zero teams exist in database.
- **FR-007**: `ClubManage` MUST utilize NativeWind `className` styling adhering to project design tokens and Constitution Principle V.

### Key Entities

- **Team**: Represents a basketball team entity within the club. Key attributes: `id` (integer primary key), `name` (text, required), `category` (text, optional), `createdAt` (timestamp).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Team selection and view transition completes in under 100ms with zero UI jank or layout flash.
- **SC-002**: 100% of team CRUD interactions (Create, Read, Update, Delete) persist to Expo SQLite correctly without state desynchronization.
- **SC-003**: Zero runtime exceptions or unhandled promise rejections on empty state or network/storage lag.
- **SC-004**: `npx tsc --noEmit` checks pass with 0 errors across all related page views and components.

## Assumptions

- SQLite database connection is initialized at application startup in `App.tsx`.
- Styling follows existing Danish design tokens (`bg-danish-dark-gray`, `text-danish-white`, `border-danish-red`, `bg-danish-red`).
- State management leverages `useClubStore`, `useMenuStore`, and `useDB` hooks per Constitution Principles III and IV.
