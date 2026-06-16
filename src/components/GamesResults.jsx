import React from "react";
import { View, Text, FlatList } from "react-native-web";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const CardGamesResults = ({ game }) => {
  return (
    <View
      className={`w-full my-1 px-2 py-3 flex flex-row justify-between items-center rounded-lg shadow-inner border-2 bg-danish-dark-gray ${game.total_result > game.total_result_opponent ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
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
          {`${game.total_result}`}
        </Text>
        <Text className="mx-2 font-bold text-sm text-danish-white">-</Text>
        <Text className="font-bold text-sm text-danish-white">
          {`${game.total_result_opponent}`}
        </Text>
      </View>
    </View>
  );
};

const GamesResults = React.memo(({ games }) => {
  return (
    <View className="p-4 shadow w-full px-3">
      <Text className="text-danish-white font-bold text-center mb-1">
        Resultado Ultimos partidos
      </Text>
      {games.length === 0 && (
        <View className="w-full flex flex-col justify-center items-center mt-20">
          <MaterialCommunityIcons
            name="book-open-blank-variant-outline"
            size={30}
            color="gray"
          />
          <Text className="text-lg text-center font-bold text-danish-light-gray px-16">
            Parece que no hay registros recientes que mostrar...
          </Text>
        </View>
      )}
      {games.length > 0 && (
        <View className="w-full h-96 flex flex-col">
          <FlatList
            scrollEnabled={false}
            data={games}
            renderItem={({ item }) => <CardGamesResults game={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
});

export default GamesResults;
