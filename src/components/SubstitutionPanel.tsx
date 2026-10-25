import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SubstitutionPanelProps, InGamePlayer } from "../types/match";
import { calculatePlayerPoints } from "../store/GameStore";

export const SubstitutionPanel: React.FC<SubstitutionPanelProps> = ({
  isChangeMode,
  isTimerRunning,
  onToggleChangeMode,
  benchPlayers,
  selectedCourtIds,
  selectedBenchIds,
  onToggleBenchPlayer,
  onConfirmSubstitution,
  onCancelSubstitution,
}) => {
  const courtCount = selectedCourtIds.length;
  const benchCount = selectedBenchIds.length;
  const isValidSwap = courtCount > 0 && courtCount === benchCount;

  if (!isChangeMode) {
    return (
      <View className="px-4 py-2 bg-surface-container border-t border-slate-border">
        <TouchableOpacity
          onPress={onToggleChangeMode}
          disabled={isTimerRunning}
          className={`py-3.5 min-h-[48px] px-4 rounded-xl flex-row items-center justify-center ${
            isTimerRunning
              ? "bg-surface-elevated opacity-50 border border-slate-border"
              : "bg-tactical-blue active:bg-tactical-blue-dark shadow-md"
          }`}
        >
          <Text className="text-white font-bold text-base">
            🔄 Cambios de Jugador
          </Text>
        </TouchableOpacity>
        {isTimerRunning && (
          <Text className="text-court-orange text-xs text-center mt-1 font-medium">
            ⏱️ Pausa el cronómetro para realizar sustituciones
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="bg-surface-container border-t-2 border-tactical-blue/60 p-4">
      {/* Header / Instructions */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-white font-bold text-base">
            🔄 Modo Sustituciones
          </Text>
          <Text className="text-slate-400 text-xs">
            Selecciona el mismo número de jugadores en pista y en banquillo
          </Text>
        </View>
        <TouchableOpacity
          onPress={onCancelSubstitution}
          className="px-3 py-2 min-h-[40px] bg-surface-elevated rounded-lg border border-slate-border items-center justify-center active:bg-slate-border"
        >
          <Text className="text-slate-300 font-semibold text-xs">Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* Counters & Status */}
      <View className="flex-row items-center justify-around bg-surface-dim rounded-xl p-3 mb-3 border border-slate-border">
        <View className="items-center">
          <Text className="text-slate-400 text-xs">Pista (Salen)</Text>
          <Text className="text-court-orange font-extrabold text-lg">
            {courtCount}
          </Text>
        </View>
        <Text className="text-slate-500 font-bold text-lg">⇄</Text>
        <View className="items-center">
          <Text className="text-slate-400 text-xs">Banquillo (Entran)</Text>
          <Text className="text-emerald-400 font-extrabold text-lg">
            {benchCount}
          </Text>
        </View>
      </View>

      {/* Bench Player List */}
      <Text className="text-slate-300 font-bold text-xs uppercase tracking-wider mb-2">
        Banquillo ({benchPlayers.length})
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-3"
      >
        {benchPlayers.length === 0 ? (
          <View className="py-3 px-4 bg-surface-dim rounded-lg border border-slate-border">
            <Text className="text-slate-400 text-xs">
              No hay jugadores en el banquillo
            </Text>
          </View>
        ) : (
          benchPlayers.map((player) => {
            const isSelected = selectedBenchIds.includes(player.id);
            const minutesPlayed = Math.floor(player.secondsPlayed / 60);
            const points = calculatePlayerPoints(player);

            return (
              <TouchableOpacity
                key={player.id}
                onPress={() => onToggleBenchPlayer(player.id)}
                className={`mr-2.5 px-3 py-2.5 rounded-xl border items-center justify-center min-w-[96px] min-h-[56px] ${
                  isSelected
                    ? "bg-court-orange/20 border-court-orange shadow-md"
                    : "bg-surface-elevated border-slate-border"
                }`}
              >
                <View className="flex-row items-center space-x-1 mb-0.5">
                  <Text
                    className={`font-black text-sm ${
                      isSelected ? "text-court-orange" : "text-white"
                    }`}
                  >
                    #{player.number}
                  </Text>
                  {isSelected && (
                    <Text className="text-court-orange font-bold text-xs">✓</Text>
                  )}
                </View>
                <Text
                  className="text-white font-semibold text-xs text-center"
                  numberOfLines={1}
                >
                  {player.firstName}
                </Text>
                <Text className="text-slate-400 text-[10px] mt-0.5">
                  {minutesPlayed}' · {points} pts
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Actions */}
      <TouchableOpacity
        onPress={onConfirmSubstitution}
        disabled={!isValidSwap}
        className={`py-3.5 min-h-[48px] rounded-xl items-center justify-center ${
          isValidSwap
            ? "bg-court-orange active:bg-court-orange-dark shadow-md"
            : "bg-surface-elevated border border-slate-border opacity-50"
        }`}
      >
        <Text className={`font-bold text-sm ${isValidSwap ? "text-slate-950" : "text-slate-500"}`}>
          {isValidSwap
            ? `Confirmar Cambio (${courtCount} ⇄ ${benchCount})`
            : courtCount === 0 && benchCount === 0
            ? "Selecciona jugadores para sustituir"
            : `Selección desigual (${courtCount} en pista vs ${benchCount} en banquillo)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
