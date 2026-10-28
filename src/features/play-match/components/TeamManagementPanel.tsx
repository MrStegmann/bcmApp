import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { InGamePlayer, TeamManagementPanelProps } from "../types";
import { formatPlayerIdentifier } from "../utils/formatPlayerIdentifier";

export const TeamManagementPanel: React.FC<TeamManagementPanelProps> = ({
  benchPlayers,
  isSwapMode,
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
  const calculatePts = (p: InGamePlayer): number => {
    if (!p) return 0;
    return Number(p.t1a || 0) * 1 + Number(p.t2a || 0) * 2 + Number(p.t3a || 0) * 3;
  };

  const isSwapBalanced =
    selectedCourtCount > 0 && selectedCourtCount === selectedBenchPlayerIds.length;

  return (
    <View className="bg-surface-container border-t border-slate-border p-3 shadow-lg">
      {/* Control Row: Timeout Controls & Swap Button spaced between */}
      <View className="flex-row items-center justify-between mb-2 px-1">
        {/* Timeout Control Widget */}
        <View className="flex-row items-center bg-surface-dim border border-slate-border rounded-xl px-2.5 py-1.5 space-x-2">
          <View>
            <Text className="text-slate-400 text-[10px] font-bold tracking-wider">TIEMPOS</Text>
            <Text className="text-court-orange font-extrabold text-sm text-center">
              {availableTimeouts}
            </Text>
          </View>
          <View className="flex-row items-center space-x-1 ml-1.5">
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={availableTimeouts <= 0}
              onPress={onDecreaseTimeout}
              testID="decrease-timeout-button"
              className={`w-8 h-8 rounded-lg items-center justify-center border ${availableTimeouts > 0
                ? "bg-surface-elevated border-slate-border active:bg-slate-border"
                : "bg-surface-dim border-slate-border/50 opacity-40"
                }`}
            >
              <Text className="text-rose-400 font-black text-sm">−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onIncreaseTimeout}
              testID="increase-timeout-button"
              className="w-8 h-8 rounded-lg bg-surface-elevated border border-slate-border items-center justify-center active:bg-slate-border"
            >
              <Text className="text-emerald-400 font-black text-sm">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swap Mode Buttons: Unrestricted (accessible whether clock is running or paused) */}
        {isSwapMode ? (
          <View className="flex-row items-center space-x-1.5 flex-shrink">
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!isSwapBalanced}
              onPress={onConfirmSwap}
              testID="confirm-swap-button"
              className={`px-3.5 py-2.5 min-h-[44px] rounded-xl border items-center justify-center ${isSwapBalanced
                ? "bg-court-orange border-court-orange active:bg-court-orange-dark shadow-md"
                : "bg-surface-elevated border-slate-border opacity-50"
                }`}
            >
              <Text
                className={`font-black text-xs ${isSwapBalanced ? "text-slate-950" : "text-slate-500"
                  }`}
              >
                Confirmar ({selectedCourtCount} ↔ {selectedBenchPlayerIds.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancelSwap}
              testID="cancel-swap-button"
              className="px-3 py-2.5 min-h-[44px] rounded-xl bg-surface-elevated border border-slate-border items-center justify-center active:bg-slate-border"
            >
              <Text className="text-slate-300 font-bold text-xs">Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Pressable
            onPress={onToggleSwapMode}
            testID="toggle-swap-button"
            className="px-4 py-2.5 min-h-[44px] rounded-xl flex-row items-center space-x-1.5 bg-court-orange border border-court-orange active:opacity-80 shadow-md"
          >
            <Text className="text-slate-950 font-black text-sm">
              ⇄ Cambios
            </Text>
          </Pressable>
        )}
      </View>

      {/* Swap Mode Notice Banner */}
      {isSwapMode && (
        <View
          className={`border rounded-xl p-2 mb-2 ${isSwapBalanced
            ? "bg-emerald-950/40 border-emerald-600/60"
            : "bg-court-orange/10 border-court-orange/40"
            }`}
        >
          <Text
            className={`text-xs font-semibold text-center ${isSwapBalanced ? "text-emerald-300" : "text-court-orange"
              }`}
          >
            {isSwapBalanced
              ? `✓ Cambio equilibrado listo (${selectedCourtCount} jugadores). Pulsa Confirmar.`
              : `Selecciona jugadores en pista (${selectedCourtCount}) y en banquillo (${selectedBenchPlayerIds.length}) en igual número.`}
          </Text>
        </View>
      )}

      {/* Bench Section Title */}
      <View className="flex-row items-center justify-between mb-1 px-1">
        <Text className="text-slate-400 text-[11px] font-bold tracking-wider">
          BANQUILLO ({benchPlayers.length})
        </Text>
      </View>

      {/* Horizontal Bench Scroll List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {benchPlayers.length === 0 ? (
          <View className="py-3 px-4 bg-surface-dim rounded-xl border border-slate-border">
            <Text className="text-slate-500 text-xs italic">
              No hay jugadores en el banquillo.
            </Text>
          </View>
        ) : (
          benchPlayers.sort((a, b) => (a.secondsPlayed || 0) - (b.secondsPlayed || 0)).map((player) => {
            const pId = Number(player.id);
            const isSelected = selectedBenchPlayerIds.some((id) => Number(id) === pId);
            const min = Math.floor((player.secondsPlayed || 0) / 60);
            const pts = calculatePts(player);
            const identifier = formatPlayerIdentifier(player);

            return (
              <TouchableOpacity
                key={player.id}
                activeOpacity={0.8}
                onPress={() => onSelectBenchPlayer(player)}
                testID={`bench-player-${player.id}`}
                className={`items-center justify-center w-12 h-12 rounded-full shadow-md mr-2 p-0.5 relative ${isSelected
                  ? "border-2 border-court-orange bg-court-orange/20"
                  : isSwapMode
                    ? "border border-tactical-blue/60 bg-tactical-blue/10"
                    : "border border-slate-border bg-surface-elevated"
                  }`}
              >
                {isSelected && (
                  <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-court-orange items-center justify-center border border-slate-950 z-20">
                    <Text className="text-slate-950 font-black text-[8px]">✓</Text>
                  </View>
                )}

                <View className="items-center justify-center w-full px-0.5">
                  {/* Top Line: Jersey Number */}
                  <Text
                    className="text-court-orange font-black text-xs leading-none text-center"
                    numberOfLines={1}
                  >
                    {player.number ? (String(player.number).startsWith("#") ? player.number : `#${player.number}`) : "#-"}
                  </Text>

                  {/* Second Line: Jersey Name or Fallback "F. Lastname" */}
                  <Text
                    className="text-white font-semibold text-[8px] leading-tight text-center mt-0.5"
                    numberOfLines={1}
                  >
                    {identifier}
                  </Text>

                  {/* Divisor line */}
                  <View className="w-7 h-px bg-slate-border my-0.5" />

                  {/* Cumulative Minutes / Points */}
                  <Text className="text-emerald-400 font-mono font-bold text-[8px] leading-none text-center">
                    {min}min
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};
