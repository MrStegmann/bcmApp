import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, FlatList } from "react-native-web";

const Cards = ({ game, onSelect, onEdit, onDelete, onPlay }) => {
  return (
    <TouchableOpacity
      key={game.id}
      onPress={() => onSelect(game)}
      className="my-2 active:shadow-inner shadow-danish-red bg-transparent z-10 hover:bg-danish-red active:bg-danish-red"
    >
      <View
        className={`w-full flex flex-row justify-between px-4 py-3 bg-danish-dark-gray rounded-xl shadow-lg  border ${game.total_result > game.total_result_opponent ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
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
              {game.total_result || 0} - {game.total_result_opponent || 0}
            </Text>
          </View>
        </View>

        <View className="w-[25%] flex flex-row justify-end items-center gap-3">
          {!game.played && (
            <TouchableOpacity color="blue" onPress={() => onPlay(game)}>
              <MaterialCommunityIcons
                name="whistle-outline"
                size={18}
                color="white"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity color="blue" onPress={() => onEdit(game)}>
            <Feather name="edit" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity color="white" onPress={() => onDelete(game)}>
            <Feather name="trash" size={18} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const GameCards = ({ games, onSelect, onEdit, onDelete, onPlay }) => {
  if (games.length === 0)
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray text-center px-2">
          Parece que no aún no has registrado ningún partido
        </Text>
      </View>
    );

  return (
    <View className="w-full h-full flex flex-col items-center">
      <FlatList
        data={games}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Cards
            game={item}
            onDelete={onDelete}
            onSelect={onSelect}
            onEdit={onEdit}
            onPlay={onPlay}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default GameCards;
