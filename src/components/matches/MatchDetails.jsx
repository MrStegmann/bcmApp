import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { errorAlert } from "../../helpers/AlertHelper";
import { useMatchStore } from "../../store/MatchStore";
import GameStats from "./GameStats";
import StatsTable from "./StatsTable";
import SaveButton from "../../framework/SaveButton";
import { useNavigation } from "@react-navigation/native";

const PartialsInfo = ({ textLeft, textCenter, textRight }) => (
  <View className="w-full flex flex-row justify-between items-center border p-2">
    <Text className="w-11 text-sm text-center p-1">{textLeft}</Text>
    <Text className="w-11 text-sm text-center p-1">{textCenter}</Text>
    <Text className="w-11 text-sm text-center p-1">{textRight}</Text>
  </View>
);

const MatchDetails = ({ route }) => {
  const { onGoBack, match } = route.params;
  const navigation = useNavigation();
  const fetchQuarters = useMatchStore((state) => state.fetchQuarters);
  const fetchPlayersStatsByMatchId = useMatchStore(
    (state) => state.fetchPlayersStatsByMatchId,
  );

  const saveQuarters = useMatchStore((state) => state.saveQuarters);
  const saveStats = useMatchStore((state) => state.saveStats);

  const loading = useMatchStore((state) => state.loading);

  const [showEditPartial, setShowEditPartial] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const [quarters, setQuarters] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    loadMatchData();
  }, []);

  const loadMatchData = async () => {
    try {
      const qrts = await fetchQuarters(match.id);

      setQuarters(qrts);

      const pls = await fetchPlayersStatsByMatchId(match.id);

      setPlayers(pls);
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const onSavePartial = () => {
    try {
      const beforeState = [...quarters];
      const idx = beforeState.findIndex((q) => q.id === selectedQuarter.id);
      if (idx === -1) throw new Error("No se ha podido guardar el cuarto");
      beforeState.splice(idx, 1, selectedQuarter);

      setQuarters(beforeState);
      setShowEditPartial(false);
      setSelectedQuarter(null);
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const handleSave = async () => {
    try {
      await saveQuarters(quarters);
      await saveStats(players);

      navigation.goBack();
      onGoBack();
    } catch (error) {
      errorAlert(error.message);
    }
  };

  return (
    <View className="w-full flex-1 flex flex-col items-center px-2">
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditPartial}
        onRequestClose={() => setShowEditPartial(false)}
      >
        <View className="flex-1 justify-center items-center">
          {selectedQuarter ? (
            <View className="w-2/3 bg-gray-50 border border-gray-500 rounded-lg flex flex-col">
              <View className="w-full flex flex-row justify-between items-center p-4">
                <Text className="text-lg">Equipo</Text>
                <Text className="text-lg">{selectedQuarter.quarter}</Text>
                <Text className="text-lg">Rival</Text>
              </View>

              <View className="w-full flex flex-row justify-between items-center px-4">
                <TextInput
                  className="p-3 border rounded-lg w-16"
                  selectTextOnFocus
                  onChangeText={(value) =>
                    setSelectedQuarter({
                      ...selectedQuarter,
                      teamResult: Number(value),
                    })
                  }
                  value={`${selectedQuarter.teamResult}`}
                />
                <Text>-</Text>
                <TextInput
                  className="p-3 border rounded-lg w-16"
                  selectTextOnFocus
                  onChangeText={(value) =>
                    setSelectedQuarter({
                      ...selectedQuarter,
                      rivalResult: Number(value),
                    })
                  }
                  value={`${selectedQuarter.rivalResult}`}
                />
              </View>
              <View className="w-full flex items-center justify-center py-4">
                <TouchableOpacity
                  className="px-3 py-2 border rounded-lg"
                  onPress={onSavePartial}
                >
                  <Text>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
      <SaveButton onPress={handleSave} isLoading={loading} />
      <View className="w-full flex flex-row justify-between mt-2">
        <View className="w-1/3 flex flex-col items-center justify-center">
          <Text className="font-bold">Rival:</Text>
          <Text className="font-bold">{match.rival}</Text>
        </View>
        <View className="w-1/3 flex flex-col items-center justify-center">
          <Text className="font-bold">Jda y fecha:</Text>
          <Text className="font-bold">{`${match.round} - ${match.date}`}</Text>
        </View>
      </View>
      <View className="w-full flex flex-row justify-between">
        <GameStats players={players} quarters={quarters} />
        <View className="w-1/2 flex flex-col">
          <FlatList
            className={"w-full"}
            data={quarters}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={() => (
              <PartialsInfo
                textLeft={"Equipo"}
                textCenter={"Parcial"}
                textRight={"Rival"}
              />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  (setSelectedQuarter(item), setShowEditPartial(true));
                }}
              >
                <PartialsInfo
                  textLeft={item.teamResult}
                  textCenter={item.quarter}
                  textRight={item.rivalResult}
                />
              </TouchableOpacity>
            )}
          />
          <View className={"w-full"}>
            <PartialsInfo
              textLeft={quarters.reduce(
                (accumulator, current) => accumulator + current.teamResult,
                0,
              )}
              textCenter={"Total"}
              textRight={quarters.reduce(
                (accumulator, current) => accumulator + current.rivalResult,
                0,
              )}
            />
          </View>
        </View>
      </View>

      <StatsTable players={players} setPlayers={setPlayers} />
    </View>
  );
};

export default MatchDetails;
