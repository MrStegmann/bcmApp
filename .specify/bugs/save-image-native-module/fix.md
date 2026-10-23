# Bug Fix: Fatal Crash from Require of ExpoMediaLibraryNext After False Positive Native Check

- **Slug**: save-image-native-module
- **Fixed**: 2026-10-23
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Removed false-positive legacy native module checks (`ExpoMediaLibrary`) from `isMediaLibraryAvailable()` in `matchShareService.ts`. The runtime availability check now strictly tests for `ExpoMediaLibraryNext`, preventing `require("expo-media-library")` from executing in Expo Go or runtimes without the new native module, cleanly falling back to `expo-sharing` without Metro triggering an uncatchable fatal RedBox crash.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/match-detail/services/matchShareService.ts` | modified | Updated `isMediaLibraryAvailable()` to strictly check `ExpoMediaLibraryNext` only. |
| `src/__tests__/mocks/expo-modules-core.js` | modified | Updated `requireOptionalNativeModule` mock to return a module only for `ExpoMediaLibraryNext`. |
| `src/features/match-detail/__tests__/mocks/shareMocks.ts` | modified | Updated `mockRequireOptionalNativeModule` in `resetShareMocks` to only match `ExpoMediaLibraryNext`. |
| `src/features/match-detail/__tests__/services/matchShareService.test.ts` | modified | Added tests verifying false-positive avoidance for legacy `ExpoMediaLibrary` and graceful fallback in `saveImageToGallery`. |

## Diff Highlights (optional)

```typescript
// src/features/match-detail/services/matchShareService.ts
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

## Tests Added or Updated

- `src/features/match-detail/__tests__/services/matchShareService.test.ts`
  - `Native Module Guard (ExpoMediaLibraryNext) :: should return false and getMediaLibraryModule() should return null when only legacy ExpoMediaLibrary is present (preventing false positive in Expo Go)` — Verifies `requireOptionalNativeModule("ExpoMediaLibrary")` does not trigger module load.
  - `Native Module Guard (ExpoMediaLibraryNext) :: should return false when globalThis.expo.modules only contains legacy ExpoMediaLibrary` — Verifies global module registry does not false-positive on legacy module.
  - `Native Module Guard (ExpoMediaLibraryNext) :: should return true when globalThis.expo.modules contains ExpoMediaLibraryNext` — Verifies global module registry correctly flags availability when `ExpoMediaLibraryNext` is present.
  - `saveImageToGallery :: should gracefully fallback to expo-sharing when only legacy ExpoMediaLibrary is present in runtime (Expo Go)` — Validates that in the exact Expo Go condition, `saveImageToGallery` delegates to `Sharing.shareAsync` without calling `require("expo-media-library")`.

## Local Verification

- Commands run:
  - `npx jest src/features/match-detail` → Passed all 15 test suites and 90 tests.
  - `npm test` → Passed all 62 test suites and 373 tests across the entire repository.

## Deviations from Assessment

None. The remediation strictly adheres to the preferred plan in [assessment.md](file:///j:/GitHub/BasketApp/bcmApp/.specify/bugs/save-image-native-module/assessment.md).

## Follow-ups

- When running via a custom development client (`npx expo run:android` / `npx expo run:ios`) or EAS standalone build containing the linked `ExpoMediaLibraryNext` module, `requireOptionalNativeModule("ExpoMediaLibraryNext")` will return truthy and enable direct gallery saving.
