import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import useDB from "../hooks/useDB";
import TrainingPlayer from "./TrainingPlayer";
import ModalInfo from "../framework/ModalInfo";

const TrainingDetail = ({ data }) => {
  const { TraningPlayersController, TrainingController } = useDB();
  const [trainingPlayers, setTrainingPlayers] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    getPlayers();
  }, []);
  const getPlayers = async () => {
    TrainingController.loadTPlayers(data.id, setTrainingPlayers);
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
    <View className="w-full h-full flex flex-col justify-center items-center">
      <ModalInfo
        title={`${exerciseDetails?.name}`}
        information={`${exerciseDetails?.explanation}`}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
      <Text className="font-bold text-danish-white text-lg mb-5">
        Sesión #{data.training_number} - {data.date}
      </Text>
      <Text className="text-left w-full text-danish-white px-5">
        Asistencias
      </Text>
      <View className="w-full max-h-96 border-b border-danish-red mb-2">
        <ScrollView>
          <View className="w-full flex flex-row flex-wrap justify-between items-center px-2">
            {trainingPlayers.map((tp) => (
              <TrainingPlayer
                key={tp.id}
                updateTrainingPlayer={updateTrainingPlayer}
                tp={tp}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="w-full my-2 px-2">
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
                    {data[`warmup${i}`]}
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
                    {data[`exercise${i}`]}
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
                    {data[`cooldown${i}`]}
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
