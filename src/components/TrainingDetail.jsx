import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native-web";
import useDB from "../hooks/useDB";
import TrainingPlayer from "./TrainingPlayer";
import ModalInfo from "../framework/ModalInfo";

const TrainingDetail = ({ data }) => {
  const { TraningPlayersController, TrainingController } = useDB();
  const [showPlayers, setShowPlayers] = useState(false);
  const [trainingPlayers, setTrainingPlayers] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    getPlayers();
  }, []);
  const getPlayers = async () => {
    const result = await TrainingController.loadTPlayers(data.id);
    setTrainingPlayers(result);
  };

  const updateTrainingPlayer = async (trainingPlayer) => {
    await TraningPlayersController.edit(trainingPlayer);
    getPlayers();
  };

  const handleOpenInfoModal = (item) => {
    setExerciseDetails(item);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setExerciseDetails(null);
  };
  return (
    <View className="w-full h-full flex-1 flex flex-col justify-center items-center">
      <ModalInfo
        title={`${exerciseDetails?.name}`}
        information={
          <Text className="text-danish-white">
            {exerciseDetails?.explanation}
          </Text>
        }
        visible={modalVisible}
        onClose={handleCloseModal}
      />

      <ModalInfo
        title={`Asistencia`}
        information={
          <FlatList
            data={trainingPlayers}
            renderItem={({ item }) => (
              <TrainingPlayer
                updateTrainingPlayer={updateTrainingPlayer}
                tp={item}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        }
        visible={showPlayers}
        onClose={() => setShowPlayers(false)}
      />
      <Text className="font-bold text-danish-white text-lg mb-5">
        Sesión #{data.training_number} - {data.date}
      </Text>

      <TouchableOpacity
        className="flex items-center bg-danish-dark-gray rounded-lg shadow-lg shadow-danish-red p-1 border border-danish-red hover:border-danish-gold active:border-danish-gold hover:bg-danish-red active:bg-danish-red"
        onPress={() => setShowPlayers(true)}
      >
        <Text className="text-center text-danish-white">Asistencias</Text>
      </TouchableOpacity>

      <View className="w-full my-2">
        <View className="p-2 mb-2 rounded-lg border-2 border-danish-red">
          <Text className="font-semibold text-danish-white text-sm mb-1">
            Calentamiento
          </Text>
          <View className="w-full flex flex-row flex-wrap gap-3">
            {[1, 2, 3].map((i) => {
              if (
                data[`warmup${i}`] === "" ||
                data[`warmup${i}`] === undefined ||
                data[`warmup${i}`] === null
              )
                return;
              return (
                <TouchableOpacity
                  key={i}
                  className="flex-row justify-between bg-danish-dark-gray rounded-lg shadow-lg shadow-danish-red py-1 px-2 border border-danish-red hover:border-danish-gold active:border-danish-gold hover:bg-danish-red active:bg-danish-red"
                  onPress={() =>
                    handleOpenInfoModal({
                      name: data[`warmup${i}`],
                      explanation: data[`warmup${i}_explanation`],
                    })
                  }
                >
                  <Text className=" text-danish-white">
                    {i + " - " + data[`warmup${i}`]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="p-2 mb-2 rounded-lg border-2 border-danish-red">
          <Text className="font-semibold text-danish-white text-sm mb-1">
            Ejercicios
          </Text>
          <View className="w-full flex flex-row flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => {
              if (
                data[`exercise${i}`] === "" ||
                data[`exercise${i}`] === undefined ||
                data[`exercise${i}`] === null
              )
                return;
              return (
                <TouchableOpacity
                  key={i}
                  className="flex-row justify-between bg-danish-dark-gray rounded-lg shadow-lg shadow-danish-red py-1 px-2 border border-danish-red hover:bg-danish-red active:bg-danish-red"
                  onPress={() =>
                    handleOpenInfoModal({
                      name: data[`exercise${i}`],
                      explanation: data[`exercise${i}_explanation`],
                    })
                  }
                >
                  <Text className=" text-danish-white">
                    {i + " - " + data[`exercise${i}`]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="p-2 mb-2 rounded-lg border-2 border-danish-red">
          <Text className="font-semibold text-danish-white text-sm mb-1">
            Vuelta a la calma
          </Text>
          <View className="w-full flex flex-row flex-wrap gap-3">
            {[1, 2].map((i) => {
              if (
                data[`cooldown${i}`] === "" ||
                data[`cooldown${i}`] === undefined ||
                data[`cooldown${i}`] === null
              )
                return;
              return (
                <TouchableOpacity
                  key={i}
                  className="flex-row justify-between bg-danish-dark-gray rounded-lg shadow-lg shadow-danish-red py-1 px-2 border border-danish-red hover:bg-danish-red active:bg-danish-red"
                  onPress={() =>
                    handleOpenInfoModal({
                      name: data[`cooldown${i}`],
                      explanation: data[`cooldown${i}_explanation`],
                    })
                  }
                >
                  <Text className=" text-danish-white">
                    {i + " - " + data[`cooldown${i}`]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TrainingDetail;
