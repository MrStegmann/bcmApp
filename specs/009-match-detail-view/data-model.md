# Data Model: Match Detail View & Advanced Analytics

**Feature Branch**: `009-match-detail-view`  
**Date**: 2026-10-22  
**Status**: Completed  

---

## 1. Database Entities (Drizzle ORM & SQLite)

### 1.1 Extended `games` Table
The `games` table in SQLite (`bcmapp.db`) tracks individual match metadata, quarter scores, and quarter fouls.

```typescript
export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  opponent: text("opponent").notNull(),
  round: text("round").notNull().default("1"),
  date: text("date").notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'finished'
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),

  // Period Points (Home Team)
  resultC1: integer("result_c1").default(0),
  resultC2: integer("result_c2").default(0),
  resultC3: integer("result_c3").default(0),
  resultC4: integer("result_c4").default(0),
  resultExtra: integer("result_extra").default(0),

  // Period Points (Opponent)
  resultC1Opponent: integer("result_c1_opponent").default(0),
  resultC2Opponent: integer("result_c2_opponent").default(0),
  resultC3Opponent: integer("result_c3_opponent").default(0),
  resultC4Opponent: integer("result_c4_opponent").default(0),
  resultExtraOpponent: integer("result_extra_opponent").default(0),

  // Period Fouls (Home Team) - NEW
  foulsC1: integer("fouls_c1").default(0),
  foulsC2: integer("fouls_c2").default(0),
  foulsC3: integer("fouls_c3").default(0),
  foulsC4: integer("fouls_c4").default(0),
  foulsExtra: integer("fouls_extra").default(0),

  // Period Fouls (Opponent) - NEW
  foulsC1Opponent: integer("fouls_c1_opponent").default(0),
  foulsC2Opponent: integer("fouls_c2_opponent").default(0),
  foulsC3Opponent: integer("fouls_c3_opponent").default(0),
  foulsC4Opponent: integer("fouls_c4_opponent").default(0),
  foulsExtraOpponent: integer("fouls_extra_opponent").default(0),
});
```

### 1.2 `player_stats` Table (Existing)
Tracks box score counters for each called-up player in a specific game.

```typescript
export const playerStats = sqliteTable("player_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameId: integer("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  minutes: integer("minutes").default(0),
  t1a: integer("t1a").default(0), // 1pt made
  t1i: integer("t1i").default(0), // 1pt attempted (total)
  t2a: integer("t2a").default(0), // 2pt made
  t2i: integer("t2i").default(0), // 2pt attempted (total)
  t3a: integer("t3a").default(0), // 3pt made
  t3i: integer("t3i").default(0), // 3pt attempted (total)
  oreb: integer("oreb").default(0), // Offensive rebounds
  dreb: integer("dreb").default(0), // Defensive rebounds
  asis: integer("asis").default(0), // Assists
  rec: integer("rec").default(0),   // Steals
  per: integer("per").default(0),   // Turnovers / Ball Lost
  falt: integer("falt").default(0), // Personal fouls committed
  valuation: integer("valuation").default(0), // Valuation score
});
```

---

## 2. In-Memory Domain & UI Models

### 2.1 `PeriodBreakdownItem`
Normalized representation of a single quarter's scoring and foul counts for UI rendering and editing.

```typescript
export type PeriodId = "q1" | "q2" | "q3" | "q4" | "extra";

export interface PeriodBreakdownItem {
  id: PeriodId;
  label: string; // "Period 1", "Period 2", "Period 3", "Period 4", "Extra"
  teamPoints: number;
  teamFouls: number;
  rivalPoints: number;
  rivalFouls: number;
  isExtra: boolean;
}
```

### 2.2 `PlayerRosterItem`
Combined player identity and box score statistics for valuation sorting, roster buttons, and modal details.

```typescript
export interface PlayerRosterItem {
  id: number;              // player ID
  statId: number;          // player_stats ID
  jerseyNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  minutes: number;
  points: number;          // t1a * 1 + t2a * 2 + t3a * 3
  valuation: number;       // computed or stored valuation
  
  // Detailed Box Score Counts
  t1a: number; // 1pt made
  t1i: number; // 1pt attempted
  t2a: number; // 2pt made
  t2i: number; // 2pt attempted
  t3a: number; // 3pt made
  t3i: number; // 3pt attempted
  oreb: number; // offensive rebounds
  dreb: number; // defensive rebounds
  totalRebounds: number; // oreb + dreb
  asis: number; // assists
  rec: number;  // steals
  per: number;  // turnovers
  falt: number; // fouls committed
}
```

### 2.3 `AdvancedTeamStats`
Calculated tactical efficiency metrics derived from team totals.

```typescript
export interface AdvancedTeamStats {
  posesiones: number; // Posesiones (total)
  oer: number;        // Offensive Efficiency Rating
  der: number;        // Defensive Efficiency Rating
  efg: number;        // Effective Field Goal Percentage (%)
  orb: number;        // Offensive Rebound Percentage (%)
  ast: number;        // Assist Percentage (%)
  tov: number;        // Turnover Percentage (%)
  ftr: number;        // Free Throw Rate (%)
}

export interface AdvancedMetricDefinition {
  key: keyof AdvancedTeamStats;
  name: string;        // e.g. "OER", "eFG%"
  label: string;       // e.g. "Offensive Efficiency Rating"
  format: "number" | "percent";
  unit: string;        // "%" or "pts/100"
  description: string;
}
```

### 2.4 `RadarPoint` & `RadarPolygonData`
Data structure consumed by the radar/polygon visualization.

```typescript
export interface RadarAxis {
  key: keyof AdvancedTeamStats;
  label: string;
  angleDeg: number;    // 0, 45, 90, 135, 180, 225, 270, 315
  rawValue: number;
  normalizedValue: number; // 0.0 to 1.0 scale
  x: number;
  y: number;
}

export interface RadarPolygonData {
  axes: RadarAxis[];
  polygonPointsSvg: string; // "x1,y1 x2,y2 ... x8,y8"
  gridPolygons: string[];   // SVG points for concentric 25%, 50%, 75%, 100% webs
}
```

### 2.5 `MatchEditBuffer`
Draft state used during edit mode before persistence.

```typescript
export interface MatchEditBuffer {
  periods: Record<PeriodId, {
    teamPoints: number;
    teamFouls: number;
    rivalPoints: number;
    rivalFouls: number;
  }>;
  players: Record<number, { // keyed by playerId
    minutes: number;
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
  }>;
}
```

---

## 3. Validation & Invariant Rules

1. **Non-Negative Statistics**:
   - `minutes >= 0`, `attempts >= makes >= 0` (`t1i >= t1a`, `t2i >= t2a`, `t3i >= t3a`).
   - Counts for rebounds, assists, steals, turnovers, and fouls must be integers `>= 0`.
2. **Deterministic Valuation Ranking**:
   - Primary: `b.valuation - a.valuation` descending.
   - Secondary: `b.points - a.points` descending.
   - Tertiary: `Number(a.jerseyNumber) - Number(b.jerseyNumber)` ascending.
3. **Period Bounds**:
   - Q1, Q2, Q3, Q4 are always present.
   - `extra` period is displayed and editable if `resultExtra > 0 || resultExtraOpponent > 0 || foulsExtra > 0 || foulsExtraOpponent > 0`, or toggled on in edit mode.
4. **Division Safety**:
   - In all 8 metric calculations, any division where the denominator is `<= 0` immediately evaluates to `0.0`.
