export const GameResultsDTO = (dbInstance) => ({
  get: async (teamId) => {
    try {
      return await dbInstance.getAllAsync(
        `
            SELECT
                g.*,
                gr.id AS result_id,
                gr.result_c1, 
                gr.result_c2, 
                gr.result_c3,
                gr.result_c4,
                gr.result_extra,
                gr.falts_c1,
                gr.falts_c2,
                gr.falts_c3,
                gr.falts_c4,
                gr.falts_extra,
                gro.id AS result_id_opponent,
                gro.result_c1_opponent, 
                gro.result_c2_opponent, 
                gro.result_c3_opponent,
                gro.result_c4_opponent,
                gro.result_extra_opponent,
                gro.falts_c1_opponent,
                gro.falts_c2_opponent,
                gro.falts_c3_opponent,
                gro.falts_c4_opponent,
                gro.falts_extra_opponent
            FROM
                games g
            JOIN
                game_results gr ON g.id = gr.game_id
            JOIN
                game_results_opponent gro ON g.id = gro.game_id
            WHERE
                g.team_id = ?;
            `,
        [teamId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información del jugador y su convocación"
      );
    }
  },
});
