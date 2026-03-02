import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import useDB from "../hooks/useDB";
import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import { timeFormat } from "../helpers/timeFormat";
import QuartersEnums from "../Enums/QuartersEnums";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createDefaultMarker } from "../helpers/CreateDefaultMarket";
import Marker from "./gamedetail/Marker";
import PlayerStat from "./gamedetail/PlayerStat";

const quarters = [...Object.values(QuartersEnums)];

const GameDetail = ({ data, onSave, onReturn }) => {
  const { GameController, PlayerStatsController } = useDB();
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const [result, setResult] = useState(createDefaultMarker());
  const [teamFalt, setTeamFalt] = useState(createDefaultMarker());
  const [players, setPlayers] = useState(null);
  const [playerSelected, setPlayerSelected] = useState(null);

  useEffect(() => {
    async function getQuarterResults() {
      const newResult = createDefaultMarker();
      const newTeamFalts = createDefaultMarker();
      const quartersData = await GameController.getQuarters(data.id);

      const setQuarter = (quarter, isOpponent, resultValue, faltValue) => {
        if (isOpponent === 0) {
          newResult[quarter].team = resultValue;
          newTeamFalts[quarter].team = faltValue;
        } else {
          newResult[quarter].opponent = resultValue;
          newTeamFalts[quarter].opponent = faltValue;
        }
      };
      for (const quarter of quartersData) {
        setQuarter(
          quarter.quarter_num === 5
            ? QuartersEnums.extra
            : `c${quarter.quarter_num}`,
          quarter.is_opponent,
          quarter.result,
          quarter.falts,
        );
      }
      setResult(newResult);
      setTeamFalt(newTeamFalts);
    }
    getQuarterResults();

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
      played: data.played,
    });
    await GameController.saveQuarter([
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 1,
        result: result.c1.team,
        falts: teamFalt.c1.team,
      },
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 2,
        result: result.c2.team,
        falts: teamFalt.c2.team,
      },
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 3,
        result: result.c3.team,
        falts: teamFalt.c3.team,
      },
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 4,
        result: result.c4.team,
        falts: teamFalt.c4.team,
      },
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 5,
        result: result.extra.team,
        falts: teamFalt.extra.team,
      },

      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 1,
        result: result.c1.opponent,
        falts: teamFalt.c1.opponent,
      },
      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 2,
        result: result.c2.opponent,
        falts: teamFalt.c2.opponent,
      },
      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 3,
        result: result.c3.opponent,
        falts: teamFalt.c3.opponent,
      },
      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 4,
        result: result.c4.opponent,
        falts: teamFalt.c4.opponent,
      },
      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 5,
        result: result.extra.opponent,
        falts: teamFalt.extra.opponent,
      },
    ]);
    const newPlayers = [...Object.values(players)];

    const statsToSave = newPlayers.map((player) => ({
      ...(player?.statId != null && { id: player?.statId }),
      game_id: player.game_id,
      player_id: player.player_id,
      minutes: player.minutes,
      t1a: player.t1a,
      t1i: player.t1i,
      t2a: player.t2a,
      t2i: player.t2i,
      t3a: player.t3a,
      t3i: player.t3i,
      dreb: player.dreb,
      oreb: player.oreb,
      asis: player.asis,
      rec: player.rec,
      per: player.per,
      falt: player.falt,
    }));

    await PlayerStatsController.saveMultiple(statsToSave);
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

  const toMapPlayers = players ? [...Object.entries(players)] : [];
  return (
    <View className="flex-1 px-2 h-full w-full flex flex-col justify-center items-center relative">
      {playerSelected && (
        <PlayerStat
          player={players[playerSelected]}
          index={playerSelected}
          setPlayers={setPlayers}
          onClose={() => setPlayerSelected(null)}
        />
      )}
      <View className="w-full flex flex-col justify-center items-center">
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
          <Marker
            key={q}
            quarter={q}
            result={result}
            setResult={setResult}
            teamFalt={teamFalt}
            setTeamFalt={setTeamFalt}
          />
        ))}

        <View className="w-full flex flex-row justify-between mt-5">
          <Text className="text-danish-white text-sm w-1/3 text-center">
            {totalTeam}
          </Text>
          <Text className="text-danish-white text-xs w-1/3 text-center">-</Text>
          <Text className="text-danish-white text-sm w-1/3 text-center">
            {totalOpponent}
          </Text>
        </View>
      </View>

      {/* Stats de jugadores */}
      {players ? (
        <View className="w-full mt-1 flex flex-row flex-wrap mb-24">
          <FlatList
            scrollEnabled={false}
            data={toMapPlayers}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setPlayerSelected(item[0])}
                className="my-2 flex flex-row justify-between px-2 py-1 border border-danish-red rounded-xl"
              >
                <Text className="text-danish-white">
                  {item[1].number + " - " + item[1].first_name}
                </Text>
                <Text className="text-danish-white">
                  {(item[1].t1a || 0) +
                    (item[1].t2a || 0) * 2 +
                    (item[1].t3a || 0) * 3 +
                    " pts"}
                </Text>
                <Text className="text-danish-white">
                  {timeFormat(item[1].minutes)} mins
                </Text>
              </TouchableOpacity>
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
