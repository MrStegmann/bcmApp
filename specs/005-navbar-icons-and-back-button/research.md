# Research: Feature 005 - Navbar Icons, Go Back Button & Residual Cleanup

**Date**: 2026-09-28
**Branch**: `005-navbar-icons-and-back-button`

## Summary of Decisions

### 1. Icon-Only Bottom Navigation Bar & Home Anchor Order

- **Decision**: Remove the `<Text>` label under icons in `BottomNavBar.tsx` and adjust item padding / icon size to maintain a compact, balanced visual layout. In `ClubProfile.tsx`, place the `MAIN` (Home) navigation item as the first element (index 0) in the `bottomMenuItems` array, followed by `PLAYERS` (Plantilla), `GAMES` (Partidos), `TRAININGS` (Entrenamientos), and `GO_BACK` (Volver).
- **Rationale**:
  - Removing text labels eliminates truncation and line wrapping on smaller mobile screens.
  - Positioning "Home" on the far left adheres to standard mobile application navigation patterns (e.g., iOS tab bars and Android bottom navigation standards where Home is always the anchor on the left).
  - Preserves full accessibility via `accessibilityLabel` on `TouchableOpacity`.
- **Alternatives Considered**:
  - *Keep text only on active item*: Rejected as user requested complete removal of text labels across all navbar links.
  - *Move "Volver" (Go Back) to the left*: Rejected because "Volver" is an exit action from the team layout and belongs at the end (far right).

---

### 2. Header "Go Back" Navigation Architecture

- **Decision**: Extend `MenuStore` with `headerBackAction: HeaderBackAction | null` and `setHeaderBackAction(action: HeaderBackAction | null)`. In `Header.tsx`, render a left-aligned `<TouchableOpacity>` when `headerBackAction` is provided (using standard back arrow/chevron icon e.g. `Feather: chevron-left` or `Entypo: chevron-left`), or maintain a balanced `<View className="w-10" />` placeholder when null.
- **Rationale**:
  - Mirroring `headerAction` (which controls the top-right add button) provides a clean, predictable Zustand store contract.
  - Sub-views (PlayerList, GameList, TrainingList) set `headerBackAction` when entering form views (create/edit) or detail views, and clear it (`setHeaderBackAction(null)`) when returning to list views or unmounting.
  - Decouples Header from local state while maintaining single source of truth in `MenuStore`.
- **Alternatives Considered**:
  - *Passing back callbacks via deep React props from ClubProfile down to Header*: Rejected because `Header` is mounted in `ClubManage` above `ClubProfile` and communicates via `MenuStore`.
  - *Overloading the right `headerAction`*: Rejected because back navigation universally belongs on the top-left in mobile interfaces.

---

### 3. Straight-Edged Header Visual Styling

- **Decision**: In `Header.tsx`, remove `rounded-b-3xl` from the inner container class list, retaining `bg-danish-dark-gray border-b-2 border-danish-red shadow-xl shadow-red-900/50 px-4 py-3`.
- **Rationale**:
  - Provides a clean, flush horizontal bottom border matching the viewport boundaries.
  - Retains all existing safe area inset calculations (`Math.max(insets.top, 12)`).
- **Alternatives Considered**:
  - *Remove shadow and border*: Rejected because the red accent border (`border-danish-red`) defines the app's brand identity and provides separation between header and content.

---

### 4. Complete Elimination of Residual Calendar & Fees

- **Decision**: Completely delete `src/page/Calendar.tsx` and `src/store/FeesStore.ts`. In `src/db/schema.ts`, drop the `fees` SQLite table and relations. In `src/db/seed.ts`, remove `seedFees`. In `src/hooks/useDB.ts`, remove `FeesController`. In `src/types/database.ts` and `src/types/store.ts`, remove `Fee` interface and references. In `src/components/PlayerDetail.tsx` and `src/page/ClubProfile.tsx`, clean up residual text references to "cuotas" or calendar tabs.
- **Rationale**:
  - The Fees and Calendar features were stripped in Feature 004, leaving orphaned files, schemas, and test fixtures.
  - Deleting unused schemas and stores simplifies the database schema and prevents type drift.
- **Alternatives Considered**:
  - *Keep empty dummy files*: Rejected as dead code creates confusion, violates the project constitution, and bloats the bundle.

---

## Validation & Compatibility

- **TypeScript**: Strict compilation (`npx tsc --noEmit`) with 0 errors.
- **Jest**: Update test mocks, `MenuStore.test.ts`, `Header.test.tsx`, `BottomNavBar.test.tsx`, `ClubProfile.test.tsx`, `connection.test.ts`, and `cascade.test.ts` to assert new contracts and confirm 100% test pass rate.
