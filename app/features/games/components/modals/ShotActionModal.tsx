import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gamePlayMatchStyles as styles } from "../../css/styles";
import { Player } from "../../../players/types";
import { ShotModalState } from "../../hooks/useGamePlayMatch";

interface ShotActionModalProps {
  shotModal: ShotModalState;
  handleShotOutcome: (made: boolean) => void;
  handleAssist: (assistPlayerId: string | null) => void;
  courtPlayers: Player[];
}

export const ShotActionModal = ({
  shotModal, handleShotOutcome, handleAssist, courtPlayers
}: ShotActionModalProps) => {
  return (
    <Modal visible={shotModal.visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {shotModal.step === "outcome" ? (
            <>
              <Text style={styles.modalTitle}>Tiro de {shotModal.points} PT</Text>
              <View style={{ flexDirection: "row", gap: 12, justifyContent: "center" }}>
                <Pressable style={[styles.modalButtonCancel, { flex: 1, backgroundColor: "#DC2626" }]} onPress={() => handleShotOutcome(false)}><Text style={styles.modalButtonCancelText}>Fallo</Text></Pressable>
                <Pressable style={[styles.modalButtonConfirm, { flex: 1, backgroundColor: "#10B981" }]} onPress={() => handleShotOutcome(true)}><Text style={styles.modalButtonConfirmText}>Acierto</Text></Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>¿Asistencia?</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 24 }}>
                {courtPlayers.filter(p => p.id !== shotModal.shooterId).map(p => (
                  <Pressable key={p.id} style={[styles.jerseyToken, { backgroundColor: "#374151", borderRadius: 8 }]} onPress={() => handleAssist(p.id)}>
                    <Ionicons name="person" size={24} color="#9CA3AF" />
                    <Text style={[styles.jerseyNumber, { fontSize: 12 }]}>#{p.jerseyNumber}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.modalButtonCancel} onPress={() => handleAssist(null)}><Text style={styles.modalButtonCancelText}>Sin Asistencia</Text></Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
