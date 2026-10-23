# Contract: UI Navigation & View Interfaces

**Feature Branch**: `008-remove-training-session`  
**Date**: 2026-10-22  
**Contract ID**: `CONTRACT-UI-001`  

---

## 1. Top Menu Enums (`src/types/enums.ts`)

### Required Enum Values
```typescript
export enum TopMenuEnums {
  ROSTER = "ROSTER",
  GAMES = "GAMES",
  CALENDAR = "CALENDAR",
  MANAGE = "MANAGE",
  MAIN = "MAIN",
  PLAYERS = "PLAYERS",
  EDIT_TEAM = "EDIT_TEAM",
  GO_BACK = "GO_BACK",
  ADD_NEW_TEAM = "ADD_NEW_TEAM",
  ADD_NEW_PLAYER = "ADD_NEW_PLAYER",
}
```

### Prohibited Enum Values
The enum MUST NOT contain:
- `TRAINING`
- `TRAININGS`
- `ADD_NEW_SESSION`

---

## 2. Club Profile Navigation Items (`src/page/ClubProfile.tsx`)

The bottom navigation bar rendered when viewing a team profile MUST contain exactly four (4) navigation options in the following order:

| Index | ID | Label | Icon | Icon Family | Behavior |
|-------|----|-------|------|-------------|----------|
| 0 | `TopMenuEnums.MAIN` | "Inicio" | `home` | `Feather` | Sets tab to MAIN |
| 1 | `TopMenuEnums.PLAYERS` | "Plantilla" | `users` | `Entypo` | Sets tab to PLAYERS |
| 2 | `TopMenuEnums.GAMES` | "Partidos" | `basketball-hoop-outline` | `MaterialCommunityIcons` | Sets tab to GAMES |
| 3 | `TopMenuEnums.GO_BACK` | "Volver" | `door-open` | `FontAwesome5` | Returns to team list |

No item with ID `TRAININGS` or label `"Entrenamientos"` may appear.

---

## 3. Player Detail View (`src/components/PlayerDetail.tsx`)

### Header / Overview Badges
The overview metrics bar for a player MUST render:
- `P. J` (Partidos Jugados): Count of player's match appearances from `player_stats`.

The overview metrics bar MUST NOT render:
- `E. A` (Entrenamientos Asistidos)
- `E. F` (Entrenamientos Fallados / Faltas)

### Component Dependencies
`PlayerDetail.tsx` MUST NOT call or import any training controllers or attendance models.
