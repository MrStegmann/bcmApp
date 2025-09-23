export default class Player {
  constructor(player) {
    this.id = player.id;
    this.teamId = player.teamId;
    this.firstName = player.firstName;
    this.lastName = player.lastName;
    this.number = player.number;
  }

  toCreate() {
    return [this.teamId, this.firstName, this.lastName, this.number];
  }

  toUpdate() {
    return [this.teamId, this.firstName, this.lastName, this.number, this.id];
  }

  toDelete() {
    return this.id;
  }
}

export const PlayerModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync("DROP TABLE IF EXISTS players;");
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            number TEXT NOT NULL,
            FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
        );`);
    } catch (error) {
      console.log("Error al crear Players: ", error);
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
        [data.team_id, data.first_name, data.last_name, data.number]
      );
    } catch (error) {
      console.error("Error al crear el jugador:", error);
    }
  },
  update: async (data) => {
    try {
      await dbInstance.runAsync(
        "UPDATE players SET team_id = ?, first_name = ?, last_name = ?, number= ?  WHERE id = ?;",
        [data.team_id, data.first_name, data.last_name, data.number, data.id]
      );
    } catch (error) {
      console.error(`Error al actualizar el jugador ${data.name}:`, error);
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync("DELETE FROM players WHERE id = ?;", [id]);
    } catch (error) {
      console.error(`Error al eliminar el jugador con ID ${id}:`, error);
    }
  },
});
