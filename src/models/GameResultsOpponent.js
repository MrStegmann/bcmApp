export const GameResultsOpponent = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS game_results_opponent (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          game_id INTEGER NOT NULL,
          result_c1_opponent INTEGER DEFAULT 0,
          falts_c1_opponent INTEGER DEFAULT 0,
          result_c2_opponent INTEGER DEFAULT 0,
          falts_c2_opponent INTEGER DEFAULT 0,
          result_c3_opponent INTEGER DEFAULT 0,
          falts_c3_opponent INTEGER DEFAULT 0,
          result_c4_opponent INTEGER DEFAULT 0,
          falts_c4_opponent INTEGER DEFAULT 0,
          result_extra_opponent INTEGER DEFAULT 0,
          falts_extra_opponent INTEGER DEFAULT 0,
          FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
        )`);
      await dbInstance.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_game_results_opponent_game_id ON game_results_opponent(game_id);`
      );
      await dbInstance.execAsync(`CREATE TRIGGER IF NOT EXISTS create_game_results_opponent
        AFTER INSERT ON games
        FOR EACH ROW
        BEGIN
          INSERT INTO game_results_opponent (game_id) VALUES (NEW.id);
        END;`);
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido crear la tabla de resultados de los oponentes"
      );
    }
  },
  getAll: async (gameId) => {
    try {
      return await dbInstance.getAllAsync(
        `SELECT * FROM game_results_opponent WHERE game_id = ?;`,
        [gameId]
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido crear los Partidos");
    }
  },
  save: async (data) => {
    const sqlStatment = data.id
      ? `UPDATE game_results_opponent SET game_id = ?, result_c1_opponent = ?, result_c2_opponent = ?, result_c3_opponent = ?, result_c4_opponent = ?, result_extra_opponent = ?,falts_c1_opponent = ?, falts_c2_opponent = ?, falts_c3_opponent = ?, falts_c4_opponent = ?, falts_extra_opponent = ? WHERE id = ?;`
      : `INSERT INTO game_results_opponent (game_id, result_c1_opponent, result_c2_opponent, result_c3_opponent, result_c4_opponent, result_extra_opponent, falts_c1_opponent, falts_c2_opponent, falts_c3_opponent, falts_c4_opponent, falts_extra_opponent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const { id, ...rest } = data;
    const params = data?.id
      ? [...Object.values(rest), data.id]
      : Object.values(rest);

    try {
      await dbInstance.runAsync(sqlStatment, params);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar guardar el partido contra ${data.opponent}`
      );
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync(
        `DELETE FROM game_results_opponent WHERE id = ?;`,
        [id]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar eliminar los resultados del partido`
      );
    }
  },
});
