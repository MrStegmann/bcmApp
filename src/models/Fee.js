export const FeeModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS fees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        season TEXT NOT NULL,
        month TEXT NOT NULL,
        paid INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
        FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE
      );`);
      await dbInstance.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_players_fees_id ON fees(player_id);`
      );
      await dbInstance.execAsync(`CREATE TRIGGER IF NOT EXISTS create_player_fees
        AFTER INSERT ON players
        FOR EACH ROW
        BEGIN
            INSERT INTO fees (team_id, player_id, season, month)
            VALUES
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'JANUARY'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'FEBRUARY'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'MARCH'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'APRIL'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'MAY'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'JUNE'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'JULY'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'AUGOST'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'SEPTEMBER'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'OCTOBER'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'NOVEMBER'),
                (NEW.team_id, NEW.id, strftime('%Y', 'now'), 'DECEMBER');
        END;`);
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido crear la tabla de Cuotas");
    }
  },
  getAll: async (teamId) => {
    try {
      return await dbInstance.getAllAsync(
        `SELECT * FROM fees WHERE team_id = ?`,
        [teamId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(`Ha ocurrido un error al intentar obtener las cuotas`);
    }
  },

  create: async (data) => {
    try {
      await dbInstance.runAsync(
        "INSERT INTO fees (team_id, season, month, player_id) VALUES (?, ?, ?, ?)",
        [data.team_id, data.season, data.month, data.player_id]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar guardar la cuota del mes de ${data.month}`
      );
    }
  },
  update: async (data) => {
    try {
      await dbInstance.runAsync(
        `UPDATE fees SET team_id = ?, player_id = ?, season = ?, month = ?, paid = ? WHERE id = ?`,
        [
          data.team_id,
          data.player_id,
          data.season,
          data.month,
          data.paid,
          data.id,
        ]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar actualizar la cuota del mes de ${data.month}`
      );
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync("DELETE FROM fees WHERE id = ?", [id]);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar actualizar la cuota del mes`
      );
    }
  },
});
