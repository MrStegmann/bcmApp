import React, { useEffect, useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { AppRoutes, AppStackParamList } from "../../../navigation";
import { getPlayerStats } from "../api/playersApi";
import { PlayerStats } from "../types";
import { useAppAlert } from "../../../shared";
import { playerDetailScreenStyles as styles } from "../css/styles";

type PlayerDetailScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.PlayerDetail
>;

const formatDate = (value: Date | string | undefined) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toISOString().slice(0, 10);
};

const formatText = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "-";
};

const PlayerDetailScreen = ({ navigation, route }: PlayerDetailScreenProps) => {
  const { player } = route.params;
  const { showError } = useAppAlert();
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    const loadPlayerStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await getPlayerStats(player.id);
        setStats(response);
      } catch (error) {
        setStats([]);
        showError(
          "Error al cargar estadísticas",
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las estadísticas del jugador.",
        );
      } finally {
        setIsLoadingStats(false);
      }
    };

    void loadPlayerStats();
  }, [player.id]);

  const statsItems = useMemo(() => {
    return stats.map((item, index) => {
      const points = item.t1a + item.t2a * 2 + item.t3a * 3;

      return {
        id: item.matchId ?? `match-${index}`,
        matchLabel: item.matchId
          ? `Partido ${item.matchId}`
          : `Partido ${index + 1}`,
        minutes: item.minutes,
        points,
        fouls: item.falt,
        valuation: 12,
      };
    });
  }, [stats]);

  const totals = useMemo(() => {
    return stats.reduce(
      (acc, item) => {
        acc.minutes += item.minutes;
        acc.t1a += item.t1a;
        acc.t1i += item.t1i;
        acc.t2a += item.t2a;
        acc.t2i += item.t2i;
        acc.t3a += item.t3a;
        acc.t3i += item.t3i;
        acc.dreb += item.dreb;
        acc.oreb += item.oreb;
        acc.asis += item.asis;
        acc.rec += item.rec;
        acc.per += item.per;
        acc.falt += item.falt;

        acc.points += item.t1a + item.t2a * 2 + item.t3a * 3;
        acc.valuation += 12;

        return acc;
      },
      {
        minutes: 0,
        t1a: 0,
        t1i: 0,
        t2a: 0,
        t2i: 0,
        t3a: 0,
        t3i: 0,
        dreb: 0,
        oreb: 0,
        asis: 0,
        rec: 0,
        per: 0,
        falt: 0,
        points: 0,
        valuation: 0,
      },
    );
  }, [stats]);

  const statsContent = useMemo(() => {
    if (isLoadingStats) {
      return <ActivityIndicator style={styles.statsLoader} />;
    }

    if (statsItems.length === 0) {
      return (
        <Text style={styles.emptyStatsText}>
          No hay estadísticas disponibles para este jugador.
        </Text>
      );
    }

    return statsItems.map((item) => (
      <View key={item.id} style={styles.statsCard}>
        <Text style={styles.statsMatchTitle}>{item.matchLabel}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Minutos</Text>
          <Text style={styles.statsValue}>{item.minutes}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Puntos</Text>
          <Text style={styles.statsValue}>{item.points}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Faltas</Text>
          <Text style={styles.statsValue}>{item.fouls}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Valoración</Text>
          <Text style={styles.statsValue}>{item.valuation}</Text>
        </View>
      </View>
    ));
  }, [isLoadingStats, statsItems]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle de jugador</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{formatText(player.firstName)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Apellido</Text>
          <Text style={styles.value}>{formatText(player.lastName)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha de nacimiento</Text>
          <Text style={styles.value}>{formatDate(player.birthday)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nacionalidad</Text>
          <Text style={styles.value}>{formatText(player.nationality)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{formatText(player.phoneNumber)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{formatText(player.email)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dorsal</Text>
          <Text style={styles.value}>{player.jerseyNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nombre equipación</Text>
          <Text style={styles.value}>{formatText(player.jerseyName)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado</Text>
          <Text style={styles.value}>
            {player.isActive ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Estadísticas por partido</Text>

        <View style={styles.totalStatsCard}>
          <Text style={styles.totalStatsTitle}>Totales</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Minutos</Text>
            <Text style={styles.statsValue}>{totals.minutes}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Puntos</Text>
            <Text style={styles.statsValue}>{totals.points}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>T1 (A/I)</Text>
            <Text style={styles.statsValue}>
              {totals.t1a}/{totals.t1i}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>T2 (A/I)</Text>
            <Text style={styles.statsValue}>
              {totals.t2a}/{totals.t2i}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>T3 (A/I)</Text>
            <Text style={styles.statsValue}>
              {totals.t3a}/{totals.t3i}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Reb. Def.</Text>
            <Text style={styles.statsValue}>{totals.dreb}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Reb. Of.</Text>
            <Text style={styles.statsValue}>{totals.oreb}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Asistencias</Text>
            <Text style={styles.statsValue}>{totals.asis}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Recuperaciones</Text>
            <Text style={styles.statsValue}>{totals.rec}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Pérdidas</Text>
            <Text style={styles.statsValue}>{totals.per}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Faltas</Text>
            <Text style={styles.statsValue}>{totals.falt}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Valoración</Text>
            <Text style={styles.statsValue}>{totals.valuation}</Text>
          </View>
        </View>

        {statsContent}
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Volver</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export { PlayerDetailScreen };
