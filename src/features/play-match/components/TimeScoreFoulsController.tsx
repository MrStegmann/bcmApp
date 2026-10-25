import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TimeScoreFoulsControllerProps } from "../types";

export const TimeScoreFoulsController: React.FC<TimeScoreFoulsControllerProps> = ({
  activePeriod,
  periodData,
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
  const canResetExtra = isExtraPeriod && periodData.remainingSeconds === 0;

  return (
    <View className="bg-slate-900 border-b border-slate-800 p-3 shadow-md">

      {/* Main Scoreboard: ONLY Current Period Score & Period Team Fouls */}
      <View className="flex-row items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl p-3">
        {/* Local Team Period Score & Fouls */}
        <View className="flex-1 items-center">
          <Text className="text-slate-400 font-bold text-xs tracking-wider">LOCAL</Text>
          <Text className="text-4xl font-black text-amber-400 tracking-tight">{periodData.teamScore}</Text>
          <View className="flex-row items-center space-x-1.5 mt-1 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-slate-800">
            <Text className="text-slate-400 text-xs font-semibold">Faltas:</Text>
            <Text className="text-rose-400 font-extrabold text-xs">{periodData.teamFouls}</Text>
          </View>
        </View>

        {/* Center Divider & Period Badge */}
        <View className="items-center px-4">
          {/* Period Selector (1-tap to next, 1s hold for modal) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNextPeriod}
            onLongPress={onOpenPeriodSelectModal}
            delayLongPress={500}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 flex-row items-center space-x-2 mb-1"
            testID="period-selector-button"
          >
            <View>
              <Text className="text-white font-extrabold text-center">{periodData.label}</Text>
            </View>
          </TouchableOpacity>

          <Text className="text-slate-600 font-black text-2xl">VS</Text>
          <Pressable
            onPress={onToggleTimer}
            onLongPress={onOpenManualTimeModal}
            delayLongPress={500}
            testID="chronometer-button"
            style={({ pressed }) => ({
              backgroundColor: isTimerRunning ? "#022c22" : "#1e293b",
              borderColor: isTimerRunning ? "#10b981" : "#334155",
              borderWidth: 1,
              opacity: pressed ? 0.8 : 1,
            })}
            className="flex-row items-center space-x-2 px-4 py-2 rounded-xl"
          >
            <View className="items-center">
              <View className="flex-row items-center space-x-1">
                <View
                  testID="chronometer-status-dot"
                  style={{
                    backgroundColor: isTimerRunning ? "#34d399" : "#64748b",
                    borderColor: isTimerRunning ? "#6ee7b7" : "transparent",
                    borderWidth: isTimerRunning ? 1 : 0,
                  }}
                  className="w-2 h-2 rounded-full"
                />
                <Text
                  style={{ color: isTimerRunning ? "#34d399" : "#94a3b8" }}
                  className="text-[10px] font-bold"
                >
                  {isTimerRunning ? "CORRIENDO" : "PAUSADO"}
                </Text>
              </View>
              <Text
                style={{ color: isTimerRunning ? "#6ee7b7" : "#ffffff" }}
                className="font-mono text-2xl font-black tracking-widest"
              >
                {formatTime(periodData.remainingSeconds)}
              </Text>
            </View>
          </Pressable>
          {isExtraPeriod && (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!canResetExtra}
              onPress={onResetExtraTimeCrono}
              testID="reset-extra-crono-button"
              className={`w-10 h-10 rounded-xl items-center justify-center border ${canResetExtra
                ? "bg-amber-500 border-amber-500 active:bg-amber-600"
                : "bg-slate-800 border-slate-800"
                }`}
              accessibilityLabel="Reiniciar tiempo extra"
            >
              <MaterialIcons
                name="refresh"
                size={22}
                color={canResetExtra ? "#fbbf24" : "#64748b"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Rival Team Period Score & Fouls */}
        <View className="flex-1 items-center">
          <Text className="text-slate-400 font-bold text-xs tracking-wider">RIVAL</Text>
          <Text className="text-4xl font-black text-sky-400 tracking-tight">{periodData.rivalScore}</Text>
          <View className="flex-row items-center space-x-1.5 mt-1 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-slate-800">
            <Text className="text-slate-400 text-xs font-semibold">Faltas:</Text>
            <Text className="text-rose-400 font-extrabold text-xs">{periodData.rivalFouls}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

