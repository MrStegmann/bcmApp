# Feature Specification: Update Home View Page

**Feature Branch**: `011-update-home-view`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "The task is to update the actual Home Page View to add three components in exactly this orden (from top to bottom): 1. Next Match ahead: this games shall not be init, must show the rival and the date. Must have fast button that allow the user to make the roster if is not made yet. If there's no next match ahead, just show a message 'Sin próximos partidos agendados'. 2. Last three matchs played: It must show in one column the last three match played in order of must recent first. It shall show the result total, and separated by periods below total. Each one MUST have a button to open match detail view of the game. 3. Global Stats: A total stats based on each match played where the user can see the media of each stats present in the matchs (Posesiones, OER, DER, eFG%, ORB%, AST%, TOV%, FTR)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Next Match Ahead & Quick Roster Callup (Priority: P1)

As a coach or team manager, I want to see the next upcoming scheduled match immediately upon opening my team's home screen, displaying the opponent's name and the match date, with a quick action to configure the team roster if it has not yet been selected, so that I can prepare for upcoming fixtures without navigating through nested menus.

**Why this priority**: Immediate visibility into the next scheduled game and quick preparation of player callups are central operational tasks for coaches ahead of match day.

**Independent Test**: Can be tested independently by creating an uninitialized fixture for a team, opening the team home view, verifying that the opponent name and date appear at the top, confirming that the "Make Roster" button appears when no players are called up, and verifying that the empty state `"Sin próximos partidos agendados"` appears when no pending matches exist.

**Acceptance Scenarios**:

1. **Given** one or more pending matches scheduled in the future, **When** the user views the team home view, **Then** the component identifies and displays the earliest scheduled uninitialized match at the top of the view, showing the opponent name and the scheduled date.
2. **Given** the next scheduled match does not have a roster confirmed yet, **When** the next match component renders, **Then** a visible quick-action button ("Make Roster" / "Configurar Convocatoria") is displayed.
3. **Given** the user taps the quick-action roster button, **When** triggered, **Then** the roster selection interface opens, allowing the user to select and confirm the active players for that fixture.
4. **Given** the roster has already been created for the upcoming match, **When** the next match component renders, **Then** the button reflects the confirmed status or allows editing the existing roster.
5. **Given** there are no uninitialized or pending matches in the team schedule, **When** the user views the team home view, **Then** the component displays the exact fallback message `"Sin próximos partidos agendados"`.

---

### User Story 2 - Recent Match History & Period Score Breakdown (Priority: P1)

As a coach, player, or club director, I want to review the last three played matches in a single vertical column on the home screen, showing the total match score and the period-by-period score breakdown directly underneath each match, with a button to open each game's full match detail view, so that I can quickly assess recent game performance and drill down into game stats.

**Why this priority**: Reviewing recent match outcomes and quarter progression provides immediate context on team momentum and allows fast navigation to complete match records.

**Independent Test**: Can be tested independently by loading a team with 3 or more finished matches, opening the home view, verifying that exactly the last 3 matches are displayed vertically in reverse chronological order (newest first), validating that each card displays the final score and period scores underneath, and tapping the detail button to open the Match Detail View.

**Acceptance Scenarios**:

1. **Given** a team with played matches, **When** the middle section of the home view renders, **Then** up to 3 most recently played matches are displayed in a single vertical column, sorted from newest to oldest.
2. **Given** a displayed played match entry, **When** rendered, **Then** the total cumulative match score (Home Team Points vs Opponent Points) is clearly visible.
3. **Given** a displayed played match entry, **When** reviewing the score details, **Then** individual period scores (Period 1, Period 2, Period 3, Period 4, and Extra Time when applicable) are displayed directly beneath the total score.
4. **Given** a displayed played match entry, **When** the user taps the match card or its dedicated detail button, **Then** the application navigates directly to the full Match Detail View for that specific match.
5. **Given** a team with fewer than three played matches (e.g., 1 or 2 matches), **When** the section renders, **Then** it cleanly displays all available played matches in order without rendering empty or broken card slots.
6. **Given** a team with zero played matches, **When** the section renders, **Then** a clean fallback notification indicates that no matches have been played yet.

---

### User Story 3 - Global Team Advanced Statistics Averages (Priority: P2)

As a coach or analyst, I want to see aggregated global statistics representing the average of the eight key advanced efficiency metrics across all played matches at the bottom of the home screen, so that I can monitor our overarching tactical identity and trends over time.

**Why this priority**: Tactical evaluation requires observing cumulative performance trends across multiple matches rather than evaluating single-game outliers in isolation.

**Independent Test**: Can be tested independently by providing recorded stats across multiple completed games, computing the arithmetic mean of each of the 8 metrics (`Posesiones`, `OER`, `DER`, `eFG%`, `ORB%`, `AST%`, `TOV%`, `FTR`), and confirming the home view displays the exact computed averages with correct numerical and percentage formatting.

**Acceptance Scenarios**:

1. **Given** one or more completed matches for the team, **When** the global stats component renders at the bottom of the home view, **Then** it calculates and displays the arithmetic mean across all completed matches for each of the following 8 metrics:
   - `Posesiones` (Average Possessions per game)
   - `OER` (Average Offensive Efficiency Rating)
   - `DER` (Average Defensive Efficiency Rating)
   - `eFG%` (Average Effective Field Goal Percentage)
   - `ORB%` (Average Offensive Rebound Percentage)
   - `AST%` (Average Assist Percentage)
   - `TOV%` (Average Turnover Percentage)
   - `FTR` (Average Free Throw Rate)
2. **Given** the global statistics metrics, **When** rendered, **Then** values are formatted legibly (percentages display with `%` symbol, decimal metrics rounded to standard decimal precision).
3. **Given** a newly finished match is saved or an existing match's stats are edited, **When** returning to the home view, **Then** the global statistics averages immediately recalculate and reflect the updated dataset.
4. **Given** a team with zero completed matches, **When** the global stats section renders, **Then** it safely displays neutral baseline values (`0.0` or `0.0%`) or an informative empty state without runtime calculation errors.

---

### Edge Cases

- **Multiple Pending Matches on Same Date**: If multiple pending fixtures share the same calendar date, secondary ordering (such as creation sequence or scheduled round) deterministically selects the next fixture.
- **Pending Match Already In Progress**: If a match is currently live/in-progress, the system treats it according to its active status without breaking the uninitialized next match detection.
- **Matches with Overtime (Extra Periods)**: In the recent matches list, if a match included extra time, the period score breakdown clearly shows the extra period score alongside the 4 regulation quarters.
- **Tied or Zero Scores**: Completed games with low scoring or tied quarters display valid numeric values (`0-0` or quarter scores) without layout collapse.
- **Zero Completed Matches**: When no games have been completed, both the recent matches component and the global stats component present graceful, user-friendly empty states without failing mathematical calculations (`NaN` or `Infinity`).
- **Single Game Played**: When only one match has been completed, the global stats averages exactly equal that single game's advanced metrics.
- **Offline / Local Data Updates**: When returning from the Match Detail View or after creating/editing matches or rosters, the Home View automatically synchronizes its data without requiring a manual pull-to-refresh or app restart.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST structure the Team Home View with three distinct sections organized in exact vertical order from top to bottom:
  1. Next Match Ahead Component (Top)
  2. Last Three Matches Played Component (Middle)
  3. Global Stats Component (Bottom)
- **FR-002**: The Next Match Component MUST query and identify the earliest chronologically scheduled uninitialized/pending match for the active team.
- **FR-003**: The Next Match Component MUST display the rival team name and the scheduled match date.
- **FR-004**: The Next Match Component MUST verify if a player roster has been defined for the upcoming match.
- **FR-005**: The Next Match Component MUST render a prominent quick-action button ("Make Roster" / "Configurar Convocatoria") if the roster has not yet been created for this match.
- **FR-006**: Tapping the quick-action roster button MUST trigger the roster assignment modal/flow for that upcoming match.
- **FR-007**: If no upcoming uninitialized matches exist in the schedule, the Next Match Component MUST display the exact text string `"Sin próximos partidos agendados"`.
- **FR-008**: The Last Three Matches Played Component MUST query and display up to 3 most recently completed matches for the active team, sorted in descending order (newest first).
- **FR-009**: The Last Three Matches Played Component MUST render the matches in a single vertical column layout.
- **FR-010**: For each displayed match, the entry MUST show the final total score (Home Team Points vs Rival Points).
- **FR-011**: For each displayed match, the entry MUST display individual period scores directly underneath the total score (Period 1, Period 2, Period 3, Period 4, and Extra Period if applicable).
- **FR-012**: Each match card in the Last Three Matches Played Component MUST provide an interactive action/button that opens the full Match Detail View for that match.
- **FR-013**: The Global Stats Component MUST aggregate statistics across all recorded, completed matches for the active team.
- **FR-014**: The Global Stats Component MUST compute the statistical arithmetic average (media) across all completed matches for each of the eight metrics:
  1. `Posesiones`
  2. `OER`
  3. `DER`
  4. `eFG%`
  5. `ORB%`
  6. `AST%`
  7. `TOV%`
  8. `FTR`
- **FR-015**: The Global Stats Component MUST render the 8 calculated averages in a clean summary layout with percentage formatting (`%`) for rate metrics and 1-decimal-place rounding.
- **FR-016**: The Global Stats Component MUST protect against division-by-zero errors when zero completed matches exist, safely rendering zeroes (`0.0` or `0.0%`) or a clean empty-state message.
- **FR-017**: The Team Home View MUST dynamically refresh its data whenever returning from child views (such as Match Detail View or Roster modal) or when underlying match data changes.

### Key Entities

- **Next Match Entry**: Represents the upcoming fixture, holding attributes for rival team name, scheduled date, fixture status (`pending`), and roster configuration status.
- **Recent Match Summary**: Represents a finished game in the recent history column, holding total team score, total rival score, per-period scores (`q1`, `q2`, `q3`, `q4`, `extra`), rival name, and game date.
- **Period Breakdown**: Represents the quarter-by-quarter score records for both the active team and the opponent.
- **Team Global Averages**: Represents the consolidated tactical efficiency metrics (`Posesiones`, `OER`, `DER`, `eFG%`, `ORB%`, `AST%`, `TOV%`, `FTR`) computed by averaging the advanced statistics of all completed matches.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Team Home View displays all three components in top-to-bottom sequence within 1 second of navigating to the team profile.
- **SC-002**: 100% of upcoming pending fixtures are accurately evaluated to identify the earliest scheduled match.
- **SC-003**: The exact empty state string `"Sin próximos partidos agendados"` is displayed in 100% of scenarios where no pending match exists.
- **SC-004**: When an upcoming match has no roster, the quick-action button is visible and clicking it launches the roster selector within 500ms.
- **SC-005**: Exactly up to 3 most recently played matches are rendered in descending chronological order with total and period breakdown scores clearly legible.
- **SC-006**: Tapping a match in the recent matches list transitions to the Match Detail View in under 1 second.
- **SC-007**: 100% of the 8 global average metrics match the exact mathematical average of the completed matches within ±0.01 precision.
- **SC-008**: 100% of zero-data scenarios (0 pending matches, 0 completed matches) render gracefully without unhandled exceptions, application freezes, or `NaN`/`Infinity` text.
- **SC-009**: The entire layout scrolls smoothly in a single vertical column on both compact mobile screens and tablet displays.

## Assumptions

- "Home View" refers to the default dashboard/main tab of an active team (`ClubProfile` when `option === TopMenuEnums.MAIN`).
- Uninitialized matches are matches with status `pending` that have not yet been played or started in `PlayMatch`.
- Roster creation status is determined by checking whether player callup records exist for the scheduled match.
- Completed matches are defined as matches with status `finished`.
- The 8 advanced efficiency metrics (`Posesiones`, `OER`, `DER`, `eFG%`, `ORB%`, `AST%`, `TOV%`, `FTR`) use the established domain formulas defined in Feature 009, calculated per match and averaged arithmetically across all completed matches.
- All match information and statistics are stored locally on the device, ensuring instant retrieval without external network dependencies.
