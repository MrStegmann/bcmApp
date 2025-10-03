import { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import GameCards from "../components/GameCards";
import DeleteModal from "../framework/DeleteModal";
import GameForm from "../components/GameForm";
import GameDetail from "../components/GameDetail";
import useDB from "../hooks/useDB";
import TopMenuEnums from "../Enums/TopMenuEnums";
import { useMenuStore } from "../store/MenuStore";
import { useAlertStore } from "../store/AlertStore";

const GameList = ({ onReturn }) => {
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const addAlert = useAlertStore((state) => state.addAlert);
  const { GameController } = useDB();
  const [games, setGames] = useState([]);
  const [gameSelected, setGameSelected] = useState(null);
  const [createGame, setCreateGame] = useState(false);
  const [editGame, setEditGame] = useState(false);

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
    setGames(await GameController.getGameResults(club.id));
  };

  const handleSaveGame = async (data) => {
    setGames([]);
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

  const handleUpdateResults = async (game) => {
    await GameController.edit(game);
    addAlert({
      msg: "Se ha guardado el partido",
      lifetime: 2500,
      id: Date.now(),
    });
    getData();
    setGameSelected(null);
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
      {!createGame &&
        !editGame &&
        (gameSelected ? (
          <GameDetail
            data={gameSelected}
            onUpdateResults={handleUpdateResults}
            onReturn={() => setGameSelected(null)}
          />
        ) : (
          <GameCards
            games={games}
            onSelect={setGameSelected}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteModal}
          />
        ))}
    </View>
  );
};

export default GameList;
