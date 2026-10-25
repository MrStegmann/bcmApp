# Contract: Component Styling & Touch Interaction Guidelines

## Scope & Purpose
This contract establishes the mandatory styling rules, class patterns, and touch target constraints for all UI components in BasketApp (`bcmApp`) adhering to CourtVision Kinetic (`DESIGN.md`).

---

## 1. Touch Target & Accessibility Invariant
- **Rule**: Every interactive element (`TouchableOpacity`, `Pressable`, Button, Chip, Toggle, or Tap Marker) MUST have an effective hit area of at least **48x48 points / px**.
- **Enforcement**:
  - Standalone buttons: Add `min-h-[48px] min-w-[48px]` or `py-3 px-4`.
  - Icon-only buttons: Container must be at least `w-12 h-12` (48px) with `items-center justify-center`.
  - Dense list / bench substitution items: When visual height is under 48px, pad vertically (`py-3`) or supply React Native `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}`.

---

## 2. Component Class Pattern Matrix

### 2.1 Buttons
- **Primary CTA**:
  ```text
  bg-[#F97316] active:bg-[#EA580C] min-h-[48px] px-6 py-3 rounded-lg items-center justify-center shadow-md
  Text: text-white font-bold uppercase tracking-wider text-sm
  ```
- **Secondary CTA**:
  ```text
  border-2 border-[#0EA5E9] bg-transparent active:bg-[#0EA5E9]/10 min-h-[48px] px-5 py-3 rounded-lg items-center justify-center
  Text: text-[#38BDF8] font-bold text-sm
  ```
- **Destructive CTA**:
  ```text
  bg-[#93000A] active:bg-[#690005] min-h-[48px] px-5 py-3 rounded-lg items-center justify-center shadow-md
  Text: text-[#FFDAD6] font-bold text-sm
  ```

### 2.2 Containers & Elevation (Level 1)
- **Module Cards**:
  ```text
  bg-[#1E293B] border border-[#334155] rounded-xl p-4 shadow-sm
  ```
- **Modals & Drawers (Level 2)**:
  ```text
  bg-[#171F33] border-2 border-[#0EA5E9]/40 rounded-2xl p-5 shadow-2xl
  ```

### 2.3 Form Fields & Selectors
- **Input Field**:
  ```text
  bg-[#0F172A] border border-[#334155] focus:border-[#0EA5E9] rounded-xl px-4 py-3 text-[#DAE2FD] placeholder:text-[#584237] min-h-[48px]
  ```

### 2.4 Status Indicators & Tags
- **Pill / Capsule**:
  ```text
  rounded-full px-3 py-1 flex-row items-center border border-[#F97316]/50 bg-[#F97316]/10
  ```
- **Jersey / Position Tag**:
  ```text
  rounded-sm bg-[#334155] px-2 py-0.5 items-center justify-center
  Text: text-[#F8FAFC] font-mono font-bold text-xs
  ```

---

## 3. Zero Functional Regressions Invariant
- **Rule**: No edits may change:
  - Props definitions (`interface Props { ... }`)
  - Hook invocations (`useState`, `useEffect`, `useCallback`, `useMemo`, custom hooks)
  - State store actions or selectors (`useMenuStore`, `useMatchStore`, etc.)
  - Database queries (`db.select()`, `db.insert()`, etc.)
  - Handler logic (`onPress={() => ...}`)
- **Permissible modifications**:
  - `className="..."` string replacement
  - Removal of static legacy `style={styles....}` in favor of NativeWind utility classes
  - Keeping dynamic coordinate inline styles (`left: x, top: y`) while replacing colors/strokes with design tokens.
