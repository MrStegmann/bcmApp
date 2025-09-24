import { useState, useEffect, useMemo } from "react";
import { Text, View, ScrollView, TextInput } from "react-native";
import { useClubStore } from "../store/ClubStore";
import Input from "../framework/Input";
import Button from "../framework/Button";

const TrainingForm = ({ onSubmit, trainingData }) => {
  const club = useClubStore((state) => state.club);
  const [trainingNumber, setTrainingNumber] = useState("1");
  const [wrongTrainingNumber, setWrongTrainingNumber] = useState("");
  const [date, setDate] = useState("");
  const [wrongDate, setWrongDate] = useState("");
  const [warmup, setWarmup] = useState({
    warmup1: "",
    warmup1Explanation: "",
    warmup2: "",
    warmup2Explanation: "",
    warmup3: "",
    warmup3Explanation: "",
  });
  const [exercise, setExercise] = useState({
    exercise1: "",
    exercise1Explanation: "",
    exercise2: "",
    exercise2Explanation: "",
    exercise3: "",
    exercise3Explanation: "",
    exercise4: "",
    exercise4Explanation: "",
    exercise5: "",
    exercise5Explanation: "",
    exercise6: "",
    exercise6Explanation: "",
  });
  const [cooldown, setCooldown] = useState({
    cooldown1: "",
    cooldown1Explanation: "",
    cooldown2: "",
    cooldown2Explanation: "",
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

  useEffect(() => {
    setWrongTrainingNumber("");
    setWrongDate("");
  }, [date, trainingNumber]);

  const handleSubmit = () => {
    if (trainingNumber === "")
      setWrongTrainingNumber("Debes introducir la sesión de entrenamiento");
    if (date === "") setWrongDate("Debes introducir una fecha para la sesión");
    if ([date, trainingNumber].includes("")) return;

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
    <View className="w-full h-full">
      <View className="w-full h-[45rem] mb-5 border-b border-danish-red">
        <ScrollView horinzontal={false} showsVerticalScrollIndicator={true}>
          <View className="flex flex-row w-full items-center justify-between px-2">
            <View className="w-1/3">
              <Input
                label={"Sesión"}
                value={trainingNumber}
                onChange={setTrainingNumber}
                keyboardType="numeric"
                wrongMsg={wrongTrainingNumber}
              />
            </View>
            <View className="w-1/3">
              <Input
                label={"Fecha"}
                value={date}
                onChange={setDate}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                type="date"
                wrongMsg={wrongDate}
              />
            </View>
          </View>
          <View className="w-full flex flex-col px-2">
            <Text className="font-bold mt-5 text-danish-light-gray px-4">
              Entrada en calor
            </Text>
            <View className="w-full rounded-lg bg-danish-dark-gray border border-danish-red shadow-lg shadow-danish-red flex flex-row flex-wrap py-2 justify-center items-center">
              {[1, 2, 3].map((key, index) => (
                <View
                  key={key}
                  className="w-2/5 flex flex-col bg-gray-900 shadow shadow-danish-red rounded-xl mx-2 my-2 p-2"
                >
                  <Text className="text-danish-white font-bold text-sm mb-2">
                    Calentamiento {key}
                  </Text>
                  <View className="w-full flex flex-col">
                    <Input
                      value={warmup[`warmup${key}`]}
                      onChange={(text) =>
                        setWarmup((prev) => ({
                          ...prev,
                          [`warmup${key}`]: text,
                        }))
                      }
                      placeholder="Nombre del ejercicio"
                    />
                    <Input
                      value={warmup[`warmup${key}Explanation`]}
                      multiline={true}
                      onChange={(text) =>
                        setWarmup((prev) => ({
                          ...prev,
                          [`warmup${key}Explanation`]: text,
                        }))
                      }
                      placeholder="Explicación del ejercicio"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="w-full flex flex-col px-2">
            <Text className="font-bold mt-5 text-danish-light-gray px-4">
              Principal
            </Text>
            <View className="w-full rounded-lg bg-danish-dark-gray border border-danish-red shadow-lg shadow-danish-red flex flex-row flex-wrap py-2 justify-center items-center">
              {[1, 2, 3, 4, 5, 6].map((key, index) => (
                <View
                  key={key}
                  className="w-2/5 flex flex-col bg-gray-900 shadow shadow-danish-red rounded-xl mx-2 my-2 p-2"
                >
                  <Text className="text-danish-white font-bold text-sm mb-2">
                    Ejercicio {key}
                  </Text>
                  <View className="w-full flex flex-col">
                    <Input
                      value={exercise[`exercise${key}`]}
                      onChange={(text) =>
                        setExercise((prev) => ({
                          ...prev,
                          [`exercise${key}`]: text,
                        }))
                      }
                      placeholder="Nombre del ejercicio"
                    />
                    <Input
                      value={exercise[`exercise${key}Explanation`]}
                      multiline={true}
                      onChange={(text) =>
                        setExercise((prev) => ({
                          ...prev,
                          [`exercise${key}Explanation`]: text,
                        }))
                      }
                      placeholder="Explicación del ejercicio"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="w-full flex flex-col px-2">
            <Text className="font-bold mt-5 text-danish-light-gray px-4">
              Vuelta a la Calma
            </Text>
            <View className="w-full rounded-lg bg-danish-dark-gray border border-danish-red shadow-lg shadow-danish-red flex flex-row flex-wrap py-2 justify-center items-center">
              {[1, 2].map((key, index) => (
                <View
                  key={key}
                  className="w-2/5 flex flex-col bg-gray-900 shadow shadow-danish-red rounded-xl mx-2 my-2 p-2"
                >
                  <Text className="text-danish-white font-bold text-sm mb-2">
                    Ejercicio {key}
                  </Text>
                  <View className="w-full flex flex-col">
                    <Input
                      value={cooldown[`cooldown${key}`]}
                      onChange={(text) =>
                        setCooldown((prev) => ({
                          ...prev,
                          [`cooldown${key}`]: text,
                        }))
                      }
                      placeholder="Nombre del ejercicio"
                    />
                    <Input
                      value={cooldown[`cooldown${key}Explanation`]}
                      multiline={true}
                      onChange={(text) =>
                        setCooldown((prev) => ({
                          ...prev,
                          [`cooldown${key}Explanation`]: text,
                        }))
                      }
                      placeholder="Explicación del ejercicio"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <View className="w-full px-2">
        <Button
          title={trainingData ? "Guardar" : "Crear entrenamiento"}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default TrainingForm;
