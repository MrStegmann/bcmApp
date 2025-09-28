export const PlayersStatsDTO = (dbInstance) => ({
  getTotalByTeam: async (teamId) => {
    try {
      return await dbInstance.getAllAsync(
        `
            SELECT
                p.team_id,
                p.id,
                p.first_name,
                p.last_name,
                p.number,
                (SUM(ps.t1a) * 1) + (SUM(ps.t2a) * 2) + (SUM(ps.t3a) * 3) AS total_pts, 
                SUM(ps.minutes) AS total_minutes,
                SUM(ps.t1a) AS total_t1a,
                SUM(ps.t1i) AS total_t1i,
                (SUM(ps.t1a) / SUM(ps.t1i)) * 100 AS total_p1Per,
                SUM(ps.t2a) AS total_t2a,
                SUM(ps.t2i) AS total_t2i,
                (SUM(ps.t2a) / SUM(ps.t2i)) * 100 AS total_p2Per,
                SUM(ps.t3a) AS total_t3a,
                SUM(ps.t3i) AS total_t3i,
                (SUM(ps.t3a) / SUM(ps.t3i)) * 100 AS total_p3Per,
                SUM(ps.dreb) AS total_dreb,
                SUM(ps.oreb) AS total_oreb,
                SUM(ps.dreb) + SUM(ps.oreb) AS total_reb,
                SUM(ps.asis) AS total_asis,
                SUM(ps.rec) AS total_rec,
                SUM(ps.per) AS total_per,
                SUM(ps.falt) AS total_falt,
                SUM(ps.t1a) + SUM(ps.t2a) + SUM(ps.t3a) + SUM(ps.dreb) + SUM(ps.oreb) +SUM(ps.asis) + SUM(ps.rec) - SUM(ps.per) - SUM(ps.falt) - (SUM(ps.t1i)-SUM(ps.t1a)) - (SUM(ps.t2i)-SUM(ps.t2a)) - (SUM(ps.t3i)-SUM(ps.t3a)) AS total_val
            FROM
                players p
            LEFT JOIN
                players_stats ps ON p.id = ps.player_id
            WHERE
                p.team_id = ?
            GROUP BY
                p.id;
            `,
        [teamId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información de los jugadores y el Average de sus estadísticas"
      );
    }
  },
  getTotalByPlayer: async (playerId) => {
    try {
      return await dbInstance.getAllAsync(
        `
            SELECT
                p.id,
                p.first_name,
                p.last_name,
                p.number,
                (SUM(ps.t1a) * 1) + (SUM(ps.t2a) * 2) + (SUM(ps.t3a) * 3) AS total_pts, 
                SUM(ps.minutes) AS total_minutes,
                SUM(ps.t1a) AS total_t1a,
                SUM(ps.t1i) AS total_t1i,
                (SUM(ps.t1a) / SUM(ps.t1i)) * 100 AS total_p1Per,
                SUM(ps.t2a) AS total_t2a,
                SUM(ps.t2i) AS total_t2i,
                (SUM(ps.t2a) / SUM(ps.t2i)) * 100 AS total_p2Per,
                SUM(ps.t3a) AS total_t3a,
                SUM(ps.t3i) AS total_t3i,
                (SUM(ps.t3a) / SUM(ps.t3i)) * 100 AS total_p3Per,
                SUM(ps.dreb) AS total_dreb,
                SUM(ps.oreb) AS total_oreb,
                SUM(ps.dreb) + SUM(ps.oreb) AS total_reb,
                SUM(ps.asis) AS total_asis,
                SUM(ps.rec) AS total_rec,
                SUM(ps.per) AS total_per,
                SUM(ps.falt) AS total_falt,
                SUM(ps.t1a) + SUM(ps.t2a) + SUM(ps.t3a) + SUM(ps.dreb) + SUM(ps.oreb) +SUM(ps.asis) + SUM(ps.rec) - SUM(ps.per) - SUM(ps.falt) - (SUM(ps.t1i)-SUM(ps.t1a)) - (SUM(ps.t2i)-SUM(ps.t2a)) - (SUM(ps.t3i)-SUM(ps.t3a)) AS total_val
            FROM
                players p
            LEFT JOIN
                players_stats ps ON p.id = ps.player_id
            WHERE
                p.id = ?
            GROUP BY
                p.id;
            `,
        [playerId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información del jugador y su Average de estadísticas"
      );
    }
  },
  getByGameAndPlayer: async (playerId, gameId) => {
    try {
      return await dbInstance.getFirstAsync(
        `
            SELECT
                    p.id,
                    p.first_name,
                    p.last_name,
                    p.number,
                    ps.id as statId,
                    ps.minutes,
                    (ps.t1a * 1) + (ps.t2a * 2) + (ps.t3a * 3) AS pts, 
                    ps.t1a,
                    ps.t1i,
                    (ps.t1a / ps.t1i) * 100 AS p1Per,
                    ps.t2a,
                    ps.t2i,
                    (ps.t2a / ps.t2i) * 100 AS p2Per,
                    ps.t3a,
                    ps.t3i,
                    (ps.t3a / ps.t3i) * 100 AS p3Per,
                    ps.dreb,
                    ps.oreb,
                    ps.dreb + ps.oreb AS reb,
                    ps.asis,
                    ps.rec,
                    ps.per,
                    ps.falt,
                    ps.t1a + ps.t2a + ps.t3a + ps.dreb + ps.oreb + ps.asis + ps.rec - ps.per - ps.falt - (ps.t1i-ps.t1a) - (ps.t2i-ps.t2a) - (ps.t3i-ps.t3a) AS val
                FROM
                    players p
                JOIN
                    players_stats ps ON p.id = ps.player_id
                WHERE
                    p.id = ? AND ps.game_id = ?;
                `,
        [playerId, gameId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información del jugador y sus estadísticas por partido"
      );
    }
  },
});
