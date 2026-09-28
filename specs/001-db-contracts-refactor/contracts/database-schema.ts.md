# TypeScript Database Schema Contract

This document defines the exact Drizzle ORM schema specification and infer types for all database models.

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, InferSelectModel, InferInsertModel } from "drizzle-orm";

// 1. TEAMS SCHEMA
export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type Team = InferSelectModel<typeof teams>;
export type NewTeam = InferInsertModel<typeof teams>;

// 2. PLAYERS SCHEMA
export const players = sqliteTable("players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  number: text("number").notNull(),
  position: text("position"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type Player = InferSelectModel<typeof players>;
export type NewPlayer = InferInsertModel<typeof players>;

// 3. GAMES SCHEMA
export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  opponent: text("opponent").notNull(),
  round: integer("round").notNull().default(1),
  date: text("date").notNull(),
  resultC1: integer("result_c1").default(0),
  resultC2: integer("result_c2").default(0),
  resultC3: integer("result_c3").default(0),
  resultC4: integer("result_c4").default(0),
  resultExtra: integer("result_extra").default(0),
  resultC1Opponent: integer("result_c1_opponent").default(0),
  resultC2Opponent: integer("result_c2_opponent").default(0),
  resultC3Opponent: integer("result_c3_opponent").default(0),
  resultC4Opponent: integer("result_c4_opponent").default(0),
  resultExtraOpponent: integer("result_extra_opponent").default(0),
});

export type Game = InferSelectModel<typeof games>;
export type NewGame = InferInsertModel<typeof games>;

// 4. PLAYER STATS SCHEMA
export const playerStats = sqliteTable("player_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameId: integer("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  minutes: integer("minutes").default(0),
  t1a: integer("t1a").default(0),
  t1i: integer("t1i").default(0),
  t2a: integer("t2a").default(0),
  t2i: integer("t2i").default(0),
  t3a: integer("t3a").default(0),
  t3i: integer("t3i").default(0),
  oreb: integer("oreb").default(0),
  dreb: integer("dreb").default(0),
  asis: integer("asis").default(0),
  rec: integer("rec").default(0),
  per: integer("per").default(0),
  falt: integer("falt").default(0),
  valuation: integer("valuation").default(0),
});

export type PlayerStat = InferSelectModel<typeof playerStats>;
export type NewPlayerStat = InferInsertModel<typeof playerStats>;

// 5. TRAININGS SCHEMA
export const trainings = sqliteTable("trainings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  trainingNumber: integer("training_number").notNull(),
  date: text("date").notNull(),
  warmup1: text("warmup1"),
  warmup1Explanation: text("warmup1_explanation"),
  warmup2: text("warmup2"),
  warmup2Explanation: text("warmup2_explanation"),
  warmup3: text("warmup3"),
  warmup3Explanation: text("warmup3_explanation"),
  exercise1: text("exercise1"),
  exercise1Explanation: text("exercise1_explanation"),
  exercise2: text("exercise2"),
  exercise2Explanation: text("exercise2_explanation"),
  exercise3: text("exercise3"),
  exercise3Explanation: text("exercise3_explanation"),
  exercise4: text("exercise4"),
  exercise4Explanation: text("exercise4_explanation"),
  exercise5: text("exercise5"),
  exercise5Explanation: text("exercise5_explanation"),
  exercise6: text("exercise6"),
  exercise6Explanation: text("exercise6_explanation"),
  cooldown1: text("cooldown1"),
  cooldown1Explanation: text("cooldown1_explanation"),
  cooldown2: text("cooldown2"),
  cooldown2Explanation: text("cooldown2_explanation"),
});

export type Training = InferSelectModel<typeof trainings>;
export type NewTraining = InferInsertModel<typeof trainings>;

// 6. TRAINING PLAYERS ATTENDANCE SCHEMA
export const trainingPlayers = sqliteTable("training_players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trainingId: integer("training_id").notNull().references(() => trainings.id, { onDelete: "cascade" }),
  playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  attended: integer("attended").notNull().default(1),
  notes: text("notes"),
});

export type TrainingPlayer = InferSelectModel<typeof trainingPlayers>;
export type NewTrainingPlayer = InferInsertModel<typeof trainingPlayers>;

// 7. FEES SCHEMA
export const fees = sqliteTable("fees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  playerId: integer("player_id").references(() => players.id, { onDelete: "cascade" }),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  amount: real("amount").notNull().default(0.0),
  paid: integer("paid").notNull().default(0),
  dueDate: text("due_date"),
});

export type Fee = InferSelectModel<typeof fees>;
export type NewFee = InferInsertModel<typeof fees>;
```
