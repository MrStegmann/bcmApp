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
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray text-center">
          Parece que aún no has registrado ningún jugador
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
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
              className="my-2 active:shadow-inner shadow-danish-red bg-transparent z-10 hover:bg-danish-red active:bg-danish-red"
            >
              <View className="w-full flex flex-row justify-between px-4 py-3 bg-danish-dark-gray rounded-xl shadow-lg shadow-danish-red border border-danish-red">
                <View className="w-2/3 flex flex-col">
                  <Text className="text-danish-white text-sm">
                    {`${number} - ${firstName} ${lastName}`}
                  </Text>
                  <View className="w-full flex flex-row justify-between mt-1">
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Mins</Text>
                      <Text className="text-danish-white text-sm">
                        {`${player.total_minutes || player.minutes || 0}`}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Pts</Text>
                      <Text className="text-danish-white text-sm">{pts}</Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Falt</Text>
                      <Text className="text-danish-white text-sm">
                        {`${falt}`}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                      <Text className="text-danish-white text-sm">Val</Text>
                      <Text className="text-danish-white text-sm">{val}</Text>
                    </View>
                  </View>
                </View>

                <View className="w-1/3 flex flex-row justify-end items-center gap-3">
                  <TouchableOpacity onPress={() => onEdit(player)}>
                    <Feather name="edit" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDelete(player)}>
                    <Feather name="trash" size={18} color="red" />
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
