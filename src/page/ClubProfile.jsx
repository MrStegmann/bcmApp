import { View } from "react-native-web";
import { useEffect, useState } from "react";
import ClubForm from "../components/ClubForm";
import { useClubStore } from "../store/ClubStore";
import PlayerList from "./PlayerList";
import TrainingList from "./TrainingList";
import GameList from "./GameList";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import GamesResults from "../components/GamesResults";

const ClubProfile = ({ handleReturn, handleUpdate }) => {
  const { GameController, PlayerController } = useDB();
  const [option, setOption] = useState(TopMenuEnums.MAIN);
  const [games, setGames] = useState([]);

  const club = useClubStore((state) => state.club);
  const setPlayers = useClubStore((state) => state.setPlayers);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    const getData = async () => {
      setGames(await GameController.getLastGameResults(club.id));
      setPlayers(await PlayerController.loadStatsByTeam(club.id));
    };
    getData();
  }, []);

  useEffect(() => {
    if (TopMenuEnums.MAIN === option) {
      setTopMenu([
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
          <GamesResults games={games} />
        </View>
      )}

      {option === TopMenuEnums.EDIT_TEAM && (
        <View className="flex-1 w-full h-full justify-center items-center">
          <ClubForm
            onSubmit={onUpdateClub}
            clubData={club}
            onReturn={onReturn}
          />
        </View>
      )}
      {option === TopMenuEnums.PLAYERS && <PlayerList onReturn={onReturn} />}
      {option === TopMenuEnums.TRAININGS && (
        <TrainingList onReturn={onReturn} />
      )}
      {option === TopMenuEnums.GAMES && <GameList onReturn={onReturn} />}
    </View>
  );
};

export default ClubProfile;
