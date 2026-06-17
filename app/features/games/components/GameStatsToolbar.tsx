import React from "react";
import { View, Text, Pressable } from "react-native";
import { gamePlayMatchStyles as styles } from "../css/styles";
import { HelpWrapper } from "./GameHelpWrapper";
import { GamePlayState } from "../utils/gameStorage";
import { PlayerStats } from "../../players/types";

interface GameStatsToolbarProps {
  selectedPlayerId: string | null;
  setSelectedPlayerId: (val: string | null) => void;
  handleShotBtn: (points: 1 | 2 | 3) => void;
  updatePlayerStat: (playerId: string, statKey: keyof PlayerStats, value: number, globalUpdates?: (prev: GamePlayState) => Partial<GamePlayState>) => void;
  isHelpModeActive: boolean;
  setActiveHelpItem: (item: any) => void;
}

export const GameStatsToolbar = ({
  selectedPlayerId, setSelectedPlayerId, handleShotBtn, updatePlayerStat,
  isHelpModeActive, setActiveHelpItem
}: GameStatsToolbarProps) => {
  return (
    <HelpWrapper helpKey="stats_toolbar" isHelpModeActive={isHelpModeActive} setActiveHelpItem={setActiveHelpItem}>
      <View style={styles.toolbar}>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonPoint, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => handleShotBtn(1)}>
          <Text style={styles.toolButtonText}>+1 TL</Text>
        </Pressable>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonPoint, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => handleShotBtn(2)}>
          <Text style={styles.toolButtonText}>+2 PT</Text>
        </Pressable>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonPoint, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => handleShotBtn(3)}>
          <Text style={styles.toolButtonText}>+3 PT</Text>
        </Pressable>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "oreb", 1); setSelectedPlayerId(null); }}>
          <Text style={styles.toolButtonText}>Reb Of</Text>
        </Pressable>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "dreb", 1); setSelectedPlayerId(null); }}>
          <Text style={styles.toolButtonText}>Reb Def</Text>
        </Pressable>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "asis", 1); setSelectedPlayerId(null); }}>
          <Text style={styles.toolButtonText}>Ast</Text>
        </Pressable>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "rec", 1); setSelectedPlayerId(null); }}>
          <Text style={styles.toolButtonText}>Robo</Text>
        </Pressable>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonMiss, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "per", 1); setSelectedPlayerId(null); }}>
          <Text style={styles.toolButtonText}>Pérdida</Text>
        </Pressable>
        <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonMiss, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { 
          updatePlayerStat(selectedPlayerId!, "falt", 1, prev => ({
            teamFoulsByQuarter: {
              ...(prev.teamFoulsByQuarter || {}),
              [prev.quarter]: ((prev.teamFoulsByQuarter || {})[prev.quarter] || 0) + 1
            }
          })); 
          setSelectedPlayerId(null); 
        }}>
          <Text style={styles.toolButtonText}>Falta</Text>
        </Pressable>
      </View>
    </HelpWrapper>
  );
};
