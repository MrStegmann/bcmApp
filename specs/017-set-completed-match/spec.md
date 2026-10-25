# Feature Specification: Direct Match Result & Stats Entry (Set Completed Match)

**Feature Branch**: `017-set-completed-match`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "The task is to create a new button for a match that is not finished nor playing. This button able the user to set the result of the match directlu instead of using 'play match' option. The user shall be allowed to add the result by period and add the stats isolated to each player in the roster. When the user press save, the match pass directly to finished. The buttons in the match shall be gridded by 2 columns."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Action Buttons 2-Column Grid & Direct Result Button (Priority: P1)

As a team manager or coach reviewing the match list, I want the action buttons on each match item arranged in a structured 2-column grid and I want a dedicated "Set Result" button visible only for matches that are not yet finished and not currently live in-progress, so that I can conveniently access post-game score entry without visual clutter or misaligned controls.

**Why this priority**: Establishing the accessible 2-column grid layout and correct conditional availability of the direct result action is the entry gate for all subsequent manual score/stats flows.

**Independent Test**: Can be tested independently by loading match cards with various statuses (`pending`, `inProgress`, `finished`) and verifying that the match action buttons are organized in a 2-column grid, with the "Set Result" button present and enabled strictly for scheduled/pending matches and absent/disabled for live or finished matches.

**Acceptance Scenarios**:

1. **Given** a match in a scheduled or pending status (neither finished nor live in-progress), **When** the user views the match card, **Then** all action buttons are organized in a 2-column grid container.
2. **Given** a match in a scheduled or pending status, **When** examining the available action buttons, **Then** the "Set Result" action button is visible, enabled, and clearly distinguishable from Roster, Edit, and Delete actions.
3. **Given** a match that is live in-progress, **When** viewing the match card, **Then** the "Set Result" button is hidden or disabled to prevent conflicting with the active game clock and live tracking.
4. **Given** a match that is already marked as finished, **When** viewing the match card, **Then** the "Set Result" button is hidden or disabled.
5. **Given** any match card rendering action controls, **When** rendered on mobile screens of varying densities, **Then** the action buttons consistently maintain a clean 2-column grid structure without overflowing or overlapping adjacent match info.

---

### User Story 2 - Period-by-Period Score & Foul Entry (Priority: P1)

As a scorekeeper recording a completed game after it happened, I want to open the direct result form and enter the score and foul tallies broken down for each individual period (Period 1 through 4, plus optional overtime), so that the official quarter progression reflects reality accurately without running the live match simulator.

**Why this priority**: Period score breakdowns are required for match analytics, period summaries, and official basketball league reporting.

**Independent Test**: Can be tested independently by clicking "Set Result" on a pending match, inputting scores and fouls across four periods, confirming that cumulative totals match the sum of period inputs, and verifying that periods reject invalid inputs (e.g., negative numbers).

**Acceptance Scenarios**:

1. **Given** the user triggers the "Set Result" action on a scheduled match, **When** the result entry interface opens, **Then** input fields for both team score and opponent score are provided for each regulation period (Period 1, Period 2, Period 3, and Period 4).
2. **Given** the period score input fields, **When** values are entered into each period, **Then** the overall team score and overall opponent score are automatically calculated and displayed in real time as the sum of all period scores.
3. **Given** a match that ended in a tie after regulation, **When** entering scores, **Then** the user can enable an extra time/overtime period to record extra period points and fouls.
4. **Given** non-numeric or negative values typed into score fields, **When** entered, **Then** the inputs either block negative values or display clear validation errors preventing submission.

---

### User Story 3 - Per-Player Roster Statistics Entry (Priority: P1)

As a coach or assistant, I want to enter isolated individual statistics for each player on the match roster (such as points/baskets, rebounds, assists, steals, turnovers, and personal fouls), so that individual player performances and season box scores are preserved even when the game was not tracked live.

**Why this priority**: Player statistics are essential for calculating individual valuations, tracking player development, and feeding team efficiency analytics.

**Independent Test**: Can be tested independently by opening the roster statistics section within the direct result view, entering distinct stat lines for multiple players, confirming that each player's data is isolated and does not cross-contaminate teammates, and verifying that individual points reconcile with or inform team totals.

**Acceptance Scenarios**:

1. **Given** the direct result entry view is open, **When** navigating to the roster stats section, **Then** all players included in the match roster are listed with their name, jersey number, and individual statistical entry fields.
2. **Given** a specific player in the roster, **When** editing their stats, **Then** their inputs are strictly isolated to that player (adjusting one player's stats does not affect any other player's values).
3. **Given** the player stats inputs, **When** the user enters values, **Then** supported basketball categories can be recorded (e.g., free throws, 2-point shots, 3-point shots, rebounds, assists, steals, turnovers, personal fouls, minutes played).
4. **Given** a match that had no prior roster selected, **When** opening the direct result view, **Then** the user is prompted to select/confirm available team players or an empty roster notice is displayed with an option to add roster players.

---

### User Story 4 - Direct Match Completion & State Transition on Save (Priority: P1)

As a team manager, I want to press "Save" to validate and persist the entered period scores and player statistics, immediately transitioning the match status to "Finished", so that the match is finalized without going through the live game execution view.

**Why this priority**: The primary goal of the feature is bypassing live match simulation and marking the match as finished with accurate data in a single coordinated action.

**Independent Test**: Can be tested independently by filling in period scores and roster stats, tapping "Save", verifying that the dialog/view closes, checking that the match status in the database/list is now "finished", and confirming that opening the match reveals the Match Detail View with all recorded scores, period breakdowns, and player statistics.

**Acceptance Scenarios**:

1. **Given** valid period scores and player statistics entered into the form, **When** the user taps the "Save" (or "Complete Match") button, **Then** the system validates all required inputs, saves the period scores, saves individual player statistics, and updates the match status directly to `finished`.
2. **Given** a successful save operation, **When** completion concludes, **Then** the form closes and the user is returned to the updated match list or navigated directly to the finished match detail view.
3. **Given** the match is now finished, **When** returning to the match list, **Then** the match card displays the completed score, displays the `finished` status indicator, and no longer displays the "Set Result" button.
4. **Given** invalid or incomplete mandatory data (such as missing opponent score or negative values), **When** the user taps "Save", **Then** the system halts the save operation, keeps the form open, and highlights the fields requiring correction.
5. **Given** the user decides not to save and presses "Cancel" or "Close", **When** confirming dismissal, **Then** no match status changes occur and any unsaved edits are discarded without altering the match.

---

### Edge Cases

- **Zero-Score or Tied Match**: What happens if regulation ends in a tie? The user can either input an overtime period or record the tied outcome if permitted by league rules.
- **Empty Roster on Save**: How does the system handle a match where no roster players were selected prior to setting the result? The interface allows confirming team-level period scores even if individual player stats are left blank, or guides the user to select roster participants.
- **Player Points Discrepancy**: What happens if the sum of player points does not equal the team's total points entered in periods? The system allows saving with an optional advisory warning, recognizing that in manual post-game entry, opponents or uncredited baskets may exist.
- **Accidental Dismissal**: If a user has entered detailed stats for 10 players and accidentally taps back or outside the form, the system prompts for confirmation before discarding entered data.
- **Foul Limit Warning**: If a user enters more than 5 personal fouls for a single player, the system warns the user or caps input to standard basketball foul limits while still permitting intentional corrections.
- **Concurrent In-Progress Conflict**: If a match was concurrently started on another device or screen, saving direct completion gracefully enforces state consistency or warns of conflict.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST organize all action buttons on match cards into a structured 2-column grid layout.
- **FR-002**: System MUST provide a new "Set Result" (Direct Finish) action button on match cards.
- **FR-003**: System MUST display and enable the "Set Result" button ONLY when the match is in a scheduled/upcoming status (neither finished nor live in-progress).
- **FR-004**: System MUST hide or disable the "Set Result" button when a match is in `inProgress` or `finished` status.
- **FR-005**: System MUST provide a modal or dedicated screen interface opened by the "Set Result" button for entering match outcome data.
- **FR-006**: System MUST allow users to enter team points and opponent points for each period (Period 1, Period 2, Period 3, Period 4, and optional extra periods).
- **FR-007**: System MUST automatically calculate and display the total team score and total opponent score from the entered period scores.
- **FR-008**: System MUST display the list of players on the match roster within the direct result interface.
- **FR-009**: System MUST allow isolated data entry of individual basketball statistics for each roster player (including points/shooting, rebounds, assists, steals, turnovers, fouls, and minutes).
- **FR-010**: System MUST validate all entered scores and statistics to ensure numeric validity and prevent negative values prior to saving.
- **FR-011**: System MUST persist all entered period scores, team totals, and player statistics upon confirmation.
- **FR-012**: System MUST transition the match status directly to `finished` upon successful persistence.
- **FR-013**: System MUST refresh the match view and card status immediately following the successful state transition to `finished`.
- **FR-014**: System MUST provide a cancel/discard action that safely exits without mutating match state or persisting unconfirmed data.

### Key Entities

- **Match / Game**: Represents the scheduled basketball contest, possessing identifiers, team references, opponent name, scheduled date, current status (`pending`, `inProgress`, `finished`), and final scores.
- **Period Score**: Represents the score and foul tally for a specific quarter or overtime period for both the home team and rival.
- **Player Match Statistic**: Represents the isolated performance record of an individual roster player in the match, encompassing points, field goals made/attempted, free throws made/attempted, 3-pointers made/attempted, rebounds (offensive/defensive), assists, steals, turnovers, and fouls.
- **Match Roster**: The collection of team players assigned or eligible to participate in the specific match.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can input complete match period scores and roster stats and transition a match to `finished` in under 90 seconds.
- **SC-002**: 100% of matches completed via the "Set Result" action transition directly to `finished` status with consistent total scores matching period breakdowns.
- **SC-003**: 100% of match action button sets render in a consistent 2-column grid without layout clipping or misalignment across small, medium, and large mobile viewports.
- **SC-004**: Zero occurrences of the "Set Result" button being interactable on matches that are already in `inProgress` or `finished` status.
- **SC-005**: 100% of player statistics entered through the direct result interface are persisted and accurately reflected in the finished Match Detail View.

## Assumptions

- Standard basketball game structure consists of 4 regulation periods (quarters) with support for an additional overtime/extra period when needed.
- The 2-column grid on match cards accommodates up to 4 actions (e.g., Roster, Set Result, Edit, Delete for scheduled matches; Detail, Edit, Delete for finished matches) cleanly within the card structure.
- The existing Match Detail View and database models for period scores and player stats can ingest and display the manually entered result data without requiring schema breaking changes.
- If individual player statistics are left at zero or unedited, the match score remains valid and can be saved with team-level period scores.
