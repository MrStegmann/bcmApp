import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Exercise } from "../types";
import { ExercisePreview } from "./ExercisePreview";

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const getExerciseTags = (exercise: Exercise): string[] => [
  ...(exercise.category ?? []),
  ...(exercise.type ?? []),
  ...(exercise.gamePhase ?? []),
  ...(exercise.activities ?? []),
];

export const ExerciseCard = ({ exercise, onEdit, onView, onDelete, isDeleting }: ExerciseCardProps) => {
  const tags = getExerciseTags(exercise);

  return (
    <View className="bg-white border border-gray-200 rounded-xl mb-4 p-3 shadow-sm">
      {/* Primera fila: Info y Preview adaptables */}
      <View className="flex-col md:flex-row justify-between md:items-stretch mb-3 gap-4 md:min-h-[150px]">
        {/* Info y Preview en row para tablet, col para movil */}
        <View className="flex-col lg:flex-row flex-1 gap-4">
          <View className="flex-1 lg:pr-2 justify-start">
            <Text className="text-gray-900 text-base font-bold mb-1" numberOfLines={2}>{exercise.name}</Text>
            <Text className="text-gray-600 text-sm" numberOfLines={3}>
              {exercise.description?.trim() || "Sin descripción"}
            </Text>
          </View>

          <View className="w-full lg:w-[250px] flex justify-center items-center py-2 lg:py-0">
            <ExercisePreview exercise={exercise} containerWidth={200} containerHeight={140} />
          </View>
        </View>

        {/* Acciones: en móvil row, en tablet/desktop col */}
        <View className="flex-row md:flex-col justify-between md:pl-3 md:border-l md:border-gray-100 gap-2 md:w-20">
          <Pressable onPress={onEdit} className="flex-1 md:flex-none border border-gray-300 rounded-lg py-2 items-center active:opacity-80">
            <Text className="text-gray-900 text-xs font-semibold">Editar</Text>
          </Pressable>

          <Pressable onPress={onView} className="flex-1 md:flex-none bg-gray-900 rounded-lg py-2 items-center active:opacity-80">
            <Text className="text-white text-xs font-semibold">Ver</Text>
          </Pressable>

          <Pressable
            disabled={isDeleting}
            onPress={onDelete}
            className={`flex-1 md:flex-none rounded-lg py-2 items-center active:opacity-80 ${isDeleting ? "bg-red-400" : "bg-red-600"}`}
          >
            <Text className="text-white text-xs font-semibold">
              {isDeleting ? "..." : "Eliminar"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Segunda fila: Tags */}
      <View className="border-t border-gray-100 pt-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="flex-row gap-2 items-center">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <View key={`${exercise.id}-${tag}-${index}`} className="bg-indigo-50 rounded-full px-2.5 py-1">
                <Text className="text-indigo-800 text-[11px] font-semibold">#{tag}</Text>
              </View>
            ))
          ) : (
            <View className="bg-indigo-50 rounded-full px-2.5 py-1">
              <Text className="text-indigo-800 text-[11px] font-semibold">#sin-tags</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

