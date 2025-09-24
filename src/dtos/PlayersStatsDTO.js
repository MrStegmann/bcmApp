export const PlayersStatsDTO = (dbInstance) => ({
  getTotalByTeam: async (teamId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `
            SELECT
                p.team_id,
                p.id,
                p.first_name,
                p.last_name,
                p.number,
                SUM(ps.minutes) AS total_minutes,
                SUM(ps.t1a) AS total_t1a,
                SUM(ps.t1i) AS total_t1i,
                SUM(ps.t2a) AS total_t2a,
                SUM(ps.t2i) AS total_t2i,
                SUM(ps.t3a) AS total_t3a,
                SUM(ps.t3i) AS total_t3i,
                SUM(ps.dreb) AS total_dreb,
                SUM(ps.oreb) AS total_oreb,
                SUM(ps.asis) AS total_asis,
                SUM(ps.rec) AS total_rec,
                SUM(ps.per) AS total_per,
                SUM(ps.falt) AS total_falt
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
        )
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },
  getTotalByPlayer: async (playerId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `
            SELECT
                p.id,
                p.first_name,
                p.last_name,
                p.number,
                SUM(ps.minutes) AS total_minutes,
                SUM(ps.t1a) AS total_t1a,
                SUM(ps.t1i) AS total_t1i,
                SUM(ps.t2a) AS total_t2a,
                SUM(ps.t2i) AS total_t2i,
                SUM(ps.t3a) AS total_t3a,
                SUM(ps.t3i) AS total_t3i,
                SUM(ps.dreb) AS total_dreb,
                SUM(ps.oreb) AS total_oreb,
                SUM(ps.asis) AS total_asis,
                SUM(ps.rec) AS total_rec,
                SUM(ps.per) AS total_per,
                SUM(ps.falt) AS total_falt
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
        )
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },
  getByGameAndPlayer: async (playerId, gameId, callback) => {
    try {
      callback(
        await dbInstance.getFirstAsync(
          `
            SELECT
                    p.id,
                    p.first_name,
                    p.last_name,
                    p.number,
                    ps.id as statId,
                    ps.minutes,
                    ps.t1a,
                    ps.t1i,
                    ps.t2a,
                    ps.t2i,
                    ps.t3a,
                    ps.t3i,
                    ps.dreb,
                    ps.oreb,
                    ps.asis,
                    ps.rec,
                    ps.per,
                    ps.falt
                FROM
                    players p
                JOIN
                    players_stats ps ON p.id = ps.player_id
                WHERE
                    p.id = ? AND ps.game_id = ?;
                `,
          [playerId, gameId]
        )
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },
});
