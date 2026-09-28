# Quickstart Validation Guide: Bottom Menu Navigation & Routing Performance Improvement

**Feature**: Bottom Menu Navigation & Routing Performance Improvement (`specs/003-bottom-navigation-routes`)
**Date**: 2026-09-28

## Prerequisites

1. Node.js environment with Expo / React Native dependencies installed.
2. Repository root at `j:\GitHub\BasketApp\bcmApp`.

## Validation Scenarios

### Scenario 1: TypeScript Compilation
Validate clean compilation of new `BottomNavBar.tsx`, updated `Header.tsx`, `useMenuStore`, and view routes:

```bash
npx tsc --noEmit
```

*Expected Outcome*: Zero TypeScript compilation errors (Exit code 0).

---

### Scenario 2: Jest Unit Test Suite Execution
Execute unit tests for `MenuStore` state transitions, `BottomNavBar` rendering, and active title feedback:

```bash
npx jest
```

*Expected Outcome*: All test suites pass 100% (0 failures).

---

### Scenario 3: End-to-End Bottom Navigation & Header Title Flow

1. **Launch App**: Open Expo runner (`npm start` or `npx expo start`).
2. **Main View**: Verify top Header displays "Gestión de Equipos" and bottom bar is present.
3. **Select Team**: Select a team card to enter the team dashboard layout.
4. **Tab Switching**: Tap bottom navigation bar tabs:
   - **Plantilla**: Header title displays "Plantilla de Jugadores".
   - **Partidos**: Header title displays "Partidos".
   - **Entrenamientos**: Header title displays "Entrenamientos".
   - **Cuotas**: Header title displays "Calendario de Cuotas".
5. **Verify Settings Removal**: Confirm that "Editar Equipo / Settings" is nowhere in the bottom bar or team layout.
6. **Return**: Tap "Volver" tab on bottom bar; verify header updates back to "Gestión de Equipos".
