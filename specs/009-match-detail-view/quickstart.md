# Quickstart Validation Guide: Match Detail View

**Feature Branch**: `009-match-detail-view`  
**Date**: 2026-10-22  
**Status**: Ready  

---

## 1. Prerequisites & Environment

1. Repository root: `j:\GitHub\BasketApp\bcmApp`
2. Dependencies installed (`npm install` has been run)
3. New vector graphics package installed:
   ```bash
   npm install react-native-svg
   ```
4. Metro / Expo test runner available:
   ```bash
   npm test
   ```

---

## 2. Test Execution & Automated Verification

Run Jest unit and integration tests specifically targeting the `match-detail` feature:

```bash
# Run all match-detail feature tests
npm test src/features/match-detail

# Run calculations tests specifically to verify 8 advanced formulas
npm test src/features/match-detail/__tests__/calculations.test.ts

# Run store & state mutation tests
npm test src/features/match-detail/__tests__/useMatchDetailStore.test.ts

# Run full component integration tests
npm test src/features/match-detail/__tests__/MatchDetailView.test.tsx
```

### Expected Automated Outcomes
- `PASS src/features/match-detail/__tests__/calculations.test.ts`
  - Verifies exact math for Posesiones, OER, DER, eFG%, ORB%, AST%, TOV%, FTR.
  - Verifies 0 division-by-zero crashes when attempts or possessions are 0.
  - Verifies deterministic player valuation calculation.
- `PASS src/features/match-detail/__tests__/radarGeometry.test.ts`
  - Verifies 8-axis geometric coordinates, angles, and SVG polygon string generation.
- `PASS src/features/match-detail/__tests__/useMatchDetailStore.test.ts`
  - Verifies match loading, period parsing, roster sorting, and edit buffer saves.
- `PASS src/features/match-detail/__tests__/MatchDetailView.test.tsx`
  - Verifies complete UI rendering conforming to US1, US2, US3, and US4.

---

## 3. Manual Verification Scenarios (App UI)

### Scenario 1: Navigate to Finished Match & Validate Score / Period Breakdown (US1)
1. Start the application (`npm start`).
2. Navigate to the Matches list (`GameList`).
3. Tap on a match that has status `finished`.
4. **Verification**:
   - The view renders `MatchDetailView` with the cumulative score (e.g. `68 - 62`) at the top.
   - The period breakdown table displays:
     - Period 1, Period 2, Period 3, Period 4 (and Extra if applicable).
     - Each period clearly states Home Points, Home Fouls, Rival Points, Rival Fouls.
     - A match without extra time does not display empty extra time columns.

### Scenario 2: Roster Valuation Ranking & Player Detail Inspection (US2)
1. Scroll down to the Match Roster section.
2. **Verification**:
   - Every called-up player is listed as a tappable row/button.
   - Players are ordered descending by `Valuation` (`Value`).
   - Each button displays Jersey Number, Player Name, Minutes Played, Points, and Valuation.
3. Tap on a player card (e.g., player with highest valuation).
4. **Verification**:
   - A modal opens showing the player's detailed box score (1pt/2pt/3pt makes and misses, offensive/defensive rebounds, assists, steals, turnovers, fouls, valuation).
   - Tapping "Cerrar" closes the modal.

### Scenario 3: Advanced Statistics & Polygon Radar Chart (US3)
1. Scroll down to the Advanced Analytics section.
2. **Verification**:
   - The 8 efficiency badges display correct computed numbers:
     - Posesiones (total)
     - OER (Offensive Efficiency Rating)
     - DER (Defensive Efficiency Rating)
     - eFG% (Effective Field Goal Percentage)
     - ORB% (Offensive Rebound Percentage)
     - AST% (Assist Percentage)
     - TOV% (Turnover Percentage)
     - FTR (Free Throw Rate)
   - The polygon radar chart renders an 8-axis web with the calculated tactical polygon plotted clearly with axis labels.

### Scenario 4: Match Edit Mode & Real-Time Recalculation (US4)
1. In the header, tap the "Editar" button.
2. In the edit view/modal:
   - Increase Period 1 team points by 2 and team fouls by 1.
   - Increase a player's 2pt made shot (`t2a`) and 2pt attempt (`t2i`).
3. Tap "Guardar".
4. **Verification**:
   - Database updates and modal closes.
   - Total score increases immediately.
   - Period 1 breakdown displays updated points and fouls.
   - Player valuation and points update; roster re-sorts if rank changed.
   - Team advanced analytics recalculate immediately.
5. Tap "Editar" again, change values, but tap "Cancelar".
6. **Verification**:
   - Unsaved modifications are discarded and previous values remain unchanged.
