import React, { useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator, Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppRoutes, AppStackParamList } from "../../../navigation/types";
import { gamePlayMatchStyles as styles } from "../css/styles";
import { Ionicons } from "@expo/vector-icons";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { useNavigationStore } from "../../../shared/hooks/useNavigationStore";

import { useGamePlayMatch } from "../hooks/useGamePlayMatch";
import { GameHeader } from "../components/GameHeader";
import { GameBench } from "../components/GameBench";
import { GameCourt } from "../components/GameCourt";
import { GameStatsToolbar } from "../components/GameStatsToolbar";
import { StartingFiveModal } from "../components/modals/StartingFiveModal";
import { ShotActionModal } from "../components/modals/ShotActionModal";
import { PlayerStatsModal } from "../components/modals/PlayerStatsModal";
import { RivalActionModal } from "../components/modals/RivalActionModal";
import { HelpInfoModal } from "../components/modals/HelpInfoModal";

type GamePlayMatchProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.GamePlayMatch
>;

export const GamePlayMatchScreen = ({ route }: GamePlayMatchProps) => {
  const { gameId } = route.params;
  const { goBack } = useAppNavigation();
  const setNavVisible = useNavigationStore((state) => state.setNavVisible);

  const gameState = useGamePlayMatch(gameId);

  useFocusEffect(
    useCallback(() => {
      setNavVisible(false);
      return () => setNavVisible(true);
    }, [])
  );

  if (gameState.isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  const teamName = gameState.team?.name || "Equipo";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
      <View style={styles.container}>
        {/* Floating Help Button */}
        <Pressable
          style={{
            position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 16,
            backgroundColor: gameState.isHelpModeActive ? "#EF4444" : "rgba(31, 41, 55, 0.7)",
            borderWidth: 1, borderColor: gameState.isHelpModeActive ? "#DC2626" : "#3B82F6",
            justifyContent: "center", alignItems: "center", zIndex: 200,
          }}
          onPress={() => gameState.setIsHelpModeActive(!gameState.isHelpModeActive)}
        >
          <Ionicons name={gameState.isHelpModeActive ? "close" : "information"} size={18} color={gameState.isHelpModeActive ? "#FFF" : "#3B82F6"} />
        </Pressable>



        <GameHeader
          teamName={teamName}
          matchState={gameState.matchState}
          isTimerRunning={gameState.isTimerRunning}
          setIsTimerRunning={gameState.setIsTimerRunning}
          updateState={gameState.updateState}
          showToast={gameState.showToast}
          setIsRivalModalVisible={gameState.setIsRivalModalVisible}
          goBack={goBack}
          isHelpModeActive={gameState.isHelpModeActive}
          setActiveHelpItem={gameState.setActiveHelpItem}
        />

        <GameBench
          matchState={gameState.matchState}
          updateState={gameState.updateState}
          setIsTimerRunning={gameState.setIsTimerRunning}
          isSubMode={gameState.isSubMode}
          setIsSubMode={gameState.setIsSubMode}
          subsIn={gameState.subsIn}
          setSubsIn={gameState.setSubsIn}
          subsOut={gameState.subsOut}
          setSubsOut={gameState.setSubsOut}
          setTempStartingFive={gameState.setTempStartingFive}
          setIsModalVisible={gameState.setIsModalVisible}
          selectedPlayerId={gameState.selectedPlayerId}
          setSelectedPlayerId={gameState.setSelectedPlayerId}
          setIsStatsModalVisible={gameState.setIsStatsModalVisible}
          showToast={gameState.showToast}
          benchPlayers={gameState.benchPlayers}
          handlePlayerTap={gameState.handlePlayerTap}
          isHelpModeActive={gameState.isHelpModeActive}
          setActiveHelpItem={gameState.setActiveHelpItem}
        />

        <GameCourt
          courtPlayers={gameState.courtPlayers}
          isSubMode={gameState.isSubMode}
          subsOut={gameState.subsOut}
          selectedPlayerId={gameState.selectedPlayerId}
          handlePlayerTap={gameState.handlePlayerTap}
          isHelpModeActive={gameState.isHelpModeActive}
          setActiveHelpItem={gameState.setActiveHelpItem}
        />

        <GameStatsToolbar
          selectedPlayerId={gameState.selectedPlayerId}
          setSelectedPlayerId={gameState.setSelectedPlayerId}
          handleShotBtn={gameState.handleShotBtn}
          updatePlayerStat={gameState.updatePlayerStat}
          isHelpModeActive={gameState.isHelpModeActive}
          setActiveHelpItem={gameState.setActiveHelpItem}
        />

        <StartingFiveModal
          isModalVisible={gameState.isModalVisible}
          setIsModalVisible={gameState.setIsModalVisible}
          sortedRoster={gameState.sortedRoster}
          tempStartingFive={gameState.tempStartingFive}
          setTempStartingFive={gameState.setTempStartingFive}
          updateState={gameState.updateState}
        />

        <ShotActionModal
          shotModal={gameState.shotModal}
          handleShotOutcome={gameState.handleShotOutcome}
          handleAssist={gameState.handleAssist}
          courtPlayers={gameState.courtPlayers}
        />

        <PlayerStatsModal
          isStatsModalVisible={gameState.isStatsModalVisible}
          setIsStatsModalVisible={gameState.setIsStatsModalVisible}
          selectedPlayerId={gameState.selectedPlayerId}
          matchState={gameState.matchState}
        />

        <RivalActionModal
          isRivalModalVisible={gameState.isRivalModalVisible}
          setIsRivalModalVisible={gameState.setIsRivalModalVisible}
          handleRivalScore={gameState.handleRivalScore}
          handleRivalFoul={gameState.handleRivalFoul}
        />

        <HelpInfoModal
          activeHelpItem={gameState.activeHelpItem}
          setActiveHelpItem={gameState.setActiveHelpItem}
        />

        {gameState.toastMessage && (
          <Animated.View style={[styles.toastContainer, { opacity: gameState.toastOpacity }]}>
            <Ionicons name="alert-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.toastText}>{gameState.toastMessage}</Text>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};
