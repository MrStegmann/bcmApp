import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import useDB from "../hooks/useDB";
import TrainingPlayer from "./TrainingPlayer";
import ModalInfo from "../framework/ModalInfo";

interface TrainingDetailProps {
  data: any;
  onReturn?: () => void;
}

const TrainingDetail: React.FC<TrainingDetailProps> = ({ data }) => {
  const { TraningPlayersController, TrainingController } = useDB();
  const [trainingPlayers, setTrainingPlayers] = useState<any[]>([]);
  const [exerciseDetails, setExerciseDetails] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (data?.id) {
      getPlayers();
    }
  }, [data]);

  const getPlayers = async () => {
    if (data?.id) {
      TrainingController.loadTPlayers(data.id, setTrainingPlayers);
    }
  };

  const updateTrainingPlayer = async (tp: any) => {
    await TraningPlayersController.edit(tp);
    getPlayers();
  };

  const handleOpenInfoModal = (item: any) => {
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
        title={`${exerciseDetails?.name || ""}`}
        information={`${exerciseDetails?.explanation || ""}`}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
      <Text className="font-bold text-danish-white text-lg mb-5">
        Sesión #{data?.trainingNumber || data?.training_number || 1} - {data?.date || ""}
      </Text>
      <Text className="text-left w-full text-danish-white px-5">
        Asistencias
      </Text>
      <View className="w-full h-80 max-h-80 border-b border-danish-red mb-2">
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
              const val = data[`warmup${i}`];
              if (!val) return null;
              return (
                <TouchableOpacity
                  key={i}
                  className="flex-row justify-between bg-danish-dark-gray rounded-lg shadow-lg shadow-danish-red py-1 px-2 border border-danish-red hover:border-danish-gold active:border-danish-gold hover:bg-danish-red active:bg-danish-red"
                  onPress={() =>
                    handleOpenInfoModal({
                      name: val,
                      explanation: data[`warmup${i}_explanation`] || data[`warmup${i}Explanation`],
                    })
                  }
                >
                  <Text className="text-danish-white">
                    {`${i} - ${val}`}
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
              const val = data[`exercise${i}`];
              if (!val) return null;
              return (
                <TouchableOpacity
                  key={i}
                  className="flex-row justify-between bg-danish-dark-gray rounded-lg shadow-lg shadow-danish-red py-1 px-2 border border-danish-red hover:bg-danish-red active:bg-danish-red"
                  onPress={() =>
                    handleOpenInfoModal({
                      name: val,
                      explanation: data[`exercise${i}_explanation`] || data[`exercise${i}Explanation`],
                    })
                  }
                >
                  <Text className="text-danish-white">
                    {`${i} - ${val}`}
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
              const val = data[`cooldown${i}`];
              if (!val) return null;
              return (
                <TouchableOpacity
                  key={i}
                  className="flex-row justify-between bg-danish-dark-gray rounded-lg shadow-lg shadow-danish-red py-1 px-2 border border-danish-red hover:bg-danish-red active:bg-danish-red"
                  onPress={() =>
                    handleOpenInfoModal({
                      name: val,
                      explanation: data[`cooldown${i}_explanation`] || data[`cooldown${i}Explanation`],
                    })
                  }
                >
                  <Text className="text-danish-white">
                    {`${i} - ${val}`}
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
