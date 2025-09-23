export async function createPlayer(PlayerModel) {
  await PlayerModel.create({
    team_id: 1,
    first_name: "Patrick",
    last_name: "Stegmann",
    number: "10",
  });
}

export async function createPlayers(PlayerModel) {
  await PlayerModel.create({
    team_id: 1,
    first_name: "Patrick",
    last_name: "Stegmann",
    number: "10",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Carlos",
    last_name: "León",
    number: "9",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Rau",
    last_name: "Gomez",
    number: "00",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Juan Carlos",
    last_name: "El Xokas",
    number: "13",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Miguel",
    last_name: "Come Viejas",
    number: "69",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Sergio",
    last_name: "Vende Casas",
    number: "29",
  });
}
