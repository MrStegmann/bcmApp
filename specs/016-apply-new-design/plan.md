# Implementation Plan: Apply CourtVision Kinetic Design

**Branch**: `016-apply-new-design` | **Date**: 2026-10-25 | **Spec**: [specs/016-apply-new-design/spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/spec.md)

**Input**: Feature specification from `specs/016-apply-new-design/spec.md` and design specifications from `DESIGN.md`.

---

## Summary

The objective is to apply the new CourtVision Kinetic design system defined in `DESIGN.md` across the entire BasketApp (`bcmApp`) mobile application using NativeWind (Tailwind CSS v3 engine on React Native) without altering existing application logic or architecture.

Key implementation pillars:
1. **Centralized Token Configuration**: Configure `tailwind.config.js` with all CourtVision Kinetic design tokens (deep athletic slate surfaces, vibrant court orange, tactical sky blue, typography scales, spacing units, and border-radius rules) while preserving legacy aliases for backward compatibility.
2. **Systematic Component Restyling**: Update `className` props across all screens, modals, cards, and buttons to match the new visual tokens, replacing hardcoded legacy colors and inline styles.
3. **Ergonomic Touch Targets**: Ensure all interactive controls and scoring triggers meet or exceed the 48x48px accessible touch standard.
4. **Zero Functional Regressions**: Guarantee 100% preservation of all component state logic, hooks, handlers, Zustand stores, and Drizzle SQLite operations, confirmed by 100% pass rate across the 87 automated test suites.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 18+  
**Primary Dependencies**: React Native 0.86.3, Expo ~57.0.25, NativeWind ^4.2.1, Tailwind CSS ^3.4.17, Zustand ^5.0.8, Drizzle ORM ^0.45.3, Expo SQLite ~57.0.3  
**Storage**: SQLite via `expo-sqlite` and `drizzle-orm` (No schema changes required)  
**Testing**: Jest ^29.7.0, React Native Testing Library (87 test suites, 503 tests)  
**Target Platform**: iOS 15+ and Android 10+ (Expo managed workflow)  
**Project Type**: Mobile Application (React Native / Expo)  
**Performance Goals**: 60 fps smooth scrolling, zero render regressions, instant tap responsiveness on 48x48px hit areas  
**Constraints**: Zero codebase modifications outside styling (`className` props & `tailwind.config.js`); no breaking changes to hooks, stores, or database persistence  
**Scale/Scope**: ~30 UI component and page files across 7 domain modules  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Assessment | Gate Status |
|-----------|-------------|------------|-------------|
| **I. Test-Driven Development First** | 100% tests passing, no untested business logic | All 87 test suites and 503 unit/integration tests must pass before and after styling edits. | **PASSED** |
| **II. Feature-Based Architecture** | Encapsulated feature domains, explicit public APIs | Component directory structures and public exports are untouched. | **PASSED** |
| **III. Type-Safe Local Persistence** | Drizzle ORM with expo-sqlite, typed queries | No database schemas or queries are modified. | **PASSED** |
| **IV. Predictable State Management** | Zustand stores for state | Zero modifications to Zustand stores or state transitions. | **PASSED** |
| **V. Utility-First Mobile Styling** | NativeWind styling with centralized design tokens | Fully aligns with Principle V: updates `tailwind.config.js` with official tokens and eliminates ad-hoc / inline styles. | **PASSED** |
| **VI. Strict TypeScript** | Strict typing with zero implicit `any` | All existing TypeScript types and props interfaces are preserved intact. | **PASSED** |

**Pre-Phase 0 Gate Result**: **PASSED**  
**Post-Phase 1 Gate Result**: **PASSED**

---

## Project Structure

### Documentation (this feature)

```text
specs/016-apply-new-design/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Phase 0 research decisions
├── data-model.md        # Phase 1 design tokens & component style profiles
├── quickstart.md        # Phase 1 validation scenarios
└── contracts/           # Phase 1 contracts
    ├── tailwind-theme.contract.json       # JSON Schema contract for tailwind.config.js
    └── component-styling.contract.md     # Styling & touch target guidelines
```

### Source Code (repository root)

```text
bcmApp/
├── App.tsx                                    # Root app container & background
├── tailwind.config.js                         # Centralized CourtVision Kinetic tokens
├── index.css                                  # Global Tailwind directives
├── src/
│   ├── framework/                             # Reusable UI primitives
│   │   ├── Button.tsx                         # Primary, secondary, outline button styling
│   │   ├── Input.tsx                          # Dark slate input with sky blue focus ring
│   │   ├── ModalInfo.tsx                      # Information alert modal styling
│   │   └── DeleteModal.tsx                    # Destructive action modal styling
│   ├── components/                            # Domain UI components
│   │   ├── Header.tsx                         # App header bar (deep slate + structural border)
│   │   ├── BottomNavBar.tsx                   # Bottom navigation bar (court orange active icons)
│   │   ├── ClubForm.tsx & ClubList.tsx        # Club management views
│   │   ├── PlayerCards.tsx & PlayerForm.tsx   # Player roster cards & forms
│   │   ├── PlayerDetail.tsx                   # Player profile & metrics
│   │   ├── PlayerStatsModal.tsx               # Quick-scoring sideline dialog (48px targets)
│   │   ├── RosterSelectionModal.tsx           # Match roster picker dialog
│   │   ├── GameCards.tsx & GameForm.tsx       # Match cards & scheduling form
│   │   ├── GamesResults.tsx & GameDetail.tsx  # Match box scores & quarter tabs
│   │   ├── StartingFiveModal.tsx              # Match starting five lineup selector
│   │   ├── SubstitutionPanel.tsx              # Bench substitution controls (48px targets)
│   │   ├── RivalControlPanel.tsx              # Opponent score & foul tracking
│   │   └── HalfCourt.tsx                      # Basketball court diagram & shot markers
│   ├── page/                                  # Full-screen page orchestrators
│   │   ├── ClubManage.tsx & ClubProfile.tsx   # Club management screens
│   │   ├── PlayerList.tsx                     # Team player roster screen
│   │   ├── GameList.tsx                       # Matches list & tournament schedule
│   │   └── PlayMatch.tsx                      # Live match game flow screen
│   ├── features/                              # Feature-based architecture domains
│   │   ├── home-view/                         # Home dashboard widgets
│   │   │   └── components/                    # GlobalStatsCard, NextMatchCard, RecentMatches
│   │   ├── match-detail/                      # Match analytics & box score
│   │   │   └── components/                    # RosterValuationList, QuarterScoring
│   │   └── play-match/                        # Live game engine & controls
│   └── __tests__/                             # Automated test suites
```

**Structure Decision**: Retain the existing React Native application layout, applying visual changes strictly to `tailwind.config.js`, `App.tsx`, `src/framework/*`, `src/components/*`, `src/page/*`, and `src/features/*`.

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None*    | *No constitutional violations* | *All changes conform to established principles* |

---

## Phased Implementation Roadmap

### Phase 0: Outline & Research (Complete)
- [x] Investigate NativeWind v4 theme extension capabilities for colors, spacing, borderRadius, and typography.
- [x] Resolve font family fallbacks for cross-platform iOS and Android rendering without native asset linking.
- [x] Formulate 48x48px touch target enforcement strategy for mobile ergonomic compliance.
- [x] Create and finalize [research.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/research.md).

### Phase 1: Design & Contracts (Complete)
- [x] Extract design token hierarchy and component visual profiles into [data-model.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/data-model.md).
- [x] Produce formal theme JSON schema contract in [contracts/tailwind-theme.contract.json](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/contracts/tailwind-theme.contract.json).
- [x] Establish component styling and touch target guidelines in [contracts/component-styling.contract.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/contracts/component-styling.contract.md).
- [x] Write end-to-end runnable validation scenarios in [quickstart.md](file:///j:/GitHub/BasketApp/bcmApp/specs/016-apply-new-design/quickstart.md).

### Phase 2: Implementation Sequencing (For `/speckit-tasks`)
The upcoming tasks will be structured in domain-driven batches:
1. **Task Batch 1 - Theme Token Engine**: Update `tailwind.config.js` with CourtVision Kinetic tokens.
2. **Task Batch 2 - Framework & Navigation Shell**: Update `App.tsx`, `Header.tsx`, `BottomNavBar.tsx`, and `src/framework/*`.
3. **Task Batch 3 - Club & Profile Modules**: Restyle `ClubManage.tsx`, `ClubProfile.tsx`, `ClubForm.tsx`, and `ClubList.tsx`.
4. **Task Batch 4 - Player & Roster Management**: Restyle `PlayerList.tsx`, `PlayerCards.tsx`, `PlayerDetail.tsx`, `PlayerForm.tsx`, `PlayerStatsModal.tsx`, and `RosterSelectionModal.tsx`.
5. **Task Batch 5 - Matches & History**: Restyle `GameList.tsx`, `GameCards.tsx`, `GameForm.tsx`, `GamesResults.tsx`, and `GameDetail.tsx`.
6. **Task Batch 6 - Feature Domains**: Restyle `src/features/home-view/*` and `src/features/match-detail/*`.
7. **Task Batch 7 - Live Match & Court Controls**: Restyle `PlayMatch.tsx`, `src/features/play-match/*`, `StartingFiveModal.tsx`, `SubstitutionPanel.tsx`, `RivalControlPanel.tsx`, and `HalfCourt.tsx`.
8. **Task Batch 8 - Full Quality Gate & Cross-Platform Verification**: Run `npm test` across all 87 test suites and verify complete test suite pass rate.
