# Quickstart & Validation Guide: Login View & Session Manager

**Feature**: `018-login-session-manager`  
**Date**: 2026-11-06  
**Status**: Ready for Validation  

This guide provides end-to-end validation scenarios for the Login view, centralized environment configuration, SQLite session caching, ClubList header logout, Remember Me encrypted credential persistence, and Biometric fast-login.

---

## Prerequisites

1. Ensure dependencies are installed:
   ```bash
   npm install
   ```
2. Run test suite to verify test setup:
   ```bash
   npm test
   ```
3. Set up environment configuration:
   - Verify `.env.example` exists.
   - Verify `.env` defines `EXPO_PUBLIC_API_URI` or `API_URI`.

---

## Scenario 0: Centralized Environment Configuration Verification (FR-014, FR-015, FR-016)

### Purpose
Verify that runtime configuration resolves dynamically through `src/core/config/env.ts` with sanitized endpoints, supports both `EXPO_PUBLIC_API_URI` and `API_URI`, and falls back safely without crashing when variables are absent.

### Steps
1. Run the environment configuration test suite:
   ```bash
   npm test -- --testPathPattern=env
   ```
2. **Expected**:
   - `env.API_URI` reads provided `EXPO_PUBLIC_API_URI` or `API_URI`.
   - Trailing slashes are stripped cleanly.
   - `authService` imports `env` directly from `src/core/config/env.ts` with zero hardcoded URLs.

---

## Scenario 1: First Launch / Unauthenticated User Flow (US1 & US3)

### Purpose
Verify that a cold start without a cached session displays the Login view as the entry point, prevents empty submissions with client validation feedback, and executes successful authentication.

### Steps
1. Run the Jest test suite for Login View & Form Validation:
   ```bash
   npm test -- --testPathPattern=LoginView
   ```
2. Launch the application:
   ```bash
   npm run start
   ```
3. **Verify Screen**: The initial view must be the `Login` screen with username input, masked password input, "Recordar credenciales" (Remember me) toggle, and the "Iniciar Sesión" (Login) submit button.
4. **Validation Test**:
   - Leave username or password blank and tap submit.
   - **Expected**: An error message ("El usuario no puede estar vacío" / "La contraseña no puede estar vacía") is displayed under the corresponding input within 200ms. No network request is dispatched.
5. **Success Submission**:
   - Enter valid credentials (`Patrick.JS` and password).
   - Tap "Iniciar Sesión".
   - **Expected**: Loading indicator appears. Upon 200 OK response from `${env.API_URI}/auth/login`, the session is persisted to SQLite, and the user transitions directly to the main club dashboard (`ClubManage`).

---

## Scenario 2: Automatic Session Restoration on Re-Launch (US2)

### Purpose
Verify that reopening the application with a valid, non-expired cached session bypasses the Login screen.

### Steps
1. Run the session restoration test suite:
   ```bash
   npm test -- --testPathPattern=authSessionRepository
   ```
2. Close or reload the application after a successful login.
3. Re-open the application.
4. **Expected**:
   - The application performs `checkSession()` during the initialization splash.
   - Because `now < expiresAt`, the session is validated.
   - The user immediately lands on `ClubManage` without displaying the Login screen or interactive prompts (< 1.5s).

---

## Scenario 3: Expired Token & Cache Corruption Recovery (US4)

### Purpose
Verify that stale or corrupt session rows are safely purged and cause fallback to the Login view.

### Steps
1. Run the edge-case lifecycle test suite:
   ```bash
   npm test -- --testPathPattern=useAuthStore
   ```
2. Simulate an expired session record (`expiresAt` in the past) or corrupt row.
3. Open the application.
4. **Expected**:
   - `checkSession()` detects the expired timestamp or invalid structure.
   - Stale rows are purged via `clearSession()`.
   - The user is directed cleanly to `LoginView`.

---

## Scenario 4: User-Initiated Logout from ClubList Header (US6, FR-017, FR-018, FR-019)

### Purpose
Verify that the `ClubList` screen header renders a power icon logout button on the left side, and tapping it destroys the session and immediately redirects the user to `LoginView`.

### Steps
1. Run the logout test suites:
   ```bash
   npm test -- --testPathPattern=ClubManage
   ```
2. Log into the application and land on the `ClubManage` screen (`ClubList` view).
3. **Verify Header**:
   - Locate the header at the top of the screen.
   - Verify an accessible button is rendered on the **left side** featuring a **Feather power icon** (`testID="header-logout-button"`).
4. Tap the power icon logout button.
5. **Expected**:
   - `authStore.logout()` executes in < 500ms.
   - SQLite `auth_sessions` cache is purged.
   - In-memory session credentials and user profile are cleared.
   - The user is immediately redirected to `LoginView`.
   - Any attempt to navigate back or access protected views is blocked.

---

## Scenario 5: "Remember Me" Credential Persistence (US7, FR-020, FR-021, FR-024)

### Purpose
Verify that toggling "Remember me" on the Login screen securely encrypts and persists credentials in `expo-secure-store`, and unchecking it purges persisted credentials.

### Steps
1. Run the secure storage tests:
   ```bash
   npm test -- --testPathPattern=secureStorageService
   ```
2. In `LoginView`, check/toggle the "Recordarme" option to enabled.
3. Submit valid credentials.
4. **Expected**:
   - Credentials are encrypted and saved into `expo-secure-store`.
   - Zero plaintext passwords exist in SQLite or AsyncStorage.
5. Log out. Re-open login view.
6. **Expected**:
   - The remembered username is automatically pre-filled.
7. Uncheck "Recordarme" and log in again.
8. **Expected**:
   - Previously persisted credentials in `expo-secure-store` are purged.

---

## Scenario 6: Biometric Fast-Login & Fallback (US7, FR-022, FR-023, SC-010, SC-012)

### Purpose
Verify that when remembered credentials exist and biometric hardware is available, biometric verification enables one-touch login without manual typing, with graceful fallback on failure or cancellation.

### Steps
1. Run the biometric service tests:
   ```bash
   npm test -- --testPathPattern=biometricService
   ```
2. On a device or simulator with biometrics enrolled and remembered credentials stored:
   - Launch the application or tap "Iniciar con biometría".
   - When the biometric dialog appears, verify fingerprint or face.
   - **Expected**: Authentication succeeds and routes user to `ClubManage` within 2 seconds.
3. Test Fallback:
   - Trigger the biometric prompt and press "Cancel" or fail recognition.
   - **Expected**: The dialog dismisses cleanly without crashing or blocking the UI.
   - The manual username and password fields remain editable and ready for manual login.
