import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { PlayerDetailModalProps } from "../types";

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  visible,
  player,
  onClose,
}) => {
  if (!player) return null;

  const calculatePct = (made: number, attempted: number) => {
    if (attempted <= 0) return "0.0%";
    return `${((made / attempted) * 100).toFixed(1)}%`;
  };

  const totalFgm = player.t2a + player.t3a;
  const totalFga = player.t2i + player.t3i;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 items-center justify-center p-4">
        <View className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 bg-slate-800/80 border-b border-slate-700">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/50 items-center justify-center mr-3">
                <Text className="text-amber-400 font-extrabold text-base">
                  #{player.jerseyNumber || "0"}
                </Text>
              </View>
              <View>
                <Text className="text-white font-extrabold text-lg">
                  {player.fullName || "Jugador"}
                </Text>
                <Text className="text-slate-400 text-xs">
                  Tiempo en pista: {player.minutes} min
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-slate-700/60 active:bg-slate-700"
              testID="close-player-modal-button"
            >
              <Feather name="x" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          <ScrollView
            className="p-5 max-h-[500px]"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Key Metrics */}
            <View className="flex-row items-center justify-between mb-5 bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
              <View className="items-center flex-1">
                <Text className="text-slate-400 text-xs uppercase font-semibold mb-0.5">
                  Puntos
                </Text>
                <Text className="text-emerald-400 font-black text-2xl">
                  {player.points}
                </Text>
              </View>

              <View className="w-[1px] h-8 bg-slate-700" />

              <View className="items-center flex-1">
                <Text className="text-slate-400 text-xs uppercase font-semibold mb-0.5">
                  Valoración
                </Text>
                <Text
                  className={`font-black text-2xl ${
                    player.valuation >= 15
                      ? "text-emerald-300"
                      : player.valuation > 0
                      ? "text-sky-300"
                      : "text-rose-400"
                  }`}
                >
                  {player.valuation}
                </Text>
              </View>

              <View className="w-[1px] h-8 bg-slate-700" />

              <View className="items-center flex-1">
                <Text className="text-slate-400 text-xs uppercase font-semibold mb-0.5">
                  Rebotes
                </Text>
                <Text className="text-amber-300 font-black text-2xl">
                  {player.totalRebounds}
                </Text>
              </View>
            </View>

            {/* Shooting Breakdown */}
            <Text className="text-slate-300 font-bold text-xs uppercase tracking-wider mb-2">
              Tiros de Campo y Libres
            </Text>
            <View className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 mb-4 space-y-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Tiros Libres (1pt)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.t1a} / {player.t1i}{" "}
                  <Text className="text-slate-400 text-xs font-normal">
                    ({calculatePct(player.t1a, player.t1i)})
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Tiros de 2 (2pt)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.t2a} / {player.t2i}{" "}
                  <Text className="text-slate-400 text-xs font-normal">
                    ({calculatePct(player.t2a, player.t2i)})
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Triples (3pt)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.t3a} / {player.t3i}{" "}
                  <Text className="text-slate-400 text-xs font-normal">
                    ({calculatePct(player.t3a, player.t3i)})
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between pt-1 border-t border-slate-700/50">
                <Text className="text-slate-400 text-xs font-semibold uppercase">
                  Total Tiros de Campo
                </Text>
                <Text className="text-emerald-400 font-bold text-xs">
                  {totalFgm} / {totalFga}{" "}
                  <Text className="text-slate-400 text-xs font-normal">
                    ({calculatePct(totalFgm, totalFga)})
                  </Text>
                </Text>
              </View>
            </View>

            {/* Rebounds & Playmaking */}
            <Text className="text-slate-300 font-bold text-xs uppercase tracking-wider mb-2">
              Rebotes y Juego de Equipo
            </Text>
            <View className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 mb-2 space-y-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Rebotes Ofensivos (ORB)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.oreb}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Rebotes Defensivos (DRB)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.dreb}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Asistencias (AST)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.asis}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Recuperaciones (REC)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.rec}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Pérdidas de Balón (PER)
                </Text>
                <Text className="text-rose-400 font-bold text-sm">
                  {player.per}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-slate-300 text-sm font-medium">
                  Faltas Personales (FALT)
                </Text>
                <Text className="text-amber-400 font-bold text-sm">
                  {player.falt}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View className="p-4 bg-slate-800/80 border-t border-slate-700">
            <TouchableOpacity
              onPress={onClose}
              className="w-full py-2.5 bg-slate-700 rounded-xl items-center active:bg-slate-600"
            >
              <Text className="text-white font-bold text-sm">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
