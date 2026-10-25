import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RivalPanelControlProps } from "../types";

export const RivalPanelControl: React.FC<RivalPanelControlProps> = ({
  activePeriod,
  onAdjustRivalScore,
  onAdjustRivalFouls,
}) => {
  return (
    <View className="w-full bg-slate-900 border-t border-slate-800 px-3 py-2.5 shadow-2xl">
      <View className="flex-row items-center justify-between w-full">
        {/* Left Side: Rival Section Title (Action pad only - points and fouls are tracked in main scoreboard) */}
        <View className="flex-1 mr-2">
          <View className="flex-row items-center space-x-1.5">
            <View className="w-2 h-2 rounded-full bg-sky-400" />
            <Text className="text-sky-400 font-extrabold text-xs tracking-wider uppercase">
              Rival ({activePeriod.toUpperCase()})
            </Text>
          </View>
        </View>

        {/* Right Side: Score & Foul Action Buttons */}
        <View className="flex-row items-center space-x-1.5">
          {/* Score Controls */}
          <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl p-1 space-x-1">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onAdjustRivalScore(-1)}
              testID="rival-minus-1"
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center active:bg-rose-500/20"
            >
              <Text className="text-slate-300 font-black text-xs">-1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onAdjustRivalScore(1)}
              testID="rival-plus-1"
              className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 items-center justify-center active:bg-sky-500/40"
            >
              <Text className="text-sky-300 font-black text-xs">+1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onAdjustRivalScore(2)}
              testID="rival-plus-2"
              className="w-8 h-8 rounded-lg bg-sky-500/30 border border-sky-500/50 items-center justify-center active:bg-sky-500/50"
            >
              <Text className="text-sky-300 font-black text-xs">+2</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onAdjustRivalScore(3)}
              testID="rival-plus-3"
              className="w-8 h-8 rounded-lg bg-sky-500/40 border border-sky-400 items-center justify-center active:bg-sky-500/60"
            >
              <Text className="text-sky-200 font-black text-xs">+3</Text>
            </TouchableOpacity>
          </View>

          {/* Foul Controls */}
          <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl p-1 space-x-1">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onAdjustRivalFouls(-1)}
              testID="rival-foul-minus"
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center active:bg-rose-500/20"
            >
              <Text className="text-slate-400 font-black text-xs">-F</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onAdjustRivalFouls(1)}
              testID="rival-foul-plus"
              className="px-2.5 h-8 rounded-lg bg-rose-500/20 border border-rose-500/60 items-center justify-center active:bg-rose-500/40"
            >
              <Text className="text-rose-300 font-black text-xs">+1 Falta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
