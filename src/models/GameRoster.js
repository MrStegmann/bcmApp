export const GameRosterModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS game_roster (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            player_id INTEGER NOT NULL,
            called INTEGER DEFAULT 0,
            FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE,
            UNIQUE(game_id, player_id) -- Opcional: asegura que un jugador no se agregue dos veces al mismo partido
        );`);

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
      console.error(error);
      throw new Error("No se ha podido crear la tabla de Convocatorias");
    }
  },
  getAll: async (gameId) => {
    try {
      return await dbInstance.getAllAsync(
        `SELECT * FROM game_roster WHERE game_id = ?;`,
        [gameId]
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido obtener las Convocatorias");
    }
  },
  getAllByCalled: async (gameId) => {
    try {
      return await dbInstance.getAllAsync(
        `SELECT 
          gr.*,
          p.first_name,
          p.last_name,
          p.number 
        FROM game_roster gr
        JOIN
          players p ON gr.player_id = p.id 
        WHERE gr.game_id = ? AND gr.called = 1;`,
        [gameId]
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido obtener las Convocatorias");
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
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar guardar la convocatoria`
      );
    }
  },
  update: async (data) => {
    try {
      await dbInstance.runAsync(
        `UPDATE game_roster SET called = ? WHERE game_id = ? AND player_id = ?;`,
        [data.called, data.game_id, data.player_id]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar actualizar la convocatoria`
      );
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync(`DELETE FROM game_roster WHERE id = ?;`, [id]);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar eliminar la convocatoria`
      );
    }
  },
});
