import React from "react";
import { View, Text } from "react-native";
import { PeriodBreakdownTableProps } from "../types";

export const PeriodBreakdownTable: React.FC<PeriodBreakdownTableProps> = ({
  periods,
  totalTeamPoints,
  totalRivalPoints,
  totalTeamFouls,
  totalRivalFouls,
}) => {
  return (
    <View className="w-full bg-surface px-4 py-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-bold text-sm tracking-wide uppercase">
          Desglose por Periodos
        </Text>
        <Text className="text-on-surface-variant text-xs">Puntos y Faltas</Text>
      </View>

      <View className="bg-slate-card rounded-xl overflow-hidden border border-slate-border shadow-sm">
        {/* Table Header */}
        <View className="flex-row items-center bg-slate-dark px-3 py-2.5 border-b border-slate-border">
          <Text className="flex-1 text-on-surface-variant font-bold text-xs uppercase">
            Periodo
          </Text>
          <View className="flex-1 items-center">
            <Text className="text-court-orange font-bold text-xs">Pts Eq</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-primary font-bold text-xs">Falt Eq</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-tactical-blue-light font-bold text-xs">Pts Riv</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-secondary font-bold text-xs">Falt Riv</Text>
          </View>
        </View>

        {/* Period Rows */}
        {periods.map((period, index) => (
          <View
            key={period.id}
            className={`flex-row items-center px-3 py-2.5 ${
              index % 2 === 0 ? "bg-surface-container/40" : "bg-surface-container/70"
            } ${index < periods.length - 1 ? "border-b border-slate-border/60" : ""}`}
          >
            <Text className="flex-1 text-on-surface font-semibold text-xs">
              {period.label}
            </Text>
            <View className="flex-1 items-center">
              <Text className="text-court-orange font-bold text-xs">
                {period.teamPoints}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-primary font-medium text-xs">
                {period.teamFouls}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-tactical-blue-light font-bold text-xs">
                {period.rivalPoints}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-secondary font-medium text-xs">
                {period.rivalFouls}
              </Text>
            </View>
          </View>
        ))}

        {/* Totals Footer Row */}
        <View className="flex-row items-center bg-slate-dark px-3 py-2.5 border-t border-slate-border">
          <Text className="flex-1 text-white font-extrabold text-xs uppercase">
            Total
          </Text>
          <View className="flex-1 items-center">
            <Text className="text-court-orange font-extrabold text-sm">
              {totalTeamPoints}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-primary font-extrabold text-sm">
              {totalTeamFouls}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-tactical-blue-light font-extrabold text-sm">
              {totalRivalPoints}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-secondary font-extrabold text-sm">
              {totalRivalFouls}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PeriodBreakdownTable;
