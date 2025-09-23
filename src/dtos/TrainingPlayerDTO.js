export const TrainingPlayerDTO = (dbInstance) => ({
  get: async (trainingId, callback) => {
    try {
      callback(
        await dbInstance.getAllAsync(
          `
            SELECT
                p.*,
                tp.id as tp_id,
                tp.player_id,
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
        )
      );
    } catch (error) {
      console.log(error);
      callback([]);
    }
  },
});
