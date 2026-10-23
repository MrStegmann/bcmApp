# Data Model: Update Home View Page

**Feature**: `011-update-home-view`
**Date**: 2026-10-23
**Status**: Completed

---

## 1. Domain Entities & Schemas

### 1.1 NextMatchEntry (View Model)

Represents the upcoming fixture displayed in the top section of the home view.

| Field | Type | Description | Validation / Constraints |
|---|---|---|---|
| `id` | `number` | Unique identifier of the game | Primary Key (matches `games.id`) |
| `teamId` | `number` | Foreign key referencing the active team | Non-null, references `teams.id` |
| `opponent` | `string` | Name of the opposing team | Non-empty string |
| `date` | `string` | Scheduled timestamp of the match | e.g. `"15/10/2026 - 19:30"` or ISO format |
| `round` | `string` | Competition round or jornada number | Defaults to `"1"` |
| `status` | `"pending"` | Match state | Must be `"pending"` (not yet started/finished) |
| `hasRoster` | `boolean` | Indicates if player callups have been configured | `true` if $\ge 1$ player assigned in `player_stats` |

---

### 1.2 RecentMatchSummary (View Model)

Represents a completed game shown in the middle vertical history column.

| Field | Type | Description | Validation / Constraints |
|---|---|---|---|
| `id` | `number` | Unique identifier of the game | Primary Key (matches `games.id`) |
| `teamId` | `number` | Foreign key referencing the active team | References `teams.id` |
| `opponent` | `string` | Name of the opposing team | Non-empty string |
| `date` | `string` | Date/time when the match was played | Formatted timestamp string |
| `round` | `string` | Competition round | e.g. `"Jornada 2"` |
| `status` | `"finished"` | Match state | Must be `"finished"` |
| `teamTotalScore` | `number` | Total cumulative score for the active team | Sum of Q1..Q4 + Extra ($\ge 0$) |
| `rivalTotalScore` | `number` | Total cumulative score for the opponent | Sum of Q1..Q4 + Extra ($\ge 0$) |
| `isWinning` | `boolean` | Whether active team won the game | `teamTotalScore > rivalTotalScore` |
| `periods` | `PeriodScoreItem[]` | Breakdown of quarter-by-quarter points | Array of 4 regulation periods + optional Extra |

---

### 1.3 PeriodScoreItem (View Model)

Represents a single quarter or overtime period score for a finished game.

| Field | Type | Description | Constraints |
|---|---|---|---|
| `period` | `"Q1" \| "Q2" \| "Q3" \| "Q4" \| "OT"` | Period identifier | String enum |
| `teamScore` | `number` | Points scored by active team in period | $\ge 0$ |
| `rivalScore` | `number` | Points scored by rival team in period | $\ge 0$ |

---

### 1.4 GlobalTeamAverages (Analytics Entity)

Represents the aggregated arithmetic mean of the eight advanced metrics across all completed matches for the team.

| Field | Type | Unit | Formula | Division-by-Zero Fallback |
|---|---|---|---|---|
| `posesiones` | `number` | count | $\frac{1}{N} \sum \text{Posesiones}_i$ | `0.0` |
| `oer` | `number` | pts / 100 poss | $\frac{1}{N} \sum \text{OER}_i$ | `0.0` |
| `der` | `number` | pts / 100 poss | $\frac{1}{N} \sum \text{DER}_i$ | `0.0` |
| `efg` | `number` | % | $\frac{1}{N} \sum \text{eFG\%}_i$ | `0.0%` |
| `orb` | `number` | % | $\frac{1}{N} \sum \text{ORB\%}_i$ | `0.0%` |
| `ast` | `number` | % | $\frac{1}{N} \sum \text{AST\%}_i$ | `0.0%` |
| `tov` | `number` | % | $\frac{1}{N} \sum \text{TOV\%}_i$ | `0.0%` |
| `ftr` | `number` | % | $\frac{1}{N} \sum \text{FTR}_i$ | `0.0%` |
| `completedMatchesCount` | `number` | integer | $N$ (Total games with `status === "finished"`) | `0` |

---

## 2. Relationships & Entity-Relationship Mapping

```mermaid
erDiagram
    TEAMS ||--o{ GAMES : schedules
    TEAMS ||--o{ PLAYERS : rosters
    GAMES ||--o{ PLAYER_STATS : records
    PLAYERS ||--o{ PLAYER_STATS : compiles

    GAMES {
        int id PK
        int team_id FK
        text opponent
        text round
        text date
        text status
        int result_c1
        int result_c2
        int result_c3
        int result_c4
        int result_extra
        int result_c1_opponent
        int result_c2_opponent
        int result_c3_opponent
        int result_c4_opponent
        int result_extra_opponent
    }

    PLAYER_STATS {
        int id PK
        int game_id FK
        int player_id FK
        int minutes
        int t1a
        int t1i
        int t2a
        int t2i
        int t3a
        int t3i
        int oreb
        int dreb
        int asis
        int rec
        int per
        int falt
        int valuation
    }
```

---

## 3. State Lifecycle & Transitions

```mermaid
stateDiagram-v2
    [*] --> Initializing : User opens Team Dashboard (MAIN)
    Initializing --> FetchingData : Load team matches & player stats
    FetchingData --> RenderingDashboard : Data fetched successfully
    FetchingData --> ErrorState : Fetch error

    state RenderingDashboard {
        [*] --> EvaluatingNextMatch
        EvaluatingNextMatch --> DisplayNextMatch : Earliest pending match exists
        EvaluatingNextMatch --> DisplayEmptyNextMatch : 0 pending matches ("Sin próximos partidos agendados")

        DisplayNextMatch --> TriggerRosterModal : User taps "Configurar Convocatoria"
        TriggerRosterModal --> PersistRoster : User selects & confirms roster
        PersistRoster --> EvaluatingNextMatch : Reloads match roster state

        [*] --> EvaluatingRecentMatches
        EvaluatingRecentMatches --> DisplayRecentList : Up to 3 finished matches (newest first)
        EvaluatingRecentMatches --> DisplayEmptyRecent : 0 finished matches

        DisplayRecentList --> OpenMatchDetail : User taps match card
        OpenMatchDetail --> DisplayRecentList : User returns from Match Detail

        [*] --> CalculatingGlobalStats
        CalculatingGlobalStats --> DisplayStatsAverages : N > 0 finished matches
        CalculatingGlobalStats --> DisplayZeroStats : N = 0 finished matches (0.0 / 0.0%)
    }
```

---
