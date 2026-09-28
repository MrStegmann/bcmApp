# Phase 0 Research: Navigation and Header Refactor

## Technical Context & Decisions

### Decision 1: Header Action Button State in Zustand `MenuStore`

- **Decision**: Extend `MenuStoreState` with an optional `headerAction` property:
  ```ts
  export interface HeaderAction {
    label: string;
    iconName?: string;
    iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
    onPress: () => void;
  }
  ```
- **Rationale**: Keeps `Header.tsx` decoupled from specific page views (`PlayerList`, `GameList`, `TrainingList`). Each view or `ClubProfile` can set or clear `headerAction` dynamically via `setHeaderAction(...)` when switching active tabs.
- **Alternatives Considered**:
  - *Props drilling into `Header.tsx`*: Rejected because `Header` is rendered at `ClubManage` layout level, far from tab child views.
  - *Context API*: Rejected per Constitution Principle IV (Zustand state management is standard).

---

### Decision 2: Bottom Navigation `Home` Button & Removal of Fees/Calendar

- **Decision**: Update `ClubProfile.tsx` bottom items configuration to include `TopMenuEnums.MAIN` ("Home") and remove `TopMenuEnums.CALENDAR` and Fees options:
  - Bottom menu items: `PLAYERS` ("Plantilla"), `GAMES` ("Partidos"), `TRAININGS` ("Entrenamientos"), `MAIN` ("Home"), `GO_BACK` ("Volver").
- **Rationale**: Meets user requirements directly while reusing `TopMenuEnums.MAIN` enum value for the team layout home init page.
- **Alternatives Considered**:
  - *Creating a new enum `TopMenuEnums.HOME`*: Rejected because `TopMenuEnums.MAIN` already maps to the team layout home overview panel.

---

### Decision 3: Mobile System Safe Area Spacing & Margins

- **Decision**: Apply top spacing to [`Header.tsx`](file:///j:/GitHub/BasketApp/bcmApp/src/components/Header.tsx) (`pt-3 mt-1` / `SafeAreaView` or padding) and bottom spacing to [`BottomNavBar.tsx`](file:///j:/GitHub/BasketApp/bcmApp/src/components/BottomNavBar.tsx) (`pb-4 mb-1` or `SafeAreaView` / NativeWind utility classes).
- **Rationale**: Ensures top header title and action button have a safe distance from device status bars / camera cutouts, and bottom navbar buttons have safe clearance from device gesture bars.
- **Alternatives Considered**:
  - *Hardcoding fixed pixel heights*: Rejected per project layout guidelines (dynamic container bounds and standard safe utility classes).
