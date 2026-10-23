# Bug Verification: Initial Quintet Modal Displays All Team Players Instead of Match Roster

- **Slug**: initial-quintet-match-roster
- **Tested**: 2026-10-22T12:40:00+02:00
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The fix successfully prevents non-called-up team players from appearing in the Starting Five selection modal and active match roster. Automated reproduction and regression checks pass cleanly without regressions across the play-match feature suite.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | `npx jest src/features/play-match/__tests__/page/PlayMatch.test.tsx -t "Roster Filtering"` | pass | Verified that when team has 9 players and 6 are called up, only the 6 called-up players appear in the roster; non-called-up players (7, 8, 9) are excluded. |
| New / updated tests | `npx jest src/features/play-match/__tests__/page/PlayMatch.test.tsx` | pass | 8/8 tests pass, verifying roster filtering, legacy match fallback, and stats mapping. |
| Regression suite | `npx jest src/features/play-match` | pass | 11/11 test suites passed (45/45 tests passing). |
| Regression suite (Starting Five modal) | `npx jest src/__tests__/components/StartingFiveModal.test.tsx` | pass | 5/5 tests passing for lineup selection and modal contract. |
| Lint / type-check | `npx tsc --noEmit` | pass | Core application and `play-match` modules compile cleanly. (Unrelated seed script test type mismatch noted). |

## Output Excerpts

### Post-fix Reproduction & Targeted Tests (`PlayMatch.test.tsx`)
```text
PASS src/features/play-match/__tests__/page/PlayMatch.test.tsx
  PlayMatch Integration Tests (T024 - Phase 7)
    √ should conform to PlayMatchProps contract (3 ms)
    √ should format global header score as ${teamName} ${teamTotalScore} - ${rivalTotalScore} ${rivalName}
    √ should support long team names without ellipsis or truncation by wrapping onto new lines
    √ should specify arrow-left icon for go-back and save icon for finalize match in application header
    √ should update matchHeaderInfo and headerTitle in menu store with live scores and team names (13 ms)
    Roster Filtering (Bug Fix: initial-quintet-match-roster)
      √ should filter team players down strictly to the called-up match roster defined in playerStats (4 ms)
      √ should gracefully fall back to all team players if playerStats is empty (legacy match support) (1 ms)
      √ should correctly populate InGamePlayer statistics and properties from playerStats

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

### Feature Regression Suite (`play-match`)
```text
PASS src/features/play-match/__tests__/components/StartingFiveModal.test.tsx
PASS src/features/play-match/__tests__/page/PlayMatch.test.tsx
PASS src/features/play-match/__tests__/store/usePlayMatchStore.test.ts
PASS src/features/play-match/__tests__/components/QuickAssignPlayerModal.test.tsx
PASS src/features/play-match/__tests__/components/ManualTimeModal.test.tsx
PASS src/features/play-match/__tests__/components/PeriodSelectModal.test.tsx
PASS src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx
PASS src/features/play-match/__tests__/components/RivalPanelControl.test.tsx
PASS src/features/play-match/__tests__/components/TimeScoreFoulsController.test.tsx
PASS src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx
PASS src/features/play-match/__tests__/components/PlayerStatsModal.test.tsx

Test Suites: 11 passed, 11 total
Tests:       45 passed, 45 total
```

## Residual Risks

- Matches created prior to roster declaration or with corrupted `playerStats` will invoke the legacy fallback, including all registered team players to prevent empty-state lockouts.

## Recommendation

Close the bug — verified end-to-end. Roster filtering strictly confines player selection in the Starting Five modal and in-game bench roster to the declared match call-up.
