import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

interface PlayerCardsProps {
  players: any[];
  onSelect: (player: any) => void;
  onEdit: (player: any) => void;
  onDelete: (player: any) => void;
}

const PlayerCards: React.FC<PlayerCardsProps> = ({
  players = [],
  onSelect,
  onEdit,
  onDelete,
}) => {
  if (players.length === 0) {
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={32}
          color="#A78B7D"
        />
        <Text className="text-lg font-bold text-on-surface-variant text-center mt-2">
          Parece que aún no has registrado ningún jugador
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true} className="w-full">
        {players.map((player) => {
          const t1a = Number(player.total_t1a || player.t1a || 0);
          const t2a = Number(player.total_t2a || player.t2a || 0);
          const t3a = Number(player.total_t3a || player.t3a || 0);
          const pts = t1a + t2a * 2 + t3a * 3;

          const dreb = Number(player.total_dreb || player.dreb || 0);
          const oreb = Number(player.total_oreb || player.oreb || 0);
          const asis = Number(player.total_asis || player.asis || 0);
          const rec = Number(player.total_rec || player.rec || 0);
          const per = Number(player.total_per || player.per || 0);
          const falt = Number(player.total_falt || player.falt || 0);
          const t1i = Number(player.total_t1i || player.t1i || 0);
          const t2i = Number(player.total_t2i || player.t2i || 0);
          const t3i = Number(player.total_t3i || player.t3i || 0);

          const val =
            t2a +
            t3a +
            t1a +
            (dreb + oreb) +
            asis +
            rec -
            per -
            falt -
            Math.max(0, t2i - t2a) -
            Math.max(0, t3i - t3a) -
            Math.max(0, t1i - t1a);

          const number = player.number || "";
          const firstName = player.firstName || player.first_name || "";
          const lastName = player.lastName || player.last_name || "";

          return (
            <TouchableOpacity
              key={player.id}
              onPress={() => onSelect(player)}
              className="my-2 w-full active:opacity-85"
            >
              <View className="w-full flex flex-row justify-between items-center px-4 py-3 bg-slate-card rounded-xl shadow-md border border-slate-border">
                <View className="flex-1 flex flex-col pr-2">
                  <View className="flex-row items-center mb-1">
                    <View className="bg-slate-border rounded-sm px-2 py-0.5 mr-2 items-center justify-center">
                      <Text className="text-court-white font-mono font-bold text-xs">
                        #{number}
                      </Text>
                    </View>
                    <Text className="text-white text-base font-bold flex-1" numberOfLines={1}>
                      {`${firstName} ${lastName}`}
                    </Text>
                  </View>

                  <View className="w-full flex flex-row justify-between mt-1 px-1">
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-on-surface-variant text-[11px] font-semibold uppercase">Mins</Text>
                      <Text className="text-white font-bold text-xs">
                        {`${player.total_minutes || player.minutes || 0}`}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-on-surface-variant text-[11px] font-semibold uppercase">Pts</Text>
                      <Text className="text-court-orange font-bold text-xs">{pts}</Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-on-surface-variant text-[11px] font-semibold uppercase">Falt</Text>
                      <Text className="text-white font-bold text-xs">
                        {`${falt}`}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-on-surface-variant text-[11px] font-semibold uppercase">Val</Text>
                      <Text className="text-tactical-blue-light font-bold text-xs">{val}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex flex-row justify-end items-center gap-1">
                  <TouchableOpacity
                    onPress={() => onEdit(player)}
                    className="p-2 min-w-[48px] min-h-[48px] items-center justify-center rounded-lg active:bg-slate-dark"
                  >
                    <Feather name="edit" size={18} color="#0EA5E9" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDelete(player)}
                    className="p-2 min-w-[48px] min-h-[48px] items-center justify-center rounded-lg active:bg-slate-dark"
                  >
                    <Feather name="trash" size={18} color="#EF4444" />
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

export default PlayerCards;
