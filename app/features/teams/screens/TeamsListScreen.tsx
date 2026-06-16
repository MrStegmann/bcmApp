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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppRoutes, AppStackParamList } from "../../../navigation/types";
import { useAppAlert } from "../../../shared";
import { Team } from "../types";
import { useTeamStore } from "../store/teamStore";
import { deleteTeam, getTeams } from "../api";
import { getTeamsErrorMessage } from "../errors/TeamErrors";
import { teamsListScreenStyles as styles } from "../css/styles";

type TeamsListScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.Teams
>;

const TeamsListScreen = ({ navigation }: TeamsListScreenProps) => {
  const { setTeam } = useTeamStore();
  const { showAlert } = useAppAlert();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadTeams = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const teamsResponse = await getTeams();
      setTeams(teamsResponse);
      setErrorMessage(null);
    } catch (error) {
      console.warn("No se pudo obtener la lista de equipos", error);
      setErrorMessage(
        getTeamsErrorMessage(error, "No se pudo cargar la lista de equipos."),
      );
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
      loadTeams();
    }, [loadTeams]),
  );

  const handleDeleteTeam = useCallback(
    (team: Team) => {
      showAlert({
        title: "Eliminar equipo",
        message: `Esta accion eliminara a ${team.name}. ¿Deseas continuar?`,
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
                setDeletingTeamId(team.id);
                await deleteTeam(team.id);
                await loadTeams(true);
              } catch (error) {
                console.warn("No se pudo eliminar el equipo", error);
                showAlert({
                  title: "Error",
                  message: getTeamsErrorMessage(
                    error,
                    "No se pudo eliminar el equipo. Intentalo de nuevo.",
                  ),
                });
              } finally {
                setDeletingTeamId(null);
              }
            },
          },
        ],
      });
    },
    [loadTeams, showAlert],
  );

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.navigate(AppRoutes.TeamForm)}
            style={styles.createButton}
          >
            <Text style={styles.createButtonText}>Nuevo</Text>
          </Pressable>
        </View>

        <FlatList
          contentContainerStyle={styles.listContainer}
          data={teams}
          keyExtractor={(item) => item.id}
          onRefresh={() => loadTeams(true)}
          refreshing={isRefreshing}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" color="#0b5fff" />
                <Text style={styles.emptyStateText}>Cargando equipos...</Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {errorMessage ?? "No hay equipos para mostrar."}
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
              </View>

              <View style={styles.cardActions}>
                <Pressable
                  onPress={() =>
                    navigation.navigate(AppRoutes.TeamForm, {
                      team: item,
                    })
                  }
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setTeam(item);
                  }}
                  style={styles.viewButton}
                >
                  <Text style={styles.viewButtonText}>Ver</Text>
                </Pressable>

                <Pressable
                  disabled={deletingTeamId === item.id}
                  onPress={() => handleDeleteTeam(item)}
                  style={[
                    styles.deleteButton,
                    deletingTeamId === item.id
                      ? styles.disabledDeleteButton
                      : null,
                  ]}
                >
                  <Text style={styles.deleteButtonText}>
                    {deletingTeamId === item.id ? "Eliminando..." : "Eliminar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export { TeamsListScreen };
