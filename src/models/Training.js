export const TrainingsModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS trainings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        training_number INTEGER,
        date TEXT,
        warmup1 TEXT,
        warmup1_explanation TEXT,
        warmup2 TEXT,
        warmup2_explanation TEXT,
        warmup3 TEXT,
        warmup3_explanation TEXT,
        exercise1 TEXT,
        exercise1_explanation TEXT,
        exercise2 TEXT,
        exercise2_explanation TEXT,
        exercise3 TEXT,
        exercise3_explanation TEXT,
        exercise4 TEXT,
        exercise4_explanation TEXT,
        exercise5 TEXT,
        exercise5_explanation TEXT,
        exercise6 TEXT,
        exercise6_explanation TEXT,
        cooldown1 TEXT,
        cooldown1_explanation TEXT,
        cooldown2 TEXT,
        cooldown2_explanation TEXT,

        FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
      );`);
      await dbInstance.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_trainings_team_id ON trainings(team_id);`
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido crear la tabla de Entrenamientos");
    }
  },
  getAll: async (teamId) => {
    try {
      return await dbInstance.getAllAsync(
        `SELECT * FROM trainings WHERE team_id = ?;`,
        [teamId]
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido obtener los Entrenamientos");
    }
  },

  save: async (data) => {
    const sqlStatment = data?.id
      ? `UPDATE trainings SET
          team_id = ?,
          training_number = ?,
          date = ?,
          warmup1 = ?,
          warmup1_explanation = ?,
          warmup2 = ?,
          warmup2_explanation = ?,
          warmup3 = ?,
          warmup3_explanation = ?,
          exercise1 = ?,
          exercise1_explanation = ?,
          exercise2 = ?,
          exercise2_explanation = ?,
          exercise3 = ?,
          exercise3_explanation = ?,
          exercise4 = ?,
          exercise4_explanation = ?,
          exercise5 = ?,
          exercise5_explanation = ?,
          exercise6 = ?,
          exercise6_explanation = ?,
          cooldown1 = ?,
          cooldown1_explanation = ?,
          cooldown2 = ?,
          cooldown2_explanation = ?
        WHERE id = ?;`
      : `INSERT INTO trainings (team_id, training_number, date, warmup1, warmup1_explanation, warmup2, warmup2_explanation, warmup3, warmup3_explanation, exercise1, exercise1_explanation, exercise2, exercise2_explanation, exercise3, exercise3_explanation, exercise4, exercise4_explanation, exercise5, exercise5_explanation, exercise6, exercise6_explanation, cooldown1, cooldown1_explanation, cooldown2, cooldown2_explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = data?.id
      ? [
          data.team_id,
          data.training_number,
          data.date,
          data.warmup1,
          data.warmup1_explanation,
          data.warmup2,
          data.warmup2_explanation,
          data.warmup3,
          data.warmup3_explanation,
          data.exercise1,
          data.exercise1_explanation,
          data.exercise2,
          data.exercise2_explanation,
          data.exercise3,
          data.exercise3_explanation,
          data.exercise4,
          data.exercise4_explanation,
          data.exercise5,
          data.exercise5_explanation,
          data.exercise6,
          data.exercise6_explanation,
          data.cooldown1,
          data.cooldown1_explanation,
          data.cooldown2,
          data.cooldown2_explanation,
          data.id,
        ]
      : Object.values(data);
    try {
      await dbInstance.runAsync(sqlStatment, params);
    } catch (error) {
      console.error(error);
      throw new Error(`No se ha podido guardar el entrenamiento`);
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync("DELETE FROM trainings WHERE id = ?;", [id]);
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido eliminar el entrenamiento");
    }
  },
});
