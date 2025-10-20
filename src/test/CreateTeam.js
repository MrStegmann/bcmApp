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
      played: true,
    });
    for (let i = 1; i < 6; i++) {
      await models.QuarterResultsModel.save([
        {
          game_id: 1,
          is_opponent: 0,
          quarter_num: i,
          result: 20,
          falts: 3,
        },
        {
          game_id: 1,
          is_opponent: 1,
          quarter_num: i,
          result: 15,
          falts: 4,
        },
      ]);
    }
    for (let i = 1; i < 11; i++) {
      await models.GameRosterModel.update({
        called: true,
        game_id: 1,
        player_id: i,
      });
      await models.PlayerStatsModel.save({
        game_id: 1,
        player_id: i,
        minutes: 15 * 60 * 1000,
        t1a: 2,
        t1i: 4,
        t2a: 3,
        t2i: 4,
        t3a: 4,
        t3i: 8,
        dreb: 4,
        oreb: 1,
        asis: 4,
        rec: 2,
        per: 4,
        falt: 3,
      });
    }

    await models.GameModel.save({
      team_id: 1,
      opponent: "Armazimo",
      round: 2,
      date: "15/10/2025",
      played: true,
    });
    for (let i = 1; i < 6; i++) {
      await models.QuarterResultsModel.save([
        {
          game_id: 2,
          is_opponent: 0,
          quarter_num: i,
          result: 20,
          falts: 3,
        },
        {
          game_id: 2,
          is_opponent: 1,
          quarter_num: i,
          result: 15,
          falts: 4,
        },
      ]);
    }
    for (let i = 1; i < 11; i++) {
      await models.GameRosterModel.update({
        called: true,
        game_id: 2,
        player_id: i,
      });
    }

    await models.TrainingsModel.save({
      team_id: 1,
      training_number: 1,
      date: "09/09/2025",
      warmup1: "Rotación articular y fondos",
      warmup1_explanation: "",
      warmup2: "Once",
      warmup2_explanation: "Es un once",
      warmup3: "Trenza transitiva",
      warmup3_explanation: "trenza transitiva",
      exercise1: "2x1 continuo",
      exercise1_explanation: "adsad",
      exercise2: "Lectura defensa, 1x1 entrada o tiro",
      exercise2_explanation:
        "El jugador, si el defensor elige el lado más cercano, tirará, sino entrará",
      exercise3: "Circuito defensivo + salida a la contra",
      exercise3_explanation: "",
      exercise4: "",
      exercise4_explanation: "",
      exercise5: "",
      exercise5_explanation: "",
      exercise6: "",
      exercise6_explanation: "",
      cooldown1: "Estiramientos",
      cooldown1_explanation: "",
      cooldown2: "",
      cooldown2_explanation: "",
    });
    await models.TrainingsModel.save({
      team_id: 1,
      training_number: 2,
      date: "12/09/2025",
      warmup1: "Rotación articular y fondos",
      warmup1_explanation: "",
      warmup2: "Once",
      warmup2_explanation: "Es un once",
      warmup3: "Trenza transitiva",
      warmup3_explanation: "trenza transitiva",
      exercise1: "2x1 continuo",
      exercise1_explanation: "adsad",
      exercise2: "Lectura defensa, 1x1 entrada o tiro",
      exercise2_explanation:
        "El jugador, si el defensor elige el lado más cercano, tirará, sino entrará",
      exercise3: "Circuito defensivo + salida a la contra",
      exercise3_explanation: "",
      exercise4: "",
      exercise4_explanation: "",
      exercise5: "",
      exercise5_explanation: "",
      exercise6: "",
      exercise6_explanation: "",
      cooldown1: "Estiramientos",
      cooldown1_explanation: "",
      cooldown2: "",
      cooldown2_explanation: "",
    });
  } catch (error) {
    console.error("No se ha podido crear los datos de testeo");
    console.log(error);
  }
}
