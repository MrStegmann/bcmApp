import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Feather } from "@expo/vector-icons";

const PlayerCards = ({ players, onSelect, onEdit, onDelete }) => {
  if (players.length === 0)
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray text-center">
          Parece que no aún no has registrado ningún jugador
        </Text>
      </View>
    );

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        {players.map((player) => {
          const pts =
            player.total_t1a + player.total_t2a * 2 + player.total_t3a * 3;
          const val =
            Number(player.total_t2a) +
            Number(player.total_t3a) +
            Number(player.total_t1a) +
            (Number(player.total_dreb) + Number(player.total_oreb)) +
            Number(player.total_asis) +
            Number(player.total_rec) -
            Number(player.total_per) -
            Number(player.total_falt) -
            (Number(player.total_t2i) - Number(player.total_t2a)) -
            (Number(player.total_t3i) - Number(player.total_t3a)) -
            (Number(player.total_t1i) - Number(player.total_t1a));
          return (
            <TouchableOpacity
              key={player.id}
              onPress={() => onSelect(player)}
              className="my-2 active:shadow-inner shadow-danish-red bg-transparent z-10 hover:bg-danish-red active:bg-danish-red"
            >
              <View className="w-full flex flex-row justify-between px-4 py-3 bg-danish-dark-gray rounded-xl shadow-lg shadow-danish-red border border-danish-red">
                <View className="w-2/3 flex flex-col">
                  <Text className="text-danish-white text-sm">
                    {player.number +
                      " - " +
                      player.first_name +
                      " " +
                      player.last_name}
                  </Text>
                  <View className="w-full flex flex-row justify-between mt-1">
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Mins</Text>
                      <Text className="text-danish-white text-sm">
                        {player.total_minutes}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Pts</Text>
                      <Text className="text-danish-white text-sm">{pts}</Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Falt</Text>
                      <Text className="text-danish-white text-sm">
                        {player.total_falt}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Val</Text>
                      <Text className="text-danish-white text-sm">{val}</Text>
                    </View>
                  </View>
                </View>

                <View className="w-1/3 flex flex-row justify-end items-center gap-3">
                  <TouchableOpacity color="blue" onPress={() => onEdit(player)}>
                    <Feather name="edit" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    color="white"
                    onPress={() => onDelete(player)}
                  >
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

export default PlayerCards;
