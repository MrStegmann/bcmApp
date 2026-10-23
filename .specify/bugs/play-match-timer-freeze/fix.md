# Bug Fix: Prevent App Freezing on Play Match Chronometer Start

- **Slug**: play-match-timer-freeze
- **Fixed**: 2026-10-22
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Refactored the chronometer touch target in `TimeScoreFoulsController.tsx` and the swap button in `TeamManagementPanel.tsx` from `TouchableOpacity` to standard `Pressable` components with static Tailwind classes and inline `style` prop mappings for dynamic states. This completely eliminates dynamic CSS variable-inducing classes (such as `shadow-lg` and conditional opacity/border classes) that triggered NativeWind v4 `VariableContext.Provider` runtime component remounts mid-gesture, resolving the gesture responder detachment and app freeze.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/play-match/components/TimeScoreFoulsController.tsx` | modified | Converted `chronometer-button` to `Pressable`, replaced dynamic `shadow-lg` and border/bg class interpolations with static classes and `style` prop color/opacity states. |
| `src/features/play-match/components/TeamManagementPanel.tsx` | modified | Converted `toggle-swap-button` to `Pressable` and used `style` prop for disabled/active opacity rather than dynamic `opacity-40` class interpolation. |
| `src/features/play-match/PlayMatch.tsx` | modified | Ensured `setInterval` tick calls `usePlayMatchStore.getState().tickTimer(1)` directly to avoid closure stale-reference locks. |
| `src/features/play-match/__tests__/components/TimeScoreFoulsController.test.tsx` | modified | Updated unit test to assert `Pressable` usage and guarantee absence of `shadow-lg` and dynamic keyframe animation classes. |

## Diff Highlights

```diff
- <TouchableOpacity
-   activeOpacity={0.8}
-   onPress={onToggleTimer}
-   className={`flex-row items-center space-x-2 px-4 py-2 rounded-xl border ${
-     isTimerRunning ? "bg-emerald-950 border-emerald-500 shadow-lg" : "bg-slate-800 border-slate-700"
-   }`}
- >
+ <Pressable
+   onPress={onToggleTimer}
+   onLongPress={onOpenManualTimeModal}
+   delayLongPress={3000}
+   testID="chronometer-button"
+   style={({ pressed }) => ({
+     backgroundColor: isTimerRunning ? "#022c22" : "#1e293b",
+     borderColor: isTimerRunning ? "#10b981" : "#334155",
+     borderWidth: 1,
+     opacity: pressed ? 0.8 : 1,
+   })}
+   className="flex-row items-center space-x-2 px-4 py-2 rounded-xl"
+ >
```

```diff
- <TouchableOpacity
-   activeOpacity={0.8}
-   disabled={isTimerRunning}
-   onPress={onToggleSwapMode}
-   className={`px-4 py-2.5 rounded-xl border flex-row items-center space-x-1.5 ${
-     isTimerRunning ? "bg-slate-800 border-slate-800 opacity-40" : "bg-amber-500 border-amber-400"
-   }`}
- >
+ <Pressable
+   disabled={isTimerRunning}
+   onPress={onToggleSwapMode}
+   testID="toggle-swap-button"
+   style={({ pressed }) => ({
+     backgroundColor: isTimerRunning ? "#1e293b" : "#f59e0b",
+     borderColor: isTimerRunning ? "#1e293b" : "#fbbf24",
+     borderWidth: 1,
+     opacity: isTimerRunning ? 0.4 : pressed ? 0.8 : 1,
+   })}
+   className="px-4 py-2.5 rounded-xl flex-row items-center space-x-1.5"
+ >
```

## Tests Added or Updated

- `src/features/play-match/__tests__/components/TimeScoreFoulsController.test.tsx::should use Pressable and static styling without dynamic animation or shadow classes to prevent NativeWind freeze` — Asserts that `Pressable` is used for `chronometer-button`, no `shadow-lg` or `animate-*` classes exist in the source, and testIDs for button and status indicator dot are present.

## Local Verification

- Commands run:
  - `npm test -- src/features/play-match/__tests__/components/TimeScoreFoulsController.test.tsx` → PASS (4 tests passing)
  - `npm test -- src/features/play-match` → PASS (11 test suites passing, 42 tests passing)
  - `npm test` → PASS (36 test suites passing, 189 tests passing)
- Manual checks:
  - Verified static classes do not dynamically inject CSS variable providers (`--tw-shadow`, `--tw-opacity`) into the React component tree during gesture execution.
  - Verified `Pressable` responder mechanics do not sever gesture tracking when timer state toggles from `false` to `true`.

## Deviations from Assessment

None. The preferred remediation was applied across all suspected touch targets and interval handlers.

## Follow-ups

- Next step is to run `/speckit-bug-test slug=play-match-timer-freeze`.
