# Feature Specification: Matches & New Match Workflow

**Feature Branch**: `006-matches-and-new-match`

**Created**: 2026-10-02

**Last Updated**: 2026-10-23

**Status**: Ready for Planning

**Input**: User description: "The task is to update the match form date field. We dont need no longer hour format in the input field date. We only will use date format. Also, the field must automaticly formatting the date to the correct format `dd/mm/aaaa`, allowing the user to only type numbers.
What To Do:
* Remove Time Component: Update the match form date input to remove the hour/time selection, changing it to a date-only field.
* Restrict Input to Numbers: Implement a keydown or input listener on the date field to block letters, symbols, and non-numeric characters.
* Implement Automatic Formatting Mask: Add auto-formatting logic that inserts slashes automatically as the user types, enforcing the `dd/mm/aaaa` structure.
* Update State & Payloads: Adjust the form state handling, validation schemas, and outgoing API payloads to process the date-only format without time zone or hour offsets.
Acceptance Criteria:
* Date-Only Interface: The match form date input field no longer displays, accepts, or requires time values.
* Numeric Restriction: The input field strictly allows only numeric keystrokes (`0-9`), preventing invalid characters from being entered.
* Auto-Formatting (`dd/mm/aaaa`): Typing continuous numbers automatically formats the value into the `dd/mm/aaaa` pattern (e.g., typing `23102026` renders as `23/10/2026`).
* Clean Submission: Form submission correctly validates and passes the date-only string payload to the backend."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Match with Date-Only Numeric Input and Optional Roster (Priority: P1)

As a team manager or coach, I want to create a new match by inputting the round, date (in a streamlined `dd/mm/aaaa` format without hours), and rival team name, with automated formatting and numeric-only entry, so that I can quickly and accurately schedule fixtures without typing delimiters or dealing with time-of-day offsets.

**Why this priority**: Match scheduling is the primary entry point for all game tracking. Simplifying the date entry to date-only with auto-masking prevents data entry errors and speeds up match creation.

**Independent Test**: Can be fully tested by opening the Match Creation form, typing numeric characters into the date field, verifying auto-formatting to `dd/mm/aaaa` and rejection of non-numeric characters, filling round and rival team name, completing or skipping roster selection, and confirming the match saves with the exact date-only value and appears at the top of the matches list.

**Acceptance Scenarios**:

1. **Given** the user opens the Match Creation form, **When** the form is displayed, **Then** the date input field is presented as a date-only input (`dd/mm/aaaa`) with no hour or minute selection elements.
2. **Given** the user is typing into the date field, **When** they type non-numeric characters (letters, punctuation, symbols), **Then** those characters are blocked and not entered into the field.
3. **Given** the user inputs digits into the date field, **When** typing continuous numbers (e.g., `23102026`), **Then** the field automatically inserts slashes to format the entry into `dd/mm/aaaa` structure (e.g., `23/10/2026`).
4. **Given** the user is filling the Match Creation form, **When** any mandatory field (`round`, date, or `rivalTeamName`) is empty or contains an invalid calendar date (e.g., incomplete date or non-existent date like `31/02/2026`), **Then** the form prevents submission and provides clear validation feedback.
5. **Given** all mandatory fields are valid with a date-only value, **When** the user taps "Create", **Then** the roster selection prompt appears allowing the user to select players or skip.
6. **Given** the roster prompt is completed or skipped, **When** the match is saved, **Then** the match is persisted in `pending` state with the date-only value and the user is redirected to the matches list with the new match placed at the top.

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

- **Non-Numeric Character Input**: When a user attempts to paste or type non-digit characters (including letters, spaces, and punctuation) into the date field, the input rejects or strips all non-numeric characters immediately.
- **Incomplete Date Entry**: When a user enters fewer than 8 digits (e.g., `23/10/` or `23`), submission is blocked and an error message prompts the user to provide a complete 8-digit date in `dd/mm/aaaa` format.
- **Invalid Calendar Date**: When a user inputs an impossible calendar date (e.g., `31/02/2026`, `31/04/2026`, or month `13`), the validation flags the field as invalid and guides the user to enter a valid date.
- **Leap Year Handling**: February 29th is validated against leap years (e.g., `29/02/2024` is valid, but `29/02/2025` is invalid).
- **Backspace and Deletion**: When deleting digits with backspace, the auto-masking allows natural backward deletion across slashes without cursor trapping or jumping.
- **Roster Selection with Empty Player List**: If the team has no registered players in the club/team database when the roster modal appears, the modal displays a message indicating no players are available and guides the user to add players first.
- **App Interruption During `inProgress` Match**: If the app closes while a match is `inProgress`, the match remains in `inProgress` state so the user can resume tracking upon reopening.
- **Revisiting a Finished Match**: When the user taps on a `finished` match from the list, the match details/summary view is displayed rather than restarting the game or re-prompting for roster declaration.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an "Add" action on the Matches screen that opens the Match Creation form.
- **FR-002**: The Match Creation form MUST require and validate three mandatory inputs before submission: `round` (string), match date (date-only formatted strictly as `dd/mm/aaaa`), and `rivalTeamName` (string).
- **FR-003**: The match form date field MUST display as a date-only input, without any hour, minute, or time selection controls or prompts.
- **FR-004**: The date field MUST restrict user input to numeric characters only (`0-9`), blocking all alphabetical and special characters.
- **FR-005**: The date field MUST automatically apply an input formatting mask that inserts `/` separators as the user enters digits, formatting the text into `dd/mm/aaaa` structure (e.g., typing `23102026` formats to `23/10/2026`).
- **FR-006**: The system MUST validate that the entered date is a complete and valid calendar date according to the Gregorian calendar (valid day within the specific month, valid month 01–12, and valid leap year handling).
- **FR-007**: The system MUST persist and transmit the match date as a clean date-only value without timezone offsets or artificial hour/minute components.
- **FR-008**: The system MUST prevent creation of a match if any mandatory field is missing, whitespace-only, or if the date fails validation.
- **FR-009**: Upon valid form submission, the system MUST display an optional roster prompt modal allowing the user to select team players or skip roster assignment.
- **FR-010**: Upon completing or skipping the roster prompt, the system MUST persist the new match with an initial state of `pending` and redirect the user to the Matches list.
- **FR-011**: The Matches list MUST display matches ordered prioritizing the most recent matches at the top of the list.
- **FR-012**: When a user selects a `pending` match that has no roster assigned, the system MUST display a blocking roster modal requiring player selection before entry into the live match play view.
- **FR-013**: When a valid roster is assigned (or was previously declared) and the user initiates match start, the system MUST navigate to the live match play view (`PlayMatch`).
- **FR-014**: The system MUST manage three distinct match states: `pending` (created, not started), `inProgress` (match clock started in live play view), and `finished` (game ended and saved by the user).
- **FR-015**: When the user starts the chronograph/timer in the live match play view, the system MUST transition the match state from `pending` to `inProgress`.
- **FR-016**: When the user triggers the "Save & Finish" action in the live match play view, the system MUST transition the match state to `finished` and persist the final outcome.

### Key Entities *(include if feature involves data)*

- **Match**: Represents a basketball game fixture. Key attributes include:
  - `id`: Unique identifier.
  - `round`: Name/number of the fixture round (e.g. "Round 1", "Jornada 4").
  - `date`: Scheduled match date in date-only format (`dd/mm/aaaa`).
  - `rivalTeamName`: Name of the opposing team.
  - `state`: Current match lifecycle state (`pending`, `inProgress`, `finished`).
  - `roster`: Collection of player identifiers assigned to this match.
  - `createdAt` / `updatedAt`: Timestamps used for sorting and tracking.
- **Roster**: Association between a specific match and a list of selected team players participating in the match.
- **Player**: Team member eligible for roster selection and in-game tracking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of non-numeric keystrokes or inputs into the date field are blocked or filtered out immediately.
- **SC-002**: 100% of sequential 8-digit inputs automatically display in the standard `dd/mm/aaaa` format without manual separator entry.
- **SC-003**: 100% of match creation attempts with invalid, incomplete, or non-existent calendar dates are rejected with immediate validation feedback.
- **SC-004**: Users can input and format a match date in under 5 seconds with zero required time/hour selections.
- **SC-005**: 100% of created matches persist and retrieve date-only representations without unintended timezone shifts or hour-related discrepancies.
- **SC-006**: Users can complete match creation in under 30 seconds when skipping roster selection and under 60 seconds when declaring a roster.
- **SC-007**: 100% of newly saved matches appear at the very top of the matches list immediately after creation without requiring a manual refresh.
- **SC-008**: 0% of matches can enter the live match play screen without a confirmed roster containing at least one player.
- **SC-009**: Match state transitions between `pending`, `inProgress`, and `finished` occur reliably with 100% persistence accuracy across app sessions.

## Assumptions

- The date format `dd/mm/aaaa` uses 2-digit day, 2-digit month, and 4-digit year (e.g., `23/10/2026`).
- Match scheduling does not require time-of-day precision; ordering and scheduling rely on the calendar date and match round.
- Mobile numeric keyboards (number-pad) or standard inputs supply numerical values `0-9`.
- Existing club/team players in the local database serve as the source pool for roster selection.
- Minimum valid roster requirement is at least 1 player to allow solo or reduced-squad training/scrimmage scenarios, though standard matches typically declare 5 or more players.
- The live match play view (`PlayMatch`) contains the chronograph/timer controls and the "Save & Finish" match trigger.
