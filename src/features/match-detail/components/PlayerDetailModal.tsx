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
        <View className="w-full max-w-lg bg-surface-container rounded-2xl border border-slate-border overflow-hidden shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 bg-slate-card border-b border-slate-border">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-court-orange/20 border border-court-orange/50 items-center justify-center mr-3">
                <Text className="text-court-orange font-extrabold text-base">
                  #{player.jerseyNumber || "0"}
                </Text>
              </View>
              <View>
                <Text className="text-white font-extrabold text-lg">
                  {player.fullName || "Jugador"}
                </Text>
                <Text className="text-on-surface-variant text-xs">
                  Tiempo en pista: {player.minutes} min
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="p-2 min-w-[40px] min-h-[40px] items-center justify-center rounded-full bg-slate-dark active:bg-slate-card"
              testID="close-player-modal-button"
            >
              <Feather name="x" size={18} color="#A78B7D" />
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          <ScrollView
            className="p-5 max-h-[500px]"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Key Metrics */}
            <View className="flex-row items-center justify-between mb-5 bg-slate-dark rounded-xl p-3 border border-slate-border">
              <View className="items-center flex-1">
                <Text className="text-on-surface-variant text-xs uppercase font-semibold mb-0.5">
                  Puntos
                </Text>
                <Text className="text-court-orange font-black text-2xl">
                  {player.points}
                </Text>
              </View>

              <View className="w-[1px] h-8 bg-slate-border" />

              <View className="items-center flex-1">
                <Text className="text-on-surface-variant text-xs uppercase font-semibold mb-0.5">
                  Valoración
                </Text>
                <Text
                  className={`font-black text-2xl ${
                    player.valuation >= 15
                      ? "text-court-green"
                      : player.valuation > 0
                      ? "text-tactical-blue-light"
                      : "text-court-red"
                  }`}
                >
                  {player.valuation}
                </Text>
              </View>

              <View className="w-[1px] h-8 bg-slate-border" />

              <View className="items-center flex-1">
                <Text className="text-on-surface-variant text-xs uppercase font-semibold mb-0.5">
                  Rebotes
                </Text>
                <Text className="text-primary font-black text-2xl">
                  {player.totalRebounds}
                </Text>
              </View>
            </View>

            {/* Shooting Breakdown */}
            <Text className="text-white font-bold text-xs uppercase tracking-wider mb-2">
              Tiros de Campo y Libres
            </Text>
            <View className="bg-slate-card rounded-xl p-3 border border-slate-border mb-4 space-y-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Tiros Libres (1pt)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.t1a} / {player.t1i}{" "}
                  <Text className="text-on-surface-variant text-xs font-normal">
                    ({calculatePct(player.t1a, player.t1i)})
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Tiros de 2 (2pt)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.t2a} / {player.t2i}{" "}
                  <Text className="text-on-surface-variant text-xs font-normal">
                    ({calculatePct(player.t2a, player.t2i)})
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Triples (3pt)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.t3a} / {player.t3i}{" "}
                  <Text className="text-on-surface-variant text-xs font-normal">
                    ({calculatePct(player.t3a, player.t3i)})
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between pt-1 border-t border-slate-border/50">
                <Text className="text-on-surface-variant text-xs font-semibold uppercase">
                  Total Tiros de Campo
                </Text>
                <Text className="text-court-green font-bold text-xs">
                  {totalFgm} / {totalFga}{" "}
                  <Text className="text-on-surface-variant text-xs font-normal">
                    ({calculatePct(totalFgm, totalFga)})
                  </Text>
                </Text>
              </View>
            </View>

            {/* Rebounds & Playmaking */}
            <Text className="text-white font-bold text-xs uppercase tracking-wider mb-2">
              Rebotes y Juego de Equipo
            </Text>
            <View className="bg-slate-card rounded-xl p-3 border border-slate-border mb-2 space-y-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Rebotes Ofensivos (ORB)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.oreb}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Rebotes Defensivos (DRB)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.dreb}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Asistencias (AST)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.asis}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Recuperaciones (REC)
                </Text>
                <Text className="text-white font-bold text-sm">
                  {player.rec}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Pérdidas de Balón (PER)
                </Text>
                <Text className="text-court-red font-bold text-sm">
                  {player.per}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-on-surface text-sm font-medium">
                  Faltas Personales (FALT)
                </Text>
                <Text className="text-primary font-bold text-sm">
                  {player.falt}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View className="p-4 bg-slate-card border-t border-slate-border">
            <TouchableOpacity
              onPress={onClose}
              className="w-full min-h-[48px] py-3 bg-slate-dark border border-slate-border rounded-xl items-center justify-center active:bg-slate-card"
            >
              <Text className="text-white font-bold text-sm">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PlayerDetailModal;
