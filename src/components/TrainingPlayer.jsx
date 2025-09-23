import { useEffect, useState } from "react";
import { Button, Switch, Text, TextInput, View } from "react-native";

const TrainingPlayer = ({ tp, updateTrainingPlayer }) => {
  if (!tp) return null;
  const [notes, setNotes] = useState(tp.notes);
  const [lastNotes, setLastNotes] = useState(tp.notes);

  useEffect(() => {
    if (tp) {
      setNotes(tp.notes || "");
      setLastNotes(tp.notes || "");
    }
  }, [tp]);

  return (
    <View className="w-full p-2 rounded-xl flex flex-col justify-center items-center">
      <View className="w-full flex flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold w-40">
          {tp.first_name} {tp.last_name}
        </Text>
        <View className="flex flex-row items-center">
          <Text>Asistencia</Text>
          <Switch
            value={Boolean(tp.assistance)}
            onValueChange={(state) =>
              updateTrainingPlayer({ notes, assistance: state, id: tp.tp_id })
            }
          />
        </View>
      </View>
      <View className="w-full flex flex-row h-16 justify-between items-center">
        <TextInput
          value={notes}
          multiline={true}
          numberOfLines={2}
          onChangeText={setNotes}
          placeholder="Notas"
          className="w-2/3 border-4 rounded-xl border-blue-400 px-4 py-1 mb-5"
        />
        <View className="w-1/4">
          <Button
            title="Guardar Notas"
            onPress={() =>
              updateTrainingPlayer({
                notes,
                assistance: tp.assistance,
                id: tp.tp_id,
              })
            }
            disabled={notes === lastNotes}
          />
        </View>
      </View>
    </View>
  );
};

export default TrainingPlayer;
