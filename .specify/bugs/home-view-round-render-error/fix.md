# Bug Fix: Render Error undefined is not a function in NextMatchCard (round.startsWith)

- **Slug**: home-view-round-render-error
- **Fixed**: 2026-10-23
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Resolved the runtime exception caused by calling `.startsWith` directly on numeric `round` values in `NextMatchCard` and `RecentMatchCard`. Extracted a defensive `formatRoundLabel` helper, sanitized `round` in `useHomeViewStore`, and updated contract types to accept `string | number`.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/home-view/utils/matchDateHelper.ts` | modified | Added `formatRoundLabel` utility with safe string coercion and case-insensitive prefix handling |
| `src/features/home-view/components/NextMatchCard.tsx` | modified | Replaced direct `.startsWith` call with `formatRoundLabel` |
| `src/features/home-view/components/RecentMatchCard.tsx` | modified | Replaced direct `.startsWith` call with `formatRoundLabel` |
| `src/features/home-view/store/useHomeViewStore.ts` | modified | Sanitized `earliest.round` and `game.round` with `String()` fallback to prevent numeric leaking |
| `src/features/home-view/types/index.ts` | modified | Updated `round` field type in `NextMatchEntry` and `RecentMatchSummary` to `string \| number` |
| `src/features/home-view/__tests__/matchDateHelper.test.ts` | modified | Added unit tests verifying `formatRoundLabel` with numbers, strings, prefixes, and empty values |
| `src/features/home-view/__tests__/components/NextMatchCard.test.tsx` | modified | Added test suite validating round formatting resilience across numeric and string representations |
| `src/features/home-view/__tests__/components/RecentMatchesColumn.test.tsx` | modified | Added test suite validating `RecentMatchCard` round formatting resilience |

## Diff Highlights (optional)

```typescript
// src/features/home-view/utils/matchDateHelper.ts
export function formatRoundLabel(round?: string | number | null): string {
  if (round == null) {
    return "";
  }
  const str = String(round).trim();
  if (!str) {
    return "";
  }
  return str.toLowerCase().startsWith("jornada") ? str : `Jornada ${str}`;
}
```

```tsx
// src/features/home-view/components/NextMatchCard.tsx
- {nextMatch.round ? (
-   <Text className="text-gray-300 text-xs font-semibold">
-     {nextMatch.round.startsWith("Jornada") ? nextMatch.round : `Jornada ${nextMatch.round}`}
-   </Text>
- ) : null}
+ const roundLabel = formatRoundLabel(nextMatch.round);
+ ...
+ {roundLabel ? (
+   <Text className="text-gray-300 text-xs font-semibold">
+     {roundLabel}
+   </Text>
+ ) : null}
```

## Tests Added or Updated

- `src/features/home-view/__tests__/matchDateHelper.test.ts::formatRoundLabel` — Pins down conversion of numeric rounds (`1` -> `"Jornada 1"`, `0` -> `"Jornada 0"`), raw numbers in strings (`"3"` -> `"Jornada 3"`), preservation of case-insensitive existing prefixes (`"Jornada 5"`, `"jornada 5"`), and null/undefined resilience.
- `src/features/home-view/__tests__/components/NextMatchCard.test.tsx::Round format resilience` — Pins down contract formatting for `NextMatchEntry` with numeric, string number, and prefixed `round`.
- `src/features/home-view/__tests__/components/RecentMatchesColumn.test.tsx::RecentMatchCard round formatting resilience` — Pins down contract formatting for `RecentMatchSummary` with numeric and string `round`.

## Local Verification

- Commands run:
  - `npm test -- src/features/home-view` → All 7 test suites, 39 tests passed.
  - `npm test` → All 56 test suites across the repository, 304 tests passed.
- Manual checks: Verified that the Expo dev server (`npm start`) remains healthy and free of syntax/type errors.

## Deviations from Assessment

None. Adopted the shared utility function approach (`formatRoundLabel`) in `matchDateHelper.ts` (as identified in Proposed Remediation Alternatives) to avoid duplicate logic across `NextMatchCard` and `RecentMatchCard`, while also sanitizing in `useHomeViewStore` and widening the contract types in `types/index.ts`.

## Follow-ups

- None required.
