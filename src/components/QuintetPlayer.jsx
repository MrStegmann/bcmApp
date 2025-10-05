import React, { useCallback, useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import StopwatchTimer from "react-native-animated-stopwatch-timer";
import { MaterialIcons } from "@expo/vector-icons";
import { useMatchPlayerStore } from "../store/MatchStore";

// --- Componente Auxiliar para Contadores Genéricos (Rebotes, Asistencias, Pérdidas) ---

const StatCounter = React.memo(
  ({ statKey, currentValue, increment, decrement }) => {
    return (
      <View className="w-12 px-1 flex flex-row justify-center items-center">
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

// --- Componente Auxiliar para Tiros (Lleva lógica de resultado de equipo) ---
const ShotCounter = React.memo(({ shotType, currentValue, handleShot }) => {
  return (
    <View className="w-12 px-1 flex flex-row justify-center items-center">
      <TouchableOpacity
        className="flex justify-center items-center"
        onPress={() => handleShot(shotType, "substract")}
      >
        <MaterialIcons name="arrow-back-ios" size={10} color="white" />
      </TouchableOpacity>
      <Text className="text-danish-white text-sm text-center">
        {currentValue}
      </Text>
      <TouchableOpacity onPress={() => handleShot(shotType, "add")}>
        <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
      </TouchableOpacity>
    </View>
  );
});

// --- Configuración de Estadísticas para mapeo ---
const STATS_CONFIG = [
  { key: "dreb", label: "DReb" },
  { key: "oreb", label: "OReb" },
  { key: "asis", label: "Asis" },
  { key: "rec", label: "Rec" },
  { key: "per", label: "Per" },
];

const SHOTS_KEY = ["1a", "1i", "2a", "2i", "3a", "3i"];

const QuintetPlayer = React.memo(
  ({
    playerId,
    setPlayer,
    isInToBench,
    setToBench,
    crono,
    quarter,
    result,
    onSetResult,
    onSetTeamFalt,
    teamFalt,
  }) => {
    const player = useMatchPlayerStore((state) => state.players[playerId]);
    const setPlayerById = useMatchPlayerStore((state) => state.setPlayerById);
    if (!player) return null;

    const stopwatchTimerRef = useRef(null); // Referencia para el Crono. Necesario para que funcione la librería correctamente
    // Control del Crono
    const play = useCallback(() => stopwatchTimerRef.current?.play(), []);
    const pause = useCallback(() => stopwatchTimerRef.current?.pause(), []);
    const getTime = useCallback(
      () => stopwatchTimerRef.current?.getSnapshot(),
      []
    );

    useEffect(() => {
      if (crono) {
        play();
      } else {
        pause();
        const newPlayer = { ...player };
        newPlayer.stats.min = getTime();
        setPlayerById(playerId, newPlayer);
      }
    }, [crono]);

    const handleShot = useCallback(
      (shotType, type) => {
        const action = type === "add" ? "add" : "substract";

        switch (shotType) {
          case "1a":
          case "2a":
          case "3a":
            action === "add" ? addShot(shotType) : substractShot(shotType);
            break;
          case "1i":
          case "2i":
          case "3i":
            action === "add" ? addFail(shotType) : substractFail(shotType);
            break;
          default:
            break;
        }
      },
      [player, setPlayerById]
    );
    const addShot = (shot) => {
      const newStats = { ...stats };

      const iShot = shot === "1a" ? "1i" : shot === "2a" ? "2i" : "3i";
      const prevA = newStats[`t${shot}`];
      const prevI = newStats[`t${iShot}`];
      newStats[`t${shot}`] = prevA + 1;
      newStats[`t${iShot}`] = prevI + 1;
      const newResult = { ...result };
      newResult[quarter].team =
        newResult[quarter].team + (shot === "1a" ? 1 : shot === "2a" ? 2 : 3);
      onSetResult(newResult);
      setPlayerById(playerId, { ...player, stats: newStats });
    };
    const substractShot = (shot) => {
      const newStats = { ...stats };
      const iShot = shot === "1a" ? "1i" : shot === "2a" ? "2i" : "3i";
      const prevA = newStats[`${shot}a`];
      const prevI = newStats[`${iShot}i`];
      newStats[`t${shot}`] = prevA - 1 < 0 ? 0 : prevA - 1;
      newStats[`t${iShot}`] = prevI - 1 < 0 ? 0 : prevI - 1;

      const newResult = { ...result };
      newResult[quarter].team =
        newResult[quarter].team - (shot === "1a" ? 1 : shot === "2a" ? 2 : 3) <
        0
          ? 0
          : newResult[quarter].team -
            (shot === "1a" ? 1 : shot === "2a" ? 2 : 3);
      onSetResult(newResult);
      setPlayerById(playerId, { ...player, stats: newStats });
    };

    const addFail = (shot) => {
      const newStats = { ...stats };
      const prevI = newStats[`t${shot}`];
      newStats[`t${shot}`] = prevI + 1;
      setPlayerById(playerId, { ...player, stats: newStats });
    };
    const substractFail = (shot) => {
      const newStats = { ...stats };
      const prevI = newStats[`t${shot}`];
      newStats[`t${shot}`] = prevI - 1 < 0 ? 0 : prevI - 1;
      setPlayerById(playerId, { ...player, stats: newStats });
    };

    const addFault = () => {
      const newStats = { ...stats };
      const prev = newStats.falt;
      newStats.falt = prev + 1;

      const newTeamFalt = { ...teamFalt };
      newTeamFalt[quarter].team = newTeamFalt[quarter].team + 1;
      onSetTeamFalt(newTeamFalt);
      setPlayerById(playerId, { ...player, stats: newStats });
    };
    const substractFault = () => {
      const newStats = { ...stats };
      const prev = newStats.falt;
      newStats.falt = prev - 1 < 0 ? 0 : prev - 1;

      const newTeamFalt = { ...teamFalt };
      newTeamFalt[quarter].team =
        newTeamFalt[quarter].team - 1 < 0 ? 0 : newTeamFalt[quarter].team - 1;
      onSetTeamFalt(newTeamFalt);
      setPlayerById(playerId, { ...player, stats: newStats });
    };

    const addStat = (stat) => {
      const newStats = { ...stats };
      const prev = newStats[stat];
      newStats[stat] = prev + 1;
      setPlayerById(playerId, { ...player, stats: newStats });
    };
    const substractStat = (stat) => {
      const newStats = { ...stats };
      const prev = newStats[stat];
      newStats[stat] = prev - 1 < 0 ? 0 : prev - 1;
      setPlayerById(playerId, { ...player, stats: newStats });
    };

    const stats = { ...player.stats };
    const pts = stats.t1a + stats.t2a * 2 + stats.t3a * 3;

    return (
      <View className="w-full my-1 flex flex-row items-center border-b border-danish-light-gray gap-1">
        <TouchableOpacity
          className="w-28 px-1"
          onPress={() => setToBench(player.player_id)}
        >
          <Text
            className={`text-sm ${isInToBench() ? "text-red-600" : "text-danish-white"}`}
          >
            {`${player.number} - ${player.first_name}`}
          </Text>
        </TouchableOpacity>
        <View className="w-12 px-1">
          <StopwatchTimer
            ref={stopwatchTimerRef}
            initialTimeInMs={player.stats.min}
            trailingZeros={0}
            animationDelay={0}
            animationDuration={0}
            containerStyle={{
              display: "flex",
              justifyContent: "center",
            }}
            textCharStyle={{
              color: "#F8F8F8",
              fontSize: 14,
              lineHeight: 20,
            }}
          />
        </View>
        <View className="w-12 px-1">
          <Text className="text-danish-white text-sm text-center">{pts}</Text>
        </View>
        {SHOTS_KEY.map((t) => (
          <ShotCounter
            key={`t${t}`}
            shotType={t}
            currentValue={stats[`t${t}`]}
            handleShot={handleShot}
          />
        ))}
        <View className="w-12 px-1 flex flex-row justify-center items-center">
          <TouchableOpacity
            className="flex justify-center items-center"
            onPress={substractFault}
          >
            <MaterialIcons name="arrow-back-ios" size={10} color="white" />
          </TouchableOpacity>
          <Text className="text-danish-white text-sm text-center">
            {stats.falt}
          </Text>
          <TouchableOpacity onPress={addFault}>
            <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
          </TouchableOpacity>
        </View>
        {STATS_CONFIG.map(({ key }) => (
          <StatCounter
            key={key}
            statKey={key}
            currentValue={stats[key]}
            increment={addStat}
            decrement={substractStat}
          />
        ))}
      </View>
    );
  }
);

export default QuintetPlayer;
