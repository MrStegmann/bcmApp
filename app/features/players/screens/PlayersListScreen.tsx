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
import { Player } from "../types";
import { deletePlayer, getPlayers } from "../api/playersApi";
import { useAppAlert } from "../../../shared/hooks/useAppAlert";
import { useTeamStore } from "../../teams";
import {
  getPlayersErrorMessage,
  PLAYER_ERRORS,
  PLAYER_ERROR_TITLES,
} from "../errors";
import { AppRoutes, AppStackParamList } from "../../../navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { playersListScreenStyles as styles } from "../css/styles";

type PlayersListScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.Players
>;

const PlayersListScreen = ({ navigation }: PlayersListScreenProps) => {
  const { showAlert, showError } = useAppAlert();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);
  const team = useTeamStore((state) => state.team);

  const loadPlayers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const data = await getPlayers(team?.id);
      setPlayers(data);
    } catch (error) {
      setPlayers([]);
      const errorMessage = getPlayersErrorMessage(
        error,
        PLAYER_ERRORS.LOAD_LIST_FALLBACK,
      );
      showError(PLAYER_ERROR_TITLES.LOAD_LIST, errorMessage);
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
      loadPlayers();
    }, [loadPlayers]),
  );

  const handleDeletePlayer = useCallback(
    (player: Player) => {
      showAlert({
        title: "Eliminar jugador",
        message: `Esta accion eliminara a ${player.firstName} ${player.lastName}. ¿Deseas continuar?`,
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
                setDeletingPlayerId(player.id);
                await deletePlayer(player.id);
                await loadPlayers(true);
              } catch (error) {
                showAlert({
                  title: PLAYER_ERROR_TITLES.DELETE,
                  message: getPlayersErrorMessage(
                    error,
                    PLAYER_ERRORS.DELETE_FALLBACK,
                  ),
                });
              } finally {
                setDeletingPlayerId(null);
              }
            },
          },
        ],
      });
    },
    [loadPlayers, showAlert],
  );

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text>Lista de jugadores</Text>
          <Pressable
            onPress={() => navigation.navigate(AppRoutes.PlayerForm)}
            style={styles.createButton}
          >
            <Text style={styles.createButtonText}>Nuevo Jugador</Text>
          </Pressable>
        </View>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={players}
          keyExtractor={(_, idx) => idx.toString()}
          refreshing={isRefreshing}
          onRefresh={() => loadPlayers(true)}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>
                #{item.jerseyNumber}{" "}
                {item.jerseyName
                  ? item.jerseyName
                  : `${item.firstName} ${item.lastName}`}
              </Text>
              <Text style={styles.itemSubText}>
                {item.isActive ? "Activo" : "Inactivo"}
              </Text>
              <View style={styles.actions}>
                <Pressable
                  onPress={() =>
                    navigation.navigate(AppRoutes.PlayerDetail, {
                      player: item,
                    })
                  }
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>Ver</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    navigation.navigate(AppRoutes.PlayerForm, {
                      player: item,
                    })
                  }
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>Editar</Text>
                </Pressable>
                <Pressable
                  disabled={deletingPlayerId === item.id}
                  onPress={() => handleDeletePlayer(item)}
                  style={[
                    styles.deleteButton,
                    deletingPlayerId === item.id
                      ? styles.disabledDeleteButton
                      : null,
                  ]}
                >
                  <Text style={styles.deleteButtonText}>
                    {deletingPlayerId === item.id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator style={{ marginTop: 32 }} />
            ) : (
              <Text style={styles.emptyText}>No hay jugadores.</Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export { PlayersListScreen };
