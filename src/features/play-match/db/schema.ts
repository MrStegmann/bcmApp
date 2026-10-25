import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { games } from "../../../db/schema";

export const matchCache = sqliteTable("match_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  matchId: integer("match_id")
    .notNull()
    .unique()
    .references(() => games.id, { onDelete: "cascade" }),
  stateJson: text("state_json").notNull(),
  version: integer("version").notNull().default(1),
  lastUpdated: text("last_updated")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type MatchCacheRecord = typeof matchCache.$inferSelect;
export type NewMatchCacheRecord = typeof matchCache.$inferInsert;
