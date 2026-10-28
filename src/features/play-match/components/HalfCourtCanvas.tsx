import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HalfCourtCanvasProps, InGamePlayer } from "../types";
import { formatPlayerIdentifier } from "../utils/formatPlayerIdentifier";
import { formatStintTime } from "../utils/formatStintTime";
import {
  CourtArcPosition,
  COURT_ARC_POSITIONS,
  getScaledCourtPositions,
  calculateEuclideanDistance,
  ARC_RADIUS,
  ARC_CENTER_Y,
} from "../utils/courtArcPositions";

export {
  formatStintTime,
  CourtArcPosition,
  COURT_ARC_POSITIONS,
  getScaledCourtPositions,
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
  layout,
}) => {
  const [canvasDimensions, setCanvasDimensions] = React.useState({ width: 360, height: 320 });

  const activePositions = React.useMemo(() => {
    if (layout && layout.positions) {
      return layout.positions.map((lp) => {
        const base = COURT_ARC_POSITIONS.find((b) => b.index === lp.index) || COURT_ARC_POSITIONS[lp.index];
        return {
          ...base,
          xOffset: lp.x,
          y: lp.y,
        };
      });
    }
    return getScaledCourtPositions(canvasDimensions.width, canvasDimensions.height);
  }, [layout, canvasDimensions.width, canvasDimensions.height]);

  // 5 positional layout anchors along the Outer 3-Point Arc:
  // Row 1 (Corners): Left Corner (Pos 4 / Index 3) & Right Corner (Pos 5 / Index 4)
  // Row 2 (Wings): Left Wing (Pos 2 / Index 1) & Right Wing (Pos 3 / Index 2)
  // Row 3 (Center): Center / Top of Arc (Pos 1 / Index 0)
  const renderPlayerSlot = (index: number, player: InGamePlayer | null) => {
    const pos = activePositions.find((p) => p.index === index) || COURT_ARC_POSITIONS[index];
    const positionStyle = {
      position: "absolute" as const,
      top: pos.y - 24,
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
          className="items-center justify-center w-12 h-12 rounded-full border border-dashed border-court-orange/70 bg-surface-container p-0.5 shadow-md z-10"
        >
          <Text className="text-court-orange font-extrabold text-sm">+</Text>
          <Text className="text-court-orange/80 font-semibold text-[8px] text-center">
            #{index + 1}
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
        className={`items-center justify-center w-12 h-12 rounded-full shadow-lg p-0.5 z-10 ${isSelected
          ? "border-2 border-court-orange bg-court-orange/20"
          : isSwapMode
            ? "border border-tactical-blue/60 bg-tactical-blue/10"
            : "border border-court-orange bg-surface-container"
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

          {/* Middle Section: Divisor line */}
          <View className="w-7 h-px bg-slate-border my-0.5" />

          {/* Bottom Section: Continuous Stint Time (mm:ss) */}
          <Text className="text-emerald-400 font-mono font-bold text-[8px] leading-none text-center">
            {stintTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      className="bg-surface-dim border border-slate-border rounded-2xl mx-3 my-2 overflow-hidden shadow-2xl relative flex-1"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width > 0 && height > 0) {
          setCanvasDimensions({ width, height });
        }
      }}
    >
      {/* Basketball Half-Court Visual Lines */}
      <View className="w-full flex-1 relative items-center justify-start bg-surface-dim min-h-[220px]">
        {/* Outer 3-Point Arc */}
        <View
          pointerEvents="none"
          className="absolute top-0 w-64 h-56 rounded-b-full border-2 border-slate-border/60"
        />

        {/* Free Throw Key / Paint Area */}
        <View
          pointerEvents="none"
          className="absolute top-0 w-36 h-40 border-x-2 border-b-2 border-slate-border/60 bg-surface/40 items-center"
        >
          {/* Free Throw Circle */}
          <View
            pointerEvents="none"
            className="absolute bottom-[-24px] w-24 h-24 rounded-full border-2 border-slate-border/60"
          />
          {/* Basket Ring & Backboard */}
          <View pointerEvents="none" className="w-16 h-1 bg-court-orange/70 mt-2 rounded" />
          <View pointerEvents="none" className="w-6 h-6 rounded-full border border-court-orange/80 mt-1" />
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
