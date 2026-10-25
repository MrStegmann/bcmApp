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
    <View className="w-full bg-surface-container px-4 pt-3 pb-3 border-b border-slate-border" testID="match-summary-header">
      {/* Match Matchup Card */}
      <View className="bg-slate-card rounded-2xl p-4 border border-slate-border shadow-md w-full">
        <View className="w-full flex-row items-center justify-between mb-2">
          {/* Home Team */}
          <View className="flex-1 items-center pr-2">
            <Text
              className="text-white font-bold text-base text-center"
            >
              {teamName || "Equipo"}
            </Text>
            <Text className="text-court-orange text-3xl font-extrabold ml-1.5 text-center tracking-tighter">
              {totalTeamPoints}
            </Text>
          </View>

          {/* VS Divider */}
          <View className="px-3 items-center">
            <Text className="text-primary font-black text-xs uppercase tracking-widest">
              VS
            </Text>
          </View>

          {/* Rival Team */}
          <View className="flex-1 items-center pl-2">
            <Text
              className="text-white font-bold text-base text-center"
            >
              {opponentName || "Rival"}
            </Text>
            <Text className="text-tactical-blue-light text-3xl font-extrabold ml-1.5 text-center tracking-tighter">
              {totalRivalPoints}
            </Text>
          </View>
        </View>

        {/* Match Date Subtitle */}
        <View className="flex-row items-center justify-center pt-2.5 border-t border-slate-border">
          <Feather name="calendar" size={13} color="#A78B7D" />
          <Text className="text-on-surface-variant text-xs font-medium ml-1.5">
            {date || "Fecha no especificada"}
          </Text>
        </View>

        {/* Share Stats Action Button (Finished Games) */}
        {isFinished && onShareStats && (
          <TouchableOpacity
            onPress={onShareStats}
            activeOpacity={0.8}
            className="mt-3 flex-row items-center justify-center bg-tactical-blue active:bg-tactical-blue-light min-h-[48px] py-3 px-4 rounded-xl shadow-md"
            testID="share-stats-button"
          >
            <Feather name="share-2" size={16} color="#ffffff" />
            <Text className="text-white font-bold text-xs ml-2 uppercase tracking-wider">
              Compartir Estadísticas
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MatchSummaryHeader;
