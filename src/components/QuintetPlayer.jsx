import React, { useCallback, useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import StopwatchTimer from "react-native-animated-stopwatch-timer";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useMatchCronoStore,
  useMatchPlayerStore,
  useMatchTeamFalts,
  useMatchTeamResult,
} from "../store/MatchStore";
import StatsEnums from "../Enums/StatsEnums";

// --- Componente Auxiliar para Contadores Genéricos (Rebotes, Asistencias, Pérdidas) ---

const StatCounter = React.memo(
  ({ statKey, currentValue, increment, decrement }) => {
    return (
      <View
        className={`${[StatsEnums.dreb, StatsEnums.oreb].includes(statKey) ? "w-14" : "w-12"} px-1 flex flex-row justify-center items-center`}
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

const QuintetPlayer = React.memo(
  ({ playerId, isInToBench, setToBench, quarter }) => {
    const player = useMatchPlayerStore((state) => state.players[playerId]);
    const setPlayerById = useMatchPlayerStore((state) => state.setPlayerById);
    if (!player) return null;
    const teamResultStore = useMatchTeamResult((state) => state);
    const teamFaltsStore = useMatchTeamFalts((state) => state);
    const crono = useMatchCronoStore((state) => state.crono);

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

    const addStat = (stat) => {
      const newPlayer = { ...player };
      const prev = newPlayer.stats[stat];
      if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
        const iShot =
          stat === StatsEnums.t1a
            ? StatsEnums.t1i
            : stat === StatsEnums.t2a
              ? StatsEnums.t2i
              : StatsEnums.t3i;
        const iPrev = newPlayer.stats[iShot];
        newPlayer.stats[stat] = prev + 1;
        newPlayer.stats[iShot] = iPrev + 1;
        teamResultStore.setTeamResult({
          ...teamResultStore.teamResult,
          [quarter]:
            teamResultStore.teamResult[quarter] +
            (stat === StatsEnums.t1a ? 1 : stat === StatsEnums.t2a ? 2 : 3),
        });
      } else {
        newPlayer.stats[stat] = prev + 1;
        if (stat === StatsEnums.falt)
          teamFaltsStore.setTeamFalt({
            ...teamFaltsStore.teamFalt,
            [quarter]: teamFaltsStore.teamFalt[quarter] + 1,
          });
      }

      setPlayerById(playerId, newPlayer);
    };
    const substractStat = (stat) => {
      const newPlayer = { ...player };
      const prev = newPlayer.stats[stat];
      if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
        const iShot =
          stat === StatsEnums.t1a
            ? StatsEnums.t1i
            : stat === StatsEnums.t2a
              ? StatsEnums.t2i
              : StatsEnums.t3i;
        const iPrev = newPlayer.stats[iShot];
        newPlayer.stats[stat] = prev - 1 < 0 ? 0 : prev - 1;
        newPlayer.stats[iShot] = iPrev - 1 < 0 ? 0 : iPrev - 1;
        teamResultStore.setTeamResult({
          ...teamResultStore.teamResult,
          [quarter]:
            teamResultStore.teamResult[quarter] -
              (stat === StatsEnums.t1a ? 1 : stat === StatsEnums.t2a ? 2 : 3) <
            0
              ? 0
              : teamResultStore.teamResult[quarter] -
                (stat === StatsEnums.t1a ? 1 : stat === StatsEnums.t2a ? 2 : 3),
        });
      } else {
        newPlayer.stats[stat] = prev - 1 < 0 ? 0 : prev - 1;
        if (stat === StatsEnums.falt)
          teamFaltsStore.setTeamFalt({
            ...teamFaltsStore.teamFalt,
            [quarter]:
              teamFaltsStore.teamFalt[quarter] - 1 < 0
                ? 0
                : teamFaltsStore.teamFalt[quarter] - 1,
          });
      }

      setPlayerById(playerId, newPlayer);
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
        {STATS_CONFIG.map((key) => (
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
