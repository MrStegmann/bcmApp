# Navigation & Header UI Contract: Feature 005

**Date**: 2026-09-28
**Branch**: `005-navbar-icons-and-back-button`

## 1. Header Component Contract (`Header.tsx`)

### Props & Visual Structure

```typescript
export interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}
```

### Visual Layout

```text
+-----------------------------------------------------------------------+
|  [ < (Back Button) ]        [ Centered Header Title ]       [ + (Add) ] |
+-----------------------------------------------------------------------+
```

- **Top Padding**: `Math.max(insets.top, 12)`
- **Corners**: Straight (no `rounded-b-*` classes)
- **Border**: `border-b-2 border-danish-red`
- **Background**: `bg-danish-dark-gray`
- **Left Slot**:
  - If `headerBackAction` is set: Renders `<TouchableOpacity testID="header-back-button">` with chevron-left icon (size 22, color white) executing `headerBackAction.onPress`.
  - If `headerBackAction` is null: Renders empty `<View className="w-10" />` to preserve center title balance.
- **Center Slot**:
  - `Text` component with `numberOfLines={1}`, `flex-1`, bold centered title.
- **Right Slot**:
  - If `headerAction` is set: Renders `<TouchableOpacity testID={headerAction.testID}>` executing `headerAction.onPress`.
  - If `headerAction` is null: Renders empty `<View className="w-10" />`.

---

## 2. BottomNavBar Component Contract (`BottomNavBar.tsx`)

### Props & Visual Structure

```typescript
export interface BottomNavBarProps {
  items?: BottomMenuItem[];
  activeTab?: TopMenuEnums;
}
```

### Visual Layout

```text
+-----------------------------------------------------------------------+
|   [ (Home) ]    [ (Players) ]    [ (Games) ]    [ (Train) ]    [ (Back) ]  |
+-----------------------------------------------------------------------+
```

- **Bottom Padding**: `Math.max(insets.bottom, 8)`
- **Items Order in `ClubProfile.tsx`**:
  1. `TopMenuEnums.MAIN` (Home: icon `home`, family `Feather`)
  2. `TopMenuEnums.PLAYERS` (Plantilla: icon `users`, family `Entypo`)
  3. `TopMenuEnums.GAMES` (Partidos: icon `basketball-hoop-outline`, family `MaterialCommunityIcons`)
  4. `TopMenuEnums.TRAININGS` (Entrenamientos: icon `clipboard-notes`, family `Foundation`)
  5. `TopMenuEnums.GO_BACK` (Volver: icon `door-open`, family `FontAwesome5`)
- **Render Rule**: Only the icon is rendered inside each item's `TouchableOpacity`. No child `<Text>` element with label is rendered in the UI.
- **Touch Targets**: Minimum 44x44pt touch area per tab button with active state highlighting (`bg-red-950/40 border border-red-900/60`).
