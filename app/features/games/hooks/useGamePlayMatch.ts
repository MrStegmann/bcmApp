import { useState, useEffect, useCallback, useMemo } from "react";
import { Animated, Platform } from "react-native";
import { useTeamStore } from "../../teams";
import { getGameRoster } from "../api/gameApi";
import { getPlayers } from "../../players/api/playersApi";
import { Player, PlayerStats } from "../../players/types";
import { GamePlayState, getGamePlayState, saveGamePlayState } from "../utils/gameStorage";

export const INITIAL_STATE: GamePlayState = {
  gameId: "",
  quarter: 1,
  timeRemainingByQuarter: { 1: 600, 2: 600, 3: 600, 4: 600, 5: 300 },
  teamScore: 0,
  rivalScore: 0,
  quarterTeamScore: 0,
  quarterRivalScore: 0,
  courtPlayerIds: [],
  plannedFives: { 1: [], 2: [], 3: [], 4: [], 5: [] },
  teamFoulsByQuarter: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  rivalFoulsByQuarter: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  playerStats: {},
};

export type ShotModalState = {
  visible: boolean;
  points: 1 | 2 | 3 | null;
  step: "outcome" | "assist";
  shooterId: string | null;
};

export const HELP_DATA: Record<string, { title: string; description: string }> = {
  timer: {
    title: "Reloj / Cronómetro",
    description: "Botón pulsable. Al pulsarlo, el tiempo comenzará a correr o se pausará. Si mantienes pulsado sobre él (o tocas en el icono de reinicio en web) durante un cuarto extra (EX), el reloj volverá a 5:00."
  },
  quarters: {
    title: "Selector de Cuartos",
    description: "Botones pulsables. Te permiten moverte entre los distintos cuartos del partido (Q1 a Q4, o EX). Al cambiar, se guarda el tiempo pero el marcador parcial comienza de cero."
  },
  rival: {
    title: "Equipo Rival",
    description: "Botón pulsable. Al hacer clic, se abre una ventana donde puedes sumar puntos (+1, +2, +3) de forma rápida al equipo contrario, o sumarle una falta de equipo."
  },
  bench: {
    title: "Jugadores en el Banquillo",
    description: "Botones pulsables de sustitución. Al pulsar sobre la camiseta de un jugador del banquillo, queda seleccionado (rojo). Si luego pulsas sobre un jugador en la pista, entrará por él."
  },
  court_player: {
    title: "Jugadores en Pista",
    description: "Botones pulsables de acción. Representan a tu quinteto. Al pulsar sobre uno, quedará seleccionado (naranja) y podrás asignarle estadísticas."
  },
  stats_toolbar: {
    title: "Barra de Estadísticas",
    description: "Botones de acción. Primero selecciona un jugador en la pista. Luego pulsa sobre cualquiera de estos botones para registrar la estadística a su nombre."
  }
};

export const useGamePlayMatch = (gameId: string) => {
  const team = useTeamStore((state) => state.team);

  const [isLoading, setIsLoading] = useState(true);
  const [rosterPlayers, setRosterPlayers] = useState<Player[]>([]);
  const [matchState, setMatchState] = useState<GamePlayState>({ ...INITIAL_STATE, gameId });

  // UI States
  const [isHelpModeActive, setIsHelpModeActive] = useState(false);
  const [activeHelpItem, setActiveHelpItem] = useState<{title: string, description: string} | null>(null);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSubMode, setIsSubMode] = useState(false);
  const [subsOut, setSubsOut] = useState<Set<string>>(new Set());
  const [subsIn, setSubsIn] = useState<Set<string>>(new Set());
  const [tempStartingFive, setTempStartingFive] = useState<Set<string>>(new Set());
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastOpacity] = useState(new Animated.Value(0));

  const [shotModal, setShotModal] = useState<ShotModalState>({
    visible: false,
    points: null,
    step: "outcome",
    shooterId: null,
  });
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [isRivalModalVisible, setIsRivalModalVisible] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMessage(null));
  }, [toastOpacity]);

  const loadData = async () => {
    if (!team) return;
    setIsLoading(true);
    try {
      const [rosterRes, playersRes, localState] = await Promise.all([
        getGameRoster(gameId).catch(() => null),
        getPlayers(team.id),
        getGamePlayState(gameId),
      ]);

      let availablePlayers: Player[] = [];
      if (rosterRes && rosterRes.playerIds) {
        availablePlayers = playersRes.filter((p) => rosterRes.playerIds.includes(p.id));
      } else {
        availablePlayers = playersRes.filter((p) => p.isActive);
      }
      setRosterPlayers(availablePlayers);

      if (localState) {
        setMatchState(localState);
        if (localState.courtPlayerIds.length === 0 && availablePlayers.length > 0) {
          setIsModalVisible(true);
        }
      } else if (availablePlayers.length > 0) {
        setIsModalVisible(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [gameId, team]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const currentQ = matchState.quarter;
    const defaultT = currentQ === 5 ? 300 : 600;
    const currentT = matchState.timeRemainingByQuarter?.[currentQ] ?? defaultT;

    if (isTimerRunning && currentT > 0) {
      interval = setInterval(() => {
        setMatchState(prev => {
          const q = prev.quarter;
          const defaultT = q === 5 ? 300 : 600;
          const prevT = prev.timeRemainingByQuarter?.[q] ?? defaultT;
          const newTime = prevT - 1;
          const isDone = newTime <= 0;
          
          const newPlayerStats = { ...(prev.playerStats || {}) };
          prev.courtPlayerIds.forEach(playerId => {
            const stats = newPlayerStats[playerId] || {
              playerId, gameId: prev.gameId, minutes: 0,
              t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
              dreb: 0, oreb: 0, asis: 0, rec: 0, per: 0, falt: 0
            };
            newPlayerStats[playerId] = { ...stats, minutes: stats.minutes + 1000 };
          });

          if (isDone) {
            setIsTimerRunning(false);
            return { 
              ...prev, 
              timeRemainingByQuarter: { ...(prev.timeRemainingByQuarter || {}), [q]: 0 },
              playerStats: newPlayerStats 
            };
          }
          return { 
            ...prev, 
            timeRemainingByQuarter: { ...(prev.timeRemainingByQuarter || {}), [q]: newTime },
            playerStats: newPlayerStats 
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, matchState.quarter, matchState.timeRemainingByQuarter?.[matchState.quarter]]);

  useEffect(() => {
    if (!isTimerRunning) {
      updateState({ timeRemainingByQuarter: matchState.timeRemainingByQuarter });
    }
  }, [isTimerRunning]);

  const updateState = (updates: Partial<GamePlayState> | ((prev: GamePlayState) => Partial<GamePlayState>)) => {
    setMatchState(prev => {
      const resolvedUpdates = typeof updates === "function" ? updates(prev) : updates;
      const newState = { ...prev, ...resolvedUpdates };
      saveGamePlayState(newState).catch(console.error);
      return newState;
    });
  };

  const updatePlayerStat = (playerId: string, statKey: keyof PlayerStats, value: number, globalUpdates?: (prev: GamePlayState) => Partial<GamePlayState>) => {
    updateState(prev => {
      const stats = prev.playerStats?.[playerId] || {
        playerId,
        gameId: prev.gameId,
        minutes: 0,
        t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
        dreb: 0, oreb: 0, asis: 0, rec: 0, per: 0, falt: 0
      };

      const extras = globalUpdates ? globalUpdates(prev) : {};

      return {
        ...extras,
        playerStats: {
          ...(prev.playerStats || {}),
          [playerId]: { ...stats, [statKey]: (stats[statKey] as number) + value }
        }
      };
    });
  };

  const sortedRoster = useMemo(() => {
    return [...rosterPlayers].sort((a, b) => {
      const numA = parseInt(String(a.jerseyNumber), 10);
      const numB = parseInt(String(b.jerseyNumber), 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return String(a.jerseyNumber || "").localeCompare(String(b.jerseyNumber || ""));
    });
  }, [rosterPlayers]);

  const benchPlayers = useMemo(() => {
    return sortedRoster.filter((p) => !matchState.courtPlayerIds.includes(p.id));
  }, [sortedRoster, matchState.courtPlayerIds]);

  const courtPlayers = useMemo(() => {
    return matchState.courtPlayerIds
      .map(id => rosterPlayers.find(p => p.id === id))
      .filter(Boolean) as Player[];
  }, [rosterPlayers, matchState.courtPlayerIds]);

  const handlePlayerTap = (playerId: string, isBench: boolean) => {
    if (isSubMode) {
      if (isBench) {
        setSubsIn(prev => {
          const next = new Set(prev);
          if (next.has(playerId)) next.delete(playerId);
          else next.add(playerId);
          return next;
        });
      } else {
        setSubsOut(prev => {
          const next = new Set(prev);
          if (next.has(playerId)) next.delete(playerId);
          else next.add(playerId);
          return next;
        });
      }
      return;
    }

    if (!isBench) {
      setSelectedPlayerId(playerId === selectedPlayerId ? null : playerId);
    }
  };

  const handleShotBtn = (points: 1 | 2 | 3) => {
    if (!selectedPlayerId) return;
    setShotModal({ visible: true, points, step: "outcome", shooterId: selectedPlayerId });
  };

  const handleShotOutcome = (made: boolean) => {
    if (!shotModal.shooterId || !shotModal.points) return;
    const pts = shotModal.points;
    const sId = shotModal.shooterId;

    if (made) {
      updateState(prev => {
        const stats = prev.playerStats?.[sId] || {
          playerId: sId, gameId: prev.gameId, minutes: 0,
          t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
          dreb: 0, oreb: 0, asis: 0, rec: 0, per: 0, falt: 0
        };
        const updatedStats = { ...stats, [`t${pts}a`]: (stats[`t${pts}a` as keyof PlayerStats] as number) + 1, [`t${pts}i`]: (stats[`t${pts}i` as keyof PlayerStats] as number) + 1 };
        
        return {
          ...prev,
          teamScore: prev.teamScore + pts,
          quarterTeamScore: prev.quarterTeamScore + pts,
          playerStats: { ...(prev.playerStats || {}), [sId]: updatedStats }
        };
      });
      if (pts === 1) {
        setShotModal({ visible: false, points: null, step: "outcome", shooterId: null });
        setSelectedPlayerId(null);
      } else {
        setShotModal(prev => ({ ...prev, step: "assist" }));
      }
    } else {
      updatePlayerStat(sId, `t${pts}i` as keyof PlayerStats, 1);
      setShotModal({ visible: false, points: null, step: "outcome", shooterId: null });
      setSelectedPlayerId(null);
    }
  };

  const handleAssist = (assistPlayerId: string | null) => {
    if (assistPlayerId) {
      updatePlayerStat(assistPlayerId, "asis", 1);
    }
    setShotModal({ visible: false, points: null, step: "outcome", shooterId: null });
    setSelectedPlayerId(null);
  };

  const handleRivalScore = (points: number) => {
    updateState((prev) => ({
      rivalScore: prev.rivalScore + points,
      quarterRivalScore: prev.quarterRivalScore + points
    }));
    setIsRivalModalVisible(false);
  };

  const handleRivalFoul = () => {
    updateState((prev) => ({
      rivalFoulsByQuarter: {
        ...(prev.rivalFoulsByQuarter || {}),
        [prev.quarter]: ((prev.rivalFoulsByQuarter || {})[prev.quarter] || 0) + 1
      }
    }));
    setIsRivalModalVisible(false);
  };

  return {
    team,
    isLoading,
    rosterPlayers,
    sortedRoster,
    matchState,
    updateState,
    updatePlayerStat,
    benchPlayers,
    courtPlayers,
    isHelpModeActive,
    setIsHelpModeActive,
    activeHelpItem,
    setActiveHelpItem,
    isModalVisible,
    setIsModalVisible,
    selectedPlayerId,
    setSelectedPlayerId,
    isSubMode,
    setIsSubMode,
    subsOut,
    setSubsOut,
    subsIn,
    setSubsIn,
    tempStartingFive,
    setTempStartingFive,
    isTimerRunning,
    setIsTimerRunning,
    toastMessage,
    toastOpacity,
    showToast,
    shotModal,
    setShotModal,
    isStatsModalVisible,
    setIsStatsModalVisible,
    isRivalModalVisible,
    setIsRivalModalVisible,
    handlePlayerTap,
    handleShotBtn,
    handleShotOutcome,
    handleAssist,
    handleRivalScore,
    handleRivalFoul,
  };
};
