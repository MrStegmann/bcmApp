import React from "react";
import { Text, View } from "react-native-web";
import { useMarketStore } from "../../store/MatchStore";

const TotalResult = React.memo(({ teamName, rivalName }) => {
  const rivalPoints = useMarketStore((state) => state.rivalPoints);
  const teamPoints = useMarketStore((state) => state.teamPoints);
  const totalRivalPoints = Object.values(rivalPoints).reduce(
    (acc, val) => acc + val,
    0,
  );
  const totalTeamPoints = Object.values(teamPoints).reduce(
    (acc, val) => acc + val,
    0,
  );
  return (
    <View className="w-full flex flex-row justify-between items-center border-b border-black p-2">
      <Text className="text-wrap w-1/4">{teamName}</Text>
      <View className="flex flex-row w-1/4 justify-center items-center">
        <Text className="text-base">{totalTeamPoints}</Text>
        <Text className="mx-1 text-base">-</Text>
        <Text className="text-base">{totalRivalPoints}</Text>
      </View>
      <Text className="text-wrap text-right w-1/4">{rivalName}</Text>
    </View>
  );
});

export default TotalResult;
