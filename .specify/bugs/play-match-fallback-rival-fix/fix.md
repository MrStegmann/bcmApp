# Bug Fix: Player Jersey Name Fallback "F. Lastname" and Rival Control Points/Faults Removal

- **Slug**: play-match-fallback-rival-fix
- **Fixed**: 2026-10-24
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Restored player identification logic to prioritize `jerseyName` and fallback to `F. Lastname` (First initial dot Lastname) when `jerseyName` is absent, updated player circles (`HalfCourtCanvas` and `TeamManagementPanel`) to render the jersey number on top and the identifier name below, and completely removed points and fouls counter elements from the `RivalPanelControl` section.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/play-match/utils/formatPlayerIdentifier.ts` | modified | Prioritizes `jerseyName`, falls back to `F. Lastname`, handles edge cases, and removes number formatting from name slot |
| `src/features/play-match/components/HalfCourtCanvas.tsx` | modified | Renders jersey number on top line and player identifier name on second line |
| `src/features/play-match/components/TeamManagementPanel.tsx` | modified | Renders jersey number on top line and player identifier name on second line for bench players |
| `src/features/play-match/components/RivalPanelControl.tsx` | modified | Removed all points and fouls counters and text; retains section title and action pad buttons |
| `src/features/play-match/types/index.ts` | modified | Made `rivalPeriodScore` and `rivalPeriodFouls` optional in `RivalPanelControlProps` |
| `src/features/play-match/__tests__/utils/formatPlayerIdentifier.test.ts` | modified | Unit tests verifying `jerseyName` priority and `F. Lastname` fallback behavior |
| `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx` | modified | Component tests checking number on top and identifier below |
| `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx` | modified | Component tests checking bench circle number on top and identifier below |
| `src/features/play-match/__tests__/components/RivalPanelControl.test.tsx` | modified | Component tests verifying absence of points and fouls text/counters |

## Diff Highlights (optional)

```typescript
// formatPlayerIdentifier.ts:
const trimmedJersey = player.jerseyName != null ? String(player.jerseyName).trim() : "";
if (trimmedJersey.length > 0) {
  return trimmedJersey;
}
// ...
if (trimmedFirst.length > 0 && trimmedLast.length > 0) {
  const initial = trimmedFirst.charAt(0).toUpperCase();
  return `${initial}. ${capitalize(trimmedLast)}`;
}
```

```tsx
// HalfCourtCanvas.tsx & TeamManagementPanel.tsx:
<Text className="text-amber-400 font-black text-sm leading-tight text-center" numberOfLines={1}>
  {player.number ? (String(player.number).startsWith("#") ? player.number : `#${player.number}`) : "#-"}
</Text>
<Text className="text-slate-200 font-semibold text-[8px] leading-tight text-center" numberOfLines={1}>
  {identifier}
</Text>
```

```tsx
// RivalPanelControl.tsx:
<View className="flex-1 mr-2">
  <View className="flex-row items-center space-x-1.5">
    <View className="w-2 h-2 rounded-full bg-sky-400" />
    <Text className="text-sky-400 font-extrabold text-xs tracking-wider uppercase">
      Rival ({activePeriod.toUpperCase()})
    </Text>
  </View>
</View>
```

## Tests Added or Updated

- `src/features/play-match/__tests__/utils/formatPlayerIdentifier.test.ts` — asserts `jerseyName` priority, `F. Lastname` fallback with or without numbers, and edge case fallbacks.
- `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx` — asserts court player identification (`L. Doncic` fallback / `DONCIC` jerseyName) and 2-line circle layout.
- `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx` — asserts bench player identification (`D. Gafford` fallback / `GAFFORD` jerseyName) and 2-line circle layout.
- `src/features/play-match/__tests__/components/RivalPanelControl.test.tsx` — asserts complete removal of points (`pts`) and fouls (`faltas`) counters from Rival Control section.

## Local Verification

- Commands run:
  - `npm test -- src/features/play-match` → 13 suites passed, 69 tests passed.
  - `npm test` → 67 suites passed, 418 tests passed.
- Manual checks:
  - Verified player circles display `#number` on line 1, `jerseyName` or `F. Lastname` on line 2, divisor line, and minutes/points on line 3.
  - Verified `RivalPanelControl` renders only title and control buttons (`-1`, `+1`, `+2`, `+3`, `-F`, `+1 Falta`) without any point or foul counts.

## Deviations from Assessment

None. The remediation directly implemented all items specified in the assessment.

## Follow-ups

- Run `/speckit-bug-test slug=play-match-fallback-rival-fix` to record the validation report.
