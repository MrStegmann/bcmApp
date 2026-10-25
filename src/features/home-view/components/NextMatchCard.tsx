import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { NextMatchCardProps } from "../types";
import { formatRoundLabel } from "../utils/matchDateHelper";

export const NextMatchCard: React.FC<NextMatchCardProps> = ({
  nextMatch,
  onConfigureRoster,
}) => {
  if (!nextMatch) {
    return (
      <View className="w-full bg-slate-card border border-slate-border rounded-2xl p-5 mb-5 shadow-md">
        <View className="flex-row items-center mb-2">
          <MaterialCommunityIcons name="calendar-clock" size={22} color="#0EA5E9" />
          <Text className="text-tactical-blue-light font-bold text-xs uppercase tracking-wider ml-2">
            Próximo Partido
          </Text>
        </View>
        <Text className="text-on-surface-variant text-sm italic text-center py-3">
          Sin próximos partidos agendados
        </Text>
      </View>
    );
  }

  const roundLabel = formatRoundLabel(nextMatch.round);

  return (
    <View className="w-full bg-slate-card border border-slate-border rounded-2xl p-5 mb-5 shadow-md">
      {/* Header Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="calendar-clock" size={22} color="#0EA5E9" />
          <Text className="text-tactical-blue-light font-bold text-xs uppercase tracking-wider ml-2">
            Próximo Partido
          </Text>
        </View>
        {roundLabel ? (
          <View className="bg-slate-dark px-2.5 py-1 rounded-full border border-slate-border">
            <Text className="text-on-surface text-xs font-semibold">
              {roundLabel}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Opponent & Match Date */}
      <View className="mb-4">
        <Text className="text-white text-xl font-bold mb-1" numberOfLines={2}>
          vs {nextMatch.opponent}
        </Text>
        <View className="flex-row items-center mt-1">
          <Feather name="clock" size={14} color="#A78B7D" />
          <Text className="text-on-surface-variant text-xs ml-1.5 font-medium">
            {nextMatch.date}
          </Text>
        </View>
      </View>

      {/* Roster Callup Action / Status */}
      <View className="pt-3 border-t border-slate-border flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-3">
          {nextMatch.hasRoster ? (
            <View className="flex-row items-center">
              <Feather name="check-circle" size={16} color="#10B981" />
              <Text className="text-court-green text-xs font-semibold ml-1.5">
                Convocatoria Configurada
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Feather name="alert-circle" size={16} color="#F97316" />
              <Text className="text-court-orange text-xs font-semibold ml-1.5">
                Sin Convocatoria
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onConfigureRoster(nextMatch)}
          activeOpacity={0.8}
          className={`px-4 py-2.5 min-h-[48px] rounded-xl flex-row items-center justify-center ${
            nextMatch.hasRoster
              ? "bg-slate-dark border border-slate-border active:bg-slate-card"
              : "bg-court-orange active:bg-court-orange-dark shadow-md"
          }`}
        >
          <MaterialCommunityIcons
            name={nextMatch.hasRoster ? "account-edit-outline" : "account-multiple-plus"}
            size={18}
            color="#FFFFFF"
          />
          <Text className="text-white text-xs font-bold ml-1.5">
            {nextMatch.hasRoster ? "Modificar" : "Configurar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NextMatchCard;
