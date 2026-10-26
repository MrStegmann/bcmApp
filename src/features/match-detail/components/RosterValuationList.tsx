import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { RosterValuationListProps } from "../types";

export const RosterValuationList: React.FC<RosterValuationListProps> = ({
  players,
  onSelectPlayer,
}) => {
  if (players.length === 0) {
    return (
      <View className="w-full bg-surface px-4 py-3">
        <Text className="text-white font-bold text-sm tracking-wide uppercase mb-2">
          Estadísticas de Jugadores (Por Valoración)
        </Text>
        <View className="bg-slate-card rounded-xl p-4 border border-slate-border items-center justify-center">
          <Text className="text-on-surface-variant text-sm">
            No hay jugadores registrados en este partido.
          </Text>
        </View>
      </View>
    );
  }

  const mvpPlayer = players[0];
  const remainingPlayers = players.slice(1);

  return (
    <View className="w-full bg-surface px-4 py-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-bold text-sm tracking-wide uppercase">
          Roster por Valoración
        </Text>
        <Text className="text-on-surface-variant text-xs">
          Toca un jugador para ver detalles
        </Text>
      </View>

      {/* Top MVP Card (Full Width) */}
      {mvpPlayer && (
        <TouchableOpacity
          key={`${mvpPlayer.id}-${mvpPlayer.statId}`}
          onPress={() => onSelectPlayer(mvpPlayer)}
          activeOpacity={0.7}
          className="w-full flex-row items-center justify-between p-3.5 rounded-xl border bg-court-orange/15 border-court-orange/40 mb-3 min-h-[48px]"
          testID={`player-roster-item-${mvpPlayer.id}`}
        >
          {/* Left Side: Jersey & Name */}
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-court-orange/20 border border-court-orange/50">
              <Text className="font-black text-sm text-court-orange">
                #{mvpPlayer.jerseyNumber || "0"}
              </Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center">
                <Text
                  className="text-white font-bold text-base"
                  numberOfLines={1}
                >
                  {mvpPlayer.fullName || "Jugador"}
                </Text>
                <View className="ml-2 px-2 py-0.5 rounded bg-court-orange/25 border border-court-orange/40">
                  <Text className="text-court-orange font-extrabold text-[11px] uppercase tracking-wider">
                    MVP
                  </Text>
                </View>
              </View>
              <Text className="text-on-surface-variant text-xs font-medium">
                {mvpPlayer.seconds
                  ? `${mvpPlayer.minutes}:${String(mvpPlayer.seconds).padStart(2, "0")} min`
                  : `${mvpPlayer.minutes} min`}
              </Text>
            </View>
          </View>

          {/* Right Side: Points & Valuation Badges */}
          <View className="flex-row items-center">
            <View className="items-end mr-3">
              <Text className="text-court-orange font-extrabold text-lg">
                {mvpPlayer.points}
              </Text>
              <Text className="text-on-surface-variant text-[10px] uppercase font-semibold">
                Pts
              </Text>
            </View>

            <View
              className={`px-3 py-1.5 rounded-lg items-center justify-center min-w-[58px] ${
                mvpPlayer.valuation >= 15
                  ? "bg-court-green/20 border border-court-green/40"
                  : mvpPlayer.valuation > 0
                  ? "bg-tactical-blue/20 border border-tactical-blue/40"
                  : mvpPlayer.valuation === 0
                  ? "bg-slate-card border border-slate-border"
                  : "bg-court-red/20 border border-court-red/40"
              }`}
            >
              <Text
                className={`font-black text-base ${
                  mvpPlayer.valuation >= 15
                    ? "text-court-green"
                    : mvpPlayer.valuation > 0
                    ? "text-tactical-blue-light"
                    : mvpPlayer.valuation === 0
                    ? "text-on-surface"
                    : "text-court-red"
                }`}
              >
                {mvpPlayer.valuation}
              </Text>
              <Text className="text-on-surface-variant text-[9px] uppercase font-semibold">
                Val
              </Text>
            </View>

            <Feather
              name="chevron-right"
              size={18}
              color="#F97316"
              style={{ marginLeft: 6 }}
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Remaining Players 2-Column Grid */}
      {remainingPlayers.length > 0 && (
        <View className="flex-row flex-wrap justify-between" testID="roster-grid-container">
          {remainingPlayers.map((player) => (
            <View key={`${player.id}-${player.statId}`} className="w-[48.5%] mb-2.5">
              <TouchableOpacity
                onPress={() => onSelectPlayer(player)}
                activeOpacity={0.7}
                className="bg-slate-card border border-slate-border active:bg-slate-dark p-3 rounded-xl justify-between min-h-[48px]"
                testID={`player-roster-item-${player.id}`}
              >
                {/* Header inside card: Jersey, Name, Minutes */}
                <View className="flex-row items-center mb-2">
                  <View className="w-7 h-7 rounded-full items-center justify-center mr-2 bg-slate-dark border border-slate-border">
                    <Text className="font-black text-xs text-on-surface">
                      #{player.jerseyNumber || "0"}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-white font-bold text-xs"
                      numberOfLines={1}
                    >
                      {player.fullName || "Jugador"}
                    </Text>
                    <Text className="text-on-surface-variant text-[10px]">
                      {player.seconds
                        ? `${player.minutes}:${String(player.seconds).padStart(2, "0")} min`
                        : `${player.minutes} min`}
                    </Text>
                  </View>
                </View>

                {/* Footer inside card: Points & Valuation */}
                <View className="flex-row items-center justify-between pt-1 border-t border-slate-border/50">
                  <View className="flex-row items-baseline">
                    <Text className="text-court-orange font-extrabold text-sm mr-1">
                      {player.points}
                    </Text>
                    <Text className="text-on-surface-variant text-[9px] uppercase font-semibold">
                      Pts
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-0.5 rounded items-center justify-center ${
                      player.valuation >= 15
                        ? "bg-court-green/20 border border-court-green/40"
                        : player.valuation > 0
                        ? "bg-tactical-blue/20 border border-tactical-blue/40"
                        : player.valuation === 0
                        ? "bg-slate-dark border border-slate-border"
                        : "bg-court-red/20 border border-court-red/40"
                    }`}
                  >
                    <Text
                      className={`font-black text-xs ${
                        player.valuation >= 15
                          ? "text-court-green"
                          : player.valuation > 0
                          ? "text-tactical-blue-light"
                          : player.valuation === 0
                          ? "text-on-surface"
                          : "text-court-red"
                      }`}
                    >
                      {player.valuation}{" "}
                      <Text className="text-[8px] font-semibold text-on-surface-variant">Val</Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default RosterValuationList;
