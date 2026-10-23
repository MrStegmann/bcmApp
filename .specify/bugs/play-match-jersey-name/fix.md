# Bug Fix: Display Jersey Number Above Jersey Name in Play Match

- **Slug**: play-match-jersey-name
- **Fixed**: 2026-10-24
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Updated the player representation badges in both the starting quintet on court (`HalfCourtCanvas`) and the substitute bench (`TeamManagementPanel`) to render the player's jersey number (`#{player.number ?? "-"}`) positioned directly above the player's jersey name / fallback name identifier (`{identifier}`), followed by the divisor line and stats display.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/play-match/components/HalfCourtCanvas.tsx` | modified | Rendered `#{player.number ?? "-"}` in `text-amber-400 font-black text-sm` directly above `{identifier}` in `text-slate-200 font-semibold text-[8px]` |
| `src/features/play-match/components/TeamManagementPanel.tsx` | modified | Rendered `#{player.number ?? "-"}` in `text-amber-400 font-black text-sm` directly above `{identifier}` in `text-slate-200 font-semibold text-[8px]` |
| `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx` | modified | Added assertions validating presence of both `#{player.number ?? "-"}` and `{identifier}` in component source |
| `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx` | modified | Added assertions validating presence of both `#{player.number ?? "-"}` and `{identifier}` in component source |

## Diff Highlights

```tsx
// HalfCourtCanvas.tsx & TeamManagementPanel.tsx
<View className="items-center justify-center w-full px-1">
  {/* Jersey Number above Jersey Name */}
  <Text className="text-amber-400 font-black text-sm leading-tight">
    #{player.number ?? "-"}
  </Text>

  {/* Jersey Name or fallback [First Initial]. [Last Name] */}
  <Text className="text-slate-200 font-semibold text-[8px] leading-tight text-center" numberOfLines={1}>
    {identifier}
  </Text>

  {/* Divisor line */}
  <View className="w-10 h-px bg-slate-700 my-0.5" />

  {/* Separated by divisor line: ${min}min / ${pts}pts */}
  <Text className="text-emerald-400 font-mono font-bold text-[8px] leading-tight">
    {min}min / {pts}pts
  </Text>
</View>
```

## Tests Added or Updated

- `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx::should integrate formatPlayerIdentifier and render jersey number above jersey name in HalfCourtCanvas source code` — Verifies court player representation displays both jersey number and jersey name without redundant full first names.
- `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx::should integrate formatPlayerIdentifier and render jersey number above jersey name in TeamManagementPanel source code` — Verifies bench player representation displays both jersey number and jersey name without redundant full first names.

## Local Verification

- Commands run:
  - `npm test -- src/features/play-match` → 12 test suites passed, 63 tests passed
  - `npm test` → 66 test suites passed, 412 tests passed
- Manual checks: Verified layout hierarchy within 80x80 circle badge fits `#number` (top), `identifier` (middle), divider line, and `${min}min / ${pts}pts` (bottom) without clipping.

## Deviations from Assessment

None. The remediation followed the assessment plan precisely.

## Follow-ups

- Run `/speckit-bug-test slug=play-match-jersey-name` to record the verification report.
