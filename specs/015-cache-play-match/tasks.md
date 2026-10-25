# Tasks: Play Match Background Caching

**Input**: Design documents from `specs/015-cache-play-match/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`)  
**Constitution Reference**: `.specify/memory/constitution.md` (Principle I: TDD Non-Negotiable, Principle II: Feature-Based Architecture, Principle III: Drizzle + SQLite)

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story identifier (`[US1]`, `[US2]`, `[US3]`, `[US4]`) for traceability
- Exact file paths included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create feature folder structure and declare shared TypeScript types for match caching.

- [X] T001 Create directory structure for play-match caching in `src/features/play-match/db/`, `src/features/play-match/services/`, `src/features/play-match/utils/`, and `src/features/play-match/__tests__/`
- [X] T002 Define `CachedMatchPayload` interface and cache contracts in `src/features/play-match/types/cache.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database schema, Drizzle repository, and payload validator that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

> **NOTE: Write test suites FIRST, ensure they FAIL before implementation**

- [X] T003 [P] Define `match_cache` Drizzle schema in `src/features/play-match/db/schema.ts`
- [X] T004 [P] Register `match_cache` schema in `src/db/schema.ts` and add `CREATE TABLE IF NOT EXISTS match_cache` in `src/db/index.ts`
- [X] T005 [P] Unit test suite for `matchCacheRepository` operations (get, save, remove) in `src/features/play-match/__tests__/db/matchCacheRepository.test.ts`
- [X] T006 Implement `matchCacheRepository` with getCache, saveCache, and removeCache in `src/features/play-match/db/matchCacheRepository.ts`
- [X] T007 [P] Unit test suite for structural validation and type guards in `src/features/play-match/__tests__/utils/cacheValidation.test.ts`
- [X] T008 Implement `validateMatchCachePayload` type guard and schema validation logic in `src/features/play-match/utils/cacheValidation.ts`

**Checkpoint**: Foundation ready — database persistence and schema validation tested and operational.

---

## Phase 3: User Story 1 - Silent Background Preservation of Live Match State (Priority: P1) 🎯 MVP

**Goal**: Continuously persist live in-progress match state (points, fouls, substitutions, running timer, periods) silently in the background with an 800ms debounce and zero UI thread interruption.

**Independent Test**: Start an active match session, record a sequence of scores, fouls, and substitutions, immediately terminate or unmount the view, and verify that `match_cache` contains the complete up-to-date state without any visual save indicators ever appearing.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US1] Unit test for store snapshot export action in `src/features/play-match/__tests__/store/usePlayMatchStore.snapshot.test.ts`
- [X] T011 [P] [US1] Unit tests for debounced (800ms) and immediate background sync in `src/features/play-match/__tests__/services/matchCacheService.save.test.ts`

### Implementation for User Story 1

- [X] T010 [US1] Implement `exportSnapshot` state export action in `src/features/play-match/store/usePlayMatchStore.ts`
- [X] T012 [US1] Implement `saveSession` with 800ms debounced trailing sync and immediate flush options in `src/features/play-match/services/matchCacheService.ts`
- [X] T013 [US1] Integrate silent background sync subscriber and AppState backgrounding flush in `src/features/play-match/PlayMatch.tsx`

**Checkpoint**: User Story 1 functional — match events silently persist in SQLite during active gameplay with zero UI lag.

---

## Phase 4: User Story 2 - Seamless Crash and Session Recovery (Priority: P1)

**Goal**: Automatically detect and rehydrate cached match sessions upon launching or mounting the Play Match view with the timer safely paused, allowing scorekeepers to resume tracking without data loss.

**Independent Test**: Populate `match_cache` with a mid-game state (Q2, specific points and fouls), mount `PlayMatch.tsx`, and verify that scores, roster stats, active lineups, and quarters immediately reflect the saved session with the timer paused.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T014 [P] [US2] Unit tests for store rehydration and paused clock enforcement in `src/features/play-match/__tests__/store/usePlayMatchStore.rehydration.test.ts`
- [X] T016 [P] [US2] Unit tests for session loading and staleness evaluation in `src/features/play-match/__tests__/services/matchCacheService.load.test.ts`

### Implementation for User Story 2

- [X] T015 [US2] Implement `hydrateFromCache` action (enforcing `isTimerRunning = false`) in `src/features/play-match/store/usePlayMatchStore.ts`
- [X] T017 [US2] Implement `loadSession` and `isCacheStale` detection logic in `src/features/play-match/services/matchCacheService.ts`
- [X] T018 [US2] Integrate mount cache detection, rehydration, and stale session resume/restart confirmation dialog in `src/features/play-match/PlayMatch.tsx`

**Checkpoint**: User Stories 1 AND 2 functional — match state silently saves and completely recovers after crash/termination.

---

## Phase 5: User Story 3 - Automatic Cache Purging on Match Finalization (Priority: P2)

**Goal**: Permanently erase temporary match cache records from SQLite whenever a match is concluded via "Save & Finish" or when the user explicitly cancels/discards an ongoing session.

**Independent Test**: Rehydrate or play an active match with a cache record, trigger "Finalizar" (Save & Finish), and verify that SQLite `match_cache` has 0 rows for the match ID and subsequent entries start with a clean slate.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T019 [P] [US3] Unit tests for cache purging on match completion and session discard in `src/features/play-match/__tests__/services/matchCacheService.purge.test.ts`

### Implementation for User Story 3

- [X] T020 [US3] Implement `purgeSession` in `src/features/play-match/services/matchCacheService.ts`
- [X] T021 [US3] Update `handleFinishMatch` in `src/features/play-match/PlayMatch.tsx` to purge cache after permanent stats commitment
- [X] T022 [US3] Add discard/reset confirmation action in `src/features/play-match/PlayMatch.tsx` to purge cache and reset the match cleanly

**Checkpoint**: User Stories 1, 2, AND 3 functional — storage hygiene maintained and cache purged upon match finalization or discard.

---

## Phase 6: User Story 4 - Resilient Fallback on Corrupted or Incompatible Session Cache (Priority: P3)

**Goal**: Safely intercept corrupted, truncated, or incompatible cached payloads, purge damaged entries, and fall back to fresh match initialization without crashing the application.

**Independent Test**: Inject a malformed or corrupted JSON payload into `match_cache`, mount `PlayMatch.tsx`, and confirm that the view gracefully initializes fresh from the database roster, purges the damaged record, and logs a silent warning without throwing an unhandled exception.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T023 [P] [US4] Unit tests for corrupted JSON detection, schema version mismatches, and auto-purge in `src/features/play-match/__tests__/services/matchCacheService.corruption.test.ts`
- [X] T025 [P] [US4] Integration test verifying corrupted cache recovery in `src/features/play-match/__tests__/PlayMatch.cacheRecovery.test.tsx`

### Implementation for User Story 4

- [X] T024 [US4] Implement corrupted cache purging and silent warning logging within `loadSession` in `src/features/play-match/services/matchCacheService.ts`

**Checkpoint**: All user stories functional — robust recovery against corrupted or stale state with zero crash risk.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Module exports, full test suite validation, type checking, and quickstart verification.

- [X] T026 [P] Export cache public API (service, repository, types, validation) from `src/features/play-match/index.ts`
- [X] T027 [P] Run TypeScript strict type verification across the project using `npx tsc --noEmit`
- [X] T028 Execute full test suite (`npm test -- --testPathPattern="cache|PlayMatch"`) and validate scenarios from `specs/015-cache-play-match/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
      │
      ▼
Phase 2: Foundational (BLOCKING)
      │
      ├───────────────────────┬───────────────────────┐
      ▼                       ▼                       ▼
Phase 3: US1 (P1)       Phase 4: US2 (P1)       Phase 5: US3 (P2)
      │                       │                       │
      └───────────────────────┼───────────────────────┘
                              ▼
                        Phase 6: US4 (P3)
                              │
                              ▼
                        Phase 7: Polish
```

- **Setup (Phase 1)**: No dependencies — initialize types and folders.
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and US1 snapshot structure.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and US1/US2 lifecycle hooks.
- **User Story 4 (Phase 6)**: Depends on Foundational validation and US2 load flow.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent after Foundational. Provides `exportSnapshot` and background debounce.
- **User Story 2 (P1)**: Independent after Foundational; consumes payload produced by US1 to rehydrate store.
- **User Story 3 (P2)**: Independent after Foundational; purges cache created in US1 on finalization.
- **User Story 4 (P3)**: Hardens `loadSession` from US2 with corruption checks and graceful fallbacks.

### Within Each User Story

- **TDD Mandate**: Unit tests MUST be written and confirmed failing before implementation code.
- Types & interfaces before database operations.
- Repositories before services.
- Services before UI component hooks.
- Story complete and verified before advancing to next priority.

---

## Parallel Execution Examples

### User Story 1 Parallel Stream

```bash
# Launch test tasks in parallel:
Task: T009 [P] [US1] Unit test for store snapshot export action in src/features/play-match/__tests__/store/usePlayMatchStore.snapshot.test.ts
Task: T011 [P] [US1] Unit tests for debounced (800ms) and immediate background sync in src/features/play-match/__tests__/services/matchCacheService.save.test.ts
```

### User Story 2 Parallel Stream

```bash
# Launch test tasks in parallel:
Task: T014 [P] [US2] Unit tests for store rehydration and paused clock enforcement in src/features/play-match/__tests__/store/usePlayMatchStore.rehydration.test.ts
Task: T016 [P] [US2] Unit tests for session loading and staleness evaluation in src/features/play-match/__tests__/services/matchCacheService.load.test.ts
```

### Foundational Parallel Stream

```bash
# Launch foundational tasks in parallel:
Task: T003 [P] Define match_cache Drizzle schema in src/features/play-match/db/schema.ts
Task: T004 [P] Register match_cache schema in src/db/schema.ts and add CREATE TABLE in src/db/index.ts
Task: T005 [P] Unit test suite for matchCacheRepository operations in src/features/play-match/__tests__/db/matchCacheRepository.test.ts
Task: T007 [P] Unit test suite for structural validation in src/features/play-match/__tests__/utils/cacheValidation.test.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1: Setup** (folders and types).
2. Complete **Phase 2: Foundational** (schema, Drizzle repository, validation).
3. Complete **Phase 3: User Story 1** (store snapshot, debounced service, silent background persistence).
4. **STOP and VALIDATE**: Verify that live game events are saved to SQLite in the background without UI stutter.
5. Deploy/Demo initial MVP resilience.

### Incremental Delivery

1. **Sprint 1 (MVP)**: Setup + Foundational + User Story 1 → Silent background persistence operational.
2. **Sprint 2**: User Story 2 → Crash recovery and automatic session rehydration operational.
3. **Sprint 3**: User Story 3 → Cache purge on match finalization ("Finalizar") and session discard.
4. **Sprint 4**: User Story 4 + Polish → Corruption resilience, versioning fallbacks, and quickstart sign-off.
