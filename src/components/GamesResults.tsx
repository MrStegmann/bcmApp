import React from "react";
import { View, Text, ScrollView } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface CardGamesResultsProps {
  game: any;
}

const CardGamesResults: React.FC<CardGamesResultsProps> = ({ game }) => {
  const result =
    (game.resultC1 ?? game.result_c1 ?? 0) +
    (game.resultC2 ?? game.result_c2 ?? 0) +
    (game.resultC3 ?? game.result_c3 ?? 0) +
    (game.resultC4 ?? game.result_c4 ?? 0) +
    (game.resultExtra ?? game.result_extra ?? 0);
  const resultOpponent =
    (game.resultC1Opponent ?? game.result_c1_opponent ?? 0) +
    (game.resultC2Opponent ?? game.result_c2_opponent ?? 0) +
    (game.resultC3Opponent ?? game.result_c3_opponent ?? 0) +
    (game.resultC4Opponent ?? game.result_c4_opponent ?? 0) +
    (game.resultExtraOpponent ?? game.result_extra_opponent ?? 0);

  return (
    <View
      className={`w-full px-2 py-3 flex flex-row justify-between items-center rounded-lg shadow-inner border-2 bg-danish-dark-gray ${result > resultOpponent ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
    >
      <View className="w-1/3 flex flex-col justify-center items-center">
        <Text className="text-center text-xs text-danish-white">
          Jornada {game.round}
        </Text>
        <Text className="text-center text-xs text-danish-white">
          {game.date}
        </Text>
      </View>
      <View className="w-1/3 flex flex-col justify-center items-center">
        <Text className="text-danish-white">{game.opponent}</Text>
      </View>

      <View className="w-1/3 flex-row justify-center items-center">
        <Text className="font-bold text-sm text-danish-white">
          {`${result}`}
        </Text>
        <Text className="mx-2 font-bold text-sm text-danish-white">-</Text>
        <Text className="font-bold text-sm text-danish-white">
          {`${resultOpponent}`}
        </Text>
      </View>
    </View>
  );
};

interface GamesResultsProps {
  gamesResults: any[];
}

const GamesResults: React.FC<GamesResultsProps> = ({ gamesResults = [] }) => {
  if (!gamesResults || gamesResults.length === 0) {
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray px-16 text-center">
          Parece que no hay registros recientes que mostrar...
        </Text>
      </View>
    );
  }

  return (
    <View className="p-4 shadow w-full px-3">
      <Text className="text-danish-white font-bold text-center mb-1">
        Resultado Últimos partidos
      </Text>
      <View className="w-full h-96 flex flex-col">
        <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
          {gamesResults.map((game) => (
            <CardGamesResults key={game.id} game={game} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default GamesResults;
