# Tasks: Login View, Session Manager, Logout & Biometric Fast-Login

**Input**: Design documents from `/specs/018-login-session-manager/` (`spec.md`, `plan.md`, `data-model.md`, `research.md`, `contracts/`, `quickstart.md`)

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per Constitution Principle I (Test-Driven Development First). All tests must be written first and fail (RED) before implementation (GREEN).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US6, US3, US4, US7, US5)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure: `src/` and `src/__tests__/` under repository root
- Centralized configuration: `src/core/config/`
- Feature encapsulation: `src/features/auth/`
- Root entry point: `./App.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency verification, and shared configuration infrastructure

- [ ] T001 Verify `expo-secure-store` and `expo-local-authentication` installations in `package.json`
- [ ] T002 [P] Configure environment template in `.env.example` and local `.env`
- [ ] T003 [P] Configure Jest mock mapping for `expo-secure-store` in `jest.config.js` and implement mock in `src/__tests__/mocks/expo-secure-store.js`
- [ ] T004 [P] Configure Jest mock mapping for `expo-local-authentication` in `jest.config.js` and implement mock in `src/__tests__/mocks/expo-local-authentication.js`
- [ ] T005 [P] Implement centralized typed environment configuration module in `src/core/config/env.ts` and verify unit tests in `src/core/config/__tests__/env.test.ts`
- [ ] T006 [P] Update domain and contract types for authentication, remembered credentials, and biometrics in `src/features/auth/types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core persistence, repository contracts, and store infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 [P] Define Drizzle ORM schema for `auth_sessions` table in `src/features/auth/db/schema.ts`
- [ ] T008 Register `auth_sessions` table DDL migration in `src/db/index.ts` and re-export schema in `src/db/schema.ts`
- [ ] T009 [P] Unit tests for `authSessionRepository` (CRUD, session validity, clear) in `src/features/auth/__tests__/db/authSessionRepository.test.ts`
- [ ] T010 Implement `authSessionRepository` (`saveSession`, `getActiveSession`, `isSessionValid`, `clearSession`) in `src/features/auth/db/authSessionRepository.ts`
- [ ] T011 [P] Define base `useAuthStore` Zustand store and initial state in `src/features/auth/store/useAuthStore.ts`
- [ ] T012 Define public barrel exports for auth feature in `src/features/auth/index.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Authentication & First-Launch Entry (Priority: P1) 🎯 MVP

**Goal**: Render LoginView as the initial application entry point, accept username and password, dispatch POST request to `${env.API_URI}/auth/login`, cache session payload in SQLite `auth_sessions`, and transition to main application (`ClubManage`).

**Independent Test**: Launch the app unauthenticated, verify LoginView is rendered as the initial screen, enter valid credentials, submit the form, verify 200 OK response payload is persisted to SQLite, and confirm transition to `ClubManage`.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Principle I: TDD)**

- [ ] T013 [P] [US1] Unit test for authentication API client in `src/features/auth/__tests__/services/authService.test.ts`
- [ ] T014 [P] [US1] Unit test for `useAuthStore` login action and session caching in `src/features/auth/__tests__/store/useAuthStore.test.ts`
- [ ] T015 [P] [US1] Component test for `LoginView` entry and form submission in `src/features/auth/__tests__/components/LoginView.test.tsx`

### Implementation for User Story 1

- [ ] T016 [US1] Implement `authService` API client calling `${env.API_URI}/auth/login` in `src/features/auth/services/authService.ts`
- [ ] T017 [US1] Implement `login` action in `src/features/auth/store/useAuthStore.ts`
- [ ] T018 [US1] Implement `LoginView` form UI with username, masked password, and submit trigger in `src/features/auth/components/LoginView.tsx`
- [ ] T019 [US1] Wire entry-point routing in `./App.tsx` to conditionally render `LoginView` when unauthenticated and `ClubManage` when authenticated

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently (MVP ready)

---

## Phase 4: User Story 2 - Automatic Session State Restoration on Launch (Priority: P1)

**Goal**: On application cold start, automatically inspect cached SQLite session and route authenticated users directly to `ClubManage` without displaying `LoginView`.

**Independent Test**: Seed a valid non-expired session into SQLite, mount app lifecycle, verify `checkSession()` validates cached token and renders `ClubManage` in < 1.5s without interactive login prompts.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Principle I: TDD)**

- [ ] T020 [P] [US2] Unit test for session check and state restoration in `src/features/auth/__tests__/store/useAuthStore.sessionCheck.test.ts`
- [ ] T021 [P] [US2] Integration test for cold launch session restoration in `src/features/auth/__tests__/hooks/useAuthLifecycle.test.ts`

### Implementation for User Story 2

- [ ] T022 [US2] Implement `checkSession` action in `src/features/auth/store/useAuthStore.ts`
- [ ] T023 [US2] Implement `useAuthLifecycle` hook in `src/features/auth/hooks/useAuthLifecycle.ts`
- [ ] T024 [US2] Wire `useAuthLifecycle` into `./App.tsx` to restore session state after database initialization

**Checkpoint**: At this point, User Story 2 automatically bypasses login when an active unexpired session is present

---

## Phase 5: User Story 6 - User-Initiated Logout from Club Management (Priority: P1)

**Goal**: Render a logout action button on the left side of the `ClubList` header with a power icon (`Feather` name `power`), purge SQLite session cache, clear in-memory auth state, and immediately redirect to `LoginView` while preventing back-navigation into protected screens.

**Independent Test**: Log in to reach `ClubList`, tap the power icon button on the left side of the header, verify SQLite session is purged, in-memory auth state resets, and application returns immediately to `LoginView` with back-navigation blocked.

### Tests for User Story 6

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Principle I: TDD)**

- [ ] T025 [P] [US6] Unit test for `logout` action in `src/features/auth/__tests__/store/useAuthStore.logout.test.ts`
- [ ] T026 [P] [US6] Component integration test for ClubList header logout button in `src/__tests__/components/ClubManage.logout.test.tsx`

### Implementation for User Story 6

- [ ] T027 [US6] Implement `logout` action in `src/features/auth/store/useAuthStore.ts` to purge SQLite session cache via `authSessionRepository.clearSession()` and reset store state
- [ ] T028 [US6] Wire left-side power icon action in `src/page/ClubManage.tsx` using `useMenuStore.setHeaderBackAction` to trigger `useAuthStore.getState().logout()`

**Checkpoint**: At this point, User Stories 1, 2, and 6 work together with full session lifecycle and secure teardown

---

## Phase 6: User Story 3 - Client-Side Credential Validation & Input Feedback (Priority: P2)

**Goal**: Perform client-side validation on username and password inputs, preventing network calls for empty or whitespace-only inputs within 200ms and clearing error indicators upon valid typing.

**Independent Test**: Attempt submission with empty username and password, verify inline validation error messages appear immediately with 0 network calls dispatched. Type valid input, verify error clears.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Principle I: TDD)**

- [ ] T029 [P] [US3] Unit test for credential validation logic in `src/features/auth/__tests__/services/validation.test.ts`
- [ ] T030 [P] [US3] Component test for inline validation feedback and error clearing in `src/features/auth/__tests__/components/LoginView.validation.test.tsx`

### Implementation for User Story 3

- [ ] T031 [US3] Implement `validateForm` and input change handlers in `src/features/auth/store/useAuthStore.ts`
- [ ] T032 [US3] Render validation error indicators and clear-on-change behavior in `src/features/auth/components/LoginView.tsx`

**Checkpoint**: User Story 3 prevents unnecessary network calls and provides instant user feedback

---

## Phase 7: User Story 4 - Session Expiration & Cache Miss Handling (Priority: P2)

**Goal**: Detect expired or corrupted SQLite sessions upon app launch, purge stale records, and route user safely to `LoginView`.

**Independent Test**: Seed an expired or corrupt session row, trigger `checkSession()`, verify stale row is deleted from SQLite and user is set to unauthenticated.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Principle I: TDD)**

- [ ] T033 [P] [US4] Unit test for expired session purge and corrupt record handling in `src/features/auth/__tests__/db/authSessionRepository.expiry.test.ts`
- [ ] T034 [P] [US4] Integration test for launch with expired cache in `src/features/auth/__tests__/hooks/useAuthLifecycle.expiry.test.ts`

### Implementation for User Story 4

- [ ] T035 [US4] Update `checkSession` in `src/features/auth/store/useAuthStore.ts` and `authSessionRepository.ts` to automatically purge expired records and transition to unauthenticated

**Checkpoint**: User Story 4 guarantees safe session invalidation when lifespan expires

---

## Phase 8: User Story 7 - "Remember Me" Credential Persistence & Biometric Fast-Login (Priority: P2)

**Goal**: Provide a "Remember me" toggle in LoginView, securely persisting credentials in encrypted hardware storage (`expo-secure-store`) when checked and purging when unchecked. When remembered credentials exist and biometric hardware is available, prompt or allow one-touch biometric verification to log in without manual password typing, with graceful fallback to manual entry on failure, cancellation, or device incompatibility.

**Independent Test**: Check "Remember me" toggle, submit valid credentials, verify credentials are saved in encrypted device storage. Open app on biometric-enabled device, verify biometric prompt triggers or is available, verify successful verification logs user in, and verify cancellation leaves manual form ready with non-blocking feedback.

### Tests for User Story 7

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Principle I: TDD)**

- [ ] T036 [P] [US7] Unit test for encrypted credential persistence in `src/features/auth/__tests__/services/secureStorageService.test.ts`
- [ ] T037 [P] [US7] Unit test for biometric capability detection and prompt handling in `src/features/auth/__tests__/services/biometricService.test.ts`
- [ ] T038 [P] [US7] Component test for "Remember me" toggle and Biometric trigger button in `src/features/auth/__tests__/components/LoginView.biometrics.test.tsx`
- [ ] T039 [P] [US7] Integration test for biometric fast-login and fallback in `src/features/auth/__tests__/hooks/useAuthLifecycle.biometrics.test.ts`

### Implementation for User Story 7

- [ ] T040 [US7] Implement `secureStorageService` using `expo-secure-store` in `src/features/auth/services/secureStorageService.ts`
- [ ] T041 [US7] Implement `biometricService` using `expo-local-authentication` in `src/features/auth/services/biometricService.ts`
- [ ] T042 [US7] Implement `setRememberMe`, `loginWithBiometrics`, and `initBiometricsAndRememberedUser` actions in `src/features/auth/store/useAuthStore.ts`
- [ ] T043 [US7] Add "Remember me" switch/checkbox and Biometric fast-login trigger button to `src/features/auth/components/LoginView.tsx`
- [ ] T044 [US7] Integrate biometric initialization and fast-login prompt in `src/features/auth/hooks/useAuthLifecycle.ts`

**Checkpoint**: User Story 7 delivers encrypted hardware persistence and biometric fast-login with zero crash or lockout risk

---

## Phase 9: User Story 5 - Authentication Error Handling & Feedback (Priority: P3)

**Goal**: Handle 401 Unauthorized, network failures, and server errors gracefully with clear user notifications and form retry capability.

**Independent Test**: Simulate 401 response and network timeout, verify informative error message displayed, loading spinner dismissed, and password ready for re-entry.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Principle I: TDD)**

- [ ] T045 [P] [US5] Unit test for API error mapping (401, 500, network offline) in `src/features/auth/__tests__/services/authService.errors.test.ts`
- [ ] T046 [P] [US5] Component test for error message display and retry behavior in `src/features/auth/__tests__/components/LoginView.errors.test.tsx`

### Implementation for User Story 5

- [ ] T047 [US5] Enhance error classification and user-friendly messages in `src/features/auth/services/authService.ts`
- [ ] T048 [US5] Implement dismissable error banners and retry states in `src/features/auth/components/LoginView.tsx`

**Checkpoint**: User Story 5 ensures resilience against network blips and bad credentials with clear user messages

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Documentation updates, quality assurance, and end-to-end scenario validation

- [ ] T049 [P] Update documentation in `memory-bank/activeContext.md` and `memory-bank/progress.md`
- [ ] T050 [P] Code cleanup, strict TypeScript verification (`npx tsc --noEmit`), and linting across `src/features/auth/`
- [ ] T051 Execute full test suite (`npm test`) and verify 100% passing tests across all test suites
- [ ] T052 Run and validate all scenarios from `specs/018-login-session-manager/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Recommended priority order: US1 (P1 - MVP) → US2 (P1) → US6 (P1) → US3 (P2) → US4 (P2) → US7 (P2) → US5 (P3)
  - Or parallel teams across independent stories
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (MVP)
- **User Story 2 (P1)**: Can start after US1 - restores sessions saved in US1
- **User Story 6 (P1)**: Can start after US1 - logs out from active session established in US1
- **User Story 3 (P2)**: Can start after US1 - adds client-side validation to LoginView
- **User Story 4 (P2)**: Depends on US2 - handles session expiry and cache miss on launch
- **User Story 7 (P2)**: Can start after US1 - integrates secure credential persistence and biometric fast-login
- **User Story 5 (P3)**: Can start after US1 - enhances API client & UI error presentation

### Parallel Opportunities

- All Setup tasks marked `[P]` (T002, T003, T004, T005, T006) can run in parallel
- Foundational tasks marked `[P]` (T007, T009, T011) can run in parallel
- All TDD test tasks within each story marked `[P]` can be written in parallel before implementation
- After Foundational phase completes, independent user stories (such as US1, US3, US7) can be developed in parallel by separate team streams

---

## Parallel Example: User Story 7

```bash
# Launch all test authoring for User Story 7 together:
Task: "Unit test for encrypted credential persistence in src/features/auth/__tests__/services/secureStorageService.test.ts"
Task: "Unit test for biometric capability detection and prompt handling in src/features/auth/__tests__/services/biometricService.test.ts"
Task: "Component test for 'Remember me' toggle and Biometric trigger button in src/features/auth/__tests__/components/LoginView.biometrics.test.tsx"
Task: "Integration test for biometric fast-login and fallback in src/features/auth/__tests__/hooks/useAuthLifecycle.biometrics.test.ts"

# Once tests are failing, proceed to implementation:
Task: "Implement secureStorageService using expo-secure-store in src/features/auth/services/secureStorageService.ts"
Task: "Implement biometricService using expo-local-authentication in src/features/auth/services/biometricService.ts"
Task: "Implement setRememberMe, loginWithBiometrics, and initBiometricsAndRememberedUser actions in src/features/auth/store/useAuthStore.ts"
Task: "Add 'Remember me' switch/checkbox and Biometric fast-login trigger button to src/features/auth/components/LoginView.tsx"
Task: "Integrate biometric initialization and fast-login prompt in src/features/auth/hooks/useAuthLifecycle.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001 - T006)
2. Complete Phase 2: Foundational (T007 - T012)
3. Complete Phase 3: User Story 1 (T013 - T019)
4. **STOP and VALIDATE**: Verify LoginView renders on initial open, submit valid credentials, verify SQLite session is saved, and verify transition to `ClubManage` (MVP delivered!)

### Incremental Delivery

1. Phase 1 & 2: Setup + Foundation ready
2. Phase 3 (US1 - P1): Core Login & SQLite session caching (MVP!)
3. Phase 4 (US2 - P1): Cold-start automatic session bypass
4. Phase 5 (US6 - P1): ClubList header logout & back-navigation prevention
5. Phase 6 (US3 - P2): Instant form input validation feedback
6. Phase 7 (US4 - P2): Stale/corrupt session auto-purging
7. Phase 8 (US7 - P2): "Remember Me" encrypted credential persistence & Biometric fast-login
8. Phase 9 (US5 - P3): Robust network and credential error handling
9. Phase 10: Final Polish, documentation, and quickstart end-to-end verification

---

## Notes

- Every task strictly follows the checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- TDD Red-Green-Refactor cycle enforced per Constitution Principle I
- All credentials stored for "Remember Me" reside strictly in encrypted device storage (`expo-secure-store`) conforming to SC-011 and SC-012
- Session cache stored in SQLite `auth_sessions` table via Drizzle ORM conforming to Principle III
- Header logout button placed on left side of `ClubList` header using Feather `power` icon conforming to FR-017
