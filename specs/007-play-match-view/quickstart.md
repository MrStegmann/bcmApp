# Quickstart & Validation Guide: Play Match View

**Feature**: `007-play-match-view` | **Date**: 2026-10-03

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
  1. Single-tap the crono display (`10:00`) -> verify timer starts running and active quintet players accumulate seconds.
  2. Single-tap again -> verify timer pauses.
  3. Press and hold the crono display for 3 seconds -> verify `ManualTimeModal` opens.
  4. Change time to `07:30` and save -> verify chronometer displays `07:30`.
- **Expected Outcome**: 1-tap start/pause and 3s hold opens manual time configuration.

### Scenario 3: Component 1 - Extra Time Crono Reset
- **Steps**:
  1. Switch to `extra` time; log 4 points and 2 fouls.
  2. Let clock run or manually set time to `00:00`.
  3. Tap "Reset Crono" -> verify time resets to `05:00`, current period score (4) and team fouls (2) remain unchanged, and available timeouts increase by +1.
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
     - Live statistics formatted as `${min}min / ${pts}pts` (where points are $t1a \times 1 + t2a \times 2 + t3a \times 3$).
  4. Verify the bench displays as a horizontal scrollable list below the canvas following identical circle formatting rules.
- **Expected Outcome**: Accurate player circle rendering with jersey number exclusivity and clean fallback abbreviation.

### Scenario 5: Component 2 - Stats Modal, Made/Missed Shots & Assist Prompt
- **Steps**:
  1. Tap an on-court player circle -> verify `PlayerStatsModal` opens.
  2. Tap `t2a` -> verify modal transitions to assist selector showing the other 4 on-court teammates and "non assistant".
  3. Select a teammate -> verify:
     - Scoring player's `t2a` increments and points increase by 2.
     - Selected teammate's `asis` increments.
     - Current period score and total team score increase by 2.
  4. Tap another player, select `t3a` -> select "non assistant" -> verify 3 points added without assist credit.
  5. Select `t1i` (missed free throw) -> verify attempt logged without adding points.
  6. Tap Offensive Rebound / Defensive Rebound -> verify respective rebound category increments.
  7. Tap `fault` (personal foul) -> verify player fouls increment, period team fouls increment, and running clock **automatically pauses**.
- **Expected Outcome**: Full stat recording, assist prompt routing, and foul clock stoppage.

### Scenario 6: Component 2 - Swap Mode (Balanced Substitutions)
- **Steps**:
  1. Start the chronometer -> tap "Swap" -> verify substitution is disallowed while clock is running.
  2. Pause the chronometer -> tap "Swap" -> verify Swap Mode activates.
  3. Select 1 on-court player and 2 bench players -> verify confirm button is disabled.
  4. Select a 2nd on-court player (2 court, 2 bench) -> verify confirm button is enabled.
  5. Tap confirm -> verify selected bench players enter the court, selected court players move to the bench, and exactly 5 players remain on court.
- **Expected Outcome**: Strictly balanced substitutions ($N\text{ in} = N\text{ out}$) while clock is stopped.

### Scenario 7: Component 2 - Timeout Quota Management
- **Steps**:
  1. In `q1`, verify 2 timeouts are available.
  2. Use 1 timeout -> verify 1 remains.
  3. Switch to `q2` -> verify 1 timeout remains (shared pool of 2 for `q1`-`q2`).
  4. Use the last timeout (0 remaining); tap decrease -> verify cannot drop below 0.
  5. Switch to `q3` -> verify timeout budget refreshes to 3 (shared pool of 3 for `q3`-`q4`).
  6. Switch to `extra` -> verify 1 timeout is available.
- **Expected Outcome**: Correct phase-based timeout allowances and non-negative floor.

### Scenario 8: Component 3 - Rival Panel Control
- **Steps**:
  1. Start the chronometer.
  2. In Rival Panel, tap `+2` -> verify current period rival score increases by 2 and total rival score increases by 2.
  3. Tap `-1` -> verify current period rival score decreases by 1.
  4. Tap `+1 Foul` -> verify current period rival fouls increment and chronometer **automatically pauses**.
  5. Tap `-1 Foul` -> verify current period rival fouls decrement.
- **Expected Outcome**: Accurate rival score and foul adjustments with auto-stop on fouls.

### Scenario 9: Player Identification Fallback & Edge Cases
- **Steps**:
  1. Provide player with `{ number: "7", firstName: "Luka", lastName: "Doncic" }` -> verify output is `"#7"`.
  2. Provide player with `{ number: null, firstName: "Alex", lastName: "Delgado" }` -> verify output is `"A. Delgado"`.
  3. Provide player with `{ number: "", firstName: "  Pablo  ", lastName: " Stegmann " }` -> verify trimmed output is `"P. Stegmann"`.
  4. Provide player with missing first name `{ number: undefined, firstName: "", lastName: "Ibaka" }` -> verify output is `"Ibaka"`.
  5. Provide player with missing last name `{ number: null, firstName: "Ricky", lastName: "" }` -> verify output is `"Ricky"`.
  6. Provide player with both names missing `{ number: null, firstName: null, lastName: null }` -> verify safe fallback `"Jugador"`.
- **Expected Outcome**: 100% test pass on `formatPlayerIdentifier.test.ts` with zero exceptions.

