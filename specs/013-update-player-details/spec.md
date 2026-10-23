# Feature Specification: Update Player Contract, Form, and Details

**Feature Branch**: `013-update-player-details`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "The task is to update the actual player contract to remove `notes` and `position` entries and add new string entry `jerseyName` (optional). Add to the player form the optionional field for jerseyName. In Player Detail View page it must show bellow the global stats of the player a list of the match where that player have played. Each item show the rival name, the round of the match and a button to open the match detail view page directly."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Modernized Player Profile Creation and Editing (Priority: P1)

As a team manager or coach, I want to manage player roster profiles with only relevant player details—including their first name, last name, jersey number, and an optional custom jersey name—without being prompted for obsolete fields like position or notes, so that player registration is fast, accurate, and matches our jersey customization needs.

**Why this priority**: Correct data capture at the player registration stage is foundational to every downstream feature, including roster listings, jersey rendering, and player identification.

**Independent Test**: Can be tested independently by navigating to the player creation screen, verifying that the input fields present are First Name, Last Name, Jersey Number, and an optional Jersey Name field (with position and notes completely absent), saving a player with a jersey name, editing an existing player, and confirming the persisted profile updates accurately.

**Acceptance Scenarios**:

1. **Given** a user opening the player creation form, **When** the form renders, **Then** it presents input fields for First Name, Last Name, Jersey Number, and an optional Jersey Name, with no input fields displayed for position or notes.
2. **Given** a user completing player registration, **When** the user provides First Name, Last Name, Number, and leaves Jersey Name blank, **Then** the player profile is successfully saved and the missing jersey name does not trigger any validation error.
3. **Given** a user providing a custom Jersey Name (e.g., "M. JORDAN" or "RODMAN"), **When** the form is submitted, **Then** the player profile is saved with the custom jersey name stored alongside standard profile attributes.
4. **Given** an existing player profile loaded into the edit form, **When** the edit form opens, **Then** the existing jersey name (if present) is populated into the Jersey Name input field and can be modified or cleared.

---

### User Story 2 - Player Detail View with Played Matches List (Priority: P1)

As a coach, scout, or player, I want to view a chronological list of all matches where a player has participated directly underneath their aggregated career/global statistics on their Player Detail page, displaying the opponent's name and the tournament/league round for each game, so that I can evaluate game participation history and game-by-game context.

**Why this priority**: Linking aggregate individual stats to the exact fixtures where those performances took place provides crucial tactical context and historic tracking for coaches and analysts.

**Independent Test**: Can be tested independently by opening the Player Detail view of a player with recorded match history, verifying that the global statistics card renders at the top, and checking that a list of participated matches appears directly beneath it with each item showing the rival name and match round.

**Acceptance Scenarios**:

1. **Given** a player who has participated in one or more recorded matches, **When** the user navigates to the Player Detail view, **Then** a "Played Matches" section is displayed directly below the global statistics card.
2. **Given** the list of played matches in the Player Detail view, **When** reviewing individual match entries, **Then** each entry clearly displays the opponent/rival team name and the round of the match.
3. **Given** a player who has not participated in any recorded matches, **When** viewing their Player Detail view, **Then** a friendly empty state message is displayed indicating that the player has not participated in any matches yet.
4. **Given** a player who was called up or recorded stats across multiple matches, **When** the list is displayed, **Then** matches are ordered in a clean, consistent order (e.g., most recent first or by scheduled date).

---

### User Story 3 - Direct Navigation to Match Detail View (Priority: P2)

As a coach or analyst reviewing a player's match history, I want a dedicated action button on each played match card in the Player Detail view that takes me directly to the full Match Detail view of that specific game, so that I can inspect full team statistics, quarter breakdowns, and box scores without having to manually search through the main schedule.

**Why this priority**: Direct contextual drill-down between player records and match records minimizes navigation friction and enables instant deep-dive analysis.

**Independent Test**: Can be tested independently by tapping the match action button on any match item in the played matches list, verifying that the application transitions immediately to the Match Detail view for that specific match, and verifying that returning brings the user back to the Player Detail view.

**Acceptance Scenarios**:

1. **Given** a played match entry rendered within the Player Detail view, **When** the user views the match card, **Then** a distinct interactive button or icon is available to view that match's details.
2. **Given** the user taps the match detail button on a match item, **When** pressed, **Then** the application navigates directly to the Match Detail view corresponding to that match's unique record.
3. **Given** the user is viewing the Match Detail view accessed from the player's played match list, **When** the user taps the back/return navigation action, **Then** the application smoothly returns the user to the Player Detail view without lost state.

---

### Edge Cases

- **Player with zero matches played**: When a newly registered player or a player with no match participation is viewed, the played matches list gracefully renders an informative empty state message rather than a broken layout or empty gap.
- **Player with optional Jersey Name absent**: Player cards, lists, and detail views display the player's full name gracefully when no jersey name has been set, without displaying "undefined", "null", or empty badges.
- **Match with missing or default round**: If a match was created with default or unspecified round information, the round label displays a clean fallback (e.g., "Ronda 1" or default round number) without formatting errors.
- **Extensive match participation history**: When a player has played in many games (e.g., 20+ matches), the played matches list scrolls smoothly within the Player Detail view without clipping the global statistics or exceeding screen boundaries.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST remove `notes` and `position` fields from the player contract and player data definitions.
- **FR-002**: The system MUST add an optional string field `jerseyName` to the player contract and player data definitions.
- **FR-003**: The player creation and editing forms MUST include an optional text input field for `jerseyName`.
- **FR-004**: The player creation and editing forms MUST omit input fields for `notes` and `position`.
- **FR-005**: The player form submission MUST successfully validate and persist player records with or without a `jerseyName`.
- **FR-006**: The Player Detail view MUST render a list of matches where the player has participated, situated directly beneath the global player statistics section.
- **FR-007**: Each item in the played matches list MUST display the opponent (rival) team name and the round of the match.
- **FR-008**: Each item in the played matches list MUST include a functional button or interactive element that triggers navigation directly to the corresponding Match Detail view.
- **FR-009**: The system MUST display a clear fallback message in the played matches section when the player has zero recorded match appearances.
- **FR-010**: Navigating back from the Match Detail view accessed via a player's match item MUST return the user to the Player Detail view.

### Key Entities *(include if feature involves data)*

- **Player Profile**: Represents a team athlete with attributes including First Name, Last Name, Jersey Number, and an optional Jersey Name (`jerseyName`). Obsolete attributes (`notes`, `position`) are retired.
- **Played Match Record**: Represents a specific game participation instance for a player, linking the player to a match with identifiable opponent name, match round, and match identifier for direct navigation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of player profiles can be created and updated without errors when `jerseyName` is populated or left blank.
- **SC-002**: 0 occurrences of `position` and `notes` input fields appear anywhere within the player creation and editing interface.
- **SC-003**: 100% of recorded matches where a player has participated are listed in the Player Detail view under the global statistics.
- **SC-004**: Users can navigate from any played match item in the Player Detail view to the complete Match Detail view in a single tap, loading in under 1 second.
- **SC-005**: 100% of tested user flows demonstrate that returning from the navigated Match Detail view correctly restores the user to the Player Detail view.

## Assumptions

- A match is classified as one where the player "has played" if the player has recorded statistics or participation logged for that game.
- The order of played matches in the Player Detail view will default to reverse chronological order (most recent match first) to highlight latest performances.
- The optional `jerseyName` will be stored as plain text with reasonable length constraints (e.g., up to 30 characters) suitable for displaying on jerseys and profile headers.
- The existing Match Detail view component and its required match data structure will be reused for rendering the destination match view.
