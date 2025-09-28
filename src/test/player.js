export async function createPlayer(PlayerModel) {
  await PlayerModel.create({
    teamId: 1,
    firstName: "Patrick",
    lastName: "Stegmann",
    number: "10",
  });
}

export async function createPlayers(PlayerModel) {
  await PlayerModel.create({
    teamId: 1,
    firstName: "Patrick",
    lastName: "Stegmann",
    number: "10",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Carlos",
    lastName: "León",
    number: "9",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Rau",
    lastName: "Gomez",
    number: "00",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Juan Carlos",
    lastName: "El Xokas",
    number: "13",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Miguel",
    lastName: "Come Viejas",
    number: "69",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Sergio",
    lastName: "Vende Casas",
    number: "29",
  });

  await PlayerModel.create({
    teamId: 1,
    firstName: "Rodri",
    lastName: "Triplista",
    number: "10",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Juan",
    lastName: "Quejero",
    number: "9",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Vicente",
    lastName: "Correcaminos",
    number: "00",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Christian",
    lastName: "Manito",
    number: "13",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Jesder",
    lastName: "Prime",
    number: "69",
  });
  await PlayerModel.create({
    teamId: 1,
    firstName: "Ismael",
    lastName: "Manosalzadas",
    number: "29",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Jugador",
    last_name: "Siete",
    number: "99",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Jugador",
    last_name: "Ocho",
    number: "98",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Jugador",
    last_name: "Nueve",
    number: "97",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Jugador",
    last_name: "Diez",
    number: "96",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Jugador",
    last_name: "Once",
    number: "95",
  });
  await PlayerModel.create({
    team_id: 1,
    first_name: "Jugador",
    last_name: "Doce",
    number: "94",
  });
}
