import React, { useState } from "react";
import { Pressable, Text, View, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppRoutes, AppStackParamList } from "../../../navigation";
import { ExercisePreview } from "../components/ExercisePreview";
import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "../types";

type ExerciseDetailScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.ExerciseDetail
>;

const getExerciseTags = (exercise: Exercise): string[] => [
  ...(exercise.category ?? []),
  ...(exercise.type ?? []),
  ...(exercise.gamePhase ?? []),
  ...(exercise.activities ?? []),
];

const ExerciseDetailScreen = ({
  navigation,
  route,
}: ExerciseDetailScreenProps) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const exercise = route.params.exercise;
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const totalScenes = exercise.coachBoard ? exercise.coachBoard.length : 0;
  const currentBoard = totalScenes > 0 ? exercise.coachBoard![currentSceneIndex] : undefined;

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) setCurrentSceneIndex(prev => prev - 1);
  };

  const handleNextScene = () => {
    if (currentSceneIndex < totalScenes - 1) setCurrentSceneIndex(prev => prev + 1);
  };

  const tags = getExerciseTags(exercise);

  // Maximum width for the court so it doesn't overflow horizontally
  const maxWidth = SCREEN_WIDTH - 32;
  // Maximum height so it doesn't overflow vertically if the screen is short
  // Leaving space for topbar, scene controls, and bottom sheet header
  const maxAvailableHeight = SCREEN_HEIGHT - 250;

  let previewWidth = maxWidth;
  let previewHeight = (previewWidth * 540) / 384;

  if (previewHeight > maxAvailableHeight) {
    previewHeight = maxAvailableHeight;
    previewWidth = (previewHeight * 384) / 540;
  }

  return (
    <SafeAreaView edges={["left", "right", "top"]} className="flex-1 bg-gray-50 items-center">
      <View className="flex-1 px-4 items-center w-full md:w-[600px] lg:w-[800px]">
        {/* Scene Navigation */}
        <View className="flex-row items-center justify-between w-full bg-white rounded-xl py-2 px-4 mb-4 shadow-sm border border-gray-100">
          <Pressable
            onPress={handlePrevScene}
            disabled={currentSceneIndex === 0}
            className={`p-2 ${currentSceneIndex === 0 ? "opacity-50" : ""}`}
          >
            <Ionicons name="chevron-back" size={24} color={currentSceneIndex === 0 ? "#9CA3AF" : "#111827"} />
          </Pressable>

          <Text className="text-base font-bold text-gray-900">
            Escena {currentSceneIndex + 1} / {totalScenes || 1}
          </Text>

          <Pressable
            onPress={handleNextScene}
            disabled={currentSceneIndex >= totalScenes - 1}
            className={`p-2 ${currentSceneIndex >= totalScenes - 1 ? "opacity-50" : ""}`}
          >
            <Ionicons name="chevron-forward" size={24} color={currentSceneIndex >= totalScenes - 1 ? "#9CA3AF" : "#111827"} />
          </Pressable>
        </View>

        {/* Scene Preview */}
        <View className="shadow-sm items-center">
          <ExercisePreview
            exercise={exercise}
            board={currentBoard}
            containerWidth={previewWidth}
            containerHeight={previewHeight}
          />
        </View>
      </View>

      {/* Collapsible Bottom Sheet */}
      <View className="bg-white rounded-t-3xl shadow-lg border-t border-gray-200 max-h-[60%] w-full md:w-[600px] lg:w-[800px] absolute bottom-0 self-center">
        <TouchableOpacity
          className="flex-row justify-between items-center px-5 py-4"
          onPress={() => setIsDetailsExpanded(!isDetailsExpanded)}
          activeOpacity={0.7}
        >
          <Text className="text-lg font-bold text-gray-900 flex-1 mr-4" numberOfLines={1}>{exercise.name}</Text>
          <Ionicons
            name={isDetailsExpanded ? "chevron-down" : "chevron-up"}
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>

        {isDetailsExpanded && (
          <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Tags */}
            <View className="flex-row flex-wrap gap-2 mt-2">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <View key={`${exercise.id}-${tag}-${index}`} className="bg-indigo-50 rounded-full px-2.5 py-1.5">
                    <Text className="text-indigo-800 text-xs font-semibold">#{tag}</Text>
                  </View>
                ))
              ) : (
                <View className="bg-indigo-50 rounded-full px-2.5 py-1.5">
                  <Text className="text-indigo-800 text-xs font-semibold">#sin-tags</Text>
                </View>
              )}
            </View>

            <View className="mt-4">
              <Text className="text-base font-bold text-gray-700 mb-2">Descripción</Text>
              <Text className="text-sm text-gray-600 leading-5">{exercise.description?.trim() || "Sin descripción"}</Text>
            </View>

            {exercise.alternatives ? (
              <View className="mt-4">
                <Text className="text-base font-bold text-gray-700 mb-2">Alternativas</Text>
                <Text className="text-sm text-gray-600 leading-5">{exercise.alternatives.trim()}</Text>
              </View>
            ) : null}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export { ExerciseDetailScreen };
