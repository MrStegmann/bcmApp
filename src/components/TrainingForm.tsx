import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { useClubStore } from "../store/ClubStore";
import Input from "../framework/Input";
import Button from "../framework/Button";
import { Training } from "../types/database";

export interface TrainingFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  trainingData?: Partial<Training> | null;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit, trainingData }) => {
  const club = useClubStore((state) => state.club);
  const [trainingNumber, setTrainingNumber] = useState("");
  const [wrongTrainingNumber, setWrongTrainingNumber] = useState("");
  const [date, setDate] = useState("");
  const [wrongDate, setWrongDate] = useState("");

  const [warmup, setWarmup] = useState<Record<string, string>>({
    warmup1: "",
    warmup1_explanation: "",
    warmup2: "",
    warmup2_explanation: "",
    warmup3: "",
    warmup3_explanation: "",
  });

  const [exercise, setExercise] = useState<Record<string, string>>({
    exercise1: "",
    exercise1_explanation: "",
    exercise2: "",
    exercise2_explanation: "",
    exercise3: "",
    exercise3_explanation: "",
    exercise4: "",
    exercise4_explanation: "",
    exercise5: "",
    exercise5_explanation: "",
    exercise6: "",
    exercise6_explanation: "",
  });

  const [cooldown, setCooldown] = useState<Record<string, string>>({
    cooldown1: "",
    cooldown1_explanation: "",
    cooldown2: "",
    cooldown2_explanation: "",
  });

  useEffect(() => {
    if (trainingData) {
      const td = trainingData as any;
      setTrainingNumber((td.training_number ?? td.trainingNumber ?? "").toString());
      setDate(td.date || "");
      setWarmup({
        warmup1: td.warmup1 || "",
        warmup1_explanation: td.warmup1_explanation || td.warmup1Explanation || "",
        warmup2: td.warmup2 || "",
        warmup2_explanation: td.warmup2_explanation || td.warmup2Explanation || "",
        warmup3: td.warmup3 || "",
        warmup3_explanation: td.warmup3_explanation || td.warmup3Explanation || "",
      });
      setExercise({
        exercise1: td.exercise1 || "",
        exercise1_explanation: td.exercise1_explanation || td.exercise1Explanation || "",
        exercise2: td.exercise2 || "",
        exercise2_explanation: td.exercise2_explanation || td.exercise2Explanation || "",
        exercise3: td.exercise3 || "",
        exercise3_explanation: td.exercise3_explanation || td.exercise3Explanation || "",
        exercise4: td.exercise4 || "",
        exercise4_explanation: td.exercise4_explanation || td.exercise4Explanation || "",
        exercise5: td.exercise5 || "",
        exercise5_explanation: td.exercise5_explanation || td.exercise5Explanation || "",
        exercise6: td.exercise6 || "",
        exercise6_explanation: td.exercise6_explanation || td.exercise6Explanation || "",
      });
      setCooldown({
        cooldown1: td.cooldown1 || "",
        cooldown1_explanation: td.cooldown1_explanation || td.cooldown1Explanation || "",
        cooldown2: td.cooldown2 || "",
        cooldown2_explanation: td.cooldown2_explanation || td.cooldown2Explanation || "",
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

    const td = (trainingData as any) || {};
    onSubmit({
      id: td.id,
      team_id: td.team_id || td.teamId || club?.id,
      training_number: trainingNumber,
      date,
      ...warmup,
      ...exercise,
      ...cooldown,
    });
  };

  return (
    <View className="w-full h-full">
      <View className="w-full h-[45rem] mb-5">
        <ScrollView showsVerticalScrollIndicator={true}>
          <View className="flex flex-row w-full items-center justify-between px-2">
            <View className="w-1/3">
              <Input
                label={"Sesión"}
                value={trainingNumber}
                onChange={setTrainingNumber}
                placeholder="Número de sesión"
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
              {[1, 2, 3].map((key) => (
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
                      value={warmup[`warmup${key}_explanation`]}
                      multiline={true}
                      numberOfLines={4}
                      scrollEnabled={true}
                      onChange={(text) =>
                        setWarmup((prev) => ({
                          ...prev,
                          [`warmup${key}_explanation`]: text,
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
              {[1, 2, 3, 4, 5, 6].map((key) => (
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
                      value={exercise[`exercise${key}_explanation`]}
                      multiline={true}
                      numberOfLines={4}
                      scrollEnabled={true}
                      onChange={(text) =>
                        setExercise((prev) => ({
                          ...prev,
                          [`exercise${key}_explanation`]: text,
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
              {[1, 2].map((key) => (
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
                      value={cooldown[`cooldown${key}_explanation`]}
                      multiline={true}
                      numberOfLines={4}
                      scrollEnabled={true}
                      onChange={(text) =>
                        setCooldown((prev) => ({
                          ...prev,
                          [`cooldown${key}_explanation`]: text,
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
