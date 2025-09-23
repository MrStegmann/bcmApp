import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import useDB from "../hooks/useDB";
import TrainingPlayer from "./TrainingPlayer";

const TrainingDetail = ({ data }) => {
  const { TraningPlayersController, TrainingController } = useDB();
  const [trainingPlayers, setTrainingPlayers] = useState([]);
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
  return (
    <View className="flex-1 w-full h-full justify-start items-center">
      <ScrollView className="flex-1 bg-white p-4 my-2 max-h-[49rem]">
        <View className="mb-5">
          {trainingPlayers.map((tp) => (
            <TrainingPlayer
              key={tp.id}
              updateTrainingPlayer={updateTrainingPlayer}
              tp={tp}
            />
          ))}
        </View>
        {/* Sesión y fecha */}
        <View className="border border-gray-400 p-2 mb-2 rounded-lg">
          <Text className="font-bold text-lg">
            Sesión #{data.training_number} - {data.date}
          </Text>
        </View>

        {/* Calentamiento */}
        <View className="border border-gray-400 p-2 mb-2 rounded-lg">
          <Text className="font-semibold text-blue-700 text-base mb-1">
            Calentamiento
          </Text>
          <Text className="text-sm font-bold">Nombre - Explicación</Text>

          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="flex-row justify-between border-t border-gray-300 py-1"
            >
              <Text className="w-1/2">{data[`warmup${i}`]}</Text>
              <Text className="w-1/2">{data[`warmup${i}_explanation`]}</Text>
            </View>
          ))}
        </View>

        {/* Ejercicios */}
        <View className="border border-gray-400 p-2 mb-2 rounded-lg">
          <Text className="font-semibold text-green-700 text-base mb-1">
            Ejercicios
          </Text>
          <Text className="text-sm font-bold">Nombre - Explicación</Text>

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View
              key={i}
              className="flex-row justify-between border-t border-gray-300 py-1"
            >
              <Text className="w-1/2">{data[`exercise${i}`]}</Text>
              <Text className="w-1/2">{data[`exercise${i}_explanation`]}</Text>
            </View>
          ))}
        </View>

        {/* Vuelta a la calma */}
        <View className="border border-gray-400 p-2 rounded-lg">
          <Text className="font-semibold text-purple-700 text-base mb-1">
            Vuelta a la calma
          </Text>
          <Text className="text-sm font-bold">Nombre - Explicación</Text>

          {[1, 2].map((i) => (
            <View
              key={i}
              className="flex-row justify-between border-t border-gray-300 py-1"
            >
              <Text className="w-1/2">{data[`cooldown${i}`]}</Text>
              <Text className="w-1/2">{data[`cooldown${i}_explanation`]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TrainingDetail;
