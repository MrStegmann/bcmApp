# Implementation Plan: Direct Match Result & Stats Entry (Set Completed Match)

**Branch**: `017-set-completed-match` | **Date**: 2026-10-25 | **Spec**: [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/017-set-completed-match/spec.md)

**Input**: Feature specification from `/specs/017-set-completed-match/spec.md`

## Summary

Enable coaches and team managers to set basketball match results and player statistics directly without going through live match execution. Action buttons on match cards in `GameCards.tsx` are refactored into a balanced 2-column grid layout, introducing a dedicated "Set Result" button enabled strictly for pending matches. Clicking this button opens `DirectResultModal` (`src/features/direct-result/`), where users enter period-by-period points and fouls (Period 1 to 4 + optional overtime) and isolated player box scores (minutes, shooting, rebounds, assists, steals, turnovers, fouls). Upon tapping Save, the match status transitions directly to `finished` with atomic persistence of period scores and player statistics.

## Technical Context

**Language/Version**: TypeScript 6.0 (Strict mode: `strictNullChecks`, `noImplicitAny`)  
**Primary Dependencies**: React Native 0.86, Expo 57, NativeWind 4.2 (Tailwind CSS v3), Zustand 5.0, Drizzle ORM 0.45  
**Storage**: Expo SQLite (`expo-sqlite` v57) with Drizzle ORM  
**Testing**: Jest 29, React Native Testing Library, Test-Driven Development (Red-Green-Refactor)  
**Target Platform**: Android & iOS (Expo managed workflow)  
**Project Type**: Mobile Application  
**Performance Goals**: Instant total recalculations (<16ms, 60fps), direct result submission & state transition in <200ms  
**Constraints**: Zero negative values, strict isolation between player stats, non-blocking UI during batch saves, offline-first local persistence  
**Scale/Scope**: Matches with up to 15 roster players, 4 regulation quarters + overtime  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Compliance Analysis | Status |
| :--- | :--- | :--- | :--- |
| **I. TDD First** | Tests written prior to implementation; red-green-refactor cycle. | Component and store tests will be written in `src/features/direct-result/__tests__/` and `src/__tests__/components/GameCards.test.tsx` before implementation. | **PASS** |
| **II. Feature-Based Arch** | Encapsulation in `src/features/<feature>/` with explicit barrel `index.ts`. | Core result entry modal and sections are encapsulated in `src/features/direct-result/` with public exports in `index.ts`. | **PASS** |
| **III. Type-Safe Persistence** | Drizzle ORM with type inference; no raw untyped SQL. | Reuses existing Drizzle schemas (`games`, `player_stats`) and `GameStore`/`useDB` batch save methods with `$inferInsert` types. | **PASS** |
| **IV. Zustand State** | Focused, predictable state transitions; immutable stores. | Utilizes `GameStore` actions (`finishMatch`, `batchSavePlayerStats`) and isolated local modal buffers for transient edits. | **PASS** |
| **V. NativeWind Styling** | Tailwind utility classes via `className`; centralized design tokens. | All modal, grid, card, and input styles use NativeWind classes (`bg-surface`, `bg-slate-card`, `border-slate-border`, etc.). | **PASS** |
| **VI. Strict TypeScript** | Strict types, no implicit `any`, explicit interface contracts. | All interfaces defined in `contracts/` and `src/features/direct-result/types/` with full type coverage. | **PASS** |

## Project Structure

### Documentation (this feature)

```text
specs/017-set-completed-match/
├── plan.md              # This implementation plan
├── research.md          # Phase 0: Technical decisions & rationale
├── data-model.md        # Phase 1: Entity attributes, buffer types & state transitions
├── quickstart.md        # Phase 1: Verification guide & manual walkthrough
├── contracts/           # Phase 1: Component and grid prop contracts
│   ├── direct-result-modal.contract.ts
│   └── game-cards.contract.ts
└── tasks.md             # Phase 2: Actionable tasks (created via /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── features/
│   └── direct-result/
│       ├── components/
│       │   ├── DirectResultModal.tsx       # Fullscreen modal wrapper with tabs & save/cancel actions
│       │   ├── PeriodScoresSection.tsx     # Q1-Q4 + OT scores and fouls inputs with live totals
│       │   └── PlayerStatsSection.tsx      # Roster list with isolated shooting, rebound, assist, foul inputs
│       ├── types/
│       │   └── index.ts                    # Feature-specific types (buffers, period keys, props)
│       ├── __tests__/
│       │   └── components/
│       │       ├── DirectResultModal.test.tsx
│       │       ├── PeriodScoresSection.test.tsx
│       │       └── PlayerStatsSection.test.tsx
│       └── index.ts                        # Feature public barrel export
├── components/
│   └── GameCards.tsx                       # Updated 2-column action grid & "Set Result" button
├── page/
│   └── GameList.tsx                        # Coordinates DirectResultModal lifecycle & data refresh
└── __tests__/
    └── components/
        └── GameCards.test.tsx               # Updated to assert 2-column grid and Set Result button states
```

**Structure Decision**: A dedicated domain feature `src/features/direct-result/` encapsulates the direct result modal, period score inputs, and player statistics form. `GameCards.tsx` exposes the 2-column grid action container and the `onSetResult` callback, wired up directly within `GameList.tsx`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations detected. Standard feature-based architecture and existing Drizzle schema reused.*
