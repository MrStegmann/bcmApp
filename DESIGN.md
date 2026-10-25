---
name: CourtVision Kinetic
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#89ceff'
  on-secondary: '#00344d'
  secondary-container: '#00a2e6'
  on-secondary-container: '#00344e'
  tertiary: '#7bd0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#00a6df'
  on-tertiary-container: '#00374d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
  stat-display:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an intense, precision-driven, and kinetic athletic experience optimized for mobile-first basketball operations, coaching, and athlete management. The aesthetic bridges high-performance tactical analytics with modern streetball energy.

- **Target Audience:** Head coaches, performance directors, team managers, and pro/amateur basketball athletes who need real-time tactical adjustments, game charting, and physical load telemetry.
- **Tone & Mood:** Explosive, authoritative, analytical, and fluid. The UI balances the electric speed of the fast break with the surgical clarity of an NBA analytics war room.
- **Design Movement:** Modern High-Contrast Athleticism layered over Tactical Dark Surfaces. The style uses deep navy ink backgrounds punctuated by vibrant court-line orange and skyward blue accents, clean geometric typography, and modular stat card containers inspired by professional scouting reports and broadcast graphics.

## Colors

The palette is engineered for high-cadence visibility both on outdoor blacktops in direct sunlight and within darkened arena tunnels.

- **Primary Court Orange (`#F97316`, `#EA580C`):** Used strictly for high-impact game actions, active shot-clock indicators, live game state toggles, and critical offensive play calls.
- **Tactical Sky Blue (`#0EA5E9`, `#38BDF8`, deep tone `#0284C7`):** Represents spatial precision, defensive schemes, passing trajectories, efficiency ratings, and secondary interactive touchpoints.
- **Athletic Slate Neutrals (`#0F172A`, `#1E293B`, `#334155`):** Serves as the bedrock dark theme canvas. `#0F172A` grounds the root view, `#1E293B` powers primary card containers, and `#334155` provides razor-sharp borders and divider lines.
- **High-Scoring White & Off-White (`#FFFFFF`, `#F8FAFC`):** Delivers uncompromised contrast for vital player stats, box score numerals, and primary typography.
- **Functional Semantics:** Softened court green (`#10B981`) for positive plus/minus and shot efficiency; intense warning red (`#EF4444`) for fouls, turnovers, and injury alert states.

## Typography

The typographic hierarchy pairs the technical, aggressive geometric punch of **Space Grotesk** with the neutral, hyper-legible body rendering of **Inter**.

- **Display & Headings (Space Grotesk):** Evokes tournament scoreboards, court markings, and modern performance telemetry. Uppercase tracking is applied to micro-headers (`label-sm`, `label-md`) to emulate jersey nameplates and scouting chart categories.
- **Data & Numeric Displays (`stat-display`):** Space Grotesk handles scores, PER, shooting splits (FG%/3P%/FT%), and shot clocks with tight kerning for immediate glanceability during gameplay.
- **Body & Instructional Copy (Inter):** Ensures tactical play descriptions, medical reports, and player notes remain effortlessly readable without visual fatigue.

## Layout & Spacing

Engineered natively for one-handed thumb reach during high-pressure bench side tracking, scaling upward to tablet playbooks.

- **Grid Model:** Fluid single-column architecture for standard mobile handhelds (360px–428px), switching to an adaptive 2-to-4 column split grid on tablet viewports (768px+) for simultaneous live game flow charting alongside box-score feeds.
- **Outer Margins:** Fixed at `1rem` (16px) on mobile viewports to preserve maximum data density without edge clipping. Tablet expands to `1.5rem` (24px).
- **Rhythm & Touch Targets:** All interactive triggers (substitutions, shot-chart tap spots, play clock triggers) respect an ergonomic minimum touch target of `48px x 48px`, decoupled from visual container bounds using Nativewind hit slops (`space-sm` to `space-md` inner padding).

## Elevation & Depth

This system intentionally departs from soft blur drop-shadows in favor of sharp structural layering, performance-tinted edge borders, and tonal luminosity stacking that mirrors stadium lighting against court hardwood.

- **Level 0 (Court Surface):** Root canvas filled with deep athletic slate (`#0F172A`). Zero blur, completely grounded.
- **Level 1 (Card & Module Layer):** Elevated containers (`#1E293B`) bounded by subtle 1px structural borders in slate (`#334155`). Used for scouting modules, player profiles, and quarter stats.
- **Level 2 (Active Floating Modules & Drawers):** Action sheets, tactical subs benches, and shot dials sit on `#1E293B` elevated with an intense 1px accent perimeter glow (`rgba(249, 115, 22, 0.25)` or `rgba(14, 165, 233, 0.25)`).
- **Level 3 (HUD & Real-Time Alerts):** Floating scoreboard pills and live timeout modals leverage crisp high-contrast borderlines (`#0EA5E9`) paired with focused, low-spread ambient back-glows (`0 4px 20px -2px rgba(2, 132, 199, 0.35)`).

## Shapes

The geometric silhouette balances technical precision cards with quick-reference pill badges:

- **Cards & Data Modules:** Fixed at `rounded-md` (`0.5rem` / 8px) to `rounded-lg` (`1rem` / 16px) to maximize internal screen real estate for dense stat grids.
- **Interactive Badges, Stat Pills & Buttons:** Utilizes full pill profiles (`rounded-full`) to contrast against sharp rectangular stat boards, making actionable elements immediately distinguishable from passive metrics.

## Components

### Buttons
- **Primary Action (Fast-Break Orange):** Background `#F97316`, active state `#EA580C`. Text in `#FFFFFF` Space Grotesk Bold uppercase. Height `48px`, padding horizontal `space-lg`, radius `rounded-lg`.
- **Secondary Action (Tactical Blue Outline):** 1.5px border `#0EA5E9`, background transparent or `rgba(14, 165, 233, 0.08)`. Text `#38BDF8`.
- **Ghost/Destructive:** Foul/turnover buttons use slate surface with bright red indicators (`#EF4444`) on active press.

### Chips & Badges
- **Status Badges (Pills):** Full rounded capsules (`rounded-full`) with `space-xs` vertical and `space-sm` horizontal padding. Active game states use a pulsing orange or green 6px circular dot alongside uppercase label text.
- **Position & Jersey Tags:** Miniature square-rounded tags (`rounded-sm`) in `#334155` background with `#F8FAFC` mono-styled font displaying player numbers (e.g., `#77 PG`).

### Cards & Scouting Containers
- Modular `#1E293B` background with a hairline border (`#334155`). Internal header separation uses subtle inset dividing lines. Header features Space Grotesk `label-md` uppercase with a sky blue accent rule.

### Athletic Stat Gauges & Meters
- **Shot-Clock / Load Meters:** Custom horizontal tracking bars with `#0F172A` background rails and vibrant filled progress in `#F97316` or `#0EA5E9`.
- **Shooting Split Badges:** Tri-column mini-grids displaying FG%, 3P%, and FT% with large bold numerals (`headline-sm`) stacked above small slate-tinted uppercase labels (`label-sm`).

### Input Fields & Controls
- **Inputs:** Dark athletic slate `#0F172A` field backgrounds framed by `#334155` borders. On focus, transitions cleanly to a 1.5px `#0EA5E9` halo with no muddy shadow spread.
- **Checkboxes & Toggles:** Switch tracks utilize `#334155` for inactive and `#F97316` for active states, paired with an ultra-white rounded thumb for instantaneous recognition during fast court transitions.