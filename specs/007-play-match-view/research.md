# Research & Architectural Decisions: Play Match View

**Feature**: `007-play-match-view` | **Date**: 2026-10-03

## 1. Three-Component Architecture & Centralized Store

### Decision
Structure the match play view into three distinct components coordinated by a single Zustand global store (`usePlayMatchStore`):
- **Component 1 (Time, Score, and Fouls Controller)**: Manages period transitions (`q1`, `q2`, `q3`, `q4`, `extra`), chronometer, period/total scores, and period team fouls.
- **Component 2 (Team Management & Court Canvas)**: Renders half-court canvas with 5 active position buttons, player representation circles (`jerseyNumber`, `name`, `minutos`, `pts`), horizontal bench list, "Swap" balanced substitution mode, and quota-based timeout controls.
- **Component 3 (Rival Panel Control)**: Dedicated bottom panel for rival period score adjustments (+1, +2, +3, -1) and rival period team fouls (+1, -1).

### Rationale
- Modular breakdown maintains clear separation of concerns, high render performance via granular Zustand selectors, and easy unit testability.
- Centralizing game state ensures that scoring, foul events, player minutes, substitutions, and timeouts remain 100% synchronized across all three components.

### Alternatives Considered
- Monolithic single-file component: Rejected due to excessive re-render cascades, poor testability, and difficult code maintenance.

---

## 2. Interaction Patterns: Single Tap vs 3-Second Long Press

### Decision
Implement distinct gesture handlers for core widgets in Component 1:
1. **Period Switcher**:
   - **Single Tap**: Advances immediately to the next period in sequence (`q1` -> `q2` -> `q3` -> `q4` -> `extra`).
   - **3-Second Long Press (`delayLongPress: 3000`)**: Opens `PeriodSelectModal`, allowing direct selection of any period (`q1`, `q2`, `q3`, `q4`, `extra`).
2. **Crono (Game Timer)**:
   - **Single Tap**: Toggles starting / pausing the chronometer.
   - **3-Second Long Press (`delayLongPress: 3000`)**: Opens `ManualTimeModal`, allowing the coach to manually configure remaining minutes and seconds for the current period.

### Rationale
- Fast single-tap actions support quick in-game operation (e.g., instant clock pause or moving to next quarter during timeouts).
- 3-second long-press prevents accidental triggering of modal dialogs during high-stress live match conditions while providing full manual control when needed.

---

## 3. Half-Court Canvas, Position Buttons & Empty Slot States

### Decision
- Render an interactive half basketball court canvas with 5 position buttons.
- If a position does not have a designated player, display an empty placeholder slot indicating that the lineup is incomplete.
- Each assigned player (on-court quintet and bench) is visually rendered inside a circle showing:
  - `jerseyNumber` (prominent top/center)
  - `name` (first name / initial)
  - `minutos` (formatted as `MM:SS` or integer minutes)
  - `pts` (calculated as `t1a * 1 + t2a * 2 + t3a * 3`)

### Rationale
- Circles provide a clear, mobile-friendly touch target on the court canvas and bench list.
- Showing points and played minutes directly on the player circles gives the coach immediate tactical insight without needing to open sub-menus.

---

## 4. Multi-Step Player Statistics Logging & Assists Attribution

### Decision
Tapping an active on-court player button opens the `PlayerStatsModal` displaying:
1. **Shooting stats**:
   - `t1a` (1pt made: +1 pt to player, period score, total score) & `t1i` (1pt missed)
   - `t2a` (2pt made: +2 pts to player, period score, total score) & `t2i` (2pt missed)
   - `t3a` (3pt made: +3 pts to player, period score, total score) & `t3i` (3pt missed)
2. **Assist Prompt on `t2a` / `t3a`**:
   - When `t2a` or `t3a` is tapped, the modal immediately switches to an assist selection view showing the remaining 4 active on-court teammates plus a "non assistant" ("No Assistant") option.
   - Selecting a teammate increments that player's `asis` stat; selecting "non assistant" records the basket without assist credit.
3. **Rebounds**:
   - Both **Offensive Rebound** and **Defensive Rebound** MUST exist as distinct selectable buttons.
4. **Fouls**:
   - `fault` (personal foul) increments player fouls, adds 1 team foul to the active period, and **automatically pauses the running chronometer**.
5. **Other Stats**:
   - Direct assist (`asis`), ball lost / turnover (`lost`), and ball recovery / steal (`recovers`).

### Rationale
- Complete compliance with official basketball scorekeeping (FIBA/FEB) while streamlining common multi-step sequences into quick 2-to-3 tap flows.

---

## 5. Substitutions with "Swap" Mode & Balanced Invariant

### Decision
- A prominent "Swap" button in the team panel activates **Swap Mode**.
- Substitutions are strictly restricted to when the chronometer is paused.
- In Swap Mode, on-court quintet players and bench players are selectable.
- The confirm action is enabled **only if** `selectedCourtCount === selectedBenchCount` and `selectedCourtCount > 0` (strictly enforcing $N\text{ in} = N\text{ out}$).
- Executing the swap updates on-court and bench assignments and automatically exits Swap Mode.

### Rationale
- Guarantees the invariant of exactly 5 players on the court during active play and prevents unbalanced team lineups.

---

## 6. Timeout Quotas & Overtime Reset Mechanism

### Decision
- **Timeout Quota Rules**:
  - Periods `q1` & `q2` (First Half): Initialized with a shared pool of 2 timeouts total. Using 2 timeouts in `q1` leaves 0 timeouts for `q2`. Unused timeouts do not roll over to `q3`.
  - Periods `q3` & `q4` (Second Half): Initialized with a shared pool of 3 timeouts total.
  - Extra Time (`extra`): Initialized with 1 timeout.
  - **Extra Time Crono Reset**: When the timer is reset to 5:00 in extra time, +1 additional timeout is awarded, while existing period scores, team fouls, and player stats remain intact.
- **Controls**: Increase (`+`) and decrease (`-`) buttons in the same row as the Swap button (spaced between) allow incrementing/decrementing timeouts with a floor at 0.

---

## 7. Rival Control Panel

### Decision
- Positioned at the bottom of the screen with clear high-contrast buttons:
  - Period Score: `+1`, `+2`, `+3`, and `-1` (floor at 0).
  - Period Team Fouls: `+1` (which automatically pauses the running chronometer) and `-1` (floor at 0).
- Automatically maintains period isolation and updates total rival score as the sum of all period scores.

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
   - Bottom section: Minutes and points formatted as `${min}min / ${pts}pts` with monospace font.

### Rationale
- In live basketball scorekeeping, coaches identify players primarily by their jersey numbers. Displaying only the jersey number when available keeps the player circle clean, highly legible, and free from text clutter inside compact touch targets (w-20 h-20, 80x80 dp).
- When jersey numbers are missing (e.g., casual games or incomplete rosters), standard sports shorthand (`[First Initial]. [Last Name]`) provides concise yet unambiguous player identification without overflowing the circle width.
- Graceful edge-case handling guarantees zero runtime null pointer crashes and zero UI layout breaks even with messy user input (e.g., untrimmed strings, single names, or unpopulated fields).

### Alternatives Considered
- **Displaying both jersey number and player name**: Rejected per user specification update (2026-10-24). Redundant name text cramps the circle and forces small, illegible fonts (6-8px).
- **Displaying full player name when jersey number is missing**: Rejected because long names (e.g., "Alejandro Delgado") overflow an 80px circle or truncate awkwardly. The abbreviated initial pattern (`A. Delgado`) fits neatly within mobile dimensions.

