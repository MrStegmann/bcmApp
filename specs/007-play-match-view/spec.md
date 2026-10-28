# Feature Specification: Play Match View

**Feature Branch**: `007-play-match-view`

**Created**: 2026-10-02

**Last Updated**: 2026-10-28

**Status**: IMPLEMENTED

**Input**:
- Original: "The task is to create an organic game panel control and stats separated into three components with global state management for score, time, and team foul control. Component 1 (Time, Score, and Fouls): controls periods (q1, q2, q3, q4, extra) with single tap to swap to next period and 3-second hold to show period list modal; total score calculated from period scores, isolated score/time/team fouls per period; crono with single tap start/stop and 3-second hold to set manually; 10min per regular period, 5min for extra time with reset crono to 5min without wiping score/fouls. Component 2 (Team Management): half basketball court canvas with 5 position buttons representing active quintet; tapping opens stats modal (t1a, t1i, t2a, t2i, t3a, t3i with assist teammate prompt including 'non assistant' option on t2a/t3a; offensive & defensive rebounds both present; fouls adding to period team fouls; assists, ball lost, ball recuperation); active players auto-accumulate minutes when crono runs; team panel with Swap button activating balanced substitution mode (N in = N out); players represented by circles showing jerseyNumber, name, minutos, and pts; horizontal bench list; timeout control buttons (increase/decrease) in same row as Swap button (2 timeouts for q1-q2, 3 for q3-q4, 1 for extra time, +1 on extra crono reset). Component 3 (Rival Panel Control): rival score adjustments (+1, +2, +3, -1) and rival period team fouls (+1, -1)."
- Update (2026-10-24 - Player Identification): "The task is to update the player identification showed in the view. It must show always the Jersey Number if has; if not, use the first letter of the Player Name following the lastName (e.g.: A. Arias, A. Delgado, P. Stegmann, etc.). Includes jersey number priority check, fallback name formatting utility, edge case handling, and unit test assertions."
- Update (2026-10-24 - Stint Tracking, Rival Layout, Long-Press Stat Subtraction, Unrestricted Substitutions): "The task is to update the quintet that are over the court (playing). Actually, the quintet have the total of minuts and points. We need to change the minuts showed for: count only the minuts the player have played since he enter to play. That means, if the player was in the bench and enter to play, the minuts showed start from 0 and increase all the time he's playing. When the player go to the bench and return to playing, the time reset to 0. In addition, the rival control section has the total points that the rival has, this part shall be removed (it is not necesary) and extends the rival panel control to use the full width. We also need substract stats from the players by holding over the player by 2 seconds (only players that are playing). If a player that has scored 2 or 3 points and have assistant from other, the assist will be automaticaly substract too. For changin players, it must be able whenever the time is running or not."
- Update (2026-10-25 - Bench Player Statistics Modal): "The task is to add a stats information modal for the players that are in the bench. This modals can be open by clicking over a player in the bench and can be closed clicking over a cross button or clicking outside the modal. The modal MUST show every stat with the minuts and points ontop and must visible than others. Also must show every throd made (1, 2, 3) with succeed / attempt and porcentage (s/a (#%) format expected). Includes player click handler on bench items, modal shell with cross button & backdrop click-outside dismissal, header layout prominently displaying minutes and points at the top, throw statistics formatter for 1pt, 2pt, 3pt in s/a (#%) format, and visual layering for high prominence."
- Update (2026-10-28 - Design Refactorization: Responsive Layout, Scaled Player Circles, Overtime Reset Relocation & Prominent Total Score Header): "The actual Play Match View Page has serious layout size problems. For Phones that are small, the players over the court is push down behind the bench panel control and the scale of the court canvas is no responsive. The Players are extremely big. In addition, the reset time in extra push down the canvas. The App header with the total result of the match is too small. What we need: We need a responsive design for the Play Match View; We need smallest players (the five over the court & the ones in the bench); The reset button for the time in extra period must be removed and putted inside the crono configuration (3second tapped in the 'Ajustar Tiempo' modal view as a option in the modal; The App Header only must show the total score (without the team names) and biggest."

## Clarifications

### Session 2026-10-03
- Q: When the user taps an unassigned (empty) position slot on the half-court canvas, what behavior should be triggered? → A: Open a quick player selector modal to assign an available bench player directly to that empty position.

### Session 2026-10-24 (Player Identification Update)
- Q: When a player has an assigned Jersey Number, how should player identification be displayed in player circles? → A: When a player has an assigned Jersey Number, the view exclusively displays the Jersey Number (omitting redundant name labels).
- Q: How should the view handle a player without a Jersey Number (missing, null, or empty string)? → A: Trigger the fallback name format `[First Initial]. [Last Name]` (e.g., `A. Arias`, `A. Delgado`, `P. Stegmann`).
- Q: How should edge cases (missing first name, missing last name, extraneous whitespace) be handled? → A: Safe fallback handling: trim whitespace; if first name is missing, display last name; if last name is missing, display first name; if both are absent, display a neutral default label (`"Jugador"`) without breaking circle layout or throwing runtime errors.

### Session 2026-10-24 (Stint Minutes, Rival Layout, Stat Subtraction & Unrestricted Substitutions)
- Q: Does the stint duration replace total cumulative match minutes for saved match records? → A: No. Total cumulative minutes (`secondsPlayed`) continue to accumulate in the background for permanent database records and match box scores. The stint duration (`stintSeconds`) is the displayed metric for active court players showing time played in the current continuous on-court stint starting from 0, resetting to 0 whenever benched and re-entering the court.
- Q: How is stat subtraction triggered on court players, and can bench players be subtracted via long-press? → A: A 2-second hold gesture listener on active on-court players triggers the stat subtraction interface. Bench players do NOT trigger or allow stat subtraction via long-press.
- Q: What happens to an attributed assist when a made 2-point or 3-point score is decremented? → A: Decrementing a made 2-point or 3-point basket automatically decrements the attributed assist from the assisting teammate (cascading assist subtraction), alongside deducting points from the scorer, the period score, and the total match score.
- Q: What changes in the Rival Control Section layout? → A: The rival total points counter element is completely removed from the rival control component, and the panel is styled to extend and occupy 100% of the container width.
- Q: When can player substitutions be executed? → A: Substitutions can be initiated and confirmed at any time, whether the match chronometer is running or stopped/paused.

### Session 2026-10-25 (Bench Player Statistics Modal)
- Q: When is the bench player statistics modal triggered? → A: Tapping a player in the horizontal bench list while Swap Mode is inactive opens the bench player statistics modal for that player. When Swap Mode is active, tapping a bench player continues to toggle selection for substitution.
- Q: What actions can be performed inside the bench player statistics modal? → A: The bench player statistics modal is strictly an informational (read-only) overview of the player's cumulative game statistics; live stat recording and stat subtraction are exclusively available for active on-court players.
- Q: How are throw statistics formatted when attempts equal zero? → A: When total attempts are 0 (0 made out of 0 attempts), the display shows `0/0 (0%)`.
- Q: How can the modal be dismissed? → A: By tapping the cross (`✕`) button in the modal header, or by tapping anywhere on the backdrop overlay outside the modal container.
- Q: What statistics are included in the modal? → A: Top header: player identification, total cumulative minutes, and points scored (with highest visual prominence). Body: throw statistics for 1-point, 2-point, and 3-point categories in `s/a (#%)` format (`succeed / attempt (#%)`), plus rebounds (offensive, defensive, total), assists, steals/recoveries, turnovers/lost balls, personal fouls, and valuation.

### Session 2026-10-28 (Design Refactorization: Responsive Layout, Scaled Player Circles, Overtime Reset Relocation & Prominent Total Score Header)
- Q: How should the App Header display the match score? → A: The App Header displays exclusively the total match score (e.g., `102 - 98`), completely omitting local and rival team names, rendered in significantly larger and high-contrast typography to maximize readability at a glance.
- Q: Where is the extra-time reset button located after refactoring? → A: The standalone reset button is completely removed from the main screen layout (crono / period bar). The extra-time reset action is relocated inside the "Ajustar Tiempo" (Time Adjustment) modal view (accessible via a 3-second hold on the chronometer), available as an explicit option when adjusting extra time.
- Q: How does the court canvas adapt to compact or small phone screens? → A: The half-court canvas and surrounding layout scale fluidly and responsively to the available viewport height and width, preventing vertical overflow, canvas distortion, or court players from being pushed down behind or obscured by the bench panel.
- Q: How are player circles (on court and on bench) sized after refactoring? → A: All player circle representations (the 5 active on-court players and players in the horizontal bench list) are scaled down to a noticeably smaller, compact diameter, fitting cleanly within the viewport without colliding with other elements while preserving clear legibility of player identifiers and key metrics.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Game Clock, Period Control & Isolated Period Scoring (Priority: P1)

As a coach or scorekeeper, I want a dedicated controller for game periods (`q1`, `q2`, `q3`, `q4`, `extra`), chronometer, period scores, and team fouls so that time and scoring are accurately tracked and isolated per period with total score computed automatically, without interface clutter or layout distortion during extra time.

**Why this priority**: Precise period and clock management is the central driver for live match recording, player minute accumulation, and quarter-by-quarter score isolation.

**Independent Test**: Can be tested independently by starting/stopping the timer via single tap, manually setting the timer via 3-second hold, advancing periods via single tap, selecting arbitrary periods via 3-second hold modal, logging period points/fouls, verifying the main screen layout remains free of standalone reset buttons during extra time, and resetting extra time to 5:00 from within the "Ajustar Tiempo" modal while verifying scores and team fouls remain preserved.

**Acceptance Scenarios**:

1. **Given** the chronometer is paused, **When** the user taps the crono widget once, **Then** the timer starts running and active on-court players accumulate both cumulative minutes and current stint minutes.
2. **Given** the chronometer is running, **When** the user taps the crono widget once, **Then** the timer pauses and player minute accumulation halts.
3. **Given** the crono widget, **When** the user presses and holds the widget for 3 seconds, **Then** the "Ajustar Tiempo" modal opens allowing the user to configure remaining time.
4. **Given** the active period indicator, **When** the user taps it once, **Then** the game advances to the next period in sequence (`q1` -> `q2` -> `q3` -> `q4` -> `extra`).
5. **Given** the active period indicator, **When** the user presses and holds it for 3 seconds, **Then** a modal opens listing all available periods (`q1`, `q2`, `q3`, `q4`, `extra`) allowing direct period selection.
6. **Given** periods `q1` through `q4`, **When** initialized, **Then** each period clock defaults to 10:00 (10 minutes) with isolated period scores and period team fouls.
7. **Given** the game is in `extra` time, **When** viewed on the main screen, **Then** no standalone extra-time reset button is displayed in the main interface layout (preventing layout expansion or canvas displacement).
8. **Given** the game is in `extra` time, **When** the user opens the "Ajustar Tiempo" modal (via 3-second hold on the chronometer) and triggers the extra-time reset option, **Then** the timer resets to 5:00, all current period scores and team fouls remain intact, and 1 additional timeout is granted.
9. **Given** scores recorded in individual periods, **When** viewing the scoreboard, **Then** the total score dynamically reflects the sum of all period scores.

---

### User Story 2 - Court Canvas, Stint Tracking & Player Statistics Logging/Subtraction (Priority: P1)

As a coach, I want an interactive half basketball court displaying 5 position buttons for the active quintet showing each player's current continuous stint minutes and points, where tapping opens a stat recording modal and holding for 2 seconds opens a stat subtraction action with automatic cascading assist deduction, so that in-game performance is precisely recorded and quickly corrected.

**Why this priority**: Fast, accurate stat recording and effortless error correction are essential during live match play. Real-time stint tracking informs coaches of current player fatigue on the floor.

**Independent Test**: Can be tested by tapping any court player button to record shots/fouls/rebounds/assists/steals/turnovers, holding an on-court player for 2 seconds to decrement stats, verifying automatic assist deduction when decrementing a 2pt/3pt basket, verifying stint minutes increment while on court and reset to 0 upon benching and returning, and verifying bench players cannot trigger 2-second hold subtraction.

**Acceptance Scenarios**:

1. **Given** the half basketball court canvas, **When** viewed during the game, **Then** 5 player positions are rendered as interactive buttons showing player circles with player identification (Jersey Number exclusively when present, or formatted fallback `[First Initial]. [Last Name]` when absent), current continuous stint duration (`minutos` played in current stint), and `pts` (or empty placeholder if unassigned).
2. **Given** an empty court position slot is tapped, **When** the slot is unassigned, **Then** a quick player selector modal opens displaying available bench players to assign to that position.
3. **Given** an assigned on-court player button is tapped, **When** the stats modal opens, **Then** options for `t1a`, `t1i`, `t2a`, `t2i`, `t3a`, `t3i`, offensive rebound, defensive rebound, foul (`fault`), assist (`asis`), ball lost (`lost`), and ball recovery (`recovers`) are presented.
4. **Given** the user selects `t1a`, `t2a`, or `t3a`, **When** the action is registered, **Then** the player's points increase by 1, 2, or 3, the current period score increments accordingly, and the total match score updates.
5. **Given** the user selects `t2a` or `t3a`, **When** the shot is confirmed, **Then** the modal transitions to an assist selection view showing active on-court teammates and a "non assistant" ("No Assistant") option.
6. **Given** the user selects an assisting teammate, **When** confirmed, **Then** the assist is credited to the selected player and linked to the score event, and the modal closes; selecting "non assistant" records the basket without assist credit.
7. **Given** the user selects `t1i`, `t2i`, or `t3i`, **When** recorded, **Then** the missed shot attempt is logged for the player without adding points to player or team score.
8. **Given** both "Offensive Rebound" and "Defensive Rebound" options exist in the stats modal, **When** either is tapped, **Then** the corresponding rebound category is incremented for the player.
9. **Given** the user records a foul (`fault`), **When** confirmed, **Then** the player's personal foul count increments, the current period's team fouls increment by 1, and the running crono automatically pauses.
10. **Given** the chronometer is running, **When** time elapses, **Then** all 5 active on-court players automatically accumulate stint minutes/seconds from 0 as well as cumulative match minutes.
11. **Given** a player steps onto the court from the bench (via initial starting five, quick assign, or swap), **When** their on-court presence begins, **Then** their displayed stint minute counter starts at `0` and increments while they remain on the court.
12. **Given** a player who was substituted to the bench is later subbed back onto the court, **When** they re-enter the playing quintet, **Then** their displayed stint minute counter resets to `0` for the new stint.
13. **Given** an assigned player currently on the court, **When** the user presses and holds their player circle for 2 seconds, **Then** the stat subtraction action/modal triggers.
14. **Given** the stat subtraction action is triggered for an on-court player, **When** a made 2-point (`t2a`) or 3-point (`t3a`) score is decremented, **Then** the player's personal points, the current period team score, and the total match score are reduced accordingly, and the assist credited to the assisting teammate for that score is automatically decremented.
15. **Given** a player on the bench, **When** the user presses and holds on their circle for 2 seconds, **Then** no stat subtraction action is triggered (bench players cannot trigger long-press subtraction).
16. **Given** an assigned player on the court, **When** the player has an assigned Jersey Number, **Then** the view exclusively displays the Jersey Number for player identification in the player circle.
17. **Given** an assigned player on the court, **When** the player does not have an assigned Jersey Number (absent, null, or empty string), **Then** the view displays the player's name in `[First Initial]. [Last Name]` format (e.g., `A. Arias`, `A. Delgado`, `P. Stegmann`) without layout breaks.

---

### User Story 3 - Team Management, Bench, Unrestricted Swap Mode & Timeout Control (Priority: P2)

As a coach, I want a team management panel beneath the court canvas with a horizontal bench list, quota-governed timeout controls, and a balanced substitution "Swap" mode that can be executed at any time whether the clock is running or stopped, so that rotations are fluid and unrestricted.

**Why this priority**: Coaches frequently prepare or execute substitutions on the fly during both live play and dead ball situations. Eliminating clock-state restrictions prevents artificial blocking while preserving strict 5-player court balance.

**Independent Test**: Can be tested by executing substitutions while the chronometer is running, executing substitutions while the chronometer is paused, verifying incoming players reset their displayed stint timer to 0, verifying bench player circles display minutes and points, and verifying timeout quotas across Q1-Q4 and overtime.

**Acceptance Scenarios**:

1. **Given** the team management panel below the court canvas, **When** rendered, **Then** the bench is displayed as a horizontal scrollable list of player circles, each showing player identification (Jersey Number exclusively if present, or fallback `[First Initial]. [Last Name]` if absent/empty), cumulative match `minutos`, and `pts`.
2. **Given** the coach taps the "Swap" button, **When** the match chronometer is running OR paused, **Then** Swap Mode activates and allows selection of court and bench players.
3. **Given** Swap Mode is active, **When** the coach selects unequal counts (e.g., 2 bench players but only 1 court player), **Then** confirming the substitution is disabled with a requirement notice that substitutions must be equal (N in = N out).
4. **Given** equal numbers of bench and court players are selected, **When** confirmed while the chronometer is running, **Then** the substitution executes immediately: incoming players enter the court with their stint timer starting at `0`, outgoing players move to the bench, the clock continues running uninterrupted, and Swap Mode exits.
5. **Given** equal numbers of bench and court players are selected, **When** confirmed while the chronometer is paused, **Then** the substitution executes immediately with incoming players' stint timer initialized at `0`, and Swap Mode exits.
6. **Given** the timeout control buttons (increase `+` and decrease `-`) positioned in the same row as the Swap button (spaced between), **When** viewed during periods `q1` or `q2`, **Then** the user has a combined pool of 2 timeouts total for the first half (using 2 timeouts in `q1` leaves 0 for `q2`).
7. **Given** the match transitions to period `q3` or `q4`, **When** the timeout quota is evaluated, **Then** the user receives a combined pool of 3 timeouts total for the second half.
8. **Given** the match enters `extra` time, **When** evaluated, **Then** 1 timeout is allocated for extra time, and each subsequent extra time crono reset adds +1 additional timeout.
9. **Given** timeout remaining is at 0, **When** the coach taps decrease timeout, **Then** the action is prevented (cannot drop below 0).
10. **Given** a player on the bench, **When** the player has an assigned Jersey Number, **Then** the circle exclusively displays the Jersey Number; **When** the player lacks a Jersey Number, **Then** the circle displays the formatted name fallback `[First Initial]. [Last Name]`.

---

### User Story 4 - Rival Control Panel (Full-Width, Period Score & Fouls) (Priority: P2)

As a coach or scorekeeper, I want a full-width rival control panel to adjust rival period score (+1, +2, +3, -1) and rival period team fouls (+1, -1) without a redundant total points counter, so that the control interface is spacious, uncluttered, and easy to operate.

**Why this priority**: Total rival points are prominently displayed in the global match header scoreboard. Removing duplicate total points from the bottom control component frees horizontal real estate and creates an accessible, full-width touch layout for rival score and foul adjustments.

**Independent Test**: Can be tested by verifying that the rival control panel spans 100% of the container width, contains no total points counter element, updates active period rival scores (+1, +2, +3, -1), updates active period rival fouls (+1, -1), and pauses running clock on foul increment.

**Acceptance Scenarios**:

1. **Given** the rival control panel, **When** rendered, **Then** the panel extends to occupy the full available width (100% width) of the parent container.
2. **Given** the rival control panel, **When** inspected, **Then** the rival total points counter element is completely absent from the component UI (only current period rival score and current period rival fouls are displayed).
3. **Given** the rival control panel, **When** the user taps `+1`, `+2`, or `+3`, **Then** the rival score for the current period increments by that amount and the rival total score in the global header increases.
4. **Given** the rival control panel, **When** the user taps `-1`, **Then** the rival score for the current period decrements by 1 (floor at 0) and the rival total score in the global header updates.
5. **Given** the rival control panel, **When** the user taps `+1 Foul`, **Then** the rival team fouls for the current period increment by 1, and if the crono was running, it pauses automatically.
6. **Given** the rival control panel, **When** the user taps `-1 Foul`, **Then** the rival team fouls for the current period decrement by 1 (floor at 0).
7. **Given** a period transition, **When** switching periods, **Then** the rival panel reflects the isolated rival period score and rival period team fouls for the newly selected period.

---

### User Story 5 - Bench Player Statistics Information Modal (Priority: P2)

As a coach or assistant, I want to tap any player sitting on the bench to open a dedicated, high-prominence statistics modal displaying their total minutes, points, detailed shooting percentages (1pt, 2pt, 3pt in `s/a (#%)` format), rebounds, assists, steals, turnovers, and fouls, so that I can evaluate benched player performance at a glance and close it easily via cross button or outside backdrop tap.

**Why this priority**: During match play, coaches need instant visibility into bench players' complete statlines to make informed substitution and tactical decisions without accidentally logging stats or interrupting active match timing.

**Independent Test**: Can be tested by tapping any player in the bench list when Swap Mode is inactive, verifying the modal opens displaying the player's minutes and points prominently in the header, verifying 1pt, 2pt, and 3pt categories show accurate success/attempt counts and percentage formatted as `s/a (#%)`, verifying other match stats are displayed, confirming clicking the cross button closes the modal, confirming tapping the backdrop overlay outside the modal closes it, and verifying tapping bench players while in Swap Mode toggles substitution selection instead of opening the modal.

**Acceptance Scenarios**:

1. **Given** the team management panel with players on the bench and Swap Mode is inactive, **When** the user taps a bench player circle, **Then** the bench player statistics modal opens populated with that player's in-game stats.
2. **Given** the bench player statistics modal is visible, **When** the user taps the close cross (`✕`) button, **Then** the modal closes immediately.
3. **Given** the bench player statistics modal is visible, **When** the user taps anywhere on the translucent backdrop overlay outside the modal container, **Then** the modal closes immediately.
4. **Given** the bench player statistics modal is visible, **When** the user taps inside the modal container content, **Then** the modal remains open (touch events inside the modal do not trigger dismissal).
5. **Given** the bench player statistics modal is open, **When** viewing the header summary layout, **Then** the player's total cumulative minutes played and points scored are prominently positioned at the top with higher visual prominence (font size, weight, and contrast) than subsequent metrics.
6. **Given** the bench player statistics modal is open, **When** viewing shooting categories (1-point free throws, 2-point field goals, 3-point field goals), **Then** each category displays successful throws and total attempts with calculated percentage in the exact format `s/a (#%)` (e.g., `4/5 (80%)`).
7. **Given** a bench player has 0 attempts for a throw category (0 made and 0 missed), **When** viewing the throw statistics, **Then** that category displays `0/0 (0%)` without calculation errors or NaN text.
8. **Given** the bench player statistics modal is open, **When** reviewing the complete statline, **Then** offensive rebounds, defensive rebounds, total rebounds, assists, steals/recoveries, turnovers/lost balls, personal fouls, and valuation are rendered with clear labels.
9. **Given** Swap Mode is active, **When** the user taps a bench player circle, **Then** the player is selected or deselected for the pending substitution ($N\text{ in} = N\text{ out}$) and the bench stats modal is NOT opened.
10. **Given** the bench player statistics modal is rendered, **When** displayed over the active match screen, **Then** visual layering (dimmed translucent backdrop overlay, elevated container, border styling, and drop shadow) visually isolates the modal and ensures readability over the underlying court canvas.

---

### User Story 6 - Responsive Viewport Adaptation & Compact Player Circle Scaling (Priority: P1)

As a coach using a compact or small phone, I want the Play Match view, half-court canvas, and player circles (both court and bench) to scale responsively to my screen size without elements overlapping or pushing off-screen, so that all controls and court players remain visible and fully interactive.

**Why this priority**: Coaches operate the app on devices of varying dimensions. Large player circles and fixed-height court containers cause layout overflow, pushing active court players behind the bench panel on smaller screens and disrupting match coaching.

**Independent Test**: Can be tested on small mobile viewports (e.g., 360x640, 375x667) by rendering the Play Match view, verifying all 5 on-court positions and the horizontal bench list are visible simultaneously without vertical scrolling or overlap with control panels, and verifying player circles are scaled down to compact dimensions while preserving legible text.

**Acceptance Scenarios**:

1. **Given** a small mobile viewport, **When** the Play Match screen is rendered, **Then** the half-court canvas scales fluidly to fit the available vertical and horizontal space between the top controller and bottom bench panel.
2. **Given** the 5 on-court player slots, **When** rendered on any phone screen size, **Then** no player circles are hidden, pushed down behind, or occluded by the bench panel controls.
3. **Given** player circles on both the half-court canvas and the horizontal bench list, **When** displayed, **Then** they render at a compact scale, noticeably smaller than previous dimensions, fitting comfortably within the layout bounds.
4. **Given** the compact player circles, **When** inspected, **Then** the player identification (jersey number or initial/last name), divisor line, and stint/match minutes and points remain clearly legible and tap-interactive.

---

### User Story 7 - Enlarged Score-Only Application Header (Priority: P2)

As a coach or spectator, I want the App Header to display only the total match score in large, prominent typography without team names, so that I can immediately check the match score at a glance from any distance.

**Why this priority**: During fast-paced matches, glancing at the score quickly is paramount. Team names take up valuable horizontal real estate and shrink the score digits; displaying only the total score in larger format maximizes legibility and simplifies the top header bar.

**Independent Test**: Can be tested by loading a live match, verifying the App Header renders only the total score (e.g. `102 - 98`) in enlarged typography, verifying team names are completely omitted from the header, and verifying back/exit and save/finish actions remain functional.

**Acceptance Scenarios**:

1. **Given** an active match in the Play Match view, **When** viewing the App Header, **Then** the header displays exclusively the total match score (e.g., `84 - 79`).
2. **Given** the App Header, **When** inspected, **Then** no local team name or rival team name text is rendered within the header area.
3. **Given** the total match score in the App Header, **When** rendered, **Then** the score numbers are displayed in significantly larger, high-contrast typography compared to standard headers.
4. **Given** the App Header, **When** viewed, **Then** the back/exit button and save/finish button remain fully visible, accessible, and aligned alongside the enlarged score.

---

### Edge Cases

- **Starting Match with No Initial Lineup**: If a match is opened and fewer than 5 players are assigned to the quintet, the court canvas indicates empty positions. Tapping an empty position opens a quick player selector modal to assign an available bench player directly with stint timer initialized to 0.
- **Player Substitutions While Clock Running**: The system allows toggling Swap mode, selecting players, and confirming equal swaps ($N\text{ in} = N\text{ out}$) while the clock is actively running. The chronometer does not pause, and newly inserted players immediately begin accumulating stint seconds from 00:00.
- **Player Benched and Later Re-entering (Multiple Stints)**: Stint duration counts exclusively the current continuous stint. Each time a player moves from bench to court, their stint timer resets to 0. Cumulative match minutes retain all accumulated playing time across all stints.
- **Long-Press Duration Threshold**: The hold gesture on an active on-court player requires at least 2 seconds (2000ms) of sustained touch. If the user releases before 2 seconds, it is treated as a normal tap (opening stats modal) or cancelled without triggering subtraction.
- **Stat Subtraction on Bench Players**: Bench player circles ignore the 2-second hold gesture. Subtraction cannot be initiated from the bench list.
- **Zero Shot Attempts in Throw Breakdown**: When a player has 0 made and 0 missed throws in any category (1-point, 2-point, or 3-point), the modal renders `0/0 (0%)` to avoid division by zero or NaN artifacts.
- **Tapping Bench Player During Swap Mode**: When Swap Mode is active, tapping a bench player toggles substitution selection ($N\text{ in} = N\text{ out}$) and suppresses opening the bench player statistics modal.
- **Click Outside Boundary Detection**: Touch events targeting the backdrop overlay outside the modal card bounds close the modal; touch events within the card content boundary are absorbed and do not dismiss the modal.
- **Cascading Assist Subtraction on Unassisted Baskets**: If a decremented 2-point or 3-point basket was recorded as "non assistant", decrementing the basket adjusts the player's points and team period/total score without mutating any teammate's assist count.
- **Multiple Assists by Teammate**: Cascading assist subtraction decrements the specific assist linked to the decremented basket event; other previously credited assists for that teammate remain unaffected.
- **Stat Underflow Prevention**: Subtraction of points, rebounds, fouls, assists, turnovers, or steals cannot drop any stat value below 0.
- **Clock Reaching 00:00 in Regular Quarters (`q1`-`q4`)**: Chronometer stops automatically at 00:00; stint minute accumulation stops; user can advance to the next period.
- **Clock Reaching 00:00 in Extra Time (`extra`)**: The user can reset the crono to 5:00 via the "Ajustar Tiempo" modal, which preserves all accumulated scores, team fouls, and player statistics while adding +1 timeout.
- **Small Phone Viewport (Short Screen Heights)**: When running on screens with compact heights (e.g. under 700px), the court canvas adjusts its height dynamically so that on-court players never collide with or get obscured by the bench panel.
- **Extra-Time Reset Relocation**: The extra-time reset action inside the "Ajustar Tiempo" modal is only enabled or presented when the active period is `extra`. Triggering it restores the timer to 05:00 and grants +1 timeout while keeping scores and fouls intact.
- **Header Score Scaling with High Scores**: If scores reach triple digits (e.g., `112 - 108`), the enlarged score typography fits cleanly between the back button and action icons without truncating or wrapping.
- **Player Disqualification on 5 Personal Fouls**: When a player reaches 5 personal fouls, a visual warning alerts the coach to substitute the player out.
- **Player Lacks Jersey Number**: When a player object has no jersey number (`null`, `undefined`, or empty/whitespace string `""`), the identification area triggers the fallback format `[First Initial]. [Last Name]`.
- **Player Missing First Name or Last Name in Fallback**: If a player has no jersey number and lacks a first name, the fallback displays `[Last Name]`; if the player lacks a last name, it displays `[First Name]`; if both are missing or empty, a neutral fallback (`"Jugador"`) is rendered safely without throwing runtime errors or breaking the circle layout.
- **Player Names with Leading or Trailing Whitespace**: Whitespace is trimmed before extracting the initial and constructing the formatted string (e.g., `"  Alex  "` and `" Arias "` produce `"A. Arias"`).

## Requirements *(mandatory)*

### Functional Requirements

#### Component 1: Time, Score, and Fouls Controller & Global Header
- **FR-001**: System MUST manage 5 game periods: `q1`, `q2`, `q3`, `q4`, and `extra`.
- **FR-002**: Tapping the period indicator once MUST advance to the next period in sequence (`q1` -> `q2` -> `q3` -> `q4` -> `extra`).
- **FR-003**: Pressing and holding the period indicator for 3 seconds MUST open a period selection modal displaying all available periods for direct selection.
- **FR-005**: Application Header MUST display EXCLUSIVELY the live total match score formatted as `${teamTotalScore} - ${rivalTotalScore}` (completely omitting local and rival team names) rendered in significantly enlarged and high-contrast typography, integrated with the return/back icon button to exit and the save icon button to finalize/save the match.
- **FR-005b**: Component 1 (Time, Score, and Fouls Controller) MUST render ONLY the current period score and current period team fouls for both teams.
- **FR-006**: Regular periods (`q1` through `q4`) MUST initialize with a duration of 10 minutes (10:00), and `extra` time MUST initialize with a duration of 5 minutes (05:00).
- **FR-007**: Tapping the crono widget once MUST toggle between starting and pausing the timer.
- **FR-008**: Pressing and holding the crono widget for 3 seconds MUST open the "Ajustar Tiempo" (Time Adjustment) modal to adjust remaining minutes and seconds.
- **FR-009**: The extra-time reset button MUST be completely removed from the main screen layout (crono/period control bar).
- **FR-009a**: The extra-time reset action MUST be relocated inside the "Ajustar Tiempo" (Time Adjustment) modal view, accessible as an option when editing time during `extra` period, restoring the clock to 05:00 without wiping score/fouls and granting +1 additional timeout.
- **FR-010**: Resetting the extra time crono MUST grant +1 additional timeout to the user's available timeout count.

#### Component 2: Team Management, Court Canvas & Player Stint / Stats
- **FR-011**: System MUST render an interactive half basketball court canvas that scales fluidly and responsively across various mobile device screen sizes (especially small phones), ensuring that the court canvas and all 5 active on-court player slots remain fully visible within the viewport without layout overflow, vertical clipping, or collapsing behind the bottom bench management panel.
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
- **FR-015**: Recording `t2a` or `t3a` MUST transition the modal to an assist prompt listing on-court teammates and a "non assistant" option, recording the linkage between the scoring event and assisting teammate.
- **FR-016**: Recording a personal foul (`fault`) MUST increment the player's personal fouls, increment the active period's team fouls by 1, and automatically pause the running chronometer.
- **FR-017**: All 5 on-court quintet players MUST automatically accumulate current stint duration (`stintSeconds`) and cumulative match time (`secondsPlayed`) in real time while the chronometer is running.
- **FR-017a**: Active on-court player circles MUST display the player's current continuous stint duration (`stintMinutes` / time played since entering the court) starting at `0` upon court entry.
- **FR-017b**: When a player is substituted to the bench and subsequently returns to the court, their displayed stint duration MUST reset to `0` for the new stint.
- **FR-018**: Each player circle (both the 5 active on-court positions and the horizontal bench list) MUST be rendered at a reduced, compact size that prevents visual collision or occlusion by control panels across small mobile viewports, while preserving legible player identification and stint/minute metrics:
  1. **Player Identification**:
     - When a player has an assigned Jersey Number, the view MUST exclusively display the Jersey Number (e.g., `#23` or `23`) as the primary identifier.
     - When a player does NOT have an assigned Jersey Number (absent, null, undefined, or empty/whitespace string), the view MUST display the player's name in `[First Initial]. [Last Name]` format (e.g., `A. Arias`, `A. Delgado`, `P. Stegmann`).
  2. Divisor line below player identifier.
  3. On-court players: stint minutes and points in `${stintMin}min / ${pts}pts` format below divisor line. Bench players: cumulative minutes and points in `${min}min / ${pts}pts` format below divisor line.
- **FR-018a**: Name formatting fallback MUST safely handle edge cases (missing first name, missing last name, trailing/leading spaces, empty strings) without causing UI layout breaks or runtime errors.
- **FR-019**: Bench players MUST be displayed in a horizontal scrollable list beneath the court canvas.
- **FR-020**: System MUST provide a "Swap" button that activates Swap Mode for player substitutions between the court quintet and the bench.
- **FR-021**: Swap Mode MUST allow selecting multiple court and bench players and enforce balanced substitutions ($N\text{ in} = N\text{ out} \ge 1$) when confirming.
- **FR-022**: Player substitutions (activating Swap mode, selecting players, and confirming substitutions) MUST be permitted at any time, whether the chronometer is running or paused.
- **FR-023**: System MUST provide timeout increase (`+`) and decrease (`-`) controls positioned in the same row as the Swap button (spaced between).
- **FR-024**: System MUST enforce timeout quota allocations:
  - 2 timeouts total across periods `q1` and `q2` combined.
  - 3 timeouts total across periods `q3` and `q4` combined.
  - 1 timeout for `extra` time, plus 1 additional timeout for each extra time crono reset.
- **FR-030**: System MUST support a 2-second hold gesture listener on player circles strictly for active on-court players to trigger a stat subtraction interface. Bench players MUST NOT trigger or allow stat subtraction via long-press.
- **FR-031**: When a made 2-point (`t2a`) or 3-point (`t3a`) shot is decremented during stat subtraction, the system MUST automatically subtract the associated assist from the assisting teammate if an assist was linked to that scoring event.
- **FR-032**: Subtracting stats MUST immediately update the player's personal stats, period score/fouls, and total match score without allowing any stat count to drop below 0.
- **FR-035**: Tapping any player on the bench while Swap Mode is inactive MUST open the bench player statistics modal populated with that player's cumulative in-game statistics.
- **FR-036**: The bench player statistics modal MUST include a close (cross `✕`) button in the header that immediately dismisses the modal upon press.
- **FR-037**: The bench player statistics modal MUST include a backdrop overlay that dismisses the modal when tapped outside the modal container bounds.
- **FR-038**: The bench player statistics modal header MUST prominently display the player's total cumulative minutes played and total points scored at the top with higher visual distinction than secondary stats.
- **FR-039**: The bench player statistics modal MUST display 1-point, 2-point, and 3-point throw statistics formatted strictly as `s/a (#%)` (e.g., `4/5 (80%)`), where `s` is successful baskets, `a` is total attempts (`succeed + missed`), and `#%` is the calculated percentage (displaying `0/0 (0%)` when attempts equal 0).
- **FR-040**: The bench player statistics modal MUST render the player's complete statline including offensive rebounds, defensive rebounds, total rebounds, assists, steals/recoveries, turnovers/lost balls, personal fouls, and valuation.
- **FR-041**: The bench player statistics modal MUST apply visual layering (dimmed backdrop overlay, container border, and elevation shadow) to ensure the modal stands out clearly against the underlying match view.
- **FR-042**: When Swap Mode is active, tapping a bench player circle MUST toggle substitution selection and MUST NOT open the bench player statistics modal.

#### Component 3: Rival Panel Control
- **FR-025**: System MUST provide a rival control panel allowing the user to add (+1, +2, +3) or subtract (-1) points from the rival's active period score.
- **FR-026**: System MUST allow the user to add (+1) or subtract (-1) team fouls from the rival's active period team fouls.
- **FR-027**: Adding a rival team foul (+1) MUST automatically pause the running chronometer.
- **FR-028**: Rival period scores and fouls MUST be isolated per period and aggregate into the total rival match score.
- **FR-033**: The rival control panel MUST expand to occupy the full available width (100% width) of the container layout.
- **FR-034**: The rival control panel MUST NOT render the rival total points counter element (rival total points remain exclusively displayed in the top match header).

#### Global State Management
- **FR-029**: System MUST manage a centralized global state store containing: active period, period states (time, scores, fouls for home and rival across `q1`, `q2`, `q3`, `q4`, `extra`), chronometer status, timeouts remaining, on-court quintet roster, bench roster, player stint durations, scoring event history with assist linkages, and detailed cumulative player statistics.

### Key Entities

- **MatchSession**: Central entity managing the overall match state, active period identifier (`q1`, `q2`, `q3`, `q4`, `extra`), total home score, total rival score, chronometer running state, available timeouts, and associations to period states and player rosters.
- **PeriodState**: Represents an isolated period (`q1`, `q2`, `q3`, `q4`, `extra`) containing remaining duration (seconds), home period score, rival period score, home period team fouls, and rival period team fouls.
- **PlayerRosterState**: Manages the separation between the active on-court quintet (exactly 5 positions) and the bench player list, including stint duration tracking for on-court positions.
- **PlayerMatchStats**: Contains individual stats for each player: `jerseyNumber` (optional/nullable string), `firstName` (string), `lastName` (string), `secondsPlayed` (cumulative seconds played), `stintSeconds` (seconds played in current on-court stint), `pts` (total points), `t1a`, `t1i`, `t2a`, `t2i`, `t3a`, `t3i`, `offensiveRebounds`, `defensiveRebounds`, `fouls`, `assists`, `lost` (turnovers), and `recovers` (steals).
- **ScoreEventLink**: Represents a recorded made basket event capturing the scoring player ID, points value (2 or 3), period key, and optional assisting teammate player ID, enabling cascading assist reversal upon score subtraction.
- **TimeoutState**: Tracks remaining timeout budget partitioned by game phase (First Half: `q1`/`q2` pool of 2; Second Half: `q3`/`q4` pool of 3; Extra Time: pool of 1 + reset increments).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Single-tap and 3-second long-press interactions on the period indicator and crono widget trigger their respective actions (period advance/modal, timer toggle/modal) reliably within 100ms of trigger completion.
- **SC-002**: 100% of recorded made shots (`t1a`, `t2a`, `t3a`) immediately update player points, period score, and total team score without discrepancies.
- **SC-003**: 100% of recorded personal fouls and rival fouls increment period team fouls and immediately halt the running chronometer.
- **SC-004**: Assist prompt appears for 100% of made 2pt and 3pt shots and allows selecting either an active on-court teammate or "non assistant".
- **SC-005**: Swap Mode strictly prevents 100% of unbalanced substitutions, guaranteeing exactly 5 active players on the court at all times.
- **SC-006**: Extra-time reset triggered from within the "Ajustar Tiempo" modal restores the clock to 5:00 and grants +1 timeout while maintaining 100% data integrity for all existing period scores, team fouls, and player stats.
- **SC-007**: Timeout allocations strictly enforce 2 for `q1`-`q2`, 3 for `q3`-`q4`, and 1 for `extra` (plus resets).
- **SC-008**: 100% of active on-court players display stint minutes starting at `0` upon court entry, incrementing continuously while playing, and resetting to `0` whenever returning from the bench to a new stint.
- **SC-009**: 100% of player circles (court and bench) display exclusively the Jersey Number when an assigned jersey number is present.
- **SC-010**: 100% of player circles for players without a jersey number display the fallback `[First Initial]. [Last Name]` safely, with 0 runtime exceptions or layout distortion across edge-case name inputs.
- **SC-011**: Holding an active on-court player for 2 seconds triggers the stat subtraction action with 100% reliability, while holding bench players for 2 seconds produces 0 stat subtraction triggers.
- **SC-012**: 100% of decremented 2-point and 3-point made shots that were linked to an assist automatically decrement the associated teammate's assist count.
- **SC-013**: The rival control panel spans 100% of the available container width and completely omits the rival total points counter element.
- **SC-014**: Player substitutions can be initiated and confirmed with 100% success rate regardless of whether the chronometer is running or paused.
- **SC-015**: 100% of taps on bench player circles while Swap Mode is inactive open the bench player statistics modal in under 100ms.
- **SC-016**: 100% of dismissals via the cross button or backdrop click-outside immediately close the modal and return control to the match view.
- **SC-017**: 100% of throw statistics across 1-point, 2-point, and 3-point categories adhere strictly to the `s/a (#%)` format without division-by-zero errors when total attempts equal 0.
- **SC-018**: While Swap Mode is active, 0% of bench player taps trigger the stats modal, strictly preserving substitution selection workflow.
- **SC-019**: On small phone viewports (tested down to compact mobile dimensions ~360x640 / 375x667), 100% of the 5 on-court positions, court lines, and bench panel controls are fully visible within the viewport without overlapping, occlusion behind the bench panel, or vertical scrolling off-screen.
- **SC-020**: 100% of player circles on the half-court canvas and the bench list are rendered in compact, scaled-down dimensions while preserving legibility of jersey number / name and stint/match minutes and points.
- **SC-021**: The App Header displays 0 team name strings, rendering exclusively the total match score in prominent, enlarged typography.
- **SC-022**: The main match view layout contains 0 standalone extra-time reset buttons, eliminating extra-time related layout shift or canvas displacement.

## Assumptions

- Standard regular quarters (`q1`-`q4`) have a 10-minute duration (10:00) and extra time (`extra`) has a 5-minute duration (05:00).
- Timeouts in the first half (`q1`-`q2`) share a single pool of 2 timeouts; unused timeouts in `q1` roll over to `q2`, but none roll over from `q2` to `q3`.
- Timeouts in the second half (`q3`-`q4`) share a single pool of 3 timeouts; unused timeouts do not roll over to extra time.
- Extra time starts with 1 timeout, and each reset of the extra time crono adds +1 timeout to the available count.
- Rival tracking is focused on period score adjustments (+1, +2, +3, -1) and period team fouls (+1, -1); individual rival player stats are not tracked in this panel.
- On-court quintet is strictly limited to 5 players; substitutions enforce $N\text{ in} = N\text{ out}$ and can occur while the chronometer is running or paused.
- Stint minutes on court display whole minutes (or minutes:seconds depending on formatting utility) starting from 0:00 for the active stint, distinct from total cumulative match minutes which persist for box scores.
- Stat subtraction via 2-second hold provides options to decrement recorded statistics, preventing decrement below 0.
- When a player has an assigned Jersey Number, the view exclusively displays the Jersey Number, omitting any redundant player name text to maximize circle clarity and legibility on mobile screens.
- Fallback name abbreviation adheres to standard format `[First Initial]. [Last Name]` (e.g., `A. Arias`), trimming surrounding whitespace and capitalizing the initial.
- Bench player statistics modal is strictly an informational view; stat recording and decrementing actions are not available from the bench modal.
- Success percentage in `s/a (#%)` format is rounded to the nearest integer (e.g., 2/3 is `2/3 (67%)`), and 0 attempts is rendered as `0/0 (0%)`.
- Court canvas layout responsively calculates dimension constraints based on available screen space or flex boundaries rather than using hardcoded fixed heights that overflow on compact screens.
- App header title/score display is streamlined across all match view header integrations to prioritize immediate score visibility over team labels.
