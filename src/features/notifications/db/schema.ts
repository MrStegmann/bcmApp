import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  externalId: text("external_id"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  dataJson: text("data_json"),
  receivedAt: text("received_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  isRead: integer("is_read").notNull().default(0),
  suppressedReason: text("suppressed_reason").notNull().default("none"),
});

export const notificationSettings = sqliteTable("notification_settings", {
  id: integer("id").primaryKey().default(1),
  muteInApp: integer("mute_in_app").notNull().default(1),
  muteInMatch: integer("mute_in_match").notNull().default(1),
  soundEnabled: integer("sound_enabled").notNull().default(0),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
