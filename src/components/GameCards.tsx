import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Game } from "../types/database";

interface GameCardsProps {
  games: Game[];
  onSelect: (game: Game) => void;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
}

const GameCards: React.FC<GameCardsProps> = ({
  games = [],
  onSelect,
  onEdit,
  onDelete,
}) => {
  if (games.length === 0) {
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={36}
          color="#A78B7D"
        />
        <Text className="text-lg font-bold text-on-surface-variant text-center px-4 mt-2">
          Parece que aún no has registrado ningún partido
        </Text>
        <Text className="text-xs text-outline text-center px-6 mt-1">
          Pulsa en Añadir para programar tu primer partido.
        </Text>
      </View>
    );
  }

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "finished":
        return (
          <View className="px-2 py-0.5 rounded-full bg-court-green/20 border border-court-green/60">
            <Text className="text-[10px] font-bold text-court-green">Finalizado</Text>
          </View>
        );
      case "inProgress":
        return (
          <View className="px-2 py-0.5 rounded-full bg-court-orange/20 border border-court-orange/60">
            <Text className="text-[10px] font-bold text-court-orange">En Juego</Text>
          </View>
        );
      case "pending":
      default:
        return (
          <View className="px-2 py-0.5 rounded-full bg-tactical-blue/20 border border-tactical-blue/60">
            <Text className="text-[10px] font-bold text-tactical-blue-light">Pendiente</Text>
          </View>
        );
    }
  };

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ScrollView
        className="w-full"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {games.map((game) => {
          const result =
            (game.resultC1 ?? (game as any).result_c1 ?? 0) +
            (game.resultC2 ?? (game as any).result_c2 ?? 0) +
            (game.resultC3 ?? (game as any).result_c3 ?? 0) +
            (game.resultC4 ?? (game as any).result_c4 ?? 0) +
            (game.resultExtra ?? (game as any).result_extra ?? 0);
          const resultOpponent =
            (game.resultC1Opponent ?? (game as any).result_c1_opponent ?? 0) +
            (game.resultC2Opponent ?? (game as any).result_c2_opponent ?? 0) +
            (game.resultC3Opponent ?? (game as any).result_c3_opponent ?? 0) +
            (game.resultC4Opponent ?? (game as any).result_c4_opponent ?? 0) +
            (game.resultExtraOpponent ?? (game as any).result_extra_opponent ?? 0);

          const roundLabel =
            typeof game.round === "string" && game.round.toLowerCase().startsWith("jornada")
              ? game.round
              : `Jornada ${game.round}`;

          const isWinning = result > resultOpponent;

          return (
            <TouchableOpacity
              key={game.id}
              onPress={() => onSelect(game)}
              className="my-1.5 w-full active:opacity-85"
            >
              <View
                className={`w-full flex flex-row justify-between px-4 py-3 bg-slate-card rounded-xl shadow-md border ${
                  game.status === "finished" && isWinning
                    ? "border-court-orange"
                    : "border-slate-border"
                }`}
              >
                <View className="w-[75%] flex flex-row justify-between items-center pr-2">
                  <View className="flex flex-col items-start w-[38%]">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <Text className="text-xs text-primary font-bold truncate">
                        {roundLabel}
                      </Text>
                    </View>
                    <Text className="text-[11px] text-on-surface-variant">
                      {game.date}
                    </Text>
                    <View className="mt-1.5">
                      {renderStatusBadge(game.status)}
                    </View>
                  </View>

                  <View className="flex flex-col items-center justify-center w-[35%] px-1">
                    <Text className="text-xs font-bold text-white text-center truncate">
                      vs {game.opponent}
                    </Text>
                  </View>

                  <View className="flex flex-col items-end w-[27%]">
                    <Text className="text-sm font-extrabold text-white text-right">
                      {result} - {resultOpponent}
                    </Text>
                  </View>
                </View>

                <View className="w-[25%] flex flex-row justify-end items-center gap-2 pl-1 border-l border-slate-border">
                  <TouchableOpacity
                    onPress={() => onEdit(game)}
                    className="p-2 min-w-[40px] min-h-[40px] items-center justify-center rounded-lg bg-slate-dark active:bg-slate-card"
                  >
                    <Feather name="edit" size={16} color="#0EA5E9" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDelete(game)}
                    className="p-2 min-w-[40px] min-h-[40px] items-center justify-center rounded-lg bg-slate-dark active:bg-slate-card"
                  >
                    <Feather name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default GameCards;
