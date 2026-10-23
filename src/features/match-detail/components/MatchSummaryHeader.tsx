import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { MatchSummaryHeaderProps } from "../types";

export const MatchSummaryHeader: React.FC<MatchSummaryHeaderProps> = ({
  teamName,
  opponentName,
  totalTeamPoints,
  totalRivalPoints,
  date,
  status,
  onShareStats,
}) => {
  const isFinished = status === "finished";

  return (
    <View className="w-full bg-slate-900 px-4 pt-3 pb-3 border-b border-slate-800" testID="match-summary-header">
      {/* Match Matchup Card */}
      <View className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 shadow-lg w-full">
        <View className="w-full flex-row items-center justify-between mb-2">
          {/* Home Team */}
          <View className="flex-1 items-center pr-2">
            <Text
              className="text-slate-100 font-bold text-base text-center"
            >
              {teamName || "Equipo"}
            </Text>
            <Text className="text-slate-100 text-xl font-bold ml-1.5 text-center">
              {totalTeamPoints}
            </Text>
          </View>

          {/* VS Divider */}
          <View className="px-3 items-center">
            <Text className="text-amber-400 font-black text-xs uppercase tracking-widest">
              VS
            </Text>
          </View>

          {/* Rival Team */}
          <View className="flex-1 items-center pl-2">
            <Text
              className="text-slate-100 font-bold text-base text-center"
            >
              {opponentName || "Rival"}
            </Text>
            <Text className="text-slate-100 text-xl font-bold ml-1.5">
              {totalRivalPoints}
            </Text>
          </View>
        </View>

        {/* Match Date Subtitle */}
        <View className="flex-row items-center justify-center pt-2 border-t border-slate-700/50">
          <Feather name="calendar" size={13} color="#64748b" />
          <Text className="text-slate-400 text-xs font-medium ml-1.5">
            {date || "Fecha no especificada"}
          </Text>
        </View>

        {/* Share Stats Action Button (Finished Games) */}
        {isFinished && onShareStats && (
          <TouchableOpacity
            onPress={onShareStats}
            activeOpacity={0.8}
            className="mt-3 flex-row items-center justify-center bg-sky-600 active:bg-sky-700 py-2.5 px-4 rounded-xl border border-sky-400/30"
            testID="share-stats-button"
          >
            <Feather name="share-2" size={15} color="#ffffff" />
            <Text className="text-white font-bold text-xs ml-2 uppercase tracking-wider">
              Compartir Estadísticas
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

