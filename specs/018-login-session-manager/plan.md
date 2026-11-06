# Implementation Plan: Login View & Session Manager

**Branch**: `018-login-session-manager` | **Date**: 2026-11-06 | **Spec**: [specs/018-login-session-manager/spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/018-login-session-manager/spec.md)

**Input**: Feature specification from `/specs/018-login-session-manager/spec.md` (including Revision 1: Environment Configuration and Revision 2: Logout, Credential Persistence & Biometric Fast-Login)

## Summary

Implement the complete authentication and session management lifecycle for BasketApp:
1. **Entry Point & Login**: Provide a secure `LoginView` page as the default entry point for unauthenticated users, with client-side credential validation (`username`, masked `password`), visual feedback, and submission to `${env.API_URI}/auth/login` resolved via a centralized typed configuration module (`src/core/config/env.ts`).
2. **Local Session Cache**: Persist valid session tokens, validity windows, and user profiles to SQLite (`auth_sessions`) using Drizzle ORM and Expo SQLite. On cold start, check cache validity to bypass the login screen or purge expired/corrupted sessions.
3. **Session Termination (Logout)**: Add a power icon logout button to the left side of the `ClubList` / `ClubManage` header. Triggering logout purges the SQLite session cache, resets in-memory authentication states in `useAuthStore`, and immediately redirects the user to `LoginView` while preventing back-navigation into protected screens.
4. **"Remember Me" & Encrypted Credential Persistence**: Add a "Remember me" toggle to `LoginView`. When enabled, user credentials/tokens are stored strictly in hardware-backed encrypted device storage (`expo-secure-store`). When disabled upon login, previously stored credentials are wiped.
5. **Biometric Fast-Login**: Integrate `expo-local-authentication` to detect hardware sensors and user enrollment. When remembered credentials exist, offer biometric verification (fingerprint / facial recognition) to fast-login directly into the application, with seamless fallback to manual entry on cancellation, failure, or device incompatibility.

## Technical Context

**Language/Version**: TypeScript ~6.0.3, Strict Mode enabled (`noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`).  
**Primary Dependencies**: React 19.2.3, React Native 0.86.3, Expo SDK ~57.0.31, Zustand ^5.0.8, Drizzle ORM ^0.45.3, `expo-sqlite` ~57.0.4, `expo-secure-store` ~57.0.4, `expo-local-authentication` ~57.0.3, NativeWind ^4.2.1, `@expo/vector-icons` ^15.0.2 (`Feather`).  
**Storage**:
- *Session Token Cache*: Local SQLite (`bcmapp.db`) via `drizzle-orm/expo-sqlite`, `auth_sessions` table with WAL mode and strict typing.
- *Encrypted Credential Persistence*: `expo-secure-store` for hardware-backed keychain/keystore encryption for "Remember Me" credentials. Plaintext passwords in SQLite or raw files are strictly prohibited.
**Configuration & Environment**: Centralized typed configuration module in `src/core/config/env.ts` with `EXPO_PUBLIC_API_URI` and `API_URI` support, stripping trailing slashes and providing safe local development fallback (`http://localhost:3000` or `http://10.0.2.2:8080/api/v1`).  
**Testing**: Jest ^29.7.0 with Node environment, custom Expo SQLite mocks, and new mocks for `expo-secure-store` and `expo-local-authentication`.  
**Target Platform**: Mobile (iOS & Android via Expo).  
**Performance Goals**: Cold launch session check < 1.5s; form validation feedback < 200ms; transition to main app < 1.0s after API response delivery; logout execution and redirect < 500ms; biometric fast-login < 2.0s.  
**Constraints**:
- `LoginView` must be the default entry point when unauthenticated.
- Passwords masked with `secureTextEntry` and never stored in unencrypted storage.
- Automatic session bypass on valid cache; stale/corrupt session purging.
- 100% of external auth requests resolve endpoint from centralized environment configuration module.
- Logout button rendered with power icon on left of ClubList header slot.
- Biometric failures or cancellations must never crash the app or lock out the user.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Conformance | Status |
|---|---|---|---|
| **I. Test-Driven Development First** | Tests written before implementation code using Jest & RNTL | Dedicated unit and integration test suites for `env.ts`, `authSessionRepository`, `authService`, `secureStorageService`, `biometricService`, `useAuthStore`, `useAuthLifecycle`, `LoginView`, and `ClubList` logout header button written before code implementation | **PASSED** |
| **II. Feature-Based Architecture** | Encapsulated in `src/features/<feature>/`; shared config in `src/core/` | All auth components, services, repository, store, hooks, and schemas co-located in `src/features/auth/` with public exports via `index.ts`; shared configuration in `src/core/config/env.ts`; header logout integration wired cleanly through `MenuStore` or `ClubManage` | **PASSED** |
| **III. Type-Safe Persistence** | Drizzle ORM + Expo SQLite, explicit FKs, WAL mode | `auth_sessions` table defined with Drizzle `sqliteTable`, typed `$inferSelect`/`$inferInsert`, table creation in `initDatabase()`; encrypted keychain storage for credentials via typed wrapper | **PASSED** |
| **IV. Predictable State** | Focused Zustand stores, immutable updates | `useAuthStore` manages form inputs, auth status, session credentials, rememberMe flag, biometric status, and user profile with predictable atomic actions | **PASSED** |
| **V. Utility-First Styling** | NativeWind utility classes via `className` | All login screen styling, remember-me toggle, biometric triggers, and header action buttons built with NativeWind utility classes conforming to theme tokens | **PASSED** |
| **VI. Strict TypeScript** | Strict typing, no `any`, runtime validation | Complete TypeScript interfaces for `EnvConfig`, `LoginRequestBody`, `LoginSuccessResponse`, `CachedSessionPayload`, `RememberedCredentials`, and repository/service contracts | **PASSED** |

## Project Structure

### Documentation (this feature)

```text
specs/018-login-session-manager/
├── plan.md              # Implementation Plan (this document)
├── research.md          # Phase 0: Storage, debounce, API client, secure storage, biometrics, logout, and validation research
├── data-model.md        # Phase 1: Database schema, domain payload model, env config model, secure credentials model, and lifecycle transitions
├── contracts/           # Phase 1: Service, env config, repository, secure storage, and biometric contracts
│   ├── env-config.contract.ts
│   ├── auth-api.contract.ts
│   ├── auth-repository.contract.ts
│   ├── secure-storage.contract.ts
│   ├── biometric.contract.ts
│   └── auth-store.contract.ts
├── quickstart.md        # Phase 1: End-to-end runnable validation scenarios (including logout, remember me, & biometrics)
└── tasks.md             # Phase 2: Actionable tasks breakdown (generated by /speckit-tasks)
```

### Source Code (repository layout)

```text
.env                                     # Local environment configuration file
.env.example                             # Template environment file tracked in VCS
src/
├── core/
│   └── config/
│       ├── env.ts                       # Centralized typed environment configuration reader and exports
│       └── __tests__/
│           └── env.test.ts              # Unit tests for environment variable resolution and fallbacks
├── db/
│   ├── index.ts                         # Ensure auth_sessions table creation in initDatabase()
│   └── schema.ts                        # Re-export auth schema from features/auth
├── components/
│   ├── Header.tsx                       # Standard application header supporting left action button
│   └── ClubList.tsx                     # Team list with logout action hook or left header integration
├── page/
│   └── ClubManage.tsx                   # Sets headerBackAction / left action to power logout when viewing ClubList
├── App.tsx                              # Route dynamically between LoginView and ClubManage based on auth status
├── __tests__/
│   └── mocks/
│       ├── expo-secure-store.js         # In-memory mock for Jest test suite
│       └── expo-local-authentication.js # Biometric mock for Jest test suite
└── features/
    └── auth/
        ├── components/
        │   └── LoginView.tsx            # Main login screen with validated inputs, Remember Me toggle, and Biometric trigger
        ├── db/
        │   ├── schema.ts                # Drizzle sqliteTable definition for auth_sessions
        │   └── authSessionRepository.ts # Type-safe Drizzle repository (save, getActive, clear, isValid)
        ├── services/
        │   ├── authService.ts           # API client consuming env.API_URI for /auth/login and expiry calculation
        │   ├── secureStorageService.ts  # expo-secure-store wrapper for encrypted credential persistence
        │   └── biometricService.ts      # expo-local-authentication wrapper for biometric prompts
        ├── store/
        │   └── useAuthStore.ts          # Zustand store for credentials, rememberMe, authStatus, user profile, and actions
        ├── hooks/
        │   └── useAuthLifecycle.ts      # Lifecycle hook for session check and biometric prompt on app launch
        ├── types.ts                     # TypeScript domain models and DTO interfaces
        ├── index.ts                     # Public barrel exports for auth feature
        └── __tests__/
            ├── components/
            │   └── LoginView.test.tsx   # Form validation, Remember Me toggle, and UI interaction tests
            ├── db/
            │   └── authSessionRepository.test.ts # SQLite storage, retrieval, purge, and corruption tests
            ├── services/
            │   ├── authService.test.ts          # Network requests, timeouts, and error response tests
            │   ├── secureStorageService.test.ts # Encrypted storage save, get, and wipe tests
            │   └── biometricService.test.ts     # Biometric verification and fallback tests
            ├── store/
            │   └── useAuthStore.test.ts # Zustand actions, login, logout, rememberMe, and session transitions
            └── hooks/
                └── useAuthLifecycle.test.ts # Session check and fast-login on mount
```

**Structure Decision**: Fully encapsulated within `src/features/auth/` conforming to Principle II. Centralized environment configuration placed in `src/core/config/env.ts` as shared infrastructure. Low-level database operations reside in `src/features/auth/db/`, hardware-backed encrypted storage and biometric services in `src/features/auth/services/`, state management in `src/features/auth/store/`, UI components in `src/features/auth/components/`, and public access via `src/features/auth/index.ts`. Left-aligned logout action in `ClubList` view is wired to `ClubManage.tsx` / `MenuStore` with a power icon (`Feather` name `power`), invoking `authStore.logout()` to immediately clear session state and transition to `LoginView`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *None* | No constitutional violations; fully conforms to principles. | N/A |
