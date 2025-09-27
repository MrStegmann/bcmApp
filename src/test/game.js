export async function createGame(gameModel) {
  await gameModel.create({
    team_id: 1,
    opponent: "Compactaciones",
    round: 1,
    date: "25/09/2025",
    result_c1_opponent: 0,
    result_c2_opponent: 0,
    result_c3_opponent: 0,
    result_c4_opponent: 0,
    result_extra_opponent: 0,
    result_c1: 0,
    result_c2: 0,
    result_c3: 0,
    result_c4: 0,
    result_extra: 0,
  });
}
