# Bug Fix: Cannot find native module 'ExpoMediaLibraryNext' During App Init

- **Slug**: expo-media-library-native-module
- **Fixed**: 2026-10-23T18:01:00+02:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Removed eager static import of `expo-media-library` to prevent immediate startup crashes (`Cannot find native module 'ExpoMediaLibraryNext'`) on devices and environments lacking the native binary module (such as Expo Go), added guarded on-demand module resolution with graceful fallback to `expo-sharing`, and configured the `expo-media-library` config plugin in `app.json`.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/match-detail/services/matchShareService.ts` | modified | Replaced top-level static `import * as MediaLibrary from "expo-media-library"` with guarded lazy loader `getMediaLibraryModule()` and added fallback to `Sharing.shareAsync` when native module is missing. |
| `src/features/match-detail/components/MatchShareModal.tsx` | modified | Updated gallery save success feedback to reflect outcome message dynamically if fallback sharing was performed. |
| `app.json` | modified | Added `"expo-media-library"` plugin configuration with `photosPermission` and `savePhotosPermission`. |
| `src/features/match-detail/__tests__/mocks/shareMocks.ts` | modified | Added `mockMediaLibraryAvailable` state toggle and mock proxy module to facilitate testing native module absence and availability. |
| `src/features/match-detail/__tests__/services/matchShareService.test.ts` | modified | Added unit tests verifying graceful fallback to `expo-sharing` when `expo-media-library` is unavailable or throws missing native module exceptions. |

## Diff Highlights (optional)

```typescript
// src/features/match-detail/services/matchShareService.ts
function getMediaLibraryModule(): any {
  try {
    return require("expo-media-library");
  } catch {
    return null;
  }
}

// In saveImageToGallery:
const MediaLibrary = getMediaLibraryModule();
if (!MediaLibrary || typeof MediaLibrary.getPermissionsAsync !== "function") {
  const isShareAvailable = await Sharing.isAvailableAsync();
  if (isShareAvailable) {
    await Sharing.shareAsync(fileUri, {
      mimeType: "image/png",
      dialogTitle: "Guardar o compartir imagen",
      UTI: "public.png",
    });
    return {
      success: true,
      message: "Guardado directo no disponible en este entorno. Se abrió el selector para guardar.",
      uri: fileUri,
    };
  }
  return {
    success: false,
    error: "Guardado en galería no disponible en este dispositivo.",
  };
}
```

## Tests Added or Updated

- `src/features/match-detail/__tests__/services/matchShareService.test.ts::should gracefully fallback to expo-sharing when expo-media-library is unavailable` — verifies that missing native module triggers fallback to system share sheet without uncaught errors.
- `src/features/match-detail/__tests__/services/matchShareService.test.ts::should return error if expo-media-library is unavailable and sharing is also unavailable` — verifies error return when neither native gallery nor sharing is supported.
- `src/features/match-detail/__tests__/services/matchShareService.test.ts::should gracefully fallback to sharing if native module throws Cannot find native module error` — pins down runtime module call failure interception and recovery.

## Local Verification

- Commands run:
  - `npm test -- src/features/match-detail/__tests__/services/matchShareService.test.ts` → 12 passed, 12 total.
  - `npm test` → 62 test suites passed, 355 total tests passed.
- Manual checks:
  - Verified bundle evaluation no longer imports native module `ExpoMediaLibraryNext` eagerly upon importing `matchShareService` or `src/features/match-detail`.

## Deviations from Assessment

None. All changes adhere directly to the preferred remediation and test specifications outlined in the assessment.

## Follow-ups

- When generating production/prebuild native binaries via EAS (`eas build`), ensure native prebuild incorporates the `expo-media-library` plugin permissions defined in `app.json`.
