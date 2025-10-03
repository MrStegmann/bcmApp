export async function CreaTeam(models) {
  try {
    await models.TeamModel.save({ name: "Furola Basket" });
    const players = [
      {
        team_id: 1,
        first_name: "Patrick",
        last_name: "Stegmann",
        number: "10",
      },
      { team_id: 1, first_name: "Carlos", last_name: "León", number: "26" },
      { team_id: 1, first_name: "Rau", last_name: "Brasileiro", number: "00" },
      {
        team_id: 1,
        first_name: "Gonzalo",
        last_name: "Dulce de Leche",
        number: "6",
      },
      {
        team_id: 1,
        first_name: "Vicente",
        last_name: "Valenzuela",
        number: "13",
      },
      {
        team_id: 1,
        first_name: "Miguel Angel",
        last_name: "Ramos Tro",
        number: "16",
      },
      {
        team_id: 1,
        first_name: "Christian",
        last_name: "Manito",
        number: "23",
      },
      { team_id: 1, first_name: "Jesder", last_name: "Prime", number: "96" },
      { team_id: 1, first_name: "Alexis", last_name: "Gitano", number: "17" },
      { team_id: 1, first_name: "Sergio", last_name: "Balbuena", number: "24" },
    ];

    for (const player of players) {
      await models.PlayerModel.save(player);
    }

    await models.GameModel.save({
      team_id: 1,
      opponent: "Compactaciones",
      round: 1,
      date: "10/10/2025",
    });
    for (let i = 1; i < 11; i++) {
      await models.GameRosterModel.update({
        called: true,
        game_id: 1,
        player_id: i,
      });
    }
  } catch (error) {
    console.error("No se ha podido crear los datos de testeo");
    console.log(error);
  }
}
