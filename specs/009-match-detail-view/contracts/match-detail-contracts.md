# Component & API Contracts: Match Detail View

**Feature Branch**: `009-match-detail-view`  
**Date**: 2026-10-22  
**Status**: Completed  

---

## 1. Feature Public API (`src/features/match-detail/index.ts`)

```typescript
export { MatchDetailView } from "./MatchDetailView";
export type { MatchDetailViewProps } from "./types";
export * from "./types";
```

### Main View Component Contract

```typescript
export interface MatchDetailViewProps {
  /** The completed match entity from SQLite database */
  match: Game;
  /** Callback invoked when the user taps the back/return button */
  onReturn: () => void;
  /** Optional callback invoked after match data edits are committed */
  onMatchUpdated?: (updatedMatch: Game) => void;
}
```

---

## 2. Subcomponent Contracts

### 2.1 MatchSummaryHeader
Displays cumulative scores, team name, rival name, date, edit trigger, and back button.

```typescript
export interface MatchSummaryHeaderProps {
  teamName: string;
  opponentName: string;
  date: string;
  totalTeamScore: number;
  totalRivalScore: number;
  onReturn: () => void;
  onOpenEdit: () => void;
}
```

### 2.2 PeriodBreakdownTable
Renders the period-by-period desglose for points and fouls for both teams.

```typescript
export interface PeriodBreakdownTableProps {
  periods: PeriodBreakdownItem[]; // Q1, Q2, Q3, Q4, and Extra if played
  totalTeamPoints: number;
  totalRivalPoints: number;
  totalTeamFouls: number;
  totalRivalFouls: number;
}
```

### 2.3 RosterValuationList
Displays the value-sorted list of tappable player buttons.

```typescript
export interface RosterValuationListProps {
  players: PlayerRosterItem[]; // Pre-sorted descending by valuation
  onSelectPlayer: (player: PlayerRosterItem) => void;
}
```

### 2.4 PlayerDetailModal
Inspects individual comprehensive statistics when a player button is tapped.

```typescript
export interface PlayerDetailModalProps {
  visible: boolean;
  player: PlayerRosterItem | null;
  onClose: () => void;
}
```

### 2.5 TeamAdvancedAnalytics
Presents the 8 calculated efficiency metrics along with the polygon radar chart.

```typescript
export interface TeamAdvancedAnalyticsProps {
  stats: AdvancedTeamStats;
}
```

### 2.6 PolygonRadarChart
SVG radar visualizer plotting the 8 efficiency metrics on normalized radial axes.

```typescript
export interface PolygonRadarChartProps {
  stats: AdvancedTeamStats;
  size?: number; // Default: 280
}
```

### 2.7 MatchEditModal
Full-screen or scrollable modal permitting edits to period points/fouls and player stats.

```typescript
export interface MatchEditModalProps {
  visible: boolean;
  initialMatch: Game;
  initialPlayers: PlayerRosterItem[];
  onSave: (buffer: MatchEditBuffer) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}
```

---

## 3. Store Contract (`useMatchDetailStore`)

```typescript
export interface MatchDetailState {
  // State
  match: Game | null;
  teamName: string;
  periods: PeriodBreakdownItem[];
  players: PlayerRosterItem[];
  advancedStats: AdvancedTeamStats;
  selectedPlayer: PlayerRosterItem | null;
  isEditModalOpen: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  initializeMatch: (match: Game) => Promise<void>;
  selectPlayer: (player: PlayerRosterItem | null) => void;
  openEditModal: () => void;
  closeEditModal: () => void;
  saveMatchEdits: (buffer: MatchEditBuffer) => Promise<void>;
}
```

---

## 4. Pure Calculation Module (`calculations.ts`)

```typescript
export interface RawTeamTotals {
  totalPoints: number;
  totalRivalPoints: number;
  t1a: number; // 1pt made
  t1i: number; // 1pt attempted
  t2a: number; // 2pt made
  t2i: number; // 2pt attempted
  t3a: number; // 3pt made
  t3i: number; // 3pt attempted
  oreb: number; // offensive rebounds
  dreb: number; // defensive rebounds
  asis: number; // assists
  rec: number;  // steals
  per: number;  // ball lost / turnovers
  falt: number; // personal fouls committed
}

/** Computes the 8 advanced team statistics conforming to domain formulas */
export function calculateAdvancedStats(totals: RawTeamTotals): AdvancedTeamStats;

/** Computes player valuation conforming to standard basketball formula */
export function calculatePlayerValuation(stats: {
  t1a: number;
  t1i: number;
  t2a: number;
  t2i: number;
  t3a: number;
  t3i: number;
  oreb: number;
  dreb: number;
  asis: number;
  rec: number;
  per: number;
  falt: number;
}): number;

/** Aggregates player roster stats into team totals */
export function aggregateTeamTotals(
  players: PlayerRosterItem[],
  totalRivalPoints: number
): RawTeamTotals;
```
