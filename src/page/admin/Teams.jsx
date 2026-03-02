import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../store/AuthStore";
import { useTeamStore } from "../../store/TeamStore";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import TeamItem from "../../components/team/TeamItem";
import { delAlert, errorAlert } from "../../helpers/AlertHelper";
import PathEnums from "../../Enums/PathEnums";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const user = useAuthStore((state) => state.user);
  const fetchTeams = useTeamStore((state) => state.fetchTeams);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);
  const setTeam = useTeamStore((state) => state.setTeam);
  const loading = useTeamStore((state) => state.loading);

  const navigation = useNavigation();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const result = await fetchTeams(user.club.id);
      setTeams(result);
    } catch (error) {
      setTeams([]);
      errorAlert(error.message);
    }
  };

  const handleSelectTeam = (team) => {
    setTeam(team);
    navigation.replace(PathEnums.TEAMMANAGER);
  };

  const handleDeleteTeam = (team) => {
    delAlert(team.name, async () => {
      try {
        await deleteTeam(team.id);
        loadTeams();
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
            navigation.navigate(PathEnums.TEAMFORM, { onGoBack: loadTeams })
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
            data={teams}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TeamItem
                team={item}
                onSelect={() => handleSelectTeam(item)}
                onDelete={handleDeleteTeam}
                onEdit={() =>
                  navigation.navigate(PathEnums.TEAMFORM, {
                    team: item,
                    onGoBack: loadTeams,
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

export default Teams;
