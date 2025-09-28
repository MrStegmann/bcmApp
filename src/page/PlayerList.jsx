import { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import PlayerForm from "../components/PlayerForm";
import PlayerDetail from "../components/PlayerDetail";
import DeleteModal from "../framework/DeleteModal";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import useDB from "../hooks/useDB";
import PlayerCards from "../components/PlayerCards";

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
          children: () => <Entypo name="back" size={18} color="white" />,
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
          children: () => <Entypo name="back" size={18} color="white" />,
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
          children: () => <Entypo name="back" size={18} color="white" />,
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
        children: () => <Entypo name="add-user" size={18} color="white" />,
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
    PlayerController.loadStatsByTeam(club.id, setPlayers);
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
          <PlayerCards
            players={players}
            onSelect={setPlayerSelected}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteModal}
          />
        ))}
    </View>
  );
};

export default PlayerList;
