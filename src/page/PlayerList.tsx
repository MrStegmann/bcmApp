import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

import PlayerForm from "../components/PlayerForm";
import PlayerDetail from "../components/PlayerDetail";
import PlayerCards from "../components/PlayerCards";
import DeleteModal from "../framework/DeleteModal";

import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import { Player } from "../types/database";

interface PlayerListProps {
  onReturn?: () => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ onReturn }) => {
  const { PlayerController } = useDB();
  const [players, setPlayers] = useState<Player[]>([]);
  const [createPlayer, setCreatePlayer] = useState<boolean>(false);
  const [editPlayer, setEditPlayer] = useState<boolean>(false);
  const [playerSelected, setPlayerSelected] = useState<Player | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Player | null>(null);

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
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn || (() => {}),
        children: () => <Entypo name="back" size={18} color="white" />,
      },
    ]);
  };

  const getData = async () => {
    if (club?.id) {
      const list = await PlayerController.loadStatsByTeam(club.id);
      setPlayers(list);
    }
  };

  const handleAddPlayer = async (data: any) => {
    if (club?.id) {
      await PlayerController.add(
        club.id,
        data.firstName,
        data.lastName,
        data.number,
        club.id
      );
      getData();
      setCreatePlayer(false);
    }
  };

  const handleUpdatePlayer = async (data: any) => {
    if (club?.id) {
      await PlayerController.edit(
        data.id,
        club.id,
        data.firstName,
        data.lastName,
        data.number,
        club.id
      );
      getData();
      setEditPlayer(false);
      setPlayerSelected(null);
    }
  };

  const handleOpenEditForm = (player: Player) => {
    setPlayerSelected(player);
    setEditPlayer(true);
  };

  const handleOpenDeleteModal = (item: Player) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete?.id) {
      await PlayerController.remove(itemToDelete.id);
      getData();
      setModalVisible(false);
      setItemToDelete(null);
    }
  };

  return (
    <View className="w-full h-full px-5">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar el jugador ${itemToDelete?.firstName || ""} ${itemToDelete?.lastName || ""}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
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
