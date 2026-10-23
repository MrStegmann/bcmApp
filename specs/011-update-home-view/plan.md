# Implementation Plan: Update Home View Page

**Branch**: `011-update-home-view` | **Date**: 2026-10-23 | **Spec**: [specs/011-update-home-view/spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/011-update-home-view/spec.md)

**Input**: Feature specification from `specs/011-update-home-view/spec.md`

---

## Summary

Update the Team Home View dashboard (`ClubProfile` when `option === TopMenuEnums.MAIN`) to present three essential operational and analytical components in exact vertical sequence (from top to bottom):
1. **Next Match Ahead (`NextMatchCard`)**: Displays the earliest chronologically scheduled uninitialized fixture (rival name and date), with a fast-action button to configure player roster callups via `RosterSelectionModal`, or the exact fallback text `"Sin próximos partidos agendados"`.
2. **Last Three Matches Played (`RecentMatchesColumn`)**: Displays up to 3 most recently finished games in a vertical column (sorted newest first), showing total score, period-by-period score breakdown directly underneath, and an interactive action to open `MatchDetailView`.
3. **Global Stats (`GlobalStatsCard`)**: Displays aggregated arithmetic means across all completed matches for the eight advanced efficiency metrics (`Posesiones`, `OER`, `DER`, `eFG%`, `ORB%`, `AST%`, `TOV%`, `FTR`), with division-by-zero safeguards and clean percentage formatting.

The implementation follows a self-contained feature architecture (`src/features/home-view/`) with a dedicated Zustand store (`useHomeViewStore`), batch SQLite queries via Drizzle ORM to prevent N+1 queries, NativeWind styling, and complete test-driven development (TDD) coverage using Jest and React Native Testing Library.

---

## Technical Context

**Language/Version**: TypeScript 5.7+ / React 19.2 (React Native 0.86.3)

**Primary Dependencies**: Expo SDK 57, NativeWind v4, Zustand v5, Drizzle ORM v0.45, `@expo/vector-icons`

**Storage**: Local relational SQLite via `expo-sqlite` and `drizzle-orm` (`teams`, `games`, `player_stats`)

**Testing**: Jest v29 with React Native Testing Library (`@testing-library/react-native`)

**Target Platform**: Mobile (Android & iOS via Expo managed workflow) and Web

**Project Type**: React Native Mobile App

**Performance Goals**:
- Dashboard initial render in under 1 second (< 1000ms, SC-001)
- Roster modal launch in under 500ms (SC-004)
- Navigation transition to Match Detail View in under 1 second (SC-006)
- Batch query execution time < 50ms for 20+ matches

**Constraints**:
- Strict vertical ordering from top to bottom (Next Match, Recent Matches, Global Stats)
- Single vertical column layout inside a scrollable container
- Zero division-by-zero crashes or `NaN`/`Infinity` text on empty states
- Offline-first execution: all calculations and data persistence are 100% on-device

**Scale/Scope**: Active team context with 10–50 matches per season and 12–25 players per team

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Verification |
|---|---|---|---|
| **I. TDD First** | Jest & RTL tests written before code implementation (Red-Green-Refactor) | **PASSED** | Tests specified for `useHomeViewStore`, `matchDateHelper`, `statsCalculator`, and UI cards before implementation |
| **II. Feature-Based Architecture** | Domain feature encapsulated in `src/features/<feature>/` with barrel export `index.ts` | **PASSED** | Self-contained module at `src/features/home-view/`, `ClubProfile` consumes public API |
| **III. Type-Safe Persistence** | Drizzle ORM + expo-sqlite with type inference; no raw untyped SQL | **PASSED** | Uses Drizzle queries with `eq` and `inArray` over typed schemas (`games`, `playerStats`) |
| **IV. Predictable State** | Focused Zustand stores per feature; immutable transitions | **PASSED** | Feature state managed via `useHomeViewStore` with pure actions and selectors |
| **V. Utility-First Styling** | NativeWind utility classes via `className`; design tokens from `tailwind.config.js` | **PASSED** | Dark-mode palette (`bg-danish-dark-gray`, `text-danish-white`, `border-danish-red`, `border-danish-gold`) via `className` |
| **VI. Strict TypeScript** | Strict typing enabled; no implicit or arbitrary `any` | **PASSED** | Strict TypeScript interfaces in `contracts/` and `src/features/home-view/types/` |

---

## Project Structure

### Documentation (this feature)

```text
specs/011-update-home-view/
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 decisions & architectural rationale
├── data-model.md        # Phase 1 entities, schemas, and state transitions
├── quickstart.md        # Phase 1 runnable validation guide
├── contracts/           # Phase 1 interface definitions
│   ├── home-view.contract.ts
│   └── stats-calculator.contract.ts
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code Layout

```text
src/
├── features/
│   └── home-view/
│       ├── HomeView.tsx                  # Main container rendering the 3 sections in vertical order
│       ├── index.ts                      # Feature public API barrel export
│       ├── components/
│       │   ├── NextMatchCard.tsx         # Section 1: Top upcoming match card & roster quick-action
│       │   ├── RecentMatchesColumn.tsx   # Section 2: Middle column of up to 3 played matches
│       │   ├── RecentMatchCard.tsx       # Individual match card with total & period scores
│       │   └── GlobalStatsCard.tsx       # Section 3: Bottom grid with 8 advanced efficiency averages
│       ├── store/
│       │   └── useHomeViewStore.ts       # Zustand store managing home dashboard data & lifecycle
│       ├── types/
│       │   └── index.ts                  # Domain & component contracts (NextMatchEntry, RecentMatchSummary, etc.)
│       ├── utils/
│       │   ├── matchDateHelper.ts        # Robust chronological date parsing, sorting, and tie-breaking
│       │   └── statsCalculator.ts        # Advanced efficiency formulas and arithmetic mean aggregations
│       └── __tests__/
│           ├── HomeView.test.tsx
│           ├── useHomeViewStore.test.ts
│           ├── matchDateHelper.test.ts
│           ├── statsCalculator.test.ts
│           └── components/
│               ├── NextMatchCard.test.tsx
│               ├── RecentMatchesColumn.test.tsx
│               └── GlobalStatsCard.test.tsx
└── page/
    └── ClubProfile.tsx                   # Integrates HomeView when option === TopMenuEnums.MAIN
```

**Structure Decision**:
Organized cleanly as a self-contained domain feature under `src/features/home-view/` matching existing features (`match-detail` and `play-match`). `ClubProfile.tsx` is updated to replace its current placeholder text with `<HomeView />`, delegating match detail opening and refreshing back into `ClubProfile`'s active view state.

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitutional violations identified. Standard feature-based architecture patterns, Drizzle queries, and Zustand stores are employed throughout.*
