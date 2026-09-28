import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

interface GameCardsProps {
  games: any[];
  onSelect: (game: any) => void;
  onEdit: (game: any) => void;
  onDelete: (game: any) => void;
}

const GameCards: React.FC<GameCardsProps> = ({
  games = [],
  onSelect,
  onEdit,
  onDelete,
}) => {
  if (games.length === 0) {
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray text-center px-2">
          Parece que aún no has registrado ningún partido
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        {games.map((game) => {
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
            <TouchableOpacity
              key={game.id}
              onPress={() => onSelect(game)}
              className="my-2 active:shadow-inner shadow-danish-red bg-transparent z-10 hover:bg-danish-red active:bg-danish-red"
            >
              <View
                className={`w-full flex flex-row justify-between px-4 py-3 bg-danish-dark-gray rounded-xl shadow-lg border ${result > resultOpponent ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
              >
                <View className="w-[75%] flex flex-row justify-between items-center">
                  <View className="flex flex-col">
                    <Text className="text-xs text-danish-white text-center">
                      Jornada {game.round}
                    </Text>
                    <Text className="text-xs text-danish-white text-center">
                      {game.date}
                    </Text>
                  </View>
                  <View className="flex flex-col">
                    <Text className="text-xs text-danish-white text-center">
                      {game.opponent}
                    </Text>
                  </View>
                  <View className="flex flex-col">
                    <Text className="text-xs text-danish-white text-center">
                      {result} - {resultOpponent}
                    </Text>
                  </View>
                </View>

                <View className="w-[25%] flex flex-row justify-end items-center gap-3">
                  <TouchableOpacity onPress={() => onEdit(game)}>
                    <Feather name="edit" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDelete(game)}>
                    <Feather name="trash" size={18} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default GameCards;
