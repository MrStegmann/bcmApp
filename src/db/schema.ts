import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// 1. TEAMS SCHEMA
export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
  games: many(games),
  trainings: many(trainings),
  fees: many(fees),
}));

// 2. PLAYERS SCHEMA
export const players = sqliteTable("players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  number: text("number").notNull(),
  position: text("position"),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
  playerStats: many(playerStats),
  trainingPlayers: many(trainingPlayers),
  fees: many(fees),
}));

// 3. GAMES SCHEMA
export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
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

export const gamesRelations = relations(games, ({ one, many }) => ({
  team: one(teams, {
    fields: [games.teamId],
    references: [teams.id],
  }),
  playerStats: many(playerStats),
}));

// 4. PLAYER STATS SCHEMA
export const playerStats = sqliteTable("player_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameId: integer("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
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

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  game: one(games, {
    fields: [playerStats.gameId],
    references: [games.id],
  }),
  player: one(players, {
    fields: [playerStats.playerId],
    references: [players.id],
  }),
}));

// 5. TRAININGS SCHEMA
export const trainings = sqliteTable("trainings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
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

export const trainingsRelations = relations(trainings, ({ one, many }) => ({
  team: one(teams, {
    fields: [trainings.teamId],
    references: [teams.id],
  }),
  trainingPlayers: many(trainingPlayers),
}));

// 6. TRAINING PLAYERS ATTENDANCE SCHEMA
export const trainingPlayers = sqliteTable("training_players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trainingId: integer("training_id")
    .notNull()
    .references(() => trainings.id, { onDelete: "cascade" }),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  attended: integer("attended").notNull().default(1),
  notes: text("notes"),
});

export const trainingPlayersRelations = relations(trainingPlayers, ({ one }) => ({
  training: one(trainings, {
    fields: [trainingPlayers.trainingId],
    references: [trainings.id],
  }),
  player: one(players, {
    fields: [trainingPlayers.playerId],
    references: [players.id],
  }),
}));

// 7. FEES SCHEMA
export const fees = sqliteTable("fees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  playerId: integer("player_id").references(() => players.id, { onDelete: "cascade" }),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  amount: real("amount").notNull().default(0.0),
  paid: integer("paid").notNull().default(0),
  dueDate: text("due_date"),
});

export const feesRelations = relations(fees, ({ one }) => ({
  team: one(teams, {
    fields: [fees.teamId],
    references: [teams.id],
  }),
  player: one(players, {
    fields: [fees.playerId],
    references: [players.id],
  }),
}));
