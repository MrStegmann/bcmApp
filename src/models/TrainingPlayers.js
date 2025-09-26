export const TrainingPlayersModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync("DROP TABLE IF EXISTS trainings_players");
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS trainings_players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        training_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        notes TEXT,
        assistance INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY(training_id) REFERENCES trainings(id) ON DELETE CASCADE,
        FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE

      );`);
      await dbInstance.execAsync(`CREATE TRIGGER IF NOT EXISTS create_training_players
        AFTER INSERT ON trainings
        FOR EACH ROW
        BEGIN
            INSERT INTO trainings_players (training_id, player_id)
            SELECT
                NEW.id,
                p.id
            FROM players p
            WHERE p.team_id = NEW.team_id;
      END;`);
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido crear la tabla de Asistencias a Entrenamientos"
      );
    }
  },
  getAll: async (trainingId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `SELECT * FROM trainings_players WHERE training_id = ?;`,
          [trainingId]
        )
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },
  getAllByPlayer: async (playerId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `SELECT * FROM trainings_players WHERE player_id = ?;`,
          [playerId]
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
        "INSERT INTO trainings_players (training_id, player_id, notes, assistance) VALUES (?, ?, ?, ?);",
        [data.training_id, data.player_id, data.notes, data.assistance]
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido guardar la asistencia al entrenamiento");
    }
  },
  update: async (data) => {
    try {
      await dbInstance.runAsync(
        `UPDATE trainings_players SET
          notes = ?,
          assistance = ?
        WHERE id = ?;`,
        [data.notes, data.assistance, data.id]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido actualizar la asistencia al entrenamiento"
      );
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync("DELETE FROM trainings_players WHERE id = ?;", [
        id,
      ]);
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido eliminar la asistencia al entrenamiento"
      );
    }
  },
});
