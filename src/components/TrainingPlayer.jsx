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
    <TouchableOpacity
      className={`w-2/5 my-1 p-2 rounded-lg bg-danish-dark-gray border-2 shadow-lg flex flex-col justify-center items-center relative ${Boolean(tp.assistance) ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
      onPress={() =>
        updateTrainingPlayer({
          notes,
          assistance: !Boolean(tp.assistance),
          id: tp.tp_id,
        })
      }
    >
      {Boolean(tp.assistance) ? (
        <FontAwesome6 name="person-circle-check" size={16} color="gold" />
      ) : (
        <FontAwesome6 name="person-circle-exclamation" size={16} color="red" />
      )}

      <Text className="text-xs font-bold text-danish-white mt-2">
        {tp.first_name} {tp.last_name}
      </Text>

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
    </TouchableOpacity>
  );
};

export default TrainingPlayer;
