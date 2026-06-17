import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { gamePlayMatchStyles as styles } from "../../css/styles";
import { GamePlayState } from "../../utils/gameStorage";

interface PlayerStatsModalProps {
  isStatsModalVisible: boolean;
  setIsStatsModalVisible: (val: boolean) => void;
  selectedPlayerId: string | null;
  matchState: GamePlayState;
}

export const PlayerStatsModal = ({
  isStatsModalVisible, setIsStatsModalVisible, selectedPlayerId, matchState
}: PlayerStatsModalProps) => {
  return (
    <Modal visible={isStatsModalVisible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: "95%", maxWidth: 400 }]}>
          {selectedPlayerId && (() => {
            const st = matchState.playerStats[selectedPlayerId] || { minutes: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, dreb: 0, oreb: 0, asis: 0, rec: 0, per: 0, falt: 0 };
            const points = (st.t1a * 1) + (st.t2a * 2) + (st.t3a * 3);
            const formatMin = (ms: number) => { const totalSecs = Math.floor(ms / 1000); return `${Math.floor(totalSecs / 60)}:${(totalSecs % 60).toString().padStart(2, '0')}`; };
            return (
              <>
                <View style={styles.statsHeader}><Text style={styles.statsPlayerName}>Estadísticas Completas</Text></View>
                
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginVertical: 16, gap: 12 }}>
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "47%" }]}><Text style={styles.statsCenterLabel}>Minutos</Text><Text style={styles.statsCenterValue}>{formatMin(st.minutes)}</Text></View>
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "47%" }]}><Text style={styles.statsCenterLabel}>Puntos</Text><Text style={styles.statsCenterValue}>{points}</Text></View>
                  
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "30%" }]}><Text style={styles.statsCenterLabel}>TL</Text><Text style={styles.statsCenterValue}>{st.t1a}/{st.t1a + st.t1i}</Text></View>
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "30%" }]}><Text style={styles.statsCenterLabel}>T2</Text><Text style={styles.statsCenterValue}>{st.t2a}/{st.t2a + st.t2i}</Text></View>
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "30%" }]}><Text style={styles.statsCenterLabel}>T3</Text><Text style={styles.statsCenterValue}>{st.t3a}/{st.t3a + st.t3i}</Text></View>
                  
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "47%" }]}><Text style={styles.statsCenterLabel}>Reb Def</Text><Text style={styles.statsCenterValue}>{st.dreb}</Text></View>
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "47%" }]}><Text style={styles.statsCenterLabel}>Reb Of</Text><Text style={styles.statsCenterValue}>{st.oreb}</Text></View>
                  
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "47%" }]}><Text style={styles.statsCenterLabel}>Asistencias</Text><Text style={styles.statsCenterValue}>{st.asis}</Text></View>
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "47%" }]}><Text style={styles.statsCenterLabel}>Robos</Text><Text style={styles.statsCenterValue}>{st.rec}</Text></View>
                  
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "47%" }]}><Text style={styles.statsCenterLabel}>Pérdidas</Text><Text style={styles.statsCenterValue}>{st.per}</Text></View>
                  <View style={[{ backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", width: "47%" }]}><Text style={styles.statsCenterLabel}>Faltas</Text><Text style={styles.statsCenterValue}>{st.falt}</Text></View>
                </View>

                <Pressable style={styles.modalButtonCancel} onPress={() => setIsStatsModalVisible(false)}><Text style={styles.modalButtonCancelText}>Cerrar</Text></Pressable>
              </>
            );
          })()}
        </View>
      </View>
    </Modal>
  );
};
