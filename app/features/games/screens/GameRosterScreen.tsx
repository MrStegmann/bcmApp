import React, { useCallback, useEffect, useState } from "react";
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
import { useAppAlert } from "../../../shared/hooks/useAppAlert";
import { useTeamStore } from "../../teams";
import { getPlayers, getPlayerStats } from "../../players/api/playersApi";
import { Player, PlayerStats } from "../../players/types";
import { createGameRoster, getGameRoster, updateGameRoster } from "../api/gameApi";
import { GameRoster } from "../types";
import { gameRosterScreenStyles as styles } from "../css/styles";
import { Ionicons } from "@expo/vector-icons";

type GameRosterScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.GameRoster
>;

type PlayerWithStats = Player & {
  totalMinutes: number;
  totalPoints: number;
  avgValue: string;
};

const GameRosterScreen = ({ route, navigation }: GameRosterScreenProps) => {
  const { gameId } = route.params;
  const { showAlert } = useAppAlert();
  const team = useTeamStore((state) => state.team);

  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [roster, setRoster] = useState<GameRoster | null>(null);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const calculateStats = (statsList: PlayerStats[]) => {
    let points = 0;
    let rebounds = 0;
    let assists = 0;
    let steals = 0;
    let missed = 0;
    let turnovers = 0;
    let fouls = 0;
    let totalMinutes = 0;

    statsList.forEach((s) => {
      points += s.t1a + s.t2a * 2 + s.t3a * 3;
      rebounds += s.dreb + s.oreb;
      assists += s.asis;
      steals += s.rec;
      missed += (s.t1i - s.t1a) + (s.t2i - s.t2a) + (s.t3i - s.t3a);
      turnovers += s.per;
      fouls += s.falt;
      totalMinutes += s.minutes;
    });

    const eff = points + rebounds + assists + steals - (missed + turnovers + fouls);
    const avgValue = statsList.length > 0 ? (eff / statsList.length).toFixed(1) : "0";

    return { totalMinutes, totalPoints: points, avgValue };
  };

  const loadData = useCallback(async () => {
    if (!team) return;
    setIsLoading(true);
    try {
      const fetchedPlayers = await getPlayers(team.id);
      const activePlayers = fetchedPlayers.filter(p => p.isActive);

      let currentRoster: GameRoster | null = null;
      try {
        currentRoster = await getGameRoster(gameId);
        setRoster(currentRoster);
        const rosterPlayerIds = currentRoster.playerIds.map(p => p);
        setSelectedPlayerIds(new Set(rosterPlayerIds));
      } catch (error) {
        console.log("No roster exists yet or error fetching:", error);
      }

      const statsPromises = activePlayers.map(p => getPlayerStats(p.id).catch(() => [] as PlayerStats[]));
      const statsResults = await Promise.all(statsPromises);

      const playersWithStats = activePlayers.map((player, index) => {
        const stats = calculateStats(statsResults[index]);
        return {
          ...player,
          ...stats,
        };
      });

      setPlayers(playersWithStats);
    } catch (error) {
      showAlert({
        title: "Error",
        message: "No se pudieron cargar los datos.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
      } else {
        next.add(playerId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!team) return;
    setIsSaving(true);
    try {
      const selectedPlayersList = players.filter(p => selectedPlayerIds.has(p.id));
      if (roster && roster.id) {
        await updateGameRoster(roster.id, { playerIds: selectedPlayersList.map(p => p.id) });
      } else {
        await createGameRoster(gameId, { playerIds: selectedPlayersList.map(p => p.id) });
      }
      showAlert({
        title: "Éxito",
        message: "El roster del partido se ha guardado correctamente.",
      });
      navigation.goBack();
    } catch (error) {
      showAlert({
        title: "Error",
        message: "Ocurrió un error al guardar el roster.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderItem = ({ item }: { item: PlayerWithStats }) => {
    const isSelected = selectedPlayerIds.has(item.id);
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          isSelected && styles.cardSelected,
          pressed ? { opacity: 0.8 } : null
        ]}
        onPress={() => togglePlayer(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`Seleccionar jugador ${item.firstName} ${item.lastName}`}
        accessibilityHint={isSelected ? "Quitar jugador del roster" : "Añadir jugador al roster"}
      >
        <View style={styles.checkboxContainer}>
          <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={24}
            color={isSelected ? "#2563EB" : "#9CA3AF"}
          />
        </View>
        <View style={styles.playerInfoContainer}>
          <Text style={styles.playerHeader}>
            #{item.jerseyNumber} {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.playerStats}>
            Min: {item.totalMinutes} | Pts: {item.totalPoints} | Val: {item.avgValue}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.emptyStateText}>Cargando jugadores...</Text>
          </View>
        ) : (
          <>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle} accessibilityRole="header">Roster</Text>
              <Text
                style={styles.headerSubtitle}
                accessibilityRole="text"
                accessibilityLabel={`${selectedPlayerIds.size} jugadores seleccionados`}
              >
                {selectedPlayerIds.size} {selectedPlayerIds.size === 1 ? 'Seleccionado' : 'Seleccionados'}
              </Text>
            </View>

            <FlatList
              data={players}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyState} accessibilityRole="alert">
                  <Text style={styles.emptyStateText}>
                    No hay jugadores activos en el equipo.
                  </Text>
                </View>
              }
            />
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                isSaving ? { opacity: 0.7 } : null,
                pressed && !isSaving ? { opacity: 0.8 } : null
              ]}
              onPress={handleSave}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityLabel="Guardar cambios del roster"
              accessibilityState={{ disabled: isSaving }}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar Roster</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export { GameRosterScreen };
