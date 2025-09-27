import { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import PlayerForm from "../components/PlayerForm";
import PlayerDetail from "../components/PlayerDetail";
import DeleteModal from "../framework/DeleteModal";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import PlayerCards from "../components/PlayerCards";

const PlayerList = ({ onReturn }) => {
  const { PlayerController } = useDB();
  const setPlayers = useClubStore((state) => state.setPlayers);
  const players = useClubStore((state) => state.players);
  const [createPlayer, setCreatePlayer] = useState(false);
  const [editPlayer, setEditPlayer] = useState(false);
  const [playerSelected, setPlayerSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    setMainMenu();
  }, []);

  useEffect(() => {
    if (!createPlayer || !editPlayer) {
      setMainMenu();
    }
  }, [createPlayer, editPlayer]);

  useEffect(() => {
    if (editPlayer) return;
    if (playerSelected) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setPlayerSelected(null),
          icon: TopMenuEnums.GO_BACK,
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
        icon: TopMenuEnums.ADD_NEW_PLAYER,
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
    setPlayers(await PlayerController.loadStatsByTeam(club.id));
  };

  const handleAddPlayer = async (data) => {
    await PlayerController.add(data);
    getData();
    setCreatePlayer(false);
  };

  const handleUpdatePlayer = async (data) => {
    await PlayerController.edit(data);
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
          onCancel={() => {
            setEditPlayer(false);
            setPlayerSelected(null);
          }}
        />
      )}
      {!createPlayer &&
        !editPlayer &&
        (playerSelected ? (
          <PlayerDetail data={playerSelected} />
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
