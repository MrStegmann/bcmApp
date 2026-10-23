# Bug Verification: Cannot find native module 'ExpoMediaLibraryNext' During App Init

- **Slug**: expo-media-library-native-module
- **Tested**: 2026-10-23T18:07:30+02:00
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: partial

## Summary

The eager static import that triggered runtime initialization failure has been eliminated and replaced with lazy loading and fallback sharing, which was verified through automated test suites and config validation. Full result is marked as partial pending end-to-end confirmation on a physical device running Expo Go.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Automated module import verification & error handling tests | pass | Lazy evaluation verified: `expo-media-library` is no longer imported at module initialization time. |
| Physical device launch | Open app in Expo Go without native module | not-run | Requires interactive manual launch on physical Android/iOS hardware running Expo Go. |
| New / updated tests | `npm test -- src/features/match-detail/__tests__/services/matchShareService.test.ts` | pass | 12 tests passed, verifying lazy fallback when native module is missing or throws error. |
| Component contract tests | `npm test -- src/features/match-detail/__tests__/components/MatchShareModal.test.tsx` | pass | 4 tests passed, confirming modal and service integration. |
| Regression suite | `npm test` | pass | 62 test suites passed, 355 total tests passed. |
| Expo configuration check | `npx expo config --type public` | pass | Config plugin and storage permissions correctly configured in `app.json`. |
| Lint / type-check | `npx tsc --noEmit` | pass | Zero errors in modified feature and test source files. |

## Output Excerpts

### matchShareService unit tests
```text
PASS src/features/match-detail/__tests__/services/matchShareService.test.ts
  matchShareService Unit Tests (T017 - US3)
    saveImageToGallery
      √ should save file to library when permissions are already granted
      √ should request permissions when not initially granted and save if user approves
      √ should return permissionDenied failure when user denies permissions
      √ should gracefully fallback to expo-sharing when expo-media-library is unavailable
      √ should return error if expo-media-library is unavailable and sharing is also unavailable
      √ should gracefully fallback to sharing if native module throws Cannot find native module error
      √ should handle unexpected error when sharing fallback also fails

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

### Full regression test suite
```text
Test Suites: 62 passed, 62 total
Tests:       355 passed, 355 total
Snapshots:   0 total
Time:        2.314 s, estimated 4 s
Ran all test suites.
```

### Expo plugin configuration check
```text
plugins: [
  'expo-sqlite',
  'expo-font',
  'expo-status-bar',
  'expo-sharing',
  [
    'expo-media-library',
    {
      photosPermission: 'Permite a Basket Club Manager guardar imágenes de estadísticas en la galería.',
      savePhotosPermission: 'Permite a Basket Club Manager guardar imágenes de estadísticas en la galería.'
    }
  ]
]
```

## Residual Risks

- **Physical device runtime in Expo Go**: While static code evaluation and unit tests prove the startup crash cannot occur at module import time, opening the app in Expo Go or an actual dev client on a physical device should be verified to confirm UI behavior during manual share/save interactions.
- **Standalone prebuild / EAS Build**: When building standalone binaries with EAS Build or `npx expo run:android`, ensure native prebuild runs cleanly with the newly added `expo-media-library` plugin in `app.json`.

## Recommendation

Hold at partial status until verified on device — all automated and regression tests pass, and startup code paths are protected against missing native modules. Verify on an Expo Go device running Metro (`npm start`), then close the bug.
