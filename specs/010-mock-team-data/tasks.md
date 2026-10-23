# Tasks: Mocked Basketball Team, Roster & Match Dataset

**Input**: Design documents from `/specs/010-mock-team-data/` (`spec.md`, `plan.md`, `data-model.md`, `research.md`, `contracts/`, `quickstart.md`)

**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, constitution.md

**Tests**: Non-negotiable per Constitution Principle I (TDD First). Unit and integration tests are required and must be written before implementation code.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Paths target mobile application structure: `src/`, `scripts/`, `src/__tests__/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, types, and module directory structure

- [X] T001 Define mock dataset and seeder TypeScript interfaces and types in src/types/mockData.ts
- [X] T002 [P] Create mock data directory structure at src/db/mock/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation logic and clean cascading cleanup required by all user stories

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

- [X] T003 Write unit tests for dataset validator in src/__tests__/db/mockDataValidator.test.ts
- [X] T004 Implement pure dataset validation functions (roster size, unique numbers, match counts, points reconciliation, valuation, fouls, DNP) in src/db/mock/mockDataValidator.ts
- [X] T005 [P] Implement cascading database cleanup function with foreign key safety in scripts/seed-db.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel or sequentially

---

## Phase 3: User Story 1 - Team Setup & 12+ Player Roster Initialization (Priority: P1) 🎯 MVP

**Goal**: Define and seed 1 basketball team ("CB Salliver", "Junior Celeste") and at least 12 distinct players with designated positions and unique jersey numbers.

**Independent Test**: Load team and roster view or run Jest tests asserting team metadata, >= 12 roster players, unique jersey numbers, and valid positions in dataset and seeded database.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Write unit tests for team and roster metadata, positions, and unique jersey numbers in src/__tests__/db/mockData.test.ts
- [X] T007 [P] [US1] Write integration tests for team and player insertion and retrieval in src/__tests__/db/seed.test.ts
- [X] T008 [US1] Define team entity and 12 unique player profiles with positions and numbers in src/db/mock/mockTeamData.ts
- [X] T009 [US1] Implement team and player insertion logic in scripts/seed-db.ts

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently (MVP ready!)

---

## Phase 4: User Story 2 - Complete 10-Match Schedule with Finished & Upcoming States (Priority: P1)

**Goal**: Define and seed a complete 10-match schedule (5 finished with past dates and scores, 5 pending with future dates and zeroed scores).

**Independent Test**: Navigate to schedule/matches view or run Jest tests verifying exactly 10 games associated with the team, 5 finished with past dates and scores, and 5 pending with future dates and valid format "DD/MM/YYYY - HH:MM".

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US2] Write unit tests for 10-match schedule distribution (5 finished, 5 pending) and date formatting in src/__tests__/db/mockData.test.ts
- [X] T011 [P] [US2] Write integration tests for match schedule seeding in src/__tests__/db/seed.test.ts

### Implementation for User Story 2

- [X] T012 [US2] Define 10 match fixtures (opponents, rounds, dates, quarter scores/fouls for finished and pending) in src/db/mock/mockTeamData.ts
- [X] T013 [US2] Implement match insertion and team linking logic in scripts/seed-db.ts

**Checkpoint**: At this point, User Stories 1 AND 2 are both functional and testable independently

---

## Phase 5: User Story 3 - Detailed Match Box Scores & Player Stat Reconciliation (Priority: P2)

**Goal**: Define and seed detailed player performance statistics (60 records) for the 5 finished games, perfectly reconciling points, fouls, valuation, and DNP states.

**Independent Test**: Select any completed match or run Jest tests asserting that sum of player points equals match total points for each finished game, valuation equals formula, DNP players have 0 stats, and all player stats reference valid team players.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T014 [P] [US3] Write unit tests for player box score points reconciliation, fouls, valuation, and DNP constraints in src/__tests__/db/mockData.test.ts
- [X] T015 [P] [US3] Write integration tests for player stats database seeding and foreign key linking in src/__tests__/db/seed.test.ts

### Implementation for User Story 3

- [X] T016 [US3] Define detailed player performance box scores for all 5 finished games (including 1 overtime game) in src/db/mock/mockTeamData.ts
- [X] T017 [US3] Implement player stats insertion logic resolving player numbers to player IDs in scripts/seed-db.ts

**Checkpoint**: User Stories 1, 2, and 3 are all independently functional with complete statistical reconciliation

---

## Phase 6: User Story 4 - Repeatable Mock Data Integration & Reset Capability (Priority: P2)

**Goal**: Provide an idempotent seeder function and script returning `SeedSummaryResult` and supporting clean reset without orphaned records or duplicate constraints.

**Independent Test**: Execute clear and seed operations twice consecutively and verify clean reset, exact summary counts (1 team, 12 players, 10 matches, 60 player stats), and no orphan records.

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T018 [P] [US4] Write integration tests for seeder idempotency, consecutive executions, and summary return values in src/__tests__/db/seed.test.ts

### Implementation for User Story 4

- [X] T019 [US4] Implement pre-seed validation and complete seed workflow returning SeedSummaryResult in scripts/seed-db.ts
- [X] T020 [US4] Re-export seeding and reset API conforming to SeederServiceContract in src/db/seed.ts

**Checkpoint**: Full repeatable seeder and reset engine operational and verified

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality verification, TypeScript checks, and documentation alignment

- [X] T021 [P] Run TypeScript type checks (tsc --noEmit) and linting across the codebase
- [X] T022 Execute full Jest test suite across src/__tests__/db/ and verify all mock data tests pass
- [X] T023 Run quickstart.md validation scenario via scripts/seed-db.ts and verify output summary

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (Phase 3) can start immediately after Phase 2
  - US2 (Phase 4) can proceed in parallel or immediately after US1
  - US3 (Phase 5) depends on US1 (roster definitions) and US2 (match fixtures)
  - US4 (Phase 6) integrates US1, US2, and US3 into the full repeatable seeding workflow
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on Foundational (Phase 2) - Can define fixtures independently of US1 players, but links to the seeded team
- **User Story 3 (P2)**: Depends on US1 (player jersey numbers) and US2 (finished match schedules) to map box scores
- **User Story 4 (P2)**: Depends on US1, US2, and US3 to execute the end-to-end seeder and reset

### Within Each User Story

- Tests MUST be written and fail before implementation code (Principle I: TDD First)
- Data definitions before database insertion scripts
- Core logic before cross-component integration
- Story complete and tested before checkpoint sign-off

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003 and T005 can run in parallel
- T006 and T007 can run in parallel
- T010 and T011 can run in parallel
- T014 and T015 can run in parallel
- T018 can run in parallel with earlier test prep
- T021 and T022 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch test creation for User Story 1 in parallel:
Task T006: "Write unit tests for team and roster metadata, positions, and unique jersey numbers in src/__tests__/db/mockData.test.ts"
Task T007: "Write integration tests for team and player insertion and retrieval in src/__tests__/db/seed.test.ts"
```

## Parallel Example: User Story 2

```bash
# Launch test creation for User Story 2 in parallel:
Task T010: "Write unit tests for 10-match schedule distribution (5 finished, 5 pending) and date formatting in src/__tests__/db/mockData.test.ts"
Task T011: "Write integration tests for match schedule seeding in src/__tests__/db/seed.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Types & Directories)
2. Complete Phase 2: Foundational (Validator & Clean Cleanup)
3. Complete Phase 3: User Story 1 (Team & 12 Players)
4. **STOP and VALIDATE**: Test User Story 1 independently in isolation
5. Demo roster screen and verify 12 players populate cleanly

### Incremental Delivery

1. Setup + Foundational → Solid base with mathematical and schema validation
2. User Story 1 → Team & 12 Players active (MVP!)
3. User Story 2 → 10 matches added to schedule (5 finished, 5 pending)
4. User Story 3 → 60 player stat box scores added with 100% points reconciliation
5. User Story 4 → Idempotent reset and seeding engine validated
6. Polish → Type checks, test suite verification, quickstart validation
