# Bug Fix: Player Grid Button Height Expansion in Match Detail

- **Slug**: match-detail-grid-height
- **Fixed**: 2026-10-23
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Removed the unbounded `h-full` class from the `TouchableOpacity` player card items inside the 2-column flex-wrap grid of `RosterValuationList.tsx`. This stops React Native's Yoga layout engine from resolving 100% height against ancestor containers inside a `ScrollView`, allowing cards to naturally bound to their content height.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/match-detail/components/RosterValuationList.tsx` | modified | Removed `h-full` from player button `className` in the 2-column grid |
| `src/features/match-detail/__tests__/components/RosterValuationList.test.tsx` | modified | Added regression test to prevent reinstatement of unbounded `h-full` |

## Diff Highlights

```diff
-              <TouchableOpacity
-                onPress={() => onSelectPlayer(player)}
-                activeOpacity={0.7}
-                className="bg-slate-800/80 border border-slate-700/80 active:bg-slate-750 p-2.5 rounded-xl h-full justify-between"
-                testID={`player-roster-item-${player.id}`}
-              >
+              <TouchableOpacity
+                onPress={() => onSelectPlayer(player)}
+                activeOpacity={0.7}
+                className="bg-slate-800/80 border border-slate-700/80 active:bg-slate-750 p-2.5 rounded-xl justify-between"
+                testID={`player-roster-item-${player.id}`}
+              >
```

## Tests Added or Updated

- `src/features/match-detail/__tests__/components/RosterValuationList.test.tsx` — Added test to ensure the 2-column grid player button does not include `h-full` to prevent vertical expansion and inflated scroll views.

## Local Verification

- Commands run: `npm test -- src/features/match-detail` → 11 test suites passed, 43 tests passed.
- All match detail components and views passed without regressions.

## Deviations from Assessment

None. The fix strictly implemented the preferred remediation from `assessment.md`.

## Follow-ups

- Run `/speckit-bug-test slug=match-detail-grid-height` to complete verification.
