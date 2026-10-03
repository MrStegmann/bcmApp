import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HalfCourtCanvasProps, InGamePlayer } from "../types";

export const HalfCourtCanvas: React.FC<HalfCourtCanvasProps> = ({
  courtPlayers,
  isSwapMode,
  selectedCourtPlayerIds,
  onSelectCourtPosition,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculatePts = (p: InGamePlayer): number => {
    return p.t1a * 1 + p.t2a * 2 + p.t3a * 3;
  };

  // 5 positional layout anchors for half-court:
  // 0: Point Guard (Top Center)
  // 1: Left Wing (Upper Left)
  // 2: Right Wing (Upper Right)
  // 3: Left Post (Low Left)
  // 4: Right Post (Low Right)
  const renderPlayerSlot = (index: number, player: InGamePlayer | null) => {
    const isSelected = player ? selectedCourtPlayerIds.includes(player.id) : false;

    if (!player) {
      return (
        <TouchableOpacity
          key={`slot-${index}`}
          activeOpacity={0.7}
          onPress={() => onSelectCourtPosition(index, null)}
          className="items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-amber-500/50 bg-slate-900/80 p-1 shadow-lg active:bg-amber-500/20"
        >
          <Text className="text-amber-400 font-extrabold text-base">+</Text>
          <Text className="text-amber-300 font-semibold text-[10px] text-center">Pos #{index + 1}</Text>
        </TouchableOpacity>
      );
    }

    const pts = calculatePts(player);

    return (
      <TouchableOpacity
        key={`player-${player.id}`}
        activeOpacity={0.8}
        onPress={() => onSelectCourtPosition(index, player)}
        className={`items-center justify-center w-20 h-20 rounded-full border-2 shadow-xl p-1 ${
          isSelected
            ? "border-amber-400 bg-amber-500/30 scale-105 shadow-amber-500/50"
            : isSwapMode
            ? "border-slate-500 bg-slate-800/90"
            : "border-amber-500/80 bg-slate-900/90 shadow-slate-950"
        }`}
      >
        <View className="items-center">
          <View className="flex-row items-center space-x-1">
            <Text className="text-amber-400 font-black text-sm">#{player.number}</Text>
            <Text className="text-white font-bold text-[10px]" numberOfLines={1}>
              {player.firstName}
            </Text>
          </View>
          <Text className="text-emerald-400 font-mono font-bold text-[9px]">
            {formatTime(player.secondsPlayed)}
          </Text>
          <View className="bg-amber-500/20 px-1.5 py-0.5 rounded mt-0.5 border border-amber-500/40">
            <Text className="text-amber-300 font-extrabold text-[9px]">{pts} PTS</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-slate-950 border border-slate-800 rounded-2xl mx-3 my-2 overflow-hidden shadow-2xl relative">
      {/* Basketball Half-Court Visual Lines */}
      <View className="h-72 w-full relative items-center justify-between p-3 bg-slate-950">
        {/* Outer 3-Point Arc */}
        <View className="absolute top-0 w-64 h-56 rounded-b-full border-2 border-slate-800/80 pointer-events-none" />

        {/* Free Throw Key / Paint Area */}
        <View className="absolute top-0 w-36 h-40 border-x-2 border-b-2 border-slate-800/80 bg-slate-900/40 pointer-events-none items-center">
          {/* Free Throw Circle */}
          <View className="absolute bottom-[-24px] w-24 h-24 rounded-full border-2 border-slate-800/80 pointer-events-none" />
          {/* Basket Ring & Backboard */}
          <View className="w-16 h-1 bg-amber-500/60 mt-2 rounded" />
          <View className="w-6 h-6 rounded-full border border-orange-500/80 mt-1" />
        </View>

        {/* Court Positions Layout */}
        {/* Top Position: Point Guard (Pos 0) */}
        <View className="w-full items-center z-10 pt-1">
          {renderPlayerSlot(0, courtPlayers[0] || null)}
        </View>

        {/* Middle Wings: Left Wing (Pos 1) & Right Wing (Pos 2) */}
        <View className="w-full flex-row justify-between px-2 z-10">
          {renderPlayerSlot(1, courtPlayers[1] || null)}
          {renderPlayerSlot(2, courtPlayers[2] || null)}
        </View>

        {/* Lower Posts: Left Post (Pos 3) & Right Post (Pos 4) */}
        <View className="w-full flex-row justify-around px-8 z-10 pb-1">
          {renderPlayerSlot(3, courtPlayers[3] || null)}
          {renderPlayerSlot(4, courtPlayers[4] || null)}
        </View>
      </View>
    </View>
  );
};
