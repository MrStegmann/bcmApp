export const GameRosterModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync("DROP TABLE IF EXISTS game_roster;");
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS game_roster (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            player_id INTEGER NOT NULL,
            called INTEGER DEFAULT 0,
            FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE,
            UNIQUE(game_id, player_id) -- Opcional: asegura que un jugador no se agregue dos veces al mismo partido
        );`);

      await dbInstance.execAsync("DROP TRIGGER IF EXISTS create_game_roster;");
      await dbInstance.execAsync(`CREATE TRIGGER IF NOT EXISTS create_game_roster
        AFTER INSERT ON games
        FOR EACH ROW
        BEGIN
          INSERT INTO game_roster (game_id, player_id)
            SELECT
                NEW.id,
                p.id
            FROM players p
            WHERE p.team_id = NEW.team_id;
        END;`);
    } catch (error) {
      console.log("Error al crear Game Rooster: ", error);
    }
  },
  getAll: async (gameId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `SELECT * FROM game_roster WHERE game_id = ?;`,
          [gameId]
        )
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },
  getAllByCalled: async (gameId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `SELECT * FROM game_roster WHERE game_id = ? AND called = 1;`,
          [gameId]
        )
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },
  create: async (data) => {
    try {
      let query = "";
      for (let i = 0; i < data.length; i++) {
        if (i === 0) query += "(?, ?, ?)";
        else query += ",(?, ?, ?)";
      }

      const params = [];
      for (const player of data) {
        params.push(player.game_id);
        params.push(player.player_id);
      }
      await dbInstance.runAsync(
        `INSERT INTO game_roster (game_id, player_id, called) VALUES ${query};`,
        params
      );
    } catch (error) {
      console.error("Error al crear el jugador:", error);
    }
  },
  update: async (data) => {
    try {
      await dbInstance.runAsync(
        `UPDATE game_roster SET called = ? WHERE game_id = ? AND player_id = ?;`,
        [data.called, data.game_id, data.player_id]
      );
    } catch (error) {
      console.error(`Error al actualizar el jugador ${data.name}:`, error);
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync(`DELETE FROM game_roster WHERE id = ?;`, [id]);
    } catch (error) {
      console.error(`Error al eliminar el jugador con ID ${id}:`, error);
    }
  },
});
