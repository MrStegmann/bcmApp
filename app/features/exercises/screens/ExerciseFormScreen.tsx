import React from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppRoutes, AppStackParamList } from "../../../navigation";
import { Playground } from "../components/Playground";
import { Toolbar } from "../components/Toolbar";
import { PlayGroundOptions } from "../components/PlayGroundOptions";
import { usePlaygroundStore } from "../store/usePlaygroundStore";
import { useFocusEffect } from "@react-navigation/native";

type ExercisesListScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.ExerciseForm
>;

const ExerciseFormScreen = ({
  navigation,
  route,
}: ExercisesListScreenProps) => {
  const setInitialExercise = usePlaygroundStore((state) => state.setInitialExercise);

  useFocusEffect(
    React.useCallback(() => {
      // Set initial data based on navigation params when screen is focused
      setInitialExercise(route.params?.exercise);

      return () => {
        // Clear when leaving the screen
        setInitialExercise(undefined);
      };
    }, [route.params?.exercise, setInitialExercise])
  );

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Playground />
      </View>
      <View className="h-[120px]">
        <Toolbar />
      </View>
      <PlayGroundOptions />
    </View>
  );
};

export { ExerciseFormScreen };
