# Feature Specification: Matches & New Match Workflow

**Feature Branch**: `006-matches-and-new-match`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "The task is to redesign the workflow of a creating new matches: When the user is opening the Match form by clicking on Add Button, they must introduce a `round` (string), `timeStamp` (date; in format `dd/mm/aaaa - hh:mm` and `rivalTeamName` (string); each property are mandatory. When the user click over `create` button after completed the mandatory fields, it should ask for the roaster in a modal (this step can be skipped). After created the match, the user shall be redirected to the matches list and see the new match at the first. (The order of the list must priorizate the must recently match first). When the user click over the new match to start the game and has no roaster, a modal asking for the roaster shall appear. The user cannot start the game before declaring the roaster. If the user declare the roaster, then, the view switch to `PlayMatch.tsx`. A match shall have 3 state: pending (not-played), inProgress (playing), finished (played). A match is pending when is created and has not start yet. A match is inProgress when the match has started (user enter in PlayMatch.tsx and click over crono), and is finished when the play has ended (when the user click to save & finish match)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Match with Mandatory Fields and Optional Roster (Priority: P1)

As a team manager or coach, I want to create a new match with essential scheduling details (round, timestamp, rival team name) and have the option to set up the roster immediately or defer it, so that I can quickly schedule upcoming fixtures without being forced to finalize player attendance immediately.

**Why this priority**: Match creation is the core entry point for all game management and tracking workflows.

**Independent Test**: Can be fully tested by opening the Match Creation form, providing valid inputs for `round`, `timeStamp`, and `rivalTeamName`, proceeding through the optional roster modal (either selecting players or skipping), and verifying that the match is saved in `pending` state and appears at the top of the matches list.

**Acceptance Scenarios**:

1. **Given** the user is on the Matches screen, **When** they tap the "Add" button, **Then** the Match Creation form is presented with fields for Round, Timestamp (`dd/mm/aaaa - hh:mm`), and Rival Team Name.
2. **Given** the user is filling the Match Creation form, **When** any mandatory field (`round`, `timeStamp`, or `rivalTeamName`) is empty or contains an invalid date/time format, **Then** the form prevents submission and indicates which fields require correction.
3. **Given** all mandatory fields are valid, **When** the user taps "Create", **Then** a roster selection modal appears allowing the user to select players or skip the step.
4. **Given** the roster modal is displayed, **When** the user selects a roster or taps "Skip", **Then** the match is persisted in the `pending` state and the user is redirected to the matches list with the newly created match positioned at the top of the list.

---

### User Story 2 - Mandatory Roster Enforcement Before Match Start (Priority: P1)

As a scorekeeper or coach, I want the system to ensure a match roster is defined before starting the game, so that in-game statistics, player tracking, and substitutions can operate accurately from the moment the game clock starts.

**Why this priority**: In-game tracking requires active players on the roster. Starting a game without players would break live game scorekeeping and statistical recording.

**Independent Test**: Can be tested by creating a match without a roster (skipped during creation), tapping the match in the list, confirming the blocking modal forces roster declaration, completing the roster, and verifying successful transition into the live match play view.

**Acceptance Scenarios**:

1. **Given** a match in the list has `pending` state and no declared roster, **When** the user taps on the match to start the game, **Then** a mandatory roster modal is displayed blocking progression to the live match view.
2. **Given** the mandatory roster modal is displayed, **When** the user attempts to proceed without selecting any players, **Then** the modal prevents proceeding.
3. **Given** the user selects valid players and confirms the roster in the mandatory modal, **When** the roster is saved, **Then** the system automatically navigates to the live match play view.
4. **Given** a match in the list has a declared roster, **When** the user taps on the match, **Then** the system proceeds directly to the live match play view without showing the blocking roster modal.

---

### User Story 3 - Match State Lifecycle Management (Priority: P2)

As a user tracking tournament or season progress, I want matches to transition accurately across three states (`pending`, `inProgress`, and `finished`), so that I can distinguish upcoming games, live active games, and completed matches.

**Why this priority**: Clear lifecycle states allow users and the system to separate scheduled matches from live ongoing matches and archived results.

**Independent Test**: Can be tested by verifying state transitions: newly created match is `pending`, starting the chronograph in the live match screen transitions state to `inProgress`, and clicking save/finish transitions state to `finished`.

**Acceptance Scenarios**:

1. **Given** a new match is created, **When** it is saved to the database, **Then** its status is set to `pending`.
2. **Given** a user opens a match in the live match play view, **When** the user starts the match chronograph (clock), **Then** the match status updates from `pending` to `inProgress`.
3. **Given** a match is `inProgress`, **When** the game concludes and the user taps "Save & Finish", **Then** the match status updates to `finished` and the completed state is persisted.
4. **Given** the matches list is displayed, **When** matches exist with different dates and creation times, **Then** the list is ordered with the most recent matches displayed first.

---

### Edge Cases

- **Invalid Date/Time Format**: What happens if the user inputs text that does not match `dd/mm/aaaa - hh:mm` (e.g. invalid days like `32/01/2026` or incorrect delimiters)? The form validation MUST reject the input and clearly guide the user to provide a valid date and time in `dd/mm/aaaa - hh:mm` format.
- **Roster Selection with Empty Player List**: What happens if the team has no registered players in the club/team database when the roster modal appears? The modal must display a clear message indicating that no team players are available and guide the user to add players to the team first.
- **App Interruption During `inProgress` Match**: What happens if the app closes while a match is `inProgress`? The match remains in `inProgress` state so the user can resume tracking upon returning.
- **Revisiting a Finished Match**: What happens if the user taps on a `finished` match from the list? The match details/summary view should be presented rather than restarting the game or re-prompting for roster declaration.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an "Add" action on the Matches screen that opens the Match Creation form.
- **FR-002**: The Match Creation form MUST require and validate three mandatory inputs before submission: `round` (string), `timeStamp` (date formatted as `dd/mm/aaaa - hh:mm`), and `rivalTeamName` (string).
- **FR-003**: The system MUST prevent creation of a match if any mandatory field is missing, whitespace-only, or if the `timeStamp` does not adhere to valid `dd/mm/aaaa - hh:mm` values.
- **FR-004**: Upon valid form submission, the system MUST display an optional roster prompt modal allowing the user to select team players or skip roster assignment.
- **FR-005**: Upon completing or skipping the roster prompt, the system MUST persist the new match with an initial state of `pending` and redirect the user to the Matches list.
- **FR-006**: The Matches list MUST display matches ordered chronologically/recency-based prioritizing the most recent matches at the top of the list.
- **FR-007**: When a user selects a `pending` match that has no roster assigned, the system MUST display a blocking roster modal requiring player selection before entry into the live match play view.
- **FR-008**: When a valid roster is assigned (or was previously declared) and the user initiates match start, the system MUST navigate to the live match play view (`PlayMatch`).
- **FR-009**: The system MUST manage three distinct match states: `pending` (created, not started), `inProgress` (match clock started in live play view), and `finished` (game ended and saved by the user).
- **FR-010**: When the user starts the chronograph/timer in the live match play view, the system MUST transition the match state from `pending` to `inProgress`.
- **FR-011**: When the user triggers the "Save & Finish" action in the live match play view, the system MUST transition the match state to `finished` and persist the final outcome.

### Key Entities *(include if feature involves data)*

- **Match**: Represents a basketball game fixture. Key attributes include:
  - `id`: Unique identifier.
  - `round`: Name/number of the fixture round (e.g. "Round 1", "Jornada 4").
  - `timeStamp`: Scheduled match date and time (`dd/mm/aaaa - hh:mm`).
  - `rivalTeamName`: Name of the opposing team.
  - `state`: Current match lifecycle state (`pending`, `inProgress`, `finished`).
  - `roster`: Collection of player identifiers assigned to this match.
  - `createdAt` / `updatedAt`: Timestamps used for sorting and tracking.
- **Roster**: Association between a specific match and a list of selected team players participating in the match.
- **Player**: Team member eligible for roster selection and in-game tracking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of newly created matches without mandatory fields (`round`, `timeStamp`, `rivalTeamName`) are blocked from submission with immediate validation feedback.
- **SC-002**: Users can complete match creation in under 30 seconds when skipping roster selection and under 60 seconds when declaring a roster.
- **SC-003**: 100% of newly saved matches appear at the very top of the matches list immediately after creation without requiring a manual refresh.
- **SC-004**: 0% of matches can enter the live match play screen without a confirmed roster containing at least one player.
- **SC-005**: Match state transitions between `pending`, `inProgress`, and `finished` occur reliably with 100% persistence accuracy across app sessions.

## Assumptions

- The date format `dd/mm/aaaa - hh:mm` uses 2-digit day, 2-digit month, 4-digit year, 2-digit 24-hour time, and 2-digit minute (e.g., `15/10/2026 - 18:30`).
- Existing club/team players in the local database serve as the source pool for roster selection.
- Minimum valid roster requirement is at least 1 player to allow solo or reduced-squad training/scrimmage scenarios, though standard matches typically declare 5 or more players.
- The live match play view (`PlayMatch`) contains the chronograph/timer controls and the "Save & Finish" match trigger.
