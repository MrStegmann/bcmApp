# Feature Specification: Navbar Icons, Go Back Button & Residual Cleanup

**Feature Branch**: `005-navbar-icons-and-back-button`

**Created**: 2026-09-28 (Updated: 2026-09-28)

**Status**: Ready for Planning

**Input**: User description: "The task is to modify the actual visuality of the navbar: it is showing the Link name below the icon and the Home Option is at the end of the navbar's link before Go Back. Remove te text from the Links of the navbar and set \"Home\" as the first element of the navbar (left first). In addition, you shall add to the header a \"Go Back\" button to return from the forms view and details views. Modify Spec 005: Header style: Make the header corners a straight line (remove rounded corners). Calendar and Fees: Remove all residual Calendar and Fees data and components."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Icon-Only Navbar with Home as First Item (Priority: P1)

Users navigating through the application see a clean, streamlined bottom navigation bar that displays only icons without text labels underneath. The "Home" (Inicio) navigation option is positioned as the very first item on the far left of the navbar, providing immediate access to the main team overview dashboard before the section-specific tabs.

**Why this priority**: Solves core navigation ergonomics, removes visual clutter from overflowing text labels across varying mobile viewports, and anchors the primary dashboard navigation on the left.

**Independent Test**: Can be tested by launching the team profile screen and inspecting the bottom navigation bar to verify that:
1. No text labels appear beneath any navigation icons.
2. The "Home" item is the first button from the left, followed by Plantilla (Players), Partidos (Games), Entrenamientos (Trainings), and Volver (Exit/Back).
3. Clicking the Home icon navigates directly to the team overview view.

**Acceptance Scenarios**:

1. **Given** the user is inside a club/team profile, **When** the bottom navigation bar is rendered, **Then** all navigation items display exclusively their icons with no visible text labels.
2. **Given** the user is on the team profile screen, **When** examining the bottom navigation bar order from left to right, **Then** the first item is the Home icon, followed by Plantilla (Players), Partidos (Games), Entrenamientos (Trainings), and Volver (Exit/Back).
3. **Given** the user is on a sub-view (e.g., Players, Games, or Trainings list), **When** the user taps the Home icon, **Then** the app navigates back to the main team overview layout.

---

### User Story 2 - Header "Go Back" Button for Form Views (Priority: P2)

When a user opens a creation or edition form (such as adding/editing a player, creating/editing a match, or creating/editing a training session), a prominent "Go Back" button is visible on the header's left side. Tapping this button cancels/exits the form and returns the user to the respective list view.

**Why this priority**: Essential UX capability preventing users from getting stuck in form views and providing a clear, standard top-navigation back button in the header.

**Independent Test**: Open the player, match, or training creation/edit form and verify the header displays a functional back button on the left that returns to the corresponding list view when tapped.

**Acceptance Scenarios**:

1. **Given** the user is in any create or edit form view (PlayerForm, GameForm, TrainingForm), **When** looking at the header, **Then** a visible "Go Back" button is displayed on the left side of the header.
2. **Given** the user is on an active form view, **When** the user clicks the "Go Back" button in the header, **Then** the form is closed and the user is navigated back to the respective section's list view.
3. **Given** the user returns to the list view from a form, **When** the list view is active, **Then** the header's left "Go Back" button is hidden (or replaced with a spacing placeholder).

---

### User Story 3 - Header "Go Back" Button for Detail Views (Priority: P3)

When a user inspects the details of a specific item (e.g., PlayerDetail, GameDetail, TrainingDetail), the header displays a "Go Back" button on the left. Clicking the button dismisses the detail view and returns the user to the main list.

**Why this priority**: Completes header navigation symmetry across all secondary screens so users have a consistent return action in the top header.

**Independent Test**: Open any detail view (PlayerDetail, GameDetail, TrainingDetail) and tap the header's "Go Back" button to verify returning to the item list.

**Acceptance Scenarios**:

1. **Given** the user is viewing a detail screen (PlayerDetail, GameDetail, TrainingDetail), **When** looking at the header, **Then** the "Go Back" button is visibly present on the left side.
2. **Given** the user is on a detail screen, **When** the user clicks the "Go Back" button in the header, **Then** the detail screen is closed and the parent list view is displayed.

---

### User Story 4 - Straight-Edged Header Visual Styling (Priority: P4)

The application header presents a sleek, modern visual aesthetic with straight bottom corners, replacing the previously rounded bottom corners (`rounded-b-3xl`). The bottom edge forms a clean, straight horizontal boundary across the full viewport width.

**Why this priority**: Aligns the mobile design system with a clean, professional look and consistent edge alignment with screen boundaries.

**Independent Test**: Inspect the header element across all screens and verify that the bottom border forms a straight horizontal line without rounded curvature.

**Acceptance Scenarios**:

1. **Given** any screen rendering the Header component, **When** the header is displayed, **Then** its bottom corners are square/straight (no bottom border radius) with a crisp horizontal bottom border.
2. **Given** the header on varying device screen widths, **When** rendered, **Then** the straight horizontal edge extends seamlessly across the entire width.

---

### User Story 5 - Complete Elimination of Residual Calendar & Fees Data and Components (Priority: P5)

All remaining references, database tables, stores, hooks, UI components, types, and descriptive texts related to the deprecated Calendar and Fees features are cleanly removed from the codebase.

**Why this priority**: Eliminates dead code, reduces bundle weight, simplifies database migrations and stores, and avoids user confusion from stale references (such as "cuotas" in helper texts).

**Independent Test**: Search the entire codebase for deprecated fees and calendar references to verify zero orphaned components, unused database schemas, or leftover UI texts exist, and verify full test suite passes.

**Acceptance Scenarios**:

1. **Given** the codebase repository, **When** checking files, **Then** unused `Calendar.tsx` and `FeesStore.ts` are removed.
2. **Given** the database schema and initialization, **When** tables are defined and seeded, **Then** the `fees` table and fee-related seed/controllers/hooks are completely pruned without affecting teams, players, games, or trainings.
3. **Given** the UI views (such as ClubProfile instructions and PlayerDetail), **When** viewed, **Then** all residual text mentioning "cuotas" or calendar options are removed.

---

### Edge Cases

- **No Back Target on Root Screen**: When the user is on the main team overview or root list without an open form/detail, the header must not show a back button on the left (or only show standard spacing) to avoid accidental exits.
- **Concurrent Header Action and Back Button**: When a screen has both a back action (left) and an add action (right), the header title remains centered and both buttons operate independently without overlapping text.
- **Accessibility & Hit Areas**: Since text labels are removed from the navbar, all icon buttons must retain touch targets (minimum 44x44 points) and accessibility labels/hints.
- **State Cleanup on Unmount**: When navigating away from a form or detail view by tapping another navbar tab, any active header back button state is cleanly reset.
- **Database Schema Cleanliness**: Removing the fees table from local schema must not disrupt existing queries or foreign key cascades for remaining tables (clubs, teams, players, games, trainings).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The bottom navigation bar MUST NOT render text labels beneath icons for any navigation item.
- **FR-002**: The bottom navigation bar items MUST be ordered from left to right as: Home (`MAIN`), Plantilla (`PLAYERS`), Partidos (`GAMES`), Entrenamientos (`TRAININGS`), and Volver (`GO_BACK`).
- **FR-003**: The Home navigation item MUST navigate the user to the main team overview screen (`TopMenuEnums.MAIN`) upon click.
- **FR-004**: The header component MUST support rendering a functional "Go Back" button on its left side.
- **FR-005**: When an active form view (create or edit) is displayed in Players, Games, or Trainings, the header MUST render the "Go Back" button configured to dismiss the form and return to the list view.
- **FR-006**: When an active detail view is displayed in Players, Games, or Trainings, the header MUST render the "Go Back" button configured to dismiss the detail view and return to the list view.
- **FR-007**: When no sub-view (form or detail) is active, the header's left region MUST maintain balanced spacing without triggering unexpected navigation.
- **FR-008**: Tapping the header's "Go Back" button MUST execute the configured back callback immediately without crashing or desynchronizing state.
- **FR-009**: The Header container MUST use straight bottom corners (no bottom border radius) across all views.
- **FR-010**: All residual Calendar components (`Calendar.tsx`), Fees stores (`FeesStore.ts`), fee database tables/schemas/seeders, and fee database controllers MUST be completely deleted from the codebase.
- **FR-011**: All residual UI texts mentioning "cuotas" or calendar options in ClubProfile and other views MUST be updated or removed.
- **FR-012**: All database and UI test suites MUST be updated to reflect the cleaned schema with 100% test pass rate.

### Key Entities

- **BottomMenuItem**: Represents an icon-only button rendered in the bottom navigation bar, containing icon family, icon name, target action callback, active state indicator, and accessibility label.
- **HeaderBackAction**: Represents the back navigation configuration in the global menu state (or header props), including callback action, icon representation, and test identifier.
- **HeaderLayout**: Clean straight-edged header top component hosting left back action, center title, and right primary action.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of bottom navigation items render exclusively as icons without text labels across all mobile screen sizes.
- **SC-002**: 100% of form and detail views in Players, Games, and Trainings display a functioning "Go Back" button in the header.
- **SC-003**: The header component renders with 0px bottom border radius (straight corners) across 100% of views.
- **SC-004**: 0 references to deprecated `Calendar.tsx`, `FeesStore.ts`, or `fees` table remain in active application code.
- **SC-005**: 100% of automated unit tests in Jest pass with full TypeScript type check compliance (`tsc --noEmit` with 0 errors).

## Assumptions

- Removing text labels from the navbar applies universally to all tabs inside the bottom navigation component.
- The "Home" icon represents the team overview dashboard where general team summary and category information are displayed.
- The "Go Back" button in the header is positioned on the top-left, while action buttons (e.g., "+" Add) remain on the top-right.
- Native icons from `@expo/vector-icons` (such as `Feather`, `Entypo`, `Ionicons`, `MaterialIcons`, `FontAwesome5`) will continue to be used.
