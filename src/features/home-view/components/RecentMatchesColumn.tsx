import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { RecentMatchesColumnProps } from "../types";
import RecentMatchCard from "./RecentMatchCard";

export const RecentMatchesColumn: React.FC<RecentMatchesColumnProps> = ({
  matches,
  onSelectMatch,
}) => {
  return (
    <View className="w-full mb-5">
      {/* Section Header */}
      <View className="flex-row items-center mb-3">
        <MaterialCommunityIcons name="history" size={22} color="#0EA5E9" />
        <Text className="text-tactical-blue-light font-bold text-xs uppercase tracking-wider ml-2">
          Últimos Partidos
        </Text>
      </View>

      {/* Matches List or Empty State */}
      {matches.length === 0 ? (
        <View className="w-full bg-slate-card border border-slate-border rounded-2xl p-5 shadow-sm">
          <Text className="text-on-surface-variant text-sm italic text-center py-2">
            No hay partidos finalizados todavía
          </Text>
        </View>
      ) : (
        <View className="flex-col">
          {matches.map((match) => (
            <RecentMatchCard
              key={match.id}
              match={match}
              onPress={() => onSelectMatch(match.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default RecentMatchesColumn;
