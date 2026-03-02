import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const ExerciseItem = ({ exercise, onSelect, onDelete, onEdit }) => {
  return (
    <View className="w-full p-4 border border-gray-300 rounded-lg mb-2 flex flex-row justify-between items-center">
      <View className="w-1/3 flex flex-col justify-center items-center">
        <Text className="text-lg font-semibold">{exercise.title}</Text>

        <View className="flex flex-row gap-2">
          <TouchableOpacity
            onPress={onSelect}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            <Text className="text-white">Select</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onEdit}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            <Text className="text-white">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 px-3 py-1 rounded"
            onPress={onDelete}
          >
            <Text className="text-white">Del</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-1/2">
        {exercise.halfCourt ? (
          <Text className="text-sm">Media cancha</Text>
        ) : (
          <Text className="text-sm">Cancha completa</Text>
        )}
      </View>
    </View>
  );
};

export default ExerciseItem;
