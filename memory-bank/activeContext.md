# Active Context

**Current Focus:**
Feature 018 (Login View & Session Manager) implementation is completed. The application features a secure `LoginView` entry point, client-side input validation, API authentication with timeout and error handling, local SQLite session caching with Drizzle ORM (`auth_sessions`), automatic session bypass on cold start, stale/corrupted cache recovery, and centralized runtime configuration (`src/core/config/env.ts`).

**Recent Changes:**
- Created `.env` and `.env.example` templates and centralized environment configuration module `src/core/config/env.ts` (resolves `EXPO_PUBLIC_API_URI` and `API_URI` with trailing-slash sanitization).
- Implemented `auth_sessions` Drizzle ORM schema and SQLite DDL table initialization in `src/db/index.ts` and `src/db/schema.ts`.
- Implemented `authSessionRepository` with Drizzle ORM to save, fetch, validate, clear, and recover from corrupt/stale session rows.
- Implemented `authService` for POST `${env.API_URI}/auth/login` with 10s request timeout, `calculateExpiresAt`, and specific error classes (`AuthApiError`, `NetworkTimeoutError`).
- Implemented `useAuthStore` managing credentials, inline field validation, atomic submission state, API error alerts, and SQLite cache persistence.
- Implemented `LoginView` with masked password inputs, NativeWind styling, inline error text, and loading spinners.
- Implemented `useAuthLifecycle` and wired conditional routing into root `App.tsx` (bypasses login for valid sessions, shows `LoginView` for unauthenticated/expired users).
- 102 Jest test suites (609 tests) and TypeScript type checks passing with 100% success.

**Next Steps:**
- Validate on live mobile devices / Expo Go against backend auth endpoints.
- Proceed to future feature specifications.
