# Research: Remove Training Session

**Feature Branch**: `008-remove-training-session`  
**Date**: 2026-10-22  
**Status**: Completed  

---

## 1. Database Schema Deletion & Upgrade Migration Strategy

### Decision
- Remove `trainings` and `training_players` table schemas and relations from `src/db/schema.ts`.
- Remove foreign key relations referencing trainings from `teamsRelations` (`many(trainings)`) and `playersRelations` (`many(trainingPlayers)`).
- In `initDatabase()` (`src/db/index.ts`), remove `CREATE TABLE IF NOT EXISTS trainings` and `CREATE TABLE IF NOT EXISTS training_players`.
- Add automatic sanitization execution in `initDatabase()`:
  ```ts
  sqliteDb.execSync(`
    DROP TABLE IF EXISTS training_players;
    DROP TABLE IF EXISTS trainings;
  `);
  ```

### Rationale
- Guarantees that existing installations upgrading to this version immediately and permanently purge the obsolete SQLite tables and all stored rows (FR-004, SC-002).
- Child table (`training_players`) is dropped before parent table (`trainings`) to strictly respect SQLite foreign key constraints (`PRAGMA foreign_keys = ON;`).
- Retains existing teams, players, games, and player stats intact with zero cascade disruption or dangling foreign key constraints.

### Alternatives Considered
- **Keep empty tables in SQLite**: Rejected because FR-004 and User Story 2 demand complete data purge, storage reclamation, and zero orphan structures.
- **Standalone Drizzle Kit CLI migration**: Mobile runtime uses Expo SQLite with in-code initialization (`initDatabase()` in `src/db/index.ts`). Explicit `DROP TABLE IF EXISTS` ensures instant execution on first launch across all mobile devices without requiring offline CLI migrations.

---

## 2. Store Layer & Data Access Cleanup

### Decision
- Permanently delete `src/store/TrainingStore.ts`.
- Remove `TrainingState` interface from `src/types/store.ts`.
- Remove `TrainingController`, `TraningPlayersController`, and `TrainingPlayersController` from `src/hooks/useDB.ts`.
- Remove `useTrainingStore` imports and state access from all hooks and components.

### Rationale
- Completely removes state management overhead, observers, and memory allocation associated with training sessions (FR-006, User Story 3).
- Eliminates redundant controllers and legacy misspelled properties (`TraningPlayersController`).

### Alternatives Considered
- **Stub / No-op controllers in useDB**: Rejected because leaving dead stub methods violates Constitution Principle VI (Strict TypeScript) and leads to dead code rot. Spec strictly dictates: "No reference, or orphan data of the training session shall be in the application".

---

## 3. UI Component & Navigation Elimination

### Decision
- Permanently delete:
  - `src/page/TrainingList.tsx`
  - `src/components/TraningCards.tsx`
  - `src/components/TrainingDetail.tsx`
  - `src/components/TrainingForm.tsx`
  - `src/components/TrainingPlayer.tsx`
  - `src/test/trainings.js`
- In `src/page/ClubProfile.tsx`:
  - Remove `import TrainingList from "./TrainingList";`.
  - Remove `TopMenuEnums.TRAININGS` tab button from the bottom navigation array.
  - Remove tab title mapping for `TopMenuEnums.TRAININGS`.
  - Remove conditional render block `{option === TopMenuEnums.TRAININGS && <TrainingList ... />}`.
  - Update guidance text to: *"Selecciona una opción del menú inferior para gestionar la plantilla o partidos."*
- In `src/components/PlayerDetail.tsx`:
  - Remove `TraningPlayersController` from `useDB()`.
  - Remove `totalTrainings` and `totalTrainingsAssis` state hooks.
  - Remove `TraningPlayersController.loadByPlayer` effect call.
  - Remove the "E. A" (Entrenamientos Asistidos) and "E. F" (Entrenamientos Fallados) badge cards, preserving the "P. J" (Partidos Jugados) badge and game statistics.

### Rationale
- Eliminates 100% of user-facing training controls, cards, forms, and attendance metrics (FR-001, FR-002, SC-001).
- The team profile bottom navigation cleanly transitions to 4 items: `Inicio` (MAIN), `Plantilla` (PLAYERS), `Partidos` (GAMES), and `Volver` (GO_BACK).

### Alternatives Considered
- **Disabling the "Entrenamientos" button with an alert**: Rejected because the feature specification requires total removal, not deprecation notices.

---

## 4. TypeScript Contracts and Enums Refactoring

### Decision
- In `src/types/enums.ts`:
  - Remove `TRAINING`, `TRAININGS`, and `ADD_NEW_SESSION` from `TopMenuEnums`.
- In `src/types/database.ts`:
  - Remove `trainings` and `trainingPlayers` schema imports.
  - Remove `Training`, `NewTraining`, `TrainingPlayer`, and `NewTrainingPlayer` type definitions.
- In `src/types/store.ts`:
  - Remove training-related imports and interfaces.

### Rationale
- Leverages TypeScript strict mode compiler (`tsc --noEmit`) to automatically detect any remaining references or dangling imports across the entire repository.

### Alternatives Considered
- **Keeping deprecated enum entries**: Rejected because removing them provides compile-time guarantees that no hidden code paths still trigger training flows.

---

## 5. Seed Script & Automated Test Suite Sanitization

### Decision
- In `scripts/seed-db.ts`:
  - Remove `trainings` and `trainingPlayers` schema imports and table deletions from `clearDatabase()`.
  - Remove `trainings` array from `TeamSeedConfig` and all 3 seed teams (`Furola Basket Club`, `Danés Academy Basket`, `Canasta Real BCM`).
  - Remove training insertion loops in `seedDatabase()`.
  - Remove `trainingsCount` from the summary return object.
- In existing test suites:
  - `src/__tests__/db/connection.test.ts`: Update to assert remaining schemas (`teams`, `players`, `games`, `playerStats`).
  - `src/__tests__/db/cascade.test.ts`: Remove training/trainingPlayers cascade checks.
  - `src/__tests__/db/seed.test.ts`: Update seed summary assertion to verify teams, players, and games without trainings.
  - `src/__tests__/components/Header.test.tsx`: Remove `TrainingList Context` test suite.
  - `src/__tests__/components/ClubProfile.test.tsx`: Update expected bottom menu items to 4 items (excluding `TRAININGS`).
  - `src/__tests__/components/BottomNavBar.test.tsx`: Ensure mock navigation items use remaining valid enums.
  - `src/__tests__/store/MenuStore.test.ts`: Ensure valid menu tests.
  - Add regression unit test in `src/__tests__/db/` asserting that `trainings` and `training_players` tables are dropped and no orphan references remain.

### Rationale
- `seedDatabase()` runs automatically during development app startup (`App.tsx`). Removing training seeding prevents runtime SQL insertion errors against dropped tables.
- Adheres to Constitution Principle I (TDD) by keeping 100% of test suites passing (SC-005).
