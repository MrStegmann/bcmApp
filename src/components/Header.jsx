import { View, TouchableOpacity } from "react-native-web";
import { useAuthStore } from "../store/AuthStore";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../framework/IconButton";
import IconsEnums from "../Enums/IconsEnums";
import PathEnums from "../Enums/PathEnums";

const Header = () => {
  const [headerMenu, setHeaderMenu] = useState([]);

  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if ([2, 3].includes(user.role)) {
      setHeaderMenu([
        {
          name: "Inicio",
          icon: IconsEnums.HOME,
          path: PathEnums.HOME,
        },
        {
          name: "Miembros",
          icon: IconsEnums.USERS,
          path: PathEnums.STAFFS,
        },
        {
          name: "Equipos",
          icon: IconsEnums.SHIELD,
          path: PathEnums.TEAMS,
        },
        {
          name: "Perfil",
          icon: IconsEnums.SETTINGS,
          path: PathEnums.PROFILE,
        },
        { name: "Salir", icon: IconsEnums.DOOR_FRONT, path: PathEnums.LOGIN },
      ]);
    }
  }, []);

  const onLogout = (path) => {
    navigation.replace(path);
    logout();
  };
  return (
    <View className="h-20 w-full z-10 flex flex-row justify-center items-center mb-10 border-t">
      {headerMenu.map((item) => (
        <TouchableOpacity
          key={item.path}
          className="w-10 h-10"
          onPress={() =>
            item.path === PathEnums.LOGIN
              ? onLogout(item.path)
              : navigation.replace(item.path)
          }
        >
          <View className="w-full h-full flex items-center justify-center z-10">
            <IconButton value={item.icon} alt={item.name} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Header;
