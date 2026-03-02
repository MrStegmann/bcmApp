import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Input from "../../framework/Input";
import CheckBoxInput from "../../framework/CheckBoxInput";
import { usePlaybookStore } from "../../store/PlaybookStore";
import { useNavigation } from "@react-navigation/native";
import SaveButton from "../../framework/SaveButton";
import { errorAlert } from "../../helpers/AlertHelper";

const exerciseCategories = [
  { label: "Juego de pies", value: "footwork", category: "technique" },
  {
    label: "Paradas y salidas",
    value: "stopsAndStarts",
    category: "technique",
  },
  { label: "Finalizaciones", value: "finishers", category: "technique" },
  { label: "Tiro", value: "throw", category: "technique" },
  { label: "Pases", value: "passes", category: "technique" },
  { label: "Bote", value: "dribbling", category: "technique" },
  { label: "Paso 0", value: "step_0", category: "technique" },
  {
    label: "Desplazamiento defensivo",
    value: "defensiveMovement",
    category: "tactical",
  },
  { label: "Rebote", value: "rebound", category: "tactical" },
  { label: "Juego sin balón", value: "offBallMovement", category: "tactical" },
  { label: "Defensa", value: "defense", category: "tactical" },
  { label: "Ataque", value: "offense", category: "tactical" },
  { label: "Mano a mano", value: "handByHand", category: "tactical" },
  { label: "Contraataque", value: "counterAttack", category: "tactical" },
  { label: "Bloqueo indirecto", value: "indirectBlock", category: "tactical" },
  { label: "Bloqueo directo", value: "directBlock", category: "tactical" },
  {
    label: "Saques de banda y fondo",
    value: "throwInsAndOuts",
    category: "tactical",
  },
  { label: "Sistemas de juego", value: "gameSystems", category: "tactical" },
  { label: "2x2", value: "twoVsTwo", category: "colective" },
  { label: "3x3", value: "threeVsThree", category: "colective" },
  { label: "4x4", value: "fourVsFour", category: "colective" },
  { label: "5x5", value: "fiveVsFive", category: "colective" },
  { label: "Físico", value: "physical", category: "physical" },
  { label: "Calentamiento", value: "warmUp", category: "warmUp" },
];

const Options = ({
  flags,
  setFlags,
  title,
  setTitle,
  description,
  setDescription,
}) => {
  const onChangeFlags = (value) => {
    const newFlag = flags;

    if (newFlag.length === 0) {
      setFlags(value);
    } else {
      if (newFlag.includes(value)) {
        const arrayFlags = newFlag.split(",");
        const index = arrayFlags.indexOf(value);
        if (index > -1) {
          arrayFlags.splice(index, 1);
        }
        setFlags(arrayFlags.join(","));
      } else {
        setFlags((prev) => prev + "," + value);
      }
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 p-5 gap-y-4">
        <View className="w-full border-b">
          <Text className="text-xl font-bold">Información básica</Text>
        </View>
        <TextInput
          placeholder={"Nombre del ejercicio"}
          className="px-3 py-2 border rounded-lg"
          value={title}
          onChangeText={(value) => setTitle(value)}
        />
        <TextInput
          placeholder={"Descripción del ejercicio"}
          className="px-3 py-2 border rounded-lg h-40"
          value={description}
          onChangeText={(value) => setDescription(value)}
          multiline={true}
          numberOfLines={8}
        />

        <View className="w-full border-b">
          <Text className="text-xl font-bold">Ejercicios</Text>
        </View>
        <View className="w-full flex flex-col">
          <Text className="font-bold text-lg">Otros</Text>
          <View className="w-full flex flex-row flex-wrap gap-4">
            <CheckBoxInput
              text={"Físico"}
              onPress={() => onChangeFlags("physical:physical")}
              value={flags.includes("physical:physical")}
            />
            <CheckBoxInput
              text={"Calentamiento"}
              onPress={() => onChangeFlags("warmUp:warmUp")}
              value={flags.includes("warmUp:warmUp")}
            />
          </View>
        </View>

        <View className="w-full flex flex-col">
          <Text className="font-bold text-lg">Técnica</Text>
          <View className="w-full flex flex-row flex-wrap gap-4">
            {exerciseCategories
              .filter((ec) => ec.category === "technique")
              .map((ec) => (
                <CheckBoxInput
                  key={ec.value}
                  text={ec.label}
                  onPress={() => onChangeFlags(`${ec.category}:${ec.value}`)}
                  value={flags.includes(`${ec.category}:${ec.value}`)}
                />
              ))}
          </View>
        </View>
        <View className="w-full flex flex-col">
          <Text className="font-bold text-lg">Táctica</Text>
          <View className="w-full flex flex-row flex-wrap gap-4">
            {exerciseCategories
              .filter((ec) => ec.category === "tactical")
              .map((ec) => (
                <CheckBoxInput
                  key={ec.value}
                  text={ec.label}
                  onPress={() => onChangeFlags(`${ec.category}:${ec.value}`)}
                  value={flags.includes(`${ec.category}:${ec.value}`)}
                />
              ))}
          </View>
        </View>
        <View className="w-full flex flex-col">
          <Text className="font-bold text-lg">Colectivo</Text>
          <View className="w-full flex flex-row flex-wrap gap-4">
            {exerciseCategories
              .filter((ec) => ec.category === "colective")
              .map((ec) => (
                <CheckBoxInput
                  key={ec.value}
                  text={ec.label}
                  onPress={() => onChangeFlags(`${ec.category}:${ec.value}`)}
                  value={flags.includes(`${ec.category}:${ec.value}`)}
                />
              ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Options;
