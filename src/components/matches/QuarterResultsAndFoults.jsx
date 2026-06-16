import React from "react";
import { Text, View } from "react-native-web";
import { useMarketStore } from "../../store/MatchStore";

const Foults = React.memo(({ foults }) => {
  return (
    <View className="flex flex-row gap-2">
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${foults > 0 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${foults > 1 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${foults > 2 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${foults > 3 ? "bg-danish-red" : "bg-danish-light-gray"}`}
      />
    </View>
  );
});

const Points = React.memo(({ points }) => (
  <Text className="text-base">{points}</Text>
));

const QuarterResultsAndFoults = React.memo(() => {
  const rivalPoints = useMarketStore((state) => state.rivalPoints);
  const rivalFoults = useMarketStore((state) => state.rivalFoults);

  const teamPoints = useMarketStore((state) => state.teamPoints);
  const teamFoults = useMarketStore((state) => state.teamFoults);
  const quarter = useMarketStore((state) => state.quarter);
  return (
    <View className="w-full flex flex-row justify-between items-center p-2">
      <Foults foults={teamFoults[quarter]} />
      <View className="flex flex-row w-1/4 justify-center items-center">
        <Points points={teamPoints[quarter]} />
        <Text className="mx-1 text-base">-</Text>
        <Points points={rivalPoints[quarter]} />
      </View>
      <Foults foults={rivalFoults[quarter]} />
    </View>
  );
});

export default QuarterResultsAndFoults;
