import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Feather } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import React from "react";

const TraningCards = React.memo(({ trainings, onSelect, onEdit, onDelete }) => {
  if (trainings.length === 0)
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray text-center">
          Parece que no aún no has registrado ningún entrenamiento
        </Text>
      </View>
    );

  return (
    <View className="w-full h-full flex flex-col items-center">
      <FlatList
        data={trainings}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item)}
            className="my-2 active:shadow-inner shadow-danish-red bg-transparent z-10 hover:bg-danish-red active:bg-danish-red"
          >
            <View className="w-full flex flex-row justify-between px-4 py-3 bg-danish-dark-gray rounded-xl shadow-lg shadow-danish-red border border-danish-red">
              <View className="w-2/3 flex flex-col">
                <Text className="text-danish-white text-sm">
                  Sesión {item.training_number} - {item.date}
                </Text>
              </View>

              <View className="w-1/3 flex flex-row justify-end items-center gap-3">
                <TouchableOpacity color="blue" onPress={() => onEdit(item)}>
                  <Feather name="edit" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity color="white" onPress={() => onDelete(item)}>
                  <Feather name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
});

export default TraningCards;
