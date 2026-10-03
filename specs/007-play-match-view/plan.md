# Implementation Plan: Play Match View

**Branch**: `007-play-match-view` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-play-match-view/spec.md`

## Summary

Build an organic, modular match management view structured across three core components backed by a centralized global state store (`usePlayMatchStore`):
1. **Component 1 (Time, Score, and Fouls Controller)**: Manages periods (`q1`, `q2`, `q3`, `q4`, `extra`) with 1-tap sequence swap and 3-second long-press period selection modal; chronometer with 1-tap start/stop and 3-second long-press manual time entry; period duration isolation (10:00 for `q1`-`q4`, 05:00 for `extra`); extra time reset preserving scores/fouls and granting +1 timeout; total score calculation from period scores; isolated period team fouls.
2. **Component 2 (Team Management & Court Canvas)**: Half basketball court canvas with 5 position buttons representing the active quintet (with empty state support); tapping opens the stats modal (`t1a`, `t1i`, `t2a`, `t2i`, `t3a`, `t3i` with assist teammate selector including "non assistant" option on `t2a`/`t3a`; offensive and defensive rebounds both present; fouls auto-pausing crono and adding to period team fouls; assists, ball lost, ball recuperation); real-time player minute accumulation; player representation circles with `jerseyNumber`, `name`, `minutos`, `pts`; horizontal bench list; Swap button activating balanced substitution mode ($N\text{ in} = N\text{ out}$); timeout increment/decrement controls in the same row enforcing quota rules (2 for `q1`-`q2`, 3 for `q3`-`q4`, 1 for `extra` + resets).
3. **Component 3 (Rival Panel Control)**: Dedicated rival panel with controls for rival period score (+1, +2, +3, -1) and rival period team fouls (+1, -1, with +1 auto-pausing the chronometer).

## Technical Context

**Language/Version**: TypeScript 5.3+ (Strict mode enabled)
**Primary Dependencies**: React Native 0.86+, Expo 57+, NativeWind (Tailwind CSS for React Native), Zustand, Drizzle ORM (`drizzle-orm`), Expo SQLite (`expo-sqlite`), Lucide / Expo Vector Icons (`Feather`, `Ionicons`, `FontAwesome6`)
**Storage**: Local SQLite via Expo SQLite & Drizzle ORM (`games`, `player_stats`, `players`, `teams` tables)
**Testing**: Jest + React Native Testing Library
**Target Platform**: iOS & Android (Expo managed workflow)
**Project Type**: Mobile Application
**Performance Goals**: 60 FPS half-court canvas animations, immediate clock toggle (<100ms response), stat recording in <3 taps (<4 seconds), gesture detection for 3-second long-press handlers
**Constraints**: Offline-first local persistence, strict TDD workflow, NativeWind utility styling, exact 5-player court invariant, isolated quarter state boundaries
**Scale/Scope**: 3 core UI components, centralized Zustand store, period/timer modals, stats & assist modals, substitution swap engine, timeout quota engine, rival controls

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Compliance | Status |
|---|---|---|---|
| **I. TDD First** | Unit & component tests written before implementation | Test suites for 3-component architecture: period switcher & 3s hold modal, crono start/stop & 3s hold modal, court canvas & stats/assist flows, swap mode equal-exchange rules, timeout quota rules, and rival score/foul controls | **PASSED** |
| **II. Feature-Based Architecture** | Modular, encapsulated design | Reusable components (`TimeScoreFoulsController`, `TeamManagementCanvas`, `RivalPanelControl`, `PlayerStatsModal`, `PeriodSelectModal`, `ManualTimeModal`) cleanly structured under `src/features/play-match/` | **PASSED** |
| **III. Type-Safe Persistence** | Drizzle ORM + Expo SQLite schemas | Schema types inferred via Drizzle (`games`, `player_stats`) and strictly typed mutations mapped to DB schema | **PASSED** |
| **IV. Predictable State** | Focused Zustand stores | Centralized `usePlayMatchStore` managing global match state, isolated period states (`q1`-`extra`), roster, chronometer, timeouts, and stats | **PASSED** |
| **V. Utility-First Styling** | NativeWind / Tailwind classes | All UI styled with NativeWind `className` and basketball court tokens | **PASSED** |
| **VI. Strict TypeScript** | Strict typing, no implicit `any` | Fully typed interfaces, props, and contracts in `contracts/play-match-contracts.ts` | **PASSED** |

## Project Structure

### Documentation (this feature)

```text
specs/007-play-match-view/
├── plan.md              # This file
├── research.md          # Phase 0 research findings & architectural decisions
├── data-model.md        # Phase 1 entity schemas & state machine
├── quickstart.md        # Phase 1 validation scenarios
├── contracts/           # Phase 1 interface & type contracts
│   └── play-match-contracts.ts
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code (repository root)

```text
src/
├── features/
│   └── play-match/
│       ├── components/
│       │   ├── TimeScoreFoulsController.tsx   # Component 1: Period control, crono, period scores & team fouls
│       │   ├── TeamManagementCanvas.tsx       # Component 2: Half-court canvas, quintet buttons, bench, swap & timeouts
│       │   ├── RivalPanelControl.tsx          # Component 3: Rival score (+1,+2,+3,-1) & rival fouls (+1,-1)
│       │   ├── PlayerStatsModal.tsx           # Stats modal with t1/t2/t3, assists prompt ("non assistant"), rebounds, etc.
│       │   ├── PeriodSelectModal.tsx          # 3-second long-press modal for direct period selection
│       │   ├── ManualTimeModal.tsx            # 3-second long-press modal for manual chronometer time entry
│       │   └── StartingFiveModal.tsx          # Initial lineup selection modal for pending matches
│       ├── store/
│       │   └── usePlayMatchStore.ts           # Centralized Zustand global store managing match session state
│       ├── types/
│       │   └── index.ts                       # Public feature type definitions re-exported from contracts
│       └── index.ts                           # Feature public barrel export
├── page/
│   └── PlayMatch.tsx                          # Main screen container integrating the 3 components & store
├── db/
│   └── schema.ts                              # Drizzle SQLite schema for games and player stats
├── types/
│   └── database.ts                            # Inferred DB types
└── __tests__/
    └── features/
        └── play-match/
            ├── store/
            │   └── usePlayMatchStore.test.ts          # State store unit tests (periods, crono, stats, swap, timeouts)
            ├── components/
            │   ├── TimeScoreFoulsController.test.tsx  # Component 1 tests (1-tap next, 3s hold modal, crono, fouls)
            │   ├── TeamManagementCanvas.test.tsx      # Component 2 tests (court buttons, bench, swap mode, timeouts)
            │   ├── RivalPanelControl.test.tsx         # Component 3 tests (rival points, fouls, clock auto-stop)
            │   ├── PlayerStatsModal.test.tsx          # Stats modal & assist flow tests
            │   ├── PeriodSelectModal.test.tsx         # Period selection modal tests
            │   └── ManualTimeModal.test.tsx           # Manual time adjustment tests
            └── page/
                └── PlayMatch.test.tsx                 # Full integration test suite
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *None* | Standard feature-based architecture adhering 100% to constitution | N/A |
