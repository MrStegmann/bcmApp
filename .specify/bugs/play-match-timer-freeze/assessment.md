# Bug Assessment: Chronometer Tap Freezes / Crashes App in Play Match

- **Slug**: play-match-timer-freeze
- **Created**: 2026-10-22
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: critical

## Report (verbatim or summarized)

> **Overview**
> The bug still happen when the user tap over the crono to start the reverse time count down. The app crash after tap over the crono. The app stop responding to the taps of the user.

## Symptom

When the user taps the chronometer button in the Play Match view to start the reverse countdown, the application freezes immediately, touch events across the entire screen stop responding, and the timer never begins counting down.

## Reproduction

1. Launch the application with an active database.
2. Navigate to **Partidos** (Game List) and tap any match to enter the **PlayMatch** view.
3. If prompted, confirm the starting 5 quintet to land on the court view.
4. Tap the chronometer widget (`testID="chronometer-button"`), currently showing `10:00`.
5. Observe that immediately upon tapping, the app freezes, the countdown does not start, and all touch interactions across the screen are unresponsive.

## Suspected Code Paths

- `src/features/play-match/components/TimeScoreFoulsController.tsx:68-98` — The chronometer widget uses `TouchableOpacity` with dynamic Tailwind class interpolations (`shadow-lg`, border, and color variables) toggled when `isTimerRunning` becomes `true`. Under NativeWind v4 (`react-native-css-interop`), dynamically introducing classes that rely on CSS variables (`--tw-shadow`, `--tw-shadow-colored`, `--tw-border-opacity`) triggers an unmount/remount upgrade to `VariableContext.Provider` during an active touch gesture, severing React Native's gesture responder chain and locking UI responsiveness.
- `src/features/play-match/PlayMatch.tsx:273-291` — The `useEffect` for real-time chronometer intervals subscribes to `isTimerRunning` and creates a `setInterval` that calls `tickTimer(1)`. If `tickTimer` triggers rapid re-render cycles or conflicts with the render phase, the JavaScript event loop is stalled.
- `src/features/play-match/components/TeamManagementPanel.tsx:103-117` — The swap button conditionally switches to `disabled={isTimerRunning}` and applies `opacity-40` simultaneously upon tap, participating in the same synchronous re-render.
- `src/features/play-match/store/usePlayMatchStore.ts:186-221` — `toggleTimer` synchronously updates `isTimerRunning: true`, causing `usePlayMatchStore()` in `PlayMatch` to re-evaluate the full component tree and pass new props to all controller components.

## Root Cause Hypothesis

When the user taps `chronometer-button`, `onToggleTimer` switches `isTimerRunning` from `false` to `true`. This causes two critical issues in React Native 0.86 / React 19:
1. `TimeScoreFoulsController.tsx` conditionally adds `shadow-lg` and emerald border classes (`border border-emerald-300`, `bg-emerald-950 border-emerald-500 shadow-lg`) to the `TouchableOpacity`. In NativeWind v4 (`react-native-css-interop`), classes with CSS variables (`--tw-shadow`, `--tw-border-opacity`) added after the initial mount trigger runtime component wrapping into `VariableContext.Provider` (as logged in `react-native-css-interop`: *"Components need to set a variable during the initial render otherwise they will remount"*). Because this remount happens mid-touch on the active gesture target, React Native's touch responder system is left in a detached/locked state where subsequent touch events are ignored.
2. In addition, `TouchableOpacity` utilizes legacy `Animated.Value` opacity fades that conflict with dynamic NativeWind class updates during active press responder grants.

Confidence: high.

## Proposed Remediation

**Preferred**:
1. In `TimeScoreFoulsController.tsx`, refactor the chronometer button from `TouchableOpacity` to standard `Pressable` (or decouple touch handling from dynamic Tailwind variable classes).
2. Remove conditional CSS variable-inducing classes (specifically `shadow-lg` and conditional border opacities) from the dynamic template literal of `chronometer-button` and `chronometer-status-dot`. Use constant elevation/shadow styles or standard React Native `style` prop mappings for active state colors (`backgroundColor`, `borderColor`), avoiding NativeWind's dynamic variable context provider upgrades during gesture lifecycles.
3. Ensure that the chronometer interval in `PlayMatch.tsx` uses robust, drift-safe timer ticks that do not conflict with touch state.

**Alternatives**:
- Wrap `PlayMatch` and `TimeScoreFoulsController` in a dedicated ErrorBoundary and isolate the timer state into a localized countdown component so that toggling the timer does not trigger a full-tree re-render of `PlayMatch`, `TeamManagementCanvas`, and modal trees.
  *Trade-off*: More invasive architectural change, but further optimizes re-render performance during the 1-second countdown ticks.

**Files likely to change**:
- `src/features/play-match/components/TimeScoreFoulsController.tsx`
- `src/features/play-match/PlayMatch.tsx`
- `src/features/play-match/components/TeamManagementPanel.tsx`
- `src/features/play-match/__tests__/components/TimeScoreFoulsController.test.tsx`

**Tests to add or update**:
- Add component render & press tests verifying that toggling `isTimerRunning` does not add dynamic CSS shadow or keyframe animation classes.
- Verify that tapping `chronometer-button` successfully toggles timer state without gesture responder disconnection or unhandled errors.

## Risks & Considerations

- Low visual impact: switching to static shadow/border styles preserves the dark/emerald color theme while eliminating dynamic NativeWind runtime remounting.
- Platform compatibility: using `Pressable` with clean static styling works uniformly across Expo web, Android, and iOS.

## Open Questions

- None. The symptom directly correlates with gesture responder lock triggered by dynamic class/variable updates on the active chronometer touch target.
