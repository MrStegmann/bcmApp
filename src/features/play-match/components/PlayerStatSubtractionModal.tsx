import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { InGamePlayer, PlayerStatSubtractionModalProps, StatActionType } from "../types";

export const PlayerStatSubtractionModal: React.FC<PlayerStatSubtractionModalProps> = ({
  visible,
  player,
  onClose,
  onSubtractStat,
}) => {
  if (!player) return null;

  const handleSubtract = (statType: StatActionType) => {
    onSubtractStat(player.id, statType);
    onClose();
  };

  const currentPts =
    Number(player.t1a || 0) * 1 + Number(player.t2a || 0) * 2 + Number(player.t3a || 0) * 3;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <View className="bg-slate-900 border border-rose-500/40 w-full max-w-md rounded-2xl p-5 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <View className="flex-row items-center space-x-3">
              <View className="w-12 h-12 rounded-full bg-rose-500 items-center justify-center shadow-md">
                <Text className="text-white font-black text-xl">
                  {player.number ? `#${player.number}` : "-"}
                </Text>
              </View>
              <View>
                <Text className="text-white font-black text-lg">
                  {player.firstName} {player.lastName}
                </Text>
                <Text className="text-rose-400 font-bold text-xs">
                  Restar / Corregir Estadística
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} testID="close-subtraction-modal" className="p-2">
              <Text className="text-slate-400 font-bold text-xl">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-96">
            {/* Section 1: Made Shots (Cascading assist on 2pt/3pt) */}
            <Text className="text-slate-400 text-[11px] font-bold tracking-wider uppercase mb-2">
              Canastas Anotadas (Resta puntos y revierte asistencia)
            </Text>
            <View className="flex-row space-x-2 mb-2">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("t1a")}
                testID="subtract-t1a-button"
                className="flex-1 py-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl items-center"
              >
                <Text className="text-rose-300 font-bold text-xs">−1 Canasto (1pt)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("t2a")}
                testID="subtract-t2a-button"
                className="flex-1 py-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl items-center"
              >
                <Text className="text-rose-300 font-bold text-xs">−1 Canasto (2pt)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("t3a")}
                testID="subtract-t3a-button"
                className="flex-1 py-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl items-center"
              >
                <Text className="text-rose-300 font-bold text-xs">−1 Canasto (3pt)</Text>
              </TouchableOpacity>
            </View>

            {/* Section 2: Missed Shots */}
            <Text className="text-slate-400 text-[11px] font-bold tracking-wider uppercase mb-2">
              Tiros Fallados
            </Text>
            <View className="flex-row space-x-2 mb-2">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("t1i")}
                className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
              >
                <Text className="text-slate-300 font-medium text-xs">−1 Fallado (1pt)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("t2i")}
                className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
              >
                <Text className="text-slate-300 font-medium text-xs">−1 Fallado (2pt)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("t3i")}
                className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
              >
                <Text className="text-slate-300 font-medium text-xs">−1 Fallado (3pt)</Text>
              </TouchableOpacity>
            </View>

            {/* Section 3: Rebounds & Defense */}
            <Text className="text-slate-400 text-[11px] font-bold tracking-wider uppercase mb-2">
              Rebotes & Acciones
            </Text>
            <View className="flex-row space-x-2 mb-2">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("oreb")}
                className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
              >
                <Text className="text-slate-300 font-medium text-xs">−1 Reb. Ofensivo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("dreb")}
                className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
              >
                <Text className="text-slate-300 font-medium text-xs">−1 Reb. Defensivo</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row space-x-2 mb-2">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("recovers")}
                className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
              >
                <Text className="text-slate-300 font-medium text-xs">−1 Recuperación</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("lost")}
                className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
              >
                <Text className="text-slate-300 font-medium text-xs">−1 Pérdida</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSubtract("asis")}
                className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl items-center"
              >
                <Text className="text-slate-300 font-medium text-xs">−1 Asistencia</Text>
              </TouchableOpacity>
            </View>

            {/* Section 4: Personal Foul */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSubtract("fault")}
              testID="subtract-foul-button"
              className="py-3 bg-amber-500/20 border border-amber-500/50 rounded-xl items-center justify-center mt-2 mb-1"
            >
              <Text className="text-amber-300 font-bold text-sm">
                −1 Falta Personal (Resta falta a jugador y periodo)
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
