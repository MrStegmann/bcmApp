import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native-web";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigation } from "@react-navigation/native";
import { errorAlert } from "../../helpers/AlertHelper";
import PathEnums from "../../Enums/PathEnums";
import CheckBoxInput from "../../framework/CheckBoxInput";
import { useLocalStore } from "../../store/LocalStore";
import StorageEnums from "../../Enums/StorageEnums";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const useStorage = useLocalStore((state) => state);

  const navigation = useNavigation();

  useEffect(() => {
    const getStoredData = async () => {
      try {
        const storedData = await useStorage.getData(StorageEnums.LOGIN_STORAGE);
        if (!storedData) return;
        setEmail(storedData.email);
        setPassword(storedData.password);
        setRememberMe(true);
      } catch (error) {
        errorAlert(error.message);
      }
    };
    getStoredData();
  }, []);

  const submit = async () => {
    if ([email, password].includes(""))
      return errorAlert(
        "Por favor, complete todos los campos antes de continuar.",
      );
    try {
      if (rememberMe) {
        await useStorage.storeData(StorageEnums.LOGIN_STORAGE, {
          email,
          password,
        });
      } else {
        await useStorage.removeData(StorageEnums.LOGIN_STORAGE);
      }
      const result = await login(email.toLowerCase(), password);
      if ([2, 3].includes(result.role)) navigation.replace(PathEnums.HOME);
      else navigation.replace(PathEnums.TEAMSLIST);
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
        value={password}
        onChangeText={(value) => setPassword(value)}
        placeholder="Contraseña"
        secureTextEntry
        className="w-full border border-cyan-300 bg-gray-200 rounded-lg text-gray-800 text-center shadow-lg"
      />
      <View className="w-full">
        <CheckBoxInput
          text="Recuérdame"
          value={rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
        />
      </View>

      <TouchableOpacity
        onPress={submit}
        className="px-5 py-2 bg-cyan-950 border border-cyan-300 rounded-lg w-full"
        disabled={loading}
      >
        <Text className="text-cyan-50 text-center">
          {loading ? "Verificando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
      <View className="w-full flex flex-row justify-between px-2">
        <TouchableOpacity
          onPress={() => navigation.navigate(PathEnums.RECOVER)}
        >
          <Text className="text-cyan-800 underline">Recuperar cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(PathEnums.REGISTER)}
        >
          <Text className="text-cyan-800 underline">Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
