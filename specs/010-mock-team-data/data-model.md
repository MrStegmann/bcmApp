# Data Model: Mocked Basketball Team, Roster & Match Dataset

**Feature Branch**: `010-mock-team-data`  
**Date**: 2026-10-23  
**Status**: Completed  

---

## Entity Relationship Overview

```
┌─────────────────────────────────┐
│              Team               │
├─────────────────────────────────┤
│ id (PK, Integer)                │
│ name (Text)                     │
│ category (Text)                 │
│ createdAt (Text, ISO8601)       │
└──────────────┬──────────────────┘
               │ 1
               │
               │ has many
               ├─────────────────────────────────────────┐
               │ *                                       │ *
┌──────────────▼──────────────────┐       ┌──────────────▼──────────────────┐
│             Player              │       │              Game               │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id (PK, Integer)                │       │ id (PK, Integer)                │
│ teamId (FK -> Team.id)          │       │ teamId (FK -> Team.id)          │
│ firstName (Text)                │       │ opponent (Text)                 │
│ lastName (Text)                 │       │ round (Text)                    │
│ number (Text, unique per team)  │       │ date (Text, "DD/MM/YYYY - HH:MM")│
│ position (Text, PG/SG/SF/PF/C)  │       │ status ("finished" | "pending") │
│ notes (Text, optional)          │       │ createdAt (Text, ISO8601)       │
│ createdAt (Text, ISO8601)       │       │ resultC1..C4, resultExtra (Int) │
└──────────────┬──────────────────┘       │ resultC1..C4Opponent (Int)      │
               │ 1                        │ foulsC1..C4, foulsExtra (Int)   │
               │                          │ foulsC1..C4Opponent (Int)       │
               │                          └──────────────┬──────────────────┘
               │ has many                                │ 1
               │ *                                       │ has many
               │          ┌──────────────────────────────┘ *
               │          │
┌──────────────▼──────────▼───────┐
│           PlayerStat            │
├─────────────────────────────────┤
│ id (PK, Integer)                │
│ gameId (FK -> Game.id)          │
│ playerId (FK -> Player.id)      │
│ minutes (Integer)               │
│ t1a (Integer, FT made)          │
│ t1i (Integer, FT attempted)     │
│ t2a (Integer, 2PT made)         │
│ t2i (Integer, 2PT attempted)    │
│ t3a (Integer, 3PT made)         │
│ t3i (Integer, 3PT attempted)    │
│ oreb (Integer, off rebounds)    │
│ dreb (Integer, def rebounds)    │
│ asis (Integer, assists)         │
│ rec (Integer, steals)           │
│ per (Integer, turnovers)        │
│ falt (Integer, personal fouls)  │
│ valuation (Integer, score)      │
└─────────────────────────────────┘
```

---

## 1. Entities & Fields

### 1.1 Team
Represents the primary basketball club.

| Field | Type | SQLite Storage | Constraints | Description |
|-------|------|----------------|-------------|-------------|
| `id` | `number` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier |
| `name` | `string` | `TEXT` | `NOT NULL` | Team name (e.g., `"CB Salliver"`) |
| `category` | `string` | `TEXT` | `NULLABLE` | Division/category (e.g., `"Junior Celeste"`) |
| `createdAt` | `string` | `TEXT` | `NOT NULL DEFAULT ISO` | Creation timestamp |

### 1.2 Player
Represents an individual roster athlete.

| Field | Type | SQLite Storage | Constraints | Description |
|-------|------|----------------|-------------|-------------|
| `id` | `number` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier |
| `teamId` | `number` | `INTEGER` | `NOT NULL, FK -> teams(id) ON DELETE CASCADE` | Associated team |
| `firstName` | `string` | `TEXT` | `NOT NULL` | Player given name |
| `lastName` | `string` | `TEXT` | `NOT NULL` | Player surname |
| `number` | `string` | `TEXT` | `NOT NULL` | Jersey number (unique within team) |
| `position` | `string` | `TEXT` | `NULLABLE` | Standard position: PG, SG, SF, PF, C |
| `notes` | `string` | `TEXT` | `NULLABLE` | Tactical notes / player profile info |
| `createdAt` | `string` | `TEXT` | `NOT NULL DEFAULT ISO` | Creation timestamp |

### 1.3 Game (Match)
Represents a scheduled or played fixture.

| Field | Type | SQLite Storage | Constraints | Description |
|-------|------|----------------|-------------|-------------|
| `id` | `number` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier |
| `teamId` | `number` | `INTEGER` | `NOT NULL, FK -> teams(id) ON DELETE CASCADE` | Associated team |
| `opponent` | `string` | `TEXT` | `NOT NULL` | Opponent club name |
| `round` | `string` | `TEXT` | `NOT NULL DEFAULT '1'` | Competition round |
| `date` | `string` | `TEXT` | `NOT NULL` | Timestamp formatted as `"DD/MM/YYYY - HH:MM"` |
| `status` | `string` | `TEXT` | `NOT NULL DEFAULT 'pending'` | `"finished"` or `"pending"` |
| `createdAt` | `string` | `TEXT` | `NOT NULL DEFAULT ISO` | Creation timestamp |
| `resultC1..C4` | `number` | `INTEGER` | `DEFAULT 0` | Home points per quarter |
| `resultExtra` | `number` | `INTEGER` | `DEFAULT 0` | Home points in overtime (if applicable) |
| `resultC1..C4Opponent` | `number` | `INTEGER` | `DEFAULT 0` | Opponent points per quarter |
| `resultExtraOpponent` | `number` | `INTEGER` | `DEFAULT 0` | Opponent points in overtime |
| `foulsC1..C4` | `number` | `INTEGER` | `DEFAULT 0` | Home fouls per quarter |
| `foulsExtra` | `number` | `INTEGER` | `DEFAULT 0` | Home fouls in overtime |
| `foulsC1..C4Opponent` | `number` | `INTEGER` | `DEFAULT 0` | Opponent fouls per quarter |
| `foulsExtraOpponent` | `number` | `INTEGER` | `DEFAULT 0` | Opponent fouls in overtime |

### 1.4 PlayerStat (Match Performance)
Represents individual box score stats for a finished game.

| Field | Type | SQLite Storage | Constraints | Description |
|-------|------|----------------|-------------|-------------|
| `id` | `number` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier |
| `gameId` | `number` | `INTEGER` | `NOT NULL, FK -> games(id) ON DELETE CASCADE` | Linked match |
| `playerId` | `number` | `INTEGER` | `NOT NULL, FK -> players(id) ON DELETE CASCADE` | Linked roster player |
| `minutes` | `number` | `INTEGER` | `DEFAULT 0` | Minutes on court (0 for DNP) |
| `t1a` | `number` | `INTEGER` | `DEFAULT 0` | Free throws made |
| `t1i` | `number` | `INTEGER` | `DEFAULT 0` | Free throws attempted ($t1i \ge t1a$) |
| `t2a` | `number` | `INTEGER` | `DEFAULT 0` | 2-point field goals made |
| `t2i` | `number` | `INTEGER` | `DEFAULT 0` | 2-point field goals attempted ($t2i \ge t2a$) |
| `t3a` | `number` | `INTEGER` | `DEFAULT 0` | 3-point field goals made |
| `t3i` | `number` | `INTEGER` | `DEFAULT 0` | 3-point field goals attempted ($t3i \ge t3a$) |
| `oreb` | `number` | `INTEGER` | `DEFAULT 0` | Offensive rebounds |
| `dreb` | `number` | `INTEGER` | `DEFAULT 0` | Defensive rebounds |
| `asis` | `number` | `INTEGER` | `DEFAULT 0` | Assists |
| `rec` | `number` | `INTEGER` | `DEFAULT 0` | Steals (recuperaciones) |
| `per` | `number` | `INTEGER` | `DEFAULT 0` | Turnovers (pérdidas) |
| `falt` | `number` | `INTEGER` | `DEFAULT 0` | Personal fouls ($0 \le falt \le 5$) |
| `valuation` | `number` | `INTEGER` | `DEFAULT 0` | FIBA/ACB valuation metric |

---

## 2. Validation Rules & Invariants

1. **Roster Size**: $\ge 12$ players per team.
2. **Unique Numbers**: $\forall p_1, p_2 \in \text{Roster}, p_1.\text{number} \ne p_2.\text{number}$.
3. **Match Status Count**: Exactly 5 matches with `status = "finished"` and exactly 5 matches with `status = "pending"`.
4. **Finished Matches Scoring Integrity**:
   $$\text{Total Points} = \text{resultC1} + \text{resultC2} + \text{resultC3} + \text{resultC4} + \text{resultExtra}$$
   $$\text{Total Points} = \sum_{p \in \text{Stats}} (p.\text{t1a} \times 1 + p.\text{t2a} \times 2 + p.\text{t3a} \times 3)$$
5. **Shot Feasibility**: For every player stat: $t1a \le t1i$, $t2a \le t2i$, $t3a \le t3i$.
6. **DNP Players**: If $\text{minutes} = 0$, then $t1a = t1i = t2a = t2i = t3a = t3i = oreb = dreb = asis = rec = per = falt = valuation = 0$.
7. **Valuation Conformity**:
   $$p.\text{valuation} = (p.\text{t1a} + p.\text{t2a} + p.\text{t3a}) + p.\text{oreb} + p.\text{dreb} + p.\text{asis} + p.\text{rec} - p.\text{per} - p.\text{falt} - (p.\text{t1i} - p.\text{t1a}) - (p.\text{t2i} - p.\text{t2a}) - (p.\text{t3i} - p.\text{t3a})$$
8. **Relational Completeness**:
   Every `playerId` in `playerStats` must match an `id` present in `players` where `players.teamId == games.teamId`.
