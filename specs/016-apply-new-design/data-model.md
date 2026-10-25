# Data Model: CourtVision Kinetic Design Tokens & Component Styling

## Overview
This document models the design system entities, token hierarchy, and component style contracts defined by `DESIGN.md` and applied across BasketApp (`bcmApp`).

---

## 1. Token Entities & Hierarchy

```text
CourtVision Kinetic Theme
├── Colors
│   ├── Surface Palette (Dark Athletic Slate)
│   │   ├── surface: #0B1326 (Canvas ground)
│   │   ├── surface-dim: #0B1326
│   │   ├── surface-bright: #31394D
│   │   ├── surface-container-lowest: #060E20
│   │   ├── surface-container-low: #131B2E
│   │   ├── surface-container: #171F33
│   │   ├── surface-container-high: #222A3D
│   │   └── surface-container-highest: #2D3449
│   ├── Athletic Slate Direct Tokens
│   │   ├── slate-dark: #0F172A (Root background fallback)
│   │   ├── slate-card: #1E293B (Level 1 card module surface)
│   │   └── slate-border: #334155 (Level 1 structural border)
│   ├── Brand & Action Palette
│   │   ├── primary: #FFB690 (Accent / tint)
│   │   ├── primary-container: #F97316 (Court Orange primary action trigger)
│   │   ├── on-primary-container: #582200
│   │   ├── court-orange: #F97316
│   │   ├── court-orange-dark: #EA580C (Active / pressed state)
│   │   ├── secondary: #89CEFF
│   │   ├── secondary-container: #00A2E6 (Tactical Sky Blue)
│   │   ├── tactical-blue: #0EA5E9 (Secondary borders & highlights)
│   │   ├── tactical-blue-light: #38BDF8
│   │   └── tertiary: #7BD0FF
│   ├── Contrast & Typography
│   │   ├── on-surface: #DAE2FD (Primary text on dark surfaces)
│   │   ├── on-surface-variant: #E0C0B1 (Subtle / label text)
│   │   ├── text-court-white: #FFFFFF
│   │   └── text-court-offwhite: #F8FAFC
│   └── Functional & Alert Palette
│       ├── error: #FFB4AB
│       ├── error-container: #93000A
│       ├── court-green: #10B981 (Positive efficiency / win indicator)
│       └── court-red: #EF4444 (Fouls, turnovers, errors)
├── Typography Scales
│   ├── headline-xl: 36px / 44px (Space Grotesk, 700)
│   ├── headline-xl-mobile: 30px / 36px (Space Grotesk, 700)
│   ├── headline-lg: 28px / 34px (Space Grotesk, 700)
│   ├── headline-md: 22px / 28px (Space Grotesk, 600)
│   ├── headline-sm: 18px / 24px (Space Grotesk, 600)
│   ├── body-lg: 16px / 24px (Inter, 400)
│   ├── body-md: 14px / 20px (Inter, 400)
│   ├── body-sm: 12px / 16px (Inter, 400)
│   ├── label-lg: 14px / 18px (Space Grotesk, 600, tracking 0.02em)
│   ├── label-md: 12px / 16px (Space Grotesk, 600, tracking 0.04em)
│   ├── label-sm: 10px / 12px (Space Grotesk, 700, tracking 0.08em)
│   └── stat-display: 44px / 48px (Space Grotesk, 700, tracking -0.04em)
├── Spacing & Rhythm
│   ├── gutter: 1rem (16px)
│   ├── gutter-sm: 0.75rem (12px)
│   ├── margin: 1rem (16px)
│   ├── margin-tablet: 1.5rem (24px)
│   ├── space-xs: 0.25rem (4px)
│   ├── space-sm: 0.5rem (8px)
│   ├── space-md: 1rem (16px)
│   ├── space-lg: 1.5rem (24px)
│   └── space-xl: 2rem (32px)
└── Border Radius & Shapes
    ├── sm: 0.25rem (4px) - Position tags, jersey badges
    ├── DEFAULT: 0.5rem (8px) - Metric containers
    ├── md: 0.75rem (12px) - Compact stat cards
    ├── lg: 1rem (16px) - Action buttons, elevated module cards
    ├── xl: 1.5rem (24px) - Modals, action sheets
    └── full: 9999px - Status pills, capsule indicators, avatar icons
```

---

## 2. Component Visual Profiles

| Profile Name | Visual Role | Key NativeWind Classes | Required Minimum Touch |
|--------------|-------------|------------------------|------------------------|
| **Primary Button** | Main call-to-action (Save, Create, Start Match) | `bg-[#F97316] active:bg-[#EA580C] rounded-lg px-6 py-3 items-center justify-center min-h-[48px]` (Text: `text-white font-bold tracking-wider uppercase`) | 48 x 48 px |
| **Secondary Button** | Alternative actions (Cancel, Back, Secondary Filter) | `border-1.5 border-[#0EA5E9] bg-transparent active:bg-[#0EA5E9]/10 rounded-lg px-4 py-3 items-center justify-center min-h-[48px]` (Text: `text-[#38BDF8] font-bold`) | 48 x 48 px |
| **Danger Button** | Destructive triggers (Delete Club/Player/Match) | `bg-[#93000A] active:bg-[#690005] rounded-lg px-4 py-3 items-center justify-center min-h-[48px]` (Text: `text-[#FFDAD6] font-bold`) | 48 x 48 px |
| **Card Container (Level 1)** | Content modules, game cards, player list items | `bg-[#1E293B] border border-[#334155] rounded-xl p-4 shadow-sm` | N/A (or 48px if clickable) |
| **Status Pill (Active)** | Live match status, winning badge | `bg-[#F97316]/20 border border-[#F97316] rounded-full px-3 py-1 flex-row items-center` (Dot: `w-2 h-2 rounded-full bg-[#F97316] mr-1.5`) | N/A |
| **Position / Jersey Tag** | Compact player number & position | `bg-[#334155] rounded-sm px-2 py-0.5 items-center justify-center` (Text: `text-[#F8FAFC] font-mono text-xs font-bold`) | N/A |
| **Input Field** | Text inputs and selectors | `bg-[#0F172A] border border-[#334155] focus:border-[#0EA5E9] rounded-xl px-4 py-3 text-[#DAE2FD] min-h-[48px]` | 48 x 48 px |
| **Stat Gauge / Score Header**| Scoreboard numbers and primary stats | `font-bold text-white text-3xl tracking-tighter` | N/A |

---

## 3. Screen & Component Mapping Inventory

| Domain | Files to Update | Primary Styling Transformation |
|--------|-----------------|-------------------------------|
| **App Root & Shell** | `App.tsx`, `src/components/Header.tsx`, `src/components/BottomNavBar.tsx` | Background to `#0B1326`, header to slate surface with `#334155` border, active nav icons to court orange `#F97316`, inactive to `#A78B7D`. |
| **Framework Primitives** | `src/framework/Button.tsx`, `src/framework/Input.tsx`, `src/framework/ModalInfo.tsx`, `src/framework/DeleteModal.tsx` | Replace `danish-*` classes with CourtVision Kinetic tokens, 48px touch heights, rounded-lg/rounded-xl curvature. |
| **Club Management** | `src/page/ClubManage.tsx`, `src/page/ClubProfile.tsx`, `src/components/ClubForm.tsx`, `src/components/ClubList.tsx` | Dark slate cards (`#1E293B`), court-orange primary submit, tactical blue edit triggers. |
| **Player Management** | `src/page/PlayerList.tsx`, `src/components/PlayerCards.tsx`, `src/components/PlayerDetail.tsx`, `src/components/PlayerForm.tsx`, `src/components/PlayerStatsModal.tsx`, `src/components/RosterSelectionModal.tsx` | Jersey tags in `#334155`, player card elevations, modal container styling (`#171F33`), orange/blue stat pills. |
| **Match History** | `src/page/GameList.tsx`, `src/components/GameCards.tsx`, `src/components/GameForm.tsx`, `src/components/GamesResults.tsx`, `src/components/GameDetail.tsx` | Scoreboard typography (`stat-display`), win/loss badges (emerald/red), match cards on `#1E293B`. |
| **Home View Feature** | `src/features/home-view/components/GlobalStatsCard.tsx`, `NextMatchCard.tsx`, `RecentMatchCard.tsx`, `RecentMatchesColumn.tsx` | Elevated slate cards (`#171F33` / `#1E293B`), gold replaced with court orange/sky blue, high-contrast metrics. |
| **Match Detail Feature** | `src/features/match-detail/components/*` | Roster valuation lists, quarter cards, export triggers updated to tactical blue and slate containers. |
| **Live Match Tracking** | `src/page/PlayMatch.tsx`, `src/features/play-match/*`, `StartingFiveModal.tsx`, `SubstitutionPanel.tsx`, `RivalControlPanel.tsx`, `HalfCourt.tsx` | High-cadence court orange triggers, 48px touch targets for rapid sideline input, dark court markings (`#334155`). |
