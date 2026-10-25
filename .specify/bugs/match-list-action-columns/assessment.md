# Bug Assessment: Match List Action Buttons Render in Single Column

- **Slug**: match-list-action-columns
- **Created**: 2026-10-25
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

The match in the match list view render the buttons in one column instead in 2 columns.

## Symptom

In the match list view (`GameList` / `GameCards`), each match card is designed to display up to 4 action buttons (Roster, Set Result, Edit, Delete) arranged in a 2x2 grid (2 columns across 2 rows). In the rendered view, all buttons wrap onto separate lines, rendering in a single vertical column of 4 buttons instead of 2 columns.

## Reproduction

1. Open the application and navigate to the Matches / Game List screen (`GameList.tsx`).
2. Observe any match card in the list (e.g., a pending or finished match).
3. Inspect the action buttons on the right side of the match card (Roster callup, Set Result, Edit match, Delete match).
4. Observe that the buttons are stacked vertically in a single column of 4 items rather than a 2-column, 2-row grid.

## Suspected Code Paths

- `src/components/GameCards.tsx:16-17` — `ACTION_GRID_CONTAINER_CLASS` defines `flex flex-row flex-wrap w-[92px] justify-end items-center gap-1.5 pl-2 border-l border-slate-border`.
- `src/components/GameCards.tsx:167-211` — The 4 `TouchableOpacity` action buttons each have `className="p-2 min-w-[42px] min-h-[42px] ..."` rendered directly as siblings inside the flex-wrap container.
- `src/__tests__/components/GameCards.test.tsx:108-110, 136-141` — Unit test explicitly asserts `expect(ACTION_GRID_CONTAINER_CLASS).toContain("w-[92px]")`.
- `specs/017-set-completed-match/contracts/game-cards.contract.ts:51` — Contract specifies `w-[92px]` based on initial calculations that omitted inner padding and border.

## Root Cause Hypothesis

In React Native's layout engine (Yoga), box sizing is border-box. The action container has a total fixed width of 92px (`w-[92px]`), with left padding of 8px (`pl-2`) and a left border of 1px (`border-l`), leaving only 83px (92 - 8 - 1 = 83px) of usable inner content width. Each button has a minimum width of 42px (`min-w-[42px]`), so two buttons alone require 84px (42 + 42 = 84px), plus the 6px flex gap (`gap-1.5`), requiring a total of 90px of horizontal space. Because 90px exceeds the 83px available inner width, the flex-wrap container cannot place two buttons on the same row, forcing every button to wrap into its own row, collapsing the 2x2 grid into a single column. (Confidence: high)

## Proposed Remediation

**Preferred**:
1. Increase the container width in `ACTION_GRID_CONTAINER_CLASS` to accommodate the two 42px buttons plus gap and padding. A container width of `w-[100px]` (or `w-[98px]` if gap is 6px and padding is 8px: 42 + 6 + 42 + 8 = 98px) provides sufficient inner width (98 - 8 - 1 = 89px, or 100 - 8 - 1 = 91px) for two 42px buttons side-by-side with 6px gap (`gap-1.5`).
2. Alternatively or in combination, wrap the buttons into two explicit rows (`flex-col gap-1.5` containing two `flex-row gap-1.5` sub-views) or ensure the layout is structurally resilient across screen densities and font scalings without depending strictly on pixel-tight flex-wrapping.
3. Update `src/__tests__/components/GameCards.test.tsx` and `specs/017-set-completed-match/contracts/game-cards.contract.ts` to match the updated container class width.

**Alternatives**:
- *Explicit row grouping*: Change the container from `flex flex-row flex-wrap` to `flex flex-col gap-1.5 pl-2 border-l border-slate-border justify-center` and group Row 1 (Roster + Set Result) and Row 2 (Edit + Delete) each in a `<View className="flex flex-row gap-1.5 justify-end">`. This eliminates reliance on width-based flex-wrap wrapping altogether.
- *Adjust padding/dimensions*: Reduce button `min-w-[42px]` or container padding `pl-2` so that 2 buttons fit within `w-[92px]`. However, 42px is chosen for touch target accessibility guidelines, so preserving button size and adjusting container width or structure is preferable.

**Files likely to change**:
- `src/components/GameCards.tsx`
- `src/__tests__/components/GameCards.test.tsx`
- `specs/017-set-completed-match/contracts/game-cards.contract.ts` (if synchronizing spec contract)

**Tests to add or update**:
- Update `src/__tests__/components/GameCards.test.tsx` test case `should define 2-column action grid container classes according to contract` to check the updated container class.
- Add a test or render verification ensuring two rows of buttons are present or container accommodates 2-column width.

## Risks & Considerations

- Card layout overflow: Match cards use a horizontal row layout with `View className="flex-1 ... pr-2"` on the left and the action container on the right. Increasing action container width by 6–8px slightly reduces the left summary width; verify on narrow mobile viewports (e.g., 320px–360px wide devices) to confirm team names and scores don't truncate awkwardly.

## Open Questions

- None. The issue is fully reproduced and mathematically verified through React Native's border-box flex layout model.
