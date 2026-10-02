import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

import GameCards from "../components/GameCards";
import DeleteModal from "../framework/DeleteModal";
import GameForm from "../components/GameForm";
import PlayMatch from "./PlayMatch";
import RosterSelectionModal from "../components/RosterSelectionModal";

import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import { Game, Player } from "../types/database";

interface GameListProps {
  onReturn?: () => void;
}

const GameList: React.FC<GameListProps> = ({ onReturn }) => {
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const setHeaderAction = useMenuStore((state) => state.setHeaderAction);
  const setHeaderBackAction = useMenuStore((state) => state.setHeaderBackAction);
  const { GameController, PlayerController } = useDB();

  const openCreateGame = useCallback(() => setCreateGame(true), []);

  const [games, setGames] = useState<Game[]>([]);
  const [gameSelected, setGameSelected] = useState<Game | null>(null);
  const [createGame, setCreateGame] = useState<boolean>(false);
  const [editGame, setEditGame] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Game | null>(null);

  // Roster Modal States
  const [rosterModalVisible, setRosterModalVisible] = useState<boolean>(false);
  const [isRosterMandatory, setIsRosterMandatory] = useState<boolean>(false);
  const [pendingGameData, setPendingGameData] = useState<any>(null);
  const [pendingMatchToStart, setPendingMatchToStart] = useState<Game | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedRosterIds, setSelectedRosterIds] = useState<number[]>([]);

  useEffect(() => {
    getData();
    loadTeamPlayers();
    setMainMenu();
    return () => {
      setHeaderAction(null);
      setHeaderBackAction(null);
    };
  }, [club?.id]);

  useEffect(() => {
    if (createGame) {
      setHeaderAction(null);
      setHeaderBackAction({
        label: "Volver",
        iconName: "chevron-left",
        iconFamily: "Feather",
        onPress: () => setCreateGame(false),
        testID: "header-back-button",
      });
    } else if (editGame) {
      setHeaderAction(null);
      setHeaderBackAction({
        label: "Volver",
        iconName: "chevron-left",
        iconFamily: "Feather",
        onPress: () => {
          setGameSelected(null);
          setEditGame(false);
        },
        testID: "header-back-button",
      });
    } else if (gameSelected) {
      setHeaderAction(null);
      setHeaderBackAction({
        label: "Volver",
        iconName: "chevron-left",
        iconFamily: "Feather",
        onPress: () => setGameSelected(null),
        testID: "header-back-button",
      });
    } else {
      setHeaderAction({
        label: "Añadir",
        iconName: "plus-circle",
        iconFamily: "Feather",
        onPress: openCreateGame,
        testID: "header-add-game",
      });
      setHeaderBackAction(null);
    }
  }, [createGame, editGame, gameSelected]);

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
        children: () => <Ionicons name="basketball-sharp" size={18} color="white" />,
      },
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
      const list = await GameController.getAll(club.id);
      setGames(list);
    }
  };

  const loadTeamPlayers = async () => {
    if (club?.id) {
      const players = await PlayerController.getAll(club.id);
      setAvailablePlayers(players || []);
    }
  };

  // Step 1 of Match Creation: Valid Form Submitted -> Opens Optional Roster Modal
  const handleInitiateCreateGame = (gameFormData: any) => {
    setPendingGameData(gameFormData);
    setPendingMatchToStart(null);
    setSelectedRosterIds([]);
    setIsRosterMandatory(false);
    setRosterModalVisible(true);
  };

  // Selection of match to start or inspect (US2 & US3 Roster Enforcement and Transition to PlayMatch)
  const handleSelectGame = async (game: Game) => {
    if (game.status === "pending" || !game.status) {
      const roster = await GameController.getRoster(game.id);
      if (!roster || roster.length === 0) {
        // Enforce mandatory roster selection before match entry
        setPendingMatchToStart(game);
        setPendingGameData(null);
        setSelectedRosterIds([]);
        setIsRosterMandatory(true);
        setRosterModalVisible(true);
        return;
      }
    }
    setGameSelected(game);
  };

  const handleToggleRosterPlayer = (playerId: number) => {
    setSelectedRosterIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : prev.length < 12
        ? [...prev, playerId]
        : prev
    );
  };

  // User Confirms Roster in Modal (handles both creation flow and mandatory start flow)
  const handleConfirmRoster = async (rosterIds: number[]) => {
    if (isRosterMandatory && pendingMatchToStart) {
      // Mandatory match start flow: save roster to existing pending match
      for (const pid of rosterIds) {
        await GameController.editCalledup({
          called: true,
          game_id: pendingMatchToStart.id,
          player_id: pid,
        });
      }
      const matchToOpen = pendingMatchToStart;
      setPendingMatchToStart(null);
      setRosterModalVisible(false);
      setGameSelected(matchToOpen);
      await getData();
    } else if (pendingGameData) {
      // Creation flow: create match + save roster
      const newGame = await GameController.add(pendingGameData);
      if (newGame?.id) {
        for (const pid of rosterIds) {
          await GameController.editCalledup({
            called: true,
            game_id: newGame.id,
            player_id: pid,
          });
        }
      }
      setPendingGameData(null);
      setRosterModalVisible(false);
      setCreateGame(false);
      await getData();
    }
  };

  // User Skips Roster in Modal (Creation flow only)
  const handleSkipRoster = async () => {
    if (pendingGameData) {
      await GameController.add(pendingGameData);
      setPendingGameData(null);
      setRosterModalVisible(false);
      setCreateGame(false);
      await getData();
    }
  };

  const handleUpdateGame = async (gameData: any) => {
    if (gameData?.id) {
      await GameController.edit(gameData);
      await getData();
    }
    setGameSelected(null);
    setEditGame(false);
  };

  const handleOpenEditForm = async (game: Game) => {
    setGameSelected(game);
    setEditGame(true);
  };

  const handleOpenDeleteModal = (item: Game) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete?.id) {
      await GameController.remove(itemToDelete.id);
      await getData();
      setModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleFinishMatch = async () => {
    await getData();
    setGameSelected(null);
  };

  return (
    <View className="w-full h-full justify-start items-center px-2">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar el partido contra ${itemToDelete?.opponent || ""}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />

      {/* Reusable Roster Selection Modal */}
      <RosterSelectionModal
        visible={rosterModalVisible}
        isMandatory={isRosterMandatory}
        availablePlayers={availablePlayers}
        selectedPlayerIds={selectedRosterIds}
        onTogglePlayer={handleToggleRosterPlayer}
        onConfirm={handleConfirmRoster}
        onSkip={isRosterMandatory ? undefined : handleSkipRoster}
        onClose={() => {
          setRosterModalVisible(false);
          setPendingGameData(null);
          setPendingMatchToStart(null);
        }}
      />

      {createGame && !editGame && (
        <GameForm
          onSubmit={handleInitiateCreateGame}
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
          <PlayMatch
            match={gameSelected}
            onFinishMatch={handleFinishMatch}
            onReturn={() => setGameSelected(null)}
          />
        ) : (
          <GameCards
            games={games}
            onSelect={handleSelectGame}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteModal}
          />
        ))}
    </View>
  );
};

export default GameList;
