export const GameResults = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS game_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          game_id INTEGER NOT NULL,
          result_c1 INTEGER DEFAULT 0,
          falts_c1 INTEGER DEFAULT 0,
          result_c2 INTEGER DEFAULT 0,
          falts_c2 INTEGER DEFAULT 0,
          result_c3 INTEGER DEFAULT 0,
          falts_c3 INTEGER DEFAULT 0,
          result_c4 INTEGER DEFAULT 0,
          falts_c4 INTEGER DEFAULT 0,
          result_extra INTEGER DEFAULT 0,
          falts_extra INTEGER DEFAULT 0,
          FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
        )`);
      await dbInstance.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_game_results_game_id ON game_results(game_id);`
      );
      await dbInstance.execAsync(`CREATE TRIGGER IF NOT EXISTS create_game_results
        AFTER INSERT ON games
        FOR EACH ROW
        BEGIN
          INSERT INTO game_results (game_id) VALUES (NEW.id);
        END;`);
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido crear la tabla de resultados");
    }
  },
  save: async (data) => {
    const sqlStatment = data.id
      ? `UPDATE game_results SET game_id = ?, result_c1 = ?, result_c2 = ?, result_c3 = ?, result_c4 = ?, result_extra = ?, falts_c1 = ?, falts_c2 = ?, falts_c3 = ?, falts_c4 = ?, falts_extra = ? WHERE id = ?;`
      : `INSERT INTO game_results (game_id, result_c1, result_c2, result_c3, result_c4, result_extra, falts_c1, falts_c2, falts_c3, falts_c4, falts_extra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const {
      id,
      game_id,
      result_c1,
      result_c2,
      result_c3,
      result_c4,
      result_extra,
      falts_c1,
      falts_c2,
      falts_c3,
      falts_c4,
      falts_extra,
    } = data;
    const params = data?.id
      ? [
          game_id,
          result_c1,
          result_c2,
          result_c3,
          result_c4,
          result_extra,
          falts_c1,
          falts_c2,
          falts_c3,
          falts_c4,
          falts_extra,
          id,
        ]
      : [
          game_id,
          result_c1,
          result_c2,
          result_c3,
          result_c4,
          result_extra,
          falts_c1,
          falts_c2,
          falts_c3,
          falts_c4,
          falts_extra,
        ];

    try {
      await dbInstance.runAsync(sqlStatment, params);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar guardar el partido contra ${data.opponent}`
      );
    }
  },
});
