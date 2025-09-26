export const PlayerModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync("DROP TABLE IF EXISTS players");
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
  getAll: async (teamId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `SELECT * FROM players WHERE team_id = ?;`,
          [teamId]
        )
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },

  create: async (data) => {
    try {
      await dbInstance.runAsync(
        "INSERT INTO players (team_id, first_name, last_name, number) VALUES (?, ?, ?, ?);",
        [data.teamId, data.firstName, data.lastName, data.number]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar guardar al Jugador ${data.firstName} ${data.lastName}`
      );
    }
  },
  update: async (data) => {
    try {
      await dbInstance.runAsync(
        "UPDATE players SET team_id = ?, first_name = ?, last_name = ?, number= ?  WHERE id = ?;",
        [data.teamId, data.firstName, data.lastName, data.number, data.id]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar actualizar al Jugador ${data.firstName} ${data.lastName}`
      );
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
