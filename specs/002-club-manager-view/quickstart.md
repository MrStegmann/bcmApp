# Quickstart Validation Guide: Refactor Club Manager View Page

**Feature**: Refactor Club Manager View Page (`specs/002-club-manager-view`)
**Date**: 2026-09-27

## Prerequisites

1. Node.js environment configured with React Native / Expo dependencies.
2. Local repository at root `j:\GitHub\BasketApp\bcmApp`.

## Validation Scenarios

### Scenario 1: TypeScript Compilation Verification
Validate that all refactored page views, stores, components, and contracts compile without type errors:

```bash
npx tsc --noEmit
```

*Expected Outcome*: Zero TypeScript errors reported (Exit code 0).

---

### Scenario 2: Jest Unit Test Suite Execution
Execute unit tests for `ClubStore` state transitions, `ClubManage` component rendering, and team CRUD actions:

```bash
npx jest
```

*Expected Outcome*: All test suites pass 100% (0 failures).

---

### Scenario 3: End-to-End Team Selection & Persistence Flow

1. **Launch App**: Open app on Expo runner or simulator (`npm run android` / `npx expo start`).
2. **View Club Manager**: Verify `ClubManage` displays the existing team list or empty state.
3. **Create Team**: Tap "Añadir Equipo", enter name "Basket BC Club" and category "Senior", tap submit.
4. **Select Team**: Tap "Basket BC Club" card to set active team in `ClubStore`.
5. **Verify Selection**: Confirm dashboard opens with active team context.
6. **Edit Team**: Return to `ClubManage`, tap edit icon on team card, update category to "Senior A", tap save.
7. **Delete Team**: Tap delete icon on team card, confirm in `DeleteModal`, verify team is removed from SQLite and store list.
