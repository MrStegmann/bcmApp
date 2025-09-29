export const TrainingPlayerDTO = (dbInstance) => ({
  get: async (trainingId) => {
    try {
      return await dbInstance.getAllAsync(
        `
            SELECT
                p.*,
                tp.id as tp_id,
                tp.notes,
                tp.assistance
            FROM
                players p
            JOIN
                trainings_players tp ON p.id = tp.player_id
            WHERE
                tp.training_id = ?;
            `,
        [trainingId]
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "No se ha podido obtener la información del jugador y sus asistencias a entrenamientos"
      );
    }
  },
});
