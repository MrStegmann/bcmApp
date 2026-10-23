# Implementation Plan: Remove Training Session

**Branch**: `008-remove-training-session` | **Date**: 2026-10-22 | **Spec**: [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/008-remove-training-session/spec.md)

**Input**: Feature specification from `specs/008-remove-training-session/spec.md`

---

## Summary

Completely remove the Training Session feature from the application, including user interface screens (`TrainingList`, `TrainingDetail`, `TrainingForm`, `TraningCards`, `TrainingPlayer`), navigation buttons (Club Profile bottom tab `TRAININGS`), runtime state management (`TrainingStore`), data access controllers in `useDB`, and local persistence tables (`trainings` and `training_players`). Existing installations will automatically drop the SQLite tables on initialization while preserving all teams, players, games, and match statistics with zero orphan references or dangling keys.

---

## Technical Context

**Language/Version**: TypeScript 5.3+ (Strict Mode)  
**Primary Dependencies**: React Native / Expo 52+, Drizzle ORM (`drizzle-orm`), Expo SQLite (`expo-sqlite`), Zustand 5.0+, NativeWind 4.0+  
**Storage**: SQLite via `expo-sqlite` and `drizzle-orm` (local database `bcmapp.db`)  
**Testing**: Jest with React Native Testing Library (`npm test`)  
**Target Platform**: Mobile (iOS & Android via Expo managed workflow)  
**Project Type**: Mobile Application  
**Performance Goals**: 60 fps transitions, < 50ms startup migration on database initialization  
**Constraints**: Fully offline-capable local persistence; zero data loss for existing team, player, and match records  
**Scale/Scope**: 7 deleted source files, 7 updated source files, 7 updated test suites  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Verification |
|-----------|-------------|--------|--------------|
| **I. Test-Driven Development First** | Tests updated before implementation; zero test regressions | **PASS** | Existing test suites updated to reflect 4-tab navigation and dropped training tables; full suite passes with 100% success rate. |
| **II. Feature-Based Architecture** | Encapsulation, explicit exports, clean boundaries | **PASS** | Deletion strictly removes training files from `src/page/`, `src/components/`, `src/store/`, without affecting other feature modules. |
| **III. Type-Safe Persistence (Drizzle & SQLite)** | Drizzle schema inferred, migrations managed, foreign keys intact | **PASS** | `trainings` and `training_players` removed from Drizzle schema; `DROP TABLE IF EXISTS` migration runs in `initDatabase()`; cascade delete relationships for teams, players, and games preserved. |
| **IV. Predictable State Management (Zustand)** | Small domain stores, immutable state | **PASS** | Obsolete `TrainingStore` deleted entirely; no dangling state slices. |
| **V. Utility-First Mobile Styling (NativeWind)** | NativeWind Tailwind styling maintained | **PASS** | Any updated views (`ClubProfile`, `PlayerDetail`) adhere strictly to NativeWind utility classes. |
| **VI. Strict TypeScript & Type Safety** | No implicit `any`, strict type checking | **PASS** | Removed types and enum values validated with `npx tsc --noEmit`. |

---

## Project Structure

### Documentation (this feature)

```text
specs/008-remove-training-session/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output: decisions, rationale, alternatives
├── data-model.md        # Phase 1 output: entity removal & SQLite schema transition
├── quickstart.md        # Phase 1 output: runnable validation scenarios
├── contracts/           # Phase 1 output: interface & schema contracts
│   ├── database-schema.contract.md
│   ├── ui-navigation.contract.md
│   └── store-service.contract.md
└── checklists/
    └── requirements.md  # Requirement validation checklist
```

### Source Code Layout & Changes

```text
src/
├── components/
│   ├── PlayerDetail.tsx         # [MODIFY] Remove E.A & E.F attendance badges & controller calls
│   ├── TraningCards.tsx         # [DELETE] Obsolete training card component
│   ├── TrainingDetail.tsx       # [DELETE] Obsolete training detail view
│   ├── TrainingForm.tsx         # [DELETE] Obsolete training creation form
│   └── TrainingPlayer.tsx       # [DELETE] Obsolete training attendance component
├── page/
│   ├── ClubProfile.tsx          # [MODIFY] Remove Entrenamientos tab & TrainingList rendering
│   └── TrainingList.tsx         # [DELETE] Obsolete training list screen
├── store/
│   └── TrainingStore.ts         # [DELETE] Obsolete training Zustand store
├── hooks/
│   └── useDB.ts                 # [MODIFY] Remove TrainingController & TrainingPlayersController
├── db/
│   ├── schema.ts                # [MODIFY] Remove trainings & trainingPlayers table definitions
│   └── index.ts                 # [MODIFY] Add DROP TABLE IF EXISTS migration & remove CREATE TABLE
├── types/
│   ├── enums.ts                 # [MODIFY] Remove TRAINING, TRAININGS, ADD_NEW_SESSION enums
│   ├── database.ts              # [MODIFY] Remove Training & TrainingPlayer types
│   └── store.ts                 # [MODIFY] Remove TrainingState interface
├── test/
│   └── trainings.js             # [DELETE] Obsolete legacy test script
└── __tests__/
    ├── components/
    │   ├── Header.test.tsx      # [MODIFY] Remove TrainingList context test suite
    │   ├── ClubProfile.test.tsx # [MODIFY] Update bottom menu items assertion (4 items)
    │   └── BottomNavBar.test.tsx# [MODIFY] Update mock items to exclude TRAININGS
    ├── db/
    │   ├── connection.test.ts   # [MODIFY] Assert core tables defined without trainings
    │   ├── cascade.test.ts      # [MODIFY] Assert cascade rules on retained tables
    │   └── seed.test.ts         # [MODIFY] Remove trainingsCount expectation
    └── store/
        └── MenuStore.test.ts    # [MODIFY] Remove TopMenuEnums.TRAININGS reference
scripts/
└── seed-db.ts                   # [MODIFY] Remove training mock data & insertion logic
```

---

## Complexity Tracking

> **No Constitution violations detected.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | N/A | N/A |
