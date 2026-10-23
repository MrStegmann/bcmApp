import React from "react";
import { View, Text } from "react-native";
import { TeamAdvancedAnalyticsProps } from "../types";
import { PolygonRadarChart } from "./PolygonRadarChart";

export const TeamAdvancedAnalytics: React.FC<TeamAdvancedAnalyticsProps> = ({
  stats,
}) => {
  return (
    <View className="w-full bg-slate-900 px-4 py-3">
      {/* Section Header */}
      <View className="mb-3">
        <Text className="text-slate-200 font-bold text-sm tracking-wide uppercase">
          Estadísticas Avanzadas de Equipo
        </Text>
        <Text className="text-slate-400 text-xs">
          Métricas de eficiencia táctica y perfil radial
        </Text>
      </View>

      {/* Radar Chart Container Card */}
      <View className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80 items-center">
        <PolygonRadarChart stats={stats} size={280} />
      </View>
    </View>
  );
};
