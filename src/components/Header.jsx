import { View, Text, TouchableOpacity } from "react-native";
import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import { useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const IconButton = ({ value }) => {
  const size = 18;
  const color = "white";
  if (value === TopMenuEnums.SAVE)
    return <Feather name="save" size={size} color={color} />;
  if (value === TopMenuEnums.GO_BACK)
    return <Entypo name="back" size={size} color={color} />;
  if (value === TopMenuEnums.ADD_NEW_TEAM)
    return <MaterialIcons name="add-moderator" size={size} color={color} />;
  if (value === TopMenuEnums.CALENDAR)
    return <Entypo name="calendar" size={size} color={color} />;
  if (value === TopMenuEnums.PLAYERS)
    return <Entypo name="users" size={size} color={color} />;
  if (value === TopMenuEnums.TRAININGS)
    return <Foundation name="clipboard-notes" size={size} color={color} />;
  if (value === TopMenuEnums.GAMES)
    return (
      <MaterialCommunityIcons
        name="basketball-hoop-outline"
        size={size}
        color={color}
      />
    );
  if (value === TopMenuEnums.EDIT_TEAM)
    return <Ionicons name="settings" size={size} color={color} />;
  if (value === TopMenuEnums.CLOSE_SESION)
    return <FontAwesome5 name="door-open" size={size} color={color} />;
  if (value === TopMenuEnums.ADD_NEW_GAME)
    return <Ionicons name="basketball-sharp" size={size} color={color} />;
  if (value === TopMenuEnums.ADD_NEW_PLAYER)
    return <Entypo name="add-user" size={size} color={color} />;
  if (value === TopMenuEnums.ADD_NEW_SESSION)
    return <MaterialIcons name="assignment-add" size={size} color={color} />;
};

const Header = () => {
  const club = useClubStore((state) => state.club);
  const topMenu = useMenuStore((state) => state.topMenu);

  return (
    <View className="w-full z-10">
      <View className="w-full h-24 flex justify-end items-center rounded-b-full shadow-2xl shadow-red-900">
        <View className="w-full h-full flex justify-center items-center rounded-b-full bg-danish-dark-gray shadow-inner shadow-red-900 relative">
          <Text className="text-center text-xl font-bold text-danish-white my-2">
            {club?.name}
          </Text>
          <View className="absolute -bottom-6 flex-row justify-center w-full gap-3">
            {topMenu.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                className="w-12 h-12 border-2 bg-danish-red border-danish-dark-gray shadow shadow-black rounded-full flex items-center justify-center active:bg-danish-light-gray"
                onPress={menu.onPress}
              >
                <IconButton value={menu.icon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
