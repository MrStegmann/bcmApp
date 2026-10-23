# Feature Specification: Match Detail View & Advanced Analytics

**Feature Branch**: `009-match-detail-view`

**Created**: 2026-10-22

**Status**: Draft

**Input**: User description: "The task is to create a new component called `Match Detail View`, where the user can see the stats of the match that is finished and saved. The User shall see the total Score at first and, below a desglose of the points AND faults made by both teams for each period. - Period 1: Team Points: 14, Team Faults 3; Rival Points: 10, Rival Faults: 4; - Period 2: Team Points: 10, Team Faults 5; Rival Points: 12, Rival Faults: 2; Below this desglose of each period, it MUST be showed the list of the roster of the match sorted by Value. Each player is a tappable button that show the Jersey Number, Player Name, Minutes played, Points made AND value of the player. Below the player list, it must show a stadisct of a polygon where is cuantified the team stats: - Posesiones (total): Calculated by = (0,96*(total 2 point Attempts + total 3 point Attempts + 0,44 * total 1 point Attempts + Total Offensive Rebounds - Total Ball Lost)) - OER (Offensive Efficiency Rating): Calculated by = (Total Points/Posesisiones)*100 - DER (Defensive Efficiency Rating): Calculated by = (Total Rival Points/Posesisiones)*100 - eFG% (Effective Field Goal Percentage): Calculated by = 100*((total 2 point succeed + total 3 point succeed + 0,5 * total 3 point succeed) / ( total 2 point Attempts + total 3 point Attempts )) - ORB% (Offensive Rebound Percentage): Calculated by = 100 * ( Total Offensive Rebounds / ( ( total 2 point Attempts - total 2 point succeed ) + ( total 3 point Attempts - total 3 point succeed ) + ( 0,44 * ( total 1 point Attempts - total 1 point succeed ) ) ) ) - AST% (Assist Percentage): Calculated by = 100 * ( Total Asist / ( total 2 point Attempts + total 3 point Attempts + 0,44 * total 1 point Attempts + Total Ball Lost ) ) - TOV% (Turnover Percentage): Calculated by = 100 * ( Total Ball Lost / Posesisiones ) - FTR (Free Throw Rate): Calculated by = 100 * ( total 1 point succeed / ( total 2 point Attempts + total 3 point Attempts ) ) Also, the View Page MUST have a Edit button that allow the user to edit any data from the match (periods points & faults AND player stats)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Match Summary, Final Score & Period Breakdown (Priority: P1)

As a coach or team manager, I want to view a saved and finished match with the total cumulative score and an organized breakdown of points and fouls per period for both my team and the rival, so that I have an immediate high-level summary of game progression.

**Why this priority**: The total score and quarter-by-quarter score/foul breakdown constitute the core purpose of inspecting a finished match record.

**Independent Test**: Can be tested independently by opening a completed match from the match list and verifying that the header displays the total cumulative score and each period lists accurate points and fouls for both the home team and the opponent.

**Acceptance Scenarios**:

1. **Given** a finished match with recorded period scores and fouls, **When** the user opens the match detail view, **Then** the cumulative final score is prominently rendered at the top of the view.
2. **Given** the match detail view is opened, **When** reviewing the period breakdown section, **Then** each played period (Period 1, Period 2, Period 3, Period 4, and Extra if applicable) displays:
   - Team Points and Team Fouls.
   - Rival Points and Rival Fouls.
3. **Given** a match that had no extra time, **When** viewing the period breakdown, **Then** only the four regular quarters are displayed without empty or confusing extra time sections.
4. **Given** a match that went to extra time, **When** viewing the period breakdown, **Then** the extra time points and fouls for both teams are clearly displayed in sequence following Period 4.

---

### User Story 2 - Value-Sorted Match Roster & Player Detail Inspection (Priority: P1)

As a coach, I want to review the match roster ordered from highest to lowest player Valuation (`Value`), with each player presented as an interactive button showing their jersey number, name, minutes played, points scored, and valuation score, so that I can instantly evaluate player impact.

**Why this priority**: Player evaluation by valuation ranking is standard basketball protocol for coaching assessments immediately post-match.

**Independent Test**: Can be tested independently by loading match data with multiple players of varied valuations, confirming they appear sorted descending by Value, verifying that jersey number, name, minutes played, points, and value are shown, and tapping a player button to open detailed individual box score stats.

**Acceptance Scenarios**:

1. **Given** a match roster containing players with recorded statistics, **When** rendered in the match detail view, **Then** the player list is automatically sorted in descending order based on each player's Valuation (`Value`).
2. **Given** each player entry in the roster list, **When** rendered, **Then** it appears as a distinct tappable button displaying:
   - Jersey Number
   - Player Name
   - Minutes Played
   - Points Scored
   - Valuation (`Value`)
3. **Given** two or more players with equal valuation scores, **When** sorted, **Then** a consistent secondary sort (such as points scored descending, then jersey number ascending) maintains a stable order.
4. **Given** a player item button, **When** tapped by the user, **Then** a player detail box score view or modal displays their complete individual breakdown (1pt/2pt/3pt attempts and makes, offensive/defensive rebounds, assists, steals, turnovers, fouls, and valuation).

---

### User Story 3 - Advanced Team Statistics & Polygon Visualization (Priority: P2)

As a coach or analyst, I want to view an advanced analytics section featuring eight quantified efficiency metrics and a polygon/radar chart, so that I can understand the underlying tactical efficiency of our team's performance.

**Why this priority**: Advanced basketball analytics (Possessions, OER, DER, eFG%, ORB%, AST%, TOV%, FTR) provide deeper tactical insights beyond raw box score points.

**Independent Test**: Can be tested independently by providing known match aggregate totals and validating that all 8 formulas compute the exact mathematical values and that the polygon visualization accurately maps them.

**Acceptance Scenarios**:

1. **Given** the aggregated team statistics from the match, **When** the analytics section renders, **Then** the following 8 advanced metrics are computed and displayed:
   - **Posesiones (total)**: `= (0.96 * (total 2PA + total 3PA + 0.44 * total 1PA + Total Offensive Rebounds - Total Ball Lost))`
   - **OER (Offensive Efficiency Rating)**: `= (Total Points / Posesiones) * 100`
   - **DER (Defensive Efficiency Rating)**: `= (Total Rival Points / Posesiones) * 100`
   - **eFG% (Effective Field Goal Percentage)**: `= 100 * ((total 2PM + total 3PM + 0.5 * total 3PM) / (total 2PA + total 3PA))`
   - **ORB% (Offensive Rebound Percentage)**: `= 100 * (Total Offensive Rebounds / ((total 2PA - total 2PM) + (total 3PA - total 3PM) + (0.44 * (total 1PA - total 1PM))))`
   - **AST% (Assist Percentage)**: `= 100 * (Total Asist / (total 2PA + total 3PA + 0.44 * total 1PA + Total Ball Lost))`
   - **TOV% (Turnover Percentage)**: `= 100 * (Total Ball Lost / Posesiones)`
   - **FTR (Free Throw Rate)**: `= 100 * (total 1PM / (total 2PA + total 3PA))`
2. **Given** a scenario where a denominator in any formula is zero (e.g., zero possessions, zero field goal attempts, or zero missed shot opportunities), **When** computing the metric, **Then** the system safely resolves to `0` or `0.0%` without crashing or displaying `NaN`/`Infinity`.
3. **Given** the 8 computed metrics, **When** displayed, **Then** a polygon/radar chart renders the multi-axis tactical profile with clear labels and numeric indicators.

---

### User Story 4 - Match Data & Player Stats Edit Mode (Priority: P2)

As a scorekeeper or coach, I want an Edit button on the Match Detail View that allows me to correct or modify period scores, period fouls, and player individual statistics, so that official scoring errors or omissions can be rectified post-game.

**Why this priority**: In live basketball recording, scorekeepers occasionally miss a foul, basket, or assist; having a post-game correction flow is critical for maintaining accurate records.

**Independent Test**: Can be tested independently by tapping the Edit button, modifying period scores and fouls, modifying player stats, saving the changes, and confirming that the total score, period breakdown, player roster valuation ranking, and advanced metrics update immediately and persist across app reloads.

**Acceptance Scenarios**:

1. **Given** the Match Detail View, **When** looking at the action controls, **Then** an accessible Edit button is visible.
2. **Given** the user taps the Edit button, **When** edit mode activates, **Then** the user can adjust:
   - Team Points and Team Fouls for each period.
   - Rival Points and Rival Fouls for each period.
   - Individual statistics for each player on the roster (minutes, shooting attempts/makes, rebounds, assists, steals, turnovers, fouls).
3. **Given** the user updates period scores or fouls and confirms "Save", **When** saved, **Then** the changes persist to the database and the Match Detail View refreshes with updated totals.
4. **Given** the user modifies individual player statistics in edit mode and saves, **When** saved, **Then** the player's total points and Valuation are recalculated, the roster ranking re-sorts if order changed, and team advanced statistics recompute automatically.
5. **Given** the user cancels an edit without saving, **When** returning to view mode, **Then** all previous values remain unchanged.

---

### Edge Cases

- **Zero Possessions / Zero Shot Attempts**: If a game has no recorded shot attempts or turnovers, the advanced metric formulas with denominators equal to zero must safely produce `0.0` or `0%` rather than `NaN`, `Infinity`, or an unhandled exception.
- **Tied Player Valuations**: When two or more players have identical Valuation values, the roster sort must remain deterministic and stable without flickering or jumping order.
- **Negative Valuations**: Players who accumulated significant missed shots, turnovers, or fouls can have negative valuation numbers; the list sort must handle negative numbers correctly (e.g., 5 > 0 > -2 > -5).
- **Match without Extra Time**: If a match ended in regular time (4 periods), the breakdown and edit views must not display or demand inputs for extra time unless an extra period was actually played.
- **Empty / Incomplete Player Stats**: If certain players were on the roster but recorded 0 minutes and 0 stats, they must still display with 0 values and valuation 0 without crashing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a dedicated `Match Detail View` accessible when selecting a finished/saved match.
- **FR-002**: System MUST display the cumulative final match score prominently at the top of the view (Team Total Score vs Rival Total Score).
- **FR-003**: System MUST display a period-by-period breakdown section showing points and fouls for both the home team and the rival for all played periods (`Period 1`, `Period 2`, `Period 3`, `Period 4`, and `Extra` when applicable).
- **FR-004**: System MUST list the match roster positioned below the period breakdown section, strictly sorted in descending order by player Valuation (`Value`).
- **FR-005**: Each player roster entry MUST be rendered as an interactive/tappable button displaying: Jersey Number, Player Name, Minutes Played, Points Made, and Valuation (`Value`).
- **FR-006**: Tapping any player roster button MUST display a detailed breakdown view or modal showing that player's comprehensive statistical counts (1pt/2pt/3pt makes and misses, offensive/defensive rebounds, assists, steals, turnovers, personal fouls, valuation).
- **FR-007**: System MUST calculate and display the 8 advanced team statistics using the exact formulas:
  1. `Posesiones (total) = 0.96 * (total 2PA + total 3PA + 0.44 * total 1PA + Total Offensive Rebounds - Total Ball Lost)`
  2. `OER = (Total Points / Posesiones) * 100`
  3. `DER = (Total Rival Points / Posesiones) * 100`
  4. `eFG% = 100 * ((total 2PM + total 3PM + 0.5 * total 3PM) / (total 2PA + total 3PA))`
  5. `ORB% = 100 * (Total Offensive Rebounds / ((total 2PA - total 2PM) + (total 3PA - total 3PM) + (0.44 * (total 1PA - total 1PM))))`
  6. `AST% = 100 * (Total Asist / (total 2PA + total 3PA + 0.44 * total 1PA + Total Ball Lost))`
  7. `TOV% = 100 * (Total Ball Lost / Posesiones)`
  8. `FTR = 100 * (total 1PM / (total 2PA + total 3PA))`
- **FR-008**: System MUST render a polygon/radar chart visual representation illustrating the advanced team efficiency profile positioned below the player roster list.
- **FR-009**: System MUST safeguard all advanced metric calculations against division by zero, outputting `0` or `0.0%` gracefully.
- **FR-010**: System MUST provide an `Edit` action button on the Match Detail View.
- **FR-011**: Tapping the `Edit` button MUST provide an edit mode interface allowing the user to modify:
  - Period scores (team and rival) for all periods.
  - Period fouls (team and rival) for all periods.
  - Player individual statistics (minutes, makes, misses, rebounds, assists, turnovers, steals, fouls).
- **FR-012**: When edits are saved, the system MUST persist the updated values to storage and immediately recalculate dependent values (total scores, player valuations, roster ordering, and team advanced analytics).
- **FR-013**: System MUST provide a cancel option in edit mode that discards all uncommitted modifications.
- **FR-014**: System MUST provide a back/return navigation action allowing the user to return to the match list.
- **FR-015**: In the match list (`GameList`), selecting a finished match MUST navigate directly to this `Match Detail View`, while selecting a pending match continues to navigate to `PlayMatch`.

### Key Entities

- **Match Record**: Represents the completed basketball match, including opponent name, date, final status, cumulative scores, and period-by-period points and fouls for both teams.
- **Period Breakdown**: Represents the per-quarter data structure capturing team score, team fouls, rival score, and rival fouls for each period (`q1`, `q2`, `q3`, `q4`, `extra`).
- **Player Match Statistics**: Represents an individual player's performance in the specific match, containing minutes played, field goal attempts and makes (1pt, 2pt, 3pt), offensive and defensive rebounds, assists, steals, turnovers, personal fouls, total points, and computed valuation score.
- **Team Advanced Analytics**: Represents the derived tactical efficiency metrics (`Posesiones`, `OER`, `DER`, `eFG%`, `ORB%`, `AST%`, `TOV%`, `FTR`) computed dynamically from aggregated match statistics.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can inspect the final score and period breakdown within 1 second of selecting a completed match.
- **SC-002**: 100% of advanced statistical formulas produce mathematically exact results conforming to the provided domain formulas for any valid match dataset.
- **SC-003**: 100% of division-by-zero boundary conditions (e.g., zero possessions, zero attempts) resolve cleanly without application freeze or error messages.
- **SC-004**: The player roster displays in strictly descending order by Valuation in 100% of test scenarios.
- **SC-005**: Users can complete and save an edit to period scores, period fouls, or player statistics in under 30 seconds with immediate UI synchronization.
- **SC-006**: All visual elements (header, period breakdown, roster list, polygon chart, edit controls) render legibly across both phone and tablet viewport sizes.

## Assumptions

- Matches marked with status `finished` have persisted score and statistic data ready for inspection.
- The formula for Valuation (`Value`) follows the standard basketball formula: `(Points + Rebounds + Assists + Steals + Blocks + Fouls Drawn) - (Missed Field Goals + Missed Free Throws + Turnovers + Personal Fouls Committed)` as logged during the match.
- Free throw attempts (`total 1 point Attempts`) in formulas equals `1PM + 1PI` (succeeded + missed), and field goal attempts equal `2PM + 2PI` and `3PM + 3PI`.
- Team fouls per period can be edited and persisted alongside period scores.
- The polygon chart visually maps normalized values of the 8 metrics to provide an intuitive visual radar polygon alongside clear numeric readout badges.
