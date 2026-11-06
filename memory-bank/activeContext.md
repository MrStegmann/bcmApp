# Active Context

**Current Focus:**
Feature 018 (Login View, Session Manager, Logout & Biometric Fast-Login) implementation is fully completed. The application provides:
1. Secure `LoginView` entry point with client-side credential validation, instant input feedback, masked passwords, and centralized environment endpoint resolution (`src/core/config/env.ts`).
2. Local SQLite session caching using Drizzle ORM (`auth_sessions`), automatic session bypass on cold start (< 1.5s), and automatic stale/corrupt session purging.
3. User-initiated logout button with a power icon (`Feather` name `power`) placed on the left side of the `ClubList` / `ClubManage` header, purging the SQLite session cache and in-memory state and immediately redirecting to `LoginView` (< 500ms) with back-navigation blocked.
4. "Remember Me" credential persistence strictly inside hardware-backed encrypted device storage (`expo-secure-store`), with automatic cleanup upon unchecking.
5. Biometric fast-login (`expo-local-authentication`) for one-touch login with remembered credentials, featuring robust fallback to manual form entry on failure or cancellation without crash or user lockout.

**Recent Changes:**
- Configured Jest mocks and mappings for `expo-secure-store` and `expo-local-authentication` in `jest.config.js`.
- Implemented `src/core/config/env.ts` with sanitized endpoints and safe default development fallback (`http://localhost:3000`).
- Implemented `secureStorageService` (`src/features/auth/services/secureStorageService.ts`) for encrypted credential persistence and status tracking.
- Implemented `biometricService` (`src/features/auth/services/biometricService.ts`) wrapping `expo-local-authentication` for sensor detection and biometric prompts.
- Updated `useAuthStore` with `rememberMe`, `isBiometricAvailable`, `setRememberMe`, `loginWithBiometrics`, `initBiometricsAndRememberedUser`, and robust `logout()`.
- Updated `LoginView` with "Recordar credenciales" toggle, "Iniciar con biometría" fast-login button, and dismissable error alert banners.
- Updated `src/page/ClubManage.tsx` to set `headerBackAction` with `testID: "header-logout-button"`, Feather `power` icon, and logout handler on the main team list view.
- 115 Jest test suites (645 tests) and strict TypeScript checks (`npx tsc --noEmit`) passing with 100% success.

**Next Steps:**
- Validate on live mobile devices / Expo Go against backend auth endpoints.
- Ready for production build or subsequent feature specifications.
