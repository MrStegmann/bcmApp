import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { InGamePlayer, PlayerStatsModalProps, StatActionType } from "../types";

export const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({
  visible,
  player,
  courtTeammates,
  onClose,
  onRecordStat,
}) => {
  const [pendingShotType, setPendingShotType] = useState<"t2a" | "t3a" | null>(null);

  if (!player) return null;

  const handleStatTap = (statType: StatActionType) => {
    if (statType === "t2a" || statType === "t3a") {
      setPendingShotType(statType);
    } else {
      onRecordStat(player.id, statType, null);
      handleClose();
    }
  };

  const handleSelectAssist = (assistingId: number | null) => {
    if (pendingShotType) {
      onRecordStat(player.id, pendingShotType, assistingId);
      handleClose();
    }
  };

  const handleClose = () => {
    setPendingShotType(null);
    onClose();
  };

  const availableAssistTeammates = courtTeammates.filter((t) => Number(t.id) !== Number(player.id));
  const currentPts = Number(player.t1a || 0) * 1 + Number(player.t2a || 0) * 2 + Number(player.t3a || 0) * 3;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <View className="bg-surface-container border border-slate-border w-full max-w-md rounded-2xl p-5 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-slate-border pb-3 mb-4">
            <View className="flex-row items-center space-x-3">
              <View className="w-12 h-12 rounded-full bg-court-orange items-center justify-center shadow-md">
                <Text className="text-slate-950 font-black text-xl">
                  {player.number ? `#${player.number}` : "-"}
                </Text>
              </View>
              <View>
                <Text className="text-white font-black text-lg">
                  {player.firstName} {player.lastName}
                </Text>
                <View className="flex-row items-center space-x-2">
                  <Text className="text-court-orange font-bold text-xs">{currentPts} PTS</Text>
                  <Text className="text-slate-500 text-xs">•</Text>
                  <Text className="text-rose-400 font-bold text-xs">{player.falt} FALTAS</Text>
                  {player.position && (
                    <>
                      <Text className="text-slate-500 text-xs">•</Text>
                      <Text className="text-slate-400 text-xs">{player.position}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} className="p-2 min-h-[48px] min-w-[48px] items-center justify-center">
              <Text className="text-slate-400 font-bold text-xl">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body: Assist Prompt or Main Stat Panel */}
          {pendingShotType ? (
            <View>
              <View className="bg-court-orange/10 border border-court-orange/30 rounded-xl p-2 mb-3">
                <Text className="text-court-orange font-bold text-sm text-center">
                  Asistencia
                </Text>
              </View>

              <ScrollView className="max-h-72 mb-3">
                {availableAssistTeammates.map((teammate) => (
                  <TouchableOpacity
                    key={teammate.id}
                    activeOpacity={0.7}
                    onPress={() => handleSelectAssist(teammate.id)}
                    className="flex-row items-center justify-between p-3 min-h-[48px] mb-2 rounded-xl bg-surface-elevated border border-slate-border active:bg-court-orange/20 active:border-court-orange"
                  >
                    <View className="flex-row items-center space-x-3">
                      <View className="w-8 h-8 rounded-full bg-slate-border items-center justify-center">
                        <Text className="text-white font-bold text-xs">
                          {teammate.number ? `#${teammate.number}` : "-"}
                        </Text>
                      </View>
                      <Text className="text-white font-semibold text-sm">
                        {teammate.firstName} {teammate.lastName}
                      </Text>
                    </View>
                    <Text className="text-court-orange font-bold text-xs">+1 Asis</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* No Assistant Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectAssist(null)}
                className="py-3.5 min-h-[48px] rounded-xl bg-surface-elevated border border-slate-border items-center justify-center mb-2 active:bg-slate-border"
              >
                <Text className="text-slate-300 font-bold text-sm">Sin Asistencia</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPendingShotType(null)}
                className="py-3 min-h-[48px] items-center justify-center"
              >
                <Text className="text-slate-400 text-xs">Volver a opciones</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Section 1: Shooting (T1, T2, T3) */}
              <Text className="text-slate-400 text-[11px] font-bold tracking-wider uppercase mb-2">
                Tiros a Canasta (Anotado / Fallado)
              </Text>

              {/* T1 Row */}
              <View className="flex-row space-x-2 mb-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t1a")}
                  className="flex-1 py-3 min-h-[48px] bg-emerald-500/20 border border-emerald-500/50 rounded-xl items-center justify-center"
                >
                  <Text className="text-emerald-400 font-extrabold text-sm">T1A ({player.t1a})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t1i")}
                  className="flex-1 py-3 min-h-[48px] bg-surface-elevated border border-slate-border rounded-xl items-center justify-center active:bg-slate-border"
                >
                  <Text className="text-slate-300 font-semibold text-sm">T1I ({player.t1i})</Text>
                </TouchableOpacity>
              </View>

              {/* T2 Row */}
              <View className="flex-row space-x-2 mb-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t2a")}
                  className="flex-1 py-3 min-h-[48px] bg-emerald-500/20 border border-emerald-500/50 rounded-xl items-center justify-center"
                >
                  <Text className="text-emerald-400 font-extrabold text-sm">T2A ({player.t2a})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t2i")}
                  className="flex-1 py-3 min-h-[48px] bg-surface-elevated border border-slate-border rounded-xl items-center justify-center active:bg-slate-border"
                >
                  <Text className="text-slate-300 font-semibold text-sm">T2I ({player.t2i})</Text>
                </TouchableOpacity>
              </View>

              {/* T3 Row */}
              <View className="flex-row space-x-2 mb-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t3a")}
                  className="flex-1 py-3 min-h-[48px] bg-emerald-500/20 border border-emerald-500/50 rounded-xl items-center justify-center"
                >
                  <Text className="text-emerald-400 font-extrabold text-sm">T3A ({player.t3a})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t3i")}
                  className="flex-1 py-3 min-h-[48px] bg-surface-elevated border border-slate-border rounded-xl items-center justify-center active:bg-slate-border"
                >
                  <Text className="text-slate-300 font-semibold text-sm">T3I ({player.t3i})</Text>
                </TouchableOpacity>
              </View>

              {/* Section 2: Rebounds & Defense */}
              <Text className="text-slate-400 text-[11px] font-bold tracking-wider uppercase mb-2">
                Rebotes & Acciones
              </Text>
              <View className="flex-row space-x-2 mb-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("oreb")}
                  className="flex-1 py-3 min-h-[48px] bg-tactical-blue/20 border border-tactical-blue/40 rounded-xl items-center justify-center"
                >
                  <Text className="text-tactical-blue-light font-bold text-xs">OREB ({player.oreb})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("dreb")}
                  className="flex-1 py-3 min-h-[48px] bg-tactical-blue/20 border border-tactical-blue/40 rounded-xl items-center justify-center"
                >
                  <Text className="text-tactical-blue-light font-bold text-xs">DREB ({player.dreb})</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row space-x-2 mb-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("recovers")}
                  className="flex-1 py-3 min-h-[48px] bg-surface-elevated border border-slate-border rounded-xl items-center justify-center active:bg-slate-border"
                >
                  <Text className="text-emerald-400 font-bold text-xs">REC ({player.rec})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("lost")}
                  className="flex-1 py-3 min-h-[48px] bg-surface-elevated border border-slate-border rounded-xl items-center justify-center active:bg-slate-border"
                >
                  <Text className="text-orange-300 font-bold text-xs">PER ({player.per})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("asis")}
                  className="flex-1 py-3 min-h-[48px] bg-surface-elevated border border-slate-border rounded-xl items-center justify-center active:bg-slate-border"
                >
                  <Text className="text-court-orange font-bold text-xs">ASIS ({player.asis})</Text>
                </TouchableOpacity>
              </View>

              {/* Section 3: Personal Foul (Clock Stoppage) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleStatTap("fault")}
                className="py-3.5 min-h-[48px] bg-error-container/40 border border-error-container rounded-xl items-center justify-center mb-1 active:bg-error-container/60"
              >
                <Text className="text-rose-300 font-black text-sm">
                  FALTA ({player.falt})
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
