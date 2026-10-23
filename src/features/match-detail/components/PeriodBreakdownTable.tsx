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
    <View className="w-full bg-slate-900 px-4 py-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-slate-200 font-bold text-sm tracking-wide uppercase">
          Desglose por Periodos
        </Text>
        <Text className="text-slate-400 text-xs">Puntos y Faltas</Text>
      </View>

      <View className="bg-slate-800/90 rounded-xl overflow-hidden border border-slate-700">
        {/* Table Header */}
        <View className="flex-row items-center bg-slate-750 px-3 py-2.5 border-b border-slate-700">
          <Text className="flex-1 text-slate-400 font-bold text-xs uppercase">
            Periodo
          </Text>
          <View className="flex-1 items-center">
            <Text className="text-emerald-400 font-bold text-xs">Pts Eq</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-amber-400 font-bold text-xs">Falt Eq</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-slate-300 font-bold text-xs">Pts Riv</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-rose-400 font-bold text-xs">Falt Riv</Text>
          </View>
        </View>

        {/* Period Rows */}
        {periods.map((period, index) => (
          <View
            key={period.id}
            className={`flex-row items-center px-3 py-2.5 ${
              index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/80"
            } ${index < periods.length - 1 ? "border-b border-slate-700/60" : ""}`}
          >
            <Text className="flex-1 text-slate-300 font-semibold text-xs">
              {period.label}
            </Text>
            <View className="flex-1 items-center">
              <Text className="text-emerald-400 font-bold text-xs">
                {period.teamPoints}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-amber-300 font-medium text-xs">
                {period.teamFouls}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-slate-300 font-bold text-xs">
                {period.rivalPoints}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-rose-300 font-medium text-xs">
                {period.rivalFouls}
              </Text>
            </View>
          </View>
        ))}

        {/* Totals Footer Row */}
        <View className="flex-row items-center bg-slate-900/80 px-3 py-2.5 border-t border-slate-600">
          <Text className="flex-1 text-white font-extrabold text-xs uppercase">
            Total
          </Text>
          <View className="flex-1 items-center">
            <Text className="text-emerald-300 font-extrabold text-sm">
              {totalTeamPoints}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-amber-400 font-extrabold text-sm">
              {totalTeamFouls}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-white font-extrabold text-sm">
              {totalRivalPoints}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-rose-400 font-extrabold text-sm">
              {totalRivalFouls}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
