import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigation } from "@react-navigation/native";
import { errorAlert } from "../../helpers/AlertHelper";
import PathEnums from "../../Enums/PathEnums";

const Verifyer = ({ route }) => {
  const [email, setEmail] = useState(route.params.email);
  const [token, setToken] = useState("");

  const verify = useAuthStore((state) => state.verify);
  const loading = useAuthStore((state) => state.loading);

  const navigation = useNavigation();
  const submit = async () => {
    if ([email, token].includes(""))
      return errorAlert("Todos los campos son obligatorios");

    try {
      await verify({ email, token });
      navigation.navigate(PathEnums.LOGIN);
    } catch (error) {
      errorAlert(error.message);
    }
  };
  return (
    <View className="w-full flex flex-col justify-center items-center px-5 gap-5">
      <TextInput
        value={email}
        onChangeText={(value) => setEmail(value)}
        placeholder="Email"
        keyboardType="email-address"
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <TextInput
        value={token}
        onChangeText={(value) => setToken(value)}
        placeholder="Código de Verificación"
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <TouchableOpacity
        onPress={submit}
        className="px-5 py-2 bg-cyan-950 border border-cyan-300 rounded-lg w-full"
        disabled={loading}
      >
        <Text className="text-cyan-50 text-center">
          {loading ? "Validando..." : "Validar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Verifyer;
