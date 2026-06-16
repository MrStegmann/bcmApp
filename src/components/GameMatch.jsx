import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
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
import QuartersEnums from "../Enums/QuartersEnums";
import CronoMatch from "./Match/CronoMatch";
import Quintet from "./Match/Quintet";
import OpponentOptions from "./Match/OpponentOptions";

const quarters = [...Object.values(QuartersEnums)];
const getQuarterTime = (min) => min * 60 * 1000; // 10 minutos en milisegundos

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
    c1: getQuarterTime(10),
    c2: getQuarterTime(10),
    c3: getQuarterTime(10),
    c4: getQuarterTime(10),
    extra: getQuarterTime(5),
  });
  const [lastTimeLeft, setLastTimeLeft] = useState(time.c1);

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

    teamFaltsStore.resetTeamFalt();
    teamResultStore.resetTeamResult();
    matchStore.setResults({ team: 0, opponent: 0 });

    return () => {
      ScreenOrientation.unlockAsync();
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  useEffect(() => {
    setLastTimeLeft(time[quarter]);
  }, [quarter]);

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

  const setFullScreen = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    if (
      orientation !== ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      orientation !== ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    ) {
      // Si está en retrato, cambiar a apaisado
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    }
    if ((await NavigationBar.getVisibilityAsync()) === "visible") {
      await NavigationBar.setVisibilityAsync("hidden");
    }
  };

  const mainMenu = () => {
    setTopMenu([
      {
        id: TopMenuEnums.ROTATE_SCREEN,
        name: "Rotar pantalla",
        onPress: setFullScreen,
        icon: TopMenuEnums.ROTATE_SCREEN,
      },
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
    await GameController.saveQuarter([
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 1,
        result: teamResultStore.teamResult.c1,
        falts: teamFaltsStore.teamFalt.c1,
      },
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 2,
        result: teamResultStore.teamResult.c2,
        falts: teamFaltsStore.teamFalt.c2,
      },
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 3,
        result: teamResultStore.teamResult.c3,
        falts: teamFaltsStore.teamFalt.c3,
      },
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 4,
        result: teamResultStore.teamResult.c4,
        falts: teamFaltsStore.teamFalt.c4,
      },
      {
        game_id: data.id,
        is_opponent: 0,
        quarter_num: 5,
        result: teamResultStore.teamResult.extra,
        falts: teamFaltsStore.teamFalt.extra,
      },

      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 1,
        result: opponentResult.c1,
        falts: opponentFalts.c1,
      },
      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 2,
        result: opponentResult.c2,
        falts: opponentFalts.c2,
      },
      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 3,
        result: opponentResult.c3,
        falts: opponentFalts.c3,
      },
      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 4,
        result: opponentResult.c4,
        falts: opponentFalts.c4,
      },
      {
        game_id: data.id,
        is_opponent: 1,
        quarter_num: 5,
        result: opponentResult.extra,
        falts: opponentFalts.extra,
      },
    ]);
    const newPlayers = [...Object.values(matchPlayer.players)];

    const statsToSave = newPlayers.map((player) => ({
      ...(player?.statId != null && { id: player?.statId }),
      game_id: data.id,
      player_id: player.player_id,
      ...player.stats,
    }));

    await PlayerStatsController.saveMultiple(statsToSave);
    teamFaltsStore.resetTeamFalt();
    teamResultStore.resetTeamResult();
    matchStore.setResults({ team: 0, opponent: 0 });
    onSave();
  };

  const handleSetTime = (newTime) => setTime(newTime);

  return (
    <View className="flex-1 px-2 h-full w-full flex flex-col justify-center items-center">
      {/* Selección de parciales */}
      <View className="w-full flex flex-row justify-start items-center relative">
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
        {/* Resultado Parcial + Crono + Faltas de Equipo  */}
        <CronoMatch
          time={time}
          opponentResult={opponentResult}
          setOpponentResult={setOpponentResult}
          opponentFalts={opponentFalts}
          setOpponentFalts={setOpponentFalts}
          quarter={quarter}
          setTime={handleSetTime}
        />
        <OpponentOptions
          opponentResult={opponentResult}
          setOpponentResult={setOpponentResult}
          opponentFalts={opponentFalts}
          setOpponentFalts={setOpponentFalts}
          quarter={quarter}
        />
      </View>
      <Quintet
        quarter={quarter}
        time={time}
        lastTimeLeft={lastTimeLeft}
        setLastTimeLeft={setLastTimeLeft}
      />
    </View>
  );
};

export default GameMatch;
