# Bug Assessment: Render Error undefined is not a function in NextMatchCard (round.startsWith)

- **Slug**: home-view-round-render-error
- **Created**: 2026-10-23
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
# Home View Page Update Errors
## Traze Error
Render Error

undefined is not a function

Source:
J:\GitHub\BasketApp\bcmApp\src\features\home-view\components\NextMatchCard.tsx (39:41)

Call Stack:
NextMatchCard (J:\GitHub\BasketApp\bcmApp\src\features\home-view\components\NextMatchCard.tsx:39)
callComponent.react_stack_bottom_frame (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:17130)
renderWithHooks (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:5648)
updateFunctionComponent (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:8081)
beginWork (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:9340)
runWithFiberInDEV (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:697)
performUnitOfWork (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:14134)
workLoopSync (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:13966)
renderRootSync (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:13947)
performWorkOnRoot (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:13160)
performSyncWorkOnRoot (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:3688)
flushSyncWorkAcrossRoots_impl (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:3538)
processRootScheduleInMicrotask (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:3570)
scheduleMicrotask$argument_0 (J:\GitHub\BasketApp\bcmApp\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:3708)
```

## Symptom

When navigating to the Home View dashboard (`HomeView.tsx`), the application crashes during initial render with `Render Error: undefined is not a function` originating at `NextMatchCard.tsx (39:41)`. Rather than rendering the dashboard and Next Match card, React Native terminates the component tree and displays the red screen error.

## Reproduction

1. Launch the application and select a team that has at least one pending game where `round` is stored as an integer (e.g. `1` or `2`) or returned from SQLite without string coercion.
2. Navigate to the team Home View (`HomeView.tsx`).
3. During rendering of `NextMatchCard.tsx`, line 39 attempts to execute `nextMatch.round.startsWith("Jornada")`.
4. Because `nextMatch.round` is a number (e.g. `1`), `(1).startsWith` is `undefined`, raising `TypeError: undefined is not a function`.
5. The unhandled exception is caught by the React Fabric renderer, halting the dashboard.

## Suspected Code Paths

- `src/features/home-view/components/NextMatchCard.tsx:36-42` — Calls `nextMatch.round.startsWith("Jornada")` directly at line 39 without type checking or coercion to string.
- `src/features/home-view/components/RecentMatchCard.tsx:19-21` — Contains identical unsafe pattern: `match.round.startsWith("Jornada")` at line 20, presenting the same crash risk for finished matches.
- `src/features/home-view/store/useHomeViewStore.ts:95-104, 126-137` — Stores `round: earliest.round` and `round: game.round` without enforcing string coercion, allowing database numeric values to propagate to UI components.

## Root Cause Hypothesis

In `NextMatchCard.tsx:39`, the component assumes `nextMatch.round` is a JavaScript string containing `String.prototype.startsWith`. In SQLite databases, column values for `round` may be stored or returned as numbers (e.g. `1`, `2`) depending on legacy database contents or insertion formats. When `nextMatch.round` is a number, calling `.startsWith` tries to invoke an undefined property on `Number.prototype`, causing `Render Error: undefined is not a function`. The identical vulnerability exists in `RecentMatchCard.tsx:20`.

Confidence: **high**

## Proposed Remediation

**Preferred**:
1. In `NextMatchCard.tsx` and `RecentMatchCard.tsx`, defensively convert and format the round label before checking prefixes, mirroring the robust pattern established in `src/components/GameCards.tsx:84-86`:
   ```tsx
   const roundStr = String(nextMatch.round ?? "");
   const roundLabel = roundStr.toLowerCase().startsWith("jornada")
     ? roundStr
     : `Jornada ${roundStr}`;
   ```
2. In `useHomeViewStore.ts`, sanitize `round` during dashboard data mapping so downstream components consistently receive string values:
   ```ts
   round: earliest.round != null ? String(earliest.round) : "1",
   ```
   and
   ```ts
   round: game.round != null ? String(game.round) : "1",
   ```
3. Update `NextMatchCard.test.tsx` and `RecentMatchesColumn.test.tsx` to assert that numeric `round: 1` as well as string `"1"` and `"jornada 1"` are formatted properly without throwing runtime errors.

**Alternatives**:
- Create a shared utility function `formatRoundLabel(round?: string | number): string` in `src/features/home-view/utils/matchDateHelper.ts` and use it uniformly across `NextMatchCard` and `RecentMatchCard`.

**Files likely to change**:
- `src/features/home-view/components/NextMatchCard.tsx`
- `src/features/home-view/components/RecentMatchCard.tsx`
- `src/features/home-view/store/useHomeViewStore.ts`
- `src/features/home-view/__tests__/components/NextMatchCard.test.tsx`
- `src/features/home-view/__tests__/components/RecentMatchesColumn.test.tsx`

**Tests to add or update**:
- `NextMatchCard.test.tsx`: Test that `nextMatch` with numeric `round: 1` as well as string `"1"` or `"jornada 1"` renders the round badge correctly without throwing `undefined is not a function`.
- `RecentMatchesColumn.test.tsx`: Test that `RecentMatchCard` with numeric `round: 2` formats `round` as `"Jornada 2"` without throwing `undefined is not a function`.

## Risks & Considerations

- **Low Risk**: The fix consists of defensive type coercion and case-insensitive prefix checking.
- **Backwards Compatibility**: Handles numeric rounds (`1`), string integers (`"1"`), already-formatted strings (`"Jornada 1"`), and lowercase strings (`"jornada 1"`).

## Open Questions

- None. The root cause and fix are verified against the stack trace and component source code.
