# Implementation Plan: Navbar Icons, Go Back Button & Residual Cleanup

**Branch**: `005-navbar-icons-and-back-button` | **Date**: 2026-09-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-navbar-icons-and-back-button/spec.md`

## Summary

This feature updates the visual design and navigation UX of the mobile application while cleaning up technical debt:
1. Strips text labels from bottom navigation bar links, displaying exclusively icons.
2. Repositions the "Home" navigation item as the first element on the far left of the navbar.
3. Introduces a left-aligned "Go Back" button in the `Header` component powered by `MenuStore`, enabling users to return seamlessly from create/edit form views and detail views in Players, Games, and Trainings.
4. Updates Header styling to straight horizontal bottom edges (removing `rounded-b-3xl`).
5. Completely purges deprecated Calendar and Fees files, database tables, stores, hooks, and references.

## Technical Context

**Language/Version**: TypeScript 5+ with strict mode enabled (`noImplicitAny: true`, `strictNullChecks: true`)

**Primary Dependencies**: React 19, React Native 0.86, Expo 57, NativeWind 4, Zustand 5, Drizzle ORM 0.45, `@expo/vector-icons`, `react-native-safe-area-context`

**Storage**: SQLite via `expo-sqlite` and `drizzle-orm` (strictly local, offline-first relational persistence)

**Testing**: Jest 29 with React Native Testing Library (100% test pass rate required)

**Target Platform**: iOS and Android (Expo Managed Workflow)

**Project Type**: Mobile Application

**Performance Goals**: 60fps navigation transitions, sub-100ms state updates, zero layout shifts on safe area measurement

**Constraints**: Strict TDD first, utility-first NativeWind styling, zero `any` types, zero residual files/schemas

**Scale/Scope**: 5 core views (`ClubManage`, `ClubProfile`, `PlayerList`, `GameList`, `TrainingList`), 2 navigation components (`Header`, `BottomNavBar`), 1 store (`MenuStore`), 1 database schema (`schema.ts`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Compliance | Status |
|---|---|---|---|
| **I. TDD First** | All store transitions, components, and DB schemas developed test-first in Jest | Unit tests for `MenuStore`, `Header`, `BottomNavBar`, `ClubProfile`, and DB cascades written/updated before code changes | **PASS** |
| **II. Feature-Based Architecture** | Modular components and stores with explicit contracts | All UI state changes encapsulated in `src/store/MenuStore` and dedicated component files | **PASS** |
| **III. Type-Safe Persistence** | Drizzle ORM schemas with type inference, strict foreign keys | Cleaned `src/db/schema.ts` without fees table; verified cascade and connection integrity | **PASS** |
| **IV. Zustand State Management** | Focused stores with immutable updates | `MenuStore` extended with `headerBackAction` and `setHeaderBackAction` with atomic setters | **PASS** |
| **V. NativeWind Utility Styling** | Utility classes via `className`, no ad-hoc inline styles unless dynamic insets | Pure NativeWind classes for icon layouts, padding, colors, and borders; straight corners via Tailwind class removal | **PASS** |
| **VI. Strict TypeScript** | Zero `any` types, strict null checks | All props and store states explicitly typed with strict interfaces | **PASS** |

## Project Structure

### Documentation (this feature)

```text
specs/005-navbar-icons-and-back-button/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Technical research and design decisions
├── data-model.md        # State model, contracts, and schema definitions
├── quickstart.md        # Verification and scenario guide
├── contracts/
│   └── navigation-header.contract.md # UI component interface contracts
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Implementation tasks (generated in next phase)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── BottomNavBar.tsx      # Remove text labels, keep icons only
│   ├── Header.tsx            # Left Go Back button, straight corners
│   ├── PlayerDetail.tsx      # Clean residual fees/calendar references
│   ├── GameDetail.tsx        # Details view with back navigation
│   ├── TrainingDetail.tsx    # Details view with back navigation
│   ├── PlayerCards.tsx       # Player list cards
│   ├── GameCards.tsx         # Game list cards
│   └── TraningCards.tsx      # Training list cards
├── page/
│   ├── ClubProfile.tsx       # Reorder navbar items (Home first), clean residual texts
│   ├── PlayerList.tsx        # Connect headerBackAction on Form/Detail open/close
│   ├── GameList.tsx          # Connect headerBackAction on Form/Detail open/close
│   ├── TrainingList.tsx      # Connect headerBackAction on Form/Detail open/close
│   └── Calendar.tsx          # (DELETE)
├── store/
│   ├── MenuStore.ts          # Add headerBackAction, setHeaderBackAction
│   ├── FeesStore.ts          # (DELETE)
│   └── ClubStore.ts          # Active team/club state
├── db/
│   ├── schema.ts             # Remove fees table and relations
│   ├── seed.ts               # Remove seedFees seeder
│   └── index.ts              # Database initialization
├── hooks/
│   └── useDB.ts              # Remove FeesController
├── types/
│   ├── database.ts           # Remove Fee types
│   ├── store.ts              # Remove FeesStore types
│   └── enums.ts              # Keep clean enums
└── __tests__/
    ├── components/
    │   ├── BottomNavBar.test.tsx
    │   ├── Header.test.tsx
    │   └── ClubProfile.test.tsx
    ├── store/
    │   └── MenuStore.test.ts
    └── db/
        ├── connection.test.ts
        └── cascade.test.ts
```

## Implementation Phases Overview

- **Phase 1 (Residual Cleanup)**: Delete `Calendar.tsx`, `FeesStore.ts`, remove `fees` schema in `schema.ts`, seeder in `seed.ts`, `FeesController` in `useDB.ts`, and prune types in `database.ts`/`store.ts`. Update DB test suites.
- **Phase 2 (Store & Header Foundation)**: Add `headerBackAction` to `MenuStore.ts` with unit tests. Update `Header.tsx` to render straight corners and left "Go Back" button with unit tests.
- **Phase 3 (Bottom Navbar Icon-Only & Order)**: Update `BottomNavBar.tsx` to omit text labels. Update `ClubProfile.tsx` to set `MAIN` (Home) as first item (index 0) and clean description text.
- **Phase 4 (Sub-View Header Back Navigation)**: Update `PlayerList.tsx`, `GameList.tsx`, and `TrainingList.tsx` to register/unregister `headerBackAction` when navigating into/out of form views and detail views.
- **Phase 5 (Verification & Polish)**: Full test execution (`npx jest`) and strict TypeScript type check (`npx tsc --noEmit`).

## Complexity Tracking

*No constitution violations. Zero unjustified complexity.*
