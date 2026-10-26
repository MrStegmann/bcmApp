# Bug Fix: Match Detail Edit Modal Stuck and Non-Roster Players Displayed

- **Slug**: match-detail-roster-bugs
- **Fixed**: 2026-10-26T13:35:00.000Z
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Fixed the stuck bottom sheet modal in Match Detail by migrating `MatchEditModal` to a full-screen `SafeAreaView` layout so that form fields and action buttons are fully accessible. Filtered match players in `useMatchDetailStore.initializeMatch` to strictly include only players called up in the match roster (`playerStats`), eliminating non-roster players from "Roster por Valoración", the share image export graphic, and the edit modal.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/match-detail/components/MatchEditModal.tsx` | modified | Converted modal from collapsed `max-h-[90%]` bottom sheet to full-screen `<SafeAreaView className="flex-1 bg-surface-container">` with `transparent={false}` so `KeyboardAwareScrollView` flexes across the entire screen |
| `src/features/match-detail/store/useMatchDetailStore.ts` | modified | Filtered `teamPlayers` to match roster IDs when `playerStats` rows exist, with graceful fallback to all team players for legacy matches without stats |
| `src/features/match-detail/__tests__/components/MatchEditModal.test.tsx` | modified | Added full-screen layout contract test verifying presence of `SafeAreaView` and removal of `max-h-[90%]` / `justify-end` |
| `src/features/match-detail/__tests__/useMatchDetailStore.test.ts` | modified | Added tests verifying active roster filtering when `playerStats` exist and graceful fallback for legacy matches |

## Diff Highlights (optional)

```tsx
// MatchEditModal.tsx
-    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
-      <View className="flex-1 bg-black/85 justify-end">
-        <View className="w-full bg-surface-container rounded-t-3xl border-t border-slate-border max-h-[90%] overflow-hidden">
+    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onCancel}>
+      <SafeAreaView className="flex-1 bg-surface-container">
```

```ts
// useMatchDetailStore.ts
+      const activePlayers =
+        statsRows.length > 0
+          ? teamPlayers.filter((player) => statsByPlayerId.has(player.id))
+          : teamPlayers;
```

## Tests Added or Updated

- `src/features/match-detail/__tests__/useMatchDetailStore.test.ts::should only include called-up roster players in players when playerStats exist` — Verifies only players called up in `playerStats` are included in the store's `players` list
- `src/features/match-detail/__tests__/useMatchDetailStore.test.ts::should fallback to all team players when playerStats is empty (legacy match)` — Verifies legacy matches without roster stats fall back safely to all team players
- `src/features/match-detail/__tests__/components/MatchEditModal.test.tsx::should configure full-screen SafeAreaView layout without collapsed bottom sheet constraints` — Verifies full-screen `SafeAreaView` layout without bottom sheet collapse constraints

## Local Verification

- Commands run: `npm test -- src/features/match-detail` → 15 test suites passed, 95 tests passed.

## Deviations from Assessment

None. The remediation followed the assessment plan precisely.

## Follow-ups

- Proceed to verification with `/speckit-bug-test slug=match-detail-roster-bugs`.
