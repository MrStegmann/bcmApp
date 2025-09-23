import { useState, useEffect } from "react";
import { Text, View, ScrollView, TextInput } from "react-native";
import { useClubStore } from "../store/ClubStore";
import Input from "../framework/Input";
import Button from "../framework/Button";

const TrainingForm = ({ onSubmit, trainingData }) => {
  const club = useClubStore((state) => state.club);
  const [trainingNumber, setTrainingNumber] = useState("1");
  const [wrongTrainingNumber, setWrongTrainingNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [wrongDate, setWrongDate] = useState("");
  const [warmup, setWarmup] = useState({
    warmup1: "Lalalala",
    warmup1Explanation: "lelelele",
    warmup2: "Lalalala",
    warmup2Explanation: "Lalalala",
    warmup3: "Lalalala",
    warmup3Explanation: "Lalalala",
  });
  const [exercise, setExercise] = useState({
    exercise1: "Lalalala",
    exercise1Explanation: "Lalalala",
    exercise2: "Lalalala",
    exercise2Explanation: "Lalalala",
    exercise3: "Lalalala",
    exercise3Explanation: "Lalalala",
    exercise4: "Lalalala",
    exercise4Explanation: "Lalalala",
    exercise5: "Lalalala",
    exercise5Explanation: "Lalalala",
    exercise6: "Lalalala",
    exercise6Explanation: "Lalalala",
  });
  const [cooldown, setCooldown] = useState({
    cooldown1: "Lalalala",
    cooldown1Explanation: "Lalalala",
    cooldown2: "Lalalala",
    cooldown2Explanation: "Lalalala",
  });

  useEffect(() => {
    if (trainingData) {
      setTrainingNumber(trainingData.training_number.toString());
      setDate(trainingData.date);
      setWarmup({
        warmup1: trainingData.warmup1,
        warmup1Explanation: trainingData.warmup1_explanation,
        warmup2: trainingData.warmup2,
        warmup2Explanation: trainingData.warmup2_explanation,
        warmup3: trainingData.warmup3,
        warmup3Explanation: trainingData.warmup3_explanation,
      });
      setExercise({
        exercise1: trainingData.exercise1,
        exercise1Explanation: trainingData.exercise1_explanation,
        exercise2: trainingData.exercise2,
        exercise2Explanation: trainingData.exercise2_explanation,
        exercise3: trainingData.exercise3,
        exercise3Explanation: trainingData.exercise3_explanation,
        exercise4: trainingData.exercise4,
        exercise4Explanation: trainingData.exercise4_explanation,
        exercise5: trainingData.exercise5,
        exercise5Explanation: trainingData.exercise5_explanation,
        exercise6: trainingData.exercise6,
        exercise6Explanation: trainingData.exercise6_explanation,
      });
      setCooldown({
        cooldown1: trainingData.cooldown1,
        cooldown1Explanation: trainingData.cooldown1_explanation,
        cooldown2: trainingData.cooldown2,
        cooldown2Explanation: trainingData.cooldown2_explanation,
      });
    }
  }, [trainingData]);

  const handleSubmit = () => {
    onSubmit({
      id: trainingData?.id,
      team_id: trainingData?.team_id || club.id,
      training_number: trainingNumber,
      date,
      ...warmup,
      ...exercise,
      ...cooldown,
    });
  };
  return (
    <View className="w-full px-2 flex-1 pb-10">
      <ScrollView horinzontal={false} showsVerticalScrollIndicator={true}>
        <View className="w-full h-full">
          <View className="flex flex-row w-full items-center justify-between">
            <Input
              label={"Sesión"}
              value={trainingNumber}
              onChange={setTrainingNumber}
              keyboardType="numeric"
              wrongMsg={wrongTrainingNumber}
            />
          </View>
          <View className="flex flex-row w-full items-center justify-between">
            <Input
              label={"Fecha"}
              value={date}
              onChange={setDate}
              keyboardType="numeric"
              placeholder="Fecha (YYYY-MM-DD)"
              wrongMsg={wrongDate}
            />
          </View>
          <Text className="text-2xl font-bold mt-5">Calentamiento</Text>
          <View className="flex flex-col w-full items-center">
            {[1, 2, 3].map((key, index) => (
              <View
                key={key}
                className="w-full flex flex-col bg-danish-red rounded-xl my-2 p-3"
              >
                <Text className="text-danish-white font-bold text-lg">
                  Calentamiento {key}
                </Text>
                <View className="w-full flex flex-row justify-between px-2 mt-2">
                  <Text className="text-sm font-bold text-danish-white">
                    Nombre
                  </Text>
                  <Text className="text-sm text-left font-bold text-danish-white">
                    Explicación
                  </Text>
                </View>
                <View className="w-full flex flex-row justify-between mb-2">
                  <TextInput
                    value={warmup[`warmup${key}`]}
                    onChangeText={(text) =>
                      setWarmup((prev) => ({ ...prev, [`warmup${key}`]: text }))
                    }
                    placeholder="Nombre del ejercicio"
                    className="w-1/4 rounded-xl bg-danish-white px-2 py-1"
                  />
                  <TextInput
                    value={warmup[`warmup${key}_explanation`]}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={(text) =>
                      setWarmup((prev) => ({
                        ...prev,
                        [`warmup${key}_explanation`]: text,
                      }))
                    }
                    placeholder="Explicación del ejercicio"
                    className="rounded-xl bg-danish-white px-4 py-1 w-2/3"
                  />
                </View>
              </View>
            ))}
          </View>

          <Text className="text-2xl font-bold mt-5">Principal</Text>
          <View className="flex flex-col w-full items-center">
            {[1, 2, 3, 4, 5, 6].map((key, index) => (
              <View
                key={key}
                className="w-full flex flex-col bg-danish-red rounded-xl my-2 p-3"
              >
                <Text className="text-danish-white font-bold text-lg">
                  Ejercicio {key}
                </Text>
                <View className="w-full flex flex-row justify-between px-2 mt-2">
                  <Text className="text-sm font-bold text-danish-white">
                    Nombre
                  </Text>
                  <Text className="text-sm text-left font-bold text-danish-white">
                    Explicación
                  </Text>
                </View>
                <View className="w-full flex flex-row justify-between mb-2">
                  <TextInput
                    value={exercise[`exercise${key}`]}
                    onChangeText={(text) =>
                      setExercise((prev) => ({
                        ...prev,
                        [`exercise${key}`]: text,
                      }))
                    }
                    placeholder="Nombre del ejercicio"
                    className="w-1/4 rounded-xl bg-danish-white px-2 py-1"
                  />
                  <TextInput
                    value={exercise[`exercise${key}_explanation`]}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={(text) =>
                      setExercise((prev) => ({
                        ...prev,
                        [`exercise${key}_explanation`]: text,
                      }))
                    }
                    placeholder="Explicación del ejercicio"
                    className="rounded-xl bg-danish-white px-4 py-1 w-2/3"
                  />
                </View>
              </View>
            ))}
          </View>

          <Text className="text-2xl font-bold mt-5">Vuelta a la Calma</Text>
          <View className="flex flex-col w-full items-center">
            {[1, 2].map((key, index) => (
              <View
                key={key}
                className="w-full flex flex-col bg-danish-red rounded-xl my-2 p-3"
              >
                <Text className="text-danish-white font-bold text-lg">
                  Ejercicio {key}
                </Text>
                <View className="w-full flex flex-row justify-between px-2 mt-2">
                  <Text className="text-sm font-bold text-danish-white">
                    Nombre
                  </Text>
                  <Text className="text-sm text-left font-bold text-danish-white">
                    Explicación
                  </Text>
                </View>
                <View className="w-full flex flex-row justify-between mb-2">
                  <TextInput
                    value={cooldown[`cooldown${key}`]}
                    onChangeText={(text) =>
                      setCooldown((prev) => ({
                        ...prev,
                        [`cooldown${key}`]: text,
                      }))
                    }
                    placeholder="Nombre del ejercicio"
                    className="w-1/4 rounded-xl bg-danish-white px-2 py-1"
                  />
                  <TextInput
                    value={cooldown[`cooldown${key}_explanation`]}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={(text) =>
                      setCooldown((prev) => ({
                        ...prev,
                        [`cooldown${key}_explanation`]: text,
                      }))
                    }
                    placeholder="Explicación del ejercicio"
                    className="rounded-xl bg-danish-white px-4 py-1 w-2/3"
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="flex flex-row justify-between w-full mt-5 mb-10">
        <Button
          title={trainingData ? "Guardar" : "Crear entrenamiento"}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default TrainingForm;
