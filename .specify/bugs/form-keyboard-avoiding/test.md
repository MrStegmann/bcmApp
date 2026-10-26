# Bug Verification: El teclado se superpone al formulario en features de Match

- **Slug**: form-keyboard-avoiding
- **Tested**: 2026-10-26
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: partial

## Summary

The replacement of primitive `ScrollView` with `KeyboardAwareScrollView` and its standardized parameters (`enableOnAndroid={true}`, `extraScrollHeight`, `keyboardShouldPersistTaps="handled"`) in `MatchEditModal`, `PeriodScoresSection`, and `PlayerStatsSection` has been verified via targeted component tests and the full automated regression suite (95 suites, 561 tests passed). Following the guardrail rules, the result is marked **partial** because interactive virtual keyboard scrolling and physical viewport height recalculations on physical devices/emulators were not directly executed in this CLI environment.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Interactive virtual keyboard display & extra scroll offset on device | not-run | Requires interactive soft-keyboard appearance on physical device or Android/iOS emulator |
| New / updated tests | `npm test -- src/features/match-detail/__tests__/components/MatchEditModal.test.tsx src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx` | pass | 3 suites, 15 tests passed |
| Regression suite | `npm test` | pass | 95 suites, 561 tests passed (0 failed) |
| Lint / type-check | `npx tsc --noEmit` | fail | Pre-existing TS errors in `ClubManage.test.tsx` / `statsCalculator.test.ts`, plus `__dirname` typing in test files |

## Output Excerpts

### Targeted Tests (MatchEditModal, PeriodScoresSection, PlayerStatsSection)
```text
PASS src/features/match-detail/__tests__/components/MatchEditModal.test.tsx
PASS src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx
PASS src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        1.034 s
Ran all test suites matching /MatchEditModal|PeriodScoresSection|PlayerStatsSection/i.
```

### Full Regression Suite
```text
Test Suites: 95 passed, 95 total
Tests:       561 passed, 561 total
Snapshots:   0 total
Time:        3.585 s
Ran all test suites.
```

### Type-Check Output Excerpts
```text
src/__tests__/components/ClubManage.test.tsx(186,9): error TS2322: Type 'string | undefined' is not assignable to type 'string | null'.
src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx(105,20): error TS2304: Cannot find name '__dirname'.
src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx(143,20): error TS2304: Cannot find name '__dirname'.
src/features/home-view/__tests__/statsCalculator.test.ts(10,9): error TS2741: Property 'seconds' is missing in type ...
src/features/match-detail/__tests__/components/MatchEditModal.test.tsx(176,20): error TS2304: Cannot find name '__dirname'.
```

## Residual Risks

- **On-device native keyboard layout calculation**: `KeyboardAwareScrollView` dynamically adjusts viewport offsets when the OS raises the soft keyboard. While configuration properties (`enableOnAndroid`, `extraScrollHeight=100/120`, `keyboardShouldPersistTaps`) match the working implementations in `PlayerForm` and `GameForm`, visual verification on real devices (specifically small screens and Android hardware with gesture navigation) should confirm adequate spacing.
- **Test fixture TypeScript typings**: In `PeriodScoresSection.test.tsx`, `PlayerStatsSection.test.tsx`, and `MatchEditModal.test.tsx`, references to Node global `__dirname` trigger TS compiler complaints under strict React Native `tsconfig.json` without `@types/node`.

## Recommendation

Hold at **partial** verification until an on-device manual smoke test is conducted on iOS/Android to verify that inputs in lower screen sections (e.g. Q4/OT period scores, bottom player stats) glide above the keyboard when focused. Automated test coverage, component hierarchy enforcement, and full test suite regressions are completely verified.
