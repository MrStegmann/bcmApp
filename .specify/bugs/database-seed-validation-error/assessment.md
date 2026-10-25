# Bug Assessment: Database Seed Validation Error During App Init

- **Slug**: database-seed-validation-error
- **Created**: 2026-10-25
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
Database initialization error: Error: Dataset validation failed prior to database seeding:
Match #1 (CB Granada) - player #11 (stat #1): Recorded valuation (9) does not match calculated valuation formula (10)
Match #1 (CB Granada) - player #7 (stat #3): Recorded valuation (6) does not match calculated valuation formula (5)
Match #1 (CB Granada) - player #8 (stat #4): Recorded valuation (7) does not match calculated valuation formula (6)
Match #1 (CB Granada) - player #9 (stat #5): Recorded valuation (7) does not match calculated valuation formula (8)
Match #1 (CB Granada) - player #10 (stat #6): Recorded valuation (3) does not match calculated valuation formula (2)
Match #1 (CB Granada) - player #12 (stat #7): Recorded valuation (2) does not match calculated valuation formula (3)
Match #1 (CB Granada) - player #14 (stat #9): Recorded valuation (0) does not match calculated valuation formula (1)
Match #1 (CB Granada): Match points reconciliation failed. Team score is 72, but sum of player points is 73
Match #2 (Real Betis Baloncesto) - player #11 (stat #1): Recorded valuation (2) does not match calculated valuation formula (3)
Match #2 (Real Betis Baloncesto) - player #9 (stat #5): Recorded valuation (6) does not match calculated valuation formula (5)
Match #2 (Real Betis Baloncesto) - player #10 (stat #6): Recorded valuation (2) does not match calculated valuation formula (1)
Match #2 (Real Betis Baloncesto) - player #14 (stat #9): Recorded valuation (5) does not match calculated valuation formula (4)
Match #2 (Real Betis Baloncesto) - player #6 (stat #11): Recorded valuation (1) does not match calculated valuation formula (0)
Match #2 (Real Betis Baloncesto): Match points reconciliation failed. Team score is 63, but sum of player points is 58
Match #3 (CD Baloncesto Sevilla) - player #15 (stat #2): Recorded valuation (6) does not match calculated valuation formula (7)
Match #3 (CD Baloncesto Sevilla) - player #7 (stat #3): Recorded valuation (7) does not match calculated valuation formula (6)
Match #3 (CD Baloncesto Sevilla) - player #8 (stat #4): Recorded valuation (6) does not match calculated valuation formula (5)
Match #3 (CD Baloncesto Sevilla) - player #10 (stat #6): Recorded valuation (2) does not match calculated valuation formula (1)
Match #3 (CD Baloncesto Sevilla) - player #12 (stat #7): Recorded valuation (3) does not match calculated valuation formula (2)
Match #3 (CD Baloncesto Sevilla) - player #13 (stat #8): Recorded valuation (0) does not match calculated valuation formula (-1)
Match #3 (CD Baloncesto Sevilla) - player #14 (stat #9): Recorded valuation (3) does not match calculated valuation formula (2)
Match #3 (CD Baloncesto Sevilla): Match points reconciliation failed. Team score is 79, but sum of player points is 74
Match #4 (CB Roquetas) - player #11 (stat #1): Recorded valuation (13) does not match calculated valuation formula (14)
Match #4 (CB Roquetas) - player #15 (stat #2): Recorded valuation (11) does not match calculated valuation formula (12)
Match #4 (CB Roquetas) - player #7 (stat #3): Recorded valuation (7) does not match calculated valuation formula (8)
Match #4 (CB Roquetas) - player #8 (stat #4): Recorded valuation (13) does not match calculated valuation formula (12)
Match #4 (CB Roquetas) - player #10 (stat #6): Recorded valuation (4) does not match calculated valuation formula (3)
Match #4 (CB Roquetas) - player #12 (stat #7): Recorded valuation (2) does not match calculated valuation formula (1)
Match #4 (CB Roquetas) - player #5 (stat #10): Recorded valuation (4) does not match calculated valuation formula (3)
Match #4 (CB Roquetas) - player #4 (stat #12): Recorded valuation (2) does not match calculated valuation formula (1)
Match #4 (CB Roquetas): Match points reconciliation failed. Team score is 84, but sum of player points is 80
Match #5 (CD Agustinos Granada) - player #11 (stat #1): Recorded valuation (6) does not match calculated valuation formula (7)
Match #5 (CD Agustinos Granada) - player #15 (stat #2): Recorded valuation (4) does not match calculated valuation formula (5)
Match #5 (CD Agustinos Granada) - player #8 (stat #4): Recorded valuation (8) does not match calculated valuation formula (7)
Match #5 (CD Agustinos Granada) - player #12 (stat #7): Recorded valuation (3) does not match calculated valuation formula (2)
Match #5 (CD Agustinos Granada) - player #14 (stat #9): Recorded valuation (4) does not match calculated valuation formula (3)
Match #5 (CD Agustinos Granada) - player #6 (stat #11): Recorded valuation (2) does not match calculated valuation formula (1)
Match #5 (CD Agustinos Granada): Match points reconciliation failed. Team score is 68, but sum of player points is 64

Source:
J:\GitHub\BasketApp\bcmApp\App.tsx (25:21)

Call Stack:
prepare (J:\GitHub\BasketApp\bcmApp\App.tsx:25)
```

## Symptom

When starting the application, `prepare()` in [App.tsx](file:///j:/GitHub/BasketApp/bcmApp/App.tsx#L25) calls `seedDatabase()`, which validates `MOCK_TEAM_DATA` using `validateDataset()`. The dataset validation fails with 28 player valuation mismatches and 5 match point reconciliation failures across all 5 finished matches, throwing an uncaught error that prevents database seeding and logs `Database initialization error` to console.

## Reproduction

1. Run `npm test src/__tests__/db/seed.test.ts` or launch the application via `npm start`.
2. Notice `prepare()` in `App.tsx` invokes `await seedDatabase()`.
3. `seedDatabase()` in `scripts/seed-db.ts` runs `validateDataset(dataset)`.
4. Observe that `validateDataset` fails with 33 validation errors across matches #1 to #5, throwing an Error: `Dataset validation failed prior to database seeding:...`.
5. Database seeding halts and the database remains unseeded or partially initialized.

## Suspected Code Paths

- [src/db/mock/mockTeamData.ts](file:///j:/GitHub/BasketApp/bcmApp/src/db/mock/mockTeamData.ts#L20-L225) — Defines `MOCK_TEAM_DATA`. The uncommitted changes introduce "Club Baloncesto Alborán" where player stats have incorrect valuation values and points that do not add up to the match quarter scores.
- [src/db/mock/mockDataValidator.ts](file:///j:/GitHub/BasketApp/bcmApp/src/db/mock/mockDataValidator.ts#L156-L174) — Enforces mathematical consistency: `stat.valuation === calculatePlayerValuation(stat)` and `sum(playerPoints) === teamScore`.
- [scripts/seed-db.ts](file:///j:/GitHub/BasketApp/bcmApp/scripts/seed-db.ts#L35-L40) — Pre-seed check throws an exception when `validateDataset` returns `isValid === false`.
- [App.tsx](file:///j:/GitHub/BasketApp/bcmApp/App.tsx#L19-L28) — `prepare()` invokes `seedDatabase()`, catches the error and prints the console error.
- [src/__tests__/db/mockData.test.ts](file:///j:/GitHub/BasketApp/bcmApp/src/__tests__/db/mockData.test.ts#L8-L10) — Tests asserting team metadata, point reconciliation, and valuation formula equality.

## Root Cause Hypothesis

`src/db/mock/mockTeamData.ts` was modified with a new team dataset ("Club Baloncesto Alborán") with manually created player stats that violate the relational and mathematical invariants enforced by `mockDataValidator.ts`:
1. **Point Reconciliation Discrepancies**: In all 5 finished games, the sum of player points (`1*t1a + 2*t2a + 3*t3a`) differs from the game total score (`resultC1 + resultC2 + resultC3 + resultC4 + resultExtra`):
   - Match #1 (CB Granada): Quarters total 72, but player points sum to 73 (+1 point discrepancy).
   - Match #2 (Real Betis): Quarters total 63, but player points sum to 58 (-5 point discrepancy).
   - Match #3 (CD Baloncesto Sevilla): Quarters total 79, but player points sum to 74 (-5 point discrepancy).
   - Match #4 (CB Roquetas): Quarters total 84, but player points sum to 80 (-4 point discrepancy).
   - Match #5 (CD Agustinos Granada): Quarters total 68, but player points sum to 64 (-4 point discrepancy).
2. **Valuation Discrepancies**: 28 player box score entries have recorded `valuation` numbers that do not match the standard valuation formula `calculatePlayerValuation()`: `(madeShots + oreb + dreb + asis + rec) - (per + falt + missedT1 + missedT2 + missedT3)`.
Because `seedDatabase()` runs `validateDataset()` as a hard pre-condition before seeding, these discrepancies trigger an immediate `Error`, aborting the database seed.

Confidence: High.

## Proposed Remediation

**Preferred**:
If "Club Baloncesto Alborán" is intended to be the active mock dataset:
1. Reconcile scoring in [src/db/mock/mockTeamData.ts](file:///j:/GitHub/BasketApp/bcmApp/src/db/mock/mockTeamData.ts) for all 5 finished matches so that individual player points (`1*t1a + 2*t2a + 3*t3a`) sum exactly to the match team score.
2. Recalculate and update the `valuation` attribute for all player records in [src/db/mock/mockTeamData.ts](file:///j:/GitHub/BasketApp/bcmApp/src/db/mock/mockTeamData.ts) using `calculatePlayerValuation()` to guarantee 100% mathematical accuracy.
3. Update [src/__tests__/db/mockData.test.ts](file:///j:/GitHub/BasketApp/bcmApp/src/__tests__/db/mockData.test.ts) expectations if the team metadata ("Club Baloncesto Alborán") is the new permanent mock dataset.

**Alternatives**:
- Revert [src/db/mock/mockTeamData.ts](file:///j:/GitHub/BasketApp/bcmApp/src/db/mock/mockTeamData.ts) to git `HEAD` ("CB Salliver"), which already satisfies all mathematical invariants and passes all unit tests, if the change to "Club Baloncesto Alborán" was an unverified manual edit or accidental experiment.

**Files likely to change**:
- `src/db/mock/mockTeamData.ts`
- `src/__tests__/db/mockData.test.ts` (if updating team metadata assertions)

**Tests to add or update**:
- Run `npm test src/__tests__/db/mockData.test.ts` to ensure 100% reconciliation and valuation formula conformity.
- Run `npm test src/__tests__/db/seed.test.ts` to ensure database seeding executes cleanly without validation exceptions.

## Risks & Considerations

- Modifying player shot attempts/makes to fix point reconciliation must respect shot feasibility constraints (`t1a <= t1i`, `t2a <= t2i`, `t3a <= t3i`).
- Any adjustments to player shot attempts/makes will alter `calculatePlayerValuation()`, so point adjustments must be finalized before computing final valuations.

## Open Questions

- Does the user want to keep and correct the new "Club Baloncesto Alborán" dataset, or revert `mockTeamData.ts` to the previously working "CB Salliver" dataset from `HEAD`?
