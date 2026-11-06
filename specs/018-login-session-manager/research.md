# Research & Architectural Decisions: Login View & Session Manager

**Feature**: `018-login-session-manager`  
**Date**: 2026-11-06  
**Status**: Completed  

---

## 1. Feature Architecture & Directory Organization

### Context & Problem
The application requires:
- A new entry point (`LoginView` page) as the default unauthenticated screen.
- A local SQLite session cache manager.
- A centralized typed environment configuration module.
- A user-initiated logout button in the `ClubList` header.
- Secure credential persistence ("Remember me").
- Biometric fast-login verification.

We must decide where all components, services, repositories, and state stores should reside adhering to Constitution Principle II (Feature-Based Architecture).

### Decision
1. Encapsulate all authentication, credential, and session management functionality inside `src/features/auth/`:
   - `src/features/auth/components/`: `LoginView.tsx` (login form, remember-me toggle, biometric trigger, feedback indicators).
   - `src/features/auth/db/`: `schema.ts` (Drizzle SQLite schema) and `authSessionRepository.ts` (typed database operations for SQLite session cache).
   - `src/features/auth/services/`:
     - `authService.ts`: Network API client calling `${env.API_URI}/auth/login` and calculating expiration timestamps.
     - `secureStorageService.ts`: Wrapper for `expo-secure-store` handling hardware-backed encrypted credential persistence.
     - `biometricService.ts`: Wrapper for `expo-local-authentication` managing sensor detection and authentication prompts.
   - `src/features/auth/store/`: `useAuthStore.ts` (Zustand state store managing credentials, rememberMe, authStatus, loading states, validation errors, and user profile).
   - `src/features/auth/hooks/`: `useAuthLifecycle.ts` (app mount hook for session verification and biometric fast-login trigger).
   - `src/features/auth/types.ts`: Domain models and interface definitions.
   - `src/features/auth/index.ts`: Public barrel exports for other modules and `App.tsx`.
   - `src/features/auth/__tests__/`: Co-located unit and integration tests.
2. Place shared environment configuration in `src/core/config/env.ts` per Constitution Principle II.
3. Wire the logout button into the left header action of the `ClubList` screen in `src/page/ClubManage.tsx` using `useMenuStore.setHeaderBackAction` with `Feather` icon `power`.

### Rationale
- Completely adheres to Principle II (Feature-Based Architecture) and isolates security-sensitive logic.
- Keeps Drizzle table definitions co-located while re-exporting in `src/db/schema.ts` and `src/db/index.ts`.
- Satisfies FR-015 and FR-016 with centralized configuration.
- Satisfies FR-017 through FR-024 for logout, secure storage, and biometrics.

---

## 2. Session Cache Storage & Schema Strategy (Drizzle ORM & Expo SQLite)

### Context & Problem
The specification states:
> "the token must be saved in the sqlite as a cache. Each time the user enter the app, this cache must be check, if miss, then require authenticated."
> "If a valid, non-expired session exists in the local cache, the application MUST automatically bypass the Login view and route the user to the main application interface."

### Decision
Define table `auth_sessions` in `src/features/auth/db/schema.ts`:
```ts
export const authSessions = sqliteTable("auth_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token").notNull(),
  tokenType: text("token_type").notNull().default("Bearer"),
  expiresIn: integer("expires_in").notNull(),
  expiresAt: text("expires_at").notNull(), // ISO-8601 string timestamp
  userId: integer("user_id").notNull(),
  username: text("username").notNull(),
  userStatus: text("user_status").notNull(),
  userCreatedAt: text("user_created_at").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});
```

The repository `authSessionRepository`:
1. `saveSession(payload)`: Overwrite active session by purging previous rows first to guarantee single active session.
2. `getActiveSession()`: Retrieve current record.
3. `isSessionValid(session)`: Verify `new Date(session.expiresAt).getTime() > Date.now()`.
4. `clearSession()`: Wipe all rows from `auth_sessions`.

### Rationale
- Fully conforms to Constitution Principle III: Type-Safe Local Persistence with Drizzle ORM.
- Individual user profile fields avoid fragile JSON stringification/parsing.
- Calculating `expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()` enables simple comparisons across app launches.

---

## 3. Credential Persistence Strategy ("Remember Me")

### Context & Problem
Spec Revision 2 mandates:
> "Implement secure local storage (e.g., encrypted secure storage) to persist user credentials or session tokens when the 'Remember me' option is selected."
> "FR-021: When 'Remember me' is enabled, user credentials or session authentication tokens MUST be persisted in encrypted secure device storage."
> "SC-011: 100% of stored 'Remember me' credentials and tokens are kept strictly in encrypted secure storage, with 0 unencrypted plain text passwords stored in local SQLite or file system."
> "FR-024: If the user submits login credentials with 'Remember me' disabled, any previously saved credentials or biometric enrollment data in encrypted secure storage MUST be purged."

### Decision
Create `src/features/auth/services/secureStorageService.ts` utilizing `expo-secure-store`:
- Key `bcm_remember_me_credentials`: JSON string containing `{ username: string, password?: string, savedAt: string }`.
- Key `bcm_remember_me_enabled`: `"true"` | `"false"`.
- `saveCredentials(credentials: RememberedCredentials): Promise<void>`
- `getCredentials(): Promise<RememberedCredentials | null>`
- `clearCredentials(): Promise<void>`
- `isRememberMeEnabled(): Promise<boolean>`

### Rationale
- `expo-secure-store` encrypts values using the iOS Keychain services and Android Keystore (backed by `EncryptedSharedPreferences`).
- Passwords are NEVER written to SQLite, AsyncStorage, or plaintext files.
- When the user unchecks "Remember me" and logs in, `clearCredentials()` purges the Keychain/Keystore entry completely.

### Alternatives Considered
- *Storing in SQLite with application-level AES encryption*: Rejected because key management on mobile requires native keystore integration anyway; `expo-secure-store` is already the official Expo standard.
- *AsyncStorage*: Rejected because AsyncStorage values are stored unencrypted in plaintext XML/SQLite on disk, which is a major security vulnerability for passwords.

---

## 4. Biometric Fast-Login Strategy

### Context & Problem
Spec Revision 2 mandates:
> "Fast-Login Execution: Successful biometric verification automatically authenticates the user and logs them into the app without requiring manual password entry."
> "FR-022: When remembered credentials exist and supported biometric hardware is available, the application MUST support biometric verification to automatically authenticate and log in the user without manual password entry."
> "FR-023: If biometric authentication is unavailable, denied, failed, or cancelled, the application MUST allow the user to authenticate manually using standard username and password inputs."

### Decision
Create `src/features/auth/services/biometricService.ts` utilizing `expo-local-authentication`:
1. `isBiometricAvailable(): Promise<boolean>`: Checks both `hasHardwareAsync()` and `isEnrolledAsync()`.
2. `getBiometricType(): Promise<string>`: Identifies supported types (Fingerprint, Facial Recognition, or none).
3. `authenticateUser(promptMessage?: string): Promise<boolean>`: Executes `LocalAuthentication.authenticateAsync({ promptMessage: "Inicia sesión con biometría", fallbackLabel: "Usar contraseña" })`.
4. In `useAuthLifecycle.ts` / `useAuthStore.ts`:
   - On app launch, if there is no active SQLite session but "Remember Me" credentials exist in `secureStorageService`:
   - Pre-fill `usernameInput` with the remembered username.
   - If biometric hardware is available and enrolled, trigger `biometricService.authenticateUser()`.
   - If biometric verification returns `true`, automatically dispatch `authService.login()` with the stored credentials to establish a fresh session.
   - If verification returns `false` or is cancelled, do nothing: leave the form open for standard manual entry without any blocking alerts or exceptions.
   - Also provide a manual "Iniciar con biometría" button in `LoginView` when remembered credentials and biometrics are available.

### Rationale
- Provides a frictionless mobile experience conforming to SC-010 (< 2.0s fast-login).
- Completely resilient against hardware without biometrics, failed attempts, or user cancellations (SC-012).

---

## 5. Logout & Header Action Integration

### Context & Problem
Spec Revision 2 mandates:
> "Header Component Update: Locate the `ClubList` header component and add a logout button positioned on the left side."
> "Icon Integration: Use the standard power icon for the logout button."
> "Navigation & Redirection: Wire the logout action to trigger session destruction and smoothly navigate the user back to the login screen."
> "FR-017: The application header in the `ClubList` view MUST render a logout action button on the left side featuring a standard power icon."
> "FR-018: Triggering the logout button MUST invalidate the active session, clear stored session tokens and user state from local persistence, and immediately redirect the user to the Login view."

### Decision
1. In `src/page/ClubManage.tsx`, when rendering the main `ClubList` view (neither in `createMode`, nor `editingTeam`, nor viewing a specific `club`), set `headerBackAction` in `useMenuStore`:
   ```ts
   setHeaderBackAction({
     label: "Cerrar sesión",
     iconName: "power",
     iconFamily: "Feather",
     testID: "header-logout-button",
     onPress: async () => {
       await useAuthStore.getState().logout();
     },
   });
   ```
2. When transitioning away from the `ClubList` view (e.g. entering `createMode`, `editingTeam`, or selecting a club), reset `headerBackAction` to its standard back arrow or null.
3. In `useAuthStore.logout()`:
   - Call `authSessionRepository.clearSession()` (wiping SQLite `auth_sessions`).
   - Clear in-memory token, user profile, and errors.
   - Set `status = "unauthenticated"`.
   - In `App.tsx`, because `authStatus === "unauthenticated"`, React immediately renders `<LoginView />` and unmounts `<ClubManage />`. Back-navigation into protected screens is impossible.
   - Offline resilience: If network or any async call fails, the store still unconditionally wipes local session and in-memory auth state.

### Rationale
- `Header.tsx` already renders `headerBackAction` in the left header slot, rendering custom `iconFamily` and `iconName` with proper padding, touch target (40x40 min), accessibility labels, and `testID`.
- Zero invasive refactoring required across the rest of the application layout.

---

## 6. Jest Mocking Architecture

### Context & Problem
Jest runs in a `node` test environment. Native modules (`expo-secure-store`, `expo-local-authentication`) will fail if imported without mocks.

### Decision
1. Create `src/__tests__/mocks/expo-secure-store.js`:
   - In-memory `Map<string, string>` implementation supporting `setItemAsync`, `getItemAsync`, `deleteItemAsync`.
2. Create `src/__tests__/mocks/expo-local-authentication.js`:
   - Configurable mock functions for `hasHardwareAsync`, `isEnrolledAsync`, `authenticateAsync`.
3. Add mappings to `jest.config.js`:
   ```js
   "^expo-secure-store$": "<rootDir>/src/__tests__/mocks/expo-secure-store.js",
   "^expo-local-authentication$": "<rootDir>/src/__tests__/mocks/expo-local-authentication.js",
   ```

### Rationale
- Provides 100% test isolation and determinism in CI/CD without physical device requirements.
