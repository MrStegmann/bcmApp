import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const sqliteDb = openDatabaseSync("bcmapp.db");
export const db = drizzle(sqliteDb, { schema });

export function initDatabase(): void {
  sqliteDb.execSync("PRAGMA foreign_keys = ON;");
  sqliteDb.execSync("PRAGMA journal_mode = WAL;");

  sqliteDb.execSync(`
    DROP TABLE IF EXISTS training_players;
    DROP TABLE IF EXISTS trainings;

    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      number TEXT NOT NULL,
      jersey_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      opponent TEXT NOT NULL,
      round TEXT NOT NULL DEFAULT '1',
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      result_c1 INTEGER DEFAULT 0,
      result_c2 INTEGER DEFAULT 0,
      result_c3 INTEGER DEFAULT 0,
      result_c4 INTEGER DEFAULT 0,
      result_extra INTEGER DEFAULT 0,
      result_c1_opponent INTEGER DEFAULT 0,
      result_c2_opponent INTEGER DEFAULT 0,
      result_c3_opponent INTEGER DEFAULT 0,
      result_c4_opponent INTEGER DEFAULT 0,
      result_extra_opponent INTEGER DEFAULT 0,
      fouls_c1 INTEGER DEFAULT 0,
      fouls_c2 INTEGER DEFAULT 0,
      fouls_c3 INTEGER DEFAULT 0,
      fouls_c4 INTEGER DEFAULT 0,
      fouls_extra INTEGER DEFAULT 0,
      fouls_c1_opponent INTEGER DEFAULT 0,
      fouls_c2_opponent INTEGER DEFAULT 0,
      fouls_c3_opponent INTEGER DEFAULT 0,
      fouls_c4_opponent INTEGER DEFAULT 0,
      fouls_extra_opponent INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS player_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
      player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      minutes INTEGER DEFAULT 0,
      seconds INTEGER DEFAULT 0,
      t1a INTEGER DEFAULT 0,
      t1i INTEGER DEFAULT 0,
      t2a INTEGER DEFAULT 0,
      t2i INTEGER DEFAULT 0,
      t3a INTEGER DEFAULT 0,
      t3i INTEGER DEFAULT 0,
      oreb INTEGER DEFAULT 0,
      dreb INTEGER DEFAULT 0,
      asis INTEGER DEFAULT 0,
      rec INTEGER DEFAULT 0,
      per INTEGER DEFAULT 0,
      falt INTEGER DEFAULT 0,
      valuation INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      data_json TEXT,
      received_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_read INTEGER NOT NULL DEFAULT 0,
      suppressed_reason TEXT NOT NULL DEFAULT 'none'
    );

    CREATE TABLE IF NOT EXISTS notification_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      mute_in_app INTEGER NOT NULL DEFAULT 1,
      mute_in_match INTEGER NOT NULL DEFAULT 1,
      sound_enabled INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS match_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL UNIQUE REFERENCES games(id) ON DELETE CASCADE,
      state_json TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      last_updated TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Migrate existing tables if columns are missing
  try {
    sqliteDb.execSync("ALTER TABLE players ADD COLUMN jersey_name TEXT;");
  } catch {}

  try {
    sqliteDb.execSync("ALTER TABLE games ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';");
  } catch {}

  try {
    sqliteDb.execSync("ALTER TABLE games ADD COLUMN created_at TEXT NOT NULL DEFAULT (datetime('now'));");
  } catch {}

  const foulColumns = [
    "fouls_c1",
    "fouls_c2",
    "fouls_c3",
    "fouls_c4",
    "fouls_extra",
    "fouls_c1_opponent",
    "fouls_c2_opponent",
    "fouls_c3_opponent",
    "fouls_c4_opponent",
    "fouls_extra_opponent",
  ];
  for (const col of foulColumns) {
    try {
      sqliteDb.execSync(`ALTER TABLE games ADD COLUMN ${col} INTEGER DEFAULT 0;`);
    } catch {}
  }

  try {
    sqliteDb.execSync("ALTER TABLE player_stats ADD COLUMN seconds INTEGER DEFAULT 0;");
  } catch {}
}

export * from "./schema";
