# Quickstart & Verification Guide: Update Player Contract, Form, and Details

## Overview

This guide provides runnable scenarios and test instructions to verify all functional requirements and success criteria for feature `013-update-player-details`.

---

## Prerequisites

- Node.js runtime (v18+)
- Working directory: `j:\GitHub\BasketApp\bcmApp`
- All dependencies installed (`npm install`)

---

## Automated Verification Scenarios

### Scenario 1: Player Contract & Schema Verification (TDD Unit Tests)

Verify that the `players` table and player models:
1. Contain `jerseyName` (`jersey_name`).
2. Do not contain `position` or `notes`.
3. Support insert, select, update, and delete with `jerseyName` populated or `null`.

**Run Command**:
```bash
npm test -- src/__tests__/store/PlayerStore.test.ts
```

**Expected Outcome**:
- All tests pass asserting `jerseyName` persists correctly and no compile or runtime errors occur regarding `position` or `notes`.

---

### Scenario 2: Player Form Rendering and Submissions (Component Tests)

Verify that `PlayerForm`:
1. Renders inputs for First Name, Last Name, Jersey Number, and optional Jersey Name.
2. Does NOT render any input or label for `position` or `notes`.
3. Validates required fields (First Name, Last Name, Number).
4. Submits successfully when `jerseyName` is empty string or omitted.
5. Submits successfully when `jerseyName` is provided (e.g. "M. JORDAN").
6. Populates existing `jerseyName` when editing an existing player.

**Run Command**:
```bash
npm test -- src/__tests__/components/PlayerForm.test.tsx
```

**Expected Outcome**:
- 100% of form test assertions pass with zero mentions of `position` or `notes`.

---

### Scenario 3: Played Matches List in Player Detail View (Component Tests)

Verify that `PlayerDetail`:
1. Renders the global player statistics card at the top.
2. Queries and renders the list of matches the player participated in directly below the statistics.
3. Renders the opponent/rival name and match round for each played match card.
4. Renders a clear fallback empty state message ("Este jugador aún no ha participado en ningún partido.") when the player has 0 played matches.

**Run Command**:
```bash
npm test -- src/__tests__/components/PlayerDetail.test.tsx
```

**Expected Outcome**:
- Both non-empty and empty match history scenarios pass cleanly.

---

### Scenario 4: Direct Navigation to Match Detail & Return Flow (Integration Tests)

Verify that:
1. Each item in the played matches list includes an interactive button or element to open match details.
2. Pressing the button navigates directly to `MatchDetailView` for that specific match.
3. Pressing the return/back button in `MatchDetailView` restores the `PlayerDetail` view without loss of player context.

**Run Command**:
```bash
npm test -- src/__tests__/page/PlayerList.integration.test.tsx
```

**Expected Outcome**:
- Navigation drilldown and return flows complete smoothly without state corruption.

---

### Scenario 5: Full Regression Suite Run

Verify that no existing tests were broken by the schema or type updates.

**Run Command**:
```bash
npm test -- --watchAll=false
```

**Expected Outcome**:
- 100% of test suites pass (including database seed tests, game tests, and page integration tests).
