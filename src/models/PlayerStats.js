export const PlayerStatsModel = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS players_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        minutes INTEGER DEFAULT 0,
        t1a INTEGER DEFAULT 0,
        t1i INTEGER DEFAULT 0,
        t2a INTEGER DEFAULT 0,
        t2i INTEGER DEFAULT 0,
        t3a INTEGER DEFAULT 0,
        t3i INTEGER DEFAULT 0,
        dreb INTEGER DEFAULT 0,
        oreb INTEGER DEFAULT 0,
        asis INTEGER DEFAULT 0,
        rec INTEGER DEFAULT 0,
        per INTEGER DEFAULT 0,
        falt INTEGER DEFAULT 0,
        FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE,
        FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE,
        UNIQUE (game_id, player_id)
      );`);
      await dbInstance.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_stats_player_id ON players_stats(player_id);`
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido crear la tabla de Estadísticas");
    }
  },
  getAllByPlayer: async (playerId) => {
    try {
      return await dbInstance.getAllAsync(
        `SELECT * FROM players_stats WHERE player_id = ?;`,
        [playerId]
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido obtener las Estadísticas");
    }
  },
  save: async (data) => {
    console.log(data);
    const {
      id,
      game_id,
      player_id,
      minutes,
      t1a,
      t1i,
      t2a,
      t2i,
      t3a,
      t3i,
      dreb,
      oreb,
      asis,
      rec,
      per,
      falt,
    } = data;
    const sqlStatment = id
      ? `UPDATE players_stats SET minutes = ?, t1a = ?, t1i = ?, t2a = ?, t2i = ?, t3a = ?, t3i = ?, dreb = ?, oreb = ?, asis = ?, rec = ?, per = ?, falt = ? WHERE id = ?`
      : `INSERT INTO players_stats (game_id, player_id, minutes, t1a, t1i, t2a, t2i, t3a, t3i, dreb, oreb, asis, rec, per, falt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const params = id
      ? [
          minutes,
          t1a,
          t1i,
          t2a,
          t2i,
          t3a,
          t3i,
          dreb,
          oreb,
          asis,
          rec,
          per,
          falt,
          id,
        ]
      : [
          game_id,
          player_id,
          minutes,
          t1a,
          t1i,
          t2a,
          t2i,
          t3a,
          t3i,
          dreb,
          oreb,
          asis,
          rec,
          per,
          falt,
        ];
    try {
      await dbInstance.runAsync(sqlStatment, params);
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido guardar las estadísticas del jugador");
    }
  },

  saveMultiple: async (dataArray) => {
    const sqlStatement = `
        INSERT INTO players_stats (game_id, player_id, minutes, t1a, t1i, t2a, t2i, t3a, t3i, dreb, oreb, asis, rec, per, falt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(game_id, player_id) 
        DO UPDATE SET minutes = excluded.minutes, t1a = excluded.t1a, t1i = excluded.t1i, t2a = excluded.t2a, t2i = excluded.t2i, t3a = excluded.t3a, t3i = excluded.t3i, dreb = excluded.dreb, oreb = excluded.oreb, asis = excluded.asis, rec = excluded.rec, per = excluded.per, falt = excluded.falt;
    `;

    try {
      for (const data of dataArray) {
        const params = [
          data.game_id,
          data.player_id,
          data.minutes,
          data.t1a,
          data.t1i,
          data.t2a,
          data.t2i,
          data.t3a,
          data.t3i,
          data.dreb,
          data.oreb,
          data.asis,
          data.rec,
          data.per,
          data.falt,
        ];
        await dbInstance.runAsync(sqlStatement, params);
      }
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido guardar las estadísticas del jugador");
    }
  },
});
