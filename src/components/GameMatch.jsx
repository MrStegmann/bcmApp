import React, { useCallback, useEffect, useState, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import {
  useMatchPlayerStore,
  useMatchStore,
  useMatchTeamResult,
  useMatchTeamFalts,
} from "../store/MatchStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import Quarter from "./Quarter";
import QuartersEnums from "../Enums/QuartersEnums";

const quarters = [...Object.values(QuartersEnums)];
const quarterTimes = 10 * 60 * 1000;
const extraTime = 5 * 60 * 1000;

const GameMatch = ({ data, onReturn, onSave }) => {
  const { GameController, PlayerStatsController } = useDB();
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const matchStore = useMatchStore((state) => state); // Contiene resultado total del partido y funciones para aumentar o disminuir
  const matchPlayer = useMatchPlayerStore((state) => state);
  const [quarter, setQuarter] = useState(QuartersEnums.c1); // Marcará el parcial seleccionado. Por deceto, el primer parcial.

  const teamResultStore = useMatchTeamResult((state) => state);
  const teamFaltsStore = useMatchTeamFalts((state) => state);

  const [opponentResult, setOpponentResult] = useState({
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
    extra: 0,
  });
  const [opponentFalts, setOpponentFalts] = useState({
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
    extra: 0,
  });

  const [time, setTime] = useState({
    // Contendrá los tiempos de cada parcial en milisegundos
    c1: quarterTimes,
    c2: quarterTimes,
    c3: quarterTimes,
    c4: quarterTimes,
    extra: extraTime,
  });

  // Cambia la orientación del móvil a apaisado y oculta la barra de navegación. Devuelve el estado retrato y la visibilidad de la barra de navegación cuando se desmonta el componente.
  // Carga los botones del menú
  // Añade el nombre del oponente al estado global.
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync("hidden");
    mainMenu();

    // Seteo estado global
    matchStore.setOpponent(data.opponent);
    matchStore.setGameId(data.id);

    //indico de que el partido se está jugando
    matchStore.setPlaying(true);

    return () => {
      ScreenOrientation.unlockAsync();
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  useEffect(() => {
    const pts =
      teamResultStore.teamResult.c1 +
      teamResultStore.teamResult.c2 +
      teamResultStore.teamResult.c3 +
      teamResultStore.teamResult.c4 +
      teamResultStore.teamResult.extra;
    matchStore.setResults({ ...matchStore.results, team: pts });
  }, [teamResultStore]);

  useEffect(() => {
    mainMenu();
  }, [
    onReturn,
    teamResultStore,
    teamFaltsStore,
    handleSave,
    matchStore,
    matchPlayer,
    onSave,
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
      played: true,
    });
    await GameController.saveResults({
      id: data.result_id,
      game_id: data.id,
      result_c1: teamResultStore.teamResult.c1,
      result_c2: teamResultStore.teamResult.c2,
      result_c3: teamResultStore.teamResult.c3,
      result_c4: teamResultStore.teamResult.c4,
      result_extra: teamResultStore.teamResult.extra,
      falts_c1: teamFaltsStore.teamFalt.c1,
      falts_c2: teamFaltsStore.teamFalt.c2,
      falts_c3: teamFaltsStore.teamFalt.c3,
      falts_c4: teamFaltsStore.teamFalt.c4,
      falts_extra: teamFaltsStore.teamFalt.extra,
    });
    await GameController.saveOpponentResults({
      id: data.result_id_opponent,
      game_id: data.id,
      result_c1_opponent: opponentResult.c1,
      result_c2_opponent: opponentResult.c2,
      result_c3_opponent: opponentResult.c3,
      result_c4_opponent: opponentResult.c4,
      result_extra_opponent: opponentResult.extra,
      falts_c1_opponent: opponentFalts.c1,
      falts_c2_opponent: opponentFalts.c2,
      falts_c3_opponent: opponentFalts.c3,
      falts_c4_opponent: opponentFalts.c4,
      falts_extra_opponent: opponentFalts.extra,
    });
    const newPlayers = [...Object.values(matchPlayer.players)];
    // Usar Promise.all para guardar en paralelo si la BBDD lo soporta
    await Promise.all(
      newPlayers.map((player) =>
        PlayerStatsController.save({
          game_id: data.id,
          player_id: player.player_id,
          ...player,
        })
      )
    );
    onSave();
  };

  const handleSetTime = (newTime) => setTime(newTime);

  return (
    <View className="flex-1 px-2 h-full w-full flex flex-col justify-center items-center">
      {/* Selección de parciales */}
      <View className="w-full flex flex-row justify-center items-center">
        {quarters.map((q) => (
          <TouchableOpacity
            className={`p-1 w-10 border border-danish-red ${quarter === q ? "bg-danish-red" : "bg-danish-dark-gray"}`}
            key={q}
            onPress={() => setQuarter(q)}
          >
            <Text className="text-danish-white text-xs text-center capitalize">
              {q}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Quarter
        time={time}
        opponentResult={opponentResult}
        setOpponentResult={setOpponentResult}
        opponentFalts={opponentFalts}
        setOpponentFalts={setOpponentFalts}
        quarter={quarter}
        setTime={handleSetTime}
      />
    </View>
  );
};

export default GameMatch;
