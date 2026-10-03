import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TimeScoreFoulsControllerProps } from "../types";

export const TimeScoreFoulsController: React.FC<TimeScoreFoulsControllerProps> = ({
  activePeriod,
  periodData,
  totalTeamScore,
  totalRivalScore,
  isTimerRunning,
  onNextPeriod,
  onOpenPeriodSelectModal,
  onToggleTimer,
  onOpenManualTimeModal,
  onResetExtraTimeCrono,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isExtraPeriod = activePeriod === "extra";

  return (
    <View className="bg-slate-900 border-b border-slate-800 p-3 shadow-md">
      {/* Top Row: Period Selector & Chronometer Widget */}
      <View className="flex-row items-center justify-between mb-3">
        {/* Period Selector (1-tap to next, 3s hold for modal) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onNextPeriod}
          onLongPress={onOpenPeriodSelectModal}
          delayLongPress={3000}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 flex-row items-center space-x-2"
        >
          <View className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <View>
            <Text className="text-slate-400 text-[10px] font-semibold tracking-wider">PERIODO (1-TAP / 3s HOLD)</Text>
            <Text className="text-white font-extrabold text-lg">{periodData.label}</Text>
          </View>
        </TouchableOpacity>

        {/* Extra Time Reset Button (shown only during extra time) */}
        {isExtraPeriod && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onResetExtraTimeCrono}
            className="bg-amber-500/20 border border-amber-500/50 px-2.5 py-1.5 rounded-lg flex-row items-center space-x-1"
          >
            <Text className="text-amber-400 font-bold text-xs">↺ Reiniciar 5:00 (+1 TM)</Text>
          </TouchableOpacity>
        )}

        {/* Chronometer (1-tap start/stop, 3s hold for manual time set) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleTimer}
          onLongPress={onOpenManualTimeModal}
          delayLongPress={3000}
          className={`flex-row items-center space-x-2 px-4 py-2 rounded-xl border ${
            isTimerRunning
              ? "bg-emerald-500/20 border-emerald-500 shadow-emerald-900/40 shadow-lg"
              : "bg-slate-800 border-slate-700"
          }`}
        >
          <View className="items-end">
            <View className="flex-row items-center space-x-1">
              <View className={`w-2 h-2 rounded-full ${isTimerRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              <Text className={`text-[10px] font-bold ${isTimerRunning ? "text-emerald-400" : "text-slate-400"}`}>
                {isTimerRunning ? "CORRIENDO" : "PAUSADO (3s HOLD)"}
              </Text>
            </View>
            <Text
              className={`font-mono text-2xl font-black tracking-widest ${
                isTimerRunning ? "text-emerald-300" : "text-white"
              }`}
            >
              {formatTime(periodData.remainingSeconds)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Scoreboard: Total Scores & Period Scores & Team Fouls */}
      <View className="flex-row items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl p-3">
        {/* Local Team Box */}
        <View className="flex-1 items-center">
          <Text className="text-slate-400 font-bold text-xs tracking-wider">LOCAL</Text>
          <Text className="text-4xl font-black text-amber-400 tracking-tight">{totalTeamScore}</Text>
          <View className="flex-row items-center space-x-2 mt-1">
            <Text className="text-slate-400 text-xs font-semibold">
              {periodData.label}: <Text className="text-white font-bold">{periodData.teamScore}</Text>
            </Text>
            <View className="w-1 h-1 rounded-full bg-slate-600" />
            <Text className="text-slate-400 text-xs font-semibold">
              Faltas: <Text className="text-rose-400 font-bold">{periodData.teamFouls}</Text>
            </Text>
          </View>
        </View>

        {/* Center Divider & Period Badge */}
        <View className="items-center px-3">
          <Text className="text-slate-600 font-black text-2xl">VS</Text>
          <View className="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 mt-1">
            <Text className="text-[10px] font-bold text-slate-300">{periodData.label}</Text>
          </View>
        </View>

        {/* Rival Team Box */}
        <View className="flex-1 items-center">
          <Text className="text-slate-400 font-bold text-xs tracking-wider">RIVAL</Text>
          <Text className="text-4xl font-black text-sky-400 tracking-tight">{totalRivalScore}</Text>
          <View className="flex-row items-center space-x-2 mt-1">
            <Text className="text-slate-400 text-xs font-semibold">
              {periodData.label}: <Text className="text-white font-bold">{periodData.rivalScore}</Text>
            </Text>
            <View className="w-1 h-1 rounded-full bg-slate-600" />
            <Text className="text-slate-400 text-xs font-semibold">
              Faltas: <Text className="text-rose-400 font-bold">{periodData.rivalFouls}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
