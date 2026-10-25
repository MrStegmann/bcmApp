import React from "react";
import { View, Text } from "react-native";
import { TeamAdvancedAnalyticsProps } from "../types";
import { PolygonRadarChart } from "./PolygonRadarChart";

export const TeamAdvancedAnalytics: React.FC<TeamAdvancedAnalyticsProps> = ({
  stats,
}) => {
  return (
    <View className="w-full bg-surface px-4 py-3">
      {/* Section Header */}
      <View className="mb-3">
        <Text className="text-white font-bold text-sm tracking-wide uppercase">
          Estadísticas Avanzadas de Equipo
        </Text>
        <Text className="text-on-surface-variant text-xs">
          Métricas de eficiencia táctica y perfil radial
        </Text>
      </View>

      {/* Radar Chart Container Card */}
      <View className="bg-slate-card rounded-2xl p-4 border border-slate-border items-center shadow-md">
        <PolygonRadarChart stats={stats} size={280} />
      </View>
    </View>
  );
};

export default TeamAdvancedAnalytics;
