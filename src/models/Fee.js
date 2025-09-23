export default class Fee {
  constructor(fee) {
    this.id = fee.id;
    this.teamId = fee.teamId;
    this.playerId = fee.playerId;
    this.season = fee.season;
    this.month = fee.month;
    this.paid = fee.paid || 0;
  }

  toCreate() {}
  toUpdate() {
    return [
      this.teamId,
      this.playerId,
      this.season,
      this.month,
      this.paid,
      this.id,
    ];
  }
}

export const FeeModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync("DROP TABLE IF EXISTS fees;");
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

      await dbInstance.execAsync("DROP TRIGGER IF EXISTS create_player_fees;");
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
      console.log("Error al crear Fees: ", error);
    }
  },
  getAll: async (teamId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(`SELECT * FROM fees WHERE team_id = ?`, [
          teamId,
        ])
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },

  create: async (data) => {
    try {
      await dbInstance.runAsync(
        "INSERT INTO fees (team_id, season, month, player_id) VALUES (?, ?, ?, ?)",
        [data.team_id, data.season, data.month, data.player_id]
      );
    } catch (error) {
      console.error("Error al crear el jugador:", error);
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
      console.error(`Error al actualizar el jugador ${data.name}:`, error);
    }
  },
  delete: async (id) => {
    try {
      await dbInstance.runAsync("DELETE FROM fees WHERE id = ?", [id]);
    } catch (error) {
      console.error(`Error al eliminar el jugador con ID ${id}:`, error);
    }
  },
});
