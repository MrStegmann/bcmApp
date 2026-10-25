import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RivalPanelControlProps } from "../types";

export const RivalPanelControl: React.FC<RivalPanelControlProps> = ({
  activePeriod,
  onAdjustRivalScore,
  onAdjustRivalFouls,
}) => {
  return (
    <View className="w-full bg-surface-container border-t border-slate-border px-3 py-2.5 shadow-2xl">
      {/* Right Side: Score & Foul Action Buttons */}
      <View className="w-full flex-row justify-between items-center space-x-1.5">
        {/* Score Controls */}
        <View className="flex-row items-center bg-surface-dim border border-slate-border rounded-xl p-1 space-x-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onAdjustRivalScore(-1)}
            testID="rival-minus-1"
            className="w-14 h-9 rounded-lg bg-surface-elevated border border-slate-border items-center justify-center active:bg-slate-border"
          >
            <Text className="text-slate-300 font-black text-xs">-1 PT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onAdjustRivalScore(1)}
            testID="rival-plus-1"
            className="w-14 h-9 rounded-lg bg-tactical-blue/20 border border-tactical-blue/40 items-center justify-center active:bg-tactical-blue/40"
          >
            <Text className="text-tactical-blue-light font-black text-xs">+1 PT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onAdjustRivalScore(2)}
            testID="rival-plus-2"
            className="w-14 h-9 rounded-lg bg-tactical-blue/30 border border-tactical-blue/50 items-center justify-center active:bg-tactical-blue/50"
          >
            <Text className="text-tactical-blue-light font-black text-xs">+2 PT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onAdjustRivalScore(3)}
            testID="rival-plus-3"
            className="w-14 h-9 rounded-lg bg-tactical-blue/40 border border-tactical-blue items-center justify-center active:bg-tactical-blue/60"
          >
            <Text className="text-white font-black text-xs">+3 PT</Text>
          </TouchableOpacity>
        </View>

        {/* Foul Controls */}
        <View className="flex-row items-center bg-surface-dim border border-slate-border rounded-xl p-1 space-x-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onAdjustRivalFouls(-1)}
            testID="rival-foul-minus"
            className="px-2.5 h-9 rounded-lg bg-surface-elevated border border-slate-border items-center justify-center active:bg-slate-border"
          >
            <Text className="text-slate-400 font-black text-xs">-1 Falta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onAdjustRivalFouls(1)}
            testID="rival-foul-plus"
            className="px-2.5 h-9 rounded-lg bg-error-container/40 border border-error-container items-center justify-center active:bg-error-container/60"
          >
            <Text className="text-rose-300 font-black text-xs">+1 Falta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
