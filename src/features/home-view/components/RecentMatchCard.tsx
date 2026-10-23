import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { RecentMatchCardProps } from "../types";
import { formatRoundLabel } from "../utils/matchDateHelper";

export const RecentMatchCard: React.FC<RecentMatchCardProps> = ({
  match,
  onPress,
}) => {
  const roundLabel = formatRoundLabel(match.round);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="w-full bg-danish-dark-gray border border-gray-700/60 rounded-2xl p-4 mb-3 shadow-md"
    >
      {/* Top Header: Round & Date + Outcome Badge */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          {roundLabel ? (
            <>
              <Text className="text-gray-400 text-xs font-semibold mr-2">
                {roundLabel}
              </Text>
              <Text className="text-gray-500 text-xs">•</Text>
            </>
          ) : null}
          <Text className="text-gray-400 text-xs ml-2">{match.date}</Text>
        </View>

        <View
          className={`px-2 py-0.5 rounded-full ${
            match.isWinning ? "bg-emerald-950/70 border border-emerald-600/50" : "bg-red-950/70 border border-red-600/50"
          }`}
        >
          <Text
            className={`text-[10px] font-bold ${
              match.isWinning ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {match.isWinning ? "VICTORIA" : "DERROTA"}
          </Text>
        </View>
      </View>

      {/* Main Row: Opponent Name & Total Score */}
      <View className="flex-row items-center justify-between my-1">
        <View className="flex-1 mr-3">
          <Text className="text-danish-white text-base font-bold" numberOfLines={1}>
            vs {match.opponent}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text
            className={`text-xl font-extrabold ${
              match.isWinning ? "text-emerald-400" : "text-danish-white"
            }`}
          >
            {match.teamTotalScore}
          </Text>
          <Text className="text-gray-500 text-sm font-bold mx-1.5">-</Text>
          <Text
            className={`text-xl font-extrabold ${
              !match.isWinning ? "text-red-400" : "text-gray-400"
            }`}
          >
            {match.rivalTotalScore}
          </Text>
          <Feather name="chevron-right" size={18} color="#9CA3AF" style={{ marginLeft: 6 }} />
        </View>
      </View>

      {/* Period Scores Breakdown Sub-Row */}
      <View className="mt-2.5 pt-2 border-t border-gray-800/80 flex-row items-center justify-between px-1">
        <Text className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">
          Cuartos:
        </Text>
        <View className="flex-row items-center space-x-2">
          {match.periods.map((p, idx) => (
            <View key={p.period} className="flex-row items-center ml-2">
              <Text className="text-gray-400 text-[11px] font-medium mr-1">
                {p.period}:
              </Text>
              <Text className="text-gray-200 text-[11px] font-bold">
                {p.teamScore}-{p.rivalScore}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentMatchCard;
