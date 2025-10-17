export const QuarterResults = (dbInstance) => ({
  createTable: async () => {
    try {
      await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS quarter_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        is_opponent INTEGER NOT NULL,
        quarter_num INTEGER NOT NULL,
        result INTEGER DEFAULT 0,
        falts INTEGER DEFAULT 0,
        
        -- Restricción para evitar duplicados: No puede haber dos entradas para el mismo cuarto/equipo en un partido
        UNIQUE (game_id, is_opponent, quarter_num),
        
        FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
    )`);
      await dbInstance.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_quarter_results_game_id ON quarter_results(game_id);`
      );
    } catch (error) {
      console.error(error);
      throw new Error("No se ha podido crear la tabla de resultados");
    }
  },
  save: async (data) => {
    const sqlStatement = `
        INSERT INTO quarter_results (game_id, is_opponent, quarter_num, result, falts)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(game_id, is_opponent, quarter_num) 
        DO UPDATE SET result = excluded.result, falts = excluded.falts;
    `;

    try {
      for (const quarter of data) {
        // Ejemplo de parámetros para el 1er cuarto del oponente
        const params = [
          quarter.game_id,
          quarter.is_opponent,
          quarter.quarter_num,
          quarter.result,
          quarter.falts,
        ];
        await dbInstance.runAsync(sqlStatement, params);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Ha ocurrido un error al intentar guardar el partido contra ${data.opponent}`
      );
    }
  },
  getByGameId: async (gameId) => {
    try {
      return await dbInstance.getAllAsync(
        `SELECT * FROM quarter_results WHERE game_id = ? ORDER BY quarter_num ASC`,
        [gameId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información de los resultados por cuartos."
      );
    }
  },
});
