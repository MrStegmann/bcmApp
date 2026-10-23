# Quickstart Validation Guide: Update Home View Page

**Feature**: `011-update-home-view`
**Date**: 2026-10-23
**Status**: Ready for Implementation Validation

---

## 1. Overview & Prerequisites

This guide outlines end-to-end test and validation scenarios to prove that the three new components on the Team Home View render correctly, adhere to the top-to-bottom order, calculate accurate statistical averages, handle empty states gracefully, and allow interactive roster configuration and match detail navigation.

### Prerequisites
- Node.js (v18+) and npm installed.
- Repository dependencies installed (`npm install`).
- Expo dev client or simulator ready for visual testing (`npm start`).

---

## 2. Automated Test Suite Execution

Run the complete test suite asserting all units, stores, calculation formulas, and UI integration:

```bash
# Run all home view unit & component tests
npm test -- src/features/home-view

# Run ClubProfile page integration tests
npm test -- src/__tests__/components/ClubProfile.test.tsx

# Run full project test suite
npm test
```

---

## 3. End-to-End Validation Scenarios

### Scenario 1: Next Match Display & Empty State (US1)
1. **Setup**: Seed or create a team with 2 scheduled matches with status `"pending"`.
   - Match A: scheduled for `"25/11/2026 - 18:00"` vs `"Real Madrid"`.
   - Match B: scheduled for `"12/11/2026 - 19:30"` vs `"Unicaja"`.
2. **Action**: Open the team's Home View (`TopMenuEnums.MAIN`).
3. **Expected Outcome**:
   - Section 1 (Top) displays Match B (Unicaja) because it is the earliest chronologically scheduled match.
   - Rival name (`Unicaja`) and date (`12/11/2026 - 19:30`) are clearly legible.
4. **Empty State Check**: Delete or finish all pending matches for the team.
   - **Expected Outcome**: The card displays the exact message: `"Sin próximos partidos agendados"`.

---

### Scenario 2: Quick Roster Callup from Home View (US1)
1. **Setup**: The earliest pending match has 0 players assigned in `player_stats`.
2. **Action**:
   - Observe Section 1: A visible button labeled `"Configurar Convocatoria"` / `"Make Roster"` is rendered.
   - Tap the button.
3. **Expected Outcome**:
   - The `RosterSelectionModal` opens with the team's available players.
4. **Action**:
   - Select 10 players and tap `"Confirmar Convocatoria"`.
5. **Expected Outcome**:
   - Modal closes.
   - The button on the card updates immediately to show that the roster is configured (or allows editing).

---

### Scenario 3: Last Three Matches Played with Period Scores (US2)
1. **Setup**: Team has 5 finished matches in database (Jornadas 1 to 5).
2. **Action**: Review Section 2 (Middle) of the Home View.
3. **Expected Outcome**:
   - Displays exactly 3 match cards in a single vertical column.
   - Sorted in reverse chronological order (newest played match at the top).
   - Each match displays:
     - Total score: Home team points vs Opponent points.
     - Period breakdown: Quarter scores (P1, P2, P3, P4, and OT when applicable) directly beneath total score.
4. **Zero-Matches Check**: If team has 0 finished matches, section displays a clean empty state without crashes.

---

### Scenario 4: Navigate to Match Detail View (US2)
1. **Action**: Tap on any finished match card in Section 2.
2. **Expected Outcome**:
   - Navigates immediately to the `MatchDetailView` for that specific match.
3. **Action**: Tap `"Volver"` in the match detail view.
4. **Expected Outcome**:
   - Returns to the Home View with all components intact and active data re-synchronized.

---

### Scenario 5: Global Advanced Stats Calculation (US3)
1. **Setup**: Team has completed matches with recorded player box scores.
2. **Action**: Review Section 3 (Bottom) of the Home View.
3. **Expected Outcome**:
   - Displays the 8 efficiency averages in a clean summary grid:
     1. `Posesiones` (e.g. `78.4`)
     2. `OER` (e.g. `96.2`)
     3. `DER` (e.g. `91.0`)
     4. `eFG%` (e.g. `51.3%`)
     5. `ORB%` (e.g. `28.6%`)
     6. `AST%` (e.g. `58.2%`)
     7. `TOV%` (e.g. `14.1%`)
     8. `FTR` (e.g. `24.5%`)
   - Numerical values match the arithmetic mean across all completed games within $\pm 0.01$.
4. **Division-by-Zero Check**: When 0 matches are finished, all 8 values render safely as `0.0` or `0.0%` without `NaN` or unhandled exceptions.

---

## 4. Visual Layout & Scrolling Validation

1. Verify that the three components appear in exact order from top to bottom:
   1. Next Match Card
   2. Last Three Matches Column
   3. Global Stats Card
2. Verify that the view scrolls smoothly inside a root `ScrollView` on standard mobile screens without clipping or layout overflows.
