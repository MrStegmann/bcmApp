export async function createGame(gameModel) {
  await gameModel.create({
    team_id: 1,
    opponent: "Compactaciones",
    round: 1,
    date: "25/09/2025",
    result_c1_opponent: 12,
    result_c2_opponent: 14,
    result_c3_opponent: 10,
    result_c4_opponent: 7,
    result_extra_opponent: 0,
    result_c1: 15,
    result_c2: 13,
    result_c3: 15,
    result_c4: 10,
    result_extra: 0,
  });
}
