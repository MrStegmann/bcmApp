# Feature Specification: Apply CourtVision Kinetic Design

**Feature Branch**: `016-apply-new-design`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "# Design: Appling new Design\n## Goal\nThe task is to apply the new design specify in `DESIGN.md` to the application WITHOUT changin the codebase. This specification shall focus only in the appliance of the tailwind classes (using NativewindCSS).\n\n---\n\n## What To Do\n\n* **Audit `DESIGN.md` Specifications:** Review all design tokens, color palettes, typography scales, spacing units, and border-radius rules defined in the specification file.\n* **Verify NativeWind Configuration:** Ensure `tailwind.config.js` and global styles (or CSS interop setup) are fully synchronized with any new design tokens or custom themes required by `DESIGN.md`.\n* **Update Component `className` Props:** Systematically traverse the component tree and update existing NativeWind `className` attributes to match the new styles, padding, margins, colors, and font weights.\n* **Maintain Logic and Architecture Integrity:** Restrict all changes strictly to styling props and NativeWind classes, ensuring zero modifications are made to component states, hooks, handlers, or business logic.\n* **Validate Cross-Platform Rendering:** Test the updated UI components on both iOS and Android environments to confirm NativeWind compiles and renders the Tailwind classes accurately.\n\n---\n\n## Acceptance Criteria\n\n* **Fidelity to `DESIGN.md`:** All UI elements (screens, cards, buttons, text hierarchies, and spacing) visually match the specifications provided in `DESIGN.md`.\n* **Zero Codebase Modifications:** No modifications exist outside of styling updates—component architecture, functional logic, state management, and props APIs remain untouched.\n* **Strict NativeWind Usage:** All styling is implemented exclusively via Tailwind CSS classes using NativeWind (`className=\"...\"`), avoiding hardcoded inline `style` objects unless required for dynamic runtime values.\n* **Token Consistency:** Custom design variables (e.g., brand colors, typography weights) correctly resolve via the Tailwind configuration without falling back to default or unstyled states.\n* **Cross-Platform Consistency:** Layouts and styling modifications maintain visual and structural consistency across both iOS and Android device targets."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Experience CourtVision Kinetic Visual Aesthetics (Priority: P1)

As a basketball coach, team manager, or player using the application, I want all screens, cards, buttons, status indicators, and data displays to visually reflect the high-contrast, kinetic athletic style defined in `DESIGN.md` (deep athletic slate surfaces, high-contrast court orange accents, tactical sky blue highlights, and clean typography), so that the application feels like a modern, professional sports analytics and operations tool.

**Why this priority**: Aligning the entire visual system with the CourtVision Kinetic design system provides immediate visual polish, brand authority, and optimal legibility in outdoor and indoor court settings.

**Independent Test**: Can be tested independently by navigating through primary application views (Home, Club Manager, Team Roster, Matches, Match Detail, and Play Match) and visually confirming that colors, borders, cards, and typography match the design tokens without unstyled or fallback states.

**Acceptance Scenarios**:

1. **Given** the user launches the application, **When** the Home and navigation views render, **Then** the background displays deep athletic slate surfaces (`#0B1326` / `#0F172A`) with high-contrast text and cohesive theme colors.
2. **Given** the user inspects primary action triggers across views, **When** primary buttons are displayed, **Then** they render with vibrant court-orange styling (`#F97316`), bold text, and appropriate corner rounding (`rounded-lg`).
3. **Given** the user views secondary and outline actions, **When** interactive secondary elements appear, **Then** they display crisp tactical sky-blue borders and accents (`#0EA5E9` / `#38BDF8`).
4. **Given** the user navigates between stat cards and modules, **When** containers load, **Then** they render on elevated dark slate card surfaces (`#1E293B`) framed by clean structural borders (`#334155`).

---

### User Story 2 - Pure Visual Restyling with Zero Functional Regressions (Priority: P1)

As a scorekeeper or team administrator performing operational tasks, I want all buttons, inputs, modal triggers, list items, and interactive components to preserve their exact functional behaviors, data bindings, state changes, and event handlers after the visual restyling, so that my day-to-day workflow and recorded data are completely undisturbed.

**Why this priority**: Preserving functional integrity is mandatory. A visual redesign must never compromise existing app functionality, user flows, database persistence, or business logic.

**Independent Test**: Can be tested independently by executing end-to-end user flows (creating a match, recording score events, bench substitutions, filtering rosters, updating player details) and confirming that all existing unit and component tests pass without modification to business logic.

**Acceptance Scenarios**:

1. **Given** an existing functional screen with interactive controls (e.g., player stats modal, new match form, match recording), **When** styling classes are updated to the new design tokens, **Then** all tap handlers, forms, modals, and input bindings function identically to their pre-restyled state.
2. **Given** components with state management (Zustand stores, hooks, SQLite/Drizzle queries), **When** visual attributes are inspected, **Then** no modifications have been made to component props APIs, hook invocations, store transitions, or schema queries.
3. **Given** the automated test suite, **When** tests are executed, **Then** 100% of existing functional tests pass without requiring any alterations to test assertions or application logic.

---

### User Story 3 - Ergonomic Touch Targets and Glancable Metrics (Priority: P2)

As a sideline scorekeeper tracking fast-paced basketball games with one hand, I want interactive game controls, substitution buttons, and stat pills to satisfy ergonomic touch targets (minimum 48x48px hit areas) and display high-legibility stat numbers, so that I can input rapid gameplay events without mis-taps or visual eye strain.

**Why this priority**: Basketball tracking happens at game speed. Quick glanceability and reliable one-handed thumb reach prevent costly input mistakes during live game action.

**Independent Test**: Can be tested independently on mobile device viewports by verifying that touch targets for primary actions meet minimum 48px hit areas and that stat typography stands out clearly with high contrast.

**Acceptance Scenarios**:

1. **Given** live tracking controls or quick-action chips on mobile screens, **When** tapped during gameplay, **Then** touch areas provide comfortable hit slops conforming to minimum 48x48px standards.
2. **Given** numeric scoreboard and stat displays, **When** scores and percentages render, **Then** numbers render with bold, glanceable typography with tight tracking for immediate readability.
3. **Given** status badges and player position tags, **When** displayed across rosters or box scores, **Then** they present distinctive pill silhouettes (`rounded-full`) or miniature position tags (`rounded-sm`) that separate cleanly from rectangular stat cards.

---

### User Story 4 - Consistent Cross-Platform Rendering on iOS and Android (Priority: P2)

As an athlete or coach accessing the application across different mobile platforms (iOS and Android), I want the layout, padding, font weights, and color tokens to render consistently across both operating systems without visual clipping, missing fonts, or alignment discrepancies, so that the user experience is uniform on any team member's device.

**Why this priority**: Teams use mixed mobile device ecosystems. The visual hierarchy and layouts must be reliable regardless of whether an iOS or Android device is used.

**Independent Test**: Can be tested independently by running the application bundle on both iOS and Android emulators/devices and comparing key views for spacing consistency, color rendering, and font fallback behavior.

**Acceptance Scenarios**:

1. **Given** any application screen rendered on iOS or Android, **When** examined side-by-side, **Then** spacing, margins, color saturation, and card elevations display unified visual styling.
2. **Given** typography styling applied via design utility classes, **When** rendered on platforms without custom font files loaded, **Then** appropriate system font weights and fallbacks render legibly without layout shifting or overflow.

---

### Edge Cases

- **Long Text and Player Names**: Long player names or club titles must wrap or truncate gracefully within elevated cards without breaking grid layouts or pushing action buttons off-screen.
- **Extreme Mobile Aspect Ratios and Small Screens**: On compact screens (360px width), stat gauges, pill badges, and action buttons must maintain minimum touch targets and padding without horizontal clipping.
- **Dynamic Runtime Coordinates**: In components where exact pixel coordinates are computed at runtime (e.g., basketball court shot-chart points and arc markers), dynamic coordinates may remain inline while all visual attributes (colors, borders, radiuses) adhere to the design system tokens.
- **Contrast in Bright Outdoor Conditions**: High-contrast ratios between slate card surfaces (`#1E293B`) and white text (`#FFFFFF` / `#F8FAFC`) must remain readable in intense ambient lighting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST configure and expose all `DESIGN.md` design tokens (colors, typography scales, spacing units, border radiuses) within the centralized styling configuration (`tailwind.config.js`).
- **FR-002**: System MUST define the full CourtVision Kinetic color palette, including athletic slate backgrounds (`surface`, `surface-container`, `background`), primary court orange (`primary`, `primary-container`), tactical sky blue (`secondary`, `tertiary`), outline colors (`outline`, `outline-variant`), and functional alert colors (`error`, `error-container`).
- **FR-003**: System MUST update all component styling props across the application to utilize utility classes derived from the centralized design tokens via `className` attributes.
- **FR-004**: System MUST apply consistent container elevation styling across views, utilizing level 1 elevated dark slate cards (`#1E293B`) bounded by structural borders (`#334155`).
- **FR-005**: System MUST style primary action buttons with vibrant court-orange backgrounds (`#F97316`), bold text, minimum 48px touch heights, and `rounded-lg` corner curvature.
- **FR-006**: System MUST style secondary and tactical buttons with crisp sky-blue accents (`#0EA5E9`), transparent or tinted surfaces, and consistent corner curvature.
- **FR-007**: System MUST style status badges and pills using full-rounded profiles (`rounded-full`) with compact padding to distinguish actionable tags from passive metric displays.
- **FR-008**: System MUST style position and jersey tags using compact rectangular shapes (`rounded-sm`) with slate backgrounds (`#334155`) and high-contrast numbers.
- **FR-009**: System MUST style input fields and controls with dark slate field backgrounds (`#0F172A`) framed by `#334155` borders, transitioning cleanly on active focus.
- **FR-010**: System MUST strictly preserve all existing business logic, component architecture, state management stores (Zustand), database queries (Drizzle ORM), hooks, and event handlers with zero functional alterations.
- **FR-011**: System MUST prohibit hardcoded inline styling objects for visual tokens, using utility classes exclusively except where dynamic runtime layout calculations are strictly required.
- **FR-012**: System MUST ensure all layouts, spacings, and typography scales render consistently across both iOS and Android runtime targets.

### Key Entities *(include if feature involves data)*

- **Design System Token Map**:
  - `Colors`: Surface tokens (`surface`, `surface-container-low`, `surface-container`, `surface-container-high`), Brand tokens (`primary` court orange, `secondary` tactical sky blue, `outline` structural borders), Semantic alert tokens (`error`, positive indicators).
  - `Typography`: Headline scale (`headline-xl`, `headline-lg`, `headline-md`, `headline-sm`), Body scale (`body-lg`, `body-md`, `body-sm`), Label scale (`label-lg`, `label-md`, `label-sm`), Stat display (`stat-display`).
  - `Spacing`: Outer gutters/margins (16px / 1rem on mobile), spacing increments (`space-xs`, `space-sm`, `space-md`, `space-lg`, `space-xl`).
  - `Shapes & Border Radius`: `rounded-sm` (4px), `rounded-md` (8px), `rounded-lg` (16px), `rounded-full` (capsules/pills).
- **Component Visual Profiles**:
  - `Primary Action Button`: Orange surface, white bold text, 48px height, rounded-lg.
  - `Secondary Action Button`: Blue border, blue accent text, transparent/tinted surface.
  - `Elevated Data Card`: `#1E293B` container, `#334155` border, rounded-md/rounded-lg.
  - `Score & Metric Display`: Space Grotesk numeric display with tight tracking and high contrast.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of application screens, navigation bars, cards, modals, and interactive controls visually reflect the CourtVision Kinetic design system tokens specified in `DESIGN.md`.
- **SC-002**: 0 modifications are made to application business logic, state stores, database contracts, component APIs, or event handlers outside of styling attributes and design token configurations.
- **SC-003**: 100% of automated functional and unit tests pass with zero modifications to test assertions or test expectations.
- **SC-004**: 100% of primary interactive triggers and scoring controls meet or exceed ergonomic 48x48px accessible touch target guidelines.
- **SC-005**: 0 unstyled elements, missing token fallbacks, or raw unmapped color classes remain in the component hierarchy.
- **SC-006**: Visual layout, spacing, and typography render without clipping, unintended horizontal scroll, or platform-specific breakage across both iOS and Android targets.

## Assumptions

- `DESIGN.md` in the project root is the complete and authoritative specification for colors, typography, shapes, elevation, and component visual rules.
- NativeWind is the active styling mechanism in the project, configured through `tailwind.config.js`.
- Font families defined in `DESIGN.md` (Space Grotesk and Inter) will resolve through configured project fonts or standard system sans-serif font fallbacks without altering layout geometry.
- Existing inline style exceptions strictly limited to dynamic runtime geometric positioning (such as basketball court shot coordinates) are permissible and will retain their numerical calculations while adopting design token colors.
