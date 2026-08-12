---
name: Full Court Neon
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4bfb1'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#aa897d'
  outline-variant: '#5b4137'
  surface-tint: '#ffb599'
  primary: '#ffb599'
  on-primary: '#5a1c00'
  primary-container: '#ff5f05'
  on-primary-container: '#531900'
  inverse-primary: '#a73b00'
  secondary: '#89d2ff'
  on-secondary: '#00344b'
  secondary-container: '#00baff'
  on-secondary-container: '#004663'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#959393'
  on-tertiary-container: '#2c2c2c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb599'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#7f2b00'
  secondary-fixed: '#c6e7ff'
  secondary-fixed-dim: '#81cfff'
  on-secondary-fixed: '#001e2d'
  on-secondary-fixed-variant: '#004c6b'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 32px
  title-md:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Archivo Narrow
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  stat-value:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 20px
  stack-gap: 12px
  section-margin: 32px
  grid-gutter: 16px
---

## Brand & Style

This design system is built for high-stakes sports management, capturing the electric atmosphere of a night game under stadium lights. The brand personality is aggressive, high-energy, and technologically advanced. It targets a demographic that values speed, data visualization, and a "hype" aesthetic.

The visual style is a fusion of **Dark-Mode Glassmorphism** and **Cyber-Athletic Brutalism**. By utilizing a deep, near-black foundation, the interface allows vibrant neon accents to act as functional light sources. Components feature frosted glass textures, high-contrast borders, and outer glows that simulate stadium signage. The emotional response is one of adrenaline, precision, and elite performance.

## Colors

The palette is anchored by "Shot Clock Orange" and "Skyline Blue." 

- **Primary (Shot Clock Orange):** Used for critical actions, active states, and scoring metrics. It must always carry a subtle outer glow to maintain the neon aesthetic.
- **Secondary (Skyline Blue):** Used for secondary data points, team stats, and navigational elements. It provides a cool-toned balance to the aggressive orange.
- **Backgrounds:** A tiered dark system using `#0F0F0F` for the base and `#1A1A1A` for elevated surfaces. 
- **Accents:** Neon glows are achieved using 0.4 opacity spreads of the primary and secondary colors. Surface borders should use a high-contrast version of these colors to define edges in the dark environment.

## Typography

The typography strategy prioritizes impact and legibility under high-pressure scenarios.

- **Headlines (Anton):** This condensed, bold face mimics traditional jersey numbering and stadium scoreboards. It is used exclusively in uppercase for maximum presence.
- **Body & Data (Archivo Narrow):** A high-efficiency sans-serif designed for data-heavy views. Its narrow width allows for more columns of player statistics on mobile screens without sacrificing readability.
- **Technical Labels (Space Mono):** Used for metadata, technical specifications, and "system" information. This adds a layer of precision and "hacker/manager" aesthetic to the tool.

## Layout & Spacing

The layout utilizes a **Fluid 4-column Grid** for mobile, optimized for one-handed "sideline" use. 

- **Vertical Rhythm:** Built on a 4px base unit. Most components use 12px (3 units) or 16px (4 units) of internal padding.
- **Safe Areas:** Generous bottom margins are applied to accommodate floating action buttons (FABs) which house "Quick Action" management tools (Timeout, Substitution, Foul).
- **Z-Axis:** Spacing is emphasized by "air" between glass cards, allowing the background glows to bleed through and define the structure.

## Elevation & Depth

Depth is not communicated through traditional shadows, but through **Light and Blur**:

- **Level 0 (Base):** Deep `#0F0F0F` solid background.
- **Level 1 (Cards/Containers):** `rgba(26, 26, 26, 0.6)` with a 12px Backdrop Blur. A 1px solid border at 20% opacity of the primary or secondary color defines the edge.
- **Level 2 (Active/Selected):** The 1px border increases to 100% opacity and gains a `0px 0px 8px` outer glow in the same color.
- **Overlays:** Full-screen blurs (20px radius) for modals to keep the user focused on the high-energy data entry.

## Shapes

The shape language is **Soft (0.25rem)**, leaning towards a geometric, industrial feel. 

- **Standard Elements:** Buttons and Input fields use a 4px radius (`rounded`).
- **Data Containers:** Player cards and Stat blocks use an 8px radius (`rounded-lg`).
- **Aggressive Cuts:** For a more distinctive look, certain primary headers or "Versus" banners may use a 45-degree clipped corner (chamfer) instead of a radius to reinforce the brutalist sport aesthetic.

## Components

- **Neon Buttons:** High-contrast fills with white text for primary actions. The "Glow" state is triggered on active or "Live" game modes.
- **Glass Cards:** Semi-transparent containers for player stats. Use a subtle gradient from top-left to bottom-right to simulate a light source.
- **Stat Chips:** Small, `Space Mono` labels with solid color backgrounds (Orange for offensive stats, Blue for defensive).
- **Segmented Controllers:** Use a "tab" style with no background for inactive states and a neon bottom-border for the active selection.
- **Player Input Fields:** Outlined boxes with the label floating in the border line. When focused, the entire border and text should glow Sky Blue.
- **Performance Meters:** Horizontal bars using a "segmented" fill (like a battery indicator) to visualize player fatigue or shooting streaks.
- **Floating Action Button (FAB):** A perfect circle in Shot Clock Orange with a heavy outer glow, floating in the bottom right for "New Play" or "Add Foul."