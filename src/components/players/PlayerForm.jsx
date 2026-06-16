import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native-web";
import { useTeamStore } from "../../store/TeamStore";
import { errorAlert, infoAlert } from "../../helpers/AlertHelper";
import { usePlayerStore } from "../../store/PlayerStore";
import { useNavigation } from "@react-navigation/native";

const PlayerForm = ({ route }) => {
  const { onGoBack, player } = route.params;
  const [name, setName] = useState(player ? player.name : "");
  const [lastname, setLastname] = useState(player ? player.lastname : "");
  const [number, setNumber] = useState(player ? `${player.number}` : "");

  const team = useTeamStore((state) => state.team);
  const savePlayer = usePlayerStore((state) => state.savePlayer);
  const loading = usePlayerStore((state) => state.loading);

  const navigation = useNavigation();

  const submit = async () => {
    if ([name, lastname, number].includes("")) {
      return errorAlert("Todos los campos son obligatorios");
    }
    const playerData = {
      ...(player?.id != null && { id: player?.id }),
      name,
      lastname,
      number,
      team,
    };
    try {
      await savePlayer(playerData);
      reset();
      navigation.goBack();
      onGoBack();
      infoAlert("Jugador guardado correctamente");
    } catch (error) {
      errorAlert(error.message);
    }
  };
  const reset = () => {
    setName("");
    setLastname("");
    setNumber("");
  };
  return (
    <View className="w-full flex-1 flex flex-col items-center px-5">
      <View className="w-full flex flex-col mt-5 border-b pb-5">
        <TextInput
          placeholder="Name"
          onChangeText={(value) => setName(value)}
          value={name}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />
        <TextInput
          placeholder="Lastname"
          onChangeText={(value) => setLastname(value)}
          value={lastname}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />
        <TextInput
          placeholder="Dorsal"
          onChangeText={(value) => setNumber(value)}
          value={number}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />
      </View>

      <View className="w-full flex flex-row justify-between items-center mt-5">
        <TouchableOpacity
          className="p-4 border rounded-full w-full flex flex-row justify-center items-center bg-gray-200"
          onPress={submit}
        >
          <Text className="font-bold">{loading ? "Creando..." : "Crear"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayerForm;
