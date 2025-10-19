import { Text, View, TouchableOpacity } from "react-native";
import {
  useMatchPlayerStore,
  useMatchTeamFalts,
  useMatchTeamResult,
} from "../../store/MatchStore";
import StatsEnums from "../../Enums/StatsEnums";
import React from "react";

const STATS_CONFIG = [
  StatsEnums.falt,
  StatsEnums.per,
  StatsEnums.asis,
  StatsEnums.dreb,
  StatsEnums.oreb,
  StatsEnums.rec,
];
const SHOT_CONFIG = [
  StatsEnums.t1a,
  StatsEnums.t2a,
  StatsEnums.t3a,
  StatsEnums.t1i,
  StatsEnums.t2i,
  StatsEnums.t3i,
];

const PlayerOptions = React.memo(({ toBench, quarter }) => {
  const setPlayerById = useMatchPlayerStore((state) => state.setPlayerById);
  const teamFaltsStore = useMatchTeamFalts((state) => state);
  const teamResultStore = useMatchTeamResult((state) => state);
  const players = useMatchPlayerStore((state) => state.players);
  const addStat = (stat) => {
    const playerId = [...toBench][0];
    const newPlayer = { ...players[playerId] };
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
    const playerId = [...toBench][0];
    const newPlayer = { ...players[playerId] };
    const prev = newPlayer.stats[stat];
    if (prev - 1 < 0) return;
    if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
      const iShot =
        stat === StatsEnums.t1a
          ? StatsEnums.t1i
          : stat === StatsEnums.t2a
            ? StatsEnums.t2i
            : StatsEnums.t3i;
      const iPrev = newPlayer.stats[iShot];
      newPlayer.stats[stat] = prev - 1;
      newPlayer.stats[iShot] = iPrev - 1;
      teamResultStore.setTeamResult({
        ...teamResultStore.teamResult,
        [quarter]:
          teamResultStore.teamResult[quarter] -
          (stat === StatsEnums.t1a ? 1 : stat === StatsEnums.t2a ? 2 : 3),
      });
    } else {
      newPlayer.stats[stat] = prev - 1 < 0 ? 0 : prev - 1;
      if (stat === StatsEnums.falt)
        teamFaltsStore.setTeamFalt({
          ...teamFaltsStore.teamFalt,
          [quarter]: teamFaltsStore.teamFalt[quarter] - 1,
        });
    }

    setPlayerById(playerId, newPlayer);
  };
  return (
    <View
      className="w-full flex-1 flex flex-col justify-center items-center"
      style={{ opacity: toBench.size === 1 ? 1 : 0.5 }}
    >
      <Text className="text-danish-white text-xs capitalize">Añadir</Text>

      <View className="w-full flex flex-row mb-2 justify-center items-center">
        <View className="w-1/3 flex flex-row flex-wrap gap-1">
          {SHOT_CONFIG.map((stat) => (
            <TouchableOpacity
              key={`add-${stat}`}
              className={`border rounded-lg w-22 h-22 py-1 px-2 mr-1 border-danish-gold`}
              disabled={toBench.size !== 1}
              onPress={() => addStat(stat)}
            >
              <Text className="text-danish-white text-center text-xs capitalize">
                {stat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="w-1/3 flex flex-row flex-wrap gap-1">
          {STATS_CONFIG.map((stat) => (
            <TouchableOpacity
              key={`add-${stat}`}
              disabled={toBench.size !== 1}
              className={`border rounded-lg w-22 h-22 py-1 px-2 mr-1 border-danish-gold`}
              onPress={() => addStat(stat)}
            >
              <Text className="text-danish-white text-center text-xs capitalize">
                {stat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text className="text-danish-white text-xs capitalize">Quitar</Text>

      <View className="w-full flex flex-row justify-center items-center">
        <View className="w-1/3 flex flex-row flex-wrap gap-1">
          {SHOT_CONFIG.map((stat) => (
            <TouchableOpacity
              key={`substract-${stat}`}
              disabled={toBench.size !== 1}
              className={`border rounded-lg w-22 h-22 py-1 px-2 mr-1 border-danish-red`}
              onPress={() => substractStat(stat)}
            >
              <Text className="text-danish-white text-center text-xs capitalize">
                {stat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="w-1/3 flex flex-row flex-wrap gap-1">
          {STATS_CONFIG.map((stat) => (
            <TouchableOpacity
              key={`substract-${stat}`}
              disabled={toBench.size !== 1}
              className={`border rounded-lg w-22 h-22 py-1 px-2 mr-1 border-danish-red`}
              onPress={() => substractStat(stat)}
            >
              <Text className="text-danish-white text-center text-xs capitalize">
                {stat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
});

export default PlayerOptions;
