import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import PathEnums from "../../Enums/PathEnums";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Trainings = () => {
  const navigation = useNavigation();
  return (
    <View className="w-full flex-1 flex flex-col justify-center items-center px-5 gap-5">
      <View className="w-full flex flex-row justify-center items-center mt-5">
        <TouchableOpacity
          className="p-4 border rounded-full self-end"
          onPress={() =>
            navigation.navigate(PathEnums.EXERCICESFORM, {
              onGoBack: () => {},
            })
          }
        >
          <MaterialCommunityIcons name="traffic-cone" size={18} color="black" />
        </TouchableOpacity>
      </View>
      <Text>Trainings</Text>
    </View>
  );
};

export default Trainings;
