import React, { useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { MatchDetailViewProps } from "./types";
import { useMatchDetailStore } from "./store/useMatchDetailStore";
import { useMenuStore } from "../../store/MenuStore";
import { MatchSummaryHeader } from "./components/MatchSummaryHeader";
import { PeriodBreakdownTable } from "./components/PeriodBreakdownTable";
import { RosterValuationList } from "./components/RosterValuationList";
import { PlayerDetailModal } from "./components/PlayerDetailModal";
import { TeamAdvancedAnalytics } from "./components/TeamAdvancedAnalytics";
import { MatchEditModal } from "./components/MatchEditModal";
import { MatchShareModal } from "./components/MatchShareModal";

export const MatchDetailView: React.FC<MatchDetailViewProps> = ({
  match,
  onReturn,
  onMatchUpdated,
}) => {
  const {
    teamName,
    periods,
    players,
    advancedStats,
    selectedPlayer,
    isEditModalOpen,
    isShareModalOpen,
    isLoading,
    isSaving,
    initializeMatch,
    selectPlayer,
    openEditModal,
    closeEditModal,
    openShareModal,
    closeShareModal,
    saveMatchEdits,
  } = useMatchDetailStore();

  const setHeaderTitle = useMenuStore((state) => state.setHeaderTitle);
  const setHeaderAction = useMenuStore((state) => state.setHeaderAction);
  const setHeaderBackAction = useMenuStore((state) => state.setHeaderBackAction);
  const setMatchHeaderInfo = useMenuStore((state) => state.setMatchHeaderInfo);

  useEffect(() => {
    initializeMatch(match);
  }, [match.id]);

  // Bind global shared header actions (Volver, Detalles del Partido, Editar)
  useEffect(() => {
    setMatchHeaderInfo(null);
    setHeaderTitle("Detalles del Partido");

    setHeaderBackAction({
      label: "Volver",
      iconName: "arrow-left",
      iconFamily: "Feather",
      onPress: onReturn,
      testID: "header-back-button",
    });

    setHeaderAction({
      label: "Editar",
      iconName: "edit-2",
      iconFamily: "Feather",
      onPress: openEditModal,
      testID: "header-action-button",
    });
  }, [
    onReturn,
    openEditModal,
    setHeaderTitle,
    setHeaderBackAction,
    setHeaderAction,
    setMatchHeaderInfo,
  ]);

  // Clean up header state upon unmount
  useEffect(() => {
    return () => {
      setMatchHeaderInfo(null);
      setHeaderTitle("Partidos");
      setHeaderAction(null);
      setHeaderBackAction(null);
    };
  }, [
    setMatchHeaderInfo,
    setHeaderTitle,
    setHeaderAction,
    setHeaderBackAction,
  ]);

  const totalTeamScore = periods.reduce((sum, p) => sum + p.teamPoints, 0);
  const totalRivalScore = periods.reduce((sum, p) => sum + p.rivalPoints, 0);
  const totalTeamFouls = periods.reduce((sum, p) => sum + p.teamFouls, 0);
  const totalRivalFouls = periods.reduce((sum, p) => sum + p.rivalFouls, 0);

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  const handleSaveEdits = async (buffer: any) => {
    await saveMatchEdits(buffer);
    const updated = useMatchDetailStore.getState().match;
    if (updated && onMatchUpdated) {
      onMatchUpdated(updated);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <MatchSummaryHeader
        teamName={teamName}
        opponentName={match.opponent}
        totalTeamPoints={totalTeamScore}
        totalRivalPoints={totalRivalScore}
        date={match.date}
        status={match.status}
        onShareStats={openShareModal}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <PeriodBreakdownTable
          periods={periods}
          totalTeamPoints={totalTeamScore}
          totalRivalPoints={totalRivalScore}
          totalTeamFouls={totalTeamFouls}
          totalRivalFouls={totalRivalFouls}
        />

        <RosterValuationList
          players={players}
          onSelectPlayer={selectPlayer}
        />

        <TeamAdvancedAnalytics stats={advancedStats} />
      </ScrollView>

      <PlayerDetailModal
        visible={selectedPlayer !== null}
        player={selectedPlayer}
        onClose={() => selectPlayer(null)}
      />

      <MatchEditModal
        visible={isEditModalOpen}
        initialMatch={useMatchDetailStore.getState().match || match}
        initialPlayers={players}
        onSave={handleSaveEdits}
        onCancel={closeEditModal}
        isSaving={isSaving}
      />

      <MatchShareModal
        visible={isShareModalOpen}
        match={useMatchDetailStore.getState().match || match}
        teamName={teamName}
        periods={periods}
        players={players}
        advancedStats={advancedStats}
        onClose={closeShareModal}
      />
    </View>
  );
};
