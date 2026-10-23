# Bug Assessment: Fatal Crash from Require of ExpoMediaLibraryNext After False Positive Native Check

- **Slug**: save-image-native-module
- **Created**: 2026-10-23
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
# Error after save/shared stats.
## When
When the user save the file and show the info message of succeed, the app crash with the following error below.
## Error track
Uncaught Error

Cannot find native module 'ExpoMediaLibraryNext'

Source:
J:\GitHub\BasketApp\bcmApp\src\features\match-detail\services\matchShareService.ts (40:18)

Call Stack:
requireNativeModule (J:\GitHub\BasketApp\bcmApp\node_modules\expo-modules-core\src\requireNativeModule.ts:20)
<global> (J:\GitHub\BasketApp\bcmApp\node_modules\expo-media-library\src\ExpoMediaLibraryNext.ts:31)
loadModuleImplementation (J:\GitHub\BasketApp\bcmApp\node_modules\expo\node_modules\@expo\cli\build\metro-require\require.js:248)
guardedLoadModule (J:\GitHub\BasketApp\bcmApp\node_modules\expo\node_modules\@expo\cli\build\metro-require\require.js:163)
metroRequire (J:\GitHub\BasketApp\bcmApp\node_modules\expo\node_modules\@expo\cli\build\metro-require\require.js:74)
<global> (J:\GitHub\BasketApp\bcmApp\node_modules\expo-media-library\src\index.ts:5)
loadModuleImplementation (J:\GitHub\BasketApp\bcmApp\node_modules\expo\node_modules\@expo\cli\build\metro-require\require.js:248)
guardedLoadModule (J:\GitHub\BasketApp\bcmApp\node_modules\expo\node_modules\@expo\cli\build\metro-require\require.js:156)
metroRequire (J:\GitHub\BasketApp\bcmApp\node_modules\expo\node_modules\@expo\cli\build\metro-require\require.js:74)
getMediaLibraryModule (J:\GitHub\BasketApp\bcmApp\src\features\match-detail\services\matchShareService.ts:40)
saveImageToGallery (J:\GitHub\BasketApp\bcmApp\src\features\match-detail\services\matchShareService.ts:186)
```

## Symptom

When saving or sharing match statistics via "Guardar en Galería" inside `MatchShareModal`, the user briefly sees the success notification, but the app immediately crashes with an unhandled fatal RedBox exception: `Uncaught Error: Cannot find native module 'ExpoMediaLibraryNext'` originating from `matchShareService.ts:40`.

Expected behavior:
When saving the image to the gallery in an environment where `ExpoMediaLibraryNext` native binary is not available (such as standard Expo Go or a development client without the updated native module), `isMediaLibraryAvailable()` must return `false`. `getMediaLibraryModule()` must return `null` without invoking `require("expo-media-library")`, and `saveImageToGallery` must fall back cleanly to `Sharing.shareAsync` without causing Metro's `guardedLoadModule` to invoke `global.ErrorUtils.reportFatalError`.

## Reproduction

1. Run the app in Expo Go or a React Native build where the native module `ExpoMediaLibrary` (legacy) is present but `ExpoMediaLibraryNext` is not linked.
2. Navigate to a match's detail view (`GameList` -> select match -> `MatchDetailView`).
3. Tap "Compartir" in the header to display `MatchShareModal`.
4. Tap "Guardar en Galería".
5. Notice that the fallback share sheet or success alert appears, but Metro triggers an unhandled fatal RedBox crash: `Cannot find native module 'ExpoMediaLibraryNext'`.

## Suspected Code Paths

- `src/features/match-detail/services/matchShareService.ts:15-29` — `isMediaLibraryAvailable()` checks `requireOptionalNativeModule("ExpoMediaLibraryNext") ?? requireOptionalNativeModule("ExpoMediaLibrary")` and `(globalThis as any).expo?.modules?.ExpoMediaLibrary`. In Expo Go and older runtimes, the legacy native module `ExpoMediaLibrary` is present, causing `isMediaLibraryAvailable()` to return `true` as a false positive.
- `src/features/match-detail/services/matchShareService.ts:35-44` — `getMediaLibraryModule()` calls `require("expo-media-library")` on line 40 because `isMediaLibraryAvailable()` returned `true`.
- `node_modules/expo-media-library/src/ExpoMediaLibraryNext.ts:31` — Unconditionally executes `requireNativeModule('ExpoMediaLibraryNext')` upon module load. Because `ExpoMediaLibraryNext` does not exist in the native runtime, it throws.
- Metro Module Loader (`@expo/cli/build/metro-require/require.js:156-163`) — `guardedLoadModule` wraps module execution and calls `global.ErrorUtils.reportFatalError(e)` when an error occurs during `loadModuleImplementation`. Even if the caller wraps `require(...)` in `try / catch` and falls back to `Sharing.shareAsync` (which produces the success alert), Metro has already flagged the error as a fatal crash.
- `src/__tests__/mocks/expo-modules-core.js:2` & `src/features/match-detail/__tests__/mocks/shareMocks.ts:101` — The mocks previously accepted `name === "ExpoMediaLibrary"` as equivalent to `ExpoMediaLibraryNext`, masking the false positive in unit tests.

## Root Cause Hypothesis

The root cause is a false positive in the availability check in `matchShareService.ts:15-29`.

`expo-media-library` v57 exclusively imports and delegates to `ExpoMediaLibraryNext` (via `import ExpoMediaLibraryNext from './ExpoMediaLibraryNext'` in `index.ts`, which unconditionally executes `requireNativeModule('ExpoMediaLibraryNext')`). It never uses the legacy `ExpoMediaLibrary` native module in its main export.

In Expo Go, the legacy `ExpoMediaLibrary` module is present in the native runtime, but `ExpoMediaLibraryNext` is NOT. Because `isMediaLibraryAvailable()` included fallback checks for `requireOptionalNativeModule("ExpoMediaLibrary")` and `expo?.modules?.ExpoMediaLibrary`, it returned `true`. As a result, `getMediaLibraryModule()` called `require("expo-media-library")` on line 40.

When Metro executed `expo-media-library`, `ExpoMediaLibraryNext.ts` threw `Cannot find native module 'ExpoMediaLibraryNext'`. Metro's `guardedLoadModule` caught this error during module loading and invoked `global.ErrorUtils.reportFatalError(e)`. While the JavaScript `try / catch` block in `saveImageToGallery` caught the re-thrown exception and successfully initiated the fallback `Sharing.shareAsync` (showing the "Guardado con Éxito" dialog), Metro's fatal error handler had already scheduled the fatal RedBox crash.

Confidence: high.

## Proposed Remediation

**Preferred**:
1. **Remove False-Positive Legacy Checks**:
   - In `src/features/match-detail/services/matchShareService.ts`, update `isMediaLibraryAvailable()` to strictly check `ExpoMediaLibraryNext` only. Do NOT check `ExpoMediaLibrary` or `expo?.modules?.ExpoMediaLibrary`:
     ```typescript
     export function isMediaLibraryAvailable(): boolean {
       try {
         const nativeModule =
           (typeof requireOptionalNativeModule === "function"
             ? requireOptionalNativeModule("ExpoMediaLibraryNext")
             : null) ??
           (globalThis as any).expo?.modules?.ExpoMediaLibraryNext;

         return !!nativeModule;
       } catch {
         return false;
       }
     }
     ```
   - When `ExpoMediaLibraryNext` is absent (as in Expo Go), `isMediaLibraryAvailable()` will accurately return `false`. `getMediaLibraryModule()` will return `null` immediately without ever invoking `require("expo-media-library")`, completely avoiding Metro's `guardedLoadModule` fatal crash handler.

2. **Update Test Mocks**:
   - Update `src/__tests__/mocks/expo-modules-core.js` and `src/features/match-detail/__tests__/mocks/shareMocks.ts` so that only `"ExpoMediaLibraryNext"` is recognized as the valid native module.
   - Update `matchShareService.test.ts` to assert that having only `ExpoMediaLibrary` (legacy) does NOT cause `isMediaLibraryAvailable()` to return `true` or call `getMediaLibraryModule()`.

**Alternatives**:
- *Try-catch with dynamic import / indirect evaluation*: Metro statically analyzes requires; `try/catch` around `require(...)` does not prevent `guardedLoadModule` from reporting fatal errors in dev mode. Strict pre-check of `ExpoMediaLibraryNext` before require is the clean, idiomatic Expo pattern.

**Files likely to change**:
- `src/features/match-detail/services/matchShareService.ts`
- `src/__tests__/mocks/expo-modules-core.js`
- `src/features/match-detail/__tests__/mocks/shareMocks.ts`
- `src/features/match-detail/__tests__/services/matchShareService.test.ts`

**Tests to add or update**:
- Test asserting that `isMediaLibraryAvailable()` returns `false` when only legacy `ExpoMediaLibrary` exists in `requireOptionalNativeModule` or `globalThis.expo.modules`.
- Test asserting that `saveImageToGallery()` falls back to `Sharing.shareAsync` without calling `require("expo-media-library")` when `ExpoMediaLibraryNext` is missing.

## Risks & Considerations

- **Native Builds**: When a custom dev client or production build is compiled with `npx expo run:android` or EAS Build, `ExpoMediaLibraryNext` is compiled into the binary, and `requireOptionalNativeModule("ExpoMediaLibraryNext")` will return truthy, seamlessly enabling direct gallery saving.
- **Backwards Compatibility**: No changes to user-facing contracts or UI components.

## Open Questions

- None. The stack trace, module internals, and reproduction mechanics are clear and validated.
