import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
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
      className="w-full bg-slate-card border border-slate-border rounded-2xl p-4 mb-3 shadow-md"
    >
      {/* Top Header: Round & Date + Outcome Badge */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          {roundLabel ? (
            <>
              <Text className="text-primary text-xs font-semibold mr-2">
                {roundLabel}
              </Text>
              <Text className="text-outline text-xs">•</Text>
            </>
          ) : null}
          <Text className="text-on-surface-variant text-xs ml-2">{match.date}</Text>
        </View>

        <View
          className={`px-2 py-0.5 rounded-full ${
            match.isWinning ? "bg-court-green/20 border border-court-green/60" : "bg-court-red/20 border border-court-red/60"
          }`}
        >
          <Text
            className={`text-[10px] font-bold ${
              match.isWinning ? "text-court-green" : "text-court-red"
            }`}
          >
            {match.isWinning ? "VICTORIA" : "DERROTA"}
          </Text>
        </View>
      </View>

      {/* Main Row: Opponent Name & Total Score */}
      <View className="flex-row items-center justify-between my-1">
        <View className="flex-1 mr-3">
          <Text className="text-white text-base font-bold" numberOfLines={1}>
            vs {match.opponent}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text
            className={`text-xl font-extrabold ${
              match.isWinning ? "text-court-green" : "text-white"
            }`}
          >
            {match.teamTotalScore}
          </Text>
          <Text className="text-outline text-sm font-bold mx-1.5">-</Text>
          <Text
            className={`text-xl font-extrabold ${
              !match.isWinning ? "text-court-red" : "text-on-surface-variant"
            }`}
          >
            {match.rivalTotalScore}
          </Text>
          <Feather name="chevron-right" size={18} color="#A78B7D" style={{ marginLeft: 6 }} />
        </View>
      </View>

      {/* Period Scores Breakdown Sub-Row */}
      <View className="mt-2.5 pt-2 border-t border-slate-border flex-row items-center justify-between px-1">
        <Text className="text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider">
          Cuartos:
        </Text>
        <View className="flex-row items-center space-x-2">
          {match.periods.map((p) => (
            <View key={p.period} className="flex-row items-center ml-2">
              <Text className="text-on-surface-variant text-[11px] font-medium mr-1">
                {p.period}:
              </Text>
              <Text className="text-white text-[11px] font-bold">
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
