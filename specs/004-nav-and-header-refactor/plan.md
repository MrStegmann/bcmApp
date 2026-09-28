# Implementation Plan: Navigation and Header Refactor

**Branch**: `004-nav-and-header-refactor` | **Date**: 2026-09-28 | **Spec**: [spec.md](file:///j:/GitHub/BasketApp/bcmApp/specs/004-nav-and-header-refactor/spec.md)

**Input**: Feature specification from [`/specs/004-nav-and-header-refactor/spec.md`](file:///j:/GitHub/BasketApp/bcmApp/specs/004-nav-and-header-refactor/spec.md)

## Summary

Refactor the team navigation and layout header:
1. Strip out Fees (Cuotas) and Calendar (Calendario) options and links from the bottom navbar.
2. Add a `Home` button to the bottom navbar to quickly return to the team layout main overview (`MAIN`).
3. Add a context-aware "Add" button to the header section for `Players` (Plantilla), `Matches` (Partidos), and `Sessions` (Entrenamientos) page views.
4. Apply safe area top margins to `Header` and bottom margins to `BottomNavBar` for mobile UI separation.

## Technical Context

**Language/Version**: TypeScript 5.x / React Native 0.76+ / Expo 57+

**Primary Dependencies**: React Native, Zustand, NativeWind, React Vector Icons

**Storage**: SQLite / Drizzle ORM (useDB / ClubStore)

**Testing**: Jest + React Native Testing Library (`npx jest`)

**Target Platform**: iOS & Android Mobile Apps

**Project Type**: Mobile Application (Expo / React Native)

**Performance Goals**: Smooth 60fps tab switching, zero infinite re-renders

**Constraints**: Strict TypeScript mode, NativeWind styling (`className`), TDD First

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (TDD First)**: Unit tests required for `MenuStore`, `Header`, `BottomNavBar`, and `ClubProfile`. -> **PASS**
- **Principle IV (Zustand)**: `MenuStore` updated with `headerAction` / `Home` button state. -> **PASS**
- **Principle V (NativeWind)**: Safe margins applied using NativeWind classes (`pt-3`/`pb-4`/`mt-1`/`mb-1`). -> **PASS**
- **Principle VI (Strict TypeScript)**: Typed interfaces for `HeaderAction` and `HeaderProps`, no implicit `any`. -> **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/004-nav-and-header-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── ui-menu-contracts.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code Layout

```text
src/
├── components/
│   ├── Header.tsx         # Updated with top safe area margin & optional headerAction button
│   └── BottomNavBar.tsx   # Updated with bottom safe area margin & Home button support
├── page/
│   ├── ClubProfile.tsx    # Configures bottom menu (Plantilla, Partidos, Entrenamientos, Home, Volver)
│   ├── PlayerList.tsx     # Sets headerAction to trigger add player
│   ├── GameList.tsx       # Sets headerAction to trigger add match
│   └── TrainingList.tsx   # Sets headerAction to trigger add training
├── store/
│   └── MenuStore.ts       # Extended with headerAction state and setHeaderAction action
└── __tests__/
    └── components/        # Co-located unit tests for stores and components
```

**Structure Decision**: Single React Native application modular layout following project standards.
