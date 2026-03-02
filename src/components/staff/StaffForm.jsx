import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useStaffStore } from "../../store/StaffStore";
import CheckBoxInput from "../../framework/CheckBoxInput";
import SelectInput from "../../framework/SelectInput";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigation } from "@react-navigation/native";
import { errorAlert, infoAlert } from "../../helpers/AlertHelper";

const roles = [
  { label: "Entrenador", value: "1" },
  { label: "Admin", value: "2" },
];

const StaffForm = ({ route }) => {
  const { onGoBack, staff } = route.params;
  const [name, setName] = useState(staff ? staff.name : "");
  const [lastname, setLastname] = useState(staff ? staff.lastname : "");
  const [email, setEmail] = useState(staff ? staff.email : "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(staff ? staff.role : "");
  const [verified, setVerivied] = useState(staff ? staff.verified : false);

  const navigation = useNavigation();

  const saveStaff = useStaffStore((state) => state.saveStaff);
  const loading = useStaffStore((state) => state.loading);
  const club = useAuthStore((state) => state.user.club);

  const submit = async () => {
    if ([name, lastname, email, password].includes("")) {
      return errorAlert("Todos los campos son obligatorios");
    }
    const staffData = {
      ...(staff?.id != null && { id: staff?.id }),
      name,
      lastname,
      email,
      password,
      role,
      club,
      verified,
    };
    try {
      await saveStaff(staffData);
      reset();
      navigation.goBack();
      onGoBack();
      infoAlert("Miembro guardado correctamente");
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const reset = () => {
    setName("");
    setLastname("");
    setEmail("");
    setPassword("");
    setRole("");
    setVerivied(false);
  };
  return (
    <View className="w-full flex-1 flex flex-col items-center px-5">
      <View className="w-full flex flex-col mt-5 border-b pb-5">
        <Text className="w-full text-xl font-bold text-left">
          Información Personal
        </Text>
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
      </View>

      <View className="w-full flex flex-col mt-5 border-b pb-5">
        <Text className="w-full text-xl font-bold text-left">Usuario</Text>
        <TextInput
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          value={email}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />

        <CheckBoxInput
          onPress={() => setVerivied(!verified)}
          value={verified}
          text="Verificado"
        />

        <TextInput
          placeholder="Password"
          onChangeText={(value) => setPassword(value)}
          value={password}
          secureTextEntry={true}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />
      </View>

      <View className="w-full flex flex-col mt-5 border-b pb-5">
        <Text className="w-full text-xl font-bold text-left">Otro</Text>
        <SelectInput
          defaultOption={
            staff
              ? roles.find((r) => r.value === `${staff.role}`)
              : { value: "1", label: "Entrenador" }
          }
          options={roles}
          cb={(value) => setRole(value)}
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

export default StaffForm;
