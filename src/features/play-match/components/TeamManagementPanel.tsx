import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
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
    if (!p) return 0;
    return Number(p.t1a || 0) * 1 + Number(p.t2a || 0) * 2 + Number(p.t3a || 0) * 3;
  };

  const isSwapBalanced =
    selectedCourtCount > 0 && selectedCourtCount === selectedBenchPlayerIds.length;

  return (
    <View className="bg-slate-900 border-t border-slate-800 p-3 shadow-lg">
      {/* Control Row: Timeout Controls & Swap Button spaced between */}
      <View className="flex-row items-center justify-between mb-2 px-1">
        {/* Timeout Control Widget */}
        <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 space-x-2">
          <View>
            <Text className="text-slate-400 text-[10px] font-bold tracking-wider">TIEMPOS</Text>
            <Text className="text-amber-400 font-extrabold text-sm">
              {availableTimeouts} <Text className="text-slate-500 text-[10px] font-normal">disp.</Text>
            </Text>
          </View>
          <View className="flex-row items-center space-x-1 ml-1.5">
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={availableTimeouts <= 0}
              onPress={onDecreaseTimeout}
              testID="decrease-timeout-button"
              className={`w-7 h-7 rounded-lg items-center justify-center border ${
                availableTimeouts > 0
                  ? "bg-slate-800 border-slate-700"
                  : "bg-slate-900 border-slate-800 opacity-40"
              }`}
            >
              <Text className="text-rose-400 font-black text-sm">−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onIncreaseTimeout}
              testID="increase-timeout-button"
              className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center"
            >
              <Text className="text-emerald-400 font-black text-sm">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swap Mode Buttons */}
        {isSwapMode ? (
          <View className="flex-row items-center space-x-1.5 flex-shrink">
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!isSwapBalanced}
              onPress={onConfirmSwap}
              testID="confirm-swap-button"
              className={`px-3 py-2 rounded-xl border ${
                isSwapBalanced
                  ? "bg-emerald-500 border-emerald-400"
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
              testID="cancel-swap-button"
              className="px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700"
            >
              <Text className="text-slate-300 font-bold text-xs">Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Pressable
            disabled={isTimerRunning}
            onPress={onToggleSwapMode}
            testID="toggle-swap-button"
            style={({ pressed }) => ({
              backgroundColor: isTimerRunning ? "#1e293b" : "#f59e0b",
              borderColor: isTimerRunning ? "#1e293b" : "#fbbf24",
              borderWidth: 1,
              opacity: isTimerRunning ? 0.4 : pressed ? 0.8 : 1,
            })}
            className="px-4 py-2.5 rounded-xl flex-row items-center space-x-1.5"
          >
            <Text
              style={{ color: isTimerRunning ? "#94a3b8" : "#020617" }}
              className="font-black text-sm"
            >
              ⇄ Cambios (Swap)
            </Text>
          </Pressable>
        )}
      </View>

      {/* Swap Mode Notice Banner */}
      {isSwapMode && (
        <View
          className={`border rounded-xl p-2 mb-2 ${
            isSwapBalanced
              ? "bg-emerald-950 border-emerald-600"
              : "bg-amber-950 border-amber-600"
          }`}
        >
          <Text
            className={`text-xs font-semibold text-center ${
              isSwapBalanced ? "text-emerald-300" : "text-amber-400"
            }`}
          >
            {isSwapBalanced
              ? `✓ Listo para intercambiar ${selectedCourtCount} jugador(es)`
              : `Modo Cambios: Selecciona igual número en pista (${selectedCourtCount}) y banquillo (${selectedBenchPlayerIds.length})`}
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
            <Text className="text-amber-400 text-[10px] font-medium">Toca jugadores para seleccionar</Text>
          )}
        </View>

        {benchPlayers.length === 0 ? (
          <View className="py-4 items-center justify-center bg-slate-950 rounded-xl border border-slate-800">
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
              const pId = Number(player.id);
              const isSelected = selectedBenchPlayerIds.some(
                (id) => Number(id) === pId
              );
              const min = Math.floor(player.secondsPlayed / 60);
              const pts = calculatePts(player);

              return (
                <TouchableOpacity
                  key={`bench-${player.id}`}
                  activeOpacity={0.7}
                  onPress={() => onSelectBenchPlayer(player)}
                  testID={`bench-player-${player.id}`}
                  className={`items-center justify-center w-20 h-20 rounded-full mr-3 shadow-md p-1 relative ${
                    isSelected
                      ? "border-4 border-emerald-400 bg-emerald-900"
                      : isSwapMode
                      ? "border-2 border-slate-600 bg-slate-800"
                      : "border-2 border-slate-700 bg-slate-800"
                  }`}
                >
                  {isSelected && (
                    <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 items-center justify-center border border-slate-950 z-20">
                      <Text className="text-slate-950 font-black text-[9px]">✓</Text>
                    </View>
                  )}
                  <View className="items-center justify-center w-full px-1">
                    {/* #JerseyNumber first and biggest */}
                    <Text className="text-amber-400 font-black text-sm leading-tight">#{player.number}</Text>
                    
                    {/* playerName Below the jersey number and smallest */}
                    <Text className="text-slate-200 font-semibold text-[8px] leading-tight" numberOfLines={1}>
                      {player.firstName}
                    </Text>
                    
                    {/* Divisor line */}
                    <View className="w-10 h-px bg-slate-700 my-0.5" />
                    
                    {/* Below the player name, separated by a divisor line: ${min}min / ${pts}pts */}
                    <Text className="text-emerald-400 font-mono font-bold text-[8px] leading-tight">
                      {min}min / {pts}pts
                    </Text>
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
