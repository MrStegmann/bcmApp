# Data Model: Match Stats Graphic Export & Sharing

**Feature Branch**: `012-share-match-stats`
**Date**: 2026-10-23
**Feature Spec**: [spec.md](./spec.md)

## Conceptual Model

The sharing workflow compiles existing match data (metadata, roster box scores, period scores, and advanced metrics) into a unified, read-only data structure formatted specifically for high-resolution tabular visual presentation and export.

```
+-------------------------------------------------------------------------------+
|                            MatchShareGraphicData                              |
|  - matchId: number                                                            |
|  - homeTeamName: string                                                       |
|  - rivalTeamName: string                                                      |
|  - roundAndDate: string ("Jornada X - DD/MM/AAAA")                           |
|  - isFinished: boolean                                                        |
+-------------------------------------------------------------------------------+
       |                               |                              |
       v                               v                              v
+------------------------+  +----------------------+  +-------------------------+
| PlayerBoxScoreRowData[]|  |  PeriodScoreRowData[]|  | AdvancedStatsBlockData  |
| (1 row per player)     |  | (C1, C2, C3, C4,     |  | - posesiones: string    |
| - jerseyNumber         |  |  Extra?, Final)      |  | - oer: string           |
| - playerName           |  | - label: string      |  | - der: string           |
| - minutes, pts, val    |  | - homePoints: number |  | - efg: string           |
| - t2a, t2i, t2p        |  | - rivalPoints: number|  | - orb: string           |
| - t3a, t3i, t3p        |  +----------------------+  | - ast: string           |
| - t1a, t1i, t1p        |                            | - tov: string           |
| - dreb, oreb, treb     |                            | - tlr: string           |
| - asis, rec, per       |                            +-------------------------+
| - tapF, tapC           |
| - falt, faltR          |
+------------------------+
       |
       v
+------------------------+
|   TeamTotalsRowData    |
| (Aggregated summary)   |
| - label: "EQUIPO"      |
| - sums + collective %  |
+------------------------+
```

---

## Entities & Interfaces

### 1. `PlayerBoxScoreRowData`

Represents one player row in the graphic table (24 columns):

| Field | Type | Description | Validation / Default Rule |
| :--- | :--- | :--- | :--- |
| `jerseyNumber` | `string` | Player jersey number (`Núm.`) | Defaults to `"-"` if empty |
| `playerName` | `string` | Display name (`Nombre`) | First name + Last name |
| `minutes` | `number` | Minutes played (`Min`) | Non-negative integer (default `0`) |
| `pts` | `number` | Total points (`Pts`) | `t1a*1 + t2a*2 + t3a*3` |
| `t2a` | `number` | 2-pt field goals made (`T2A`) | Non-negative integer |
| `t2i` | `number` | 2-pt field goals attempted (`T2I`) | `t2i >= t2a` |
| `t2p` | `string` | 2-pt field goal % (`T2%`) | `t2i > 0 ? (t2a/t2i*100).toFixed(0)+'%' : '0%'` |
| `t3a` | `number` | 3-pt field goals made (`T3A`) | Non-negative integer |
| `t3i` | `number` | 3-pt field goals attempted (`T3I`) | `t3i >= t3a` |
| `t3p` | `string` | 3-pt field goal % (`T3%`) | `t3i > 0 ? (t3a/t3i*100).toFixed(0)+'%' : '0%'` |
| `t1a` | `number` | Free throws made (`T1A`) | Non-negative integer |
| `t1i` | `number` | Free throws attempted (`T1I`) | `t1i >= t1a` |
| `t1p` | `string` | Free throw % (`T1%`) | `t1i > 0 ? (t1a/t1i*100).toFixed(0)+'%' : '0%'` |
| `dreb` | `number` | Defensive rebounds (`DReb`) | Non-negative integer |
| `oreb` | `number` | Offensive rebounds (`OReb`) | Non-negative integer |
| `treb` | `number` | Total rebounds (`TReb`) | `dreb + oreb` |
| `asis` | `number` | Assists (`Asis`) | Non-negative integer |
| `rec` | `number` | Steals (`Rec`) | Non-negative integer |
| `per` | `number` | Turnovers (`Per`) | Non-negative integer |
| `tapF` | `number` | Blocks in favor (`TapF`) | Untracked: default `0` |
| `tapC` | `number` | Blocks against (`TapC`) | Untracked: default `0` |
| `falt` | `number` | Personal fouls committed (`Falt`) | Non-negative integer |
| `faltR` | `number` | Fouls received (`FaltR`) | Untracked: default `0` |
| `val` | `number` | Valuation (`Val`) | Standard basketball valuation formula |

---

### 2. `TeamTotalsRowData`

Represents the `EQUIPO` summary row at the bottom of the player roster:

| Field | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | Constant `"EQUIPO"` |
| `minutes` | `number` | Sum of all player minutes |
| `pts` | `number` | Total team points |
| `t2a`, `t2i` | `number` | Total 2pt makes and attempts |
| `t2p` | `string` | Collective 2pt percentage (`totalT2a / totalT2i`) |
| `t3a`, `t3i` | `number` | Total 3pt makes and attempts |
| `t3p` | `string` | Collective 3pt percentage (`totalT3a / totalT3i`) |
| `t1a`, `t1i` | `number` | Total 1pt makes and attempts |
| `t1p` | `string` | Collective 1pt percentage (`totalT1a / totalT1i`) |
| `dreb`, `oreb`, `treb` | `number` | Total team rebounds |
| `asis`, `rec`, `per` | `number` | Total assists, steals, turnovers |
| `tapF`, `tapC` | `number` | Total blocks (default `0`) |
| `falt`, `faltR` | `number` | Total fouls (committed and received) |
| `val` | `number` | Total team valuation |

---

### 3. `PeriodScoreRowData`

Represents one row in the `Parciales` table:

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `period` | `string` | Period code/label | `"C1"`, `"C2"`, `"C3"`, `"C4"`, `"Extra"`, `"Final"` |
| `homeScore` | `number` | Points scored by home team in this period (or cumulative for Final) | `18` |
| `rivalScore` | `number` | Points scored by rival team in this period (or cumulative for Final) | `14` |

---

### 4. `AdvancedStatsBlockData`

Represents the 8 advanced metrics formatted for the lower-left summary table:

| Metric | Key | Format | Example | Guard Rule |
| :--- | :--- | :--- | :--- | :--- |
| Posesiones | `posesiones` | `X.X` | `72.4` | Denominator guard -> `0.0` |
| OER | `oer` | `X.XX` or `X.X` | `102.3` | Posesiones > 0 ? (Pts / Posesiones)*100 : 0.0 |
| DER* | `der` | `X.XX` or `X.X` | `88.5` | Posesiones > 0 ? (RivalPts / Posesiones)*100 : 0.0 |
| eFG% | `efg` | `XX.X%` | `48.2%` | FGA > 0 ? (2PM+3PM+0.5*3PM)/FGA : 0.0% |
| ORB%* | `orb` | `XX.X%` | `31.0%` | Denominator > 0 ? (OReb/Denom) : 0.0% |
| AST% | `ast` | `XX.X%` | `54.1%` | Denominator > 0 ? (Asis/Denom) : 0.0% |
| TOV% | `tov` | `XX.X%` | `15.8%` | Posesiones > 0 ? (Per/Posesiones) : 0.0% |
| TLR% | `tlr` | `XX.X%` | `24.5%` | FGA > 0 ? (1PM/FGA) : 0.0% |

---

### 5. `MatchShareState` & Workflow Transitions

```
[ IDLE ]
   │
   │  User taps "Compartir Estadísticas"
   ▼
[ PREVIEW_OPEN ] (Modal renders graphic preview, status: ready)
   │
   ├─► User taps "Compartir / WhatsApp"
   │     │
   │     ▼
   │   [ CAPTURING_PNG ] (captureRef running)
   │     │
   │     ▼
   │   [ SHARING_DISPATCH ] (expo-sharing opens system share sheet)
   │     │
   │     ▼
   │   [ SUCCESS / ERROR ] (Toast feedback)
   │
   └─► User taps "Guardar en Galería"
         │
         ▼
       [ CAPTURING_PNG ]
         │
         ▼
       [ REQUESTING_PERMISSION ] (expo-media-library)
         │
         ├── Granted ──► [ SAVING_ASSET ] ──► [ SUCCESS_TOAST ]
         └── Denied  ──► [ PERMISSION_ERROR_ALERT ]
```
