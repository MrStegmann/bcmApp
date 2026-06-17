import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gamePlayMatchStyles as styles } from "../css/styles";
import { GamePlayState } from "../utils/gameStorage";
import { HelpWrapper } from "./GameHelpWrapper";

interface FoulIndicatorProps {
  fouls: number;
}

export const FoulIndicator = ({ fouls }: FoulIndicatorProps) => (
  <View style={{ flexDirection: "row", gap: 4, marginTop: 8, justifyContent: "center" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <View 
        key={i} 
        style={{ 
          width: 10, 
          height: 10, 
          borderRadius: 5, 
          backgroundColor: i <= fouls ? (i === 5 ? "#EF4444" : "#F59E0B") : "#374151" 
        }} 
      />
    ))}
  </View>
);

interface GameHeaderProps {
  teamName: string;
  matchState: GamePlayState;
  isTimerRunning: boolean;
  setIsTimerRunning: (val: boolean) => void;
  updateState: (updates: Partial<GamePlayState> | ((prev: GamePlayState) => Partial<GamePlayState>)) => void;
  showToast: (msg: string) => void;
  setIsRivalModalVisible: (val: boolean) => void;
  goBack: () => void;
  isHelpModeActive: boolean;
  setActiveHelpItem: (item: any) => void;
}

export const GameHeader = ({
  teamName, matchState, isTimerRunning, setIsTimerRunning, updateState,
  showToast, setIsRivalModalVisible, goBack, isHelpModeActive, setActiveHelpItem
}: GameHeaderProps) => {

  const getTeamFouls = () => {
    const q = matchState.quarter;
    if (q === 5) return ((matchState.teamFoulsByQuarter || {})[4] || 0) + ((matchState.teamFoulsByQuarter || {})[5] || 0);
    return (matchState.teamFoulsByQuarter || {})[q] || 0;
  };

  const getRivalFouls = () => {
    const q = matchState.quarter;
    if (q === 5) return ((matchState.rivalFoulsByQuarter || {})[4] || 0) + ((matchState.rivalFoulsByQuarter || {})[5] || 0);
    return (matchState.rivalFoulsByQuarter || {})[q] || 0;
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.header}>
      <View style={[styles.headerLeft, { position: "relative", justifyContent: "center", alignItems: "center" }]}>
        <Pressable onPress={goBack} style={{ position: "absolute", top: -4, left: -4, padding: 8, zIndex: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#F9FAFB" />
        </Pressable>
        <Text style={[styles.teamName, { textAlign: "center" }]}>{teamName}</Text>
        <View style={{ position: "absolute", bottom: -4 }}>
          <FoulIndicator fouls={getTeamFouls()} />
        </View>
      </View>

      <View style={styles.headerCenterCol}>
        <Text style={styles.score}>{matchState.teamScore} - {matchState.rivalScore}</Text>
        <Text style={styles.quarterScoreText}>
          {matchState.quarterTeamScore} {matchState.quarter === 5 ? "EX" : `Q${matchState.quarter}`} {matchState.quarterRivalScore}
        </Text>
        <HelpWrapper helpKey="timer" isHelpModeActive={isHelpModeActive} setActiveHelpItem={setActiveHelpItem}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
            <Pressable 
              onPress={() => setIsTimerRunning(!isTimerRunning)}
              onLongPress={() => {
                if (matchState.quarter === 5 && Platform.OS !== 'web') {
                  setIsTimerRunning(false);
                  updateState(prev => ({
                    timeRemainingByQuarter: { ...(prev.timeRemainingByQuarter || {}), 5: 300 }
                  }));
                  showToast("Cronómetro de Prórroga reiniciado");
                }
              }}
              delayLongPress={800}
            >
              <Text style={[styles.timeText, isTimerRunning && { color: "#10B981" }]}>
                {formatTime(matchState.timeRemainingByQuarter?.[matchState.quarter] ?? (matchState.quarter === 5 ? 300 : 600))}
              </Text>
            </Pressable>
            {matchState.quarter === 5 && Platform.OS === 'web' && (
              <Pressable
                onPress={() => {
                  setIsTimerRunning(false);
                  updateState(prev => ({
                    timeRemainingByQuarter: { ...(prev.timeRemainingByQuarter || {}), 5: 300 }
                  }));
                  showToast("Cronómetro de Prórroga reiniciado");
                }}
                style={{ padding: 6, backgroundColor: "#374151", borderRadius: 16 }}
              >
                <Ionicons name="refresh" size={18} color="#D1D5DB" />
              </Pressable>
            )}
          </View>
        </HelpWrapper>
      </View>

      <HelpWrapper helpKey="rival" isHelpModeActive={isHelpModeActive} setActiveHelpItem={setActiveHelpItem} style={styles.headerRight}>
        <Pressable style={[{ flex: 1, position: "relative", justifyContent: "center", alignItems: "center" }]} onPress={() => setIsRivalModalVisible(true)}>
          <Text style={[styles.rivalName, { textAlign: "center" }]}>Rival</Text>
          <View style={{ position: "absolute", bottom: -4 }}>
            <FoulIndicator fouls={getRivalFouls()} />
          </View>
        </Pressable>
      </HelpWrapper>
    </View>
  );
};
