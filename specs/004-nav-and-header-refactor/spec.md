# Feature Specification: Navigation and Header Refactor

**Feature Branch**: `004-nav-and-header-refactor`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "Refact: Remove Fees, Calendar & Add button. Remove Fees and Calendar Views and navlink option. Add a Home button in the navbar that goes back to the home init page of the team layout. In addition, in each Page view (Players, Matches, Sessions) shall have an add button in the header. The header and the navbar shall have a margin (top for header, bottom for navbar) to create a secure space between the mobile system buttons and information."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Streamlined Bottom Navbar with Home Button (Priority: P1)

As a team manager or coach, I want a clean bottom navigation bar with a dedicated `Home` button and no deprecated links (Fees/Calendar) so that I can quickly return to the team overview or navigate between Plantilla, Partidos, and Entrenamientos.

**Why this priority**: Navigating between core team views and back to team overview is the primary user journey inside the team layout.

**Independent Test**: Can be tested by opening a team profile, verifying the bottom navbar contains only Plantilla, Partidos, Entrenamientos, Home (Inicio), and Volver, tapping `Home` from any section, and verifying it returns to the team main panel.

**Acceptance Scenarios**:

1. **Given** a user is viewing a team layout, **When** inspecting the bottom navbar, **Then** Fees (Cuotas) and Calendar (Calendario) options are no longer visible.
2. **Given** a user is inside the `Plantilla` (Players), `Partidos` (Matches), or `Entrenamientos` (Sessions) view, **When** tapping the `Home` (Inicio) button in the bottom navbar, **Then** the view transitions back to the team layout main panel.
3. **Given** a user is on the main team panel, **When** tapping the `Volver` button, **Then** the app returns to the team management/club list view.

---

### User Story 2 - Header Action Buttons for Creation Flows (Priority: P2)

As a team manager, I want an "Add" button in the header when viewing `Players` (Plantilla), `Matches` (Partidos), or `Sessions` (Entrenamientos) so that I can immediately create new entries from the active page view.

**Why this priority**: Streamlines data entry by placing creation triggers directly in the header banner for each active view.

**Independent Test**: Can be tested by opening `Players`, `Matches`, or `Sessions` view, observing the header "Add" button, and tapping it to open the respective creation form or trigger creation logic.

**Acceptance Scenarios**:

1. **Given** a user is in the `Players` view, **When** looking at the top header, **Then** a visible "Add" button (e.g., "+" / "Añadir") is displayed.
2. **Given** a user is in the `Matches` view, **When** looking at the top header, **Then** a visible "Add" button is displayed.
3. **Given** a user is in the `Sessions` (Trainings) view, **When** looking at the top header, **Then** a visible "Add" button is displayed.
4. **Given** a user taps the header "Add" button in any of these views, **When** tapped, **Then** the creation modal or creation view for that entity is opened.

---

### User Story 3 - Mobile Safe Area Margins (Priority: P3)

As a mobile app user, I want adequate top margin on the header and bottom margin on the navbar so that header titles/actions and navigation items do not overlap with system notch, status bar, or native device navigation bars.

**Why this priority**: Prevents visual clipping and mis-clicks on mobile devices with status bar notches or gesture bars.

**Independent Test**: Can be tested by inspecting the header and bottom navbar layouts on mobile viewports to confirm safe margin buffers from top and bottom screen edges.

**Acceptance Scenarios**:

1. **Given** the app layout renders on mobile, **When** observing the top header, **Then** a top margin/safe spacing buffer separates it from the screen top boundary.
2. **Given** the app layout renders on mobile, **When** observing the bottom navbar, **Then** a bottom margin/safe spacing buffer separates it from the screen bottom navigation area.

---

### Edge Cases

- What happens if the header "Add" button is tapped while a creation form is already open? The action button should either toggle form closure or remain contextual to the active list view.
- What happens when switching back to `Home` via the navbar? Any open sub-view state (`Players`, `Matches`, `Sessions`) resets smoothly to `MAIN`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST remove Fees (Cuotas) and Calendar (Calendario) options and components from the team bottom navbar.
- **FR-002**: The system MUST provide a `Home` (Inicio) button in the team bottom navbar.
- **FR-003**: Clicking the `Home` button MUST set the active tab state to `MAIN` and return the user to the main team overview panel.
- **FR-004**: The system MUST display an "Add" button in the top header component when the active view is `Players`, `Matches`, or `Sessions` (Entrenamientos).
- **FR-005**: Tapping the header "Add" button MUST trigger the creation flow (add player, add match, add training session) corresponding to the currently active view.
- **FR-006**: The system MUST enforce a top margin for the Header component and a bottom margin for the BottomNavBar component to provide safe area separation from system UI.

### Key Entities

- **BottomMenuItem**: Represents navigation items in `MenuStore`, updated to include `Home` and remove `Fees`/`Calendar`.
- **HeaderProps / MenuStoreState**: Stores header state including `headerTitle` and optional header action buttons (`headerAction`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Bottom navbar contains exactly 5 items for team layout (`Plantilla`, `Partidos`, `Entrenamientos`, `Home`, `Volver`) with 0 references to Fees or Calendar.
- **SC-002**: 100% of header views for `Players`, `Matches`, and `Sessions` display a functional "Add" button.
- **SC-003**: 100% of automated test suites pass cleanly with TypeScript strict mode validation.

## Assumptions

- `Sessions` corresponds to the existing `TRAININGS` view (Entrenamientos) in the codebase.
- The `Home` button icon uses an intuitive icon such as `home` (Feather/Entypo).
- Safe margins are styled using responsive Tailwind/NativeWind utility classes (`mt-safe`/`pt-2`/`mb-safe`/`pb-2`) compatible with React Native screens.
