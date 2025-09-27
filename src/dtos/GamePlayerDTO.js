export const GamePlayerDTO = (dbInstance) => ({
  get: async (gameId) => {
    try {
      return await dbInstance.getAllAsync(
        `
            SELECT
                g.*,
                p.id AS player_id,
                p.first_name,
                p.last_name,
                p.number
            FROM
                games g
            JOIN
                game_roster gr ON g.id = gr.game_id
            JOIN
                players p ON gr.player_id = p.id
            WHERE
                g.id = ?;
            `,
        [gameId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información del jugador y su convocación"
      );
    }
  },
});
