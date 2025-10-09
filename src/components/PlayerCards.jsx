import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { timeFormat } from "../helpers/timeFormat";

const PlayerCards = React.memo(({ players, onSelect, onEdit, onDelete }) => {
  return (
    <View className="w-full h-full flex flex-col items-center mb-20">
      {players.length === 0 ? (
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
      ) : (
        players.map((player) => {
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
                        {`${timeFormat(player.total_minutes) || 0}`}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Pts</Text>
                      <Text className="text-danish-white text-sm">
                        {player.total_pts || 0}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Falt</Text>
                      <Text className="text-danish-white text-sm">
                        {`${player.total_falt || 0}`}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Val</Text>
                      <Text className="text-danish-white text-sm">
                        {player.total_val || 0}
                      </Text>
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
        })
      )}
    </View>
  );
});

export default PlayerCards;
