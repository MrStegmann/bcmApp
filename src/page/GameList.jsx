import { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import GameCards from "../components/GameCards";
import DeleteModal from "../framework/DeleteModal";
import GameForm from "../components/GameForm";
import GameDetail from "../components/GameDetail";
import useDB from "../hooks/useDB";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMenuStore } from "../store/MenuStore";

const GameList = ({ onReturn }) => {
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
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
    if (createGame) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setCreateGame(false),
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [createGame]);
  useEffect(() => {
    if (editGame) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => {
            setGameSelected(null);
            setEditGame(false);
          },
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [editGame]);
  useEffect(() => {
    if (editGame) return;
    if (gameSelected) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => {
            setGameSelected(null);
          },
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [gameSelected]);

  const setMainMenu = () => {
    setTopMenu([
      {
        id: TopMenuEnums.ADD_NEW_SESSION,
        name: "Añadir Partido",
        onPress: () => setCreateGame(true),
        children: () => (
          <Ionicons name="basketball-sharp" size={18} color="white" />
        ),
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        children: () => <Entypo name="back" size={18} color="white" />,
      },
    ]);
  };

  const getData = async () => {
    GameController.load(club.id, setGames);
  };

  const handleCreateGame = async (game) => {
    await GameController.add(game);

    getData();
    setCreateGame(false);
  };

  const handleUpdateGame = async (game) => {
    await GameController.edit(game);
    getData();
    setGameSelected(null);
    setEditGame(false);
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
    getData();
    setGameSelected((before) => games.find((g) => g.id === before.id));
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
          onSubmit={handleCreateGame}
          onCancel={() => setCreateGame(false)}
        />
      )}
      {editGame && !createGame && (
        <GameForm
          onSubmit={handleUpdateGame}
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
