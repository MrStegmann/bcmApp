import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { NextMatchCardProps } from "../types";
import { formatRoundLabel } from "../utils/matchDateHelper";

export const NextMatchCard: React.FC<NextMatchCardProps> = ({
  nextMatch,
  onConfigureRoster,
}) => {
  if (!nextMatch) {
    return (
      <View className="w-full bg-danish-dark-gray border border-gray-700/60 rounded-2xl p-5 mb-5 shadow-lg">
        <View className="flex-row items-center mb-2">
          <MaterialCommunityIcons name="calendar-clock" size={22} color="#D19F37" />
          <Text className="text-danish-gold font-bold text-xs uppercase tracking-wider ml-2">
            Próximo Partido
          </Text>
        </View>
        <Text className="text-gray-400 text-sm italic text-center py-3">
          Sin próximos partidos agendados
        </Text>
      </View>
    );
  }

  const roundLabel = formatRoundLabel(nextMatch.round);

  return (
    <View className="w-full bg-danish-dark-gray border border-gray-700/60 rounded-2xl p-5 mb-5 shadow-lg">
      {/* Header Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="calendar-clock" size={22} color="#D19F37" />
          <Text className="text-danish-gold font-bold text-xs uppercase tracking-wider ml-2">
            Próximo Partido
          </Text>
        </View>
        {roundLabel ? (
          <View className="bg-gray-800/80 px-2.5 py-1 rounded-full border border-gray-700">
            <Text className="text-gray-300 text-xs font-semibold">
              {roundLabel}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Opponent & Match Date */}
      <View className="mb-4">
        <Text className="text-danish-white text-xl font-bold mb-1" numberOfLines={2}>
          vs {nextMatch.opponent}
        </Text>
        <View className="flex-row items-center mt-1">
          <Feather name="clock" size={14} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs ml-1.5 font-medium">
            {nextMatch.date}
          </Text>
        </View>
      </View>

      {/* Roster Callup Action / Status */}
      <View className="pt-3 border-t border-gray-800/80 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-3">
          {nextMatch.hasRoster ? (
            <View className="flex-row items-center">
              <Feather name="check-circle" size={16} color="#10B981" />
              <Text className="text-emerald-400 text-xs font-semibold ml-1.5">
                Convocatoria Configurada
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Feather name="alert-circle" size={16} color="#F59E0B" />
              <Text className="text-amber-400 text-xs font-semibold ml-1.5">
                Sin Convocatoria
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onConfigureRoster(nextMatch)}
          activeOpacity={0.8}
          className={`px-3.5 py-2 rounded-xl flex-row items-center ${
            nextMatch.hasRoster
              ? "bg-gray-800 border border-gray-600"
              : "bg-danish-red"
          }`}
        >
          <MaterialCommunityIcons
            name={nextMatch.hasRoster ? "account-edit-outline" : "account-multiple-plus"}
            size={16}
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
