import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { HalfCourtProps, InGamePlayer } from "../types/match";
import { calculatePlayerPoints } from "../store/GameStore";

export const HalfCourt: React.FC<HalfCourtProps> = ({
  courtPlayers,
  onSelectPlayer,
  isChangeMode = false,
  selectedPlayerIds = [],
}) => {
  // Ensure we have 5 player slots (fallback if roster loading)
  const players = courtPlayers.slice(0, 5);

  const renderPlayerCard = (player: InGamePlayer | undefined, index: number) => {
    if (!player) {
      return (
        <View
          key={`empty-${index}`}
          className="w-24 h-16 rounded-xl border border-dashed border-gray-700 bg-gray-900/60 items-center justify-center"
        >
          <Text className="text-[10px] text-gray-500 font-semibold">Vacío</Text>
        </View>
      );
    }

    const isSelected = selectedPlayerIds.includes(player.id);
    const pts = calculatePlayerPoints(player);
    const mins = Math.floor(player.secondsPlayed / 60);

    return (
      <TouchableOpacity
        key={player.id}
        activeOpacity={0.7}
        onPress={() => onSelectPlayer(player)}
        className={`w-28 py-1.5 px-2 rounded-2xl border shadow-lg items-center ${
          isSelected
            ? "bg-amber-950 border-danish-gold shadow-amber-500/20"
            : "bg-gray-950/90 border-gray-700 active:border-danish-gold"
        }`}
      >
        <View className="flex-row items-center gap-1.5 w-full justify-center">
          {/* Jersey Badge */}
          <View
            className={`w-6 h-6 rounded-full items-center justify-center font-bold border ${
              isSelected
                ? "bg-danish-gold border-danish-gold"
                : "bg-gray-800 border-gray-600"
            }`}
          >
            <Text
              className={`text-xs font-black ${
                isSelected ? "text-gray-950" : "text-danish-white"
              }`}
            >
              {player.number}
            </Text>
          </View>

          {/* Name */}
          <Text
            numberOfLines={1}
            className="text-xs font-bold text-danish-white flex-1 text-center"
          >
            {player.firstName}
          </Text>

          {isChangeMode && isSelected ? (
            <Feather name="check" size={12} color="#F59E0B" />
          ) : null}
        </View>

        {/* Live Min / Pts Metric */}
        <View className="flex-row items-center gap-1 mt-0.5">
          <Text className="text-[11px] font-extrabold text-danish-gold">
            {mins}'
          </Text>
          <Text className="text-[10px] text-gray-400 font-bold">/</Text>
          <Text className="text-[11px] font-extrabold text-emerald-400">
            {pts} pts
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-full h-72 bg-[#17202A] rounded-3xl border-2 border-danish-red/40 overflow-hidden relative my-2 items-center justify-between p-3 shadow-2xl">
      {/* Court Diagram Lines */}
      {/* Baseline (Top) */}
      <View className="absolute top-0 left-0 right-0 h-1 bg-white/20" />

      {/* Basket Hoop & Backboard */}
      <View className="absolute top-1 w-16 h-1 bg-white/60" />
      <View className="absolute top-2 w-7 h-7 rounded-full border-2 border-amber-500/80 bg-amber-500/10" />

      {/* Key / Paint Area */}
      <View className="absolute top-0 w-36 h-32 border-x-2 border-b-2 border-white/25 bg-danish-red/10" />

      {/* Free Throw Circle */}
      <View className="absolute top-24 w-28 h-28 rounded-full border-2 border-white/25 border-dashed" />

      {/* 3-Point Arc */}
      <View className="absolute -top-12 w-80 h-64 rounded-full border-2 border-white/30" />

      {/* Center Court Circle (Bottom) */}
      <View className="absolute bottom-0 w-36 h-18 rounded-t-full border-2 border-white/25 bg-white/5" />

      {/* 5 On-Court Player Positions */}
      {/* Top / Key (Center - Slot 5) */}
      <View className="z-10 mt-6 items-center">
        {renderPlayerCard(players[4], 4)}
      </View>

      {/* Wings (Slots 2 & 3) */}
      <View className="z-10 flex-row w-full justify-between px-1 -my-2">
        {renderPlayerCard(players[1], 1)}
        {renderPlayerCard(players[2], 2)}
      </View>

      {/* Perimeter / Guards (Slots 1 & 4) */}
      <View className="z-10 flex-row w-full justify-around px-2 mb-1">
        {renderPlayerCard(players[0], 0)}
        {renderPlayerCard(players[3], 3)}
      </View>
    </View>
  );
};

export default HalfCourt;
