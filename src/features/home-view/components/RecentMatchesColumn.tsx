import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
        <MaterialCommunityIcons name="history" size={22} color="#D19F37" />
        <Text className="text-danish-gold font-bold text-xs uppercase tracking-wider ml-2">
          Últimos Partidos
        </Text>
      </View>

      {/* Matches List or Empty State */}
      {matches.length === 0 ? (
        <View className="w-full bg-danish-dark-gray border border-gray-700/60 rounded-2xl p-5 shadow-lg">
          <Text className="text-gray-400 text-sm italic text-center py-2">
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
