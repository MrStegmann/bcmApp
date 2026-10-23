# Feature Specification: Play Match View

**Feature Branch**: `007-play-match-view`

**Created**: 2026-10-02

**Last Updated**: 2026-10-24

**Status**: Draft

**Input**:
- Original: "The task is to create an organic game panel control and stats separated into three components with global state management for score, time, and team foul control. Component 1 (Time, Score, and Fouls): controls periods (q1, q2, q3, q4, extra) with single tap to swap to next period and 3-second hold to show period list modal; total score calculated from period scores, isolated score/time/team fouls per period; crono with single tap start/stop and 3-second hold to set manually; 10min per regular period, 5min for extra time with reset crono to 5min without wiping score/fouls. Component 2 (Team Management): half basketball court canvas with 5 position buttons representing active quintet; tapping opens stats modal (t1a, t1i, t2a, t2i, t3a, t3i with assist teammate prompt including 'non assistant' option on t2a/t3a; offensive & defensive rebounds both present; fouls adding to period team fouls; assists, ball lost, ball recuperation); active players auto-accumulate minutes when crono runs; team panel with Swap button activating balanced substitution mode (N in = N out); players represented by circles showing jerseyNumber, name, minutos, and pts; horizontal bench list; timeout control buttons (increase/decrease) in same row as Swap button (2 timeouts for q1-q2, 3 for q3-q4, 1 for extra time, +1 on extra crono reset). Component 3 (Rival Panel Control): rival score adjustments (+1, +2, +3, -1) and rival period team fouls (+1, -1)."
- Update (2026-10-24): "The task is to update the player identification showed in the view. It must show always the Jersey Number if has; if not, use the first letter of the Player Name following the lastName (e.g.: A. Arias, A. Delgado, P. Stegmann, etc.). Includes jersey number priority check, fallback name formatting utility, edge case handling, and unit test assertions."

## Clarifications

### Session 2026-10-03
- Q: When the user taps an unassigned (empty) position slot on the half-court canvas, what behavior should be triggered? → A: Open a quick player selector modal to assign an available bench player directly to that empty position.

### Session 2026-10-24 (Player Identification Update)
- Q: When a player has an assigned Jersey Number, how should player identification be displayed in player circles? → A: When a player has an assigned Jersey Number, the view exclusively displays the Jersey Number (omitting redundant name labels).
- Q: How should the view handle a player without a Jersey Number (missing, null, or empty string)? → A: Trigger the fallback name format `[First Initial]. [Last Name]` (e.g., `A. Arias`, `A. Delgado`, `P. Stegmann`).
- Q: How should edge cases (missing first name, missing last name, extraneous whitespace) be handled? → A: Safe fallback handling: trim whitespace; if first name is missing, display last name; if last name is missing, display first name; if both are absent, display a neutral default label (`"Jugador"`) without breaking circle layout or throwing runtime errors.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Game Clock, Period Control & Isolated Period Scoring (Priority: P1)

As a coach or scorekeeper, I want a dedicated controller for game periods (`q1`, `q2`, `q3`, `q4`, `extra`), chronometer, period scores, and team fouls so that time and scoring are accurately tracked and isolated per period with total score computed automatically.

**Why this priority**: Precise period and clock management is the central driver for live match recording, player minute accumulation, and quarter-by-quarter score isolation.

**Independent Test**: Can be tested independently by starting/stopping the timer via single tap, manually setting the timer via 3-second hold, advancing periods via single tap, selecting arbitrary periods via 3-second hold modal, logging period points/fouls, and resetting extra time to 5:00 while verifying scores and team fouls remain preserved.

**Acceptance Scenarios**:

1. **Given** the chronometer is paused, **When** the user taps the crono widget once, **Then** the timer starts running and active on-court players accumulate minutes.
2. **Given** the chronometer is running, **When** the user taps the crono widget once, **Then** the timer pauses and player minute accumulation halts.
3. **Given** the crono widget, **When** the user presses and holds the widget for 3 seconds, **Then** a manual time input modal opens allowing the user to configure the remaining period time.
4. **Given** the active period indicator, **When** the user taps it once, **Then** the game advances to the next period in sequence (`q1` -> `q2` -> `q3` -> `q4` -> `extra`).
5. **Given** the active period indicator, **When** the user presses and holds it for 3 seconds, **Then** a modal opens listing all available periods (`q1`, `q2`, `q3`, `q4`, `extra`) allowing direct period selection.
6. **Given** periods `q1` through `q4`, **When** initialized, **Then** each period clock defaults to 10:00 (10 minutes) with isolated period scores and period team fouls.
7. **Given** the game is in `extra` time (initialized to 5:00), **When** the user triggers the crono reset action, **Then** the timer resets to 5:00, all current period scores and team fouls remain intact, and 1 additional timeout is granted.
8. **Given** scores recorded in individual periods, **When** viewing the scoreboard, **Then** the total score dynamically reflects the sum of all period scores.

---

### User Story 2 - Court Canvas & Player In-Game Statistics Logging (Priority: P1)

As a coach, I want an interactive half basketball court displaying 5 position buttons for the active quintet where tapping any player opens a comprehensive statistics modal, so that I can quickly record shooting attempts, makes, assists, rebounds, fouls, turnovers, and steals.

**Why this priority**: Fast and accurate player stat recording is essential during live match play. Automatic score updates, foul linking, and assist prompts reduce coach cognitive overhead.

**Independent Test**: Can be tested by tapping any court player button, selecting shooting stats (`t1a`/`t1i`/`t2a`/`t2i`/`t3a`/`t3i`), verifying assist prompts for made 2pt/3pt shots, recording offensive/defensive rebounds, recording fouls (and verifying clock stop + period team foul increment), and recording steals/turnovers/assists.

**Acceptance Scenarios**:

1. **Given** the half basketball court canvas, **When** viewed during the game, **Then** 5 player positions are rendered as interactive buttons showing player circles with player identification (Jersey Number exclusively when present, or formatted fallback `[First Initial]. [Last Name]` when absent), `minutos`, and `pts` (or empty placeholder if unassigned).
2. **Given** an empty court position slot is tapped, **When** the slot is unassigned, **Then** a quick player selector modal opens displaying available bench players to assign to that position.
3. **Given** an assigned on-court player button is tapped, **When** the stats modal opens, **Then** options for `t1a`, `t1i`, `t2a`, `t2i`, `t3a`, `t3i`, offensive rebound, defensive rebound, foul (`fault`), assist (`asis`), ball lost (`lost`), and ball recovery (`recovers`) are presented.
4. **Given** the user selects `t1a`, `t2a`, or `t3a`, **When** the action is registered, **Then** the player's points increase by 1, 2, or 3, the current period score increments accordingly, and the total match score updates.
5. **Given** the user selects `t2a` or `t3a`, **When** the shot is confirmed, **Then** the modal transitions to an assist selection view showing active on-court teammates and a "non assistant" ("No Assistant") option.
6. **Given** the user selects an assisting teammate, **When** confirmed, **Then** the assist is credited to the selected player and the modal closes; selecting "non assistant" records the basket without assist credit.
7. **Given** the user selects `t1i`, `t2i`, or `t3i`, **When** recorded, **Then** the missed shot attempt is logged for the player without adding points to player or team score.
8. **Given** both "Offensive Rebound" and "Defensive Rebound" options exist in the stats modal, **When** either is tapped, **Then** the corresponding rebound category is incremented for the player.
9. **Given** the user records a foul (`fault`), **When** confirmed, **Then** the player's personal foul count increments, the current period's team fouls increment by 1, and the running crono automatically pauses.
10. **Given** the chronometer is running, **When** time elapses, **Then** all 5 active on-court players automatically accumulate played minutes/seconds.
11. **Given** an assigned player on the court, **When** the player has an assigned Jersey Number, **Then** the view exclusively displays the Jersey Number for player identification in the player circle.
12. **Given** an assigned player on the court, **When** the player does not have an assigned Jersey Number (absent, null, or empty string), **Then** the view displays the player's name in `[First Initial]. [Last Name]` format (e.g., `A. Arias`, `A. Delgado`, `P. Stegmann`) without layout breaks.

---

### User Story 3 - Team Management, Bench, Swap Mode & Timeout Control (Priority: P2)

As a coach, I want a team management panel beneath the court canvas with a horizontal bench list, a balanced substitution "Swap" mode, and quota-governed timeout controls so that player rotations and tactical breaks are strictly and intuitively managed.

**Why this priority**: Substitutions must strictly preserve a valid 5-player court lineup without runtime corruption. Timeouts must enforce official phase rules (first half, second half, overtime) to prevent rule violations.

**Independent Test**: Can be tested by putting players on the bench, activating Swap mode, selecting unequal players (verifying swap prevention), selecting equal N in / N out players (verifying successful lineup change), and adjusting timeouts across Q1/Q2 (max 2 total), Q3/Q4 (max 3 total), and Extra Time (1 + resets).

**Acceptance Scenarios**:

1. **Given** the team management panel below the court canvas, **When** rendered, **Then** the bench is displayed as a horizontal scrollable list of player circles, each showing player identification (Jersey Number exclusively if present, or fallback `[First Initial]. [Last Name]` if absent/empty), `minutos`, and `pts`.
2. **Given** the coach taps the "Swap" button, **When** Swap Mode activates, **Then** the coach can select on-court quintet players to bench and bench players to enter the court.
3. **Given** Swap Mode is active, **When** the coach selects unequal counts (e.g., 2 bench players but only 1 court player), **Then** confirming the substitution is disabled with a requirement notice that substitutions must be equal (N in = N out).
4. **Given** equal numbers of bench and court players are selected (and the clock is stopped), **When** confirmed, **Then** the selected bench players move to the court, selected court players move to the bench, and Swap Mode exits.
5. **Given** the timeout control buttons (increase `+` and decrease `-`) positioned in the same row as the Swap button (spaced between), **When** viewed during periods `q1` or `q2`, **Then** the user has a combined pool of 2 timeouts total for the first half (using 2 timeouts in `q1` leaves 0 for `q2`).
6. **Given** the match transitions to period `q3` or `q4`, **When** the timeout quota is evaluated, **Then** the user receives a combined pool of 3 timeouts total for the second half.
7. **Given** the match enters `extra` time, **When** evaluated, **Then** 1 timeout is allocated for extra time, and each subsequent extra time crono reset adds +1 additional timeout.
8. **Given** timeout remaining is at 0, **When** the coach taps decrease timeout, **Then** the action is prevented (cannot drop below 0).
9. **Given** a player on the bench, **When** the player has an assigned Jersey Number, **Then** the circle exclusively displays the Jersey Number; **When** the player lacks a Jersey Number, **Then** the circle displays the formatted name fallback `[First Initial]. [Last Name]`.

---

### User Story 4 - Rival Control Panel (Priority: P2)

As a coach or scorekeeper, I want a dedicated rival control panel to adjust rival period score (+1, +2, +3, -1) and rival period team fouls (+1, -1), so that rival game progress is tracked accurately in parallel.

**Why this priority**: Keeping an accurate rival score and foul count per period is essential for real-time score differential, bonus foul situations, and match history.

**Independent Test**: Can be tested by tapping rival score buttons (+1, +2, +3, -1) and verifying that the active period rival score and total rival score update, and tapping rival foul buttons (+1, -1) to verify active period rival fouls update and foul additions stop the running clock.

**Acceptance Scenarios**:

1. **Given** the rival control panel, **When** the user taps `+1`, `+2`, or `+3`, **Then** the rival score for the current period increments by that amount and the rival total score increases.
2. **Given** the rival control panel, **When** the user taps `-1`, **Then** the rival score for the current period decrements by 1 (floor at 0) and the rival total score updates.
3. **Given** the rival control panel, **When** the user taps `+1 Foul`, **Then** the rival team fouls for the current period increment by 1, and if the crono was running, it pauses automatically.
4. **Given** the rival control panel, **When** the user taps `-1 Foul`, **Then** the rival team fouls for the current period decrement by 1 (floor at 0).
5. **Given** a period transition, **When** switching periods, **Then** the rival panel reflects the isolated rival period score and rival period team fouls for the newly selected period.

---

### Edge Cases

- **Starting Match with No Initial Lineup**: If a match is opened and fewer than 5 players are assigned to the quintet, the court canvas indicates empty positions. Tapping an empty position opens a quick player selector modal to assign an available bench player directly.
- **Attempting Substitution While Clock Running**: If the coach tries to activate Swap mode or execute substitutions while the timer is running, the system requires pausing the clock first.
- **Clock Reaching 00:00 in Regular Quarters (`q1`-`q4`)**: Chronometer stops automatically at 00:00; player minute accumulation stops; user can advance to the next period.
- **Clock Reaching 00:00 in Extra Time (`extra`)**: The user can reset the crono to 5:00, which preserves all accumulated scores, team fouls, and player statistics while adding +1 timeout.
- **Player Disqualification on 5 Personal Fouls**: When a player reaches 5 personal fouls, a visual warning alerts the coach to substitute the player out.
- **Assist Attribution Options**: On any made 2pt or 3pt shot, the user can choose any of the other 4 on-court teammates or select "non assistant" ("No Assistant").
- **Manual Time Entry Bounds**: Manual time configuration cannot accept negative numbers or values exceeding the maximum period duration (10:00 for regular periods, 5:00 for extra time).
- **Score and Foul Underflow**: Decrementing scores or fouls below 0 is disallowed.
- **Player Lacks Jersey Number**: When a player object has no jersey number (`null`, `undefined`, or empty/whitespace string `""`), the identification area triggers the fallback format `[First Initial]. [Last Name]`.
- **Player Missing First Name or Last Name in Fallback**: If a player has no jersey number and lacks a first name, the fallback displays `[Last Name]`; if the player lacks a last name, it displays `[First Name]`; if both are missing or empty, a neutral fallback (`"Jugador"`) is rendered safely without throwing runtime errors or breaking the circle layout.
- **Player Names with Leading or Trailing Whitespace**: Whitespace is trimmed before extracting the initial and constructing the formatted string (e.g., `"  Alex  "` and `" Arias "` produce `"A. Arias"`).

## Requirements *(mandatory)*

### Functional Requirements

#### Component 1: Time, Score, and Fouls Controller & Global Header
- **FR-001**: System MUST manage 5 game periods: `q1`, `q2`, `q3`, `q4`, and `extra`.
- **FR-002**: Tapping the period indicator once MUST advance to the next period in sequence (`q1` -> `q2` -> `q3` -> `q4` -> `extra`).
- **FR-003**: Pressing and holding the period indicator for 3 seconds MUST open a period selection modal displaying all available periods for direct selection.
- **FR-005**: Application Header MUST display the live match score formatted as `${teamName} ${teamTotalScore} - ${rivalTotalScore} ${rivalName}` without text truncation (wrapping team names over new lines as needed), integrated with a "go back arrow" icon button to exit and a "save" icon button to finalize/save the match, replacing any internal duplicate view header.
- **FR-005b**: Component 1 (Time, Score, and Fouls Controller) MUST render ONLY the current period score and current period team fouls for both teams.
- **FR-006**: Regular periods (`q1` through `q4`) MUST initialize with a duration of 10 minutes (10:00), and `extra` time MUST initialize with a duration of 5 minutes (05:00).
- **FR-007**: Tapping the crono widget once MUST toggle between starting and pausing the timer.
- **FR-008**: Pressing and holding the crono widget for 3 seconds MUST open a manual time entry modal to adjust remaining minutes and seconds.
- **FR-009**: In `extra` time, the crono reset action MUST be rendered strictly as an Icon and MUST only be enabled when the extra time crono is at 00:00 (restores timer to 5:00 without wiping score/fouls).
- **FR-010**: Resetting the extra time crono MUST grant +1 additional timeout to the user's available timeout count.

#### Component 2: Team Management & Court Canvas
- **FR-011**: System MUST render an interactive half basketball court canvas with 5 position buttons representing the active on-court quintet (showing empty states if unassigned; tapping an empty slot opens a quick player selector modal to assign a bench player).
- **FR-012**: Tapping any active on-court player button MUST open the player statistics modal.
- **FR-013**: The player statistics modal MUST provide options for:
  - `t1a` (1-point made) and `t1i` (1-point missed)
  - `t2a` (2-point made) and `t2i` (2-point missed)
  - `t3a` (3-point made) and `t3i` (3-point missed)
  - `offensive rebound` (offensive rebound) and `defensive rebound` (defensive rebound)
  - `fault` (personal foul)
  - `asis` (assist)
  - `lost` (ball lost / turnover)
  - `recovers` (ball recuperation / steal)
- **FR-014**: Recording `t1a`, `t2a`, or `t3a` MUST increment the player's personal points, the active period's team score, and the total match score by 1, 2, or 3 points respectively.
- **FR-015**: Recording `t2a` or `t3a` MUST transition the modal to an assist prompt listing on-court teammates and a "non assistant" option.
- **FR-016**: Recording a personal foul (`fault`) MUST increment the player's personal fouls, increment the active period's team fouls by 1, and automatically pause the running chronometer.
- **FR-017**: All 5 on-court quintet players MUST automatically accumulate playing time (`minutos`) in real time while the chronometer is running.
- **FR-018**: Each player circle (on court and on bench) MUST visually format player identification and match stats:
  1. **Player Identification**:
     - When a player has an assigned Jersey Number, the view MUST exclusively display the Jersey Number (e.g., `#23` or `23`) as the primary identifier.
     - When a player does NOT have an assigned Jersey Number (absent, null, undefined, or empty/whitespace string), the view MUST display the player's name in `[First Initial]. [Last Name]` format (e.g., `A. Arias`, `A. Delgado`, `P. Stegmann`).
  2. Divisor line below player identifier.
  3. Player minutes and points in `${min}min / ${pts}pts` format below divisor line.
- **FR-018a**: Name formatting fallback MUST safely handle edge cases (missing first name, missing last name, trailing/leading spaces, empty strings) without causing UI layout breaks or runtime errors.
- **FR-019**: Bench players MUST be displayed in a horizontal scrollable list beneath the court canvas.
- **FR-020**: System MUST provide a "Swap" button that activates Swap Mode for player substitutions between the court quintet and the bench.
- **FR-021**: Swap Mode MUST allow selecting multiple court and bench players and enforce balanced substitutions ($N\text{ in} = N\text{ out} \ge 1$) when confirming.
- **FR-022**: Player substitutions MUST be restricted to when the chronometer is paused.
- **FR-023**: System MUST provide timeout increase (`+`) and decrease (`-`) controls positioned in the same row as the Swap button (spaced between).
- **FR-024**: System MUST enforce timeout quota allocations:
  - 2 timeouts total across periods `q1` and `q2` combined.
  - 3 timeouts total across periods `q3` and `q4` combined.
  - 1 timeout for `extra` time, plus 1 additional timeout for each extra time crono reset.

#### Component 3: Rival Panel Control
- **FR-025**: System MUST provide a rival control panel allowing the user to add (+1, +2, +3) or subtract (-1) points from the rival's active period score.
- **FR-026**: System MUST allow the user to add (+1) or subtract (-1) team fouls from the rival's active period team fouls.
- **FR-027**: Adding a rival team foul (+1) MUST automatically pause the running chronometer.
- **FR-028**: Rival period scores and fouls MUST be isolated per period and aggregate into the total rival match score.

#### Global State Management
- **FR-029**: System MUST manage a centralized global state store containing: active period, period states (time, scores, fouls for home and rival across `q1`, `q2`, `q3`, `q4`, `extra`), chronometer status, timeouts remaining, on-court quintet roster, bench roster, and detailed player statistics.

### Key Entities

- **MatchSession**: Central entity managing the overall match state, active period identifier (`q1`, `q2`, `q3`, `q4`, `extra`), total home score, total rival score, chronometer running state, available timeouts, and associations to period states and player rosters.
- **PeriodState**: Represents an isolated period (`q1`, `q2`, `q3`, `q4`, `extra`) containing remaining duration (seconds), home period score, rival period score, home period team fouls, and rival period team fouls.
- **PlayerRosterState**: Manages the separation between the active on-court quintet (exactly 5 positions) and the bench player list.
- **PlayerMatchStats**: Contains individual cumulative stats for each player in the match: `jerseyNumber` (optional/nullable string), `firstName` (string), `lastName` (string), `minutes` (seconds played), `pts` (total points), `t1a` (1pt made), `t1i` (1pt missed), `t2a` (2pt made), `t2i` (2pt missed), `t3a` (3pt made), `t3i` (3pt missed), `offensiveRebounds`, `defensiveRebounds`, `fouls`, `assists`, `lost` (turnovers), and `recovers` (steals).
- **TimeoutState**: Tracks remaining timeout budget partitioned by game phase (First Half: `q1`/`q2` pool of 2; Second Half: `q3`/`q4` pool of 3; Extra Time: pool of 1 + reset increments).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Single-tap and 3-second long-press interactions on the period indicator and crono widget trigger their respective actions (period advance/modal, timer toggle/modal) reliably within 100ms of trigger completion.
- **SC-002**: 100% of recorded made shots (`t1a`, `t2a`, `t3a`) immediately update player points, period score, and total team score without discrepancies.
- **SC-003**: 100% of recorded personal fouls and rival fouls increment period team fouls and immediately halt the running chronometer.
- **SC-004**: Assist prompt appears for 100% of made 2pt and 3pt shots and allows selecting either an active on-court teammate or "non assistant".
- **SC-005**: Swap Mode strictly prevents 100% of unbalanced substitutions, guaranteeing exactly 5 active players on the court at all times.
- **SC-006**: Extra time crono reset restores the clock to 5:00 and grants +1 timeout while maintaining 100% data integrity for all existing period scores, team fouls, and player stats.
- **SC-007**: Timeout allocations strictly enforce 2 for `q1`-`q2`, 3 for `q3`-`q4`, and 1 for `extra` (plus resets).
- **SC-008**: Live player minute accumulation accurately tallies seconds for all 5 on-court players while the timer is running.
- **SC-009**: 100% of player circles (court and bench) display exclusively the Jersey Number when an assigned jersey number is present.
- **SC-010**: 100% of player circles for players without a jersey number display the fallback `[First Initial]. [Last Name]` safely, with 0 runtime exceptions or layout distortion across edge-case name inputs.

## Assumptions

- Standard regular quarters (`q1`-`q4`) have a 10-minute duration (10:00) and extra time (`extra`) has a 5-minute duration (05:00).
- Timeouts in the first half (`q1`-`q2`) share a single pool of 2 timeouts; unused timeouts in `q1` roll over to `q2`, but none roll over from `q2` to `q3`.
- Timeouts in the second half (`q3`-`q4`) share a single pool of 3 timeouts; unused timeouts do not roll over to extra time.
- Extra time starts with 1 timeout, and each reset of the extra time crono adds +1 timeout to the available count.
- Rival tracking is focused on period score adjustments (+1, +2, +3, -1) and period team fouls (+1, -1); individual rival player stats are not tracked in this panel.
- On-court quintet is strictly limited to 5 players; substitutions can only be performed when the chronometer is paused.
- When a player has an assigned Jersey Number, the view exclusively displays the Jersey Number, omitting any redundant player name text to maximize circle clarity and legibility on mobile screens.
- Fallback name abbreviation adheres to standard format `[First Initial]. [Last Name]` (e.g., `A. Arias`), trimming surrounding whitespace and capitalizing the initial.
