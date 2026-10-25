import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GlobalStatsCardProps } from "../types";
import { getMetricSummaryItems } from "../utils/statsCalculator";

export const GlobalStatsCard: React.FC<GlobalStatsCardProps> = ({ stats }) => {
  const metricItems = getMetricSummaryItems(stats);
  const matchCount = stats.completedMatchesCount || 0;

  return (
    <View className="w-full bg-slate-card border border-slate-border rounded-2xl p-5 mb-8 shadow-md">
      {/* Header Badge */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={22} color="#0EA5E9" />
          <Text className="text-tactical-blue-light font-bold text-xs uppercase tracking-wider ml-2">
            Estadísticas Globales
          </Text>
        </View>

        <View className="bg-slate-dark px-2.5 py-1 rounded-full border border-slate-border">
          <Text className="text-on-surface text-xs font-semibold">
            {matchCount} {matchCount === 1 ? "partido" : "partidos"}
          </Text>
        </View>
      </View>

      {/* Subtitle / Context */}
      <Text className="text-on-surface-variant text-xs mb-4">
        Promedios aritméticos de eficiencia calculados sobre los partidos finalizados del equipo.
      </Text>

      {/* 4x2 Grid of Metrics */}
      <View className="flex-row flex-wrap justify-between">
        {metricItems.map((item) => (
          <View
            key={item.key}
            className="w-[48%] bg-surface-container border border-slate-border rounded-xl p-3 mb-3 shadow-sm"
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-court-orange text-xs font-bold tracking-wider">
                {item.label}
              </Text>
              <Text
                className="text-on-surface-variant text-[10px] font-medium"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </View>

            <Text className="text-white text-xl font-extrabold my-0.5">
              {item.formattedValue}
            </Text>

            <Text
              className="text-outline text-[10px] leading-tight"
              numberOfLines={2}
            >
              {item.benchmarkDescription}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default GlobalStatsCard;
