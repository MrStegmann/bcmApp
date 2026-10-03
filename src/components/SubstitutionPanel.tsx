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
      <View className="px-4 py-2 bg-slate-900 border-t border-slate-800">
        <TouchableOpacity
          onPress={onToggleChangeMode}
          disabled={isTimerRunning}
          className={`py-3 px-4 rounded-xl flex-row items-center justify-center ${
            isTimerRunning
              ? "bg-slate-800 opacity-50"
              : "bg-blue-600 active:bg-blue-700"
          }`}
        >
          <Text className="text-white font-bold text-base">
            🔄 Cambios de Jugador
          </Text>
        </TouchableOpacity>
        {isTimerRunning && (
          <Text className="text-amber-400 text-xs text-center mt-1 font-medium">
            ⏱️ Pausa el cronómetro para realizar sustituciones
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="bg-slate-900 border-t-2 border-blue-500/50 p-4">
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
          className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700"
        >
          <Text className="text-slate-300 font-semibold text-xs">Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* Counters & Status */}
      <View className="flex-row items-center justify-around bg-slate-800/80 rounded-xl p-2.5 mb-3 border border-slate-700/60">
        <View className="items-center">
          <Text className="text-slate-400 text-xs">Pista (Salen)</Text>
          <Text className="text-orange-400 font-extrabold text-lg">
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
          <View className="py-3 px-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
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
                className={`mr-2.5 px-3 py-2 rounded-xl border items-center justify-center min-w-[90px] ${
                  isSelected
                    ? "bg-emerald-600/30 border-emerald-400"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                <View className="flex-row items-center space-x-1 mb-0.5">
                  <Text
                    className={`font-black text-sm ${
                      isSelected ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    #{player.number}
                  </Text>
                  {isSelected && (
                    <Text className="text-emerald-400 font-bold text-xs">✓</Text>
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
        className={`py-3 rounded-xl items-center justify-center ${
          isValidSwap
            ? "bg-emerald-600 active:bg-emerald-700"
            : "bg-slate-800 opacity-50"
        }`}
      >
        <Text className="text-white font-bold text-sm">
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
