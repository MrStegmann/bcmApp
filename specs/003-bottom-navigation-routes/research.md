# Technical Research: Bottom Menu Navigation & Routing Performance Improvement

**Feature**: Bottom Menu Navigation & Routing Performance Improvement (`specs/003-bottom-navigation-routes`)
**Date**: 2026-09-28

## Technical Decisions

### Decision 1: Bottom Navigation Bar Component Architecture

- **Decision**: Create a dedicated, reusable `BottomNavBar.tsx` component in `src/components/BottomNavBar.tsx` that anchors to the bottom of the viewport with safe area padding (`react-native-safe-area-context`).
- **Rationale**: Elevates thumb reachability for mobile users, cleanly decouples navigation action triggers from top headers, and provides explicit active tab visual indicators.
- **Alternatives Considered**:
  - *React Navigation Bottom Tabs*: Would require pulling in heavy external router packages (`@react-navigation/bottom-tabs`) and altering the root navigation wrapper. Using focused Zustand store state with `BottomNavBar` keeps the architecture lightweight and maintains fast synchronous testability per Constitution Principle IV.

### Decision 2: Header Component Purpose & Title Synchronization

- **Decision**: Refactor `Header.tsx` to serve purely as a top header title banner accepting `title?: string`.
- **Rationale**: Meets requirement FR-002 directly. Separates header view title feedback ("Gestión de Equipos", "Plantilla de Jugadores", "Partidos", "Entrenamientos", "Calendario de Cuotas") from interactive bottom tab items.
- **Alternatives Considered**:
  - *Keeping dual top and bottom action buttons*: Rejected per spec requirement — top header MUST be strictly a visual location indicator.

### Decision 3: Removal of Team Settings View inside Team Layout

- **Decision**: Remove `TopMenuEnums.EDIT_TEAM` tab link and `ClubForm` edit branch from `ClubProfile.tsx`.
- **Rationale**: Satisfies FR-003 and User Story 2. Team creation and editing remains at the `ClubManage.tsx` list/modal level, preventing navigation bloat inside the operational team layout.
- **Alternatives Considered**:
  - *Keeping a hidden modal in ClubProfile*: Rejected to strictly bound team layout scope to daily team operations (Roster, Games, Trainings, Fees).

### Decision 4: High-Performance Tab Routing & State Management

- **Decision**: Enhance `useMenuStore` to maintain `activeTab: TopMenuEnums`, `headerTitle: string`, and `bottomMenuItems: BottomMenuItem[]`.
- **Rationale**: Guarantees atomic tab updates in under 100ms without page reloads. View switching in `ClubProfile` is driven synchronously via `useMenuStore` selectors.
- **Alternatives Considered**:
  - *Full unmount and remote refetch on every tab switch*: Rejected due to latency and flickering; state stores (`PlayerStore`, `GameStore`, `ClubStore`) provide cached local persistence.
