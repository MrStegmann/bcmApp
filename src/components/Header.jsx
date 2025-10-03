import { View, Text, TouchableOpacity } from "react-native";
import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useGameStore } from "../store/GameStore";

const HeaderDetails = ({ gameDetail }) => {
  const club = useClubStore((state) => state.club);

  if (!gameDetail.id) {
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

  const { time, quarter, opponent, results, opponentResults } = gameDetail;

  // Formato mm:ss
  const mins = Math.floor(time[quarter] / 60)
    .toString()
    .padStart(2, "0");
  const segs = (time[quarter] % 60).toString().padStart(2, "0");
  return (
    <View className={`w-full flex flex-row justify-center items-center`}>
      <View className="flex flex-col justify-center items-center px-5">
        <Text className="text-danish-white text-sm">Faltas de Equipo</Text>
        <View className="flex flex-row gap-2">
          <View
            className={`w-2 py-1 border border-danish-red rounded-full ${results[quarter].falts > 0 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
          />
          <View
            className={`w-2 h-8 border border-danish-red rounded-full ${results[quarter].falts > 1 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
          />
          <View
            className={`w-2 h-8 border border-danish-red rounded-full ${results[quarter].falts > 2 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
          />
          <View
            className={`w-2 h-8 border border-danish-red rounded-full ${results[quarter].falts > 3 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
          />
        </View>
      </View>

      <Text className="text-center text-lg font-bold text-danish-white my-1">
        {club?.name}
      </Text>

      <View className="my-1 mx-10 flex flex-col justify-start h-[3.8rem]">
        <Text className="text-center text-xs font-bold text-danish-white">{`${mins}:${segs}`}</Text>
        <Text className="text-center text-lg font-bold text-danish-white">{`${results[quarter].pts} - ${opponentResults[quarter].pts}`}</Text>
      </View>

      <Text className="text-center text-lg font-bold text-danish-white my-1">
        {opponent}
      </Text>
      <View className="flex flex-col justify-center items-center px-5">
        <Text className="text-danish-white text-sm">Faltas de Equipo</Text>
        <View className="flex flex-row gap-2">
          <View
            className={`w-2 py-1 border border-danish-red rounded-full ${opponentResults[quarter].falts > 0 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
          />
          <View
            className={`w-2 h-8 border border-danish-red rounded-full ${opponentResults[quarter].falts > 1 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
          />
          <View
            className={`w-2 h-8 border border-danish-red rounded-full ${opponentResults[quarter].falts > 2 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
          />
          <View
            className={`w-2 h-8 border border-danish-red rounded-full ${opponentResults[quarter].falts > 3 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
          />
        </View>
      </View>
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
  const gameDetail = useGameStore((state) => state);

  return (
    <View className="w-full z-10">
      <View className="w-full h-20 flex justify-end items-center rounded-b-full shadow-2xl shadow-red-900">
        <View className="w-full h-full flex justify-center items-center rounded-b-full bg-danish-dark-gray shadow-inner shadow-red-900 relative">
          <HeaderDetails gameDetail={gameDetail} />

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
