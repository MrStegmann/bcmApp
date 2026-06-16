import { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native-web";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../../framework/IconButton";
import IconsEnums from "../../Enums/IconsEnums";
import PathEnums from "../../Enums/PathEnums";
import { useAuthStore } from "../../store/AuthStore";

const TeamNav = () => {
  const [navItems, setNavItems] = useState([]);

  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();

  useEffect(() => {
    setNavItems([
      {
        name: "Jugadores",
        icon: IconsEnums.USERS,
        path: PathEnums.PLAYERS,
      },
      {
        name: "Entrenamientos",
        icon: IconsEnums.TRAININGS,
        path: PathEnums.TRAININGS,
      },
      {
        name: "Ejercicios",
        icon: IconsEnums.EXERCICES,
        path: PathEnums.EXERCICES,
      },
      {
        name: "Partidos",
        icon: IconsEnums.MATCHES,
        path: PathEnums.MATCHES,
      },
      {
        name: "Volver",
        icon: IconsEnums.DOOR_FRONT,
        path: [2, 3].includes(user.role) ? PathEnums.TEAMS : "goBack",
      },
    ]);
  }, []);
  return (
    <View className="h-20 w-full z-10 flex flex-row justify-center items-center mb-10 border-t">
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.path}
          className="w-10 h-10"
          onPress={() =>
            item.path === "goBack"
              ? navigation.goBack()
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

export default TeamNav;
