import { Text, View } from "react-native-web";
import React from "react";
import { timeFormat } from "../../helpers/timeFormat";
import StatsEnums from "../../Enums/StatsEnums";

const STATS_CONFIG = [
  StatsEnums.t1a,
  StatsEnums.t1i,
  "p1Per",
  StatsEnums.t2a,
  StatsEnums.t2i,
  "p2Per",
  StatsEnums.t3a,
  StatsEnums.t3i,
  "p3Per",
  StatsEnums.falt,
  StatsEnums.dreb,
  StatsEnums.oreb,
  StatsEnums.asis,
  StatsEnums.rec,
  StatsEnums.per,
];

const PlayerStats = React.memo(
  ({
    asis,
    dreb,
    falt,
    minutes,
    oreb,
    per,
    rec,
    t1a,
    t1i,
    t2a,
    t2i,
    t3a,
    t3i,
  }) => {
    const getPercent = (stat) => {
      if (stat === "p1Per") return p1Per;
      if (stat === "p2Per") return p2Per;
      if (stat === "p3Per") return p3Per;
      return 0;
    };
    const p1Per = t1i && t1a ? Math.round((t1a / t1i) * 100) : 0;
    const p2Per = t2i && t2a ? Math.round((t2a / t2i) * 100) : 0;
    const p3Per = t3i && t3a ? Math.round((t3a / t3i) * 100) : 0;

    const stats = {
      oreb,
      per,
      rec,
      t1a,
      t1i,
      t2a,
      t2i,
      t3a,
      t3i,
      asis,
      dreb,
      falt,
    };
    const pts = (t1a || 0) * 1 + (t2a || 0) * 2 + (t3a || 0) * 3;
    const val =
      pts + (asis || 0) + (dreb || 0) + (oreb || 0) + (rec || 0) - (falt || 0);
    return (
      <View className="w-full">
        <View className="w-full flex flex-row justify-between items-center">
          <View
            className="border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center"
            style={{ width: 32 }}
          >
            <View className="w-full flex flex-col justify-center items-center">
              <Text className="text-danish-white text-xs">PTS</Text>
              <Text className="text-danish-white text-xs">{`${pts || 0}`}</Text>
            </View>
          </View>
          <View
            className="border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center"
            style={{ width: 50 }}
          >
            <Text className="text-danish-white text-xs">Min</Text>
            <Text className="text-danish-white text-xs">{`${timeFormat(minutes || 0)}`}</Text>
          </View>
          <View
            className="border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center"
            style={{ width: 32 }}
          >
            <View className="w-full flex flex-col justify-center items-center">
              <Text className="text-danish-white text-xs">Val</Text>
              <Text className="text-danish-white text-xs">{`${val || 0}`}</Text>
            </View>
          </View>
        </View>
        <View className="w-full flex flex-row flex-wrap justify-between items-center mt-1 gap-y-2">
          {STATS_CONFIG.map((stat) => (
            <View
              key={stat}
              className="border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center"
              style={{ width: 32 }}
            >
              <Text className="text-danish-white capitalize text-xs">
                {stat == "p1Per"
                  ? "T1%"
                  : stat == "p2Per"
                    ? "T2%"
                    : stat == "p3Per"
                      ? "T3%"
                      : stat}
              </Text>
              {["p1Per", "p2Per", "p3Per"].includes(stat) ? (
                <Text className="text-danish-white text-xs">{`${getPercent(stat)}`}</Text>
              ) : (
                <Text className="text-danish-white text-xs">{`${stats?.[`${stat}`] || 0}`}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  },
);

const PlayerInfo = ({ first_name, last_name, number, stats }) => {
  return (
    <View className={`w-full px-5`}>
      <Text className="text-danish-white text-center text-xs">
        {number
          ? `${number} - ${first_name} ${last_name}`
          : "Jugador no seleccionado"}
      </Text>
      <PlayerStats {...stats} />
    </View>
  );
};

export default PlayerInfo;
