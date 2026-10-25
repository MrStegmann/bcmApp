import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HalfCourtCanvasProps, InGamePlayer } from "../types";
import { formatPlayerIdentifier } from "../utils/formatPlayerIdentifier";
import { formatStintTime } from "../utils/formatStintTime";
import {
  CourtArcPosition,
  COURT_ARC_POSITIONS,
  calculateEuclideanDistance,
  ARC_RADIUS,
  ARC_CENTER_Y,
} from "../utils/courtArcPositions";

export {
  formatStintTime,
  CourtArcPosition,
  COURT_ARC_POSITIONS,
  calculateEuclideanDistance,
  ARC_RADIUS,
  ARC_CENTER_Y,
};

export const HalfCourtCanvas: React.FC<HalfCourtCanvasProps> = ({
  courtPlayers,
  isSwapMode,
  selectedCourtPlayerIds,
  onSelectCourtPosition,
  onLongPressCourtPosition,
}) => {
  const calculatePts = (p: InGamePlayer): number => {
    if (!p) return 0;
    return Number(p.t1a || 0) * 1 + Number(p.t2a || 0) * 2 + Number(p.t3a || 0) * 3;
  };

  // 5 positional layout anchors along the Outer 3-Point Arc:
  // Row 1 (Corners): Left Corner (Pos 4 / Index 3) & Right Corner (Pos 5 / Index 4)
  // Row 2 (Wings): Left Wing (Pos 2 / Index 1) & Right Wing (Pos 3 / Index 2)
  // Row 3 (Center): Center / Top of Arc (Pos 1 / Index 0)
  const renderPlayerSlot = (index: number, player: InGamePlayer | null) => {
    const pos = COURT_ARC_POSITIONS.find((p) => p.index === index) || COURT_ARC_POSITIONS[index];
    const positionStyle = {
      position: "absolute" as const,
      top: pos.y - 35,
      transform: [{ translateX: pos.xOffset }],
    };

    const pId = player ? Number(player.id) : null;
    const isSelected =
      pId !== null ? selectedCourtPlayerIds.some((id) => Number(id) === pId) : false;

    if (!player) {
      return (
        <TouchableOpacity
          key={`slot-${index}`}
          activeOpacity={0.7}
          onPress={() => onSelectCourtPosition(index, null)}
          testID={`court-slot-${index}`}
          style={positionStyle}
          className="items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-amber-500 bg-slate-900 p-1 shadow-lg z-10"
        >
          <Text className="text-amber-400 font-extrabold text-base">+</Text>
          <Text className="text-amber-300 font-semibold text-[9px] text-center">
            Pos #{index + 1}
          </Text>
        </TouchableOpacity>
      );
    }

    const stintTime = formatStintTime(player.stintSeconds);
    const identifier = formatPlayerIdentifier(player);

    return (
      <TouchableOpacity
        key={`player-${player.id}`}
        activeOpacity={0.8}
        onPress={() => onSelectCourtPosition(index, player)}
        onLongPress={() => {
          if (!isSwapMode && onLongPressCourtPosition) {
            onLongPressCourtPosition(index, player);
          }
        }}
        delayLongPress={2000}
        testID={`court-player-${player.id}`}
        style={positionStyle}
        className={`items-center justify-center w-20 h-20 rounded-full shadow-lg p-1 z-10 ${isSelected
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
          {/* Top Line: Jersey Number */}
          <Text
            className="text-amber-400 font-black text-sm leading-tight text-center"
            numberOfLines={1}
          >
            {player.number ? (String(player.number).startsWith("#") ? player.number : `#${player.number}`) : "#-"}
          </Text>

          {/* Second Line: Jersey Name or Fallback "F. Lastname" */}
          <Text
            className="text-slate-200 font-semibold text-[10px] leading-tight text-center"
            numberOfLines={1}
          >
            {identifier}
          </Text>

          {/* Middle Section: Divisor line */}
          <View className="w-10 h-px bg-slate-700 my-0.5" />

          {/* Bottom Section: Continuous Stint Time (mm:ss) */}
          <Text className="text-emerald-400 font-mono font-bold text-[10px] leading-tight text-center">
            {stintTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-slate-950 border border-slate-800 rounded-2xl mx-3 my-2 overflow-hidden shadow-2xl relative flex-1">
      {/* Basketball Half-Court Visual Lines */}
      <View className="h-80 w-full relative items-center bg-slate-950">
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

        {/* Court Positions Layout Along Outer 3-Point Arc */}
        {/* Row 1 (Corners): Left Corner (Pos 4) & Right Corner (Pos 5) */}
        {renderPlayerSlot(3, courtPlayers[3] || null)}
        {renderPlayerSlot(4, courtPlayers[4] || null)}

        {/* Row 2 (Wings): Left Wing (Pos 2) & Right Wing (Pos 3) */}
        {renderPlayerSlot(1, courtPlayers[1] || null)}
        {renderPlayerSlot(2, courtPlayers[2] || null)}

        {/* Row 3 (Center): Center / Top of Arc (Pos 1) */}
        {renderPlayerSlot(0, courtPlayers[0] || null)}
      </View>
    </View>
  );
};
