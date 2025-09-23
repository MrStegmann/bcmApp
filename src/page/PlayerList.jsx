import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useClubStore } from "../store/ClubStore";
import PlayerForm from "../components/PlayerForm";
import { Feather } from "@expo/vector-icons";
import PlayerDetail from "../components/PlayerDetail";
import Player from "../models/Player";
import DeleteModal from "../framework/DeleteModal";
import Table from "../framework/Table";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import useDB from "../hooks/useDB";

const TableHeader = () => {
  return (
    <>
      <View className="w-[12%]">
        <Text className="font-bold text-danish-dark-gray text-center">Nº</Text>
      </View>
      <View className="w-[50%]">
        <Text className="font-bold text-danish-dark-gray text-left">
          Nombre
        </Text>
      </View>
      <View className="w-[30%]">
        <Text className="font-bold text-danish-dark-gray text-center">
          Opciones
        </Text>
      </View>
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
          className="w-full flex flex-row items-center border-b px-3 border-danish-light-gray py-2"
        >
          <View className="w-[12%]">
            <Text className="text-danish-dark-gray text-center">
              {item.number}
            </Text>
          </View>
          <View className="w-[50%]">
            <Text className="text-danish-dark-gray text-left">
              {item.first_name + " " + item.last_name}
            </Text>
          </View>

          <View className="w-[30%] flex flex-row justify-center items-center gap-3">
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Feather name="info" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              color="blue"
              onPress={() => handleOpenEditForm(item)}
            >
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

const PlayerList = ({ onReturn }) => {
  const { PlayerController } = useDB();
  const [players, setPlayers] = useState([]);
  const [createPlayer, setCreatePlayer] = useState(false);
  const [editPlayer, setEditPlayer] = useState(false);
  const [playerSelected, setPlayerSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    getData();
    setMainMenu();
  }, []);

  useEffect(() => {
    if (createPlayer) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setCreatePlayer(false),
          children: () => <Entypo name="back" size={24} color="red" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [createPlayer]);

  useEffect(() => {
    if (editPlayer) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => {
            setPlayerSelected(null);
            setEditPlayer(false);
          },
          children: () => <Entypo name="back" size={24} color="red" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [editPlayer]);

  useEffect(() => {
    if (editPlayer) return;
    if (playerSelected) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => {
            setPlayerSelected(null);
          },
          children: () => <Entypo name="back" size={24} color="red" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [playerSelected]);

  const setMainMenu = () => {
    setTopMenu([
      {
        id: TopMenuEnums.ADD_NEW_PLAYER,
        name: "Añadir Jugador",
        onPress: () => setCreatePlayer(true),
        children: () => <Entypo name="add-user" size={24} color="red" />,
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
    PlayerController.load(club.id, setPlayers);
  };

  const handleAddPlayer = async (data) => {
    await PlayerController.add(
      data.teamId,
      data.firstName,
      data.lastName,
      data.number,
      club.id
    );
    getData();
    setCreatePlayer(false);
  };

  const handleUpdatePlayer = async (data) => {
    await PlayerController.edit(
      data.id,
      data.teamId,
      data.firstName,
      data.lastName,
      data.number,
      club.id
    );
    getData();
    setEditPlayer(false);
    setPlayerSelected(null);
  };

  const handleOpenEditForm = (player) => {
    setPlayerSelected(player);
    setEditPlayer(true);
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
    await PlayerController.remove(itemToDelete.id);
    getData();
    setModalVisible(false);
    setItemToDelete(null);
  };
  return (
    <View className="w-full h-full px-5">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar el jugador ${itemToDelete?.first_name} ${itemToDelete?.last_name}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        item={itemToDelete}
      />
      {createPlayer && !editPlayer && (
        <PlayerForm
          onSubmit={handleAddPlayer}
          onCancel={() => setCreatePlayer(false)}
        />
      )}
      {!createPlayer && editPlayer && (
        <PlayerForm
          onSubmit={handleUpdatePlayer}
          playerData={playerSelected}
          onCancel={() => setEditPlayer(false)}
        />
      )}
      {!createPlayer &&
        !editPlayer &&
        (playerSelected ? (
          <PlayerDetail
            data={playerSelected}
            onReturn={() => setPlayerSelected(null)}
          />
        ) : (
          <>
            <Table
              header={<TableHeader />}
              body={
                <TableBody
                  items={players}
                  onSelect={setPlayerSelected}
                  handleOpenEditForm={handleOpenEditForm}
                  handleOpenDeleteModal={handleOpenDeleteModal}
                />
              }
            />
          </>
        ))}
    </View>
  );
};

export default PlayerList;
