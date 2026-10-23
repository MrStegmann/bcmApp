# Implementation Plan: Matches & New Match Workflow (Date-Only Mask & Roster Enforcement)

**Branch**: `006-matches-and-new-match` | **Date**: 2026-10-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-matches-and-new-match/spec.md` (Updated 2026-10-23)

## Summary

Update the Match Creation form (`GameForm.tsx`) to implement a streamlined date-only input field adhering to the `dd/mm/aaaa` format:
1. **Remove Time Component**: Eliminate the hour/time selection from the UI, validation, and payloads.
2. **Numeric-Only Restriction**: Enforce key/input filtering that strictly allows digits `0-9` and blocks all letters, symbols, and whitespace.
3. **Automatic Formatting Mask**: Automatically format consecutive digits into `dd/mm/aaaa` (e.g. `23102026` -> `23/10/2026`) as the user types, handling backspaces gracefully.
4. **Validation & Payloads**: Validate calendar validity (including leap years and variable month lengths) and pass the clean date-only string (`dd/mm/aaaa`) in form state and SQLite payloads.
5. **Existing Workflow Integration**: Preserve optional roster selection prompt on match creation, top-of-list ordering, mandatory roster modal before match start, and match lifecycle management (`pending` -> `inProgress` -> `finished`) with live chronograph in `PlayMatch.tsx`.

## Technical Context

**Language/Version**: TypeScript 5.3+ (Strict mode enabled)  
**Primary Dependencies**: React Native 0.86+, Expo 57+, NativeWind (Tailwind CSS for React Native), Zustand, Drizzle ORM (`drizzle-orm`), Expo SQLite (`expo-sqlite`)  
**Storage**: Local SQLite via Expo SQLite & Drizzle ORM (`games`, `player_stats`, `players`, `teams` tables)  
**Testing**: Jest + React Native Testing Library  
**Target Platform**: iOS & Android (Expo managed workflow)  
**Project Type**: Mobile Application  
**Performance Goals**: Instant keystroke formatting (<16ms, 60fps), match creation & list rendering (<100ms)  
**Constraints**: Offline-first local persistence, strict TDD workflow, NativeWind utility styling, non-disruptive backward compatibility with existing match timestamps  
**Scale/Scope**: `GameForm.tsx`, `Input.tsx`, `dateValidation.ts`, `matchDateHelper.ts`, `GameStore.ts`, `match-contracts.ts`, and corresponding Jest test suites  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Compliance | Status |
|---|---|---|---|
| **I. TDD First** | Unit & component tests written before implementation | Test suites written in `src/__tests__/` asserting date masking, numeric restrictions, calendar boundaries, leap years, and form submission | **PASSED** |
| **II. Feature-Based Architecture** | Modular, encapsulated design | Reusable components (`Input`, `GameForm`, `RosterSelectionModal`, `GameCards`, `PlayMatch`) properly decoupled with clear barrel/public boundaries | **PASSED** |
| **III. Type-Safe Persistence** | Drizzle ORM + Expo SQLite schemas | Schema `games.date` column stores validated date string; types inferred with Drizzle `$inferSelect` / `$inferInsert` | **PASSED** |
| **IV. Predictable State** | Focused Zustand stores | `GameStore` and `ClubStore` maintain single source of truth for match creation and state transitions | **PASSED** |
| **V. Utility-First Styling** | NativeWind / Tailwind classes | All UI styled with NativeWind `className` utilities matching the app's Danish color palette | **PASSED** |
| **VI. Strict TypeScript** | Strict typing, no implicit `any` | Fully typed interfaces, props, and contracts in `src/types/match.ts` and `match-contracts.ts` | **PASSED** |

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
│   ├── GameForm.tsx              # Match creation form with 3 mandatory fields (date-only mask)
│   ├── RosterSelectionModal.tsx  # Reusable optional / mandatory roster selection modal
│   └── GameDetail.tsx            # Match details / stats inspector
├── framework/
│   └── Input.tsx                 # Base input supporting numeric keyboard & date-masking
├── page/
│   ├── GameList.tsx              # Matches container handling navigation & modals
│   └── PlayMatch.tsx             # Live match screen with chronograph & state transitions
├── store/
│   └── GameStore.ts              # Zustand store handling match CRUD, sorting & state machine
├── utils/
│   └── dateValidation.ts         # Date-only regex, leap year calendar checks & backward compatibility
├── features/
│   └── home-view/utils/
│       └── matchDateHelper.ts    # Match sorting supporting both date-only & legacy timestamps
├── db/
│   └── schema.ts                 # Drizzle SQLite schema with match status & timestamps
├── types/
│   ├── database.ts               # Drizzle inferred types for games & rosters
│   └── match.ts                  # Match domain types & contracts
└── __tests__/
    ├── components/
    │   ├── GameForm.test.tsx     # Form validation & date-masking tests
    │   ├── RosterModal.test.tsx  # Optional & mandatory modal tests
    │   └── PlayMatch.test.tsx    # Live chronograph & finish flow tests
    ├── utils/
    │   └── dateValidation.test.ts# Date-only regex, leap year, and boundary tests
    └── store/
        └── GameStore.test.ts     # Match sorting & state transition unit tests
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *None* | Standard feature-based architecture adhering 100% to constitution | N/A |
