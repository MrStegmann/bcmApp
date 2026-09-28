# Implementation Plan: Refactor Club Manager View Page

**Branch**: `002-club-manager-view` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-club-manager-view/spec.md`

## Summary

Refactor `ClubManage.tsx` to best practice standards and optimal performance as the entry point of the application. The page renders the list of teams created, enabling coaches and administrators to create, edit, delete, or enter the active dashboard of a selected team using Zustand state management (`useClubStore`, `useMenuStore`), NativeWind CSS styling, and Expo SQLite local persistence via `useDB`.

## Technical Context

**Language/Version**: TypeScript 6.0 (Strict mode: `noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`)

**Primary Dependencies**: React Native 0.86, Expo 57, Zustand 5.0, NativeWind 4.2

**Storage**: Expo SQLite (`expo-sqlite`) with Drizzle ORM (`drizzle-orm`)

**Testing**: Jest 29, TDD First (Red-Green-Refactor)

**Target Platform**: Mobile App (iOS / Android / Expo runtime)

**Project Type**: Mobile App

**Performance Goals**: <100ms team selection transition, 60 fps smooth list scrolling

**Constraints**: NativeWind utility styling via `className`, TDD first, clean Zustand store access

**Scale/Scope**: 1 page view (`ClubManage.tsx`), team card list component (`ClubList.tsx`), team form (`ClubForm.tsx`), team profile (`ClubProfile.tsx`), confirmation dialog (`DeleteModal.tsx`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: TDD First**: Pass. Unit tests will be written for `ClubManage` empty state, team selection, creation, and deletion before implementation.
- **Principle II: Feature-Based Architecture**: Pass. UI components in `src/page/` and `src/components/` decoupled cleanly through store contracts.
- **Principle III: Type-Safe Local Persistence**: Pass. Drizzle ORM schemas and relations used for SQLite persistence.
- **Principle IV: Predictable State Management**: Pass. `ClubStore` handles team list state and active selection immutably.
- **Principle V: Utility-First Mobile Styling**: Pass. All components styled via NativeWind `className` tokens.
- **Principle VI: Strict TypeScript**: Pass. Strict type props and DTOs; zero `any` usage.

## Project Structure

### Documentation (this feature)

```text
specs/002-club-manager-view/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── ui-contracts.ts
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── page/
│   └── ClubManage.tsx       # Refactored entry point page view
├── components/
│   ├── ClubList.tsx         # Team card listing component
│   ├── ClubForm.tsx         # Create / Edit team form component
│   └── ClubProfile.tsx      # Team detail overview component
├── framework/
│   └── DeleteModal.tsx      # Confirmation dialog component
├── store/
│   ├── ClubStore.ts         # Zustand store for team CRUD & active team
│   └── MenuStore.ts         # Top menu navigation store
└── __tests__/
    └── components/
        └── ClubManage.test.tsx  # TDD unit tests
```

**Structure Decision**: Single React Native mobile application structure within `src/` following feature component layout and Zustand store separation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitution violations. Architecture adheres 100% to project principles.*
