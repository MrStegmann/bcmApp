# Quickstart & Verification Guide: Remove Training Session

**Feature Branch**: `008-remove-training-session`  
**Date**: 2026-10-22  
**Status**: Ready for Validation  

---

## Prerequisites

- Node.js v18+ and npm installed
- Working directory: repository root (`J:\GitHub\BasketApp\bcmApp`)

---

## Scenario 1: Strict TypeScript Type Check

Ensure no broken imports, missing types, or dangling references remain.

```bash
npx tsc --noEmit
```

**Expected Outcome**: Exits with code `0` and 0 errors.

---

## Scenario 2: Zero Orphan File & Symbol Check

Verify that all training UI components, stores, and test files have been deleted from `src/`.

```powershell
# Verify deleted files do not exist
Test-Path src/page/TrainingList.tsx
Test-Path src/components/TraningCards.tsx
Test-Path src/components/TrainingDetail.tsx
Test-Path src/components/TrainingForm.tsx
Test-Path src/components/TrainingPlayer.tsx
Test-Path src/store/TrainingStore.ts
Test-Path src/test/trainings.js
```

**Expected Outcome**: All commands return `False`.

Search for any remaining training references in application source code:
```powershell
git grep -i "training" -- src/
```

**Expected Outcome**: Zero matches in `src/`.

---

## Scenario 3: Database Sanitization & Table Deletion

Run the database schema unit test suite to verify table dropping and schema integrity:

```bash
npx jest src/__tests__/db/connection.test.ts src/__tests__/db/cascade.test.ts
```

**Expected Outcome**:
- `connection.test.ts` passes: `trainings` and `trainingPlayers` schemas are absent or undefined; `teams`, `players`, `games`, `playerStats` are defined.
- `cascade.test.ts` passes: Cascade delete tests execute without reference to training tables.

---

## Scenario 4: Clean Database Seeding Verification

Run the database seed test:

```bash
npx jest src/__tests__/db/seed.test.ts
```

**Expected Outcome**:
- Seeding completes successfully.
- Summary returns: 3 Teams, 36 Players, 21 Games, and zero trainings inserted.
- Test exits with 100% pass rate.

---

## Scenario 5: Full Test Suite Execution

Run all Jest test suites across the repository:

```bash
npm test
```

**Expected Outcome**: 100% of test suites pass, 0 failures, 0 snapshots outdated.

---

## Scenario 6: Manual UI Verification (Expo Runtime)

1. Launch application:
   ```bash
   npm start
   ```
2. Navigate to any team (e.g., "Furola Basket Club"):
   - Inspect the bottom navigation bar: Exactly 4 tabs appear (`Inicio`, `Plantilla`, `Partidos`, `Volver`).
   - Verify no tab for `Entrenamientos` is displayed.
3. Tap `Plantilla` and select an individual player (e.g., "Patrick Stegmann"):
   - Inspect the overview metrics bar: Only `P. J` (Partidos Jugados) is displayed.
   - Verify that `E. A` (Entrenamientos Asistidos) and `E. F` (Entrenamientos Fallados) badges are absent.
4. Verify creating, editing, and deleting a player and team functions smoothly without database errors.
