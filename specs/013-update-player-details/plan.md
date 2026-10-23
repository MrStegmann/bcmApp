# Implementation Plan: Update Player Contract, Form, and Details

**Branch**: `013-update-player-details` | **Date**: 2026-10-23 | **Spec**: [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/013-update-player-details/spec.md)

**Input**: Feature specification from `specs/013-update-player-details/spec.md`

## Summary

Modernize the player domain contract by removing obsolete fields `position` and `notes` and introducing an optional `jerseyName` (`jersey_name`) field. Update `PlayerForm` to remove `position`/`notes` and provide an optional input for `jerseyName`. In `PlayerDetail`, query and display a reverse-chronological list of matches in which the player participated situated directly beneath the global player statistics card, displaying the rival (opponent) team name, match round, a clear empty state when zero matches are played, and a direct action button to navigate seamlessly into `MatchDetailView` with smooth return navigation.

---

## Technical Context

**Language/Version**: TypeScript 5.9 (Strict mode enabled)
**Primary Dependencies**: React Native 0.86+, Expo 57+, Drizzle ORM, Zustand, NativeWind (Tailwind CSS)
**Storage**: Expo SQLite (`expo-sqlite`) with Drizzle ORM schema mapping
**Testing**: Jest test runner with React Native Testing Library
**Target Platform**: iOS, Android, and Web (Expo managed mobile workflow)
**Project Type**: Mobile Application
**Performance Goals**: <1s navigation transition to Match Detail view (SC-004), 60 fps smooth list scrolling
**Constraints**: Fully offline-capable local SQLite relational persistence, strict typing (zero implicit `any`), NativeWind utility styling
**Scale/Scope**: 12+ rostered players per team, multi-match season participation tracking

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked post Phase 1 design.*

| Principle | Requirement | Plan Status | Justification / Implementation Notes |
|---|---|---|---|
| **I. Test-Driven Development First** | Tests written before code using Jest & RNTL | **PASS** | TDD test suites defined in `quickstart.md`: unit tests for `PlayerStore`, component tests for `PlayerForm` and `PlayerDetail`, and integration tests for navigation drilldown. |
| **II. Feature-Based Architecture** | Self-contained domain organization, explicit exports | **PASS** | Leverages `src/features/match-detail` for match inspection, isolates player components and hooks cleanly. |
| **III. Type-Safe Persistence (Drizzle & Expo SQLite)** | Schema alterations via Drizzle, type inference (`$inferSelect`, `$inferInsert`) | **PASS** | `src/db/schema.ts` updated with `jerseyName`, `position`/`notes` dropped. Types inferred via Drizzle without raw SQL strings. |
| **IV. Predictable State Management** | Zustand stores for state transitions | **PASS** | `usePlayerStore` and `useGameStore` handle state mutations; component state handles active drilldown view. |
| **V. Utility-First Mobile Styling** | NativeWind utility classes via `className` | **PASS** | All new UI elements in `PlayerForm` and `PlayerDetail` use NativeWind utility classes. No `StyleSheet.create`. |
| **VI. Strict TypeScript** | Strict typing, no implicit `any` | **PASS** | All props, models, and return types explicitly typed with strict contracts. |

---

## Project Structure

### Documentation (this feature)

```text
specs/013-update-player-details/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output: decisions on schema, forms, query, navigation
├── data-model.md        # Phase 1 output: player entity, played match summary, validations
├── quickstart.md        # Phase 1 output: runnable test scenarios and run commands
├── contracts/           # Phase 1 output: interface contracts
│   ├── player-api.ts
│   └── played-matches-api.ts
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── db/
│   ├── schema.ts                   # Update players table: remove position/notes, add jerseyName
│   ├── index.ts                    # Update CREATE TABLE DDL and migration
│   └── mock/
│       ├── mockDataValidator.ts    # Update mock dataset validator
│       └── mockTeamData.ts         # Update player fixtures
├── types/
│   ├── database.ts                 # Update Player & NewPlayer Drizzle type inference
│   └── mockData.ts                 # Update MockPlayerConfig
├── store/
│   └── PlayerStore.ts              # Ensure player CRUD actions handle jerseyName
├── hooks/
│   └── useDB.ts                    # Add loadPlayerPlayedMatches to PlayerController / useDB
├── components/
│   ├── PlayerForm.tsx              # Add optional jerseyName input; omit position/notes
│   └── PlayerDetail.tsx            # Add played matches list, empty state, and MatchDetailView drilldown
├── page/
│   └── PlayerList.tsx              # Orchestrate player selection and detail view
└── __tests__/
    ├── store/
    │   └── PlayerStore.test.ts      # Unit tests for player persistence with jerseyName
    ├── components/
    │   ├── PlayerForm.test.tsx     # Form rendering and submission assertions
    │   └── PlayerDetail.test.tsx   # Played matches list, empty state, and drilldown button assertions
    └── db/
        └── mockDataValidator.test.ts # Updated mock validation assertions
```

**Structure Decision**:
Changes are applied directly to existing modular components, database schemas, Zustand stores, and hooks in accordance with the established codebase architecture. Drill-down navigation reuses `<MatchDetailView />` exported from `src/features/match-detail`.

---

## Complexity Tracking

*No violations detected. Zero unnecessary dependencies or complexity introduced.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| None | N/A | N/A |
