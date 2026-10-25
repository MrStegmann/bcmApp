# Bug Fix: Database Seed Validation Error During App Init

- **Slug**: database-seed-validation-error
- **Fixed**: 2026-10-25
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Reconciled player shot attempts and makes across all 5 finished games in `mockTeamData.ts` so that player points sum exactly to match quarter scores, recalculated all 60 box score `valuation` values to strictly match the valuation formula, and updated test expectations for "Club Baloncesto Alborán" and "Cadete Oro".

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/db/mock/mockTeamData.ts` | modified | Reconciled points to quarter totals (Match 1: 72, Match 2: 63, Match 3: 79, Match 4: 84, Match 5: 68) and updated valuation values using `calculatePlayerValuation()` across all 5 finished games. |
| `src/__tests__/db/mockData.test.ts` | modified | Updated team metadata expectations to assert team name "Club Baloncesto Alborán" and category "Cadete Oro". |
| `src/__tests__/db/seed.test.ts` | modified | Updated integration test expectations for seeded team name ("Club Baloncesto Alborán") and category ("Cadete Oro"). |

## Diff Highlights

```typescript
// src/db/mock/mockTeamData.ts (example: Game 1 valuation & points reconciliation)
- { playerNumber: "11", minutes: 25, t1a: 2, t1i: 3, t2a: 5, t2i: 8, t3a: 1, t3i: 2, ..., valuation: 9 },
+ { playerNumber: "11", minutes: 25, t1a: 2, t1i: 3, t2a: 5, t2i: 8, t3a: 1, t3i: 2, ..., valuation: 10 },
- { playerNumber: "14", minutes: 15, t1a: 1, t1i: 2, t2a: 1, t2i: 2, t3a: 0, t3i: 0, ..., valuation: 0 },
+ { playerNumber: "14", minutes: 15, t1a: 0, t1i: 2, t2a: 1, t2i: 2, t3a: 0, t3i: 0, ..., valuation: -1 },
```

```typescript
// src/__tests__/db/mockData.test.ts
- expect(MOCK_TEAM_DATA.name).toBe("CB Salliver");
- expect(MOCK_TEAM_DATA.category).toBe("Junior Celeste");
+ expect(MOCK_TEAM_DATA.name).toBe("Club Baloncesto Alborán");
+ expect(MOCK_TEAM_DATA.category).toBe("Cadete Oro");
```

## Tests Added or Updated

- `src/__tests__/db/mockData.test.ts` — Verifies roster validity, unique player numbers, schedule structure, point reconciliation to game totals, and exact valuation formula calculation for "Club Baloncesto Alborán".
- `src/__tests__/db/seed.test.ts` — Verifies clean execution of `seedDatabase()`, `clearDatabase()`, table insertions, and point reconciliation from the SQLite database.

## Local Verification

- Commands run:
  - `npx jest src/__tests__/db/mockData.test.ts` → PASS (14/14 tests passing)
  - `npx jest src/__tests__/db/seed.test.ts` → PASS (10/10 tests passing)
  - `npx jest src/__tests__/db/` → PASS (5 test suites, 42 tests passing)
- Manual checks: Verified that `validateDataset()` runs without throwing errors, seeded data contains 1 team, 12 players, 10 matches (5 finished, 5 pending), and 60 player stats.

## Deviations from Assessment

None. The preferred remediation was chosen and applied as specified in the assessment.

## Follow-ups

- None required. Pre-seed validation and database seeding are functioning as expected without runtime errors.
