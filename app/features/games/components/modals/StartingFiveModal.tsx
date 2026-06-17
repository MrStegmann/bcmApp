import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gamePlayMatchStyles as styles } from "../../css/styles";
import { GamePlayState } from "../../utils/gameStorage";
import { Player } from "../../../players/types";

interface StartingFiveModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (val: boolean) => void;
  sortedRoster: Player[];
  tempStartingFive: Set<string>;
  setTempStartingFive: (val: Set<string>) => void;
  updateState: (updates: Partial<GamePlayState> | ((prev: GamePlayState) => Partial<GamePlayState>)) => void;
}

export const StartingFiveModal = ({
  isModalVisible, setIsModalVisible, sortedRoster, tempStartingFive, setTempStartingFive, updateState
}: StartingFiveModalProps) => {
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Quinteto Inicial</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            {sortedRoster.map(p => {
              const isSelected = tempStartingFive.has(p.id);
              return (
                <Pressable
                  key={p.id}
                  style={[styles.jerseyToken, isSelected && styles.jerseyTokenSelected]}
                  onPress={() => {
                    const next = new Set(tempStartingFive);
                    if (isSelected) next.delete(p.id);
                    else if (next.size < 5) next.add(p.id);
                    setTempStartingFive(next);
                  }}
                >
                  <Ionicons name="shirt" size={48} color={isSelected ? "#3B82F6" : "#4B5563"} />
                  <Text style={[styles.jerseyNumber, { fontSize: 16 }]}>{p.jerseyNumber}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.modalActions}>
            <Pressable style={styles.modalButtonCancel} onPress={() => setIsModalVisible(false)}><Text style={styles.modalButtonCancelText}>Cancelar</Text></Pressable>
            <Pressable style={[styles.modalButtonConfirm, tempStartingFive.size !== 5 && { opacity: 0.5 }]} disabled={tempStartingFive.size !== 5} onPress={() => { updateState({ courtPlayerIds: Array.from(tempStartingFive) }); setIsModalVisible(false); }}><Text style={styles.modalButtonConfirmText}>Guardar</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
