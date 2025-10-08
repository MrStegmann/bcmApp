export const GameModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync("DROP TABLE IF EXISTS games");
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        opponent TEXT NOT NULL,
        round INTEGER,
        date TEXT,
        played INTEGER DEFAULT 0,
        FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
      );`);
      await dbInstance.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_games_team_id ON games(team_id);`
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido crear la tabla de los Partidos");
    }
  },
  save: async (data) => {
    const sqlStatment = data?.id
      ? `UPDATE games SET team_id = ?, opponent = ?, round = ?, date = ?, played = ? WHERE id = ?;`
      : `INSERT INTO games (team_id, opponent, round, date) VALUES (?, ?, ?, ?);`;
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
      await dbInstance.runAsync(`DELETE FROM games WHERE id = ?;`, [id]);
    } catch (error) {
      console.error(error);
      throw new Error(`Ha ocurrido un error al intentar eliminar el partido`);
    }
  },
});
