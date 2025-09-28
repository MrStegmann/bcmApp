import { useEffect, useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Input from "../framework/Input";

const TrainingPlayer = ({ tp, updateTrainingPlayer }) => {
  if (!tp) return null;
  const [notes, setNotes] = useState(tp.notes);

  useEffect(() => {
    if (tp) {
      setNotes(tp.notes || "");
    }
  }, [tp]);

  return (
    <View
      className={`w-full mx-1 my-1 p-2 rounded-lg bg-danish-dark-gray border-2 shadow-lg flex flex-col justify-center items-center relative ${Boolean(tp.assistance) ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
    >
      <TouchableOpacity
        className="absolute top-2 left-2"
        onPress={() =>
          updateTrainingPlayer({
            notes,
            assistance: !Boolean(tp.assistance),
            id: tp.tp_id,
          })
        }
      >
        {Boolean(tp.assistance) ? (
          <FontAwesome6 name="person-circle-check" size={18} color="gold" />
        ) : (
          <FontAwesome6
            name="person-circle-exclamation"
            size={18}
            color="red"
          />
        )}
      </TouchableOpacity>

      <View className="w-full flex justify-center items-center">
        <Text className="text-sm font-bold text-danish-white w-4/5 text-center">
          {tp.first_name} {tp.last_name}
        </Text>
      </View>

      <View className="w-full flex flex-col justify-between items-center mt-5 px-1">
        <TextInput
          value={notes}
          multiline={true}
          numberOfLines={4}
          scrollEnabled={true}
          onChangeText={setNotes}
          placeholder="Notas"
          className="border-2 rounded-xl border-danish-red shadow-inner shadow-danish-gold px-3 w-full bg-danish-dark-gray text-danish-white placeholder:text-danish-white text-xs"
          onEndEditing={() =>
            updateTrainingPlayer({
              notes,
              assistance: tp.assistance,
              id: tp.tp_id,
            })
          }
        />
      </View>
    </View>
  );
};

export default TrainingPlayer;
