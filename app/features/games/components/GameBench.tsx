import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gamePlayMatchStyles as styles } from "../css/styles";
import { GamePlayState, saveGamePlayState } from "../utils/gameStorage";
import { HelpWrapper } from "./GameHelpWrapper";
import { Player } from "../../players/types";

interface GameBenchProps {
  matchState: GamePlayState;
  updateState: (updates: Partial<GamePlayState> | ((prev: GamePlayState) => Partial<GamePlayState>)) => void;
  setIsTimerRunning: (val: boolean) => void;
  isSubMode: boolean;
  setIsSubMode: (val: boolean) => void;
  subsIn: Set<string>;
  setSubsIn: (val: Set<string>) => void;
  subsOut: Set<string>;
  setSubsOut: (val: Set<string>) => void;
  setTempStartingFive: (val: Set<string>) => void;
  setIsModalVisible: (val: boolean) => void;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (val: string | null) => void;
  setIsStatsModalVisible: (val: boolean) => void;
  showToast: (msg: string) => void;
  benchPlayers: Player[];
  handlePlayerTap: (playerId: string, isBench: boolean) => void;
  isHelpModeActive: boolean;
  setActiveHelpItem: (item: any) => void;
}

export const GameBench = ({
  matchState, updateState, setIsTimerRunning, isSubMode, setIsSubMode,
  subsIn, setSubsIn, subsOut, setSubsOut, setTempStartingFive, setIsModalVisible,
  selectedPlayerId, setSelectedPlayerId, setIsStatsModalVisible, showToast,
  benchPlayers, handlePlayerTap, isHelpModeActive, setActiveHelpItem
}: GameBenchProps) => {

  const handleSubApply = () => {
    if (isSubMode) {
      if (subsIn.size === 0 && subsOut.size === 0) {
        setIsSubMode(false);
        return;
      }
      if (subsIn.size !== subsOut.size) {
        showToast(`Has seleccionado ${subsOut.size} para salir y ${subsIn.size} para entrar.`);
        return;
      }
      const newCourt = [...matchState.courtPlayerIds];
      const inArray = Array.from(subsIn);
      let inIndex = 0;
      for (let i = 0; i < newCourt.length; i++) {
        if (subsOut.has(newCourt[i])) {
          newCourt[i] = inArray[inIndex];
          inIndex++;
        }
      }
      updateState({ courtPlayerIds: newCourt });
      setSubsIn(new Set());
      setSubsOut(new Set());
      setIsSubMode(false);
    } else {
      setIsSubMode(true);
      setSelectedPlayerId(null);
      setSubsIn(new Set());
      setSubsOut(new Set());
    }
  };

  return (
    <View style={styles.benchContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <HelpWrapper helpKey="quarters" isHelpModeActive={isHelpModeActive} setActiveHelpItem={setActiveHelpItem} style={{ flex: 1 }}>
          <View style={styles.quartersRow}>
            {[1, 2, 3, 4, 5].map(q => (
              <Pressable
                key={q}
                onPress={() => {
                  setIsTimerRunning(false);
                  updateState({ quarter: q, quarterTeamScore: 0, quarterRivalScore: 0 });
                }}
                style={[styles.quarterButton, matchState.quarter === q && styles.quarterButtonActive]}
              >
                <Text style={[styles.quarterButtonText, matchState.quarter === q && styles.quarterButtonTextActive]}>{q === 5 ? "EX" : `Q${q}`}</Text>
              </Pressable>
            ))}
          </View>
        </HelpWrapper>

        <Pressable 
          style={[styles.quarterButton, { marginLeft: 8 }]}
          onPress={() => {
            saveGamePlayState(matchState).then(() => {
              showToast("Partido guardado");
            }).catch(() => {
              showToast("Error al guardar");
            });
          }}
        >
          <Ionicons name="save" size={20} color="#9CA3AF" />
        </Pressable>
      </View>

      <View style={styles.actionButtonsRow}>
        {isSubMode ? (
          <Pressable
            style={[styles.subButton, { backgroundColor: "#6B7280", flex: 1 }]}
            onPress={() => {
              setIsSubMode(false);
              setSubsIn(new Set());
              setSubsOut(new Set());
            }}
          >
            <Text style={styles.subButtonText}>Cancelar</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={[styles.subButton, { backgroundColor: "#3B82F6", flex: 1 }]}
              onPress={() => {
                setTempStartingFive(new Set(matchState.courtPlayerIds));
                setIsModalVisible(true);
              }}
            >
              <Text style={styles.subButtonText}>Quintetos</Text>
            </Pressable>

            <Pressable
              style={[styles.subButton, { backgroundColor: "#F59E0B", flex: 1 }, !selectedPlayerId && { opacity: 0.5 }]}
              disabled={!selectedPlayerId}
              onPress={() => setIsStatsModalVisible(true)}
            >
              <Text style={styles.subButtonText}>Ver Stats</Text>
            </Pressable>
          </>
        )}

        <Pressable
          style={[styles.subButton, isSubMode ? { backgroundColor: "#10B981", flex: 1 } : { flex: 1 }]}
          onPress={handleSubApply}
        >
          <Text style={styles.subButtonText}>{isSubMode ? "Aplicar" : "Cambios"}</Text>
        </Pressable>
      </View>

      <HelpWrapper helpKey="bench" isHelpModeActive={isHelpModeActive} setActiveHelpItem={setActiveHelpItem}>
        <View style={styles.benchPlayersRow}>
          {benchPlayers.map((p) => {
            const isSelected = isSubMode ? subsIn.has(p.id) : false;
            return (
              <Pressable
                key={p.id}
                style={[styles.jerseyToken, isSelected && styles.jerseyTokenSelected]}
                onPress={() => handlePlayerTap(p.id, true)}
              >
                <Ionicons name="shirt" size={36} color={isSelected ? "#3B82F6" : "#4B5563"} />
                <Text style={styles.jerseyNumber}>{p.jerseyNumber}</Text>
              </Pressable>
            );
          })}
        </View>
      </HelpWrapper>
    </View>
  );
};
