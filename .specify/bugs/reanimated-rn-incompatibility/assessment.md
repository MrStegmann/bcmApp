# Bug Assessment: React Native Reanimated Incompatible with React Native 0.86.3

- **Slug**: reanimated-rn-incompatibility
- **Created**: 2026-10-25
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: critical

## Report (verbatim or summarized)

```text
> Task :react-native-reanimated:assertMinimalReactNativeVersionTask FAILED

> Task :expo-constants:createExpoConfig
The NODE_ENV environment variable is required but was not specified. Ensure the project is bundled with Expo CLI or NODE_ENV is set. Using only .env.local and .env

> Task :react-native-quick-sqlite:generateCodegenSchemaFromJavaScript
No modules to process in combine-js-to-schema-cli. If this is unexpected, please check if you set up your NativeComponent correctly. See combine-js-to-schema.js for how codegen finds modules.

[Incubating] Problems report is available at: file:///J:/GitHub/BasketApp/bcmApp/android/build/reports/problems/problems-report.html

FAILURE: Build failed with an exception.

* Where:
Build file 'J:\GitHub\BasketApp\bcmApp\node_modules\react-native-reanimated\android\build.gradle' line: 287

* What went wrong:
Execution failed for task ':react-native-reanimated:assertMinimalReactNativeVersionTask'.
> [Reanimated] React Native 0.86.3 version is not compatible with Reanimated 4.1.0
```

## Symptom

Executing an Android Gradle build (`./gradlew assembleRelease` or `./gradlew assembleDebug`) fails during task `:react-native-reanimated:assertMinimalReactNativeVersionTask`. The build aborts with the message:
`[Reanimated] React Native 0.86.3 version is not compatible with Reanimated 4.1.0`.

## Reproduction

1. In the project root, ensure dependencies are installed (`npm install`).
2. Run validation check:
   ```bash
   node node_modules/react-native-reanimated/scripts/validate-react-native-version.js 0.86.3
   ```
   *(Exits with status code 1: `[Reanimated] React Native 0.86.3 version is not compatible with Reanimated 4.1.0`)*
3. Execute Gradle clean build in `android/`:
   ```bash
   ./gradlew clean
   ./gradlew assembleRelease
   ```
4. Observe build failure at `:react-native-reanimated:assertMinimalReactNativeVersionTask`.

## Suspected Code Paths

- [package.json](file:///j:/GitHub/BasketApp/bcmApp/package.json#L26-L30) — `package.json` specifies `"expo": "~57.0.31"` and `"react-native": "0.86.3"`. However, `react-native-reanimated` is missing from top-level dependencies.
- `node_modules/nativewind/package.json` -> `node_modules/react-native-css-interop/package.json:81` — Declares `"peerDependencies": { "react-native-reanimated": ">=3.6.2" }`.
- [node_modules/react-native-reanimated/compatibility.json](file:///j:/GitHub/BasketApp/bcmApp/node_modules/react-native-reanimated/compatibility.json#L6-L9) — `4.1.x` in `compatibility.json` only supports `"react-native": ["0.78", "0.79", "0.80", "0.81"]`.
- [node_modules/react-native-reanimated/android/build.gradle](file:///j:/GitHub/BasketApp/bcmApp/node_modules/react-native-reanimated/android/build.gradle#L278-L292) — Executes `scripts/validate-react-native-version.js` during `preBuild`, throwing a `GradleException` when the version compatibility check fails.

## Root Cause Hypothesis

The project was updated to Expo SDK 57 (`~57.0.31`), which relies on React Native `0.86.3`. While `nativewind@4.2.1` pulls in `react-native-css-interop` with a peer dependency requirement on `react-native-reanimated: >=3.6.2`, `react-native-reanimated` was not pinned in the root `package.json`. As a result, npm resolved or retained an older version (`4.1.0`).

In `react-native-reanimated@4.1.0`, the build validation explicitly restricts supported React Native versions to 0.78–0.81. Expo SDK 57 bundles and expects `react-native-reanimated: ~4.5.1` (which explicitly supports React Native 0.83–0.86).

**Confidence**: High (100% verified via compatibility schemas and direct script reproduction).

## Proposed Remediation

**Preferred**:
Explicitly install the Expo SDK 57-compatible version of `react-native-reanimated` using Expo CLI:
```bash
npx expo install react-native-reanimated
```
This pins `"react-native-reanimated": "~4.5.1"` in root `package.json` and updates `node_modules` and `package-lock.json`.

**Alternatives**:
- Manually add `"react-native-reanimated": "~4.5.1"` to `dependencies` in `package.json` and run `npm install`.

**Files likely to change**:
- `package.json`
- `package-lock.json`

**Tests to add or update**:
- Run `node node_modules/react-native-reanimated/scripts/validate-react-native-version.js 0.86.3` to ensure zero exit code.
- Run `npm run test` (Jest suite) to ensure test suite remains passing.
- Run `./gradlew clean` and `./gradlew assembleRelease` (or `./gradlew assembleDebug`) in `android/` to verify Android build finishes successfully.

## Risks & Considerations

- Native module linking: Ensure Gradle cache and build folders (`android/.gradle`, `android/app/build`) are cleaned if stale artifacts exist.
- React 19 / New Architecture: Expo 57 and Reanimated 4.5.x are designed to run on React Native 0.86 with the New Architecture enabled.

## Open Questions

- None. The root cause is identified and the official Expo 57 module version is known (`~4.5.1`).
