import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const sqliteDb = openDatabaseSync("bcmapp.db");
export const db = drizzle(sqliteDb, { schema });

export function initDatabase(): void {
  sqliteDb.execSync("PRAGMA foreign_keys = ON;");
  sqliteDb.execSync("PRAGMA journal_mode = WAL;");

  sqliteDb.execSync(`
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
      position TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      opponent TEXT NOT NULL,
      round INTEGER NOT NULL DEFAULT 1,
      date TEXT NOT NULL,
      result_c1 INTEGER DEFAULT 0,
      result_c2 INTEGER DEFAULT 0,
      result_c3 INTEGER DEFAULT 0,
      result_c4 INTEGER DEFAULT 0,
      result_extra INTEGER DEFAULT 0,
      result_c1_opponent INTEGER DEFAULT 0,
      result_c2_opponent INTEGER DEFAULT 0,
      result_c3_opponent INTEGER DEFAULT 0,
      result_c4_opponent INTEGER DEFAULT 0,
      result_extra_opponent INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS player_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
      player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      minutes INTEGER DEFAULT 0,
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

    CREATE TABLE IF NOT EXISTS trainings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      training_number INTEGER NOT NULL,
      date TEXT NOT NULL,
      warmup1 TEXT, warmup1_explanation TEXT,
      warmup2 TEXT, warmup2_explanation TEXT,
      warmup3 TEXT, warmup3_explanation TEXT,
      exercise1 TEXT, exercise1_explanation TEXT,
      exercise2 TEXT, exercise2_explanation TEXT,
      exercise3 TEXT, exercise3_explanation TEXT,
      exercise4 TEXT, exercise4_explanation TEXT,
      exercise5 TEXT, exercise5_explanation TEXT,
      exercise6 TEXT, exercise6_explanation TEXT,
      cooldown1 TEXT, cooldown1_explanation TEXT,
      cooldown2 TEXT, cooldown2_explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS training_players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_id INTEGER NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
      player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      attended INTEGER NOT NULL DEFAULT 1,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
      month TEXT NOT NULL,
      year INTEGER NOT NULL,
      amount REAL NOT NULL DEFAULT 0.0,
      paid INTEGER NOT NULL DEFAULT 0,
      due_date TEXT
    );
  `);
}

export * from "./schema";
