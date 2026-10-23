# Research: Match Detail View & Advanced Analytics

**Feature Branch**: `009-match-detail-view`  
**Date**: 2026-10-22  
**Status**: Completed  

---

## 1. Technical Context & Clarifications

### Research Topic 1: Radar / Polygon Chart Implementation in Expo React Native

- **Question**: How should the 8-axis radar polygon chart for team advanced statistics be rendered cleanly in the React Native / Expo environment?
- **Decision**: Use `react-native-svg` (installed via `npm install react-native-svg`) with a custom `PolygonRadarChart` component.
- **Rationale**:
  - `react-native-svg` is the standard Expo-supported library for 2D vector graphics and SVG paths.
  - It renders scalable vector polygons (`<Polygon>`, `<Line>`, `<Circle>`, `<Text>`, `<Svg>`) with exact coordinate control, anti-aliased edges, responsive scaling (`viewBox`), and native styling support.
  - A dry-run installation confirms 0 peer conflicts with the current project configuration (`react-native: 0.86.3`, `expo: ~57.0.25`).
  - Unit tests for SVG components are straightforwardly supported in Jest with standard SVG mock / snapshot testing.
- **Alternatives Considered**:
  - *Pure React Native `View` hacks with borders/rotation*: Complex to form non-regular 8-sided polygons dynamically; lacks smooth fill polygons.
  - *Third-party heavyweight charting library (e.g., Victory Native, React Native Chart Kit)*: Introduces massive unnecessary dependency footprints, opinionated styling conflicts with NativeWind, and poor customizability for our specific 8 basketball efficiency metrics.

---

### Research Topic 2: Advanced Basketball Efficiency Metrics Formulas & Boundary Conditions

- **Question**: What are the exact mathematical definitions and safe boundary conditions for each of the 8 required team efficiency metrics?
- **Decision**: Implement a pure, robust utility module `src/features/match-detail/utils/calculations.ts` exporting `calculateAdvancedStats(matchData, playerStats)`.
- **Formulas & Safety Checks**:
  1. **Posesiones (total)**:
     - Formula: `0.96 * (total 2PA + total 3PA + 0.44 * total 1PA + Total Offensive Rebounds - Total Ball Lost)`
     - Implementation: Where `2PA = sum(p.t2i)`, `3PA = sum(p.t3i)`, `1PA = sum(p.t1i)`, `Offensive Rebounds = sum(p.oreb)`, and `Ball Lost = sum(p.per)`.
     - Boundary: Returns `Math.max(0, result)`.
  2. **OER (Offensive Efficiency Rating)**:
     - Formula: `(Total Points / Posesiones) * 100`
     - Boundary: If `Posesiones <= 0`, return `0.0`.
  3. **DER (Defensive Efficiency Rating)**:
     - Formula: `(Total Rival Points / Posesiones) * 100`
     - Boundary: If `Posesiones <= 0`, return `0.0`.
  4. **eFG% (Effective Field Goal Percentage)**:
     - Formula: `100 * ((total 2PM + total 3PM + 0.5 * total 3PM) / (total 2PA + total 3PA))`
     - Boundary: If `(total 2PA + total 3PA) <= 0`, return `0.0`.
  5. **ORB% (Offensive Rebound Percentage)**:
     - Formula: `100 * (Total Offensive Rebounds / ((total 2PA - total 2PM) + (total 3PA - total 3PM) + (0.44 * (total 1PA - total 1PM))))`
     - Note: Denominator represents team missed shots: missed 2pt (`t2i - t2a`) + missed 3pt (`t3i - t3a`) + 0.44 * missed free throws (`t1i - t1a`).
     - Boundary: If denominator `<= 0`, return `0.0`.
  6. **AST% (Assist Percentage)**:
     - Formula: `100 * (Total Asist / (total 2PA + total 3PA + 0.44 * total 1PA + Total Ball Lost))`
     - Boundary: If denominator `<= 0`, return `0.0`.
  7. **TOV% (Turnover Percentage)**:
     - Formula: `100 * (Total Ball Lost / Posesiones)`
     - Boundary: If `Posesiones <= 0`, return `0.0`.
  8. **FTR (Free Throw Rate)**:
     - Formula: `100 * (total 1PM / (total 2PA + total 3PA))`
     - Boundary: If `(total 2PA + total 3PA) <= 0`, return `0.0`.
- **Radar Normalization**:
  - Each metric has a typical range in competitive basketball (e.g., eFG% typically 30%-70%, OER 70-130, etc.).
  - Normalization function maps each metric value to a `0.1` to `1.0` scale for radial plotting so the polygon remains aesthetically balanced and informative, accompanied by exact numerical readouts.

---

### Research Topic 3: Period Fouls Storage & Database Schema Migration

- **Question**: How are period fouls persisted and updated given that `games` currently only stores `result_c1..c4`?
- **Decision**:
  - Extend the `games` SQLite table with 10 integer columns defaulting to 0:
    - `fouls_c1`, `fouls_c2`, `fouls_c3`, `fouls_c4`, `fouls_extra` (Team fouls per period)
    - `fouls_c1_opponent`, `fouls_c2_opponent`, `fouls_c3_opponent`, `fouls_c4_opponent`, `fouls_extra_opponent` (Rival fouls per period)
  - In `src/db/schema.ts`, declare the 10 fields on the `games` Drizzle table definition.
  - In `src/db/index.ts` (`initDatabase()`), append non-destructive `ALTER TABLE games ADD COLUMN ... DEFAULT 0;` migrations inside `try { ... } catch {}` blocks (mirroring existing migration patterns in the app).
  - In `src/features/play-match/PlayMatch.tsx`, update the match finalization save routine so live period fouls recorded during the game are automatically persisted to these new columns.
- **Rationale**:
  - Fulfills FR-003, FR-011, and FR-012 with complete persistence.
  - Guarantees backward compatibility: existing database records without fouls default to 0 and do not corrupt or fail.

---

### Research Topic 4: Player Valuation & Deterministic Roster Sorting

- **Question**: How is player valuation defined and sorted when players have equal valuations?
- **Decision**:
  - Valuation (`Value`) follows the established domain formula from `usePlayMatchStore.ts`:
    `Value = (t1a + t2a + t3a + oreb + dreb + asis + rec) - (per + falt + missedT1 + missedT2 + missedT3)`
  - Roster sorting algorithm:
    1. Primary: Valuation descending (`b.valuation - a.valuation`).
    2. Secondary: Total points descending (`calculatePoints(b) - calculatePoints(a)`).
    3. Tertiary: Jersey number ascending (`Number(a.number) - Number(b.number)`).
- **Rationale**:
  - Produces 100% deterministic, jitter-free ordering in UI even when multiple players have identical or 0 valuation. Handles negative valuation values smoothly.

---

### Research Topic 5: Navigation & GameList Integration

- **Question**: How should `GameList` route between pending matches and finished matches?
- **Decision**:
  - When the user taps a match card in `GameList.tsx`:
    - If `game.status === 'finished'`, set `gameSelected` and render `<MatchDetailView match={gameSelected} onReturn={handleReturnFromDetail} />`.
    - If `game.status !== 'finished'` (pending), retain existing mandatory roster check and navigate to `<PlayMatch match={gameSelected} ... />`.
- **Rationale**:
  - Fulfills FR-015 seamlessly without disrupting the existing match play or roster validation workflow.
