import React from "react";
import { Text, View } from "react-native";
import StatsEnums from "../../Enums/StatsEnums";

const STATS_CONFIG = [
  StatsEnums.t1a,
  StatsEnums.t1i,
  StatsEnums["t1%"],
  StatsEnums.t2a,
  StatsEnums.t2i,
  StatsEnums["t2%"],
  StatsEnums.t3a,
  StatsEnums.t3i,
  StatsEnums["t3%"],
  StatsEnums.dreb,
  StatsEnums.oreb,
  StatsEnums.asis,
  StatsEnums.rec,
  StatsEnums.per,
  StatsEnums.falt,
];

const TotalStats = React.memo(() => {
  return (
    <View className="w-full flex flex-row flex-wrap justify-between items-center mt-5 gap-2">
      {STATS_CONFIG.map((stat) => (
        <View
          key={stat}
          className="w-14 border rounded-lg p-1 flex flex-col items-center justify-center"
        >
          <Text className="capitalize text-sm">{stat}</Text>
          <Text className="">{`${0}`}</Text>
        </View>
      ))}
    </View>
  );
});

const PlayerDetails = ({ route }) => {
  const { onGoBack, player } = route.params;

  const { id, name, lastname, number } = player;

  return (
    <View className="w-full flex-1 flex flex-col items-center px-5">
      <View className="flex flex-col px-5">
        <View className="w-full flex flex-row gap-2 h-12 items-center">
          <Text className="font-bold">#{number}</Text>
          <View className="h-full flex justify-center items-center">
            <Text className="font-bold text-lg">{name + " " + lastname}</Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row w-full justify-between">
        <View className="w-14 border rounded-lg p-1 flex flex-col items-center justify-center">
          <Text className="text-sm">Mins</Text>
          <Text className="">{`${0}`}</Text>
        </View>
        <View className="w-14 border rounded-lg p-1 flex flex-col items-center justify-center">
          <Text className="text-sm">Pts</Text>
          <Text className="">{`${0}`}</Text>
        </View>
        <View className="w-14 border rounded-lg p-1 flex flex-col items-center justify-center">
          <Text className="text-sm">Val</Text>
          <Text className="">{`${0}`}</Text>
        </View>
      </View>
      <TotalStats />
    </View>
  );
};

export default PlayerDetails;
