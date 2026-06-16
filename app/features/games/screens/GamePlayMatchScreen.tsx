import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Modal, ActivityIndicator, DimensionValue, Animated, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppRoutes, AppStackParamList } from "../../../navigation/types";
import { useTeamStore } from "../../teams";
import { getGameRoster } from "../api/gameApi";
import { getPlayers } from "../../players/api/playersApi";
import { Player, PlayerStats } from "../../players/types";
import { GamePlayState, getGamePlayState, saveGamePlayState } from "../utils/gameStorage";
import { gamePlayMatchStyles as styles } from "../css/styles";
import { Ionicons } from "@expo/vector-icons";
import HalfCourt from "../../exercises/assets/HalfCourt";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { useNavigationStore } from "../../../shared/hooks/useNavigationStore";

type GamePlayMatchProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.GamePlayMatch
>;

const COURT_POSITIONS: { x: DimensionValue; y: DimensionValue }[] = [
  { x: "50%", y: "85%" }, // Base (top center of 3pt)
  { x: "86%", y: "56%" }, // Escolta (right wing)
  { x: "14%", y: "56%" }, // Alero (left wing)
  { x: "88%", y: "20%" }, // Ala-pívot (right corner)
  { x: "12%", y: "20%" }, // Pívot (left corner)
];

const INITIAL_STATE: GamePlayState = {
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

const HELP_DATA: Record<string, { title: string; description: string }> = {
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

type ShotModalState = {
  visible: boolean;
  points: 1 | 2 | 3 | null;
  step: "outcome" | "assist";
  shooterId: string | null;
};

export const GamePlayMatchScreen = ({ route }: GamePlayMatchProps) => {
  const { gameId } = route.params;
  const team = useTeamStore((state) => state.team);
  const teamName = team?.name || "Equipo";
  const { goBack } = useAppNavigation();
  const setNavVisible = useNavigationStore((state) => state.setNavVisible);

  const [isLoading, setIsLoading] = useState(true);
  const [rosterPlayers, setRosterPlayers] = useState<Player[]>([]);
  const [matchState, setMatchState] = useState<GamePlayState>({ ...INITIAL_STATE, gameId });

  const [isHelpModeActive, setIsHelpModeActive] = useState(false);
  const [activeHelpItem, setActiveHelpItem] = useState<{title: string, description: string} | null>(null);

  // UI States
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

  useFocusEffect(
    useCallback(() => {
      setNavVisible(false);
      return () => setNavVisible(true);
    }, [])
  );

  useEffect(() => {
    loadData();
  }, [gameId]);

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

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  const FoulIndicator = ({ fouls }: { fouls: number }) => (
    <View style={{ flexDirection: "row", gap: 4, marginTop: 8, justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View 
          key={i} 
          style={{ 
            width: 10, 
            height: 10, 
            borderRadius: 5, 
            backgroundColor: i <= fouls ? (i === 5 ? "#EF4444" : "#F59E0B") : "#374151" 
          }} 
        />
      ))}
    </View>
  );

  const getTeamFouls = () => {
    const q = matchState.quarter;
    if (q === 5) return ((matchState.teamFoulsByQuarter || {})[4] || 0) + ((matchState.teamFoulsByQuarter || {})[5] || 0);
    return (matchState.teamFoulsByQuarter || {})[q] || 0;
  };

  const getRivalFouls = () => {
    const q = matchState.quarter;
    if (q === 5) return ((matchState.rivalFoulsByQuarter || {})[4] || 0) + ((matchState.rivalFoulsByQuarter || {})[5] || 0);
    return (matchState.rivalFoulsByQuarter || {})[q] || 0;
  };

  const HelpWrapper = ({ children, helpKey, style }: { children: React.ReactNode, helpKey: keyof typeof HELP_DATA, style?: any }) => (
    <View style={[{ position: "relative" }, style]}>
      {children}
      {isHelpModeActive && (
        <Pressable
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderRadius: 8,
            justifyContent: "center", alignItems: "center", zIndex: 100
          }}
          onPress={() => setActiveHelpItem(HELP_DATA[helpKey])}
        >
          <Ionicons name="information-circle" size={32} color="#3B82F6" />
        </Pressable>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
      <View style={styles.container}>
        {/* Floating Help Button */}
        <Pressable 
          style={{
            position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 16,
            backgroundColor: isHelpModeActive ? "#EF4444" : "rgba(31, 41, 55, 0.7)",
            borderWidth: 1, borderColor: isHelpModeActive ? "#DC2626" : "#3B82F6",
            justifyContent: "center", alignItems: "center", zIndex: 200,
          }}
          onPress={() => setIsHelpModeActive(!isHelpModeActive)}
        >
          <Ionicons name={isHelpModeActive ? "close" : "information"} size={18} color={isHelpModeActive ? "#FFF" : "#3B82F6"} />
        </Pressable>

        <View style={styles.header}>
          <View style={[styles.headerLeft, { position: "relative", justifyContent: "center", alignItems: "center" }]}>
            <Pressable onPress={() => goBack()} style={{ position: "absolute", top: -4, left: -4, padding: 8, zIndex: 10 }}>
              <Ionicons name="arrow-back" size={24} color="#F9FAFB" />
            </Pressable>
            <Text style={[styles.teamName, { textAlign: "center" }]}>{teamName}</Text>
            <View style={{ position: "absolute", bottom: -4 }}>
              <FoulIndicator fouls={getTeamFouls()} />
            </View>
          </View>

          <View style={styles.headerCenterCol}>
            <Text style={styles.score}>{matchState.teamScore} - {matchState.rivalScore}</Text>
            <Text style={styles.quarterScoreText}>
              {matchState.quarterTeamScore} {matchState.quarter === 5 ? "EX" : `Q${matchState.quarter}`} {matchState.quarterRivalScore}
            </Text>
            <HelpWrapper helpKey="timer">
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                <Pressable 
                  onPress={() => setIsTimerRunning(!isTimerRunning)}
                  onLongPress={() => {
                    if (matchState.quarter === 5 && Platform.OS !== 'web') {
                      setIsTimerRunning(false);
                      updateState(prev => ({
                        timeRemainingByQuarter: { ...(prev.timeRemainingByQuarter || {}), 5: 300 }
                      }));
                      showToast("Cronómetro de Prórroga reiniciado");
                    }
                  }}
                  delayLongPress={800}
                >
                  <Text style={[styles.timeText, isTimerRunning && { color: "#10B981" }]}>
                    {formatTime(matchState.timeRemainingByQuarter?.[matchState.quarter] ?? (matchState.quarter === 5 ? 300 : 600))}
                  </Text>
                </Pressable>
                {matchState.quarter === 5 && Platform.OS === 'web' && (
                  <Pressable
                    onPress={() => {
                      setIsTimerRunning(false);
                      updateState(prev => ({
                        timeRemainingByQuarter: { ...(prev.timeRemainingByQuarter || {}), 5: 300 }
                      }));
                      showToast("Cronómetro de Prórroga reiniciado");
                    }}
                    style={{ padding: 6, backgroundColor: "#374151", borderRadius: 16 }}
                  >
                    <Ionicons name="refresh" size={18} color="#D1D5DB" />
                  </Pressable>
                )}
              </View>
            </HelpWrapper>
          </View>

          <HelpWrapper helpKey="rival" style={styles.headerRight}>
            <Pressable style={[{ flex: 1, position: "relative", justifyContent: "center", alignItems: "center" }]} onPress={() => setIsRivalModalVisible(true)}>
              <Text style={[styles.rivalName, { textAlign: "center" }]}>Rival</Text>
              <View style={{ position: "absolute", bottom: -4 }}>
                <FoulIndicator fouls={getRivalFouls()} />
              </View>
            </Pressable>
          </HelpWrapper>
        </View>

        <View style={styles.benchContainer}>
          <HelpWrapper helpKey="quarters">
            <View style={styles.quartersRow}>
              {[1, 2, 3, 4, 5].map(q => (
                <Pressable
                  key={q}
                  onPress={() => {
                    setIsTimerRunning(false);
                    updateState({ quarter: q, quarterTeamScore: 0, quarterRivalScore: 0 });
                  }}
                  style={[styles.quarterButton, matchState.quarter === q && styles.quarterButtonActive]}
                >
                  <Text style={[styles.quarterButtonText, matchState.quarter === q && styles.quarterButtonTextActive]}>{q === 5 ? "EX" : `Q${q}`}</Text>
                </Pressable>
              ))}
            </View>
          </HelpWrapper>

          <View style={styles.actionButtonsRow}>
            {isSubMode ? (
              <Pressable
                style={[styles.subButton, { backgroundColor: "#6B7280", flex: 1 }]}
                onPress={() => {
                  setIsSubMode(false);
                  setSubsIn(new Set());
                  setSubsOut(new Set());
                }}
              >
                <Text style={styles.subButtonText}>Cancelar</Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  style={[styles.subButton, { backgroundColor: "#3B82F6", flex: 1 }]}
                  onPress={() => {
                    setTempStartingFive(new Set(matchState.courtPlayerIds));
                    setIsModalVisible(true);
                  }}
                >
                  <Text style={styles.subButtonText}>Quintetos</Text>
                </Pressable>

                <Pressable
                  style={[styles.subButton, { backgroundColor: "#F59E0B", flex: 1 }, !selectedPlayerId && { opacity: 0.5 }]}
                  disabled={!selectedPlayerId}
                  onPress={() => setIsStatsModalVisible(true)}
                >
                  <Text style={styles.subButtonText}>Ver Stats</Text>
                </Pressable>
              </>
            )}

            <Pressable
              style={[styles.subButton, isSubMode ? { backgroundColor: "#10B981", flex: 1 } : { flex: 1 }]}
              onPress={() => {
                if (isSubMode) {
                  if (subsIn.size === 0 && subsOut.size === 0) {
                    setIsSubMode(false);
                    return;
                  }
                  if (subsIn.size !== subsOut.size) {
                    showToast(`Has seleccionado ${subsOut.size} para salir y ${subsIn.size} para entrar.`);
                    return;
                  }
                  const newCourt = [...matchState.courtPlayerIds];
                  const inArray = Array.from(subsIn);
                  let inIndex = 0;
                  for (let i = 0; i < newCourt.length; i++) {
                    if (subsOut.has(newCourt[i])) {
                      newCourt[i] = inArray[inIndex];
                      inIndex++;
                    }
                  }
                  updateState({ courtPlayerIds: newCourt });
                  setSubsIn(new Set());
                  setSubsOut(new Set());
                  setIsSubMode(false);
                } else {
                  setIsSubMode(true);
                  setSelectedPlayerId(null);
                  setSubsIn(new Set());
                  setSubsOut(new Set());
                }
              }}
            >
              <Text style={styles.subButtonText}>{isSubMode ? "Aplicar" : "Cambios"}</Text>
            </Pressable>
          </View>

          <HelpWrapper helpKey="bench">
            <View style={styles.benchPlayersRow}>
              {benchPlayers.map((p) => {
                const isSelected = isSubMode ? subsIn.has(p.id) : false;
                return (
                  <Pressable
                    key={p.id}
                    style={[styles.jerseyToken, isSelected && styles.jerseyTokenSelected]}
                    onPress={() => handlePlayerTap(p.id, true)}
                  >
                    <Ionicons name="shirt" size={36} color={isSelected ? "#3B82F6" : "#4B5563"} />
                    <Text style={styles.jerseyNumber}>{p.jerseyNumber}</Text>
                  </Pressable>
                );
              })}
            </View>
          </HelpWrapper>
        </View>

        <HelpWrapper helpKey="court_player" style={{ flex: 1 }}>
          <View style={styles.courtContainer}>
            <View style={{ width: "100%", aspectRatio: 384 / 300, position: "absolute", top: 0 }}>
              <HalfCourt />
              {courtPlayers.map((p, index) => {
                const pos = COURT_POSITIONS[index] || { x: "50%", y: "50%" };
                const isSelected = isSubMode ? subsOut.has(p.id) : selectedPlayerId === p.id;
                return (
                  <Pressable
                    key={p.id}
                    style={[styles.playerToken, { left: pos.x, top: pos.y, transform: [{ translateX: -25 }, { translateY: -25 }] }]}
                    onPress={() => handlePlayerTap(p.id, false)}
                  >
                    <Ionicons name="shirt" size={48} color={isSelected ? "#2563EB" : "#1F2937"} />
                    <Text style={styles.playerTokenText}>{p.jerseyNumber}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </HelpWrapper>

        <HelpWrapper helpKey="stats_toolbar">
          <View style={styles.toolbar}>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonPoint, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => handleShotBtn(1)}>
              <Text style={styles.toolButtonText}>+1 TL</Text>
            </Pressable>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonPoint, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => handleShotBtn(2)}>
              <Text style={styles.toolButtonText}>+2 PT</Text>
            </Pressable>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonPoint, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => handleShotBtn(3)}>
              <Text style={styles.toolButtonText}>+3 PT</Text>
            </Pressable>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "oreb", 1); setSelectedPlayerId(null); }}>
              <Text style={styles.toolButtonText}>Reb Of</Text>
            </Pressable>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "dreb", 1); setSelectedPlayerId(null); }}>
              <Text style={styles.toolButtonText}>Reb Def</Text>
            </Pressable>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "asis", 1); setSelectedPlayerId(null); }}>
              <Text style={styles.toolButtonText}>Ast</Text>
            </Pressable>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "rec", 1); setSelectedPlayerId(null); }}>
              <Text style={styles.toolButtonText}>Robo</Text>
            </Pressable>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonMiss, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { updatePlayerStat(selectedPlayerId!, "per", 1); setSelectedPlayerId(null); }}>
              <Text style={styles.toolButtonText}>Pérdida</Text>
            </Pressable>
            <Pressable disabled={!selectedPlayerId} style={[styles.toolButton, styles.toolButtonMiss, !selectedPlayerId && styles.statButtonDisabled]} onPress={() => { 
              updatePlayerStat(selectedPlayerId!, "falt", 1, prev => ({
                teamFoulsByQuarter: {
                  ...(prev.teamFoulsByQuarter || {}),
                  [prev.quarter]: ((prev.teamFoulsByQuarter || {})[prev.quarter] || 0) + 1
                }
              })); 
              setSelectedPlayerId(null); 
            }}>
              <Text style={styles.toolButtonText}>Falta</Text>
            </Pressable>
          </View>
        </HelpWrapper>

        {toastMessage && (
          <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
            <Ionicons name="alert-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </Animated.View>
        )}

        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Quinteto Inicial</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24 }}>
                {sortedRoster.map(p => {
                  const isSelected = tempStartingFive.has(p.id);
                  return (
                    <Pressable
                      key={p.id}
                      style={[styles.jerseyToken, isSelected && styles.jerseyTokenSelected]}
                      onPress={() => {
                        const next = new Set(tempStartingFive);
                        if (isSelected) next.delete(p.id);
                        else if (next.size < 5) next.add(p.id);
                        setTempStartingFive(next);
                      }}
                    >
                      <Ionicons name="shirt" size={48} color={isSelected ? "#3B82F6" : "#4B5563"} />
                      <Text style={[styles.jerseyNumber, { fontSize: 16 }]}>{p.jerseyNumber}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalButtonCancel} onPress={() => setIsModalVisible(false)}><Text style={styles.modalButtonCancelText}>Cancelar</Text></Pressable>
                <Pressable style={[styles.modalButtonConfirm, tempStartingFive.size !== 5 && { opacity: 0.5 }]} disabled={tempStartingFive.size !== 5} onPress={() => { updateState({ courtPlayerIds: Array.from(tempStartingFive) }); setIsModalVisible(false); }}><Text style={styles.modalButtonConfirmText}>Guardar</Text></Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={shotModal.visible} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {shotModal.step === "outcome" ? (
                <>
                  <Text style={styles.modalTitle}>Tiro de {shotModal.points} PT</Text>
                  <View style={{ flexDirection: "row", gap: 12, justifyContent: "center" }}>
                    <Pressable style={[styles.modalButtonCancel, { flex: 1, backgroundColor: "#DC2626" }]} onPress={() => handleShotOutcome(false)}><Text style={styles.modalButtonCancelText}>Fallo</Text></Pressable>
                    <Pressable style={[styles.modalButtonConfirm, { flex: 1, backgroundColor: "#10B981" }]} onPress={() => handleShotOutcome(true)}><Text style={styles.modalButtonConfirmText}>Acierto</Text></Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.modalTitle}>¿Asistencia?</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 24 }}>
                    {courtPlayers.filter(p => p.id !== shotModal.shooterId).map(p => (
                      <Pressable key={p.id} style={[styles.jerseyToken, { backgroundColor: "#374151", borderRadius: 8 }]} onPress={() => handleAssist(p.id)}>
                        <Ionicons name="person" size={24} color="#9CA3AF" />
                        <Text style={[styles.jerseyNumber, { fontSize: 12 }]}>#{p.jerseyNumber}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <Pressable style={styles.modalButtonCancel} onPress={() => handleAssist(null)}><Text style={styles.modalButtonCancelText}>Sin Asistencia</Text></Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>

        <Modal visible={isStatsModalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { width: "95%", maxWidth: 400 }]}>
              {selectedPlayerId && (() => {
                const st = matchState.playerStats[selectedPlayerId] || { minutes: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, dreb: 0, oreb: 0, asis: 0, rec: 0, per: 0, falt: 0 };
                const points = (st.t1a * 1) + (st.t2a * 2) + (st.t3a * 3);
                const formatMin = (ms: number) => { const totalSecs = Math.floor(ms / 1000); return `${Math.floor(totalSecs / 60)}:${(totalSecs % 60).toString().padStart(2, '0')}`; };
                return (
                  <>
                    <View style={styles.statsHeader}><Text style={styles.statsPlayerName}>Estadísticas</Text></View>
                    <View style={styles.statsCenterRow}>
                      <View style={styles.statsCenterBox}><Text style={styles.statsCenterLabel}>Minutos</Text><Text style={styles.statsCenterValue}>{formatMin(st.minutes)}</Text></View>
                      <View style={styles.statsCenterBox}><Text style={styles.statsCenterLabel}>Puntos</Text><Text style={styles.statsCenterValue}>{points}</Text></View>
                    </View>
                    <Pressable style={styles.modalButtonCancel} onPress={() => setIsStatsModalVisible(false)}><Text style={styles.modalButtonCancelText}>Cerrar</Text></Pressable>
                  </>
                );
              })()}
            </View>
          </View>
        </Modal>

        <Modal visible={isRivalModalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Puntos del Rival</Text>
              <View style={{ flexDirection: "row", gap: 12, justifyContent: "center", marginBottom: 16 }}>
                <Pressable style={[styles.modalButtonConfirm, { flex: 1, backgroundColor: "#10B981" }]} onPress={() => handleRivalScore(1)}><Text style={styles.modalButtonConfirmText}>+1 TL</Text></Pressable>
                <Pressable style={[styles.modalButtonConfirm, { flex: 1, backgroundColor: "#10B981" }]} onPress={() => handleRivalScore(2)}><Text style={styles.modalButtonConfirmText}>+2 PT</Text></Pressable>
                <Pressable style={[styles.modalButtonConfirm, { flex: 1, backgroundColor: "#10B981" }]} onPress={() => handleRivalScore(3)}><Text style={styles.modalButtonConfirmText}>+3 PT</Text></Pressable>
              </View>
              <Pressable style={[styles.modalButtonConfirm, { backgroundColor: "#EF4444", marginBottom: 16 }]} onPress={() => handleRivalFoul()}><Text style={styles.modalButtonConfirmText}>+1 Falta</Text></Pressable>
              <Pressable style={styles.modalButtonCancel} onPress={() => setIsRivalModalVisible(false)}><Text style={styles.modalButtonCancelText}>Cancelar</Text></Pressable>
            </View>
          </View>
        </Modal>

        <Modal visible={!!activeHelpItem} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 24 }}>
            <View style={{ backgroundColor: "#1F2937", borderRadius: 16, padding: 24 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 }}>
                <Ionicons name="information-circle" size={28} color="#3B82F6" />
                <Text style={{ color: "#F9FAFB", fontSize: 20, fontWeight: "bold" }}>{activeHelpItem?.title}</Text>
              </View>
              <Text style={{ color: "#D1D5DB", fontSize: 16, lineHeight: 24, marginBottom: 24 }}>{activeHelpItem?.description}</Text>
              <Pressable style={{ backgroundColor: "#2563EB", padding: 14, borderRadius: 8, alignItems: "center" }} onPress={() => setActiveHelpItem(null)}>
                <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>Entendido</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
