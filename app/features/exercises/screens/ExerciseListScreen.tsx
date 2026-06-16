import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppAlert } from "../../../shared/hooks/useAppAlert";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Exercise } from "../types";
import { deleteExercise, getExercises } from "../api";
import { getExercisesErrorMessage } from "../errors";
import { AppRoutes, AppStackParamList } from "../../../navigation";
import { usePlaygroundStore } from "../store/usePlaygroundStore";
import { ExerciseCard } from "../components/ExerciseCard";

type ExercisesListScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.Exercises
>;

const ExerciseListScreen = ({ navigation }: ExercisesListScreenProps) => {
  const { showAlert } = useAppAlert();
  const [exercises, setExercises] = useState<Exercise[]>([]); // Sustituir por estado real de la feature
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingExerciseId, setDeletingExerciseId] = useState<string | null>(
    null,
  ); // Sustituir por estado real de la feature
  const setIsEditing = usePlaygroundStore((state) => state.setIsEditing);

  const loadExercises = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Simulate loading data
      const data = await getExercises(); // Sustituir por llamada real a la API de la feature
      setExercises(data);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [loadExercises]),
  );

  const handleDeleteExercise = useCallback(
    (exercise: Exercise) => {
      showAlert({
        title: "Eliminar Exercise",
        message: `Esta accion eliminara a ${exercise.name}. ¿Deseas continuar?`,
        buttons: [
          {
            style: "cancel",
            text: "Cancelar",
          },
          {
            style: "destructive",
            text: "Eliminar",
            onPress: async () => {
              try {
                setDeletingExerciseId(exercise.id);
                await deleteExercise(exercise.id);
                await loadExercises(true);
              } catch (error) {
                showAlert({
                  title: "Error al eliminar",
                  message: getExercisesErrorMessage(
                    error,
                    "No se pudo eliminar el Exercise. Intentalo de nuevo.",
                  ),
                });
              } finally {
                setDeletingExerciseId(null);
              }
            },
          },
        ],
      });
    },
    [loadExercises],
  );

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-gray-50">
      <View className="flex-1 px-4 pt-4 md:px-8 md:pt-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Ejercicios</Text>
          <Pressable
            onPress={() => {
              setIsEditing(true)
              navigation.navigate(AppRoutes.ExerciseForm)
            }}
            className="bg-blue-600 rounded-lg px-4 py-2 active:opacity-80"
          >
            <Text className="text-white text-sm font-bold">Nuevo</Text>
          </Pressable>
        </View>

        <FlatList
          contentContainerClassName="flex-grow gap-3 pb-4"
          data={exercises}
          keyExtractor={(exercise) => exercise.id}
          onRefresh={() => loadExercises(true)}
          refreshing={isRefreshing}
          ListEmptyComponent={
            isLoading ? (
              <View className="flex-1 items-center justify-center py-8">
                <ActivityIndicator size="small" color="#0b5fff" />
                <Text className="text-gray-500 text-sm mt-2 text-center">Cargando...</Text>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500 text-sm mt-2 text-center">
                  No hay datos para mostrar.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              isDeleting={deletingExerciseId === item.id}
              onEdit={() => {
                navigation.navigate(AppRoutes.ExerciseForm, { exercise: item });
              }}
              onView={() => {
                navigation.navigate(AppRoutes.ExerciseDetail, { exercise: item });
              }}
              onDelete={() => handleDeleteExercise(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ExerciseListScreen;
