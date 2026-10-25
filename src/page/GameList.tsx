import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

import GameCards from "../components/GameCards";
import DeleteModal from "../framework/DeleteModal";
import GameForm from "../components/GameForm";
import PlayMatch from "./PlayMatch";
import RosterSelectionModal from "../components/RosterSelectionModal";
import { MatchDetailView } from "../features/match-detail";

import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import { useGameStore } from "../store/GameStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import { Game, Player } from "../types/database";
import { DirectResultModal, DirectResultBuffer, calculateValuation } from "../features/direct-result";

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
  const [pendingMatchToEditRoster, setPendingMatchToEditRoster] = useState<Game | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedRosterIds, setSelectedRosterIds] = useState<number[]>([]);

  // Direct Result Modal States
  const [directResultModalVisible, setDirectResultModalVisible] = useState<boolean>(false);
  const [matchForDirectResult, setMatchForDirectResult] = useState<Game | null>(null);
  const [directResultPlayers, setDirectResultPlayers] = useState<Player[]>([]);
  const [isSavingDirectResult, setIsSavingDirectResult] = useState<boolean>(false);

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
      // PlayMatch manages its own header actions and custom score header
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
      const players = await PlayerController.loadStatsByTeam(club.id);
      setAvailablePlayers(players);
    }
  };

  const handleSelectGame = async (game: Game) => {
    if (game.status === "finished") {
      setGameSelected(game);
      return;
    }

    if (game.id) {
      const existingRoster = await GameController.getCalledUpPlayers(game.id);
      if (!existingRoster || existingRoster.length === 0) {
        setPendingMatchToStart(game);
        setIsRosterMandatory(true);
        setSelectedRosterIds([]);
        setRosterModalVisible(true);
        return;
      }
    }

    setGameSelected(game);
  };

  const handleSelectRoster = async (game: Game) => {
    if (game.status !== "pending" && game.status) return;

    setPendingMatchToEditRoster(game);
    setIsRosterMandatory(false);

    if (game.id) {
      const existingRoster = await GameController.getCalledUpPlayers(game.id);
      const playerIds = (existingRoster || []).map((p: any) => p.playerId || p.player_id);
      setSelectedRosterIds(playerIds);
    } else {
      setSelectedRosterIds([]);
    }

    setRosterModalVisible(true);
  };

  const handleOpenSetResult = async (game: Game) => {
    if (game.status !== "pending" && game.status) return;

    setMatchForDirectResult(game);

    if (game.id) {
      const calledUp = await GameController.getCalledUpPlayers(game.id);
      if (calledUp && calledUp.length > 0) {
        const calledUpIds = calledUp.map((c: any) => c.playerId || c.player_id);
        const resolved = availablePlayers.filter((p) => calledUpIds.includes(p.id));
        setDirectResultPlayers(resolved.length > 0 ? resolved : availablePlayers);
      } else {
        setDirectResultPlayers(availablePlayers);
      }
    } else {
      setDirectResultPlayers(availablePlayers);
    }

    setDirectResultModalVisible(true);
  };

  const handleSaveDirectResult = async (matchId: number, buffer: DirectResultBuffer) => {
    setIsSavingDirectResult(true);
    try {
      const finalScores = {
        status: "finished" as const,
        resultC1: buffer.periods.q1.teamPoints,
        resultC2: buffer.periods.q2.teamPoints,
        resultC3: buffer.periods.q3.teamPoints,
        resultC4: buffer.periods.q4.teamPoints,
        resultExtra: buffer.hasExtraTime ? buffer.periods.extra.teamPoints : 0,
        resultC1Opponent: buffer.periods.q1.rivalPoints,
        resultC2Opponent: buffer.periods.q2.rivalPoints,
        resultC3Opponent: buffer.periods.q3.rivalPoints,
        resultC4Opponent: buffer.periods.q4.rivalPoints,
        resultExtraOpponent: buffer.hasExtraTime ? buffer.periods.extra.rivalPoints : 0,
        foulsC1: buffer.periods.q1.teamFouls,
        foulsC2: buffer.periods.q2.teamFouls,
        foulsC3: buffer.periods.q3.teamFouls,
        foulsC4: buffer.periods.q4.teamFouls,
        foulsExtra: buffer.hasExtraTime ? buffer.periods.extra.teamFouls : 0,
        foulsC1Opponent: buffer.periods.q1.rivalFouls,
        foulsC2Opponent: buffer.periods.q2.rivalFouls,
        foulsC3Opponent: buffer.periods.q3.rivalFouls,
        foulsC4Opponent: buffer.periods.q4.rivalFouls,
        foulsExtraOpponent: buffer.hasExtraTime ? buffer.periods.extra.rivalFouls : 0,
      };

      const statsToSave = Object.values(buffer.players).map((stat) => ({
        gameId: matchId,
        playerId: stat.playerId,
        minutes: stat.minutes,
        t1a: stat.t1a,
        t1i: stat.t1i,
        t2a: stat.t2a,
        t2i: stat.t2i,
        t3a: stat.t3a,
        t3i: stat.t3i,
        oreb: stat.oreb,
        dreb: stat.dreb,
        asis: stat.asis,
        rec: stat.rec,
        per: stat.per,
        falt: stat.falt,
        valuation: calculateValuation(stat),
      }));

      const gameStore = useGameStore.getState();
      await gameStore.batchSavePlayerStats(statsToSave);
      await gameStore.finishMatch(matchId, finalScores);

      await getData();
      setDirectResultModalVisible(false);
      setMatchForDirectResult(null);
    } finally {
      setIsSavingDirectResult(false);
    }
  };

  const handleInitiateCreateGame = (gameData: any) => {
    setPendingGameData(gameData);
    setIsRosterMandatory(false);
    setSelectedRosterIds([]);
    setRosterModalVisible(true);
  };

  const handleToggleRosterPlayer = (playerId: number) => {
    setSelectedRosterIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        if (prev.length >= 12) return prev;
        return [...prev, playerId];
      }
    });
  };

  const handleConfirmRoster = async (rosterIds: number[]) => {
    if (pendingGameData) {
      const createdGame = await GameController.add(pendingGameData);
      if (createdGame?.id && rosterIds.length > 0) {
        await GameController.saveCalledUpPlayers(createdGame.id, rosterIds);
      }
      setPendingGameData(null);
      setRosterModalVisible(false);
      setCreateGame(false);
      await getData();
    } else if (pendingMatchToStart && pendingMatchToStart.id) {
      await GameController.saveCalledUpPlayers(pendingMatchToStart.id, rosterIds);
      const matchToLaunch = pendingMatchToStart;
      setPendingMatchToStart(null);
      setRosterModalVisible(false);
      setGameSelected(matchToLaunch);
      await getData();
    } else if (pendingMatchToEditRoster && pendingMatchToEditRoster.id) {
      await GameController.saveCalledUpPlayers(pendingMatchToEditRoster.id, rosterIds);
      setPendingMatchToEditRoster(null);
      setRosterModalVisible(false);
      await getData();
    }
  };

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

  const handleReturnFromPlayMatch = useCallback(() => {
    setGameSelected(null);
  }, []);

  return (
    <View className="w-full h-full justify-start items-center px-3 bg-surface">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar el partido contra ${itemToDelete?.opponent || ""}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />

      <RosterSelectionModal
        visible={rosterModalVisible}
        isMandatory={isRosterMandatory}
        title={pendingMatchToEditRoster ? "Editar Convocatoria" : undefined}
        availablePlayers={availablePlayers}
        selectedPlayerIds={selectedRosterIds}
        onTogglePlayer={handleToggleRosterPlayer}
        onConfirm={handleConfirmRoster}
        onSkip={isRosterMandatory || pendingMatchToEditRoster ? undefined : handleSkipRoster}
        onClose={() => {
          setRosterModalVisible(false);
          setPendingGameData(null);
          setPendingMatchToStart(null);
          setPendingMatchToEditRoster(null);
        }}
      />

      <DirectResultModal
        visible={directResultModalVisible}
        match={matchForDirectResult}
        availablePlayers={directResultPlayers}
        onSave={handleSaveDirectResult}
        onClose={() => {
          setDirectResultModalVisible(false);
          setMatchForDirectResult(null);
        }}
        isSaving={isSavingDirectResult}
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
          gameSelected.status === "finished" ? (
            <MatchDetailView
              match={gameSelected}
              onReturn={() => {
                setGameSelected(null);
                getData();
              }}
              onMatchUpdated={(updated) => {
                setGameSelected(updated);
                getData();
              }}
            />
          ) : (
            <PlayMatch
              match={gameSelected}
              onFinishMatch={handleFinishMatch}
              onReturn={handleReturnFromPlayMatch}
            />
          )
        ) : (
          <GameCards
            games={games}
            onSelect={handleSelectGame}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteModal}
            onSelectRoster={handleSelectRoster}
            onSetResult={handleOpenSetResult}
          />
        ))}
    </View>
  );
};

export default GameList;
