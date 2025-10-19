import { View, Text, TouchableOpacity } from "react-native";
import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useMatchStore } from "../store/MatchStore";

const HeaderDetails = () => {
  const club = useClubStore((state) => state.club);
  const matchStore = useMatchStore((state) => state);

  if (!matchStore.playing) {
    return (
      <View
        className={`w-full flex flex-row justify-center items-center px-16`}
      >
        <Text className="text-center text-lg font-bold text-danish-white my-1">
          {club?.name}
        </Text>
      </View>
    );
  }

  return (
    <View className={`w-full flex flex-row justify-center items-center`}>
      <Text className="text-center text-lg font-bold text-danish-white my-1">
        {club?.name}
      </Text>

      <View className="mx-10 flex flex-col justify-center">
        <Text className="text-center text-lg font-bold text-danish-white">{`${matchStore.results.team} - ${matchStore.results.opponent}`}</Text>
      </View>

      <Text className="text-center text-lg font-bold text-danish-white my-1">
        {matchStore.opponent}
      </Text>
    </View>
  );
};

const IconButton = ({ value, alt }) => {
  const size = 15;
  const color = "white";
  if (!value)
    return <Text className="text-xs text-center text-danish-white">{alt}</Text>;
  if (
    [
      TopMenuEnums.SAVE,
      TopMenuEnums.GO_BACK,
      TopMenuEnums.CALENDAR,
      TopMenuEnums.PLAYERS,
      TopMenuEnums.TRAININGS,
      TopMenuEnums.ADD_NEW_PLAYER,
      "swap",
    ].includes(value)
  )
    return <Entypo name={value} size={size} color={color} />;

  if (
    [
      TopMenuEnums.ADD_NEW_TEAM,
      TopMenuEnums.EDIT_TEAM,
      TopMenuEnums.ADD_NEW_SESSION,
      TopMenuEnums.ROTATE_SCREEN,
      "timer",
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
  const topMenu = useMenuStore((state) => state.topMenu);

  return (
    <View className="w-full z-10">
      <View className="w-full h-20 flex justify-end items-center rounded-b-full shadow-2xl shadow-red-900">
        <View className="w-full h-full flex justify-center items-center rounded-b-full bg-danish-dark-gray shadow-inner shadow-red-900 relative">
          <HeaderDetails />

          <View className="absolute -bottom-6 flex-row justify-center w-full gap-3">
            {topMenu.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                className="w-10 h-10 border-2 z-50 bg-danish-red border-danish-dark-gray shadow shadow-black rounded-full  active:bg-danish-light-gray"
                onPress={menu.onPress}
              >
                <View className="w-full h-full flex items-center justify-center z-10">
                  <IconButton value={menu.icon} alt={menu.name} />
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
