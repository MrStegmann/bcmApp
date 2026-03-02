import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { delAlert, errorAlert } from "../../helpers/AlertHelper";
import { usePlayerStore } from "../../store/PlayerStore";
import PlayerItem from "../../components/players/PlayerItem";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import PathEnums from "../../Enums/PathEnums";
import { useTeamStore } from "../../store/TeamStore";

const Players = () => {
  const [players, setPlayers] = useState([]);

  const team = useTeamStore((state) => state.team);
  const loading = usePlayerStore((state) => state.loading);
  const fetchPlayersByTeam = usePlayerStore(
    (state) => state.fetchPlayersByTeam,
  );
  const deletePlayer = usePlayerStore((state) => state.deletePlayer);

  const navigation = useNavigation();
  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const result = await fetchPlayersByTeam(team.id);
      setPlayers(result);
    } catch (error) {
      setPlayers([]);
      errorAlert(error.message);
    }
  };

  const handleSelectPlayer = (player) => {
    navigation.navigate(PathEnums.PLAYERDETAILS, {
      player,
      onGoBack: loadPlayers,
    });
  };

  const handleDeletePlayer = (player) => {
    delAlert(player.name, async () => {
      try {
        await deletePlayer(player.id);
        loadPlayers();
      } catch (error) {
        errorAlert(error.message);
      }
    });
  };

  return (
    <View className="w-full flex-1 flex flex-col justify-center items-center px-5 gap-5">
      <View className="w-full flex flex-row justify-center items-center mt-5">
        <TouchableOpacity
          className="p-4 border rounded-full self-end"
          onPress={() =>
            navigation.navigate(PathEnums.PLAYERFORM, {
              onGoBack: loadPlayers,
            })
          }
        >
          <Entypo name="add-user" size={18} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={players}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PlayerItem
                player={item}
                onSelect={() => handleSelectPlayer(item)}
                onDelete={handleDeletePlayer}
                onEdit={() =>
                  navigation.navigate(PathEnums.PLAYERFORM, {
                    player: item,
                    onGoBack: loadPlayers,
                  })
                }
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Players;
