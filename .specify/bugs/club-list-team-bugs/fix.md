# Bug Fix: Fix Freezing on Team Creation and View Jump on Team Deletion

- **Slug**: club-list-team-bugs
- **Fixed**: 2026-10-26
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Fixed UI freezing after team creation by scoping `KeyboardAwareScrollView` exclusively to the form view (avoiding nested `ScrollView` and gesture pan responder conflicts with `ClubList` and `ClubProfile`). Resolved unwanted navigation to the first remaining team when deleting a team by ensuring `deleteTeam` and `createTeam` set `club` and `currentTeam` to `null` so the view stays in `ClubList`. Also hardened `Alerts` to avoid intercepting touch gestures when no alert is active or in transparent overlay regions.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/store/ClubStore.ts` | modified | In `createTeam` and `deleteTeam`, set `club: null` and `currentTeam: null` instead of auto-selecting a team. |
| `src/page/ClubManage.tsx` | modified | Restructured layout so `KeyboardAwareScrollView` wraps only the form; defensively clear `club` to `null` on team addition and deletion. |
| `src/components/Alerts.tsx` | modified | Return `null` when `alerts.length === 0` and add `pointerEvents="box-none"` to overlay container. |
| `src/__tests__/store/ClubStore.test.ts` | modified | Added unit tests verifying `createTeam` and `deleteTeam` leave `club` and `currentTeam` as `null`. |
| `src/__tests__/components/ClubManage.test.tsx` | modified | Updated delete test asserting `club: null` and `currentTeam: null` upon team removal. |

## Diff Highlights (optional)

```typescript
// src/store/ClubStore.ts
deleteTeam: async (teamId: number) => {
  ...
  set({
    teamsList: updatedList,
    clubs: updatedList,
    currentTeam: null,
    club: null,
    isLoading: false,
  });
  return true;
}
```

```tsx
// src/page/ClubManage.tsx
{club ? (
  <ClubProfile ... />
) : createMode || editingTeam ? (
  <KeyboardAwareScrollView ...>
    <ClubForm ... />
  </KeyboardAwareScrollView>
) : (
  <ClubList ... />
)}
```

```tsx
// src/components/Alerts.tsx
if (alerts.length === 0) return null;
return (
  <View pointerEvents="box-none" className="w-full absolute top-28 z-50 ...">
```

## Tests Added or Updated

- `src/__tests__/store/ClubStore.test.ts::createTeam should persist team to list while leaving club and currentTeam null` — verifies that creating a team adds it to `teamsList` without selecting it or navigating away from `ClubList`.
- `src/__tests__/store/ClubStore.test.ts::deleteTeam should remove team and set club and currentTeam to null even if other teams exist` — pins down that deleting any team keeps `club` and `currentTeam` as `null` instead of jumping to the first team remaining.
- `src/__tests__/components/ClubManage.test.tsx::should remove deleted team from store teamsList and set club and currentTeam to null` — confirms state expectation on team deletion.

## Local Verification

- Commands run: `npx jest src/__tests__/components/ClubManage.test.tsx src/__tests__/store/ClubStore.test.ts` → 2 passed, 15 passed, 0 failed
- Commands run: `npm test` → 95 passed, 558 passed, 0 failed

## Deviations from Assessment

None. All changes strictly follow the proposed remediation in `assessment.md`.

## Follow-ups

- Run bug verification suite using `/speckit-bug-test slug=club-list-team-bugs`.
