# Data Model & State Schema: Navigation and Header Refactor

## MenuStoreState Schema Extensions

### 1. `HeaderAction` Interface

```ts
export interface HeaderAction {
  label: string;
  iconName?: string;
  iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
  testID?: string;
}
```

### 2. `MenuStoreState` Updates

```ts
export interface MenuStoreState {
  activeTab: TopMenuEnums;
  headerTitle: string;
  headerAction: HeaderAction | null;
  bottomMenuItems: BottomMenuItem[];
  topMenu: TopMenuEnums | TopMenuItem[];
  topMenuItems: TopMenuItem[];

  setActiveTab: (tab: TopMenuEnums) => void;
  setHeaderTitle: (title: string) => void;
  setHeaderAction: (action: HeaderAction | null) => void;
  setBottomMenu: (items: BottomMenuItem[]) => void;
  setTopMenu: (menu: TopMenuEnums | TopMenuItem[]) => void;
}
```

---

## Component Interfaces

### 1. `HeaderProps`

```ts
export interface HeaderProps {
  title?: string;
  action?: HeaderAction | null;
}
```

---

## Navigation Tab State Transitions

| Active View (`option`) | Header Title | Header Action (`headerAction`) | Bottom Navbar Items |
| :--- | :--- | :--- | :--- |
| `MAIN` (Home) | `Equipo: {clubName}` | `null` | Plantilla, Partidos, Entrenamientos, Home, Volver |
| `PLAYERS` | `Plantilla de Jugadores` | `{ label: "Añadir", iconName: "plus-circle", onPress: () => openPlayerForm() }` | Plantilla, Partidos, Entrenamientos, Home, Volver |
| `GAMES` | `Partidos` | `{ label: "Añadir", iconName: "plus-circle", onPress: () => openGameForm() }` | Plantilla, Partidos, Entrenamientos, Home, Volver |
| `TRAININGS` | `Entrenamientos` | `{ label: "Añadir", iconName: "plus-circle", onPress: () => openTrainingForm() }` | Plantilla, Partidos, Entrenamientos, Home, Volver |
