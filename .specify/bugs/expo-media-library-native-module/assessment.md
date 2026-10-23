# Bug Assessment: Cannot find native module 'ExpoMediaLibraryNext' During App Init

- **Slug**: expo-media-library-native-module
- **Created**: 2026-10-23
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: critical

## Report (verbatim or summarized)

```text
# Blocking Error During Init App
## Error track
Runtine not ready: Error: Cannot find native module 'ExpoMediaLibraryNext'
```

## Symptom

When launching the application on a mobile device or emulator via Expo / Metro, the app crashes immediately during initialization with the error `Runtime not ready: Error: Cannot find native module 'ExpoMediaLibraryNext'`, completely preventing the user from viewing or interacting with any app screen.

Expected behavior: The application initializes smoothly into the Home/Dashboard view without crashing, regardless of whether specific optional native modules like `ExpoMediaLibraryNext` are compiled into the client runtime.

## Reproduction

1. Run `npx expo start -c` (or `npm start`).
2. Open the application using Expo Go or a Development Client build that was built without the new `ExpoMediaLibraryNext` native binary module.
3. Observe that immediately upon JavaScript bundle download and evaluation during startup, the app throws `Runtime not ready: Error: Cannot find native module 'ExpoMediaLibraryNext'` and halts app execution.

## Suspected Code Paths

- `src/features/match-detail/services/matchShareService.ts:3` — Static top-level `import * as MediaLibrary from "expo-media-library";` is evaluated immediately when the module is imported.
- `src/features/match-detail/index.ts:4` — Public barrel export `export { matchShareService } from "./services/matchShareService";` causes `matchShareService.ts` to be loaded whenever `src/features/match-detail` is imported.
- `src/page/GameList.tsx:11` — `import { MatchDetailView } from "../features/match-detail";` causes transitive load of the entire `match-detail` barrel at page load.
- `src/page/ClubProfile.tsx:7` — `import { MatchDetailView } from "../features/match-detail";` and `import GameList from "./GameList";` pull in the match-detail module during initial navigation assembly.
- `app.json:23-28` — `plugins` list includes `expo-sqlite`, `expo-font`, `expo-status-bar`, and `expo-sharing`, but lacks `expo-media-library` config plugin and permissions.
- `package.json:20` — `"expo-media-library": "~57.0.5"` exports modern `./next` by default which calls `requireNativeModule('ExpoMediaLibraryNext')` during package evaluation (`node_modules/expo-media-library/build/ExpoMediaLibraryNext.js:5`).

## Root Cause Hypothesis

`expo-media-library` (v57.0.5) defaults its entry point to the Expo Next architecture, which eagerly executes `requireNativeModule('ExpoMediaLibraryNext')` on module evaluation. Because `src/features/match-detail/services/matchShareService.ts` contains a top-level static import of `expo-media-library` and is exported through `src/features/match-detail/index.ts` (consumed by `GameList.tsx` and `ClubProfile.tsx`), the native module lookup is executed immediately when Metro loads the initial JavaScript bundle on app startup. In environments where the native client lacks `ExpoMediaLibraryNext` (such as Expo Go or un-rebuilt native dev clients), `requireNativeModule` throws an uncaught exception at bundle evaluation time, crashing runtime initialization. Confidence: high.

## Proposed Remediation

**Preferred**: 
1. Protect `matchShareService.ts` against native module unavailability:
   - Avoid eager top-level static import of `expo-media-library`. Replace static import with dynamic/safe resolution or a guarded wrapper (e.g., dynamic `import("expo-media-library")` inside `saveImageToGallery`, or checking `ExpoModulesCore.requireOptionalNativeModule('ExpoMediaLibraryNext')` / `ExpoMediaLibrary`).
   - If `expo-media-library` is not available in the current runtime environment, gracefully fallback to `expo-sharing` (`Sharing.shareAsync(fileUri)` with an informative note to the user that direct camera-roll saving requires a full development build), or return a graceful outcome `{ success: false, error: "Guardado directo en galería no disponible en este dispositivo." }` without crashing the application.
2. If direct gallery saving via native library is required in dev builds:
   - Add `"expo-media-library"` with necessary permissions (`photosPermission`, `savePhotosPermission`) to the `plugins` array in `app.json`.
3. In `src/features/match-detail/index.ts`, ensure barrel exports do not trigger side effects at initial bundle evaluation.

**Alternatives**:
- *Rely exclusively on `expo-sharing` for sharing and saving*: `expo-sharing` is already linked, configured in `app.json`, and natively supports Android and iOS system share sheets (which allow users to save images to Photos/Drive/Files or send directly to WhatsApp/Telegram). This completely removes the native dependency on `expo-media-library` and eliminates the risk of missing native modules.

**Files likely to change**:
- `src/features/match-detail/services/matchShareService.ts`
- `src/features/match-detail/components/MatchShareModal.tsx`
- `app.json` (if retaining `expo-media-library` as an optional plugin)
- `src/features/match-detail/__tests__/services/matchShareService.test.ts`
- `src/features/match-detail/__tests__/mocks/shareMocks.ts`

**Tests to add or update**:
- Unit test in `matchShareService.test.ts` verifying that `matchShareService` does not crash during module initialization when `ExpoMediaLibraryNext` is missing or undefined.
- Unit test verifying graceful fallback or error outcome in `saveImageToGallery` when the native media library module is unavailable.

## Risks & Considerations

- **Expo Go vs Dev Client compatibility**: `expo-media-library` in recent SDK versions has limited/restricted support in Expo Go due to scoped storage and Android permission changes. Making the service resilient to missing native modules ensures the app remains testable in Expo Go and pre-existing dev builds.
- **Contract compatibility**: `MatchShareServiceContract` signature (`saveImageToGallery(fileUri: string): Promise<ShareActionOutcome>`) should remain intact so that existing callers and tests in `MatchShareModal.tsx` continue to work without breaking changes.

## Open Questions

- None.
