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
}));

// 3. GAMES SCHEMA
export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  opponent: text("opponent").notNull(),
  round: text("round").notNull().default("1"),
  date: text("date").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
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
  foulsC1: integer("fouls_c1").default(0),
  foulsC2: integer("fouls_c2").default(0),
  foulsC3: integer("fouls_c3").default(0),
  foulsC4: integer("fouls_c4").default(0),
  foulsExtra: integer("fouls_extra").default(0),
  foulsC1Opponent: integer("fouls_c1_opponent").default(0),
  foulsC2Opponent: integer("fouls_c2_opponent").default(0),
  foulsC3Opponent: integer("fouls_c3_opponent").default(0),
  foulsC4Opponent: integer("fouls_c4_opponent").default(0),
  foulsExtraOpponent: integer("fouls_extra_opponent").default(0),
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

