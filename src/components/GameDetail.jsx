import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import useDB from "../hooks/useDB";
import { useClubStore } from "../store/ClubStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import { timeFormat } from "../helpers/timeFormat";
import StatsEnums from "../Enums/StatsEnums";
import QuartersEnums from "../Enums/QuartersEnums";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// --- Componente Auxiliar para Contadores Genéricos (Rebotes, Asistencias, Pérdidas) ---

const StatCounter = React.memo(
  ({ statKey, currentValue, increment, decrement }) => {
    return (
      <View
        className={`${["dreb", "oreb"].includes(statKey) ? "w-14" : "w-12"} px-1 flex flex-row justify-center items-center`}
      >
        <TouchableOpacity
          className="flex justify-center items-center"
          onPress={() => decrement(statKey)}
        >
          <MaterialIcons name="arrow-back-ios" size={10} color="white" />
        </TouchableOpacity>
        <Text className="text-danish-white text-sm text-center">
          {currentValue}
        </Text>
        <TouchableOpacity onPress={() => increment(statKey)}>
          <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
);

// --- Configuración de Estadísticas para mapeo ---
const STATS_CONFIG = [
  StatsEnums.t1a,
  StatsEnums.t1i,
  StatsEnums.t2a,
  StatsEnums.t2i,
  StatsEnums.t3a,
  StatsEnums.t3i,
  StatsEnums.falt,
  StatsEnums.dreb,
  StatsEnums.oreb,
  StatsEnums.asis,
  StatsEnums.rec,
  StatsEnums.per,
];

const marker = { team: 0, opponent: 0 };
const defaultMarker = {
  c1: { ...marker },
  c2: { ...marker },
  c3: { ...marker },
  c4: { ...marker },
  extra: { ...marker },
};

const quarters = [...Object.values(QuartersEnums)];

const PlayerStat = React.memo(({ player, setPlayers, index }) => {
  if (!player) return null;

  const addStat = (stat) => {
    const newPlayer = { ...player };
    const prev = newPlayer[stat];
    if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
      const shotI =
        stat === StatsEnums.t1a
          ? StatsEnums.t1i
          : stat === StatsEnums.t2a
            ? StatsEnums.t2i
            : StatsEnums.t3i;
      const prevI = newPlayer[shotI];
      newPlayer[shotI] = prevI + 1;
    }
    if (stat === StatsEnums.minutes) {
      newPlayer[stat] = prev < 60000 ? 60000 : prev + 60000;
    } else {
      newPlayer[stat] = prev + 1;
    }

    setPlayers((bef) => ({ ...bef, [index]: newPlayer }));
  };
  const substractStat = (stat) => {
    const newPlayer = { ...player };
    const prev = newPlayer[stat];
    if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
      const shotI =
        stat === StatsEnums.t1a
          ? StatsEnums.t1i
          : stat === StatsEnums.t2a
            ? StatsEnums.t2i
            : StatsEnums.t3i;
      const prevI = newPlayer[shotI];
      newPlayer[shotI] = prevI - 1 < 0 ? 0 : prevI - 1;
    }
    if (stat === StatsEnums.minutes) {
      newPlayer[stat] = prev - 60000 < 0 ? 0 : prev - 60000;
    } else {
      newPlayer[stat] = prev - 1 < 0 ? 0 : prev - 1;
    }

    setPlayers((bef) => ({ ...bef, [index]: newPlayer }));
  };

  const pts = player.t1a + player.t2a * 2 + player.t3a * 3;
  const minuts = timeFormat(player.minutes);
  return (
    <View className="w-full my-1 flex flex-row items-center border-b border-danish-light-gray gap-1">
      <View className="w-28 px-1">
        <Text className={`text-sm text-danish-white`}>
          {`${player.number} - ${player.first_name}`}
        </Text>
      </View>
      <View className="w-12 px-1 flex flex-row justify-center items-center">
        <TouchableOpacity
          onPress={() => substractStat("minutes")}
          className="flex justify-center items-center"
        >
          <MaterialIcons name="arrow-back-ios" size={10} color="white" />
        </TouchableOpacity>
        <Text className="text-danish-white text-sm text-center">{minuts}</Text>
        <TouchableOpacity onPress={() => addStat("minutes")}>
          <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-12 px-1">
        <Text className="text-danish-white text-sm text-center">{pts}</Text>
      </View>
      {STATS_CONFIG.map((key) => (
        <StatCounter
          key={key}
          statKey={key}
          currentValue={player[key]}
          increment={addStat}
          decrement={substractStat}
        />
      ))}
    </View>
  );
});

const Marker = React.memo(({ quarter, result, setResult }) => {
  const addResult = (team) => {
    const newResult = { ...result };
    const prev = newResult[quarter][team];
    newResult[quarter][team] = prev + 1;

    setResult(newResult);
  };

  const substractResult = (team) => {
    const newResult = { ...result };
    const prev = newResult[quarter][team];
    newResult[quarter][team] = prev - 1 < 0 ? 0 : prev - 1;

    setResult(newResult);
  };
  return (
    <View className="flex flex-col w-full items-center mb-1">
      <View className="w-full flex flex-row">
        <View className="w-1/3 flex flex-row justify-center">
          <TouchableOpacity
            onPress={() => substractResult("team")}
            className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          >
            <Text className="text-danish-white">-</Text>
          </TouchableOpacity>
          <Text className="text-danish-white text-sm mx-5">
            {result[quarter].team}
          </Text>
          <TouchableOpacity
            onPress={() => addResult("team")}
            className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          >
            <Text className="text-danish-white">+</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-danish-white capitalize text-xs w-1/3 text-center">
          {quarter}
        </Text>
        <View className="w-1/3 flex flex-row justify-center">
          <TouchableOpacity
            onPress={() => substractResult("opponent")}
            className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          >
            <Text className="text-danish-white">-</Text>
          </TouchableOpacity>
          <Text className="text-danish-white text-sm mx-5">
            {result[quarter].opponent}
          </Text>
          <TouchableOpacity
            onPress={() => addResult("opponent")}
            className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          >
            <Text className="text-danish-white">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const Falts = React.memo(({ quarter, result, setResult }) => {
  const addResult = (team) => {
    const newResult = { ...result };
    const prev = newResult[quarter][team];
    newResult[quarter][team] = prev + 1;

    setResult(newResult);
  };

  const substractResult = (team) => {
    const newResult = { ...result };
    const prev = newResult[quarter][team];
    newResult[quarter][team] = prev - 1 < 0 ? 0 : prev - 1;

    setResult(newResult);
  };
  return (
    <View className="flex flex-col w-full items-center mb-1">
      <View className="w-full flex flex-row">
        <View className="w-1/3 flex flex-row justify-center">
          <TouchableOpacity
            onPress={() => substractResult("team")}
            className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          >
            <Text className="text-danish-white">-</Text>
          </TouchableOpacity>
          <Text className="text-danish-white text-sm mx-5">
            {result[quarter].team}
          </Text>
          <TouchableOpacity
            onPress={() => addResult("team")}
            className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          >
            <Text className="text-danish-white">+</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-danish-white capitalize text-xs w-1/3 text-center">
          {quarter}
        </Text>
        <View className="w-1/3 flex flex-row justify-center">
          <TouchableOpacity
            onPress={() => substractResult("opponent")}
            className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          >
            <Text className="text-danish-white">-</Text>
          </TouchableOpacity>
          <Text className="text-danish-white text-sm mx-5">
            {result[quarter].opponent}
          </Text>
          <TouchableOpacity
            onPress={() => addResult("opponent")}
            className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          >
            <Text className="text-danish-white">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const GameDetail = ({ data, onSave, onReturn }) => {
  const { GameController, PlayerStatsController } = useDB();
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const [result, setResult] = useState(defaultMarker);
  const [teamFalt, setTeamFalt] = useState(defaultMarker);
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync("hidden");

    mainMenu();

    return () => {
      ScreenOrientation.unlockAsync();
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  useEffect(() => {
    setResult({
      c1: { team: data.result_c1, opponent: data.result_c1_opponent },
      c2: { team: data.result_c2, opponent: data.result_c2_opponent },
      c3: { team: data.result_c3, opponent: data.result_c3_opponent },
      c4: { team: data.result_c4, opponent: data.result_c4_opponent },
      extra: {
        team: data.result_extra,
        opponent: data.result_extra_opponent,
      },
    });
    setTeamFalt({
      c1: { team: data.falts_c1, opponent: data.falts_c1_opponent },
      c2: { team: data.falts_c2, opponent: data.falts_c2_opponent },
      c3: { team: data.falts_c3, opponent: data.falts_c3_opponent },
      c4: { team: data.falts_c4, opponent: data.falts_c4_opponent },
      extra: { team: data.falts_extra, opponent: data.falts_extra_opponent },
    });

    getRoaster();
  }, [data]);

  useEffect(() => {
    mainMenu();
  }, [
    players,
    data,
    result,
    teamFalt,
    GameController,
    PlayerStatsController,
    onReturn,
  ]);

  const mainMenu = () => {
    setTopMenu([
      {
        id: TopMenuEnums.SAVE,
        name: "Guardar",
        onPress: handleSave,
        icon: TopMenuEnums.SAVE,
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        icon: TopMenuEnums.GO_BACK,
      },
    ]);
  };

  const handleSave = async () => {
    await GameController.save({
      id: data.id,
      team_id: data.team_id,
      opponent: data.opponent,
      round: data.round,
      date: data.date,
    });
    await GameController.saveResults({
      id: data.result_id,
      game_id: data.id,
      result_c1: result.c1.team,
      result_c2: result.c2.team,
      result_c3: result.c3.team,
      result_c4: result.c4.team,
      result_extra: result.extra.team,
      falts_c1: teamFalt.c1.team,
      falts_c2: teamFalt.c2.team,
      falts_c3: teamFalt.c3.team,
      falts_c4: teamFalt.c4.team,
      falts_extra: teamFalt.extra.team,
    });
    await GameController.saveOpponentResults({
      id: data.result_id_opponent,
      game_id: data.id,
      result_c1_opponent: result.c1.opponent,
      result_c2_opponent: result.c2.opponent,
      result_c3_opponent: result.c3.opponent,
      result_c4_opponent: result.c4.opponent,
      result_extra_opponent: result.extra.opponent,
      falts_c1_opponent: teamFalt.c1.opponent,
      falts_c2_opponent: teamFalt.c2.opponent,
      falts_c3_opponent: teamFalt.c3.opponent,
      falts_c4_opponent: teamFalt.c4.opponent,
      falts_extra_opponent: teamFalt.extra.opponent,
    });

    const newPlayers = [...Object.values(players)];

    // Usar Promise.all para guardar en paralelo si la BBDD lo soporta
    await Promise.all(
      newPlayers.map((player) =>
        PlayerStatsController.save({
          id: player.statId,
          game_id: data.id,
          player_id: player.player_id,
          ...player,
        })
      )
    );
    onSave();
  };

  const getRoaster = async () => {
    const RESULT_CALLEDUP = await GameController.getRoasterStats(data.id);
    // Crear objeto de jugadores con sus nombres, numeros, id y añadir stats y propiedad booleana de bench, para que el componente sepa si está jugando o no.
    const players = {};
    for (const player of RESULT_CALLEDUP) {
      const { called, ...rest } = player;
      players[rest.player_id] = rest;
    }
    setPlayers(players);
  };

  const totalTeam =
    result.c1.team +
    result.c2.team +
    result.c3.team +
    result.c4.team +
    result.extra.team;
  const totalOpponent =
    result.c1.opponent +
    result.c2.opponent +
    result.c3.opponent +
    result.c4.opponent +
    result.extra.opponent;

  const totalFaltsTeam =
    teamFalt.c1.team +
    teamFalt.c2.team +
    teamFalt.c3.team +
    teamFalt.c4.team +
    teamFalt.extra.team;

  const totalFaltsOpponent =
    teamFalt.c1.opponent +
    teamFalt.c2.opponent +
    teamFalt.c3.opponent +
    teamFalt.c4.opponent +
    teamFalt.extra.opponent;

  const toMapPlayers = players ? [...Object.entries(players)] : [];
  return (
    <View className="flex-1 px-2 h-full w-full flex flex-col justify-center items-center">
      <View className="w-full justify-between flex flex-row">
        <View className="w-1/2 flex flex-col mb-5">
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white text-sm w-1/3 text-center">
              {club.name}
            </Text>
            <Text className="text-danish-white text-xs w-1/3 text-center">
              vs
            </Text>
            <Text className="text-danish-white text-sm w-1/3 text-center">
              {data.opponent}
            </Text>
          </View>

          {quarters.map((q) => (
            <Marker key={q} quarter={q} result={result} setResult={setResult} />
          ))}

          <View className="w-full flex flex-row justify-between mt-5">
            <Text className="text-danish-white text-sm w-1/3 text-center">
              {totalTeam}
            </Text>
            <Text className="text-danish-white text-xs w-1/3 text-center">
              -
            </Text>
            <Text className="text-danish-white text-sm w-1/3 text-center">
              {totalOpponent}
            </Text>
          </View>
        </View>
        <View className="w-1/2 flex flex-col mb-5">
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white text-sm w-1/3 text-center">
              Faltas {club.name}
            </Text>
            <Text className="text-danish-white text-xs w-1/3 text-center">
              -
            </Text>
            <Text className="text-danish-white text-sm w-1/3 text-center">
              Faltas {data.opponent}
            </Text>
          </View>

          {quarters.map((q) => (
            <Falts
              key={q}
              quarter={q}
              result={teamFalt}
              setResult={setTeamFalt}
            />
          ))}

          <View className="w-full flex flex-row justify-between mt-5">
            <Text className="text-danish-white text-sm w-1/3 text-center">
              {totalFaltsTeam}
            </Text>
            <Text className="text-danish-white text-xs w-1/3 text-center">
              -
            </Text>
            <Text className="text-danish-white text-sm w-1/3 text-center">
              {totalFaltsOpponent}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats de jugadores */}
      <View className="w-full mt-1 flex flex-row border-b border-danish-light-gray gap-1">
        <View className="w-28 px-1">
          <Text className="text-danish-white text-sm">Nº - Nombre</Text>
        </View>
        <View className="w-12 px-1">
          <Text className="text-danish-white text-sm text-center">Mins</Text>
        </View>
        <View className="w-12 px-1">
          <Text className="text-danish-white text-sm text-center">Pts</Text>
        </View>
        {STATS_CONFIG.map((t) => (
          <View
            key={`header-${t}`}
            className={`${[StatsEnums.dreb, StatsEnums.oreb].includes(t) ? "w-14" : "w-12"} px-1`}
          >
            <Text className="text-danish-white text-sm text-center capitalize">
              {t}
            </Text>
          </View>
        ))}
      </View>
      {players ? (
        <View className="w-full mt-1 flex flex-col mb-12">
          <FlatList
            data={toMapPlayers}
            renderItem={({ item }) => (
              <PlayerStat
                player={item[1]}
                index={item[0]}
                setPlayers={setPlayers}
              />
            )}
            keyExtractor={(item) => item[0]}
          />
        </View>
      ) : (
        <View className="w-full flex flex-col justify-center items-center mt-20">
          <MaterialCommunityIcons
            name="book-open-blank-variant-outline"
            size={30}
            color="gray"
          />
          <Text className="text-lg font-bold text-danish-light-gray px-16">
            Cargando datos...
          </Text>
        </View>
      )}
    </View>
  );
};

export default GameDetail;
