import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { RosterValuationListProps, PlayerRosterItem } from "../types";

export const RosterValuationList: React.FC<RosterValuationListProps> = ({
  players,
  onSelectPlayer,
}) => {
  if (players.length === 0) {
    return (
      <View className="w-full bg-slate-900 px-4 py-3">
        <Text className="text-slate-200 font-bold text-sm tracking-wide uppercase mb-2">
          Estadísticas de Jugadores (Por Valoración)
        </Text>
        <View className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 items-center justify-center">
          <Text className="text-slate-400 text-sm">
            No hay jugadores registrados en este partido.
          </Text>
        </View>
      </View>
    );
  }

  const mvpPlayer = players[0];
  const remainingPlayers = players.slice(1);

  return (
    <View className="w-full bg-slate-900 px-4 py-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-slate-200 font-bold text-sm tracking-wide uppercase">
          Roster por Valoración
        </Text>
        <Text className="text-slate-400 text-xs">
          Toca un jugador para ver detalles
        </Text>
      </View>

      {/* Top MVP Card (Full Width) */}
      {mvpPlayer && (
        <TouchableOpacity
          key={`${mvpPlayer.id}-${mvpPlayer.statId}`}
          onPress={() => onSelectPlayer(mvpPlayer)}
          activeOpacity={0.7}
          className="w-full flex-row items-center justify-between p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/40 mb-3"
          testID={`player-roster-item-${mvpPlayer.id}`}
        >
          {/* Left Side: Jersey & Name */}
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-amber-500/20 border border-amber-400/50">
              <Text className="font-black text-sm text-amber-400">
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
                <View className="ml-2 px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/40">
                  <Text className="text-amber-300 font-extrabold text-[11px] uppercase tracking-wider">
                    MVP
                  </Text>
                </View>
              </View>
              <Text className="text-slate-400 text-xs font-medium">
                {mvpPlayer.minutes} min
              </Text>
            </View>
          </View>

          {/* Right Side: Points & Valuation Badges */}
          <View className="flex-row items-center">
            <View className="items-end mr-3">
              <Text className="text-emerald-400 font-extrabold text-lg">
                {mvpPlayer.points}
              </Text>
              <Text className="text-slate-400 text-[10px] uppercase font-semibold">
                Pts
              </Text>
            </View>

            <View
              className={`px-3 py-1.5 rounded-lg items-center justify-center min-w-[58px] ${
                mvpPlayer.valuation >= 15
                  ? "bg-emerald-500/20 border border-emerald-500/40"
                  : mvpPlayer.valuation > 0
                  ? "bg-sky-500/20 border border-sky-500/40"
                  : mvpPlayer.valuation === 0
                  ? "bg-slate-700/60 border border-slate-600/60"
                  : "bg-rose-500/20 border border-rose-500/40"
              }`}
            >
              <Text
                className={`font-black text-base ${
                  mvpPlayer.valuation >= 15
                    ? "text-emerald-300"
                    : mvpPlayer.valuation > 0
                    ? "text-sky-300"
                    : mvpPlayer.valuation === 0
                    ? "text-slate-300"
                    : "text-rose-300"
                }`}
              >
                {mvpPlayer.valuation}
              </Text>
              <Text className="text-slate-400 text-[9px] uppercase font-semibold">
                Val
              </Text>
            </View>

            <Feather
              name="chevron-right"
              size={18}
              color="#fbbf24"
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
                className="bg-slate-800/80 border border-slate-700/80 active:bg-slate-750 p-2.5 rounded-xl justify-between"
                testID={`player-roster-item-${player.id}`}
              >
                {/* Header inside card: Jersey, Name, Minutes */}
                <View className="flex-row items-center mb-2">
                  <View className="w-7 h-7 rounded-full items-center justify-center mr-2 bg-slate-700 border border-slate-600">
                    <Text className="font-black text-xs text-slate-200">
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
                    <Text className="text-slate-400 text-[10px]">
                      {player.minutes} min
                    </Text>
                  </View>
                </View>

                {/* Footer inside card: Points & Valuation */}
                <View className="flex-row items-center justify-between pt-1 border-t border-slate-700/50">
                  <View className="flex-row items-baseline">
                    <Text className="text-emerald-400 font-extrabold text-sm mr-1">
                      {player.points}
                    </Text>
                    <Text className="text-slate-400 text-[9px] uppercase font-semibold">
                      Pts
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-0.5 rounded items-center justify-center ${
                      player.valuation >= 15
                        ? "bg-emerald-500/20 border border-emerald-500/40"
                        : player.valuation > 0
                        ? "bg-sky-500/20 border border-sky-500/40"
                        : player.valuation === 0
                        ? "bg-slate-700/60 border border-slate-600/60"
                        : "bg-rose-500/20 border border-rose-500/40"
                    }`}
                  >
                    <Text
                      className={`font-black text-xs ${
                        player.valuation >= 15
                          ? "text-emerald-300"
                          : player.valuation > 0
                          ? "text-sky-300"
                          : player.valuation === 0
                          ? "text-slate-300"
                          : "text-rose-300"
                      }`}
                    >
                      {player.valuation}{" "}
                      <Text className="text-[8px] font-semibold text-slate-400">Val</Text>
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
