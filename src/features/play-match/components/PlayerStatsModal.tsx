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

  const availableAssistTeammates = courtTeammates.filter((t) => t.id !== player.id);
  const currentPts = player.t1a * 1 + player.t2a * 2 + player.t3a * 3;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <View className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-5 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <View className="flex-row items-center space-x-3">
              <View className="w-12 h-12 rounded-full bg-amber-500 items-center justify-center shadow-md">
                <Text className="text-slate-950 font-black text-xl">#{player.number}</Text>
              </View>
              <View>
                <Text className="text-white font-black text-lg">
                  {player.firstName} {player.lastName}
                </Text>
                <View className="flex-row items-center space-x-2">
                  <Text className="text-amber-400 font-bold text-xs">{currentPts} PTS</Text>
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
            <TouchableOpacity onPress={handleClose} className="p-2">
              <Text className="text-slate-400 font-bold text-xl">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body: Assist Prompt or Main Stat Panel */}
          {pendingShotType ? (
            <View>
              <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
                <Text className="text-amber-400 font-bold text-sm text-center">
                  ¿Quién dio la asistencia al canasto ({pendingShotType === "t2a" ? "+2" : "+3"})?
                </Text>
              </View>

              <ScrollView className="max-h-56 mb-3">
                {availableAssistTeammates.map((teammate) => (
                  <TouchableOpacity
                    key={teammate.id}
                    activeOpacity={0.7}
                    onPress={() => handleSelectAssist(teammate.id)}
                    className="flex-row items-center justify-between p-3 mb-2 rounded-xl bg-slate-800 border border-slate-700 active:bg-amber-500/20 active:border-amber-500"
                  >
                    <View className="flex-row items-center space-x-3">
                      <View className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center">
                        <Text className="text-white font-bold text-xs">#{teammate.number}</Text>
                      </View>
                      <Text className="text-white font-semibold text-sm">
                        {teammate.firstName} {teammate.lastName}
                      </Text>
                    </View>
                    <Text className="text-amber-400 font-bold text-xs">+1 Asis</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* No Assistant Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectAssist(null)}
                className="py-3 rounded-xl bg-slate-800 border border-slate-600 items-center justify-center mb-2"
              >
                <Text className="text-slate-300 font-bold text-sm">Sin Asistencia (Solo Canasta)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPendingShotType(null)}
                className="py-2 items-center justify-center"
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
                  className="flex-1 py-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl items-center"
                >
                  <Text className="text-emerald-400 font-extrabold text-sm">1pt Anotado (+1)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t1i")}
                  className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
                >
                  <Text className="text-slate-300 font-semibold text-sm">1pt Fallado</Text>
                </TouchableOpacity>
              </View>

              {/* T2 Row */}
              <View className="flex-row space-x-2 mb-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t2a")}
                  className="flex-1 py-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl items-center"
                >
                  <Text className="text-emerald-400 font-extrabold text-sm">2pt Anotado (+2)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t2i")}
                  className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
                >
                  <Text className="text-slate-300 font-semibold text-sm">2pt Fallado</Text>
                </TouchableOpacity>
              </View>

              {/* T3 Row */}
              <View className="flex-row space-x-2 mb-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t3a")}
                  className="flex-1 py-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl items-center"
                >
                  <Text className="text-emerald-400 font-extrabold text-sm">3pt Anotado (+3)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("t3i")}
                  className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
                >
                  <Text className="text-slate-300 font-semibold text-sm">3pt Fallado</Text>
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
                  className="flex-1 py-2.5 bg-sky-500/10 border border-sky-500/40 rounded-xl items-center"
                >
                  <Text className="text-sky-300 font-bold text-xs">Reb. Ofensivo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("dreb")}
                  className="flex-1 py-2.5 bg-sky-500/10 border border-sky-500/40 rounded-xl items-center"
                >
                  <Text className="text-sky-300 font-bold text-xs">Reb. Defensivo</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row space-x-2 mb-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("recovers")}
                  className="flex-1 py-2.5 bg-teal-500/10 border border-teal-500/40 rounded-xl items-center"
                >
                  <Text className="text-teal-300 font-bold text-xs">Recuperación</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("lost")}
                  className="flex-1 py-2.5 bg-orange-500/10 border border-orange-500/40 rounded-xl items-center"
                >
                  <Text className="text-orange-300 font-bold text-xs">Pérdida</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleStatTap("asis")}
                  className="flex-1 py-2.5 bg-amber-500/10 border border-amber-500/40 rounded-xl items-center"
                >
                  <Text className="text-amber-300 font-bold text-xs">Asistencia</Text>
                </TouchableOpacity>
              </View>

              {/* Section 3: Personal Foul (Clock Stoppage) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleStatTap("fault")}
                className="py-3 bg-rose-500/20 border border-rose-500/60 rounded-xl items-center justify-center mb-1"
              >
                <Text className="text-rose-300 font-black text-sm">
                  Falta Personal (Pausa el reloj automáticamente)
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
