# Bug Verification: Render Error undefined is not a function in NextMatchCard (round.startsWith)

- **Slug**: home-view-round-render-error
- **Tested**: 2026-10-23T14:13:00+02:00
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The runtime crash `Render Error: undefined is not a function` triggered by calling `.startsWith` on numeric `round` values in `NextMatchCard` and `RecentMatchCard` is resolved. All unit and contract tests verifying safe formatting of numeric, string, null, and prefixed rounds pass successfully, and the full repository test suite (56 suites, 304 tests) passes with zero regressions.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | `npx jest src/features/home-view/__tests__/components/NextMatchCard.test.tsx -t "Round format resilience"` | pass | Verified numeric rounds (`round: 1`, `round: "2"`, `null`) do not throw `TypeError` |
| New / updated tests | `npx jest src/features/home-view/__tests__/matchDateHelper.test.ts src/features/home-view/__tests__/components/NextMatchCard.test.tsx src/features/home-view/__tests__/components/RecentMatchesColumn.test.tsx` | pass | 25 tests across all 3 test suites passed |
| Regression suite | `npm test` | pass | All 56 test suites across the repository (304 tests) passed cleanly |
| Lint / type-check | `npx tsc --noEmit` | partial | Home-view round logic type contracts verified; pre-existing ambient node typings (`scripts/seed-db.ts`) and global vector icon module overrides noted |

## Output Excerpts

### Reproduction and New Tests

```text
PASS src/features/home-view/__tests__/matchDateHelper.test.ts
  matchDateHelper Unit Tests (T003)
    formatRoundLabel
      √ should format numeric rounds with Jornada prefix (2 ms)
      √ should format string numbers with Jornada prefix
      √ should preserve already formatted strings starting with Jornada or lowercase jornada (1 ms)
      √ should handle null, undefined, or empty values safely without throwing errors

PASS src/features/home-view/__tests__/components/NextMatchCard.test.tsx
  NextMatchCard Component Contract Tests (T007 - US1)
    Round format resilience (Bug fix: home-view-round-render-error)
      √ should format round safely when round is a number (e.g. 1 -> Jornada 1)
      √ should format round safely when round is an unprefixed string number (e.g. '2' -> Jornada 2)
      √ should preserve already formatted round strings (e.g. 'Jornada 3' -> Jornada 3)
      √ should preserve lowercase formatted round strings without duplicating prefix (e.g. 'jornada 5')
      √ should return empty string when round is null or undefined without throwing TypeError (1 ms)

PASS src/features/home-view/__tests__/components/RecentMatchesColumn.test.tsx
  RecentMatchesColumn & RecentMatchCard Contract Tests (T011 - US2)
    RecentMatchCard round formatting resilience (Bug fix: home-view-round-render-error)
      √ should format round safely when round is numeric in finished match
      √ should format round safely when round is unprefixed string number
```

### Full Regression Suite Run

```text
Test Suites: 56 passed, 56 total
Tests:       304 passed, 304 total
Snapshots:   0 total
Time:        2.312 s, estimated 3 s
Ran all test suites.
```

## Residual Risks

- Pre-existing type declaration overrides in `src/types/global.d.ts` for `@expo/vector-icons` should ideally be expanded to declare `MaterialCommunityIcons` in ambient typings or use path imports (`@expo/vector-icons/MaterialCommunityIcons`) consistent with other features.

## Recommendation

Close the bug — verified end-to-end. The defensive helper `formatRoundLabel` and store sanitization prevent numeric rounds from causing runtime exceptions in `NextMatchCard` and `RecentMatchCard`.
