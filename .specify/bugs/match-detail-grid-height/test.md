# Bug Verification: Player Grid Button Height Expansion in Match Detail

- **Slug**: match-detail-grid-height
- **Tested**: 2026-10-23
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: partial

## Summary

The unbounded `h-full` class was removed from `RosterValuationList.tsx`, preventing Yoga layout height inflation in flex-wrap containers inside the scroll view, and all 49 test suites (265 tests) passed. The verification result is graded as partial pending manual device verification because interactive visual inspection on an emulator or physical device was not directly exercised.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Manual UI scroll & card height verification in running Expo app | not-run | Interactive device/emulator inspection not directly automated; code inspection confirmed `h-full` removal |
| New / updated tests | `npm test -- src/features/match-detail/__tests__/components/RosterValuationList.test.tsx` | pass | 5/5 tests passed, validating prevention of `h-full` in grid items |
| Regression suite | `npm test` | pass | 49 test suites passed, 265 tests passed across the entire codebase |
| Lint / type-check | `npx tsc --noEmit` | fail | Fails on ambient Node types in `scripts/seed-db.ts` and test helper |

## Output Excerpts

### Component Contract & Regression Unit Tests
```text
PASS src/features/match-detail/__tests__/components/RosterValuationList.test.tsx
  RosterValuationList Component Contract (T019 - US2)
    √ should trigger onSelectPlayer when player button is tapped (4 ms)
    √ should verify roster ordering respects valuation descending
    √ should handle empty player list without exceptions (1 ms)
    √ should isolate MVP at index 0 and provide remaining players for the 2-column grid (1 ms)
    √ should verify 2-column grid item buttons do not contain h-full to prevent vertical expansion bug (3 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

### Full Suite Regression
```text
Test Suites: 49 passed, 49 total
Tests:       265 passed, 265 total
Snapshots:   0 total
Time:        2.84 s, estimated 3 s
Ran all test suites.
```

### Type-Check Excerpt
```text
scripts/seed-db.ts(179,13): error TS2339: Property 'main' does not exist on type 'NodeRequire'.
src/features/match-detail/__tests__/components/RosterValuationList.test.tsx(122,20): error TS2304: Cannot find name '__dirname'.
```

## Residual Risks

- Visual height parity between adjacent grid cards on devices with extreme accessibility font scaling (currently mitigated by single-line truncations).
- Physical device visual inspection should be performed by the user in the running Expo development client to confirm final aesthetic spacing.

## Recommendation

Hold at partial status until manual confirmation on device/emulator. Code changes and test assertions are robust, non-regressive, and directly address the Yoga layout root cause.
