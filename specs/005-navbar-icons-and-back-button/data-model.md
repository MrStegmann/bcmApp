# Data Model & State Specifications: Feature 005

**Feature**: Navbar Icons, Go Back Button & Residual Cleanup
**Date**: 2026-09-28
**Branch**: `005-navbar-icons-and-back-button`

## 1. Global UI State Model (`MenuStore.ts`)

### Types and Interfaces

```typescript
export interface BottomMenuItem {
  id: TopMenuEnums;
  label: string; // Used for accessibilityLabel and testing testID
  iconName: string;
  iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
  testID?: string;
}

export interface HeaderAction {
  label: string;
  iconName?: string;
  iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
  testID?: string;
}

export interface HeaderBackAction {
  label?: string;
  iconName?: string;
  iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
  testID?: string;
}

export interface MenuStoreState {
  activeTab: TopMenuEnums;
  headerTitle: string;
  headerAction: HeaderAction | null;       // Top-right action button (e.g., "+" Add)
  headerBackAction: HeaderBackAction | null; // Top-left back button (e.g., "<-" Go Back)
  bottomMenuItems: BottomMenuItem[];
  topMenu: TopMenuEnums | TopMenuItem[];
  topMenuItems: TopMenuItem[];

  setActiveTab: (tab: TopMenuEnums) => void;
  setHeaderTitle: (title: string) => void;
  setHeaderAction: (action: HeaderAction | null) => void;
  setHeaderBackAction: (action: HeaderBackAction | null) => void;
  setBottomMenu: (items: BottomMenuItem[]) => void;
  setTopMenu: (menu: TopMenuEnums | TopMenuItem[]) => void;
}
```

### State Transitions

| Action | `headerAction` | `headerBackAction` | `activeTab` |
|---|---|---|---|
| Initialize `ClubProfile` (Main overview) | `null` | `null` | `TopMenuEnums.MAIN` |
| View `PlayerList` (List mode) | `{ label: "Añadir", ... }` | `null` | `TopMenuEnums.PLAYERS` |
| View `PlayerForm` (Create/Edit player) | `null` | `{ label: "Volver", onPress: cancelForm }` | `TopMenuEnums.PLAYERS` |
| View `PlayerDetail` (Player stats detail) | `null` | `{ label: "Volver", onPress: closeDetail }` | `TopMenuEnums.PLAYERS` |
| View `GameList` (List mode) | `{ label: "Añadir", ... }` | `null` | `TopMenuEnums.GAMES` |
| View `GameForm` (Create/Edit match) | `null` | `{ label: "Volver", onPress: cancelForm }` | `TopMenuEnums.GAMES` |
| View `GameDetail` (Match detail) | `null` | `{ label: "Volver", onPress: closeDetail }` | `TopMenuEnums.GAMES` |
| View `TrainingList` (List mode) | `{ label: "Añadir", ... }` | `null` | `TopMenuEnums.TRAININGS` |
| View `TrainingForm` (Create/Edit training) | `null` | `{ label: "Volver", onPress: cancelForm }` | `TopMenuEnums.TRAININGS` |
| View `TrainingDetail` (Training detail) | `null` | `{ label: "Volver", onPress: closeDetail }` | `TopMenuEnums.TRAININGS` |

---

## 2. Pruned Relational Database Schema (`schema.ts`)

The SQLite database schema maintains strict relational integrity across active domain entities, dropping all legacy `fees` tables.

```text
+----------------+       1:N       +----------------+
|     Clubs      | --------------< |     Teams      |
+----------------+                 +----------------+
                                           | 1:N
         +---------------------------------+---------------------------------+
         | 1:N                             | 1:N                             | 1:N
+----------------+                 +----------------+                 +----------------+
|    Players     |                 |     Games      |                 |   Trainings    |
+----------------+                 +----------------+                 +----------------+
```

### Remaining Active Schemas
1. **`clubs`**: `id`, `name`, `createdAt`
2. **`teams`**: `id`, `name`, `category`, `clubId` (FK -> clubs.id CASCADE), `createdAt`
3. **`players`**: `id`, `name`, `number`, `position`, `teamId` (FK -> teams.id CASCADE), `createdAt`
4. **`games`**: `id`, `teamId` (FK -> teams.id CASCADE), `rival`, `location`, `gameDate`, `createdAt`
5. **`trainings`**: `id`, `teamId` (FK -> teams.id CASCADE), `date`, `duration`, `notes`, `createdAt`
6. *(Deleted)*: `fees` table and relations.
