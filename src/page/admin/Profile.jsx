import { useNavigation } from "@react-navigation/native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useStaffStore } from "../../store/StaffStore";
import { useAuthStore } from "../../store/AuthStore";
import { errorAlert } from "../../helpers/AlertHelper";
import PathEnums from "../../Enums/PathEnums";
import { useState } from "react";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState(user ? user.name : "");
  const [lastname, setLastname] = useState(user ? user.lastname : "");
  const [email, setEmail] = useState(user ? user.email : "");

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [newOwner, setNewOwner] = useState(null);
  const [staffs, setStaffs] = useState([]);

  const navigation = useNavigation();

  const loading = useStaffStore((state) => state.loading);
  const saveStaff = useStaffStore((state) => state.saveStaff);
  const changeOwner = useStaffStore((state) => state.changeOwner);
  const changePassword = useStaffStore((state) => state.changePassword);
  const fetchStaffs = useStaffStore((state) => state.fetchStaffs);

  useEffect(() => {
    const fetchStaff = async () => {
      if (user.token) {
        const staffList = await fetchStaffs(user.club.id, user.token);
        setNewOwner(staffList.find((s) => s.role === 3));
        setStaffs(
          staffList.map((staff) => ({
            label: `${staff.name} ${staff.lastname}`,
            value: staff.id,
          })),
        );
      }
    };
    fetchStaff();
  }, []);

  const selectNewOwner = (value) => {
    const selected = staffs.find((s) => s.value === value);
    setNewOwner({ id: selected.value });
  };

  const preSetNewOwner = () => {
    if (user.role !== 3) return;
    Alert.alert(
      "¿Cambiar Owner?",
      "¿Estás seguro de cambiar el owner del club? No podrás revertir esta acción.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: () => {
            setUser({ ...user, role: 2 });
            setRole(2);
            saveStaff({ id: user.id, role: 2 });
            changeOwner(newOwner.id);
          },
        },
      ],
    );
  };

  const handleChangePassword = () => {
    if (password !== repeatPassword) {
      return errorAlert("La nueva contraseña y su repetición no coinciden");
    }
    const data = {
      email: user.email,
      oldPassword,
      newPassword: password,
    };
    changePassword(data);
  };

  const handleSavePersonalInfo = async () => {
    if ([name, lastname, email].includes("")) {
      return errorAlert(
        "Los campos Nombre, Apellido y Email no pueden estar vacíos",
      );
    }
    const staffData = {
      id: user.id,
      name,
      lastname,
      email,
    };
    await saveStaff(staffData);
  };

  return (
    <View className="w-full flex-1 flex flex-col items-center px-5">
      <View className="w-full flex flex-col mt-5 border-b pb-5">
        <Text className="w-full text-xl font-bold text-left">
          Información de la Cuenta
        </Text>
        <Text className="w-full text-lg text-left mt-3">
          Rol:{" "}
          {user.role === 3
            ? "Owner"
            : user.role === 2
              ? "Administrador"
              : "Entrenador"}
        </Text>
        <Text className="w-full text-lg text-left mt-1">
          Verificado: {user.verified ? "Sí" : "No"}
        </Text>
      </View>
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
        <TextInput
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          value={email}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />
        <TouchableOpacity onPress={handleSavePersonalInfo}>
          <Text className="text-blue-500 mt-3">Guardar</Text>
        </TouchableOpacity>
      </View>
      <View className="w-full flex flex-col mt-5 border-b pb-5">
        <Text className="w-full text-xl font-bold text-left">
          Cambiar Contraseña
        </Text>
        <TextInput
          placeholder="Contraseña Actual"
          onChangeText={(value) => setOldPassword(value)}
          value={oldPassword}
          secureTextEntry={true}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />

        <TextInput
          placeholder="Nueva Password"
          onChangeText={(value) => setPassword(value)}
          value={password}
          secureTextEntry={true}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />
        <TextInput
          placeholder="Repita Password"
          onChangeText={(value) => setRepeatPassword(value)}
          value={repeatPassword}
          secureTextEntry={true}
          className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
        />
        <TouchableOpacity onPress={handleChangePassword}>
          <Text className="text-blue-500 mt-3">Guardar</Text>
        </TouchableOpacity>
      </View>
      {/* Solo OwNER */}
      {user.role === 3 && (
        <View className="w-full flex flex-col mt-5 border-b pb-5">
          <Text className="w-full text-xl font-bold text-left">
            Traspasar owner
          </Text>
          <SelectInput
            defaultOption={
              newOwner ? staffs.find((s) => s.value === newOwner.id) : null
            }
            options={staffs}
            cb={selectNewOwner}
          />
          <TouchableOpacity
            onPress={preSetNewOwner}
            disabled={user.role !== 3 || loading}
          >
            <Text className="text-blue-500 mt-3">Guardar</Text>
          </TouchableOpacity>
        </View>
      )}
      <View className="w-full flex flex-col mt-5 border-b pb-5">
        <TouchableOpacity onPress={() => navigation.replace(PathEnums.HOME)}>
          <Text className="text-blue-500 mt-3">Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
