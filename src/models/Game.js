export const GameModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync("DROP TABLE IF EXISTS games;");
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        opponent TEXT NOT NULL,
        round INTEGER,
        date TEXT,
        result_c1_opponent INTEGER DEFAULT 0,
        result_c2_opponent INTEGER DEFAULT 0,
        result_c3_opponent INTEGER DEFAULT 0,
        result_c4_opponent INTEGER DEFAULT 0,
        result_extra_opponent INTEGER DEFAULT 0,
        result_c1 INTEGER DEFAULT 0,
        result_c2 INTEGER DEFAULT 0,
        result_c3 INTEGER DEFAULT 0,
        result_c4 INTEGER DEFAULT 0,
        result_extra INTEGER DEFAULT 0,
        FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
      );`);
    } catch (error) {
      console.log("Error al crear Games: ", error);
    }
  },
  getAll: async (teamId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(`SELECT * FROM games WHERE team_id = ?;`, [
          teamId,
        ])
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },

  create: async (data, callback) => {
    try {
      const result = await dbInstance.runAsync(
        `INSERT INTO games (
        team_id, opponent, round, date,
        result_c1_opponent, result_c2_opponent, result_c3_opponent, result_c4_opponent, result_extra_opponent,
        result_c1, result_c2, result_c3, result_c4, result_extra
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?) RETURNING *;`,
        [
          data.team_id,
          data.opponent,
          data.round,
          data.date,
          data.result_c1_opponent,
          data.result_c2_opponent,
          data.result_c3_opponent,
          data.result_c4_opponent,
          data.result_extra_opponent,
          data.result_c1,
          data.result_c2,
          data.result_c3,
          data.result_c4,
          data.result_extra,
        ]
      );
      if (callback) callback(result);
    } catch (error) {
      console.error("Error al crear el partido:", error);
    }
  },
  update: async (data, callback) => {
    try {
      const result = await dbInstance.runAsync(
        `UPDATE games SET
            team_id = ?, opponent = ?, round = ?, date = ?,
            result_c1_opponent = ?, result_c2_opponent = ?, result_c3_opponent = ?, result_c4_opponent = ?, result_extra_opponent = ?,
            result_c1 = ?, result_c2 = ?, result_c3 = ?, result_c4 = ?, result_extra = ?
            WHERE id = ?;`,
        [
          data.team_id,
          data.opponent,
          data.round,
          data.date,
          data.result_c1_opponent,
          data.result_c2_opponent,
          data.result_c3_opponent,
          data.result_c4_opponent,
          data.result_extra_opponent,
          data.result_c1,
          data.result_c2,
          data.result_c3,
          data.result_c4,
          data.result_extra,
          data.id,
        ]
      );
      callback(result);
    } catch (error) {
      console.error(`Error al actualizar el partido ${data.round}:`, error);
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync(`DELETE FROM games WHERE id = ?;`, [id]);
    } catch (error) {
      console.error(`Error al eliminar el partido con ID ${id}:`, error);
    }
  },
});
