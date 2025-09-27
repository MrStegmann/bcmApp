import { View, Text, TouchableOpacity } from "react-native";
import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const IconButton = ({ value }) => {
  const size = 18;
  const color = "white";
  if (
    [
      TopMenuEnums.SAVE,
      TopMenuEnums.GO_BACK,
      TopMenuEnums.CALENDAR,
      TopMenuEnums.PLAYERS,
      TopMenuEnums.TRAININGS,
      TopMenuEnums.ADD_NEW_PLAYER,
    ].includes(value)
  )
    return <Entypo name={value} size={size} color={color} />;

  if (
    [
      TopMenuEnums.ADD_NEW_TEAM,
      TopMenuEnums.EDIT_TEAM,
      TopMenuEnums.ADD_NEW_SESSION,
    ].includes(value)
  )
    return <MaterialIcons name={value} size={size} color={color} />;

  if (
    [
      TopMenuEnums.GAMES,
      TopMenuEnums.CLOSE_SESION,
      TopMenuEnums.ADD_NEW_GAME,
    ].includes(value)
  )
    return <MaterialCommunityIcons name={value} size={size} color={color} />;
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
                className="w-12 h-12 border-2 z-50 bg-danish-red border-danish-dark-gray shadow shadow-black rounded-full  active:bg-danish-light-gray"
                onPress={menu.onPress}
              >
                <View className="w-full h-full flex items-center justify-center z-10">
                  <IconButton value={menu.icon} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
