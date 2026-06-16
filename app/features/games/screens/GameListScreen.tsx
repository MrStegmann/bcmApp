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
import { Game } from "../types";
import { deleteGame, getGames } from "../api";
import { getGamesErrorMessage } from "../errors";
import { gameListScreenStyles as styles } from "../css/styles";
import { AppRoutes, AppStackParamList } from "../../../navigation/types";
import { useTeamStore } from "../../teams";
import { Ionicons, FontAwesome } from "@expo/vector-icons";


type GamesListScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.Games
>;

const GameListScreen = ({ navigation }: GamesListScreenProps) => {
  const { showAlert } = useAppAlert();
  const team = useTeamStore((state) => state.team);
  const teamName = team?.name || "Equipo";
  const [games, setGames] = useState<Game[]>([]); // Sustituir por estado real de la feature
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingGameId, setDeletingGameId] = useState<string | null>(null); // Sustituir por estado real de la feature

  const loadGames = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Simulate loading data
      const data = await getGames(); // Sustituir por llamada real a la API de la feature
      setGames(data);
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
      loadGames();
    }, [loadGames]),
  );

  const handleDeleteGame = useCallback(
    (game: Game) => {
      showAlert({
        title: "Eliminar partido",
        message: `Esta accion eliminara el partido ${game.round} contra ${game.rival}. ¿Deseas continuar?`,
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
                setDeletingGameId(game.id);
                await deleteGame(game.id);
                await loadGames(true);
              } catch (error) {
                showAlert({
                  title: "Error al eliminar",
                  message: getGamesErrorMessage(
                    error,
                    "No se pudo eliminar el partido. Intentalo de nuevo.",
                  ),
                });
              } finally {
                setDeletingGameId(null);
              }
            },
          },
        ],
      });
    },
    [loadGames],
  );

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.navigate(AppRoutes.GameForm)} style={styles.createButton}>
            <Text style={styles.createButtonText}>Nuevo</Text>
          </Pressable>
        </View>

        <FlatList
          contentContainerStyle={styles.listContainer}
          data={games}
          keyExtractor={(game) => game.id}
          onRefresh={() => loadGames(true)}
          refreshing={isRefreshing}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" color="#0b5fff" />
                <Text style={styles.emptyStateText}>Cargando...</Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No hay datos para mostrar.
                </Text>
              </View>
            )
          }
          renderItem={({ item: game }) => {
            const borderColor = game.isPlayed ? (game.teamScore < game.rivalScore ? "red" : "green") : "#E5E7EB";

            return (
              <View style={[styles.card, { borderColor }]}>
                <View style={styles.gameInfoColumn}>
                  <Text style={styles.gameHeader}>{game.round} - {new Date(game.date).toLocaleDateString()}</Text>
                  <Text style={styles.gameScoreText}>
                    {game.isPlayed
                      ? `${teamName} ${game.teamScore} - ${game.rivalScore} ${game.rival}`
                      : `${teamName} - No jugado - ${game.rival}`}
                  </Text>
                  {game.periods && game.periods.length > 0 ? (
                    <>
                      <Text style={styles.gamePeriodsText}>
                        {teamName} {game.periods.map(p => p.teamScore).join(" ")}
                      </Text>
                      <Text style={styles.gamePeriodsText}>
                        {game.periods.map(p => p.rivalScore).join(" ")} {game.rival}
                      </Text>
                    </>
                  ) : null}
                </View>

                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => {
                      navigation.navigate(AppRoutes.GameRoster, {
                        gameId: game.id,
                      });
                    }}
                    style={styles.startButton}
                  >
                    <FontAwesome name="users" size={16} color="black" />
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      navigation.navigate(AppRoutes.GameForm, {
                        game: game,
                      })
                    }
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={16} color="#111827" />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      navigation.navigate(AppRoutes.GameDetail, {
                        game: game,
                      });
                    }}
                    style={styles.viewButton}
                  >
                    <Ionicons name="eye" size={16} color="#ffffff" />
                  </Pressable>

                  <Pressable
                    disabled={deletingGameId === game.id}
                    onPress={() => handleDeleteGame(game)}
                    style={[
                      styles.deleteButton,
                      deletingGameId === game.id
                        ? styles.disabledDeleteButton
                        : null,
                    ]}
                  >
                    {deletingGameId === game.id ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Ionicons name="trash" size={16} color="#ffffff" />
                    )}
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export { GameListScreen };
