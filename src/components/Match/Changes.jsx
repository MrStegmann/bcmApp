import { Text, View, FlatList } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

const BenchingOrQuinteitngPlayer = React.memo(({ playerInf, color }) => {
  return (
    <View className="w-full">
      <Text className="text-xs" style={{ color }}>
        {`${playerInf.number} - ${playerInf.first_name}`}
      </Text>
    </View>
  );
});

const Changes = ({ toBench, toQuintet, matchPlayers }) => {
  const benching = [...toBench.values()];
  const quinteting = [...toQuintet.values()];
  return (
    <View className="w-full flex flex-row justify-between items-center px-3">
      <View className="w-1/3">
        <FlatList
          data={benching}
          scrollEnabled={false}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center", // centra los ítems
            flexGrow: 1, // asegura que ocupe todo el espacio
          }}
          renderItem={({ item }) => (
            <BenchingOrQuinteitngPlayer
              playerInf={matchPlayers.players[item]}
              color="#78081d"
            />
          )}
          keyExtractor={(item) => item}
        />
      </View>
      <View className="w-1/3 flex items-center justify-center">
        <Entypo name="swap" size={13} color="white" />
      </View>
      <View className="w-1/3">
        <FlatList
          data={quinteting}
          scrollEnabled={false}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center", // centra los ítems
            flexGrow: 1, // asegura que ocupe todo el espacio
          }}
          renderItem={({ item }) => (
            <BenchingOrQuinteitngPlayer
              playerInf={matchPlayers.players[item]}
              color="#F8F8F8"
            />
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </View>
  );
};

export default Changes;
