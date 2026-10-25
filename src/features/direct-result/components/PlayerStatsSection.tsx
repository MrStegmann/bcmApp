import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Player } from "../../../types/database";
import { PlayerStatsSectionProps, PlayerStatInput } from "../types";
import { calculatePlayerPoints, calculateValuation } from "../utils/directResultCalculations";

export const PlayerStatsSection: React.FC<PlayerStatsSectionProps> = ({
  players,
  playerStats,
  onUpdateStat,
}) => {
  // Track expanded cards by playerId; by default keep first player expanded or expand all
  const [expandedPlayers, setExpandedPlayers] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    if (players.length > 0) {
      init[players[0].id] = true;
    }
    return init;
  });

  const toggleExpand = (playerId: number) => {
    setExpandedPlayers((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };

  if (!players || players.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8 mt-12">
        <Feather name="users" size={40} color="#64748B" />
        <Text className="text-base font-bold text-white text-center mt-3">
          Sin jugadores disponibles
        </Text>
        <Text className="text-xs text-on-surface-variant text-center mt-1">
          No se encontraron jugadores asignados a la convocatoria o equipo.
        </Text>
      </View>
    );
  }

  const renderStatInput = (
    label: string,
    value: number,
    field: keyof Omit<PlayerStatInput, "playerId" | "statId">,
    playerId: number,
    testID: string
  ) => {
    return (
      <View className="flex-1 min-w-[70px]">
        <Text className="text-[10px] text-on-surface-variant mb-0.5">{label}</Text>
        <TextInput
          testID={testID}
          keyboardType="numeric"
          value={value > 0 ? String(value) : ""}
          placeholder="0"
          placeholderTextColor="#64748B"
          onChangeText={(val) => onUpdateStat(playerId, field, val)}
          className="bg-slate-dark text-white text-center font-bold text-xs py-1.5 px-1.5 rounded-md border border-slate-border focus:border-primary"
        />
      </View>
    );
  };

  return (
    <ScrollView
      className="flex-1 w-full px-4"
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
    >
      {players.map((player) => {
        const stats: PlayerStatInput = playerStats[player.id] || {
          playerId: player.id,
          minutes: 0,
          t1a: 0,
          t1i: 0,
          t2a: 0,
          t2i: 0,
          t3a: 0,
          t3i: 0,
          oreb: 0,
          dreb: 0,
          asis: 0,
          rec: 0,
          per: 0,
          falt: 0,
        };

        const points = calculatePlayerPoints(stats);
        const valuation = calculateValuation(stats);
        const isExpanded = !!expandedPlayers[player.id];

        return (
          <View
            key={player.id}
            className="mb-3 rounded-xl bg-slate-card border border-slate-border overflow-hidden"
          >
            {/* Header Accordion Bar */}
            <TouchableOpacity
              onPress={() => toggleExpand(player.id)}
              className="p-3 flex-row items-center justify-between active:bg-slate-dark/50"
            >
              <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                <View className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 items-center justify-center">
                  <Text className="text-xs font-black text-primary">
                    #{player.number || "0"}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-bold text-white truncate">
                    {player.firstName} {player.lastName}
                  </Text>
                  {player.jerseyName && (
                    <Text className="text-[10px] text-on-surface-variant font-medium">
                      {player.jerseyName}
                    </Text>
                  )}
                </View>
              </View>

              {/* Badges for PTS & VAL */}
              <View className="flex-row items-center gap-2">
                <View className="px-2 py-0.5 rounded-full bg-court-orange/20 border border-court-orange/50">
                  <Text className="text-[10px] font-extrabold text-court-orange">
                    {points} PTS
                  </Text>
                </View>

                <View
                  className={`px-2 py-0.5 rounded-full border ${
                    valuation >= 0
                      ? "bg-court-green/20 border-court-green/50"
                      : "bg-red-500/20 border-red-500/50"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-extrabold ${
                      valuation >= 0 ? "text-court-green" : "text-red-400"
                    }`}
                  >
                    VAL {valuation}
                  </Text>
                </View>

                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#94A3B8"
                />
              </View>
            </TouchableOpacity>

            {/* Expanded Stat Entry Form */}
            {isExpanded && (
              <View className="p-3 pt-1 border-t border-slate-border/40 gap-3">
                {/* General & Minutes */}
                <View className="flex-row gap-2 items-center">
                  <View className="w-[100px]">
                    {renderStatInput(
                      "Minutos (MIN)",
                      stats.minutes,
                      "minutes",
                      player.id,
                      `input-player-${player.id}-minutes`
                    )}
                  </View>
                  <View className="flex-1 items-end justify-center">
                    <Text className="text-[11px] text-on-surface-variant">
                      Puntos calculados: <Text className="font-bold text-white">{points}</Text>
                    </Text>
                  </View>
                </View>

                {/* Shooting Section: 1PT, 2PT, 3PT */}
                <View className="bg-slate-dark/50 p-2.5 rounded-lg border border-slate-border/30">
                  <Text className="text-[11px] font-bold text-primary mb-2">Tiros</Text>
                  <View className="gap-2">
                    {/* Free Throws (1PT) */}
                    <View className="flex-row items-center gap-2">
                      <Text className="w-14 text-xs font-semibold text-white">T. Libres</Text>
                      {renderStatInput(
                        "Anotados (T1A)",
                        stats.t1a,
                        "t1a",
                        player.id,
                        `input-player-${player.id}-t1a`
                      )}
                      {renderStatInput(
                        "Intentos (T1I)",
                        stats.t1i,
                        "t1i",
                        player.id,
                        `input-player-${player.id}-t1i`
                      )}
                    </View>

                    {/* 2-Pointers */}
                    <View className="flex-row items-center gap-2">
                      <Text className="w-14 text-xs font-semibold text-white">Tiros 2P</Text>
                      {renderStatInput(
                        "Anotados (T2A)",
                        stats.t2a,
                        "t2a",
                        player.id,
                        `input-player-${player.id}-t2a`
                      )}
                      {renderStatInput(
                        "Intentos (T2I)",
                        stats.t2i,
                        "t2i",
                        player.id,
                        `input-player-${player.id}-t2i`
                      )}
                    </View>

                    {/* 3-Pointers */}
                    <View className="flex-row items-center gap-2">
                      <Text className="w-14 text-xs font-semibold text-white">Triples 3P</Text>
                      {renderStatInput(
                        "Anotados (T3A)",
                        stats.t3a,
                        "t3a",
                        player.id,
                        `input-player-${player.id}-t3a`
                      )}
                      {renderStatInput(
                        "Intentos (T3I)",
                        stats.t3i,
                        "t3i",
                        player.id,
                        `input-player-${player.id}-t3i`
                      )}
                    </View>
                  </View>
                </View>

                {/* Rebounds & Playmaking */}
                <View className="bg-slate-dark/50 p-2.5 rounded-lg border border-slate-border/30">
                  <Text className="text-[11px] font-bold text-primary mb-2">
                    Rebotes y Juego
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {renderStatInput(
                      "Reb. Of (OREB)",
                      stats.oreb,
                      "oreb",
                      player.id,
                      `input-player-${player.id}-oreb`
                    )}
                    {renderStatInput(
                      "Reb. Def (DREB)",
                      stats.dreb,
                      "dreb",
                      player.id,
                      `input-player-${player.id}-dreb`
                    )}
                    {renderStatInput(
                      "Asist (ASIS)",
                      stats.asis,
                      "asis",
                      player.id,
                      `input-player-${player.id}-asis`
                    )}
                  </View>

                  <View className="flex-row flex-wrap gap-2 mt-2">
                    {renderStatInput(
                      "Robos (REC)",
                      stats.rec,
                      "rec",
                      player.id,
                      `input-player-${player.id}-rec`
                    )}
                    {renderStatInput(
                      "Pérdidas (PER)",
                      stats.per,
                      "per",
                      player.id,
                      `input-player-${player.id}-per`
                    )}
                    {renderStatInput(
                      "Faltas (FALT)",
                      stats.falt,
                      "falt",
                      player.id,
                      `input-player-${player.id}-falt`
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default PlayerStatsSection;
