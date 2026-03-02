import { useState } from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigation } from "@react-navigation/native";
import { errorAlert } from "../../helpers/AlertHelper";
import PathEnums from "../../Enums/PathEnums";

const Register = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [clubName, setClubName] = useState("");

  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const navigation = useNavigation();

  const submit = async () => {
    if (
      [name, lastname, email, password, verifyPassword, clubName].includes("")
    )
      return errorAlert("Los campos no puedes estar vacíos");
    if (password !== verifyPassword)
      return errorAlert("Las contraseñas no coinciden");

    try {
      await register({ name, lastname, email, password, clubName, role: 3 });
      navigation.navigate(PathEnums.VERIFY, { email });
    } catch (error) {
      errorAlert(error.message);
    }
  };

  return (
    <View className="w-full flex flex-col justify-center items-center px-5 gap-5">
      <TextInput
        value={name}
        onChangeText={(value) => setName(value)}
        placeholder="Tu nombre"
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <TextInput
        value={lastname}
        onChangeText={(value) => setLastname(value)}
        placeholder="Tu apellido"
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <TextInput
        value={clubName}
        onChangeText={(value) => setClubName(value)}
        placeholder="El nombre de tu club"
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <TextInput
        value={email}
        onChangeText={(value) => setEmail(value)}
        placeholder="Email"
        keyboardType="email-address"
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <TextInput
        value={password}
        onChangeText={(value) => setPassword(value)}
        placeholder="Contraseña"
        secureTextEntry
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <TextInput
        value={verifyPassword}
        onChangeText={(value) => setVerifyPassword(value)}
        placeholder="Repite la Contraseña"
        secureTextEntry
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <TouchableOpacity
        onPress={submit}
        className="px-5 py-2 bg-cyan-950 border border-cyan-300 rounded-lg w-full"
        disabled={loading}
      >
        <Text className="text-cyan-50 text-center">
          {loading ? "Registrando..." : "Registrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
