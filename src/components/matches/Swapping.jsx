import React from "react";
import { Text, View, FlatList } from "react-native";
import { Entypo } from "@expo/vector-icons";
import {
  useBenchAndQuintetStore,
  usePlayPlayersStore,
} from "../../store/MatchStore";

const Swapping = React.memo(() => {
  const players = usePlayPlayersStore((state) => state.players);
  const toBench = useBenchAndQuintetStore((state) => state.toBench);
  const toQuintet = useBenchAndQuintetStore((state) => state.toQuintet);
  return (
    <View className="w-full flex flex-row justify-between">
      <View className="w-1/2">
        <FlatList
          contentContainerStyle={{ gap: 5 }}
          scrollEnabled={false}
          data={toQuintet}
          renderItem={({ item }) => (
            <View key={item}>
              <Text className="text-left text-xs">{`${players[item].number} - ${players[item].name} ${players[item].lastname}`}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </View>
      <View className="flex flex-row items-center justify-center">
        <Entypo name="swap" size={11} color="black" />
      </View>
      <View className="w-1/2">
        <FlatList
          contentContainerStyle={{ gap: 5 }}
          scrollEnabled={false}
          data={toBench}
          renderItem={({ item }) => (
            <View key={item}>
              <Text className="text-right text-xs">{`${players[item].number} - ${players[item].name} ${players[item].lastname}`}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </View>
  );
});

export default Swapping;
