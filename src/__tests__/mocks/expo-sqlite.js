const { DatabaseSync } = require("node:sqlite");

let globalMemDb = null;

function getMemDb() {
  if (!globalMemDb) {
    globalMemDb = new DatabaseSync(":memory:");
    globalMemDb.exec("PRAGMA foreign_keys = ON;");
    // Ensure core tables exist in mock in-memory DB
    globalMemDb.exec(`
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
  }
  return globalMemDb;
}

const createMockStatement = (memDb, sql) => {
  return {
    executeSync: (params = []) => {
      const stmt = memDb.prepare(sql);
      const isQuery = /^\s*(SELECT|PRAGMA)/i.test(sql) || /RETURNING/i.test(sql);
      if (isQuery) {
        const rows = stmt.all(...params);
        return {
          changes: 1,
          lastInsertRowId: 1,
          getFirstSync: () => rows[0] || null,
          getAllSync: () => rows,
        };
      } else {
        const result = stmt.run(...params);
        return {
          changes: Number(result.changes),
          lastInsertRowId: Number(result.lastInsertRowid),
          getFirstSync: () => null,
          getAllSync: () => [],
        };
      }
    },
    executeForRawResultSync: (params = []) => {
      const stmt = memDb.prepare(sql);
      const rows = stmt.all(...params);
      const rawRows = rows.map((r) => Object.values(r));
      return {
        getAllSync: () => rawRows,
      };
    },
    finalizeSync: () => {},
  };
};

module.exports = {
  openDatabaseSync: () => {
    const memDb = getMemDb();
    return {
      execSync: (sql) => memDb.exec(sql),
      runSync: (sql, params = []) => {
        const res = memDb.prepare(sql).run(...params);
        return { changes: Number(res.changes), lastInsertRowId: Number(res.lastInsertRowid) };
      },
      getFirstSync: (sql, params = []) => {
        return memDb.prepare(sql).get(...params) || null;
      },
      getAllSync: (sql, params = []) => {
        return memDb.prepare(sql).all(...params);
      },
      prepareSync: (sql) => createMockStatement(memDb, sql),
    };
  },
};
