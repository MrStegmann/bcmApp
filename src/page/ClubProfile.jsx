import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import ClubForm from "../components/ClubForm";
import { useClubStore } from "../store/ClubStore";
import PlayerList from "./PlayerList";
import Calendar from "./Calendar";
import TrainingList from "./TrainingList";
import GameList from "./GameList";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import useDB from "../hooks/useDB";
import GamesResults from "../components/GamesResults";

const ClubProfile = ({ handleReturn, handleUpdate }) => {
  const { GameController } = useDB();
  const [option, setOption] = useState(TopMenuEnums.MAIN);
  const [gamesResults, setGamesResults] = useState([]);

  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    GameController.load(club.id, setGamesResults);
  }, []);

  useEffect(() => {
    if (TopMenuEnums.MAIN === option) {
      setTopMenu([
        {
          id: TopMenuEnums.PLAYERS,
          name: "Plantilla de Jugadores",
          onPress: () => onSelectOption(TopMenuEnums.PLAYERS),
          children: () => <Entypo name="users" size={18} color="white" />,
        },
        {
          id: TopMenuEnums.CALENDAR,
          name: "Calendario de cuotas",
          onPress: () => onSelectOption(TopMenuEnums.CALENDAR),
          children: () => <Entypo name="calendar" size={18} color="white" />,
        },
        {
          id: TopMenuEnums.TRAININGS,
          name: "Entrenamientos",
          onPress: () => onSelectOption(TopMenuEnums.TRAININGS),
          children: () => (
            <Foundation name="clipboard-notes" size={18} color="white" />
          ),
        },
        {
          id: TopMenuEnums.GAMES,
          name: "Partidos",
          onPress: () => onSelectOption(TopMenuEnums.GAMES),
          children: () => (
            <MaterialCommunityIcons
              name="basketball-hoop-outline"
              size={18}
              color="white"
            />
          ),
        },
        {
          id: TopMenuEnums.EDIT_TEAM,
          name: "Editar Equipo",
          onPress: () => onSelectOption(TopMenuEnums.EDIT_TEAM),
          children: () => <Ionicons name="settings" size={18} color="white" />,
        },
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: handleReturn,
          children: () => (
            <FontAwesome5 name="door-open" size={18} color="white" />
          ),
        },
      ]);
    } else if (TopMenuEnums.EDIT_TEAM === option) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setOption(TopMenuEnums.MAIN),
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    }
  }, [option]);

  const onSelectOption = (o) => {
    setOption(o);
  };

  const onUpdateClub = async (data) => {
    handleUpdate(data);
    onReturn();
  };

  const onReturn = () => {
    if (option === TopMenuEnums.MAIN) {
      handleReturn();
    } else {
      setOption(TopMenuEnums.MAIN);
    }
  };

  return (
    <View className="w-full h-full flex flex-col justify-center items-center">
      {option === TopMenuEnums.MAIN && (
        <View className="w-full flex flex-col justify-center items-center">
          <View className="relative w-full flex flex-col justify-center items-center mt-3 mb-10">
            <Text className="text-center text-2xl font-bold text-danish-white">
              {club?.name}
            </Text>
            <Text className="text-danish-white">
              ¡Bienvenido al gestor del Equipo!
            </Text>
          </View>

          {/* <GamesResults gamesResults={gamesResults} /> */}
        </View>
      )}

      {option === TopMenuEnums.EDIT_TEAM && (
        <View className="flex-1 w-full h-full justify-center items-center">
          <ClubForm onSubmit={onUpdateClub} clubData={club} />
        </View>
      )}
      {option === TopMenuEnums.PLAYERS && (
        <PlayerList onReturn={() => setOption(TopMenuEnums.MAIN)} />
      )}
      {option === TopMenuEnums.CALENDAR && (
        <Calendar onReturn={() => setOption(TopMenuEnums.MAIN)} />
      )}
      {option === TopMenuEnums.TRAININGS && (
        <TrainingList onReturn={() => setOption(TopMenuEnums.MAIN)} />
      )}
      {option === TopMenuEnums.GAMES && (
        <GameList onReturn={() => setOption(TopMenuEnums.MAIN)} />
      )}
    </View>
  );
};

export default ClubProfile;
