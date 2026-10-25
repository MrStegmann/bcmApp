import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useHomeViewStore } from "./store/useHomeViewStore";
import { NextMatchCard } from "./components/NextMatchCard";
import { RecentMatchesColumn } from "./components/RecentMatchesColumn";
import { GlobalStatsCard } from "./components/GlobalStatsCard";
import { HomeViewProps, NextMatchEntry } from "./types";
import RosterSelectionModal from "../../components/RosterSelectionModal";
import useDB from "../../hooks/useDB";
import { Player } from "../../types/database";

export const HomeView: React.FC<HomeViewProps> = ({
  teamId,
  onSelectMatch,
  onNavigateToGames,
}) => {
  const { PlayerController, GameController } = useDB();

  const {
    nextMatch,
    recentMatches,
    globalStats,
    allGames,
    isLoading,
    error,
    loadDashboard,
    refreshDashboard,
    saveRosterCallup,
  } = useHomeViewStore();

  const [refreshing, setRefreshing] = useState(false);

  // Roster modal states
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [activeMatchForRoster, setActiveMatchForRoster] = useState<NextMatchEntry | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  useEffect(() => {
    if (teamId) {
      loadDashboard(teamId);
      loadPlayers(teamId);
    }
  }, [teamId]);

  const loadPlayers = async (tId: number) => {
    try {
      const players = await PlayerController.getAll(tId);
      setAvailablePlayers(players || []);
    } catch {
      setAvailablePlayers([]);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshDashboard();
    if (teamId) {
      await loadPlayers(teamId);
    }
    setRefreshing(false);
  }, [refreshDashboard, teamId]);

  const handleOpenRosterModal = async (match: NextMatchEntry) => {
    setActiveMatchForRoster(match);
    try {
      const existingRoster = await GameController.getRoster(match.id);
      const existingIds = (existingRoster || []).map((r: any) => r.playerId || r.player_id);
      setSelectedPlayerIds(existingIds);
    } catch {
      setSelectedPlayerIds([]);
    }
    setIsRosterModalOpen(true);
  };

  const handleToggleRosterPlayer = (playerId: number) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : prev.length < 12
        ? [...prev, playerId]
        : prev
    );
  };

  const handleConfirmRoster = async (rosterIds: number[]) => {
    if (!activeMatchForRoster) return;
    try {
      await saveRosterCallup(activeMatchForRoster.id, rosterIds);
      setIsRosterModalOpen(false);
      setActiveMatchForRoster(null);
    } catch {
      // Error handled by store
    }
  };

  const handleCloseRosterModal = () => {
    setIsRosterModalOpen(false);
    setActiveMatchForRoster(null);
  };

  const handleSelectRecentMatch = (matchId: number) => {
    if (onSelectMatch) {
      const foundGame = allGames.find((g) => g.id === matchId);
      if (foundGame) {
        onSelectMatch(foundGame);
      }
    }
  };

  if (isLoading && !nextMatch && recentMatches.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-20 bg-surface">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-on-surface-variant text-sm mt-3 font-medium">
          Cargando panel del equipo...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="w-full flex-1 px-4 pt-3 pb-8 bg-surface"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#F97316"
          colors={["#F97316", "#0EA5E9"]}
        />
      }
    >
      {error ? (
        <View className="w-full bg-error-container/20 border border-court-red/50 rounded-xl p-3 mb-4">
          <Text className="text-on-error-container text-xs text-center">{error}</Text>
        </View>
      ) : null}

      {/* SECTION 1: Top Next Match Ahead Card */}
      <NextMatchCard
        nextMatch={nextMatch}
        onConfigureRoster={handleOpenRosterModal}
      />

      {/* SECTION 2: Middle Column of up to 3 Recent Matches */}
      <RecentMatchesColumn
        matches={recentMatches}
        onSelectMatch={handleSelectRecentMatch}
      />

      {/* SECTION 3: Bottom Advanced Stats Grid */}
      <GlobalStatsCard stats={globalStats} />

      {/* Roster Callup Configuration Modal */}
      <RosterSelectionModal
        visible={isRosterModalOpen}
        isMandatory={false}
        availablePlayers={availablePlayers}
        selectedPlayerIds={selectedPlayerIds}
        onTogglePlayer={handleToggleRosterPlayer}
        onConfirm={handleConfirmRoster}
        onClose={handleCloseRosterModal}
      />
    </ScrollView>
  );
};

export default HomeView;
