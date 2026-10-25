# Quickstart & Validation Guide: Play Match View

**Feature**: `007-play-match-view` | **Date**: 2026-10-25 (Updated with Bench Player Statistics Modal)

## Prerequisites & Setup

1. Ensure the SQLite database contains at least 1 team and 7+ registered players.
2. Create a pending match and call up players to the roster.
3. Open the match to navigate to `PlayMatch.tsx`.

---

## Validation Scenarios

### Scenario 1: Component 1 - Period Switching & 3-Second Hold Modal
- **Steps**:
  1. In `q1`, tap the period indicator once -> verify period advances to `q2`.
  2. Press and hold the period indicator for 3 seconds -> verify `PeriodSelectModal` opens with options: `Q1`, `Q2`, `Q3`, `Q4`, `EXTRA`.
  3. Select `EXTRA` -> verify active period switches to `extra` (timer initialized to `05:00`).
- **Expected Outcome**: Instant 1-tap advance and modal direct selection after 3s hold.

### Scenario 2: Component 1 - Crono 1-Tap Toggle & 3-Second Hold Manual Time
- **Steps**:
  1. Single-tap the crono display (`10:00`) -> verify timer starts running and active quintet players accumulate stint seconds and cumulative match seconds.
  2. Single-tap again -> verify timer pauses.
  3. Press and hold the crono display for 3 seconds -> verify `ManualTimeModal` opens.
  4. Change time to `07:30` and save -> verify chronometer displays `07:30`.
- **Expected Outcome**: 1-tap start/pause and 3s hold opens manual time configuration.

### Scenario 3: Component 1 - Extra Time Crono Reset
- **Steps**:
  1. Switch to `extra` time; log 4 points and 2 fouls.
  2. Let clock run or manually set time to `00:00`.
  3. Tap "Reset Crono" (icon button) -> verify time resets to `05:00`, current period score (4) and team fouls (2) remain unchanged, and available timeouts increase by +1.
- **Expected Outcome**: Clock restores to 5:00 without wiping existing stats, and +1 timeout is awarded.

### Scenario 4: Component 2 - Half-Court Canvas & Player Representation Circles
- **Steps**:
  1. View the half basketball court canvas and bench list.
  2. Verify 5 position buttons are rendered representing the active quintet (or dashed empty slot if unassigned).
  3. Verify each circle displays:
     - **Player Identification**:
       - When jersey number is present (e.g. `23`): displays **exclusively** `#23` with no redundant player name.
       - When jersey number is absent/empty: displays `[First Initial]. [Last Name]` (e.g., `A. Arias`).
     - Divisor line separating identifier from statistics.
     - On-court circles: stint minutes and points formatted as `${stintMin}min / ${pts}pts`.
     - Bench circles: cumulative match minutes and points formatted as `${min}min / ${pts}pts`.
- **Expected Outcome**: Accurate player circle rendering with jersey number exclusivity and clean fallback abbreviation.

### Scenario 5: Component 2 - Stats Modal, Made/Missed Shots & Assist Prompt
- **Steps**:
  1. Tap an on-court player circle -> verify `PlayerStatsModal` opens.
  2. Tap `t2a` -> verify modal transitions to assist selector showing the other 4 on-court teammates and "non assistant".
  3. Select a teammate -> verify:
     - Scoring player's `t2a` increments and points increase by 2.
     - Selected teammate's `asis` increments.
     - Current period score and total team score increase by 2.
     - Event is stored in `scoreEvents` with assist linkage.
  4. Tap another player, select `t3a` -> select "non assistant" -> verify 3 points added without assist credit.
  5. Select `t1i` (missed free throw) -> verify attempt logged without adding points.
  6. Tap Offensive Rebound / Defensive Rebound -> verify respective rebound category increments.
  7. Tap `fault` (personal foul) -> verify player fouls increment, period team fouls increment, and running clock **automatically pauses**.
- **Expected Outcome**: Full stat recording, assist prompt routing, and foul clock stoppage.

### Scenario 6: Component 2 - Stint Tracking on Court & Bench Rotations
- **Steps**:
  1. Assign player A to the starting five -> verify player A's displayed stint minutes start at `0` (`0min / 0pts`).
  2. Start the chronometer and let it run for 2 minutes -> verify player A's stint minutes display `2min` (and cumulative seconds also reflect 120s).
  3. Substitute player A to the bench and player B to the court -> verify:
     - Player B's stint minutes start at `0` (`0min`).
     - Player A on the bench displays cumulative match time (`2min`).
  4. Later, substitute player A back onto the court -> verify:
     - Player A's displayed stint minutes reset to `0` (`0min`).
     - Player A's cumulative match minutes continue from `2min` in the background.
- **Expected Outcome**: Stint minutes count strictly the time played since entering the court and reset to 0 whenever re-entering from the bench.

### Scenario 7: Component 2 - 2-Second Hold Stat Subtraction with Cascading Assist Deduction
- **Steps**:
  1. Player A scores `t2a` with an assist from Player B (Period score +2, Player A pts +2, Player B asis +1).
  2. Press and hold Player A's circle for 2 seconds -> verify `PlayerStatSubtractionModal` opens.
  3. Tap `t2a` (subtract 2-point basket) -> verify:
     - Player A's points decrease by 2.
     - Current period team score and total team score decrease by 2.
     - Player B's `asis` count automatically decreases by 1 (cascading assist subtraction).
  4. Player C scores `t3a` with "non assistant" (unassisted).
  5. Press and hold Player C for 2 seconds -> tap `t3a` -> verify Player C pts decrease by 3 and period score decreases by 3, with no teammate assist affected.
  6. Attempt to decrement stats when count is 0 -> verify values floor at 0.
  7. Press and hold a player on the bench for 2 seconds -> verify no subtraction modal opens.
- **Expected Outcome**: 2-second hold triggers subtraction for court players only, automatically cascades assist deductions, and prevents underflow below 0.

### Scenario 8: Component 2 - Unrestricted Swap Mode (Substitutions)
- **Steps**:
  1. Start the chronometer so it is actively running.
  2. Tap the "Swap" button -> verify Swap Mode activates while the clock continues running.
  3. Select 1 on-court player and 2 bench players -> verify confirm button is disabled (unbalanced).
  4. Select a 2nd on-court player (2 court, 2 bench) -> verify confirm button is enabled.
  5. Tap confirm -> verify:
     - Substitution executes immediately.
     - Chronometer continues running uninterrupted.
     - Incoming players enter with stint timer at `0` and immediately begin accumulating stint seconds.
     - Outgoing players move to bench with cumulative minutes preserved.
  6. Pause chronometer -> repeat balanced swap -> verify substitution also executes seamlessly when clock is paused.
- **Expected Outcome**: Substitutions are permitted anytime (running or paused) while strictly enforcing $N\text{ in} = N\text{ out}$.

### Scenario 9: Component 2 - Timeout Quota Management
- **Steps**:
  1. In `q1`, verify 2 timeouts are available.
  2. Use 1 timeout -> verify 1 remains.
  3. Switch to `q2` -> verify 1 timeout remains (shared pool of 2 for `q1`-`q2`).
  4. Use the last timeout (0 remaining); tap decrease -> verify cannot drop below 0.
  5. Switch to `q3` -> verify timeout budget refreshes to 3 (shared pool of 3 for `q3`-`q4`).
  6. Switch to `extra` -> verify 1 timeout is available.
- **Expected Outcome**: Correct phase-based timeout allowances and non-negative floor.

### Scenario 10: Component 3 - Full-Width Rival Control Panel
- **Steps**:
  1. Inspect the bottom rival panel -> verify it extends to 100% width of the screen.
  2. Verify the rival total points counter element is completely absent from the rival control component (only active period rival score and fouls are displayed).
  3. Start the chronometer.
  4. In Rival Panel, tap `+2` -> verify current period rival score increases by 2 and top header total rival score increases by 2.
  5. Tap `-1` -> verify current period rival score decreases by 1.
  6. Tap `+1 Foul` -> verify current period rival fouls increment and chronometer **automatically pauses**.
  7. Tap `-1 Foul` -> verify current period rival fouls decrement.
- **Expected Outcome**: Full-width spacious touch targets, no duplicate total score counter, and accurate rival adjustments with auto-stop on fouls.

### Scenario 11: Player Identification Fallback & Edge Cases
- **Steps**:
  1. Provide player with `{ number: "7", firstName: "Luka", lastName: "Doncic" }` -> verify output is `"#7"`.
  2. Provide player with `{ number: null, firstName: "Alex", lastName: "Delgado" }` -> verify output is `"A. Delgado"`.
  3. Provide player with `{ number: "", firstName: "  Pablo  ", lastName: " Stegmann " }` -> verify trimmed output is `"P. Stegmann"`.
  4. Provide player with missing first name `{ number: undefined, firstName: "", lastName: "Ibaka" }` -> verify output is `"Ibaka"`.
  5. Provide player with missing last name `{ number: null, firstName: "Ricky", lastName: "" }` -> verify output is `"Ricky"`.
  6. Provide player with both names missing `{ number: null, firstName: null, lastName: null }` -> verify safe fallback `"Jugador"`.
- **Expected Outcome**: 100% test pass on `formatPlayerIdentifier.test.ts` with zero exceptions.

### Scenario 12: Component 2 - Bench Player Statistics Modal & Throw Stat Formatting
- **Steps**:
  1. Ensure Swap Mode is inactive. Tap any player in the bench list (e.g., Player with 12 mins, 10 pts, 2/3 FT, 4/5 2PT, 0/0 3PT, 3 OREB, 4 DREB, 5 ASIS, 2 REC, 1 PER, 2 FALT, valuation 18).
  2. Verify `BenchPlayerStatsModal` opens immediately (<100ms).
  3. Verify header displays player identification (via `formatPlayerIdentifier`), and total minutes (`12min`) and points (`10pts`) with high visual prominence at the top.
  4. Verify throw statistics display:
     - 1-Point Free Throws: `2/3 (67%)`
     - 2-Point Field Goals: `4/5 (80%)`
     - 3-Point Field Goals: `0/0 (0%)` (zero attempts handled safely with 0% and no NaN)
  5. Verify complete secondary statline is displayed:
     - Offensive Rebounds: `3`, Defensive Rebounds: `4`, Total Rebounds: `7`
     - Assists: `5`, Steals: `2`, Turnovers: `1`, Personal Fouls: `2`
     - Valuation: `18`
  6. Tap inside the modal container body -> verify modal remains open.
  7. Tap the backdrop overlay outside the modal container -> verify modal closes immediately.
  8. Tap the bench player again to reopen -> tap the cross button (`✕`) in the header -> verify modal closes immediately.
  9. Activate Swap Mode by tapping the "Swap" button. Tap a bench player -> verify bench player is selected for substitution ($N\text{ in} = N\text{ out}$) and `BenchPlayerStatsModal` does NOT open.
- **Expected Outcome**: 100% test pass on `BenchPlayerStatsModal.test.tsx` and `formatThrowStat.test.ts` asserting prominence, formatting, backdrop/cross dismissals, and swap mode isolation.
