import React, { useCallback, useEffect, useState, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { useMatchPlayerStore, useMatchStore } from "../store/MatchStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import Quarter from "./Quarter";

const quarterResults = { team: 0, opponent: 0 };
const quarters = ["c1", "c2", "c3", "c4", "extra"];
const quarterTimes = 10 * 60 * 1000;
const extraTime = 5 * 60 * 1000;

const GameMatch = ({ data, onReturn, onSave }) => {
  const { GameController, PlayerStatsController } = useDB();
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const matchStore = useMatchStore((state) => state); // Contiene resultado total del partido y funciones para aumentar o disminuir
  const players = useMatchPlayerStore((state) => state.players);
  const [quarter, setQuarter] = useState("c1"); // Marcará el parcial seleccionado. Por deceto, el primer parcial.
  const [result, setResult] = useState({
    // Tendrá el resultado por cuartos. Local.
    c1: { ...quarterResults },
    c2: { ...quarterResults },
    c3: { ...quarterResults },
    c4: { ...quarterResults },
    extra: { ...quarterResults },
  });

  const [time, setTime] = useState({
    // Contendrá los tiempos de cada parcial en milisegundos
    c1: quarterTimes,
    c2: quarterTimes,
    c3: quarterTimes,
    c4: quarterTimes,
    extra: extraTime,
  });
  const [teamFalt, setTeamFalt] = useState({
    // Contendrá las faltas de equipo por parcial
    c1: { ...quarterResults },
    c2: { ...quarterResults },
    c3: { ...quarterResults },
    c4: { ...quarterResults },
    extra: { ...quarterResults },
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
      result.c1.team +
      result.c2.team +
      result.c3.team +
      result.c4.team +
      result.extra.team;
    matchStore.setResults({ ...matchStore.results, team: pts });
  }, [result]);

  const mainMenu = useCallback(() => {
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
  }, [onReturn, result, teamFalt, handleSave, matchStore, players, onSave]);

  const handleSave = useCallback(async () => {
    try {
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
      const savePlayerPromises = newPlayers.map((player) => {
        const playerStats = {
          game_id: data.id,
          player_id: player.player_id,
          ...player.stats,
        };
        return PlayerStatsController.save(playerStats);
      });
      await Promise.all(savePlayerPromises);
      onSave();
    } catch (error) {
      console.log(error);
    }
  }, [result, teamFalt, matchStore, players, onSave]);

  const handleSetTime = (newTime) => setTime(newTime);

  const handleSetResult = (newResult) => setResult(newResult);

  const handleSetFalt = (newFalt) => setTeamFalt(() => newFalt);

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
        result={result}
        teamFalt={teamFalt}
        quarter={quarter}
        setTime={handleSetTime}
        setResult={handleSetResult}
        setTeamFalt={handleSetFalt}
      />
    </View>
  );
};

export default GameMatch;
