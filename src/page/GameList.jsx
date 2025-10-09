import { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import GameCards from "../components/GameCards";
import DeleteModal from "../framework/DeleteModal";
import GameForm from "../components/GameForm";
import useDB from "../hooks/useDB";
import TopMenuEnums from "../Enums/TopMenuEnums";
import { useMenuStore } from "../store/MenuStore";
import { useAlertStore } from "../store/AlertStore";
import GameMatch from "../components/GameMatch";
import { useMatchStore } from "../store/MatchStore";
import GameDetail from "../components/GameDetail";

const GameList = ({ onReturn }) => {
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const matchStore = useMatchStore((state) => state);
  const { GameController } = useDB();
  const [games, setGames] = useState([]);
  const [gameSelected, setGameSelected] = useState(null);
  const [createGame, setCreateGame] = useState(false);
  const [editGame, setEditGame] = useState(false);
  const [matchGame, setMatchGame] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    getData();
    setMainMenu();
  }, []);

  useEffect(() => {
    if (!createGame || !editGame) {
      setMainMenu();
    }
  }, [createGame, editGame]);

  useEffect(() => {
    if (editGame) return;
    if (!gameSelected) {
      setMainMenu();
    }
  }, [gameSelected]);

  const setMainMenu = () => {
    setTopMenu([
      {
        id: TopMenuEnums.ADD_NEW_GAME,
        name: "Añadir Partido",
        onPress: () => setCreateGame(true),
        icon: TopMenuEnums.ADD_NEW_GAME,
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        icon: TopMenuEnums.GO_BACK,
      },
    ]);
  };

  const getData = async () => {
    const data = await GameController.getGameResults(club.id);
    setGames(data);
  };

  const handleSaveGame = async (data) => {
    await GameController.save(data);
    setCreateGame(false);
    setGameSelected(null);
    setEditGame(false);
    getData();
  };

  const handleOpenEditForm = async (game) => {
    setGameSelected(game);
    setEditGame(true);
  };

  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    await GameController.remove(itemToDelete.id);
    getData();
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handlePlayMatch = (game) => {
    setGameSelected(game);
    setMatchGame(true);
  };

  const handleAfterSaveMatch = () => {
    setGameSelected(null);
    setMatchGame(false);
    matchStore.setPlaying(false);
    getData();
  };

  const handleMatchReturn = () => {
    setGameSelected(null);
    setMatchGame(false);
    matchStore.setPlaying(false);
  };

  const handleSaveDetail = () => {
    setGameSelected(null);
    getData();
  };

  return (
    <View className="w-full h-full justify-start items-center px-2">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar el partido contra ${itemToDelete?.opponent}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        item={itemToDelete}
      />
      {createGame && !editGame && (
        <GameForm
          onSubmit={handleSaveGame}
          onCancel={() => setCreateGame(false)}
        />
      )}
      {editGame && !createGame && (
        <GameForm
          onSubmit={handleSaveGame}
          gameData={gameSelected}
          onCancel={() => {
            setEditGame(false);
            setGameSelected(null);
          }}
        />
      )}
      {matchGame && gameSelected && (
        <GameMatch
          data={gameSelected}
          onReturn={handleMatchReturn}
          onSave={handleAfterSaveMatch}
        />
      )}
      {!createGame &&
        !editGame &&
        !matchGame &&
        (gameSelected ? (
          <GameDetail
            data={gameSelected}
            onReturn={() => setGameSelected(null)}
            onSave={handleSaveDetail}
          />
        ) : (
          <GameCards
            games={games}
            onSelect={setGameSelected}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteModal}
            onPlay={handlePlayMatch}
          />
        ))}
    </View>
  );
};

export default GameList;
