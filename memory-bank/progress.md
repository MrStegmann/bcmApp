# Progress

**What Works:**
- React Native/Expo environment setup.
- Offline-first SQLite database initialization and connection via `DBProvider`.
- Core entity models and DTOs established for Teams, Players, Games, Trainings, and Fees.
- UI architecture with Tailwind CSS (NativeWind) and Zustand stores for alerts/menus.
- Main screen components (`src/page/`) for managing the club.
- Feature 007 (Play Match View):
  - Game Clock, Period Control & Isolated Period Scoring (User Story 1)
  - Half-Court Canvas, Stint Tracking & 2s Hold Stat Subtraction with Cascading Assist Deduction (User Story 2)
  - Team Management, Bench & Unrestricted Swap Mode (User Story 3)
  - Full-Width Rival Control Panel (User Story 4)
  - Bench Player Statistics Information Modal with `s/a (#%)` throw formatting (User Story 5)
  - Responsive Viewport Scaling & Compact Player Circles (`w-12 h-12`) (User Story 6)
  - Enlarged Score-Only Match Header without Team Names (User Story 7)
- Feature 018 (Login View, Session Manager, Logout & Biometric Fast-Login):
  - Centralized Environment Configuration (`.env`, `.env.example`, `src/core/config/env.ts`)
  - Local SQLite Session Persistence with Drizzle ORM (`auth_sessions`, `authSessionRepository`)
  - Authenticated API client with timeouts and custom errors (`authService`)
  - Predictable Auth State Management with Zustand (`useAuthStore`)
  - Primary Entry Point Screen with NativeWind styling (`LoginView`)
  - Automatic Cold Start Session Bypass & Stale/Corrupted Row Purging (`useAuthLifecycle`, `App.tsx`)
  - User-Initiated Logout with power icon on left of ClubList header (`ClubManage`, `useMenuStore`, `useAuthStore.logout`)
  - "Remember Me" Hardware-Encrypted Credential Persistence (`expo-secure-store`, `secureStorageService`)
  - Biometric Fast-Login with Fingerprint/FaceID and Graceful Fallback (`expo-local-authentication`, `biometricService`)
- Comprehensive unit and integration test coverage (115 passing test suites, 645 total tests, 100% passing).

**What's Left to Build:**
- TBD based on future feature requests and user feedback.
