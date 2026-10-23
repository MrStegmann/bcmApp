# Implementation Plan: Mocked Basketball Team, Roster & Match Dataset

**Branch**: `010-mock-team-data` | **Date**: 2026-10-23 | **Spec**: [specs/010-mock-team-data/spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/010-mock-team-data/spec.md)

**Input**: Feature specification from `specs/010-mock-team-data/spec.md`

## Summary

Deliver a deterministic, mathematically reconciled mock dataset for a basketball club ("CB Salliver", "Junior Celeste") comprising 1 team, 12 unique players with designated positions and jersey numbers, and a 10-match season schedule (5 finished matches with quarter breakdowns and 100% reconciled player box scores, and 5 upcoming matches with future dates). The dataset will be integrated into the application's Drizzle ORM and `expo-sqlite` database seeding pipeline (`src/db/mock/mockTeamData.ts`, `src/db/mock/mockDataValidator.ts`, `scripts/seed-db.ts`), complete with automated unit and data-integrity tests.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 / React Native 0.86.3 / Node 20+  
**Primary Dependencies**: `drizzle-orm` (^0.45.3), `expo-sqlite` (~57.0.3), `zustand` (^5.0.8), `expo` (~57.0.25)  
**Storage**: SQLite (`expo-sqlite`) with Drizzle ORM schemas (`teams`, `players`, `games`, `playerStats`)  
**Testing**: Jest (`npm test`) with mocked `expo-sqlite` under Node test environment  
**Target Platform**: Mobile (Android, iOS) via Expo managed workflow and Node.js runtime for scripts  
**Project Type**: Mobile Application (React Native / Expo) with local SQLite persistence  
**Performance Goals**: Dataset initialization, verification, and seeding executes in under 3 seconds (SC-004)  
**Constraints**:
- Strict mathematical integrity: $\sum(\text{player points}) == \text{match team score}$ across all 5 finished matches.
- Strict period points reconciliation: $\sum(\text{resultC1..C4} + \text{resultExtra}) == \text{total match score}$.
- Consistent player valuation matching `calculatePlayerValuation` in `src/store/GameStore.ts`.
- Valid date format: `"dd/mm/aaaa - hh:mm"` matching `TIMESTAMP_REGEX`.
- DNP (0 minutes) players must have 0 in all statistical categories.
- Exactly 1 game with overtime (tied in C4, decided in Extra).
- Idempotent reset and cascade cleanup without foreign key violations.

**Scale/Scope**: 1 mock team, 12 players, 10 matches (5 finished, 5 pending), 60 player stat records (12 players $\times$ 5 finished games).

## Constitution Check

*GATE: Evaluated before Phase 0 research and re-checked post-design. ALL GATES PASS.*

| Principle | Requirement | Compliance Status | Justification / Implementation Plan |
|-----------|-------------|-------------------|--------------------------------------|
| **I. Test-Driven Development First (Jest)** | Write failing Jest tests before implementing logic | **PASS** | Tests in `src/__tests__/db/mockData.test.ts` and `src/__tests__/db/seed.test.ts` will assert mathematical consistency, DNP logic, valuation equations, and DB seeder summaries before wiring seeders. |
| **II. Feature-Based Architecture Pattern** | Encapsulated domain structure, explicit exports | **PASS** | Data definitions and validators reside under `src/db/mock/` and export through clear public interfaces defined in `/contracts/`. |
| **III. Type-Safe Persistence (Drizzle & expo-sqlite)** | Use Drizzle ORM, schema type inference, no raw SQL | **PASS** | Uses typed Drizzle entities (`teams`, `players`, `games`, `playerStats`) with `$inferInsert` / `$inferSelect`. Schema already includes cascading foreign keys. |
| **IV. Predictable State Management (Zustand)** | Pure store transitions, minimal boilerplate | **PASS** | Compatible with `useGameStore` and `Game` / `PlayerStat` types without requiring store schema alterations. |
| **V. Utility-First Mobile Styling (NativeWind)** | NativeWind Tailwind styling for UI components | **PASS** | No new custom UI stylesheets; renders seamlessly through existing match-detail and calendar components. |
| **VI. Strict TypeScript & Type Safety** | Strict typing, no implicit `any` | **PASS** | Fully typed through `MockTeamDatasetConfig`, `MockGameConfig`, `MockPlayerConfig`, `MockPlayerStatConfig` contracts. |

## Project Structure

### Documentation (this feature)

```text
specs/010-mock-team-data/
├── plan.md              # This implementation plan
├── research.md          # Phase 0 architectural & domain decisions
├── data-model.md        # Phase 1 data entities, fields, relationships & invariants
├── quickstart.md        # Phase 1 verification and run guide
├── contracts/           # Phase 1 interface and schema contracts
│   ├── dataset.contract.ts
│   └── seeder.contract.ts
└── checklists/
    └── requirements.md  # Quality checklist for requirements
```

### Source Code (repository root)

```text
scripts/
└── seed-db.ts                           # Database clear & seed execution script

src/
├── db/
│   ├── index.ts                         # Drizzle database initialization & schema export
│   ├── schema.ts                        # Drizzle schema definitions (teams, players, games, playerStats)
│   ├── seed.ts                          # Re-export of seed & clear functions
│   └── mock/
│       ├── mockTeamData.ts              # Deterministic mock dataset (1 team, 12 players, 10 matches, stats)
│       └── mockDataValidator.ts         # Pure mathematical & relational integrity validation functions
├── store/
│   └── GameStore.ts                     # Existing valuation & game management store
└── __tests__/
    └── db/
        ├── mockData.test.ts             # Unit tests for mock dataset mathematical integrity & schema validity
        ├── seed.test.ts                 # Tests for database seeding & clearing execution
        └── connection.test.ts           # Schema & DB connection tests
```

**Structure Decision**:
Mock data definitions and pure validators are grouped in `src/db/mock/` so that Jest tests and seeding scripts can consume them without side effects or circular dependencies. Database seeding execution in `scripts/seed-db.ts` and `src/db/seed.ts` leverage Drizzle ORM queries directly.

## Complexity Tracking

> **No violations identified. Architecture adheres strictly to all constitutional principles.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | N/A | N/A |
