# Research & Architectural Decisions: Play Match View

**Feature**: `007-play-match-view` | **Date**: 2026-10-24 (Updated with Stint Tracking, Rival Layout, Long-Press Stat Subtraction & Unrestricted Substitutions)

## 1. Three-Component Architecture & Centralized Store

### Decision
Structure the match play view into three distinct components coordinated by a single Zustand global store (`usePlayMatchStore`):
- **Component 1 (Time, Score, and Fouls Controller)**: Manages period transitions (`q1`, `q2`, `q3`, `q4`, `extra`), chronometer, period/total scores, and period team fouls. Application Header displays live match score `${teamName} ${teamTotalScore} - ${rivalTotalScore} ${rivalName}`.
- **Component 2 (Team Management & Court Canvas)**: Renders half-court canvas with 5 active position buttons, player representation circles (`jerseyNumber` or formatted name fallback, continuous stint minutes for court players, cumulative minutes for bench, `pts`), horizontal bench list, "Swap" balanced substitution mode, and quota-based timeout controls.
- **Component 3 (Rival Panel Control)**: Full-width bottom panel for rival period score adjustments (+1, +2, +3, -1) and rival period team fouls (+1, -1), without redundant rival total points counter.

### Rationale
- Modular breakdown maintains clear separation of concerns, high render performance via granular Zustand selectors, and easy unit testability.
- Centralizing game state ensures that scoring, foul events, player stint and cumulative minutes, substitutions, and timeouts remain 100% synchronized across all three components.

### Alternatives Considered
- Monolithic single-file component: Rejected due to excessive re-render cascades, poor testability, and difficult code maintenance.

---

## 2. Interaction Patterns: Single Tap, 2-Second Hold vs 3-Second Long Press

### Decision
Implement distinct gesture handlers for core widgets across Component 1 and Component 2:
1. **Component 1 - Period Switcher**:
   - **Single Tap**: Advances immediately to the next period in sequence (`q1` -> `q2` -> `q3` -> `q4` -> `extra`).
   - **3-Second Long Press (`delayLongPress: 3000`)**: Opens `PeriodSelectModal`, allowing direct selection of any period (`q1`, `q2`, `q3`, `q4`, `extra`).
2. **Component 1 - Crono (Game Timer)**:
   - **Single Tap**: Toggles starting / pausing the chronometer.
   - **3-Second Long Press (`delayLongPress: 3000`)**: Opens `ManualTimeModal`, allowing the coach to manually configure remaining minutes and seconds for the current period.
3. **Component 2 - On-Court Player Circles**:
   - **Single Tap**: Opens `PlayerStatsModal` to log shots, rebounds, fouls, assists, steals, turnovers.
   - **2-Second Hold (`delayLongPress: 2000`)**: Opens `PlayerStatSubtractionModal` to decrement recorded statistics with cascading assist reversal.
4. **Component 2 - Bench Player Circles**:
   - **Single Tap**: In Swap Mode, toggles bench player selection. Outside Swap Mode, triggers quick inspect or position slot assignment.
   - **2-Second Hold**: Ignored (bench players cannot trigger stat subtraction).

### Rationale
- Fast single-tap actions support quick in-game operation.
- 3-second long-press on header widgets prevents accidental triggering of modal dialogs during high-stress live match conditions while providing full manual control when needed.
- 2-second hold on on-court players establishes an intuitive, differentiated tactile entry for stat error correction without cluttering the primary tap-to-add stats flow.

---

## 3. Stint Tracking vs Cumulative Match Time

### Decision
Maintain two distinct time counters per player:
1. **`secondsPlayed` (Cumulative Match Seconds)**:
   - Continuously accumulates whenever the chronometer is running and the player is assigned to the on-court quintet.
   - Preserves total playing time across the entire match for database persistence and official box scores.
   - Displayed on bench player circles below the divisor line: `${min}min / ${pts}pts`.
2. **`stintSeconds` (Current Continuous On-Court Stint Seconds)**:
   - Tracks the duration a player has spent on the court during their current active stint.
   - Starts at `0` upon court entry (whether starting five, quick assign, or substitution).
   - Increments every second while on court and the chronometer is running.
   - Resets to `0` whenever a player leaves the court to the bench and subsequently returns to play.
   - Displayed on on-court player circles below the divisor line: `${stintMin}min / ${pts}pts`.

### Rationale
- Real-time stint tracking gives coaches immediate tactical awareness of player fatigue and rotation timing on the floor.
- Keeping cumulative minutes intact in parallel ensures compliance with permanent database records and statistical reporting.

---

## 4. Stat Subtraction & Cascading Assist Reversal

### Decision
Implement `PlayerStatSubtractionModal` triggered strictly via a 2-second hold on active on-court players:
1. **Deductible Stats**: Points/shots (`t1a`, `t2a`, `t3a`), rebounds (`oreb`, `dreb`), personal fouls (`falt`), assists (`asis`), steals (`rec`), turnovers (`per`). All stats floor at 0.
2. **Event Linkage via `ScoreEventLink`**:
   - Maintain an in-memory chronological list of scoring events:
     ```typescript
     interface ScoreEventLink {
       id: string;
       scoringPlayerId: number;
       period: PeriodKey;
       shotType: "t2a" | "t3a";
       points: 2 | 3;
       assistingPlayerId?: number | null;
       timestamp: number;
     }
     ```
   - When a made 2pt or 3pt shot is recorded with an assist, a `ScoreEventLink` is saved with `assistingPlayerId`.
   - When a made 2pt or 3pt shot is decremented during stat subtraction:
     - The most recent matching `ScoreEventLink` for that player in the current period is located and removed.
     - The player's points and shot count (`t2a` or `t3a`) are decremented.
     - The current period's team score and total team score are decremented by 2 or 3 points.
     - If the removed `ScoreEventLink` had an `assistingPlayerId`, that assisting teammate's `asis` count is automatically decremented (cascading assist subtraction), and their valuation is recalculated.
     - If the shot was unassisted ("non assistant"), only the points and score are deducted without affecting any teammate's assists.

### Rationale
- Coaches and scorekeepers inevitably make occasional misclicks during fast-paced games. Enabling quick 2-second hold subtraction directly from the player circle eliminates the need to navigate complex audit logs.
- Automatic assist deduction prevents orphaned assist statistics when correcting mistaken shot entries.

---

## 5. Unrestricted Substitutions with Balanced Invariant ($N\text{ in} = N\text{ out}$)

### Decision
- The coach can tap "Swap" to enter **Swap Mode** at any time, whether the chronometer is running or paused.
- In Swap Mode, on-court quintet players and bench players can be freely toggled.
- The confirm substitution action is enabled **only if** `selectedCourtPlayerIds.length === selectedBenchPlayerIds.length` and `selectedCourtPlayerIds.length > 0` (strictly enforcing $N\text{ in} = N\text{ out}$).
- Executing the swap:
  - Updates on-court and bench assignments.
  - Newly entering players initialize `stintSeconds = 0` and immediately start accumulating stint seconds if the clock is running.
  - Clock continues running uninterrupted if it was already running.
  - Automatically exits Swap Mode.

### Rationale
- Live basketball substitutions frequently occur in fluid game phases. Restricting substitution to clock-paused states introduced unnecessary friction and blocked coaches from preparing or confirming rotations during continuous play.
- Enforcing $N\text{ in} = N\text{ out}$ preserves the absolute invariant of exactly 5 players on court at all times.

---

## 6. Full-Width Rival Control Panel Layout

### Decision
- Redesign `RivalPanelControl` to span 100% of the available container width (`w-full`).
- Remove the rival total points counter element completely from the bottom rival panel.
- Layout prominently features:
  - Rival Period Points: `+1`, `+2`, `+3`, and `-1` (floor at 0).
  - Rival Period Team Fouls: `+1` (which automatically pauses the running chronometer) and `-1` (floor at 0).
  - Current period rival score and foul badges.
- Total rival score is displayed exclusively in the top global match header.

### Rationale
- The top header already prominently displays `${teamName} ${teamTotalScore} - ${rivalTotalScore} ${rivalName}`. Duplicating the total rival points in the bottom panel wasted valuable horizontal screen space.
- Extending the panel to 100% width provides generous, comfortable touch targets for live scoring adjustments without accidental touches.

---

## 7. Timeout Quotas & Overtime Reset Mechanism

### Decision
- **Timeout Quota Rules**:
  - Periods `q1` & `q2` (First Half): Initialized with a shared pool of 2 timeouts total. Using 2 timeouts in `q1` leaves 0 timeouts for `q2`. Unused timeouts do not roll over to `q3`.
  - Periods `q3` & `q4` (Second Half): Initialized with a shared pool of 3 timeouts total.
  - Extra Time (`extra`): Initialized with 1 timeout.
  - **Extra Time Crono Reset**: When the timer is reset to 5:00 in extra time, +1 additional timeout is awarded, while existing period scores, team fouls, and player stats remain intact.
- **Controls**: Increase (`+`) and decrease (`-`) buttons in the same row as the Swap button (spaced between) allow incrementing/decrementing timeouts with a floor at 0.

---

## 8. Player Identification Display & Fallback Name Formatting

### Decision
Implement a pure utility `formatPlayerIdentifier(player)` for player identification display in all player representation circles (court canvas and bench):
1. **Jersey Number Priority**:
   - Check if `player.number` exists, is non-null, and has non-empty trimmed content (`player.number?.trim()`).
   - If present, format as `#${player.number.trim()}` (or `${player.number.trim()}`) and display **exclusively** as the player identifier in the circle. Omit redundant name text completely.
2. **Fallback Name Formatting (`[First Initial]. [Last Name]`)**:
   - When jersey number is absent, null, undefined, or empty/whitespace string `""`:
     - Trim surrounding whitespace on `firstName` and `lastName`.
     - If both `firstName` and `lastName` are non-empty: Return `${firstName.trim().charAt(0).toUpperCase()}. ${lastName.trim()}` (e.g., `A. Arias`, `A. Delgado`, `P. Stegmann`).
     - If `firstName` is absent/empty and `lastName` is non-empty: Return `${lastName.trim()}`.
     - If `lastName` is absent/empty and `firstName` is non-empty: Return `${firstName.trim()}`.
     - If both `firstName` and `lastName` are absent/empty: Return safe neutral default `"Jugador"`.
3. **Circle Visual Layout**:
   - Top section: Single identifier string (either `#23` or `A. Arias`) centered in the circle with `numberOfLines={1}`.
   - Middle section: Horizontal separator/divisor line (`w-10 h-px bg-slate-700 my-0.5`).
   - Bottom section:
     - On-court: Stint minutes and points formatted as `${stintMin}min / ${pts}pts` with monospace font.
     - Bench: Cumulative minutes and points formatted as `${min}min / ${pts}pts` with monospace font.

### Rationale
- In live basketball scorekeeping, coaches identify players primarily by their jersey numbers. Displaying only the jersey number when available keeps the player circle clean, highly legible, and free from text clutter inside compact touch targets (w-20 h-20, 80x80 dp).
- When jersey numbers are missing, standard sports shorthand (`[First Initial]. [Last Name]`) provides concise yet unambiguous player identification without overflowing the circle width.
- Graceful edge-case handling guarantees zero runtime null pointer crashes and zero UI layout breaks even with messy user input.
