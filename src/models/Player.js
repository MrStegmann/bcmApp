export const PlayerModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            number TEXT NOT NULL,
            FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
        );`);
      await dbInstance.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);`
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido crear la tabla de Jugadores");
    }
  },
  get: async (data) => {
    const sqlStatment =
      data?.teamId && data?.playerId
        ? `SELECT * FROM players WHERE team_id = ? AND id = ?;`
        : `SELECT * FROM players WHERE team_id = ?;`;
    const params =
      data?.teamId && data?.playerId ? Object.entries(data) : [data.teamId];
    try {
      return await dbInstance.getAllAsync(sqlStatment, params);
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido obtener a los Jugadores");
    }
  },
  save: async (data) => {
    const sqlStatment = data?.id
      ? `UPDATE players SET team_id = ?, first_name = ?, last_name = ?, number= ?  WHERE id = ?;`
      : `INSERT INTO players (team_id, first_name, last_name, number) VALUES (?, ?, ?, ?);`;
    const { id, ...rest } = data;
    const params = data?.id
      ? [...Object.values(rest), data.id]
      : Object.values(rest);
    try {
      await dbInstance.runAsync(sqlStatment, params);
    } catch (error) {
      console.error(error);
      throw new Error(`Ha ocurrido un error al intentar guardar ${data.name}`);
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync("DELETE FROM players WHERE id = ?;", [id]);
    } catch (error) {
      console.error(error);
      throw new Error(`Ha ocurrido un error al intentar guardar al Jugador`);
    }
  },
});
