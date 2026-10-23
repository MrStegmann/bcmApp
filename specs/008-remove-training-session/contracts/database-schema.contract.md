# Contract: Database Schema & Persistence

**Feature Branch**: `008-remove-training-session`  
**Date**: 2026-10-22  
**Contract ID**: `CONTRACT-DB-001`  

---

## 1. Drizzle ORM Exports (`src/db/schema.ts`)

### Required Exports
The module MUST export:
- Tables: `teams`, `players`, `games`, `playerStats`
- Relations: `teamsRelations`, `playersRelations`, `gamesRelations`, `playerStatsRelations`

### Prohibited Exports
The module MUST NOT export:
- `trainings`
- `trainingPlayers`
- `trainingsRelations`
- `trainingPlayersRelations`

---

## 2. Database Initialization (`src/db/index.ts`)

### Runtime Guarantee
Calling `initDatabase()` MUST:
1. Execute `PRAGMA foreign_keys = ON;` and `PRAGMA journal_mode = WAL;`.
2. Execute `DROP TABLE IF EXISTS training_players;`.
3. Execute `DROP TABLE IF EXISTS trainings;`.
4. Ensure tables `teams`, `players`, `games`, and `player_stats` exist with valid schemas.
5. NOT execute any `CREATE TABLE` statements for `trainings` or `training_players`.

---

## 3. TypeScript Database Types (`src/types/database.ts`)

### Required Types
- `Team`, `NewTeam`
- `Player`, `NewPlayer`
- `Game`, `NewGame`
- `PlayerStat`, `NewPlayerStat`

### Prohibited Types
The module MUST NOT export:
- `Training`, `NewTraining`
- `TrainingPlayer`, `NewTrainingPlayer`
