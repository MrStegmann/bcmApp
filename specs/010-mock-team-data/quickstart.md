# Quickstart: Mocked Basketball Team, Roster & Match Dataset

**Feature Branch**: `010-mock-team-data`  
**Date**: 2026-10-23  

This guide provides runnable commands and validation scenarios to verify that the mock dataset, seeding engine, and integrity checks work end-to-end.

---

## Prerequisites

- Node.js 20+ installed
- Working directory: Repository root (`j:\GitHub\BasketApp\bcmApp`)
- Dependencies installed: `npm install` (if not already up to date)

---

## 1. Automated Unit & Integrity Tests

Execute the Jest test suite targeting the mock dataset and seeder:

```bash
npm test -- src/__tests__/db/mockData.test.ts src/__tests__/db/seed.test.ts
```

### Expected Outcome:
```text
PASS src/__tests__/db/mockData.test.ts
  Mock Dataset Integrity
    ✓ team metadata is populated with name and category
    ✓ roster contains at least 12 distinct players with unique numbers and valid positions
    ✓ schedule contains exactly 10 matches (5 finished, 5 pending)
    ✓ all finished matches have valid past dates (DD/MM/YYYY - HH:MM)
    ✓ all pending matches have valid future dates (DD/MM/YYYY - HH:MM)
    ✓ all finished matches have 100% mathematical reconciliation: sum(player points) == match score
    ✓ all player valuations strictly match calculatePlayerValuation()
    ✓ DNP players (0 minutes) have 0 across all statistical categories
    ✓ exactly 1 match contains a valid overtime breakdown (resultExtra > 0)

PASS src/__tests__/db/seed.test.ts
  Database Seed Script Tests
    ✓ should export seedDatabase and clearDatabase functions
    ✓ should run clearDatabase without errors
    ✓ should run seedDatabase and insert 1 team, 12+ players, 10 matches, and all playerStats
```

---

## 2. In-App Seeding & Database Verification

To verify seeding in a live execution context:

### Option A: Direct Script Execution (Node/CLI)
```bash
npx ts-node -e "import('./scripts/seed-db').then(m => m.seedDatabase()).then(console.log)"
```
*Expected console output:*
- Clearing database...
- Created team #1: "CB Salliver" (Junior Celeste)
- Inserted 12 players with positions and jersey numbers.
- Inserted 10 matches (5 finished, 5 pending).
- Inserted player stats for 5 finished matches (sum of player points == match scores).
- Seeding summary: 1 Team | 12 Players | 10 Matches | 60 PlayerStats.

### Option B: Expo App Launch
```bash
npm start
```
1. Open the application on an emulator or device.
2. Navigate to the **Teams / Roster** tab:
   - Verify "CB Salliver" is displayed.
   - Verify 12 players appear with jersey numbers (e.g., #4, #7, #10, #12...) and positions (PG, SG, SF, PF, C).
3. Navigate to the **Matches / Calendar** tab:
   - Verify 10 games are listed in chronological order.
   - 5 games display past dates with final scores (e.g., 78–65, 84–80 OT).
   - 5 games display pending status with scheduled future dates.
4. Tap any of the completed matches to open **Match Detail**:
   - Check the period breakdown (C1 to C4, plus Extra for the OT game).
   - Check the player box score: sum of all player points equals the displayed team score.
