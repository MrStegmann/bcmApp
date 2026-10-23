# Research: Mocked Basketball Team, Roster & Match Dataset

**Feature Branch**: `010-mock-team-data`  
**Date**: 2026-10-23  
**Status**: Completed  

---

## 1. Architectural Placement of Mock Dataset & Seeders

### Context
The application is a React Native mobile app using Expo, Drizzle ORM, and `expo-sqlite`. Seeding is invoked both in automated test suites (Jest running under Node with mocked `expo-sqlite`) and potentially during local development / runtime demo resets.

### Decision
Structure the mock dataset into modular components:
1. `src/db/mock/mockTeamData.ts`: Pure, strongly-typed static dataset definitions containing the team profile, 12 player profiles with positions and unique jersey numbers, and 10 matches (5 finished with quarter breakdowns and player stat box scores, 5 upcoming).
2. `scripts/seed-db.ts` / `src/db/seed.ts`: Orchestrates clearing existing records (`playerStats` -> `games` -> `players` -> `teams`) and executing batch/relational insertions using Drizzle ORM.
3. `src/db/mock/mockDataValidator.ts`: Pure mathematical and relational integrity validation functions that verify `sum(player points) == match score`, DNP consistency, unique jersey numbers, and valuation matching `calculatePlayerValuation`.

### Rationale
- Pure data modules have no platform-specific side effects, making them directly importable in Jest unit tests without needing SQLite initialization.
- Separation of data, validation, and database operations follows Feature-Based Architecture and clean code principles.
- Ensures identical mock data is accessible for testing, database seeding, and potential UI demo resets.

### Alternatives Considered
- *Inlining all data directly inside `scripts/seed-db.ts`*: Rejected because it tightly couples the data definition to DB queries, making it difficult to write lightweight unit tests verifying mathematical integrity and schema compliance without hitting database mocks.
- *JSON files in `assets/`*: Rejected because TypeScript object literals provide compile-time type safety against Drizzle's `$inferInsert` types (`NewTeam`, `NewPlayer`, `NewGame`, `NewPlayerStat`), preventing silent type mismatches.

---

## 2. Mathematical Consistency & Box Score Reconciliation

### Context
Requirements FR-008, FR-009, FR-010, and SC-002 dictate that finished matches must have:
1. Period-by-period breakdowns (`resultC1`..`resultC4`, `resultExtra` for team and opponent).
2. Detailed player box scores (`t1a`/`t1i`, `t2a`/`t2i`, `t3a`/`t3i`, rebounds, assists, steals, turnovers, fouls, valuation).
3. The sum of player points ($1 \times \text{t1a} + 2 \times \text{t2a} + 3 \times \text{t3a}$) MUST exactly match the team's total final score ($\sum \text{resultC} + \text{resultExtra}$).

### Decision
Pre-compute and verify the dataset using a deterministic builder/validator with the following rules:
- **Total Points Equation**:
  $$\text{Final Score} = \text{resultC1} + \text{resultC2} + \text{resultC3} + \text{resultC4} + \text{resultExtra} = \sum_{p \in \text{Roster}} (\text{t1a}_p \times 1 + \text{t2a}_p \times 2 + \text{t3a}_p \times 3)$$
- **Valuation Formula**:
  $$\text{Valuation} = (\text{t1a} + \text{t2a} + \text{t3a}) + \text{oreb} + \text{dreb} + \text{asis} + \text{rec} - \text{per} - \text{falt} - (\text{t1i} - \text{t1a}) - (\text{t2i} - \text{t2a}) - (\text{t3i} - \text{t3a})$$
  This strictly matches `calculatePlayerValuation` in `src/store/GameStore.ts`.
- **Fouls Consistency**:
  $$\text{Total Team Fouls} = \text{foulsC1} + \text{foulsC2} + \text{foulsC3} + \text{foulsC4} + \text{foulsExtra} = \sum_{p \in \text{Roster}} \text{falt}_p$$
  Player personal fouls $\le 5$ (standard FIBA foul-out limit).

### Rationale
Aligning team fouls with player personal fouls and player points with quarter points guarantees 100% data coherence across the UI (match detail screen, box score tab, period breakdown cards).

---

## 3. Date & Schedule Formatting

### Context
The application's date validation (`src/utils/dateValidation.ts`) and match sorting (`src/store/GameStore.ts`) require a strict format: `"dd/mm/aaaa - hh:mm"`.

### Decision
- **Finished Matches (5 games)**: Chronological past dates in season schedule (e.g., September/October 2026), e.g., `"15/09/2026 - 18:30"`, `"22/09/2026 - 20:00"`, `"29/09/2026 - 19:15"`, `"06/10/2026 - 18:00"`, `"13/10/2026 - 19:30"`.
- **Upcoming Matches (5 games)**: Chronological future dates (e.g., November/December 2026), e.g., `"27/10/2026 - 19:00"`, `"03/11/2026 - 18:30"`, `"10/11/2026 - 20:00"`, `"17/11/2026 - 19:30"`, `"24/11/2026 - 18:00"`.
- All upcoming games will have `status = 'pending'`, scores = 0, fouls = 0, and no player stat records.

### Rationale
Passes regex validation (`TIMESTAMP_REGEX = /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})$/`) and sorts deterministically in `sortGamesByRecency`.

---

## 4. Roster Composition & DNP (Did Not Play) Dynamics

### Context
Standard basketball rosters comprise 12 players across 5 traditional positions:
- Point Guard (Base / PG): 2 players
- Shooting Guard (Escolta / SG): 3 players
- Small Forward (Alero / SF): 3 players
- Power Forward (Ala-Pívot / PF): 2 players
- Center (Pívot / C): 2 players

### Decision
- Assign distinct jersey numbers (`"4"`, `"7"`, `"10"`, `"12"`, `"15"`, `"21"`, `"23"`, `"30"`, `"33"`, `"44"`, `"55"`, `"77"`).
- In each of the 5 completed games:
  - 9 or 10 players receive active minutes ($> 0$).
  - 2 or 3 players have `minutes = 0` (DNP), with all scoring and defensive metrics strictly equal to 0.
  - Total minutes across all players in a regulation 40-minute match (5 court spots $\times$ 40 minutes) equals 200 minutes (or 225 minutes if a 5-minute overtime occurs).

### Rationale
Simulates professional basketball box scores with realistic playing-time distribution and tests DNP rendering logic in the UI.

---

## 5. Overtime Scenario (Edge Case)

### Context
The specification notes that no finished basketball match can end in a tie. If scores are tied after 4 quarters, an overtime period (`extra`) decides the game.

### Decision
- Games 1 to 4: Decided in regulation 4 quarters (`resultExtra = 0`, `resultExtraOpponent = 0`, `foulsExtra = 0`, `foulsExtraOpponent = 0`).
- Game 5: Dramatic overtime thriller where regulation ends tied at 72–72 (e.g. C1: 18-16, C2: 17-20, C3: 19-18, C4: 18-18), and team wins in extra time 12–8 (final score: 84–80).

### Rationale
Validates that extra-period UI rendering, points summing, and foul totals function seamlessly for both regular and overtime fixtures.
