# Quickstart & End-to-End Validation Guide: Navigation and Header Refactor

## Prerequisites

- Active Node environment with dependencies installed.
- All test suites executable via Jest (`npx jest`).

## Validation Commands

```bash
# 1. Type Check
npx tsc --noEmit

# 2. Unit & Integration Tests
npx jest
```

## Manual Verification Flow

1. **Verify Bottom Navbar**:
   - Navigate into a team from the Club List.
   - Inspect the bottom navigation bar.
   - Confirm it displays 5 items: **Plantilla**, **Partidos**, **Entrenamientos**, **Home**, **Volver**.
   - Confirm **Cuotas** and **Calendario** are not present.

2. **Verify Home Button Functionality**:
   - Tap **Plantilla** (or **Partidos** or **Entrenamientos**).
   - Tap **Home** in the bottom navbar.
   - Confirm the view returns to the main team overview panel (`MAIN`).

3. **Verify Header Add Buttons**:
   - Navigate to **Plantilla** view -> Confirm an "Add" ("Añadir") button is visible in the top header banner.
   - Navigate to **Partidos** view -> Confirm an "Add" button is visible in the top header banner.
   - Navigate to **Entrenamientos** view -> Confirm an "Add" button is visible in the top header banner.
   - Tap the header "Add" button in each view -> Confirm it triggers the respective item creation flow.

4. **Verify Safe Area Spacing**:
   - Observe top padding/margin above the Header banner.
   - Observe bottom padding/margin below the BottomNavBar.
   - Confirm no overlap with device notch, status bar, or bottom navigation gesture area.
