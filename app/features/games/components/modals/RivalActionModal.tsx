import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { gamePlayMatchStyles as styles } from "../../css/styles";

interface RivalActionModalProps {
  isRivalModalVisible: boolean;
  setIsRivalModalVisible: (val: boolean) => void;
  handleRivalScore: (points: number) => void;
  handleRivalFoul: () => void;
}

export const RivalActionModal = ({
  isRivalModalVisible, setIsRivalModalVisible, handleRivalScore, handleRivalFoul
}: RivalActionModalProps) => {
  return (
    <Modal visible={isRivalModalVisible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Puntos del Rival</Text>
          <View style={{ flexDirection: "row", gap: 12, justifyContent: "center", marginBottom: 16 }}>
            <Pressable style={[styles.modalButtonConfirm, { flex: 1, backgroundColor: "#10B981" }]} onPress={() => handleRivalScore(1)}><Text style={styles.modalButtonConfirmText}>+1 TL</Text></Pressable>
            <Pressable style={[styles.modalButtonConfirm, { flex: 1, backgroundColor: "#10B981" }]} onPress={() => handleRivalScore(2)}><Text style={styles.modalButtonConfirmText}>+2 PT</Text></Pressable>
            <Pressable style={[styles.modalButtonConfirm, { flex: 1, backgroundColor: "#10B981" }]} onPress={() => handleRivalScore(3)}><Text style={styles.modalButtonConfirmText}>+3 PT</Text></Pressable>
          </View>
          <Pressable style={[styles.modalButtonConfirm, { backgroundColor: "#EF4444", marginBottom: 16 }]} onPress={() => handleRivalFoul()}><Text style={styles.modalButtonConfirmText}>+1 Falta</Text></Pressable>
          <Pressable style={styles.modalButtonCancel} onPress={() => setIsRivalModalVisible(false)}><Text style={styles.modalButtonCancelText}>Cancelar</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
};
