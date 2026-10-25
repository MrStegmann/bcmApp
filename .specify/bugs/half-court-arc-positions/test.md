# Bug Verification: Half-Court 3-Point Arc Alignment and Radial Position Calibration

- **Slug**: half-court-arc-positions
- **Tested**: 2026-10-25
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The fix successfully repositions all 5 court player slots along the outer perimeter of the 3-point arc with exact radial placement, bilateral symmetry, and identical adjacent Euclidean spacing ($D = \sqrt{9760} \approx 98.79\text{dp}$). The original symptom of slots straddling the 3-point line and invading the paint/key area no longer reproduces, and all targeted and full workspace regression tests pass.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Mathematical verification & layout coordinates (`COURT_ARC_POSITIONS`) | pass | Center ($y=224 > 196$), Wings ($R \approx 138.85 > 112$), Corners ($|x| = 128 > 112$) all sit strictly outside 3-point boundary; adjacent intervals equal $\sqrt{9760} \approx 98.79\text{dp}$ |
| New / updated tests | `npm test -- src/features/play-match/__tests__/utils/courtArcPositions.test.ts src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx` | pass | 2 suites passed, 15 tests passed in 0.433s |
| Regression suite (feature) | `npm test -- src/features/play-match` | pass | 15 suites passed, 82 tests passed in 1.26s |
| Regression suite (full) | `npm test` | pass | 69 suites passed, 431 tests passed in 2.79s |
| Lint / type-check | `npx tsc --noEmit` | pass | 0 TypeScript errors in `src/features/play-match` |

## Output Excerpts

### Targeted Tests (`courtArcPositions.test.ts` & `HalfCourtCanvas.test.tsx`)
```text
PASS src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx
PASS src/features/play-match/__tests__/utils/courtArcPositions.test.ts

Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        0.433 s, estimated 1 s
Ran all test suites matching /src\features\play-match\__tests__\utils\courtArcPositions.test.ts|src\features\play-match\__tests__\components\HalfCourtCanvas.test.tsx/i.
```

### Full Workspace Regression Suite
```text
PASS src/features/home-view/__tests__/HomeView.test.tsx
PASS src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx
PASS src/features/play-match/__tests__/components/PeriodSelectModal.test.tsx
PASS src/features/play-match/__tests__/components/RivalPanelControl.test.tsx

Test Suites: 69 passed, 69 total
Tests:       431 passed, 431 total
Snapshots:   0 total
Time:        2.794 s, estimated 3 s
Ran all test suites.
```

## Residual Risks

- **Extremely Narrow Devices (<320dp width)**: With slot centers at $x = \pm 128\text{dp}$ and badge radius 35dp (outer edge $\pm 163\text{dp}$), devices narrower than 326dp may have minimal horizontal padding. Standard iOS/Android devices (360dp–428dp) display with comfortable side margins (>17dp).

## Recommendation

Close the bug — verified end-to-end.
