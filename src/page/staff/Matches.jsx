import React, { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { delAlert, errorAlert } from "../../helpers/AlertHelper";
import { useMatchStore } from "../../store/MatchStore";
import { useNavigation } from "@react-navigation/native";
import PathEnums from "../../Enums/PathEnums";
import { useTeamStore } from "../../store/TeamStore";
import MatchItem from "../../components/matches/MatchItem";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SettingMatch from "../../components/matches/SettingMatch";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const team = useTeamStore((state) => state.team);
  const loading = useMatchStore((state) => state.loading);
  const fetchGamesByTeam = useMatchStore((state) => state.fetchGamesByTeam);
  const deleteMatch = useMatchStore((state) => state.deleteMatch);

  const navigation = useNavigation();
  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const result = await fetchGamesByTeam(team.id);
      setMatches(result);
    } catch (error) {
      setMatches([]);
      errorAlert(error.message);
    }
  };

  const handleSelect = (match) => {
    navigation.navigate(PathEnums.MATCHDETAILS, {
      match,
      onGoBack: loadMatches,
    });
  };

  const handleDelete = (match) => {
    delAlert(`jornada ${match.round} contra ${match.rival}`, async () => {
      try {
        await deleteMatch(match.id);
        loadMatches();
      } catch (error) {
        errorAlert(error.message);
      }
    });
  };

  const handlePlay = (match) => {
    navigation.navigate(PathEnums.MATCHPLAY, {
      match,
      onGoBack: loadMatches,
    });
  };

  return (
    <View className="w-full flex-1 flex flex-col justify-center items-center px-5 gap-5">
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettingModal}
        onRequestClose={() => setShowSettingModal(false)}
      >
        <SettingMatch
          match={selectedMatch}
          onClose={() => setShowSettingModal(false)}
        />
      </Modal>
      <View className="w-full flex flex-row justify-center items-center mt-5">
        <TouchableOpacity
          className="p-4 border rounded-full self-end"
          onPress={() =>
            navigation.navigate(PathEnums.MATCHFORM, {
              onGoBack: loadMatches,
            })
          }
        >
          <MaterialCommunityIcons name="basketball" size={18} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={matches}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MatchItem
                match={item}
                onPlay={() => handlePlay(item)}
                onConfigure={() => {
                  (setShowSettingModal(true), setSelectedMatch(item));
                }}
                onSelect={() => handleSelect(item)}
                onDelete={handleDelete}
                onEdit={() =>
                  navigation.navigate(PathEnums.MATCHFORM, {
                    match: item,
                    onGoBack: loadMatches,
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

export default Matches;
