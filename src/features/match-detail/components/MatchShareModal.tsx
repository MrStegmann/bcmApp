import React, { useRef, useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { MatchShareModalProps } from "../types";
import { MatchStatsGraphic } from "./MatchStatsGraphic";
import { formatMatchShareData, formatShareImageFileName } from "../utils/shareDataFormatter";
import { matchShareService } from "../services/matchShareService";

export const MatchShareModal: React.FC<MatchShareModalProps> = ({
  visible,
  match,
  teamName,
  periods,
  players,
  advancedStats,
  onClose,
}) => {
  const graphicRef = useRef<View>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const formattedData = useMemo(() => {
    return formatMatchShareData({
      match,
      teamName,
      periods,
      players,
      advancedStats,
    });
  }, [match, teamName, periods, players, advancedStats]);

  const shareFileName = useMemo(() => {
    return formatShareImageFileName(match.opponent, match.round);
  }, [match.opponent, match.round]);

  const handleShareWhatsApp = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      setProcessingAction("sharing");

      const fileUri = await matchShareService.captureViewToPng(graphicRef, shareFileName);
      const result = await matchShareService.shareImageFile(
        fileUri,
        `Estadísticas: ${teamName} vs ${match.opponent}`,
        shareFileName
      );

      if (!result.success) {
        Alert.alert("Aviso", result.error || "No se pudo compartir la imagen.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error al preparar el archivo para compartir.");
    } finally {
      setIsProcessing(false);
      setProcessingAction(null);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      testID="match-share-modal"
    >
      <SafeAreaView style={styles.modalRoot}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderTitleBox}>
            <Text style={styles.modalTitle}>Compartir Estadísticas</Text>
            <Text style={styles.modalSubtitle} numberOfLines={1}>
              {teamName} vs {match.opponent || "Rival"} • {match.round || "Partido"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            disabled={isProcessing}
            style={styles.closeButton}
            testID="close-share-modal-button"
          >
            <Feather name="x" size={22} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Preview Area */}
        <View style={styles.previewContainer}>
          <ScrollView
            style={styles.verticalScroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              <MatchStatsGraphic ref={graphicRef} data={formattedData} />
            </ScrollView>
          </ScrollView>

          {/* Processing Loading Overlay */}
          {isProcessing && (
            <View style={styles.loadingOverlay} testID="share-processing-overlay">
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>
                Preparando imagen para compartir...
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Action Footer */}
        <View style={styles.modalFooter}>
          <TouchableOpacity
            onPress={handleShareWhatsApp}
            disabled={isProcessing}
            style={[styles.actionButton, styles.shareActionButton]}
            testID="share-whatsapp-action-button"
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Feather name="share-2" size={18} color="#ffffff" />
            )}
            <Text style={styles.shareActionText}>Compartir Estadísticas</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: "#0B1326",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    backgroundColor: "#171F33",
  },
  modalHeaderTitleBox: {
    flex: 1,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#E0C0B1",
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#1E293B",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#0B1326",
    position: "relative",
  },
  verticalScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: "center",
  },
  horizontalScrollContent: {
    paddingRight: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(11, 19, 38, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  loadingText: {
    color: "#DAE2FD",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#171F33",
    borderTopWidth: 1,
    borderTopColor: "#334155",
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
  },
  shareActionButton: {
    backgroundColor: "#F97316",
  },
  shareActionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  saveActionButton: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  saveActionText: {
    color: "#38BDF8",
    fontSize: 14,
    fontWeight: "700",
  },
});
