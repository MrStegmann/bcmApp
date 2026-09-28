# Feature Specification: Bottom Menu Navigation & Routing Performance Improvement

**Feature Branch**: `003-bottom-navigation-routes`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "Change the menubar from top to bottom and improve the performance of routing between views. Inside a team layout, remove the link 'settings' and the view referred to this link. Do not remove header. Let the header show the actual view where the user is."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Bottom Menu Bar Navigation & Current View Indicator (Priority: P1) 🎯 MVP

As a coach or manager using the mobile app, I want a fixed bottom navigation bar for quick thumb-friendly tab switching and a clean top header that displays my current view title so that I always know where I am in the application.

**Why this priority**: Moving navigation to the bottom improves ergonomic reachability on mobile devices and establishing top header title feedback provides essential context.

**Independent Test**: Can be tested by navigating between views (Team Management, Roster, Matches, Training, Fees) using the bottom menu bar and verifying that the top header updates to match the active view title.

**Acceptance Scenarios**:

1. **Given** the user is on the main team selection view, **When** viewing the screen, **Then** the top header displays "Gestión de Equipos" and the bottom navigation bar is visible with main navigation actions.
2. **Given** the user is inside a team dashboard layout, **When** tapping a tab on the bottom menu bar (e.g., Plantilla / Roster, Partidos / Games, Entrenamientos / Training, Cuotas / Calendar), **Then** the view instantly switches and the top header title updates to reflect the active view (e.g., "Plantilla de Jugadores", "Partidos", "Entrenamientos", "Calendario de Cuotas").
3. **Given** the user is inside a team layout, **When** tapping the "Volver / Exit" action in the bottom menu bar, **Then** the user returns to the main team list view and the header title updates back to "Gestión de Equipos".

---

### User Story 2 - Removal of Team Settings View & Streamlined Team Layout (Priority: P2)

As a coach or administrator, I want a simplified team layout with unused "Editar Equipo / Settings" links and views removed so that navigation is streamlined around core daily team management operations.

**Why this priority**: Eliminates redundant/unneeded screens to simplify the UI structure and prevent navigation bloat inside the active team view.

**Independent Test**: Can be tested by entering a team layout and confirming that "Editar Equipo / Settings" option is completely absent from navigation and cannot be accessed.

**Acceptance Scenarios**:

1. **Given** a team is selected and loaded in the team dashboard layout, **When** examining the available navigation tabs in the bottom menu bar, **Then** the "Editar Equipo / Settings" item is not present.
2. **Given** the user navigates through team views (Roster, Matches, Trainings, Fees), **When** cycling through all tabs, **Then** no settings form view is rendered or accessible within the team layout flow.

---

### User Story 3 - High-Performance View Routing & Transition State (Priority: P3)

As a user navigating through team features, I want view transitions between tabs to be instantaneous (<100ms) without screen flickering or unnecessary component re-mount delays.

**Why this priority**: Smooth, high-performance tab switching enhances application responsiveness and perceived user speed.

**Independent Test**: Can be tested by rapidly switching between Roster, Matches, Training, and Calendar tabs and verifying smooth <100ms view rendering without blank screen loading states.

**Acceptance Scenarios**:

1. **Given** the user is inside a team layout, **When** tapping rapidly between different tabs on the bottom navigation bar, **Then** view content updates immediately without layout shifts or noticeable render lag.
2. **Given** active tab state is changed, **When** switching tabs back and forth, **Then** tab state and list views preserve scroll position or render cached view state efficiently.

---

### Edge Cases

- What happens when a user switches tabs while an async data fetch (e.g., loading matches or players) is in progress? The app must maintain stable bottom bar state and cleanly switch view context without locking the UI.
- What happens on small screen sizes or high font scaling? Bottom menu bar items must remain properly aligned, readable, and touchable with sufficient touch targets (≥44px height).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the primary menu navigation bar fixed at the bottom of the screen viewport across mobile views.
- **FR-002**: System MUST retain the top Header component strictly as a visual location indicator displaying the current active view title (e.g., "Gestión de Equipos", "Plantilla de Jugadores", "Partidos", "Entrenamientos", "Calendario de Cuotas").
- **FR-003**: System MUST remove the "Editar Equipo" (Settings) menu item and its corresponding view implementation from the team layout navigation.
- **FR-004**: System MUST include the following core navigation items in the team layout bottom menu bar:
  - **Plantilla** (Roster)
  - **Partidos** (Games)
  - **Entrenamientos** (Trainings)
  - **Cuotas** (Fee Calendar)
  - **Volver** (Return to Team List)
- **FR-005**: System MUST perform tab view transitions efficiently with instant visual feedback upon bottom bar selection.
- **FR-006**: System MUST ensure bottom navigation bar elements maintain high contrast, clear icon/label indicators, and appropriate active state highlighting.

### Key Entities

- **Navigation Tab**: Represents a view route option containing `id`, `name` (title), `icon`, and `onPress` callback handler.
- **View Location Context**: Represents current active screen metadata containing the active view title string displayed in the top Header.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: View transitions between bottom menu tabs execute in under 100 milliseconds without UI lag or flicker.
- **SC-002**: 100% of user views display an accurate top header title matching the current active screen context.
- **SC-003**: "Editar Equipo / Settings" link and view are 100% removed from the team layout navigation hierarchy.
- **SC-004**: Bottom navigation bar touch targets meet standard accessibility guidelines (minimum 44x44px touch region).

## Assumptions

- The top Header will remain at the top of the viewport to display current screen context, while action buttons move to the bottom navigation bar.
- Team editing capabilities (if needed in future releases) will be managed at the team list level rather than inside the active team operational layout.
- The existing Zustand store (`useMenuStore`) can be repurposed/enhanced to supply bottom navigation bar tab definitions and active view title state.
