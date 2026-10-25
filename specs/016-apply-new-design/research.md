# Research: Apply CourtVision Kinetic Design

## Overview
This document consolidates technical investigations and architectural decisions for applying the CourtVision Kinetic design system (`DESIGN.md`) to the BasketApp (`bcmApp`) mobile application using NativeWind (Tailwind CSS v3 engine on React Native) without altering existing application logic or architecture.

---

### Decision 1: Design Token Configuration in `tailwind.config.js`
- **Decision**: Extend `tailwind.config.js` with the full CourtVision Kinetic token dictionary from `DESIGN.md`, while maintaining existing `danish-*` aliases to prevent regression in any legacy references or tests.
- **Rationale**: NativeWind parses `tailwind.config.js` to compile styles into React Native style primitives. By registering all semantic surface tokens (`surface`, `surface-container-*`, `on-surface`), brand tokens (`primary`, `primary-container`, `secondary`, `tertiary`), and athletic neutrals (`slate-dark` `#0F172A`, `slate-card` `#1E293B`, `slate-border` `#334155`, `court-orange` `#F97316`, `tactical-blue` `#0EA5E9`), components can reference standard class names (e.g. `bg-surface-container`, `text-primary-container`, `border-slate-border`) directly with zero runtime overhead.
- **Alternatives Considered**:
  - *Hardcoding arbitrary Tailwind values (e.g., `bg-[#1E293B]`)*: Rejected because it duplicates hex codes across dozens of files, prevents centralized theme tuning, and violates Constitution Principle V (utility-first styling from centralized tokens).
  - *Completely removing `danish-*` tokens immediately*: Rejected because keeping them aliased to new or legacy colors guarantees zero breaking regressions during the transition.

---

### Decision 2: Typography and Font Family Fallbacks
- **Decision**: Define `fontFamily` in `tailwind.config.js` with `'Space Grotesk'` and `'Inter'` prioritized, falling back to system sans-serif (`system-ui`, `-apple-system`, `Roboto`, `sans-serif`).
- **Rationale**: `DESIGN.md` designates Space Grotesk for display/headings/stat-displays and Inter for body copy. React Native natively leverages platform system fonts if custom font assets are not bundled. Defining font families with system fallbacks ensures immediate cross-platform compilation on iOS and Android without triggering missing-asset crashes.
- **Alternatives Considered**:
  - *Forcing custom font file downloads and native linking*: Rejected because the specification mandates *zero codebase modifications* outside styling; adding font assets and reconfiguring native binaries exceeds the purely visual scope.

---

### Decision 3: Ergonomic Touch Targets (48x48px Minimums)
- **Decision**: Ensure all primary action triggers, substitution chips, and scoring controls satisfy the 48x48px ergonomic touch target requirement (US3) via `min-h-[48px]`, `min-w-[48px]`, or generous hit padding (`py-3 px-4`).
- **Rationale**: Sideline basketball tracking requires reliable, one-handed thumb entry during fast gameplay. Native touch targets below 48px cause mis-taps. Using utility classes (`min-h-[48px] min-w-[48px] justify-center items-center`) guarantees compliance without changing component hierarchies or touch handlers.
- **Alternatives Considered**:
  - *Relying solely on visual container size*: Rejected because compact pills (e.g., status tags or jersey numbers) might have smaller visual boundaries; explicit touch target sizing or hit padding prevents missed inputs.

---

### Decision 4: Preserving Functional Logic and Component APIs
- **Decision**: Restrict all edits strictly to `className` attribute strings and obsolete static inline `style` objects. Retain 100% of component props interfaces, hooks, state stores (Zustand), database operations (Drizzle ORM), and event handlers (`onPress`, `onChangeText`, etc.).
- **Rationale**: The specification mandates pure restyling with zero behavioral regressions. Retaining exact prop signatures and logic ensures the 87 Jest test suites pass continuously throughout the migration.
- **Dynamic Exceptions**:
  - Dynamic runtime coordinate calculations (such as basketball shot markers in `HalfCourt.tsx`) remain inline (`left: x, top: y`), but their visual attributes (borders, fills, opacity) will consume the new design tokens.
- **Alternatives Considered**:
  - *Refactoring components to use new shared UI abstractions*: Rejected because it introduces architectural churn and risks regressions. All changes must be localized to class strings in existing components.

---

### Decision 5: Phased Component Inventory and Execution Strategy
- **Decision**: Organize the restyling traversal into 7 logical, testable batches:
  1. **Theme Foundation**: `tailwind.config.js` and global styling tokens.
  2. **Framework & Shell**: `App.tsx`, `src/framework/*` (`Button`, `Input`, `ModalInfo`, `DeleteModal`), `Header.tsx`, `BottomNavBar.tsx`.
  3. **Club & Administration**: `ClubManage.tsx`, `ClubProfile.tsx`, `ClubForm.tsx`, `ClubList.tsx`.
  4. **Player & Roster Views**: `PlayerList.tsx`, `PlayerCards.tsx`, `PlayerDetail.tsx`, `PlayerForm.tsx`, `PlayerStatsModal.tsx`, `RosterSelectionModal.tsx`.
  5. **Matches & Schedule**: `GameList.tsx`, `GameCards.tsx`, `GameForm.tsx`, `GamesResults.tsx`, `GameDetail.tsx`.
  6. **Feature Modules (Home & Detail)**: `src/features/home-view/*`, `src/features/match-detail/*`.
  7. **Live Match Operations**: `PlayMatch.tsx`, `src/features/play-match/*`, `StartingFiveModal.tsx`, `SubstitutionPanel.tsx`, `RivalControlPanel.tsx`, `HalfCourt.tsx`.
- **Rationale**: Batching components by functional domain allows focused verification and prevents overwhelming, error-prone mega-diffs.
- **Alternatives Considered**:
  - *Single massive file replacement*: High risk of missed classes or broken syntax. Batching ensures rapid detection of any styling syntax errors.
