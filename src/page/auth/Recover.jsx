import React from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native-web";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigation } from "@react-navigation/native";
import { errorAlert } from "../../helpers/AlertHelper";
import PathEnums from "../../Enums/PathEnums";

const Recover = () => {
  const [email, setEmail] = React.useState("");
  const recover = useAuthStore((state) => state.recover);
  const loading = useAuthStore((state) => state.loading);

  const navigation = useNavigation();
  const submit = async () => {
    if (email === "") return errorAlert("El campo email no puede estar vacío");
    try {
      await recover(email);
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
      <TouchableOpacity
        onPress={submit}
        className="px-5 py-2 bg-cyan-950 border border-cyan-300 rounded-lg w-full"
        disabled={loading}
      >
        <Text className="text-cyan-50 text-center">
          {loading ? "Comprobando..." : "Recuperar Contraseña"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Recover;
