# Implementation Plan: Bottom Menu Navigation & Routing Performance Improvement

**Branch**: `003-bottom-navigation-routes` | **Date**: 2026-09-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-bottom-navigation-routes/spec.md`

## Summary

Refactor application navigation architecture by introducing a fixed `BottomNavBar.tsx` component at the bottom of the mobile viewport and converting `Header.tsx` into a top screen location banner that reflects active view title state (`headerTitle`). Inside team layout (`ClubProfile.tsx`), remove the "Editar Equipo / Settings" tab and view branch. Enhance `useMenuStore` Zustand state for high-performance (<100ms) tab switching.

## Technical Context

**Language/Version**: TypeScript 6.0 (Strict mode: `noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`)

**Primary Dependencies**: React Native 0.86, Expo 57, Zustand 5.0, NativeWind 4.2, `@expo/vector-icons`

**Storage**: Expo SQLite (`expo-sqlite`) with Drizzle ORM (`drizzle-orm`)

**Testing**: Jest 29, TDD First (Red-Green-Refactor)

**Target Platform**: Mobile App (iOS / Android / Expo runtime)

**Project Type**: Mobile App

**Performance Goals**: <100ms tab routing transition, 60 fps smooth tab switching

**Constraints**: NativeWind utility styling via `className`, fixed bottom navigation bar, Header strictly visual indicator, TDD first

**Scale/Scope**: `BottomNavBar.tsx`, `Header.tsx`, `MenuStore.ts`, `ClubProfile.tsx`, `ClubManage.tsx`, unit test suite.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: TDD First**: Pass. Unit tests will be written for `BottomNavBar` rendering, active tab state transitions in `useMenuStore`, and title updates before implementation.
- **Principle II: Feature-Based Architecture Pattern**: Pass. Navigation components decoupled through contracts in `src/components/` and state managed via `MenuStore`.
- **Principle III: Type-Safe Local Persistence**: Pass. Drizzle ORM schemas unaffected; data persistence preserved across tab switches.
- **Principle IV: Predictable State Management**: Pass. `MenuStore` handles `activeTab`, `headerTitle`, and `bottomMenuItems` immutably.
- **Principle V: Utility-First Mobile Styling**: Pass. `BottomNavBar` and `Header` styled using NativeWind `className` utility classes.
- **Principle VI: Strict TypeScript**: Pass. All contracts typed strictly; zero `any` usage in new navigation code.

## Project Structure

### Documentation (this feature)

```text
specs/003-bottom-navigation-routes/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── navigation-contracts.ts
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── page/
│   ├── ClubManage.tsx       # Entry point page view with bottom navigation layout
│   └── ClubProfile.tsx      # Team operational dashboard (settings removed)
├── components/
│   ├── BottomNavBar.tsx     # New fixed bottom navigation bar component
│   └── Header.tsx           # Refactored top header location indicator
├── store/
│   └── MenuStore.ts         # Zustand store for tab navigation & header title state
└── __tests__/
    ├── components/
    │   └── BottomNavBar.test.tsx  # TDD unit tests for bottom bar navigation
    └── store/
        └── MenuStore.test.ts     # TDD unit tests for navigation state
```

**Structure Decision**: Single React Native mobile application structure within `src/` following component and Zustand store separation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitution violations. Architecture adheres 100% to project principles.*
