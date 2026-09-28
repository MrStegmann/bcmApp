# Quickstart & End-to-End Validation Guide

This document provides step-by-step instructions to validate the **Database & Contracts Refactor** implementation end-to-end.

## Prerequisites

- Node.js (v18+)
- npm package manager
- Expo CLI (`npx expo`)
- Running Metro Bundler or Jest test suite

## Validation Steps

### 1. Run Unit Tests (TDD Verification)

Verify that all Drizzle schema models, Zustand stores, and database helper methods pass strict unit test assertions:

```bash
npm test
```

**Expected Outcome**:
- All Jest test suites pass 100%.
- Relational cascading deletes, schema types, and valuation calculations are verified.

---

### 2. Verify TypeScript Compilation & Type Contracts

Ensure zero implicit `any` errors, zero missing import errors, and full contract compliance:

```bash
npx tsc --noEmit
```

**Expected Outcome**:
- Clean compilation output with zero type errors.

---

### 3. Validate Mobile App Runtime & Database Connection

Launch the Expo development server to verify SQLite database connection initialization:

```bash
npm start
```

**Testing Checklist**:

1. **Club Management**:
   - Open app -> verify default Team creation/selection.
   - Add a new club -> verify team persists in local SQLite.

2. **Player Roster**:
   - Navigate to Roster tab (`TopMenuEnums.ROSTER`).
   - Add a new player with first name, last name, and jersey number -> verify player renders in `PlayerCards`.
   - Tap player detail -> verify zero `undefined` property crashes and accurate stats breakdown.

3. **Game Schedule & Box Score**:
   - Navigate to Games tab -> add a game against an opponent.
   - Open `GameDetail` -> enter player box score stats -> save.
   - Verify valuation (Val) and total points calculation update accurately without NaN errors.

4. **Training Sessions**:
   - Navigate to Training tab -> create practice session.
   - Toggle player attendance -> verify persistence in `training_players`.

5. **Fees & Calendar**:
   - Navigate to Calendar tab -> add team fee item.
   - Toggle payment status -> verify immediate UI update.

## References

- [Data Model & Relational Schema](./data-model.md)
- [Database Schema Contract](./contracts/database-schema.ts.md)
- [Store & Hook Contracts](./contracts/store-contracts.ts.md)
