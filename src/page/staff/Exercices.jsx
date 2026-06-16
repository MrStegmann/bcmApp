import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native-web";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import PathEnums from "../../Enums/PathEnums";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { usePlaybookStore } from "../../store/PlaybookStore";
import { delAlert, errorAlert } from "../../helpers/AlertHelper";
import ExerciseItem from "../../components/exercices/ExerciseItem";

const Exercices = () => {
  const [exercices, setExercices] = useState([]);
  const fetchAll = usePlaybookStore((state) => state.fetchAll);
  const deleteExercice = usePlaybookStore((state) => state.deleteExercice);
  const loading = usePlaybookStore((state) => state.loading);
  const navigation = useNavigation();

  useEffect(() => {
    loadExercices();
  }, []);

  const loadExercices = async () => {
    try {
      const result = await fetchAll();
      setExercices(result);
    } catch (error) {
      setExercices([]);
      errorAlert(error.message);
    }
  };

  const handleSelect = (exercise) => {
    navigation.navigate(PathEnums.EXERCICEDETAILS, {
      exercise,
      onGoBack: loadExercices,
    });
  };

  const handleDelete = (exercise) => {
    delAlert(`Ejercicio ${exercise.title}`, async () => {
      try {
        await deleteExercice(exercise.id);
        loadExercices();
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
            navigation.navigate(PathEnums.EXERCICESFORM, {
              onGoBack: () => {},
            })
          }
        >
          <MaterialCommunityIcons name="traffic-cone" size={18} color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={exercices}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ExerciseItem
                exercise={item}
                onSelect={() => handleSelect(item)}
                onDelete={() => handleDelete(item)}
                onEdit={() =>
                  navigation.navigate(PathEnums.EXERCICESFORM, {
                    exercise: item,
                    onGoBack: loadExercices,
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

export default Exercices;
