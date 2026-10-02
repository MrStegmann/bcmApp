# Implementation Plan: Matches & New Match Workflow

**Branch**: `006-matches-and-new-match` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-matches-and-new-match/spec.md`

## Summary

Redesign the Match creation and execution workflow to enforce three mandatory inputs (`round`, `timeStamp` in `dd/mm/aaaa - hh:mm`, `rivalTeamName`), provide an optional roster declaration prompt on match creation, sort matches list with most recent matches first, enforce a blocking mandatory roster modal before starting games with missing rosters, and manage a robust three-state lifecycle (`pending` -> `inProgress` -> `finished`) integrated with a live chronograph in `PlayMatch.tsx`.

## Technical Context

**Language/Version**: TypeScript 5.3+ (Strict mode enabled)
**Primary Dependencies**: React Native 0.86+, Expo 57+, NativeWind (Tailwind CSS for React Native), Zustand, Drizzle ORM (`drizzle-orm`), Expo SQLite (`expo-sqlite`)
**Storage**: Local SQLite via Expo SQLite & Drizzle ORM (`games`, `player_stats`, `players`, `teams` tables)
**Testing**: Jest + React Native Testing Library
**Target Platform**: iOS & Android (Expo managed workflow)
**Project Type**: Mobile Application
**Performance Goals**: Instant match creation & list rendering (<100ms), 60 FPS chronograph and score interactions
**Constraints**: Offline-first local persistence, strict TDD workflow, NativeWind utility styling
**Scale/Scope**: Match creation form, roster selection modal, match card list sorting, `PlayMatch.tsx` screen with live chronograph

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Compliance | Status |
|---|---|---|---|
| **I. TDD First** | Unit & component tests written before implementation | Test suites for date validation, form submission, modal states, store transitions, and `PlayMatch` | **PASSED** |
| **II. Feature-Based Architecture** | Modular, encapsulated design | Reusable components (`RosterSelectionModal`, `GameForm`, `GameCards`, `PlayMatch`) integrated cleanly | **PASSED** |
| **III. Type-Safe Persistence** | Drizzle ORM + Expo SQLite schemas | Schema updated with `status`, `round`, `createdAt` and inferred types | **PASSED** |
| **IV. Predictable State** | Focused Zustand stores | `GameStore` manages `gamesList`, match transitions, and live state | **PASSED** |
| **V. Utility-First Styling** | NativeWind / Tailwind classes | All UI styled with NativeWind `className` | **PASSED** |
| **VI. Strict TypeScript** | Strict typing, no implicit `any` | Fully typed interfaces, props, and DB contracts | **PASSED** |

## Project Structure

### Documentation (this feature)

```text
specs/006-matches-and-new-match/
├── plan.md              # This file
├── research.md          # Phase 0 research findings & architectural decisions
├── data-model.md        # Phase 1 entity schemas & state machine
├── quickstart.md        # Phase 1 validation scenarios
├── contracts/           # Phase 1 interface & type contracts
│   └── match-contracts.ts
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── GameCards.tsx             # Match list cards with status badge & sorting
│   ├── GameForm.tsx              # Match creation form with 3 mandatory fields & validation
│   ├── RosterSelectionModal.tsx  # Reusable optional / mandatory roster selection modal
│   └── GameDetail.tsx            # Match details / stats inspector
├── page/
│   ├── GameList.tsx              # Matches container handling navigation & modals
│   └── PlayMatch.tsx             # Live match screen with chronograph & state transitions
├── store/
│   └── GameStore.ts              # Zustand store handling match CRUD, sorting & state machine
├── db/
│   └── schema.ts                 # Drizzle SQLite schema with match status & timestamps
├── types/
│   ├── database.ts               # Drizzle inferred types for games & rosters
│   └── match.ts                  # Match domain types & contracts
└── __tests__/
    ├── components/
    │   ├── GameForm.test.tsx     # Form validation tests
    │   ├── RosterModal.test.tsx  # Optional & mandatory modal tests
    │   └── PlayMatch.test.tsx    # Live chronograph & finish flow tests
    └── store/
        └── GameStore.test.ts     # Match sorting & state transition unit tests
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *None* | Standard feature-based architecture adhering 100% to constitution | N/A |
