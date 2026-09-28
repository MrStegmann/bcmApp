# UI & State Contracts: Navigation and Header Refactor

## 1. Header State Contract

- **State Provider**: `MenuStore` (`headerTitle`, `headerAction`)
- **State Consumer**: `Header.tsx`
- **Behavior**:
  - `Header` reads `headerTitle` and `headerAction` reactively from `useMenuStore`.
  - When `headerAction` is non-null, `Header` renders an action button on the top right with label/icon and fires `headerAction.onPress()` on tap.
  - When `headerAction` is `null`, `Header` renders title only.

---

## 2. Bottom Navbar State Contract

- **State Provider**: `MenuStore` (`bottomMenuItems`, `activeTab`)
- **State Consumer**: `BottomNavBar.tsx`
- **Items Structure**:
  1. `PLAYERS` (Plantilla) -> Tab switch
  2. `GAMES` (Partidos) -> Tab switch
  3. `TRAININGS` (Entrenamientos) -> Tab switch
  4. `MAIN` (Home) -> Return to Team Main Panel
  5. `GO_BACK` (Volver) -> Return to Club Manager List
- **Removed Items**: `CALENDAR` (Calendario/Cuotas), deprecated links.
