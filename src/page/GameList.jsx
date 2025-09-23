import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, Button } from "react-native";
import { useClubStore } from "../store/ClubStore";
import { Feather } from "@expo/vector-icons";
import Table from "../framework/Table";
import DeleteModal from "../framework/DeleteModal";
import GameForm from "../components/GameForm";
import GameDetail from "../components/GameDetail";
import Game from "../models/Game";
import PlayerStats from "../models/PlayerStats";
import useDB from "../hooks/useDB";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMenuStore } from "../store/MenuStore";

const TableHeader = () => {
  return (
    <>
      <Text className="font-bold w-18 text-center">J.</Text>
      <Text className="font-bold w-18 text-center">Fecha</Text>
      <Text className="font-bold w-28 text-center">Oponente</Text>
      <Text className="font-bold w-28 text-center">Opciones</Text>
    </>
  );
};

const TableBody = ({
  items,
  onSelect,
  handleOpenEditForm,
  handleOpenDeleteModal,
}) => {
  return (
    <>
      {items.map((item) => (
        <View
          key={item.id}
          className="w-full flex flex-row justify-between items-center border-b py-2 border-gray-300 px-5"
        >
          <Text className="text-sm w-18 text-center">{item.round}</Text>
          <Text className="text-sm w-18 text-center ">{item.date}</Text>
          <Text className="text-sm w-28 text-center">{item.opponent}</Text>
          <View className="flex flex-row w-28 justify-between">
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Feather name="info" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOpenEditForm(item)}>
              <Feather name="edit" size={24} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity
              color="red"
              onPress={() => handleOpenDeleteModal(item)}
            >
              <Feather name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
};

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
          children: () => <Entypo name="back" size={24} color="red" />,
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
          children: () => <Entypo name="back" size={24} color="red" />,
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
          children: () => <Entypo name="back" size={24} color="red" />,
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
          <Ionicons name="basketball-sharp" size={24} color="red" />
        ),
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        children: () => <Entypo name="back" size={24} color="red" />,
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
    // const updatedGame = new Game(game);
    // const resultGames = await GameService.update(
    //   updatedGame.toUpdate(),
    //   club.id
    // );
    // setGames(resultGames);
    // setGameSelected((before) => resultGames.find((g) => g.id === before.id));
  };

  const handleUpdateStats = async (stats) => {
    // for (const stat of stats) {
    //   const playerStat = new PlayerStats(stat);
    //   await PlayerStatsService.update(playerStat.toUpdate());
    // }
  };

  return (
    <View className="flex-1 w-full h-full justify-start items-center">
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
            onUpdateStats={handleUpdateStats}
          />
        ) : (
          <Table
            header={<TableHeader />}
            body={
              <TableBody
                items={games}
                onSelect={setGameSelected}
                handleOpenEditForm={handleOpenEditForm}
                handleOpenDeleteModal={handleOpenDeleteModal}
              />
            }
          />
        ))}
    </View>
  );
};

export default GameList;
