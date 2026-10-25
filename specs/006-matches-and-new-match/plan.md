# Implementation Plan: Matches & New Match Workflow (Date-Only Mask & Match List Roster Management)

**Branch**: `006-matches-and-new-match` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-matches-and-new-match/spec.md` (Updated 2026-10-25 with On-Demand Match List Roster Selection)

## Summary

Enhance the Matches feature with streamlined date-only creation and flexible, on-demand roster management directly from the matches list view:
1. **Date-Only Numeric Mask**: Streamline Match Creation (`GameForm.tsx`) to accept strict `dd/mm/aaaa` dates with numeric filtering and auto-slashing, eliminating hours/minutes.
2. **Dedicated Match List Roster Button**: Add a dedicated roster button to every match card in `GameCards.tsx` (using Feather `users` icon with >= 40x40 touch target).
3. **Conditional Enablement Logic**: Enable the roster button for upcoming matches (`pending`); disable/restrict it visually and interactively for `inProgress` and `finished` matches.
4. **On-Demand Roster Editing & Persistence**: Wire up `GameList.tsx` to load existing called-up players, display `RosterSelectionModal`, allow repeated additions/removals (including empty roster reset), and persist via `GameController.saveCalledUpPlayers`.
5. **Mandatory Guard & State Machine**: Retain mandatory roster gating when starting an unrostered match, and manage match state transitions (`pending` -> `inProgress` -> `finished`).

## Technical Context

**Language/Version**: TypeScript 5.3+ (Strict mode enabled)  
**Primary Dependencies**: React Native 0.86+, Expo 57+, NativeWind (Tailwind CSS for React Native), Zustand, Drizzle ORM (`drizzle-orm`), Expo SQLite (`expo-sqlite`)  
**Storage**: Local SQLite via Expo SQLite & Drizzle ORM (`games`, `player_stats`, `players`, `teams` tables)  
**Testing**: Jest + React Native Testing Library  
**Target Platform**: iOS & Android (Expo managed workflow)  
**Project Type**: Mobile Application  
**Performance Goals**: Keystroke formatting (<16ms, 60fps), roster modal load & save (<50ms), matches list scrolling (60fps)  
**Constraints**: Offline-first local persistence, strict TDD workflow, NativeWind utility styling, touch target accessibility (>= 40x40 min touch areas)  
**Scale/Scope**: `GameCards.tsx`, `GameList.tsx`, `RosterSelectionModal.tsx`, `GameForm.tsx`, `match-contracts.ts`, and corresponding Jest test suites  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Compliance | Status |
|---|---|---|---|
| **I. TDD First** | Unit & component tests written before implementation | Test suites in `src/__tests__/components/GameCards.test.tsx` and `src/__tests__/page/GameList.test.tsx` asserting button visibility, conditional enablement, and roster mutation callbacks | **PASSED** |
| **II. Feature-Based Architecture** | Modular, encapsulated design | Reusable components (`GameCards`, `GameList`, `RosterSelectionModal`, `GameForm`) cleanly separated with typed props and decoupled contracts | **PASSED** |
| **III. Type-Safe Persistence** | Drizzle ORM + Expo SQLite schemas | Roster associations persist to SQLite via typed `GameController` methods (`getCalledUpPlayers`, `saveCalledUpPlayers`) adhering to Drizzle schema | **PASSED** |
| **IV. Predictable State** | Focused Zustand stores | `GameStore` and local component states maintain clear lifecycle states and predictable data flow without monolithic side effects | **PASSED** |
| **V. Utility-First Styling** | NativeWind / Tailwind classes | All new UI elements styled using NativeWind `className` utilities matching dark theme tokens (`bg-slate-dark`, `border-slate-border`, `text-primary`) | **PASSED** |
| **VI. Strict TypeScript** | Strict typing, no implicit `any` | Fully typed interfaces in `match-contracts.ts`, `database.ts`, and component prop interfaces with zero `any` usage | **PASSED** |

## Project Structure

### Documentation (this feature)

```text
specs/006-matches-and-new-match/
├── plan.md              # This implementation plan
├── research.md          # Architectural decisions & research outcomes
├── data-model.md        # Entities, state machine & roster permissions matrix
├── quickstart.md        # Step-by-step verification scenarios
├── contracts/           # Component & API contracts
│   └── match-contracts.ts
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── GameCards.tsx             # Match list cards with dedicated roster button & conditional enablement
│   ├── GameForm.tsx              # Match creation form with date-only mask
│   ├── RosterSelectionModal.tsx  # Modal for optional, mandatory, and on-demand roster editing
│   └── GameDetail.tsx            # Match details / stats inspector
├── framework/
│   └── Input.tsx                 # Base input with date-only auto-masking support
├── page/
│   ├── GameList.tsx              # Matches container orchestrating on-demand roster editing & navigation
│   └── PlayMatch.tsx             # Live match screen with chronograph & lifecycle transitions
├── store/
│   └── GameStore.ts              # Zustand store handling match CRUD, sorting & state transitions
├── utils/
│   └── dateValidation.ts         # Date-only regex, leap year calendar checks & backward compatibility
├── types/
│   ├── database.ts               # Drizzle inferred types for games & rosters
│   └── match.ts                  # Match domain types & contracts
└── __tests__/
    ├── components/
    │   ├── GameCards.test.tsx    # Roster button presence, state checks & interaction tests
    │   ├── GameForm.test.tsx     # Form validation & date-masking tests
    │   └── RosterModal.test.tsx  # Optional, mandatory & on-demand modal tests
    └── utils/
        └── dateValidation.test.ts# Date-only validation unit tests
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *None* | Standard feature-based architecture adhering 100% to constitution | N/A |
