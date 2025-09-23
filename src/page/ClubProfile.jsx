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

const ClubProfile = ({ handleReturn, handleUpdate }) => {
  const { GameController } = useDB();
  const [option, setOption] = useState(TopMenuEnums.MAIN);
  const [gamesResults, setGamesResults] = useState([]);

  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (TopMenuEnums.MAIN === option) {
      setTopMenu([
        {
          id: TopMenuEnums.PLAYERS,
          name: "Plantilla de Jugadores",
          onPress: () => onSelectOption(TopMenuEnums.PLAYERS),
          children: () => <Entypo name="users" size={24} color="red" />,
        },
        {
          id: TopMenuEnums.CALENDAR,
          name: "Calendario de cuotas",
          onPress: () => onSelectOption(TopMenuEnums.CALENDAR),
          children: () => <Entypo name="calendar" size={24} color="red" />,
        },
        {
          id: TopMenuEnums.TRAININGS,
          name: "Entrenamientos",
          onPress: () => onSelectOption(TopMenuEnums.TRAININGS),
          children: () => (
            <Foundation name="clipboard-notes" size={24} color="red" />
          ),
        },
        {
          id: TopMenuEnums.GAMES,
          name: "Partidos",
          onPress: () => onSelectOption(TopMenuEnums.GAMES),
          children: () => (
            <MaterialCommunityIcons
              name="basketball-hoop-outline"
              size={24}
              color="red"
            />
          ),
        },
        {
          id: TopMenuEnums.EDIT_TEAM,
          name: "Editar Equipo",
          onPress: () => onSelectOption(TopMenuEnums.EDIT_TEAM),
          children: () => <Ionicons name="settings" size={24} color="red" />,
        },
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: handleReturn,
          children: () => (
            <FontAwesome5 name="door-open" size={24} color="red" />
          ),
        },
      ]);
    } else if (TopMenuEnums.EDIT_TEAM === option) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setOption(TopMenuEnums.MAIN),
          children: () => <Entypo name="back" size={24} color="red" />,
        },
      ]);
    }
  }, [option]);

  const getData = async () => {
    GameController.load((data) =>
      setGamesResults(
        data.map((game) => ({
          opponent: game.opponent,
          date: game.date,
          round: game.round,
          result:
            game.result_c1 +
            game.result_c2 +
            game.result_c3 +
            game.result_c4 +
            game.result_extra,
          resultOpponent:
            game.result_c1_opponent +
            game.result_c2_opponent +
            game.result_c3_opponent +
            game.result_c4_opponent +
            game.result_extra_opponent,
        }))
      )
    );
  };

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
          <View className="relative w-full flex flex-row justify-center items-center mt-3 mb-10">
            <Text className="text-center text-2xl font-bold text-danish-dark-gray">
              {club?.name}
            </Text>
          </View>
          <Text>¡Bienvenido al gestor del Equipo!</Text>
          {gamesResults.length > 0 ? (
            <View className="mb-5 bg-white rounded-lg p-4 shadow mt-10 w-full px-3">
              {gamesResults.map((game) => {
                return (
                  <View
                    key={game.id}
                    className={`flex flex-row justify-between ${game.result > game.resultOpponent ? "bg-green-300" : "bg-red-300"}`}
                  >
                    <Text className="text-center text-xs text-gray-600 mb-2">
                      Jornada {game.round} - {game.date}
                    </Text>
                    <Text>{game.opponent}</Text>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="flex-1 text-center font-bold text-sm">
                        {`${game.result}`}
                      </Text>
                      <Text className="mx-2 font-bold text-sm">-</Text>
                      <Text className="flex-1 text-center font-bold  text-sm">
                        {`${game.resultOpponent}`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="w-full flex flex-col justify-center items-center mt-20">
              <MaterialCommunityIcons
                name="book-open-blank-variant-outline"
                size={30}
                color="gray"
              />
              <Text className="text-lg font-bold text-danish-dark-gray px-16">
                Parece que no hay registros recientes que mostrar...
              </Text>
            </View>
          )}
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
