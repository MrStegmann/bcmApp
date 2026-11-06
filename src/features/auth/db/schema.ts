import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const authSessions = sqliteTable("auth_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token").notNull(),
  tokenType: text("token_type").notNull().default("Bearer"),
  expiresIn: integer("expires_in").notNull(),
  expiresAt: text("expires_at").notNull(),
  userId: integer("user_id").notNull(),
  username: text("username").notNull(),
  userStatus: text("user_status").notNull(),
  userCreatedAt: text("user_created_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type AuthSessionRecord = typeof authSessions.$inferSelect;
export type NewAuthSessionRecord = typeof authSessions.$inferInsert;

