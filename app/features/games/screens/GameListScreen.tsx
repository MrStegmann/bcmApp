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

  const handlePlayGame = async (game: Game) => {
    try {
      setIsLoading(true);
      const roster = await import("../api").then((m) => m.getGameRoster(game.id));
      if (!roster || !roster.playerIds || roster.playerIds.length === 0) {
        showAlert({
          title: "Plantilla incompleta",
          message: "No has seleccionado la plantilla para este partido",
        });
        return;
      }
      navigation.navigate(AppRoutes.GamePlayMatch, { gameId: game.id });
    } catch (error) {
      // If it throws an error (e.g. 404 Not Found), it means no roster exists
      showAlert({
        title: "Plantilla incompleta",
        message: "No has seleccionado la plantilla para este partido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
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
            const borderColor = game.isPlayed ? (game.teamScore >= game.rivalScore ? "#10B981" : "#EF4444") : "#9CA3AF";

            return (
              <Pressable
                style={[styles.card, { borderLeftColor: borderColor }]}
                onPress={() => navigation.navigate(AppRoutes.GameDetail, { game })}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.gameRoundDateText}>{game.round}</Text>
                  <Text style={styles.gameRoundDateText}>{new Date(game.date).toLocaleDateString()}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.teamNamesText}>{teamName} vs {game.rival}</Text>
                  {game.isPlayed ? (
                    <>
                      <Text style={styles.scoreBigText}>{game.teamScore} - {game.rivalScore}</Text>
                      {game.periods && game.periods.length > 0 && (
                        <Text style={styles.gamePeriodsText}>
                          Parciales: {game.periods.map(p => `${p.teamScore}-${p.rivalScore}`).join(" | ")}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text style={styles.scoreUnplayedText}>No jugado</Text>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.footerActionGroup}>
                    <Pressable
                      style={styles.iconButton}
                      onPress={(e) => { e.stopPropagation(); navigation.navigate(AppRoutes.GameForm, { game }); }}
                    >
                      <Ionicons name="pencil" size={18} color="#4B5563" />
                    </Pressable>
                    <Pressable
                      disabled={deletingGameId === game.id}
                      style={[styles.iconButton, styles.iconButtonDelete]}
                      onPress={(e) => { e.stopPropagation(); handleDeleteGame(game); }}
                    >
                      {deletingGameId === game.id ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                      ) : (
                        <Ionicons name="trash" size={18} color="#EF4444" />
                      )}
                    </Pressable>
                  </View>

                  <View style={styles.footerActionGroup}>
                    <Pressable
                      style={styles.iconButton}
                      onPress={(e) => { e.stopPropagation(); navigation.navigate(AppRoutes.GameRoster, { gameId: game.id }); }}
                    >
                      <FontAwesome name="users" size={18} color="#4B5563" />
                    </Pressable>
                    <Pressable
                      disabled={isLoading}
                      style={[styles.iconButton, styles.iconButtonPlay]}
                      onPress={(e) => { e.stopPropagation(); handlePlayGame(game); }}
                    >
                      <Ionicons name="play" size={18} color="#FFF" />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />

        {/* Floating Action Button (FAB) */}
        <Pressable 
          style={styles.fab} 
          onPress={() => navigation.navigate(AppRoutes.GameForm)}
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export { GameListScreen };
