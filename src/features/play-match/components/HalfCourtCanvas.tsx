import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HalfCourtCanvasProps, InGamePlayer } from "../types";

export const HalfCourtCanvas: React.FC<HalfCourtCanvasProps> = ({
  courtPlayers,
  isSwapMode,
  selectedCourtPlayerIds,
  onSelectCourtPosition,
}) => {
  const calculatePts = (p: InGamePlayer): number => {
    if (!p) return 0;
    return Number(p.t1a || 0) * 1 + Number(p.t2a || 0) * 2 + Number(p.t3a || 0) * 3;
  };

  // 5 positional layout anchors for half-court:
  // 0: Point Guard (Top Center)
  // 1: Left Wing (Upper Left)
  // 2: Right Wing (Upper Right)
  // 3: Left Post (Low Left)
  // 4: Right Post (Low Right)
  const renderPlayerSlot = (index: number, player: InGamePlayer | null) => {
    const pId = player ? Number(player.id) : null;
    const isSelected = pId !== null
      ? selectedCourtPlayerIds.some((id) => Number(id) === pId)
      : false;

    if (!player) {
      return (
        <TouchableOpacity
          key={`slot-${index}`}
          activeOpacity={0.7}
          onPress={() => onSelectCourtPosition(index, null)}
          testID={`court-slot-${index}`}
          className="items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-amber-500 bg-slate-900 p-1 shadow-lg"
        >
          <Text className="text-amber-400 font-extrabold text-base">+</Text>
          <Text className="text-amber-300 font-semibold text-[9px] text-center">Pos #{index + 1}</Text>
        </TouchableOpacity>
      );
    }

    const min = Math.floor(player.secondsPlayed / 60);
    const pts = calculatePts(player);

    return (
      <TouchableOpacity
        key={`player-${player.id}`}
        activeOpacity={0.8}
        onPress={() => onSelectCourtPosition(index, player)}
        testID={`court-player-${player.id}`}
        className={`items-center justify-center w-20 h-20 rounded-full shadow-lg p-1 relative ${
          isSelected
            ? "border-4 border-amber-400 bg-amber-900"
            : isSwapMode
            ? "border-2 border-slate-500 bg-slate-800"
            : "border-2 border-amber-500 bg-slate-900"
        }`}
      >
        {isSelected && (
          <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 items-center justify-center border border-slate-950 z-20">
            <Text className="text-slate-950 font-black text-[9px]">✓</Text>
          </View>
        )}
        <View className="items-center justify-center w-full px-1">
          {/* #JerseyNumber first and biggest */}
          <Text className="text-amber-400 font-black text-base leading-tight">#{player.number}</Text>
          
          {/* playerName Below the jersey number and smallest */}
          <Text className="text-slate-200 font-semibold text-[8px] leading-tight" numberOfLines={1}>
            {player.firstName}
          </Text>
          
          {/* Divisor line */}
          <View className="w-12 h-px bg-slate-700 my-0.5" />
          
          {/* Below the player name, separated by a divisor line: ${min}min / ${pts}pts */}
          <Text className="text-emerald-400 font-mono font-bold text-[8px] leading-tight">
            {min}min / {pts}pts
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-slate-950 border border-slate-800 rounded-2xl mx-3 my-2 overflow-hidden shadow-2xl relative">
      {/* Basketball Half-Court Visual Lines */}
      <View className="h-72 w-full relative items-center justify-between p-3 bg-slate-950">
        {/* Outer 3-Point Arc */}
        <View
          pointerEvents="none"
          className="absolute top-0 w-64 h-56 rounded-b-full border-2 border-slate-800/80"
        />

        {/* Free Throw Key / Paint Area */}
        <View
          pointerEvents="none"
          className="absolute top-0 w-36 h-40 border-x-2 border-b-2 border-slate-800/80 bg-slate-900/40 items-center"
        >
          {/* Free Throw Circle */}
          <View
            pointerEvents="none"
            className="absolute bottom-[-24px] w-24 h-24 rounded-full border-2 border-slate-800/80"
          />
          {/* Basket Ring & Backboard */}
          <View pointerEvents="none" className="w-16 h-1 bg-amber-500/60 mt-2 rounded" />
          <View pointerEvents="none" className="w-6 h-6 rounded-full border border-orange-500/80 mt-1" />
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

