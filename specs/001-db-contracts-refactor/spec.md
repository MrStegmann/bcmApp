# Feature Specification: Database & Contracts Refactor

**Feature Branch**: `001-db-contracts-refactor`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "Refactor: Database & Contracts - Goal: Your task is to refactor the Database connection and tables, creating a correct table relationship and structure based on the contracts. Analyze the actual status of the project before start and define the tables and contracts you found. Then migrate from JS to TS and make sure each import, use case and contracts are correctly implemented and no fetch errors happens."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Type-Safe Relational Persistence & Connection (Priority: P1)

As a team manager or coach using the application, I need a reliable, fully connected local database that enforces strict relational integrity between teams, players, games, player statistics, training sessions, training attendance, and team fees so that data is safely stored and never lost or corrupted.

**Why this priority**: Without a functional, type-safe database layer and defined schema relationships, all application screens fail to load, save, or update data.

**Independent Test**: Can be tested by initializing the database connection on mobile startup, executing seed and schema migrations, and verifying foreign key relational integrity across Teams, Players, Games, and Trainings without thrown exceptions.

**Acceptance Scenarios**:

1. **Given** an uninitialized or fresh mobile application startup, **When** the app opens, **Then** the database connection initializes cleanly, executes required migrations, and provides type-safe access across all entity models.
2. **Given** an existing Team record, **When** creating dependent records (Players, Games, Trainings, Fees), **Then** relational foreign keys enforce cascading integrity and prevent orphan records.

---

### User Story 2 - Complete JavaScript to TypeScript Contract Migration (Priority: P2)

As a developer maintaining the application, I need all data contracts, entity models, database controllers/stores, and hooks fully migrated from JavaScript to TypeScript so that data structures are compile-time verified and runtime fetch/property errors are eliminated.

**Why this priority**: JavaScript dynamic types currently lead to missing property errors, broken component imports, and unhandled data format mismatches across UI screens.

**Independent Test**: Can be tested by running strict TypeScript compiler checks (`tsc --noEmit`) to verify 0 type errors across all contracts, store definitions, database hooks, and component imports.

**Acceptance Scenarios**:

1. **Given** any component requesting player stats, game results, or training logs, **When** receiving database query results, **Then** TypeScript contracts guarantee exact property shape and prevent undefined access crashes.
2. **Given** any database write operation (insert/update/delete), **When** passing data payloads, **Then** compile-time type validation prevents invalid or missing fields.

---

### User Story 3 - Robust Component Data Flow & Zero Fetch Errors (Priority: P3)

As an app user navigating between Club Management, Roster, Game Results, Training Schedules, and Fee Calendars, I need all UI screens to fetch, render, and update data smoothly without blank screens, unhandled exceptions, or broken state hooks.

**Why this priority**: Seamless user experience depends on clean state management hooks and fault-tolerant data fetching when databases are empty or loading.

**Independent Test**: Can be tested by navigating through every screen in the app (Club Profile, Player List, Game List, Training List, Calendar), performing CRUD operations on each, and confirming zero unhandled runtime or fetch errors.

**Acceptance Scenarios**:

1. **Given** an empty database state, **When** navigating to any list or detail screen, **Then** the screen renders clean empty-state UI feedback without crashing.
2. **Given** a user adding or editing a player, game, or training session, **When** the submit action fires, **Then** local stores immediately reflect updated state and persist changes to SQLite.

---

### Edge Cases

- What happens when a parent entity (e.g., Team) is deleted while child entities (Players, Games, Trainings) exist? (Cascading deletes or foreign key constraints must handle this cleanly).
- How does the system handle corrupt, partial, or legacy schema data during startup migrations?
- What happens when calculating statistics (e.g., shooting percentages or PER valuation) for players with zero games or zero attempts? (Must return default 0 values rather than NaN/Infinity).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST establish a type-safe relational database connection utilizing Drizzle ORM and Expo SQLite.
- **FR-002**: System MUST define explicit foreign key relationships and schema definitions for Teams, Players, Games, PlayerStats, Trainings, TrainingPlayers, and Fees.
- **FR-003**: System MUST migrate all database configuration, schema definitions, entity models, DTOs, and hooks from JavaScript to strict TypeScript.
- **FR-004**: System MUST provide strongly typed state stores and database access hooks replacing legacy or missing provider imports.
- **FR-005**: System MUST ensure component data fetching handles loading states, empty query results, and edge case statistical calculations safely without runtime exceptions.
- **FR-006**: System MUST enforce cascade deletion rules for child entities dependent on parent Team and Player records.
- **FR-007**: System MUST provide type-safe utility functions for creating, updating, reading, and deleting records across all domain models.

### Key Entities

- **Team**: Represents a sports club/team. Attributes: id, name, created_at. Has many Players, Games, Trainings, and Fees.
- **Player**: Represents a roster athlete. Attributes: id, team_id, first_name, last_name, number, position, notes. Belongs to Team; Has many PlayerStats and TrainingPlayers.
- **Game**: Represents a scheduled or finished match. Attributes: id, team_id, opponent, date, round, quarter/extra scores (home and opponent). Belongs to Team; Has many PlayerStats.
- **PlayerStats**: Represents box score performance for a player in a specific game. Attributes: id, game_id, player_id, minutes, points, field goals (attempts/made for 1pt, 2pt, 3pt), offensive/defensive rebounds, assists, steals, turnovers, fouls, valuation. Belongs to Game and Player.
- **Training**: Represents a practice session. Attributes: id, team_id, training_number, date, warmups, exercises, cooldowns, explanations. Belongs to Team; Has many TrainingPlayers.
- **TrainingPlayer**: Represents player attendance and performance in a training session. Attributes: id, training_id, player_id, attended, notes. Belongs to Training and Player.
- **Fee**: Represents team/player fee tracking. Attributes: id, team_id, player_id, month, year, amount, status (paid/pending). Belongs to Team and Player.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of database models, contracts, stores, hooks, and connection code are fully typed and pass `tsc --noEmit` with zero errors.
- **SC-002**: Zero unhandled fetch, database, or undefined property errors across all 6 core UI views (Club Profile, Player List, Game List, Training List, Calendar, Club Manage).
- **SC-003**: All database operations (inserts, updates, deletes, queries) complete in under 50ms on mobile device runtime.
- **SC-004**: 100% test coverage for database CRUD operations and contract interfaces validated via Jest test suites.

## Assumptions

- Database operates locally on mobile devices using Expo SQLite.
- Existing legacy component UI designs and visual styles (NativeWind/Tailwind) remain preserved while backend database integration is refactored.
- Default relational cascade rules dictate that deleting a Team removes its associated roster, games, trainings, and fee records.
