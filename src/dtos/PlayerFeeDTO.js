export const PlayerFeeDTO = (dbInstance) => ({
  getPlayerFees: async (playerId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `
            SELECT
                p.id,
                p.first_name,
                p.last_name,
                p.number,
                f.id AS fee_id,
                f.season,
                f.month,
                f.paid
            FROM
                players p
            JOIN
                fees f ON p.id = f.player_id
            WHERE
                p.id = ?
            ;`,
          [playerId]
        )
      );
    } catch (error) {
      console.error(error);
      callback([]);
    }
  },
  getTeamFees: async (teamId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `
            SELECT
        
                p.first_name,
                p.last_name,
                p.number,
                f.id,
                f.team_id,
                f.player_id,
                f.season,
                f.month,
                f.paid
            FROM
                fees f
            JOIN
                players p ON p.id = f.player_id
            WHERE
                f.team_id = ?
            ;`,
          [teamId]
        )
      );
    } catch (error) {
      console.error(error);
      callback([]);
    }
  },
});
