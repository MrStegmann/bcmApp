import { View } from "react-native";
import { useEffect, useState } from "react";
import ClubForm from "../components/ClubForm";
import { useClubStore } from "../store/ClubStore";
import PlayerList from "./PlayerList";
import Calendar from "./Calendar";
import TrainingList from "./TrainingList";
import GameList from "./GameList";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import GamesResults from "../components/GamesResults";
import { evalue } from "../helpers/evalue";

const ClubProfile = ({ handleReturn, handleUpdate }) => {
  const { GameController, PlayerController } = useDB();
  const [option, setOption] = useState(TopMenuEnums.MAIN);

  const club = useClubStore((state) => state.club);
  const setGames = useClubStore((state) => state.setGames);
  const setPlayers = useClubStore((state) => state.setPlayers);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    const getData = async () => {
      setGames(await GameController.load(club.id));
      setPlayers(await PlayerController.loadStatsByTeam(club.id));
    };
    getData();
  }, []);

  useEffect(() => {
    if (TopMenuEnums.MAIN === option) {
      const menu = [
        {
          id: TopMenuEnums.PLAYERS,
          name: "Plantilla de Jugadores",
          onPress: () => onSelectOption(TopMenuEnums.PLAYERS),
          icon: TopMenuEnums.PLAYERS,
        },
        {
          id: TopMenuEnums.TRAININGS,
          name: "Entrenamientos",
          onPress: () => onSelectOption(TopMenuEnums.TRAININGS),
          icon: TopMenuEnums.TRAININGS,
        },
        {
          id: TopMenuEnums.GAMES,
          name: "Partidos",
          onPress: () => onSelectOption(TopMenuEnums.GAMES),
          icon: TopMenuEnums.GAMES,
        },
        {
          id: TopMenuEnums.EDIT_TEAM,
          name: "Editar Equipo",
          onPress: () => onSelectOption(TopMenuEnums.EDIT_TEAM),
          icon: TopMenuEnums.EDIT_TEAM,
        },
        {
          id: TopMenuEnums.CLOSE_SESION,
          name: "Volver",
          onPress: handleReturn,
          icon: TopMenuEnums.CLOSE_SESION,
        },
      ];
      const dataOptions = club.options.split(";");
      for (const option of dataOptions) {
        const [key, value] = option.split(":");
        if (key && value) {
          if (key === "showFees" && evalue(value))
            menu.splice(1, 0, {
              id: TopMenuEnums.CALENDAR,
              name: "Calendario de cuotas",
              onPress: () => onSelectOption(TopMenuEnums.CALENDAR),
              icon: TopMenuEnums.CALENDAR,
            });
        }
      }
      setTopMenu(menu);
    } else if (TopMenuEnums.EDIT_TEAM === option) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setOption(TopMenuEnums.MAIN),
          icon: TopMenuEnums.GO_BACK,
        },
      ]);
    }
  }, [option, club]);

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
          {/* <GamesResults /> */}
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
