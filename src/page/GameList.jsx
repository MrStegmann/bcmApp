import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useClubStore } from "../store/ClubStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Feather } from "@expo/vector-icons";
import DeleteModal from "../framework/DeleteModal";
import GameForm from "../components/GameForm";
import GameDetail from "../components/GameDetail";
import useDB from "../hooks/useDB";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMenuStore } from "../store/MenuStore";

const GameCards = ({ games, onSelect, onEdit, onDelete }) => {
  if (games.length === 0)
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray px-16">
          Parece que no aún no has registrado ningún partido
        </Text>
      </View>
    );

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        {games.map((game) => {
          const result =
            game.result_c1 +
            game.result_c2 +
            game.result_c3 +
            game.result_c4 +
            game.result_extra;
          const resultOpponent =
            game.result_c1_opponent +
            game.result_c2_opponent +
            game.result_c3_opponent +
            game.result_c4_opponent +
            game.result_extra_opponent;
          return (
            <TouchableOpacity
              key={game.id}
              onPress={() => onSelect(game)}
              className="my-2 active:shadow-inner shadow-danish-red bg-transparent z-10 hover:bg-danish-red active:bg-danish-red"
            >
              <View
                className={`w-full flex flex-row justify-between px-4 py-3 bg-danish-dark-gray rounded-xl shadow-lg  border ${result > resultOpponent ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
              >
                <View className="w-[75%] flex flex-row justify-between items-center">
                  <View className="flex flex-col">
                    <Text className="text-xs text-danish-white text-center">
                      {game.round}
                    </Text>
                  </View>
                  <View className="flex flex-col">
                    <Text className="text-xs text-danish-white text-center">
                      {game.date}
                    </Text>
                  </View>
                  <View className="flex flex-col">
                    <Text className="text-xs text-danish-white text-center">
                      {game.opponent}
                    </Text>
                  </View>
                  <View className="flex flex-col">
                    <Text className="text-xs text-danish-white text-center">
                      {result} - {resultOpponent}
                    </Text>
                  </View>
                </View>

                <View className="w-[25%] flex flex-row justify-end items-center gap-3">
                  <TouchableOpacity color="blue" onPress={() => onEdit(game)}>
                    <Feather name="edit" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    color="white"
                    onPress={() => onDelete(game)}
                  >
                    <Feather name="trash" size={18} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
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
