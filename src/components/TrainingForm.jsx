import { useState, useEffect } from "react";
import { Text, View } from "react-native-web";
import { useClubStore } from "../store/ClubStore";
import Input from "../framework/Input";
import TopMenuEnums from "../Enums/TopMenuEnums";
import { useMenuStore } from "../store/MenuStore";

const TrainingForm = ({ onSubmit, trainingData, onCancel }) => {
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const [trainingNumber, setTrainingNumber] = useState("");
  const [wrongTrainingNumber, setWrongTrainingNumber] = useState("");
  const [date, setDate] = useState("");
  const [wrongDate, setWrongDate] = useState("");
  const [warmup, setWarmup] = useState({
    warmup1: "",
    warmup1_explanation: "",
    warmup2: "",
    warmup2_explanation: "",
    warmup3: "",
    warmup3_explanation: "",
  });
  const [exercise, setExercise] = useState({
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
  const [cooldown, setCooldown] = useState({
    cooldown1: "",
    cooldown1_explanation: "",
    cooldown2: "",
    cooldown2_explanation: "",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTopMenu([
        {
          id: TopMenuEnums.SAVE,
          name: "Guardar",
          onPress: () => handleSubmit(),
          icon: TopMenuEnums.SAVE,
        },
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: onCancel,
          icon: TopMenuEnums.GO_BACK,
        },
      ]);
    }, 25);
    return () => clearTimeout(timeout);
  }, [trainingNumber, date, warmup, exercise, cooldown]);

  useEffect(() => {
    if (trainingData) {
      setTrainingNumber(trainingData.training_number.toString());
      setDate(trainingData.date);
      const {
        warmup1,
        warmup1_explanation,
        warmup2,
        warmup2_explanation,
        warmup3,
        warmup3_explanation,
      } = trainingData;
      setWarmup({
        warmup1,
        warmup1_explanation,
        warmup2,
        warmup2_explanation,
        warmup3,
        warmup3_explanation,
      });
      const {
        exercise1,
        exercise1_explanation,
        exercise2,
        exercise2_explanation,
        exercise3,
        exercise3_explanation,
        exercise4,
        exercise4_explanation,
        exercise5,
        exercise5_explanation,
        exercise6,
        exercise6_explanation,
      } = trainingData;
      setExercise({
        exercise1,
        exercise1_explanation,
        exercise2,
        exercise2_explanation,
        exercise3,
        exercise3_explanation,
        exercise4,
        exercise4_explanation,
        exercise5,
        exercise5_explanation,
        exercise6,
        exercise6_explanation,
      });
      const {
        cooldown1,
        cooldown1_explanation,
        cooldown2,
        cooldown2_explanation,
      } = trainingData;
      setCooldown({
        cooldown1,
        cooldown1_explanation,
        cooldown2,
        cooldown2_explanation,
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
      ...(trainingData?.id != null && { id: trainingData?.id }),
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

      <View className="w-full flex flex-col px-2 mb-24">
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
    </View>
  );
};

export default TrainingForm;
