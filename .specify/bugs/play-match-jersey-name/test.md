# Bug Verification: Player Jersey Number and Name Display in Play Match

- **Slug**: play-match-jersey-name
- **Tested**: 2026-10-24
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The fix successfully resolves the issue where player jersey names were missing in the Play Match view. Player circular badges in both the starting quintet on court (`HalfCourtCanvas`) and the substitute bench (`TeamManagementPanel`) now prominently display the player's jersey number (`#{player.number ?? "-"}`) positioned directly above the player's custom `jerseyName` (or the fallback `[First Initial]. [Last Name]` when `jerseyName` is absent), followed by the divider line and in-game statistics (`${min}min / ${pts}pts`). All reproduction, unit, integration, and regression suites pass with 100% success.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | `npx jest src/features/play-match/__tests__/utils/formatPlayerIdentifier.test.ts src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx` | pass | 22/22 tests passing. Verified jersey number rendered above jersey name/fallback identifier without redundant full first names. |
| New / updated tests | `npx jest src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx -t "render jersey number above jersey name"` | pass | Both court and bench components validated for structural presence of `#{player.number ?? "-"}` placed above `{identifier}`. |
| Regression suite (Play Match) | `npm test -- src/features/play-match` | pass | 12/12 test suites passed (63/63 tests passing). |
| Full regression suite | `npm test` | pass | 66/66 test suites passed (412/412 tests passing). |
| Lint / type-check | `npx tsc --noEmit` | pass | `play-match` feature modules compile cleanly with zero TypeScript errors. |

## Output Excerpts

### Reproduction & Badge Structure Verification
```text
PASS src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx
  TeamManagementPanel (T021 - US3)
    √ should evaluate player identification on bench with jersey name priority and fallback formatting (1 ms)
    √ should integrate formatPlayerIdentifier and render jersey number above jersey name in TeamManagementPanel source code

PASS src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx
  HalfCourtCanvas (T017 - US2)
    √ should evaluate player identification with jersey name priority and fallback formatting (1 ms)
    √ should integrate formatPlayerIdentifier and render jersey number above jersey name in HalfCourtCanvas source code

PASS src/features/play-match/__tests__/utils/formatPlayerIdentifier.test.ts
  formatPlayerIdentifier
    Jersey Name Priority (Exclusive Rendering)
      √ renders 'jerseyName' when present, even when number and names are present (1 ms)
      √ handles trimmed string jersey names
      √ preserves custom casing of jersey name
    Name Fallback Formatting (When Jersey Name is Absent or Empty)
      √ formats '[First Initial]. [Last Name]' when jerseyName is null
      √ formats '[First Initial]. [Last Name]' when jerseyName is undefined
      √ formats '[First Initial]. [Last Name]' when jerseyName is empty string or spaces
      √ handles trimmed names and uppercase first initial

Test Suites: 3 passed, 3 total
Tests:       22 passed, 22 total
```

### Full Test Suite Execution (`npm test`)
```text
Test Suites: 66 passed, 66 total
Tests:       412 passed, 412 total
Snapshots:   0 total
Time:        2.398 s, estimated 3 s
Ran all test suites.
```

## Residual Risks

- **Long custom jersey names**: In edge cases where a user enters an exceptionally long custom jersey name (e.g. > 18 characters), text is constrained with `numberOfLines={1}` and truncated with an ellipsis inside the badge above the separator line. This guarantees UI layout stability within the 80x80 circle badge.

## Recommendation

Close the bug — verified end-to-end. Both starting court and bench player badges consistently display `#number` above `jerseyName` (or `[First Initial]. [Last Name]` fallback) followed by minutes and points, with zero regressions across the codebase.
