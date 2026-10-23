# Bug Verification: Safe Native Module Guard & Deterministic Image Filename Formatting

- **Slug**: save-image-native-module
- **Tested**: 2026-10-23
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: partial

## Summary

The fix successfully prevents uncaught native module crashes when `ExpoMediaLibraryNext` is missing by strictly querying `ExpoMediaLibraryNext` (avoiding false-positive legacy checks) and cleanly falling back to `expo-sharing`. Automated unit, service, and full regression test suites pass with 100% success (62/62 suites, 373/373 tests); the outcome is classified as `partial` strictly in accordance with guardrails because reproduction on a physical device running Expo Go was not directly exercised in this headless CLI environment.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Automated unit & service test reproduction (`matchShareService.test.ts` missing-module suite) | pass | `getMediaLibraryModule()` returns `null` safely without throwing RedBox error; `saveImageToGallery` falls back cleanly to `expo-sharing`. |
| New / updated tests | `npx jest src/features/match-detail` | pass | 15 test suites passed, 90 tests passed. |
| Regression suite | `npm test` | pass | 62 test suites passed, 373 tests passed across the entire project. |
| Lint / type-check | `npx tsc --noEmit` | skipped | Pre-existing project-wide type errors in scripts and older test files unrelated to `match-detail`; no type check npm script configured. |

## Output Excerpts

### Match Detail Suite (New & Updated Tests)
```text
PASS src/features/match-detail/__tests__/services/matchShareService.test.ts
PASS src/features/match-detail/__tests__/utils/shareDataFormatter.test.ts
PASS src/features/match-detail/__tests__/components/MatchShareModal.test.tsx
...
Test Suites: 15 passed, 15 total
Tests:       90 passed, 90 total
Snapshots:   0 total
Time:        1.557 s
Ran all test suites matching /src\features\match-detail/i.
```

### Share Service and Formatter Specific Cases
```text
  Native Module Guard (ExpoMediaLibraryNext)
    √ should return false and getMediaLibraryModule() should return null without throwing when native module is missing (3 ms)
    √ should return false and getMediaLibraryModule() should return null when only legacy ExpoMediaLibrary is present (preventing false positive in Expo Go)
    √ should return false when globalThis.expo.modules only contains legacy ExpoMediaLibrary
    √ should return true when globalThis.expo.modules contains ExpoMediaLibraryNext
    √ should return true and getMediaLibraryModule() should return module when native module is present (1 ms)
  captureViewToPng
    √ should capture ref and return file URI when view ref is valid (1 ms)
    √ should capture and copy image to custom formatted filename when customFileName is provided (1 ms)
    √ should throw error if view ref is null or ref.current is missing (1 ms)
  shareImageFile
    √ should dispatch native sharing if sharing is available
    √ should return failure if sharing is not available on device
    √ should handle exceptions thrown by shareAsync gracefully
    √ should copy to custom filename before sharing if customFileName is provided (1 ms)
  saveImageToGallery
    √ should save file to library when permissions are already granted
    √ should copy file to custom filename before saving to gallery if customFileName is provided
    √ should gracefully fallback to expo-sharing when native module is missing from runtime (Expo Go)
    √ should gracefully fallback to expo-sharing when only legacy ExpoMediaLibrary is present in runtime (Expo Go) (1 ms)
    √ should request permissions when not initially granted and save if user approves
    √ should return permissionDenied failure when user denies permissions (1 ms)
    √ should gracefully fallback to expo-sharing when expo-media-library is unavailable
    √ should return error if expo-media-library is unavailable and sharing is also unavailable (1 ms)
    √ should gracefully fallback to sharing if native module throws Cannot find native module error
    √ should handle unexpected error when sharing fallback also fails (1 ms)
```

### Full Regression Suite
```text
Test Suites: 62 passed, 62 total
Tests:       373 passed, 373 total
Snapshots:   0 total
Time:        2.252 s
Ran all test suites.
```

## Residual Risks

- Physical device execution in Expo Go client on iOS/Android should be smoke-tested to confirm that the native share sheet invokes WhatsApp cleanly with the sanitized filename in the native OS share dialog.
- Standalone APK / iOS builds using custom dev client or EAS will bundle `ExpoMediaLibraryNext`, enabling direct gallery save without requiring the fallback.

## Recommendation

Hold at partial until manual verification on a physical device running Expo Go confirms that saving and sharing from `MatchShareModal` completes smoothly in the mobile UI. All automated unit and regression checks are verified green.
