import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { RivalControlPanelProps } from "../types/match";

export const RivalControlPanel: React.FC<RivalControlPanelProps> = ({
  activeQuarterKey,
  rivalQuarterScore,
  rivalQuarterFouls,
  totalRivalScore,
  onAdjustRivalScore,
  onAdjustRivalFouls,
}) => {
  const quarterLabel =
    activeQuarterKey === "extra" ? "PR" : activeQuarterKey.toUpperCase();

  return (
    <View className="w-full bg-slate-900 border border-red-900/60 rounded-2xl p-3 my-2 shadow-lg">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center space-x-2">
          <View className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <Text className="text-red-400 font-bold text-xs uppercase tracking-wider">
            Control Rival ({quarterLabel})
          </Text>
        </View>
        <Text className="text-slate-400 text-xs font-semibold">
          Total Rival:{" "}
          <Text className="text-white font-black">{totalRivalScore} pts</Text>
        </Text>
      </View>

      {/* Quick Controls Grid */}
      <View className="flex-row items-center justify-between gap-2">
        {/* Score Adjustments */}
        <View className="flex-1 bg-slate-800/80 rounded-xl p-2 border border-slate-700/60">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-slate-400 text-[11px] font-semibold">
              Puntos {quarterLabel}
            </Text>
            <Text className="text-white font-extrabold text-sm">
              {rivalQuarterScore}
            </Text>
          </View>
          <View className="flex-row items-center justify-between gap-1">
            <TouchableOpacity
              onPress={() => onAdjustRivalScore(1)}
              className="flex-1 py-1.5 rounded-lg bg-red-950/80 border border-red-800 items-center justify-center active:bg-red-900"
            >
              <Text className="text-red-300 font-extrabold text-xs">+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAdjustRivalScore(2)}
              className="flex-1 py-1.5 rounded-lg bg-red-950/80 border border-red-800 items-center justify-center active:bg-red-900"
            >
              <Text className="text-red-300 font-extrabold text-xs">+2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAdjustRivalScore(3)}
              className="flex-1 py-1.5 rounded-lg bg-red-950/80 border border-red-800 items-center justify-center active:bg-red-900"
            >
              <Text className="text-red-300 font-extrabold text-xs">+3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAdjustRivalScore(-1)}
              className="px-2 py-1.5 rounded-lg bg-slate-700/80 border border-slate-600 items-center justify-center active:bg-slate-600"
            >
              <Text className="text-slate-300 font-bold text-xs">-1</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fouls Adjustments */}
        <View className="flex-1 bg-slate-800/80 rounded-xl p-2 border border-slate-700/60">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-slate-400 text-[11px] font-semibold">
              Faltas {quarterLabel}
            </Text>
            <Text className="text-red-400 font-extrabold text-sm">
              {rivalQuarterFouls}
            </Text>
          </View>
          <View className="flex-row items-center justify-between gap-1">
            <TouchableOpacity
              onPress={() => onAdjustRivalFouls(1)}
              className="flex-1 py-1.5 rounded-lg bg-red-900/60 border border-red-700 flex-row items-center justify-center gap-1 active:bg-red-800"
            >
              <Feather name="alert-triangle" size={11} color="#F87171" />
              <Text className="text-red-200 font-extrabold text-xs">+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAdjustRivalFouls(-1)}
              className="px-2 py-1.5 rounded-lg bg-slate-700/80 border border-slate-600 items-center justify-center active:bg-slate-600"
            >
              <Text className="text-slate-300 font-bold text-xs">-1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RivalControlPanel;
