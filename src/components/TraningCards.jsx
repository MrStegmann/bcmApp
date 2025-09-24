import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Feather } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

const TraningCards = ({ trainings, onSelect, onEdit, onDelete }) => {
  if (trainings.length === 0)
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray text-center">
          Parece que no aún no has registrado ningún entrenamiento
        </Text>
      </View>
    );

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        {trainings.map((training) => (
          <TouchableOpacity
            key={training.id}
            onPress={() => onSelect(training)}
            className="my-2 active:shadow-inner shadow-danish-red bg-transparent z-10 hover:bg-danish-red active:bg-danish-red"
          >
            <View className="w-full flex flex-row justify-between px-4 py-3 bg-danish-dark-gray rounded-xl shadow-lg shadow-danish-red border border-danish-red">
              <View className="w-2/3 flex flex-col">
                <Text className="text-danish-white text-sm">
                  Sesión {training.training_number} - {training.date}
                </Text>
              </View>

              <View className="w-1/3 flex flex-row justify-end items-center gap-3">
                <TouchableOpacity color="blue" onPress={() => onEdit(training)}>
                  <Feather name="edit" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  color="white"
                  onPress={() => onDelete(training)}
                >
                  <Feather name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TraningCards;
