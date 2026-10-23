# Bug Assessment: Player Grid Button Height Expansion in Match Detail

- **Slug**: match-detail-grid-height
- **Created**: 2026-10-23
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

```text
# Grid column heigh in Math Detail
## What's wrong
The list of players, when is listing the grid column 2, the height of the buttons expands itself beyond the limit of the scroll.
```

## Symptom

In the Match Detail view (`MatchDetailView.tsx`), the list of players rendered in the 2-column grid (`RosterValuationList.tsx`) displays buttons (`TouchableOpacity`) that vertically stretch and expand excessively far beyond their content bounds and the scroll view limit, causing unnatural spacing and inflated scroll heights.

## Reproduction

1. Launch the application and select a team.
2. Navigate to the matches tab (`GameList.tsx`).
3. Select any finished match with player statistics to open `MatchDetailView`.
4. Scroll down past the Period Breakdown table to the "Roster por Valoración" section.
5. Observe the remaining players listed below the top MVP card in the 2-column grid:
   - The card buttons are stretched vertically to an excessive height.
   - The vertical space between player details (header) and points/valuation (footer) is inflated, pushing content far down and expanding the scroll view far beyond normal content limits.

## Suspected Code Paths

- `src/features/match-detail/components/RosterValuationList.tsx:127-198` — Specifically lines 130-136, where each non-MVP player in the 2-column grid is rendered inside `<View className="w-[48.5%] mb-2.5">` with an inner `<TouchableOpacity className="bg-slate-800/80 border border-slate-700/80 active:bg-slate-750 p-2.5 rounded-xl h-full justify-between">`.

## Root Cause Hypothesis

In `RosterValuationList.tsx`, the 2-column grid is structured as:
```tsx
<View className="flex-row flex-wrap justify-between" testID="roster-grid-container">
  {remainingPlayers.map((player) => (
    <View key={`${player.id}-${player.statId}`} className="w-[48.5%] mb-2.5">
      <TouchableOpacity
        ...
        className="... h-full justify-between"
      >
```
In React Native's Yoga layout engine, applying `h-full` (`height: '100%'`) on an element whose immediate parent (`<View className="w-[48.5%] mb-2.5">`) has `height: auto` inside a flex-wrap container within a `ScrollView` creates an undefined percentage height dependency. Yoga cannot resolve `height: 100%` against an auto-height line cross-axis and instead resolves `100%` against an ancestor container (such as the outer ScrollView viewport), causing the button height to inflate dramatically and stretch beyond the expected scroll boundaries.

Confidence: **high**

## Proposed Remediation

**Preferred**:
1. Remove `h-full` from the `<TouchableOpacity>` and consolidate layout styling so the button either acts as the direct grid child with natural content height, or keep the outer column `<View className="w-[48.5%] mb-2.5">` and remove `h-full` from `<TouchableOpacity>`.
2. Allow the cards to size naturally based on their internal contents (jersey number, name, minutes, points, and valuation badge), keeping vertical padding compact and uniform across all grid items without stretching.

**Alternatives**:
- Assign an explicit fixed height or `min-h-[72px]` to the cards if identical card heights across lines are required, avoiding unbounded percentage heights in flex-wrap.

**Files likely to change**:
- `src/features/match-detail/components/RosterValuationList.tsx`
- `src/features/match-detail/__tests__/components/RosterValuationList.test.tsx`

**Tests to add or update**:
- `src/features/match-detail/__tests__/components/RosterValuationList.test.tsx`:
  - Add test asserting that grid item buttons do not contain `h-full` or unbounded percentage height classes.
  - Verify 2-column grid rendering remains functional across odd and even player counts.

## Risks & Considerations

- **Visual Consistency**: Removing `h-full` could lead to slight height disparities between two adjacent cards on the same row if one card wraps to a second line. Because player names already have `numberOfLines={1}` and all other stats are fixed single lines, card heights will remain uniform across the grid.

## Open Questions

- None. The issue is a standard React Native Yoga layout conflict between `flex-wrap`, `height: 100%` (`h-full`), and `ScrollView`.
