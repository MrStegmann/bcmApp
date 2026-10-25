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

  const isWinning = result > resultOpponent;

  return (
    <View
      className={`w-full px-3 py-3 my-1 flex flex-row justify-between items-center rounded-xl border bg-slate-card shadow-sm ${
        isWinning ? "border-court-orange" : "border-slate-border"
      }`}
    >
      <View className="w-1/3 flex flex-col justify-center items-start">
        <Text className="text-left text-xs text-primary font-bold">
          Jornada {game.round}
        </Text>
        <Text className="text-left text-xs text-on-surface-variant">
          {game.date}
        </Text>
      </View>
      <View className="w-1/3 flex flex-col justify-center items-center">
        <Text className="text-white font-semibold text-xs text-center" numberOfLines={1}>
          {game.opponent}
        </Text>
      </View>

      <View className="w-1/3 flex-row justify-end items-center pr-1">
        <Text className="font-extrabold text-sm text-white">
          {`${result}`}
        </Text>
        <Text className="mx-1.5 font-bold text-sm text-on-surface-variant">-</Text>
        <Text className="font-extrabold text-sm text-white">
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
          size={32}
          color="#A78B7D"
        />
        <Text className="text-lg font-bold text-on-surface-variant px-16 text-center mt-2">
          Parece que no hay registros recientes que mostrar...
        </Text>
      </View>
    );
  }

  return (
    <View className="p-4 shadow-sm w-full px-3">
      <Text className="text-white font-bold text-center mb-2 text-base">
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
