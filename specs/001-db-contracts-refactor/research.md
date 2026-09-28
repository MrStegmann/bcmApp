# Research & Decision Log: Database & Contracts Refactor

## Technical Decisions

### Decision 1: Persistence Engine — Drizzle ORM + Expo SQLite (`expo-sqlite`)

- **Decision**: Standardize on `drizzle-orm/expo-sqlite` with `expo-sqlite` (`openDatabaseAsync`) as the single local persistence layer.
- **Rationale**: Direct compliance with Constitution Principle III. Drizzle ORM provides zero-overhead, compile-time type safety via `$inferSelect` and `$inferInsert` without heavy reflection runtime overhead.
- **Alternatives Considered**:
  - *TypeORM*: Previously present in `package.json` dependencies but requires complex Babel decorator plugins, heavier runtime reflection, and unreliable Expo SDK 57 compatibility.
  - *Raw SQLite queries*: Lacks type safety, leads to runtime SQL syntax and column mismatch errors.

---

### Decision 2: State Management & Data Hook Architecture — Zustand Stores

- **Decision**: Replace the legacy `DBProvider` context pattern with domain-focused **Zustand** stores (`useTeamStore`, `usePlayerStore`, `useGameStore`, `useTrainingStore`, `useFeeStore`, `useMenuStore`) paired with a custom `useDB` hook wrapper.
- **Rationale**: Direct compliance with Constitution Principle IV. Zustand stores are lightweight, provide atomic UI re-renders, and allow testing business logic in Jest without wrapping tests in React Context providers.
- **Alternatives Considered**:
  - *React Context API (`DBProvider`)*: Harder to test in isolation, causes full-tree re-renders on state changes, harder to type cleanly across multi-screen flows.

---

### Decision 3: Relational Schema Design & Foreign Key Cascading

- **Decision**: Configure Drizzle SQLite schema with explicit `foreignKey()` relationships and `onDelete: 'cascade'`. Execute `PRAGMA foreign_keys = ON;` and `PRAGMA journal_mode = WAL;` immediately after SQLite connection initialization.
- **Rationale**: Guarantees relational integrity. Deleting a Team automatically cleans up associated Players, Games, Trainings, and Fees, preventing orphaned rows in local mobile storage.
- **Alternatives Considered**:
  - *Manual multi-table delete queries*: Prone to race conditions, partial failure states, and maintenance overhead.

---

### Decision 4: Contract Migration Strategy (JS to TS)

- **Decision**: Convert all database configuration, schemas, entity models, DTOs, controllers, and store definitions to strict `.ts` files under `src/db/`, `src/types/`, `src/store/`, and `src/hooks/`.
- **Rationale**: Eliminates runtime property access crashes (`undefined is not an object`), enforces contract compatibility at build time (`tsc --noEmit`), complying with Constitution Principle VI.
- **Alternatives Considered**:
  - *Gradual JSDoc type annotations*: Does not enforce strict compiler checks or catch missing import errors.

---

### Decision 5: Test-Driven Development (TDD) Strategy with Jest

- **Decision**: Create mock database helpers and unit test suites under `src/__tests__/` or co-located with features to test Drizzle schema models, Zustand store actions, and data calculation helpers before implementing UI integration.
- **Rationale**: Mandatory compliance with Constitution Principle I (TDD First).
- **Alternatives Considered**:
  - *Manual UI testing only*: Violates Constitution and risks regression bugs on mobile runtime.
