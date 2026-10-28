# Implementation Plan: Play Match View

**Branch**: `007-play-match-view` | **Date**: 2026-10-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-play-match-view/spec.md` including all updates through 2026-10-28:
1. Player Identification: Jersey number exclusivity with fallback abbreviation `[First Initial]. [Last Name]`.
2. Stint Tracking: Displaying continuous stint minutes for on-court quintet starting at 0 and resetting upon re-entering from bench.
3. Stat Subtraction: 2-second hold gesture on active on-court players to trigger stat subtraction with automatic cascading assist reversal on 2pt/3pt made baskets.
4. Unrestricted Substitutions: Swap mode available and executable at any time, whether the match chronometer is running or paused ($N\text{ in} = N\text{ out}$).
5. Full-Width Rival Layout: Rival control panel extended to 100% width with duplicate rival total points counter removed.
6. Bench Player Statistics Modal: High-prominence read-only modal opened by tapping a bench player when Swap Mode is inactive, displaying minutes and points at the top, shooting stats in `s/a (#%)` format (with `0/0 (0%)` when attempts = 0), complete statline (rebounds, assists, steals, turnovers, fouls, valuation), with dismissals via cross (`✕`) button and backdrop tap.
7. Design Refactorization (2026-10-28):
   - **Responsive Viewport Adaptation**: Fluid scaling of the half-court canvas and surrounding layout based on available screen height/width, preventing canvas clipping or on-court players from collapsing behind the bench management panel on small mobile devices.
   - **Compact Player Circles**: Sizing down player circle representations across both court and bench to a compact scale, displaying exclusively the jersey number (or fallback `[First Initial]. [Last Name]`), divisor line, and minutes/points (`${stintMin}min / ${pts}pts` on court, `${min}min / ${pts}pts` on bench).
   - **Overtime Reset Relocation**: Complete removal of the standalone reset button from the main screen layout (`TimeScoreFoulsController`), relocating the extra-time reset action inside the "Ajustar Tiempo" (`ManualTimeModal`) modal view accessible via 3-second hold on the chronometer.
   - **Enlarged Score-Only Application Header**: Application Header displaying exclusively the live total match score (`${teamTotalScore} - ${rivalTotalScore}`), completely omitting local and rival team names, rendered in enlarged high-contrast typography.

## Summary

Build an organic, modular match management view structured across three core components backed by a centralized global state store (`usePlayMatchStore`):
1. **Component 1 (Time, Score, and Fouls Controller)**: Manages periods (`q1`, `q2`, `q3`, `q4`, `extra`) with 1-tap sequence swap and 3-second long-press period selection modal; chronometer with 1-tap start/stop and 3-second long-press manual time entry (`ManualTimeModal`), which now houses the extra-time reset action; period duration isolation (10:00 for `q1`-`q4`, 05:00 for `extra`); total score calculation from period scores; isolated period team fouls. Application Header displays exclusively the live total match score `${teamTotalScore} - ${rivalTotalScore}` with back and save buttons, omitting team names.
2. **Component 2 (Team Management & Court Canvas)**: Fluidly responsive half basketball court canvas with 5 position buttons representing the active quintet (with empty state support; tapping empty slot opens quick player selector modal); dynamic viewport scaling ensuring court slots never clip behind the bench panel on compact devices; scaled-down compact player circles showing **exclusively Jersey Number** when present, or fallback `[First Initial]. [Last Name]` when absent, separated by a divisor line from minutes and points (`${stintMin}min / ${pts}pts` on court, `${min}min / ${pts}pts` on bench); tapping opens the stats modal (`t1a`, `t1i`, `t2a`, `t2i`, `t3a`, `t3i` with assist teammate selector including "non assistant" option on `t2a`/`t3a`; offensive and defensive rebounds both present; fouls auto-pausing crono and adding to period team fouls; assists, ball lost, ball recuperation); real-time player minute accumulation; stint tracking displaying continuous on-court stint time (`stintSeconds`) starting at 0 on court entry and resetting upon return from bench; 2-second hold gesture on active on-court players triggering `PlayerStatSubtractionModal` with automatic cascading assist reversal; horizontal bench list with compact circles where tapping outside Swap Mode opens `BenchPlayerStatsModal`; Swap button activating balanced substitution mode ($N\text{ in} = N\text{ out}$) unrestricted by clock running state; timeout increment/decrement controls in the same row enforcing quota rules (2 for `q1`-`q2`, 3 for `q3`-`q4`, 1 for `extra` + resets).
3. **Component 3 (Rival Panel Control)**: Dedicated full-width (100% width) rival panel with controls for rival period score (+1, +2, +3, -1) and rival period team fouls (+1, -1, with +1 auto-pausing the chronometer), completely omitting redundant rival total points counter.

## Technical Context

**Language/Version**: TypeScript 5.3+ (Strict mode enabled)
**Primary Dependencies**: React Native 0.86+, Expo 57+, NativeWind (Tailwind CSS for React Native), Zustand, Drizzle ORM (`drizzle-orm`), Expo SQLite (`expo-sqlite`), Lucide / Expo Vector Icons (`Feather`, `Ionicons`, `FontAwesome6`, `MaterialIcons`)
**Storage**: Local SQLite via Expo SQLite & Drizzle ORM (`games`, `player_stats`, `players`, `teams` tables)
**Testing**: Jest + React Native Testing Library
**Target Platform**: iOS & Android (Expo managed workflow)
**Project Type**: Mobile Application
**Performance Goals**: 60 FPS half-court canvas animations, immediate clock toggle (<100ms response), modal open response (<100ms), stat recording in <3 taps (<4 seconds), gesture detection for 2-second hold (subtraction) and 3-second long-press handlers (modals), fluid layout calculations without reflow lag on viewport size changes
**Constraints**: Offline-first local persistence, strict TDD workflow, NativeWind utility styling, exact 5-player court invariant, isolated quarter state boundaries, compact player circle rendering with zero text clipping, cascading assist decrement integrity, backdrop dismiss boundaries without nested propagation, responsive viewport layout avoiding off-screen player displacement
**Scale/Scope**: 3 core UI components, centralized Zustand store with `ScoreEventLink` tracking, period/timer modals (`ManualTimeModal` with overtime reset option), stats & subtraction modals, bench player statistics modal with `s/a (#%)` formatting, unrestricted substitution swap engine, timeout quota engine, full-width rival controls, player identification formatting utility with edge case handling, responsive court geometry engine (`courtArcPositions.ts`), enlarged score-only header

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Compliance | Status |
|---|---|---|---|
| **I. TDD First** | Unit & component tests written before implementation | Test suites for 3-component architecture: period switcher & 3s hold modal, crono start/stop & 3s hold modal with overtime reset, responsive court canvas & compact player circles, stint tracking accumulation & reset, 2s hold stat subtraction with cascading assist deduction, unrestricted swap mode equal-exchange rules, timeout quota rules, full-width rival score/foul controls, player identifier formatting utility asserting jersey exclusivity and fallback edge cases, throw statistics formatter asserting `s/a (#%)` and `0/0 (0%)`, `BenchPlayerStatsModal`, and enlarged score-only header | **PASSED** |
| **II. Feature-Based Architecture** | Modular, encapsulated design | Reusable components (`TimeScoreFoulsController`, `TeamManagementCanvas`, `TeamManagementPanel`, `RivalPanelControl`, `PlayerStatsModal`, `PlayerStatSubtractionModal`, `BenchPlayerStatsModal`, `PeriodSelectModal`, `ManualTimeModal`, `QuickAssignPlayerModal`), utilities (`formatPlayerIdentifier.ts`, `formatThrowStat.ts`, `courtArcPositions.ts`, `roster.ts`), and store cleanly structured under `src/features/play-match/` | **PASSED** |
| **III. Type-Safe Persistence** | Drizzle ORM + Expo SQLite schemas | Schema types inferred via Drizzle (`games`, `player_stats`) and strictly typed mutations mapped to DB schema | **PASSED** |
| **IV. Predictable State** | Focused Zustand stores | Centralized `usePlayMatchStore` managing global match state, isolated period states (`q1`-`extra`), roster, stint times, score event links, chronometer, timeouts, and stats | **PASSED** |
| **V. Utility-First Styling** | NativeWind / Tailwind classes | All UI styled with NativeWind `className` and basketball court tokens; dynamic layout constraints supported via responsive container styling | **PASSED** |
| **VI. Strict TypeScript** | Strict typing, no implicit `any` | Fully typed interfaces, props, and contracts in `contracts/play-match-contracts.ts` and `src/features/play-match/types/` | **PASSED** |

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
│       │   ├── TimeScoreFoulsController.tsx       # Component 1: Period control, crono, period scores & team fouls (overtime reset removed)
│       │   ├── TeamManagementCanvas.tsx           # Component 2: Responsive half-court canvas wrapper
│       │   ├── HalfCourtCanvas.tsx                # Component 2: 5 compact position buttons, responsive arc geometry, stint & 2s hold listener
│       │   ├── TeamManagementPanel.tsx            # Component 2: Unrestricted swap mode, compact bench scroll list, timeouts
│       │   ├── BenchPlayerStatsModal.tsx          # Component 2: High-prominence read-only bench player stats modal
│       │   ├── RivalPanelControl.tsx              # Component 3: Full-width rival score (+1,+2,+3,-1) & rival fouls (+1,-1)
│       │   ├── PlayerStatsModal.tsx               # Stats modal with t1/t2/t3, assists prompt ("non assistant"), rebounds, etc.
│       │   ├── PlayerStatSubtractionModal.tsx     # Stat subtraction modal with cascading assist reversal
│       │   ├── PeriodSelectModal.tsx              # 3-second long-press modal for direct period selection
│       │   ├── ManualTimeModal.tsx                # 3-second long-press modal for manual time entry + overtime reset action
│       │   ├── QuickAssignPlayerModal.tsx         # Quick assignment of bench player to empty court slot
│       │   └── StartingFiveModal.tsx              # Initial lineup selection modal for pending matches
│       ├── store/
│       │   └── usePlayMatchStore.ts               # Centralized Zustand global store managing match session state & score events
│       ├── utils/
│       │   ├── courtArcPositions.ts               # Dynamic court geometry & scaling calculations for responsive court canvas
│       │   ├── formatPlayerIdentifier.ts          # Pure utility for jersey number priority & name fallback formatting
│       │   ├── formatThrowStat.ts                 # Pure utility for s/a (#%) shooting format with zero-attempt safety
│       │   └── roster.ts                          # Roster initialization and player mapping helpers
│       ├── types/
│       │   └── index.ts                           # Public feature type definitions re-exported from contracts
│       └── index.ts                               # Feature public barrel export
├── page/
│   └── PlayMatch.tsx                              # Main screen container integrating the 3 components & store
├── components/
│   └── Header.tsx                                 # Application Header supporting enlarged score-only presentation
├── db/
│   └── schema.ts                                  # Drizzle SQLite schema for games and player stats
├── types/
│   └── database.ts                                # Inferred DB types
└── __tests__/
    └── features/
        └── play-match/
            ├── store/
            │   └── usePlayMatchStore.test.ts              # State store unit tests (stint tracking, score events, assist reversal, swap)
            ├── components/
            │   ├── TimeScoreFoulsController.test.tsx      # Component 1 tests (1-tap next, 3s hold modal, crono, fouls, no standalone reset button)
            │   ├── HalfCourtCanvas.test.tsx               # Component 2 tests (court buttons, compact circles, responsive positions, 2s hold)
            │   ├── TeamManagementPanel.test.tsx           # Component 2 tests (compact bench circles, unrestricted swap mode, timeouts)
            │   ├── BenchPlayerStatsModal.test.tsx         # Bench player stats modal tests (header, statline, backdrop, close)
            │   ├── RivalPanelControl.test.tsx             # Component 3 tests (full width, no total score, rival points/fouls)
            │   ├── PlayerStatsModal.test.tsx              # Stats modal & assist flow tests
            │   ├── PlayerStatSubtractionModal.test.tsx    # Stat subtraction modal tests
            │   ├── PeriodSelectModal.test.tsx             # Period selection modal tests
            │   ├── ManualTimeModal.test.tsx               # Manual time adjustment + extra time reset tests
            │   └── QuickAssignPlayerModal.test.tsx        # Quick assign modal tests
            ├── utils/
            │   ├── courtArcPositions.test.ts              # Unit tests for responsive court coordinate scaling
            │   ├── formatPlayerIdentifier.test.ts         # Unit tests asserting jersey priority, name fallback, and edge cases
            │   └── formatThrowStat.test.ts                # Unit tests asserting s/a (#%) shooting format and 0/0 (0%) edge case
            └── page/
                └── PlayMatch.test.tsx                     # Full integration test suite including score-only header
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *None* | Standard feature-based architecture adhering 100% to constitution | N/A |
