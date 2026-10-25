# Quickstart & Verification Guide: Direct Match Result & Stats Entry

**Feature**: Direct Match Result & Stats Entry (`017-set-completed-match`)  
**Date**: 2026-10-25  

---

## Prerequisites

- Node.js v18+ installed
- Working Expo React Native environment (`bcmApp`)
- Working SQLite database state (can be seeded with existing scripts)

---

## Automated Verification

Run Jest test suite covering the new feature and existing regression tests:

```bash
# 1. Run direct-result feature tests
npm test -- src/features/direct-result

# 2. Run GameCards and GameList component tests
npm test -- src/__tests__/components/GameCards.test.tsx
npm test -- src/__tests__/components/GameCardsRosterButton.test.tsx

# 3. Run complete test suite to ensure zero regressions
npm test
```

---

## Manual End-to-End Walkthrough

### Scenario 1: Verify 2-Column Action Grid & Button State on Match Cards

1. Start the Expo app:
   ```bash
   npx expo start -c
   ```
2. Navigate to **Partidos** (GameList view).
3. Observe match cards with `pending` status:
   - The action buttons on the right side of the card are structured in a **2-column grid** (2 buttons on top row, 2 buttons on bottom row).
   - Top row: **Roster** button (`Feather: users`) and **Set Result** button (`Feather: check-square`).
   - Bottom row: **Edit** button (`Feather: edit`) and **Delete** button (`Feather: trash`).
4. Observe match cards with `finished` or `inProgress` status:
   - The **Set Result** button is disabled (`opacity-30`) or hidden.

---

### Scenario 2: Enter Period Scores & Validate Calculations

1. Find a `pending` match (e.g. "Jornada 1 vs Rival A").
2. Tap the **Set Result** (`check-square`) action button.
3. The **Direct Result Modal** opens with two tabs: **Puntuación por Periodos** and **Estadísticas de Jugadores**.
4. In the **Period Scores** tab:
   - Enter Period 1: Team `18`, Opponent `15`.
   - Enter Period 2: Team `20`, Opponent `16`.
   - Enter Period 3: Team `15`, Opponent `18`.
   - Enter Period 4: Team `22`, Opponent `20`.
5. Verify:
   - Header or summary updates dynamically to show Total Team: `75`, Total Opponent: `69`.
6. Enable the **Prórroga / Overtime** toggle:
   - An extra period row appears for OT score and foul entry.
   - Enter Team `10`, Opponent `8`.
   - Total updates dynamically to `85` - `77`.

---

### Scenario 3: Enter Individual Player Statistics

1. Switch to the **Estadísticas de Jugadores** tab.
2. Select or view roster players (e.g. Player #7, Player #10, Player #23).
3. For Player #7:
   - Enter `22` minutes.
   - Enter 1pt: made `4`, attempted `5`.
   - Enter 2pt: made `5`, attempted `8`.
   - Enter 3pt: made `2`, attempted `4`.
   - Enter Rebounds: `3` offensive, `4` defensive.
   - Enter `5` assists, `2` steals, `1` turnover, `2` fouls.
4. Verify:
   - Player's points calculate dynamically: $4 \times 1 + 5 \times 2 + 2 \times 3 = 20$ pts.
   - Player's valuation calculates dynamically according to FIBA formula:
     $(4 + 5 + 2 + 3 + 4 + 5 + 2) - (1 + 2 + (5-4) + (8-5) + (4-2)) = 25 - 9 = 16$.
5. Check that editing Player #7 does not alter Player #10's values (strict isolation).

---

### Scenario 4: Direct Save & Match Transition to Finished

1. Tap the **Guardar y Finalizar** button.
2. Verify:
   - The modal closes.
   - The match card in the list immediately reflects the updated final score (`85 - 77`).
   - The status badge updates from "Pendiente" to "Finalizado".
   - The "Set Result" button is no longer active on this card.
3. Tap on the match card to open **MatchDetailView**:
   - Verify all period breakdown scores match what was entered.
   - Verify player box scores reflect the recorded player stats.
