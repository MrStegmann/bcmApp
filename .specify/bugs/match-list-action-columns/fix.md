# Bug Fix: Match List Action Buttons Render in Single Column

- **Slug**: match-list-action-columns
- **Fixed**: 2026-10-25
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Increased action button grid container width from `w-[92px]` to `w-[100px]` in `GameCards.tsx`, providing 91px of inner width (after 8px left padding and 1px left border) which comfortably accommodates two 42px touch buttons side-by-side with a 6px gap (`gap-1.5`, total 90px) to form the intended 2x2 action button grid.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/components/GameCards.tsx` | modified | Updated `ACTION_GRID_CONTAINER_CLASS` width from `w-[92px]` to `w-[100px]` |
| `src/__tests__/components/GameCards.test.tsx` | modified | Updated expected container width class to `w-[100px]` and added layout arithmetic test |
| `specs/017-set-completed-match/contracts/game-cards.contract.ts` | modified | Updated container width specification comment to `w-[100px]` |

## Diff Highlights (optional)

```diff
-export const ACTION_GRID_CONTAINER_CLASS =
-  "flex flex-row flex-wrap w-[92px] justify-end items-center gap-1.5 pl-2 border-l border-slate-border";
+export const ACTION_GRID_CONTAINER_CLASS =
+  "flex flex-row flex-wrap w-[100px] justify-end items-center gap-1.5 pl-2 border-l border-slate-border";
```

## Tests Added or Updated

- `src/__tests__/components/GameCards.test.tsx::GameCards 2-Column Action Grid & Set Result Button Tests (T005 - US1): should define 2-column action grid container classes according to contract` — Verified container class contains `w-[100px]`.
- `src/__tests__/components/GameCards.test.tsx::GameCards 2-Column Action Grid & Set Result Button Tests (T005 - US1): should provide sufficient inner width for 2-column buttons side-by-side` — Validates that available inner container width (100 - 8 - 1 = 91px) is greater than or equal to required row width for two buttons (42 * 2 + 6 = 90px).

## Local Verification

- Commands run:
  - `npm test src/__tests__/components/GameCards.test.tsx` → 9/9 tests passed
  - `npm test -- --testPathPattern=Game` → 8 suites, 51/51 tests passed
  - `npm test` → 95 suites, 551/551 tests passed
- Manual checks:
  - Calculated inner box layout dimensions in border-box model: 100px total width - 8px left padding - 1px left border = 91px inner content area. Two buttons (42px each) + 6px gap = 90px <= 91px.

## Deviations from Assessment

None. Applied the preferred remediation directly as specified.

## Follow-ups

- Validate rendering on physical device / emulator using `/speckit-bug-test slug=match-list-action-columns`.
