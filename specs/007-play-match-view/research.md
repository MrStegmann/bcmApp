# Research & Architectural Decisions: Play Match View

**Feature**: `007-play-match-view` | **Date**: 2026-10-28 (Updated with Design Refactorization: Responsive Layout, Scaled Player Circles, Overtime Reset Relocation & Score-Only Header)

## 1. Three-Component Architecture & Centralized Store

### Decision
Structure the match play view into three distinct components coordinated by a single Zustand global store (`usePlayMatchStore`):
- **Component 1 (Time, Score, and Fouls Controller)**: Manages period transitions (`q1`, `q2`, `q3`, `q4`, `extra`), chronometer, period/total scores, and period team fouls. Application Header displays exclusively the live total match score `${teamTotalScore} - ${rivalTotalScore}`.
- **Component 2 (Team Management & Court Canvas)**: Renders a fluidly responsive half-court canvas with 5 active position buttons, compact player representation circles (`jerseyNumber` or formatted name fallback, continuous stint minutes for court players, cumulative minutes for bench, `pts`), horizontal bench list, "Swap" balanced substitution mode, quota-based timeout controls, and read-only `BenchPlayerStatsModal`.
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
   - **3-Second Long Press (`delayLongPress: 3000`)**: Opens `ManualTimeModal`, allowing the coach to manually configure remaining minutes and seconds for the current period, or trigger the extra-time reset option when active period is `extra`.
3. **Component 2 - On-Court Player Circles**:
   - **Single Tap**: Opens `PlayerStatsModal` to log shots, rebounds, fouls, assists, steals, turnovers.
   - **2-Second Hold (`delayLongPress: 2000`)**: Opens `PlayerStatSubtractionModal` to decrement recorded statistics with cascading assist reversal.
4. **Component 2 - Bench Player Circles**:
   - **Single Tap (Swap Mode Inactive)**: Opens `BenchPlayerStatsModal` displaying complete in-game statistics for the selected bench player.
   - **Single Tap (Swap Mode Active)**: Toggles bench player selection for substitution ($N\text{ in} = N\text{ out}$).
   - **2-Second Hold**: Ignored (bench players cannot trigger stat subtraction).

### Rationale
- Fast single-tap actions support quick in-game operation.
- 3-second long-press on header widgets prevents accidental triggering of modal dialogs during high-stress live match conditions while providing full manual control when needed.
- 2-second hold on on-court players establishes an intuitive, differentiated tactile entry for stat error correction without cluttering the primary tap-to-add stats flow.
- Tapping a bench player outside Swap mode provides instant, zero-friction access to player box score statistics.

---

## 3. Stint Tracking vs Cumulative Match Time

### Decision
Maintain two distinct time counters per player:
1. **`secondsPlayed` (Cumulative Match Seconds)**:
   - Continuously accumulates whenever the chronometer is running and the player is assigned to the on-court quintet.
   - Preserves total playing time across the entire match for database persistence and official box scores.
   - Displayed on bench player circles below the divisor line: `${min}min / ${pts}pts` and in `BenchPlayerStatsModal`.
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
- The top header already prominently displays `${teamTotalScore} - ${rivalTotalScore}`. Duplicating the total rival points in the bottom panel wasted valuable horizontal screen space.
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
- In live basketball scorekeeping, coaches identify players primarily by their jersey numbers. Displaying only the jersey number when available keeps the player circle clean, highly legible, and free from text clutter inside compact touch targets.
- When jersey numbers are missing, standard sports shorthand (`[First Initial]. [Last Name]`) provides concise yet unambiguous player identification without overflowing the circle width.
- Graceful edge-case handling guarantees zero runtime null pointer crashes and zero UI layout breaks even with messy user input.

---

## 9. Bench Player Statistics Information Modal & Backdrop Dismissal

### Decision
Implement `BenchPlayerStatsModal` dedicated to displaying cumulative in-game statistics for benched players:
1. **Trigger & Swap Mode Guard**:
   - In `PlayMatch.tsx` / `TeamManagementPanel`, tapping a bench player circle invokes `onSelectBenchPlayer(player)`.
   - If `swap.isSwapMode` is active, the click toggles selection for substitution (`selectSwapBenchPlayer(player.id)`) and suppresses opening the modal.
   - If `swap.isSwapMode` is inactive, `selectedBenchPlayerForStats` state is set and `BenchPlayerStatsModal` opens.
2. **Read-Only Character**:
   - Unlike `PlayerStatsModal` (used for live court stat recording) and `PlayerStatSubtractionModal` (used for decrementing stats on court), `BenchPlayerStatsModal` is strictly an informational overview. No stat mutation buttons or assist linkages are exposed.
3. **Dismissal Patterns**:
   - Header close button: A prominent cross (`✕`) button (e.g., Lucide `X` icon) in the top right.
   - Backdrop touch: Tapping the surrounding semi-transparent backdrop overlay (`TouchableWithoutFeedback` or overlay `Pressable`) dismisses the modal.
   - Content bounds protection: Tapping inside the modal card container consumes the touch event and does NOT dismiss the modal.
4. **Visual Layering & Prominence**:
   - Dimmed backdrop overlay (`bg-black/75` or `bg-slate-950/80`) covering the full viewport (`inset-0 absolute/Modal`).
   - Centered elevated card (`bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl max-w-sm w-11/12`).
   - Top header: Player identification (via `formatPlayerIdentifier`) and subtitle, with **Total Minutes (`min`)** and **Points (`pts`)** rendered prominently in large, bold typography with distinct background pill containers (`bg-slate-800/80 px-4 py-2 rounded-xl`).
   - Body: Divided into structured stat sections:
     - Shooting breakdown (1pt, 2pt, 3pt) formatted via `formatThrowStat`.
     - Rebounds: Offensive (`oreb`), Defensive (`dreb`), and Total (`oreb + dreb`).
     - Playmaking & Defense: Assists (`asis`), Steals (`rec`), Turnovers (`per`), Personal Fouls (`falt`).
     - Valuation badge: Prominently formatted composite valuation score (`valuation`).

### Rationale
- Quick access to bench player box scores enables informed tactical rotation decisions without interrupting match timing.
- Clear dismissal mechanics (cross button + backdrop tap) adhere to mobile UX conventions and allow one-handed dismissal on mobile screens.

---

## 10. Throw Statistics Formatter (`s/a (#%)`) & Zero-Attempt Handling

### Decision
Implement a pure utility function `formatThrowStat(succeed: number, missed: number): string`:
1. **Formula**:
   - Total attempts: `attempts = succeed + missed`.
   - If `attempts === 0`: Return `"0/0 (0%)"`.
   - If `attempts > 0`:
     - Percentage: `pct = Math.round((succeed / attempts) * 100)`.
     - Output: `${succeed}/${attempts} (${pct}%)`.
2. **Application in `BenchPlayerStatsModal`**:
   - Free Throws (1pt): `formatThrowStat(player.t1a, player.t1i)` (e.g., `"2/3 (67%)"`).
   - 2-Point Field Goals (2pt): `formatThrowStat(player.t2a, player.t2i)` (e.g., `"4/5 (80%)"`).
   - 3-Point Field Goals (3pt): `formatThrowStat(player.t3a, player.t3i)` (e.g., `"1/4 (25%)"`).
3. **Edge Case Safety**:
   - Explicitly checks for 0 attempts and non-finite numbers before computing division, eliminating `NaN%`, `Infinity%`, or runtime division-by-zero defects.

### Rationale
- Basketball scorekeeping standardizes shooting efficiency in the `made/attempted (percentage%)` notation.
- Isolating this logic into a pure, testable utility guarantees 100% adherence to FR-039 and constitution Principle I (TDD).

---

## 11. Responsive Layout & Dynamic Half-Court Canvas Scaling for Small Mobile Screens

### Decision
1. **Flex-Based Viewport Distribution**:
   - Replace fixed-height containers (e.g. `h-80` / 320dp) with a responsive, flex-driven court canvas container (`flex-1` with minimum height constraints).
   - Measure actual rendered canvas container bounds using `onLayout` or calculate responsive dimensions based on viewport height (`useWindowDimensions`).
2. **Dynamic Court Arc Positions Calculation**:
   - Update `courtArcPositions.ts` to compute player slot coordinates dynamically:
     ```typescript
     export const getResponsiveArcPositions = (canvasWidth: number, canvasHeight: number): CourtArcPosition[] => {
       const scaleY = Math.min(1, Math.max(0.65, canvasHeight / 320));
       const scaleX = Math.min(1, Math.max(0.75, canvasWidth / 360));
       // Scale baseline coordinates and arc radius proportionally
       ...
     };
     ```
   - Ensure the outer arc, key lines, and 5 position coordinates scale proportionally so that on-court players are always centered comfortably within the canvas and never clip below the bottom edge or get pushed behind the bench panel.
3. **Compact Sizing**:
   - Avoid fixed padding or margin expansion in the top controller and bottom bench panel on small screens so that maximum vertical real estate is reserved for the court.

### Rationale
- Mobile devices vary widely from compact screens (360x640) to standard modern phones (390x844, 412x915). A fixed height causes vertical overflow on small screens, pushing court players behind the bench panel. Responsive coordinate scaling guarantees that all 5 positions remain 100% visible and interactive on any device.

---

## 12. Overtime Crono Reset Button Relocation to "Ajustar Tiempo" (`ManualTimeModal`)

### Decision
1. **Remove Standalone Button from `TimeScoreFoulsController`**:
   - Completely remove `<TouchableOpacity testID="reset-extra-crono-button">` from the crono/period row in `TimeScoreFoulsController.tsx`.
   - Eliminate unnecessary horizontal layout stretching and vertical disruption during `extra` period.
2. **Relocate to `ManualTimeModal`**:
   - In `ManualTimeModal.tsx`, when `periodKey === "extra"` (or `isExtraPeriod` is true), render a dedicated "Reiniciar Tiempo Extra (05:00)" button option above or alongside presets.
   - When tapped:
     - Invokes the store's `resetExtraTimeCrono()`, restoring the clock to 05:00, preserving period score/fouls, and adding +1 timeout.
     - Closes `ManualTimeModal`.
3. **Prop Contract Adjustment**:
   - Pass `onResetExtraTimeCrono` to `ManualTimeModalProps`.
   - Remove `onResetExtraTimeCrono` from `TimeScoreFoulsControllerProps`.

### Rationale
- Placing the extra-time reset button next to the live timer on the main screen caused layout jitter, shifted the center VS badge, and pushed down the canvas below.
- Time adjustment belongs conceptually inside the "Ajustar Tiempo" modal (opened via 3s long press on the timer), where coaches intentionally manage period clock configurations.

---

## 13. Scaled-Down Compact Player Circle Representations & Format Alignment

### Decision
1. **Compact Circle Dimensions**:
   - Sized down from `w-14 h-14` (56x56 dp) or `w-20 h-20` to compact `w-11 h-11` or `w-12 h-12` (44x44 or 48x48 dp), perfectly meeting mobile accessibility minimum touch target requirements while drastically reducing screen footprint.
2. **Standardized Content Stack**:
   - Top: Exclusive identifier string (`#23` or `A. Arias` via `formatPlayerIdentifier`) with `numberOfLines={1}` in bold high-contrast text (`text-xs font-black`). Redundant names are never rendered when jersey number exists.
   - Divisor: Ultra-compact horizontal line (`w-6 h-px bg-slate-border my-0.5`).
   - Bottom:
     - On-Court: `${stintMin}min / ${pts}pts` (e.g. `2m/4p` or `2min / 4pts` in compact typography `text-[8px] font-mono font-bold`).
     - Bench: `${min}min / ${pts}pts` (e.g. `12m/10p` or `12min / 10pts` in compact typography `text-[8px] font-mono font-bold`).
3. **Responsive Bench Item Margin**:
   - Bench circles have tight horizontal margins (`mr-2`) allowing more players to be visible on the screen simultaneously without excessive scrolling.

### Rationale
- Smaller player circles eliminate overlap and allow fluid layout on small phones.
- Formatting stint minutes and points cleanly below a divisor gives the coach vital information (fatigue and scoring output) at a glance without text clipping.

---

## 14. Enlarged Score-Only Application Header (Omission of Team Names)

### Decision
1. **Application Header Redesign for Play Match**:
   - In `src/components/Header.tsx`, when rendering match header score, or when `matchHeaderInfo` is configured for play match:
     - Render **exclusively** the total score formatted as `${teamTotalScore} - ${rivalTotalScore}` (e.g. `102 - 98`).
     - Completely omit local team name and rival team name elements.
     - Enlarge typography to `text-2xl font-black` (or larger `text-3xl`) with high-contrast text (`text-court-orange` for home, `text-tactical-blue-light` or `text-white` for rival).
2. **Preserve Action Buttons**:
   - Maintain left return button (`onReturn`) and right finalize match button (`handleFinishMatch`).
   - Center score badge expands horizontally and vertically to fill the header comfortably.
3. **MenuStore Contract Compatibility**:
   - Update `setMatchHeaderInfo` or `MatchHeaderInfo` interface to support omitting team names or configure score-only mode (`showTeams?: boolean` or simply omit rendered team names in `Header.tsx` during match play).

### Rationale
- Coaches and scorekeepers need to see the score instantly from a distance under glare or during intense moments.
- Team names crowd the top bar and force small score numbers. Removing team names frees the entire header space for high-visibility score digits.
