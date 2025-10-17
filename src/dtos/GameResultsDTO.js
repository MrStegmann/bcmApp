export const GameResultsDTO = (dbInstance) => ({
  get: async (teamId) => {
    try {
      return await dbInstance.getAllAsync(
        `
          SELECT
            g.*,
            
            -- Tu Equipo (is_opponent = 0)
            SUM(CASE WHEN qs.is_opponent = 0 THEN qs.result ELSE 0 END) AS total_result,
            SUM(CASE WHEN qs.is_opponent = 0 THEN qs.falts ELSE 0 END) AS total_falts,
            
            -- Oponente (is_opponent = 1)
            SUM(CASE WHEN qs.is_opponent = 1 THEN qs.result ELSE 0 END) AS total_result_opponent,
            SUM(CASE WHEN qs.is_opponent = 1 THEN qs.falts ELSE 0 END) AS total_falts_opponent
            
          FROM
            games g
          LEFT JOIN
            quarter_results qs ON g.id = qs.game_id
          WHERE
            g.team_id = ?
          GROUP BY
            g.id, g.team_id, g.opponent, g.round, g.date, g.played;
      `,
        [teamId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información de los resultados del partido."
      );
    }
  },
  getLasts: async (teamId) => {
    try {
      return await dbInstance.getAllAsync(
        `
          SELECT
            g.*,
            
            -- Tu Equipo (is_opponent = 0)
            SUM(CASE WHEN qs.is_opponent = 0 THEN qs.result ELSE 0 END) AS total_result,
            SUM(CASE WHEN qs.is_opponent = 0 THEN qs.falts ELSE 0 END) AS total_falts,
            
            -- Oponente (is_opponent = 1)
            SUM(CASE WHEN qs.is_opponent = 1 THEN qs.result ELSE 0 END) AS total_result_opponent,
            SUM(CASE WHEN qs.is_opponent = 1 THEN qs.falts ELSE 0 END) AS total_falts_opponent
            
          FROM
            games g
          LEFT JOIN
            quarter_results qs ON g.id = qs.game_id
          WHERE
            g.team_id = ?
          GROUP BY
            g.id, g.team_id, g.opponent, g.round, g.date, g.played 
          ORDER BY
            g.date DESC
          LIMIT 3;
      `,
        [teamId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información de los últimos resultados."
      );
    }
  },
});
