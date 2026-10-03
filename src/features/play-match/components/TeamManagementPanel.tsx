import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { InGamePlayer, TeamManagementPanelProps } from "../types";

export const TeamManagementPanel: React.FC<TeamManagementPanelProps> = ({
  benchPlayers,
  isSwapMode,
  isTimerRunning,
  selectedCourtCount,
  selectedBenchPlayerIds,
  availableTimeouts,
  onSelectBenchPlayer,
  onToggleSwapMode,
  onConfirmSwap,
  onCancelSwap,
  onIncreaseTimeout,
  onDecreaseTimeout,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculatePts = (p: InGamePlayer): number => {
    return p.t1a * 1 + p.t2a * 2 + p.t3a * 3;
  };

  const isSwapBalanced =
    selectedCourtCount > 0 && selectedCourtCount === selectedBenchPlayerIds.length;

  return (
    <View className="bg-slate-900 border-t border-slate-800 p-3 shadow-xl">
      {/* Control Row: Timeout Controls & Swap Button spaced between */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        {/* Timeout Control Widget */}
        <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 space-x-2">
          <View>
            <Text className="text-slate-400 text-[9px] font-bold tracking-wider">TIEMPOS MUERTOS</Text>
            <Text className="text-amber-400 font-extrabold text-base">
              {availableTimeouts} <Text className="text-slate-500 text-xs font-normal">restantes</Text>
            </Text>
          </View>
          <View className="flex-row items-center space-x-1 ml-2">
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={availableTimeouts <= 0}
              onPress={onDecreaseTimeout}
              className={`w-7 h-7 rounded-lg items-center justify-center border ${
                availableTimeouts > 0
                  ? "bg-slate-800 border-slate-700 active:bg-rose-500/20"
                  : "bg-slate-900 border-slate-800 opacity-40"
              }`}
            >
              <Text className="text-rose-400 font-black text-sm">−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onIncreaseTimeout}
              className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center active:bg-emerald-500/20"
            >
              <Text className="text-emerald-400 font-black text-sm">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swap Mode Buttons */}
        {isSwapMode ? (
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!isSwapBalanced}
              onPress={onConfirmSwap}
              className={`px-4 py-2 rounded-xl border ${
                isSwapBalanced
                  ? "bg-emerald-500 border-emerald-400 shadow-emerald-900/50 shadow-md"
                  : "bg-slate-800 border-slate-700 opacity-50"
              }`}
            >
              <Text
                className={`font-black text-xs ${
                  isSwapBalanced ? "text-slate-950" : "text-slate-400"
                }`}
              >
                Confirmar ({selectedCourtCount} ↔ {selectedBenchPlayerIds.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancelSwap}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700"
            >
              <Text className="text-slate-300 font-bold text-xs">Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isTimerRunning}
            onPress={onToggleSwapMode}
            className={`px-5 py-2.5 rounded-xl border flex-row items-center space-x-2 ${
              isTimerRunning
                ? "bg-slate-800/50 border-slate-800 opacity-40"
                : "bg-amber-500 border-amber-400 shadow-amber-900/40 shadow-md"
            }`}
          >
            <Text className={`font-black text-sm ${isTimerRunning ? "text-slate-400" : "text-slate-950"}`}>
              ⇄ Cambios (Swap)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Swap Mode Notice Banner */}
      {isSwapMode && (
        <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 mb-2">
          <Text className="text-amber-400 text-xs font-semibold text-center">
            Modo Cambios: Selecciona igual cantidad de jugadores en pista ({selectedCourtCount}) y en banquillo ({selectedBenchPlayerIds.length})
          </Text>
        </View>
      )}

      {/* Bench Section: Horizontal List of Player Circles */}
      <View>
        <View className="flex-row justify-between items-center mb-1.5 px-1">
          <Text className="text-slate-400 text-[10px] font-bold tracking-wider uppercase">
            Banquillo ({benchPlayers.length} jugadores)
          </Text>
          {isSwapMode && (
            <Text className="text-slate-500 text-[10px]">Toca jugadores para intercambiar</Text>
          )}
        </View>

        {benchPlayers.length === 0 ? (
          <View className="py-4 items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800">
            <Text className="text-slate-500 text-xs">Todos los convocados están en pista</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-1"
            contentContainerStyle={{ paddingHorizontal: 2 }}
          >
            {benchPlayers.map((player) => {
              const isSelected = selectedBenchPlayerIds.includes(player.id);
              const pts = calculatePts(player);

              return (
                <TouchableOpacity
                  key={`bench-${player.id}`}
                  activeOpacity={0.7}
                  onPress={() => onSelectBenchPlayer(player)}
                  className={`items-center justify-center w-16 h-16 rounded-full border-2 mr-3 shadow-md ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-500/30 scale-105 shadow-emerald-500/40"
                      : isSwapMode
                      ? "border-slate-600 bg-slate-800 active:border-emerald-400"
                      : "border-slate-700 bg-slate-800/90"
                  }`}
                >
                  <View className="items-center">
                    <View className="flex-row items-center space-x-0.5">
                      <Text className="text-white font-black text-xs">#{player.number}</Text>
                    </View>
                    <Text className="text-slate-300 font-bold text-[8px]" numberOfLines={1}>
                      {player.firstName}
                    </Text>
                    <Text className="text-emerald-400 font-mono text-[7px]">
                      {formatTime(player.secondsPlayed)}
                    </Text>
                    <Text className="text-amber-300 font-extrabold text-[8px]">{pts}P</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};
