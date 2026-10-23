# Implementation Plan: Share Match Stats Graphic & Export

**Branch**: `012-share-match-stats` | **Date**: 2026-10-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-share-match-stats/spec.md`

## Summary

Provide an export and sharing capability inside the Match Detail View that allows coaches, team managers, and statisticians to generate a high-resolution, uncompressed PNG box score graphic from a finished match. The graphic mirrors the professional spreadsheet reference layout (team & rival headers, round/date, 24-column player stats table, team totals row, advanced stats lower-left block, and period score breakdown lower-right block). Users can save the PNG directly to their device photo gallery or dispatch it to WhatsApp and messaging channels via the native OS share sheet.

## Technical Context

**Language/Version**: TypeScript 6.0.3 (Strict Mode) on React Native 0.86.3 & React 19.2.3 (Expo SDK 57)

**Primary Dependencies**:
- `react-native-view-shot` (for offscreen/preview canvas capture to PNG file)
- `expo-sharing` (for native OS share sheet with file attachments, enabling WhatsApp sharing)
- `expo-media-library` (for direct photo gallery saving with permission management)
- `nativewind` v4.2.1 (utility-first Tailwind CSS styling)
- `zustand` v5.0.8 (state management)
- `drizzle-orm` v0.45.3 & `expo-sqlite` v57.0.3 (underlying database entities)

**Storage**: Local SQLite via Expo SQLite & Drizzle ORM (read-only query of existing `games` and `player_stats` tables; no schema changes required)

**Testing**: Jest v29.7.0 with `@testing-library/react-native` for unit, calculation, and component tests

**Target Platform**: iOS and Android mobile devices (Expo managed / dev-client runtime)

**Project Type**: Mobile Application (React Native)

**Performance Goals**:
- PNG generation and share sheet preparation in <3.0 seconds from tap (SC-001)
- Crisp text resolution at 1280px minimum width (SC-003) with zero visual clipping across any roster size

**Constraints**:
- Offline-capable: PNG generation and local gallery saving must work without active internet connectivity
- Zero division protection: Games with 0 possessions or 0/0 shooting must display `0%` / `0.0` without `NaN` or unhandled exceptions
- Seamless permissions handling: Friendly notification if photo permissions are denied

**Scale/Scope**:
- 1 new export modal component (`MatchShareModal`)
- 1 new visual graphic component (`MatchStatsGraphic`)
- 1 share service utility (`matchShareService`)
- 1 data formatting utility (`shareDataFormatter`)
- Share action trigger integrated into `MatchSummaryHeader` / `MatchDetailView`
- ~6-8 dedicated Jest unit test suites

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Verification |
| :--- | :--- | :--- | :--- |
| **I. Test-Driven Development First** | Tests written before/alongside implementation code; 100% Jest test passing | **PASS** | Co-located Jest tests in `src/features/match-detail/__tests__/` covering calculations, modal rendering, graphic composition, and service mocks. |
| **II. Feature-Based Architecture** | Encapsulated within `src/features/<feature-name>/`, barrel exports via `index.ts` | **PASS** | All new components, hooks, services, and formatters reside in `src/features/match-detail/`. Public interface exposed via `src/features/match-detail/index.ts`. |
| **III. Type-Safe Persistence** | Drizzle ORM + Expo SQLite type inference; no raw untyped queries | **PASS** | Read-only access to existing typed entities (`Game`, `PlayerStat`, `Player`, `Team`). No schema modifications needed. |
| **IV. Predictable State Management** | Focused Zustand stores; immutable transitions | **PASS** | Modal visibility and export status handled predictably within `useMatchDetailStore` or a dedicated feature hook. |
| **V. Utility-First Styling** | NativeWind utility classes via `className`; design tokens | **PASS** | All UI elements in `MatchShareModal` and `MatchStatsGraphic` styled with NativeWind classes. |
| **VI. Strict TypeScript** | Strict mode, no implicit `any`, explicit types for all props and services | **PASS** | Full contract interfaces defined in `contracts/share-service-contract.ts` with strict TypeScript. |

## Project Structure

### Documentation (this feature)

```text
specs/012-share-match-stats/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 research and decisions
├── data-model.md        # Phase 1 data entities and formatting model
├── quickstart.md        # Phase 1 run & validation guide
├── contracts/           # Phase 1 contracts
│   └── share-service-contract.ts
├── checklists/
│   └── requirements.md  # Requirements checklist
└── tasks.md             # Phase 2 task list (/speckit-tasks output)
```

### Source Code (repository root)

```text
src/features/match-detail/
├── MatchDetailView.tsx                    # Integrates share action button & MatchShareModal
├── index.ts                               # Public feature barrel export
├── types/
│   ├── index.ts                           # Updated with share types
│   └── share.ts                           # Data contracts for graphic export
├── components/
│   ├── MatchSummaryHeader.tsx             # Added "Compartir Estadísticas" action button
│   ├── MatchShareModal.tsx                # Modal with graphic preview & Save / Share buttons
│   ├── MatchStatsGraphic.tsx              # 1280px tabular box score graphic component for capture
│   ├── PeriodBreakdownTable.tsx           # Existing period breakdown
│   ├── PlayerDetailModal.tsx              # Existing player modal
│   ├── PolygonRadarChart.tsx              # Existing radar chart
│   ├── RosterValuationList.tsx            # Existing roster list
│   └── TeamAdvancedAnalytics.tsx          # Existing team analytics
├── services/
│   └── matchShareService.ts               # Implements captureViewToPng, shareImageFile, saveImageToGallery
├── utils/
│   ├── calculations.ts                    # Existing domain calculations
│   └── shareDataFormatter.ts              # Formats raw match data into MatchShareGraphicData
├── store/
│   └── useMatchDetailStore.ts             # State for share modal open/close & export flow
└── __tests__/
    ├── components/
    │   ├── MatchShareModal.test.tsx       # Modal rendering, actions, and states
    │   ├── MatchStatsGraphic.test.tsx     # Graphic table rendering, 24 columns, totals
    │   └── MatchSummaryHeader.test.tsx    # Share button presence on finished games
    ├── services/
    │   └── matchShareService.test.ts      # Unit tests mocking captureRef, sharing, mediaLibrary
    └── utils/
        └── shareDataFormatter.test.ts     # Formatters, zero protection, team totals
```

**Structure Decision**: The share functionality is placed directly inside `src/features/match-detail/` as domain components, services, and utilities. This maintains high cohesion because sharing is specifically an action on a finished match detail view, utilizing the exact match, periods, and player rosters already loaded in `useMatchDetailStore`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitution violations. All core principles (TDD, Feature Architecture, Strict TS, NativeWind, Zustand, Drizzle) strictly observed.*
