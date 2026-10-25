import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Alert, AppState, AppStateStatus, TouchableOpacity } from "react-native";
import { usePlayMatchStore, resetPlayMatchStore } from "./store/usePlayMatchStore";
import { useMenuStore } from "../../store/MenuStore";
import { TimeScoreFoulsController } from "./components/TimeScoreFoulsController";
import { TeamManagementCanvas } from "./components/TeamManagementCanvas";
import { RivalPanelControl } from "./components/RivalPanelControl";
import { StartingFiveModal } from "./components/StartingFiveModal";
import { PeriodSelectModal } from "./components/PeriodSelectModal";
import { ManualTimeModal } from "./components/ManualTimeModal";
import { QuickAssignPlayerModal } from "./components/QuickAssignPlayerModal";
import { PlayerStatsModal } from "./components/PlayerStatsModal";
import { PlayerStatSubtractionModal } from "./components/PlayerStatSubtractionModal";
import { BenchPlayerStatsModal } from "./components/BenchPlayerStatsModal";
import { useClubStore } from "../../store/ClubStore";
import { InGamePlayer, PlayMatchProps } from "./types";
import { useDB } from "../../hooks/useDB";
import { db, games, playerStats, teams } from "../../db";
import { eq } from "drizzle-orm";
import { buildMatchRoster } from "./utils/roster";
import { useNotificationStore } from "../notifications/store/useNotificationStore";
import { matchCacheService } from "./services/matchCacheService";

export { buildMatchRoster };

export const PlayMatch: React.FC<PlayMatchProps> = ({
  match,
  onFinishMatch,
  onReturn,
}) => {
  const { PlayerController } = useDB();

  // Global State Store
  const store = usePlayMatchStore();
  const {
    activePeriod,
    periods,
    isTimerRunning,
    players,
    swap,
    initMatch,
    setStartingFive,
    assignBenchPlayerToPosition,
    toggleTimer,
    setPeriodTime,
    nextPeriod,
    setPeriod,
    resetExtraTimeCrono,
    recordPlayerStat,
    subtractPlayerStat,
    adjustRivalScore,
    adjustRivalFouls,
    toggleSwapMode,
    selectSwapCourtPlayer,
    selectSwapBenchPlayer,
    confirmSwap,
    cancelSwap,
    increaseTimeout,
    decreaseTimeout,
    getTotalTeamScore,
    getTotalRivalScore,
    getActiveCourtPlayers,
    getBenchPlayers,
    getAvailableTimeouts,
  } = store;

  // Header State Integration
  const setHeaderAction = useMenuStore((state) => state.setHeaderAction);
  const setHeaderBackAction = useMenuStore((state) => state.setHeaderBackAction);
  const setMatchHeaderInfo = useMenuStore((state) => state.setMatchHeaderInfo);
  const setHeaderTitle = useMenuStore((state) => state.setHeaderTitle);

  // Local Modal Visibility States & Team Name
  const initialClubName = useClubStore.getState().club?.name || "Local";
  const [teamName, setTeamName] = useState<string>(initialClubName);
  const [isStartingFiveModalOpen, setIsStartingFiveModalOpen] = useState(false);
  const [isPeriodSelectModalOpen, setIsPeriodSelectModalOpen] = useState(false);
  const [isManualTimeModalOpen, setIsManualTimeModalOpen] = useState(false);
  const [quickAssignSlotIndex, setQuickAssignSlotIndex] = useState<number | null>(null);
  const [activePlayerForStats, setActivePlayerForStats] = useState<InGamePlayer | null>(null);
  const [activePlayerForSubtraction, setActivePlayerForSubtraction] = useState<InGamePlayer | null>(null);
  const [activeBenchPlayerForStats, setActiveBenchPlayerForStats] = useState<InGamePlayer | null>(null);

  // Finish Match & Persist to SQLite
  const handleFinishMatch = useCallback(() => {
    Alert.alert(
      "Finalizar Partido",
      "¿Estás seguro de que deseas finalizar y guardar el partido?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
          style: "destructive",
          onPress: async () => {
            try {
              const currentPeriods = usePlayMatchStore.getState().periods;
              const currentPlayers = usePlayMatchStore.getState().players;

              // Update Game Record
              await db
                .update(games)
                .set({
                  status: "finished",
                  resultC1: currentPeriods.q1.teamScore,
                  resultC2: currentPeriods.q2.teamScore,
                  resultC3: currentPeriods.q3.teamScore,
                  resultC4: currentPeriods.q4.teamScore,
                  resultExtra: currentPeriods.extra.teamScore,
                  resultC1Opponent: currentPeriods.q1.rivalScore,
                  resultC2Opponent: currentPeriods.q2.rivalScore,
                  resultC3Opponent: currentPeriods.q3.rivalScore,
                  resultC4Opponent: currentPeriods.q4.rivalScore,
                  resultExtraOpponent: currentPeriods.extra.rivalScore,
                  foulsC1: currentPeriods.q1.teamFouls,
                  foulsC2: currentPeriods.q2.teamFouls,
                  foulsC3: currentPeriods.q3.teamFouls,
                  foulsC4: currentPeriods.q4.teamFouls,
                  foulsExtra: currentPeriods.extra.teamFouls,
                  foulsC1Opponent: currentPeriods.q1.rivalFouls,
                  foulsC2Opponent: currentPeriods.q2.rivalFouls,
                  foulsC3Opponent: currentPeriods.q3.rivalFouls,
                  foulsC4Opponent: currentPeriods.q4.rivalFouls,
                  foulsExtraOpponent: currentPeriods.extra.rivalFouls,
                })
                .where(eq(games.id, match.id));

              // Save Player Stats
              for (const p of currentPlayers) {
                const existing = await db
                  .select()
                  .from(playerStats)
                  .where(eq(playerStats.gameId, match.id));

                const pStat = existing.find((s) => s.playerId === p.id);
                if (pStat) {
                  await db
                    .update(playerStats)
                    .set({
                      minutes: Math.round(p.secondsPlayed / 60),
                      t1a: p.t1a,
                      t1i: p.t1i,
                      t2a: p.t2a,
                      t2i: p.t2i,
                      t3a: p.t3a,
                      t3i: p.t3i,
                      oreb: p.oreb,
                      dreb: p.dreb,
                      asis: p.asis,
                      rec: p.rec,
                      per: p.per,
                      falt: p.falt,
                      valuation: p.valuation,
                    })
                    .where(eq(playerStats.id, pStat.id));
                } else {
                  await db.insert(playerStats).values({
                    gameId: match.id,
                    playerId: p.id,
                    minutes: Math.round(p.secondsPlayed / 60),
                    t1a: p.t1a,
                    t1i: p.t1i,
                    t2a: p.t2a,
                    t2i: p.t2i,
                    t3a: p.t3a,
                    t3i: p.t3i,
                    oreb: p.oreb,
                    dreb: p.dreb,
                    asis: p.asis,
                    rec: p.rec,
                    per: p.per,
                    falt: p.falt,
                    valuation: p.valuation,
                  });
                }
              }

              // Purge temporary cache upon match finalization (US3)
              await matchCacheService.purgeSession(match.id);

              onFinishMatch();
            } catch (err) {
              console.error("Failed to finish match:", err);
            }
          },
        },
      ]
    );
  }, [match.id, onFinishMatch]);


  const teamTotalScore = getTotalTeamScore();
  const rivalTotalScore = getTotalRivalScore();
  const rivalName = match.opponent || "Rival";
  const formattedMatchTitle = `${teamName} ${teamTotalScore} - ${rivalTotalScore} ${rivalName}`;

  // Hook Header Actions (Go Back Arrow & Save Icon)
  useEffect(() => {
    setHeaderBackAction({
      label: "Volver",
      iconName: "arrow-left",
      iconFamily: "Feather",
      onPress: onReturn,
      testID: "header-back-button",
    });

    setHeaderAction({
      label: "Finalizar",
      iconName: "save",
      iconFamily: "Feather",
      onPress: handleFinishMatch,
      testID: "header-action-button",
    });
  }, [onReturn, handleFinishMatch, setHeaderBackAction, setHeaderAction]);

  // Update Application Header Live Match Score & Teams
  useEffect(() => {
    setMatchHeaderInfo({
      teamName,
      teamScore: teamTotalScore,
      rivalScore: rivalTotalScore,
      rivalName,
    });
    setHeaderTitle(formattedMatchTitle);
  }, [teamName, rivalName, teamTotalScore, rivalTotalScore, formattedMatchTitle, setMatchHeaderInfo, setHeaderTitle]);

  // Clean up header state only on component unmount
  useEffect(() => {
    return () => {
      setMatchHeaderInfo(null);
      setHeaderTitle("Partidos");
      setHeaderAction(null);
      setHeaderBackAction(null);
      useNotificationStore.getState().setMatchActive(false);
    };
  }, [setMatchHeaderInfo, setHeaderTitle, setHeaderAction, setHeaderBackAction]);

  // Initialize Match and Players from DB or Cache on mount (US2)
  useEffect(() => {
    const loadMatchData = async () => {
      try {
        // Fetch team name
        const foundTeams = await db
          .select()
          .from(teams)
          .where(eq(teams.id, match.teamId));
        if (foundTeams.length > 0 && foundTeams[0].name) {
          setTeamName(foundTeams[0].name);
        }

        const teamPlayers = await PlayerController.getAll(match.teamId);
        const existingStats = await db
          .select()
          .from(playerStats)
          .where(eq(playerStats.gameId, match.id));

        const initFreshRoster = () => {
          const roster = buildMatchRoster(teamPlayers, existingStats);
          initMatch(match.id, roster);
          if (roster.length >= 5) {
            setIsStartingFiveModalOpen(true);
          }
        };

        // Check for cached match session
        const cachedSession = await matchCacheService.loadSession(match.id);
        if (cachedSession) {
          if (matchCacheService.isCacheStale(cachedSession)) {
            Alert.alert(
              "Sesión anterior encontrada",
              "Se ha encontrado una sesión guardada de este partido de hace más de 48 horas. ¿Deseas reanudarla o comenzar un partido nuevo?",
              [
                {
                  text: "Comenzar nuevo",
                  style: "destructive",
                  onPress: async () => {
                    await matchCacheService.purgeSession(match.id);
                    initFreshRoster();
                  },
                },
                {
                  text: "Reanudar",
                  onPress: () => {
                    usePlayMatchStore.getState().hydrateFromCache(cachedSession);
                  },
                },
              ]
            );
            return;
          }

          // Valid fresh cached session - rehydrate directly
          usePlayMatchStore.getState().hydrateFromCache(cachedSession);

          const courtPlayersCount = cachedSession.players.filter((p) => p.isOnCourt).length;
          if (courtPlayersCount < 5 && cachedSession.players.length >= 5) {
            setIsStartingFiveModalOpen(true);
          }
          return;
        }

        initFreshRoster();
      } catch (err) {
        console.error("Failed to load match roster:", err);
      }
    };

    loadMatchData();
  }, [match.id, match.teamId]);

  // Silent Background Persistence & AppState flush (US1)
  useEffect(() => {
    if (!match?.id) return;

    const unsubscribe = usePlayMatchStore.subscribe((state) => {
      if (state.matchId === match.id && state.matchId > 0) {
        const snapshot = state.exportSnapshot();
        matchCacheService.saveSession(snapshot, false);
      }
    });

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        matchCacheService.flushPendingWrite();
      }
    };

    const appStateSubscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      unsubscribe();
      appStateSubscription.remove();
      matchCacheService.flushPendingWrite();
    };
  }, [match?.id]);

  // Real-time Chronometer Interval
  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (isTimerRunning) {
      if (match.status === "pending" || !match.status) {
        db.update(games)
          .set({ status: "inProgress" })
          .where(eq(games.id, match.id))
          .catch((err) => console.error("Failed to update match status to inProgress:", err));
      }

      timerRef.current = setInterval(() => {
        usePlayMatchStore.getState().tickTimer(1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerRunning, match.id, match.status]);

  // Handle Court Position Tap (1-tap opens stats modal or quick assign)
  const handleSelectCourtPosition = (positionIndex: number, player: InGamePlayer | null) => {
    const isSwap = swap.isSwapMode || usePlayMatchStore.getState().swap.isSwapMode;
    if (isSwap) {
      if (player) {
        selectSwapCourtPlayer(player.id);
      }
      return;
    }

    if (!player) {
      // Empty position slot -> open quick bench assigner
      setQuickAssignSlotIndex(positionIndex);
    } else {
      // Active player -> open stats modal
      setActivePlayerForStats(player);
    }
  };

  // Handle Court Position Long-Press (2-second hold triggers stat subtraction)
  const handleLongPressCourtPosition = (positionIndex: number, player: InGamePlayer) => {
    const isSwap = swap.isSwapMode || usePlayMatchStore.getState().swap.isSwapMode;
    if (isSwap) return;
    setActivePlayerForSubtraction(player);
  };

  // Handle Bench Player Tap
  const handleSelectBenchPlayer = (player: InGamePlayer) => {
    const isSwap = swap.isSwapMode || usePlayMatchStore.getState().swap.isSwapMode;
    if (isSwap) {
      selectSwapBenchPlayer(player.id);
    } else {
      setActiveBenchPlayerForStats(player);
    }
  };

  // Confirm Starting Five
  const handleConfirmStartingFive = (selectedIds: number[]) => {
    setStartingFive(selectedIds);
    setIsStartingFiveModalOpen(false);
  };

  const courtPlayers = getActiveCourtPlayers();
  const benchPlayers = getBenchPlayers();
  const courtTeammates = courtPlayers.filter((p): p is InGamePlayer => p !== null);

  return (
    <View className="flex-1 bg-canvas">
      {/* Component 1: Time, Score and Fouls Controller */}
      <TimeScoreFoulsController
        activePeriod={activePeriod}
        periodData={periods[activePeriod]}
        totalTeamScore={getTotalTeamScore()}
        totalRivalScore={getTotalRivalScore()}
        isTimerRunning={isTimerRunning}
        onNextPeriod={nextPeriod}
        onOpenPeriodSelectModal={() => setIsPeriodSelectModalOpen(true)}
        onToggleTimer={toggleTimer}
        onOpenManualTimeModal={() => setIsManualTimeModalOpen(true)}
        onResetExtraTimeCrono={resetExtraTimeCrono}
      />

      {/* Component 2: Team Management & Court Canvas */}
      <TeamManagementCanvas
        courtPlayers={courtPlayers}
        benchPlayers={benchPlayers}
        isSwapMode={swap.isSwapMode}
        isTimerRunning={isTimerRunning}
        selectedCourtPlayerIds={swap.selectedCourtPlayerIds}
        selectedBenchPlayerIds={swap.selectedBenchPlayerIds}
        availableTimeouts={getAvailableTimeouts()}
        onSelectCourtPosition={handleSelectCourtPosition}
        onLongPressCourtPosition={handleLongPressCourtPosition}
        onSelectBenchPlayer={handleSelectBenchPlayer}
        onToggleSwapMode={toggleSwapMode}
        onConfirmSwap={confirmSwap}
        onCancelSwap={cancelSwap}
        onIncreaseTimeout={increaseTimeout}
        onDecreaseTimeout={decreaseTimeout}
      />

      {/* Component 3: Rival Panel Control (Full width, no redundant total score) */}
      <RivalPanelControl
        activePeriod={activePeriod}
        rivalPeriodScore={periods[activePeriod].rivalScore}
        rivalPeriodFouls={periods[activePeriod].rivalFouls}
        onAdjustRivalScore={adjustRivalScore}
        onAdjustRivalFouls={adjustRivalFouls}
      />

      {/* Modals */}
      <StartingFiveModal
        visible={isStartingFiveModalOpen}
        roster={players}
        onConfirmStartingFive={handleConfirmStartingFive}
      />

      <PeriodSelectModal
        visible={isPeriodSelectModalOpen}
        currentPeriod={activePeriod}
        onSelectPeriod={setPeriod}
        onClose={() => setIsPeriodSelectModalOpen(false)}
      />

      <ManualTimeModal
        visible={isManualTimeModalOpen}
        currentSeconds={periods[activePeriod].remainingSeconds}
        periodKey={activePeriod}
        onSaveTime={(secs) => setPeriodTime(activePeriod, secs)}
        onClose={() => setIsManualTimeModalOpen(false)}
      />

      <QuickAssignPlayerModal
        visible={quickAssignSlotIndex !== null}
        positionIndex={quickAssignSlotIndex ?? 0}
        availableBenchPlayers={benchPlayers}
        onAssignPlayer={(pId, posIdx) => assignBenchPlayerToPosition(pId, posIdx)}
        onClose={() => setQuickAssignSlotIndex(null)}
      />

      <PlayerStatsModal
        visible={activePlayerForStats !== null}
        player={activePlayerForStats}
        courtTeammates={courtTeammates}
        onClose={() => setActivePlayerForStats(null)}
        onRecordStat={(pId, statType, assistId) => {
          recordPlayerStat(pId, statType, assistId);
          setActivePlayerForStats(null);
        }}
      />

      <PlayerStatSubtractionModal
        visible={activePlayerForSubtraction !== null}
        player={activePlayerForSubtraction}
        onClose={() => setActivePlayerForSubtraction(null)}
        onSubtractStat={(pId, statType) => {
          subtractPlayerStat(pId, statType);
          setActivePlayerForSubtraction(null);
        }}
      />

      <BenchPlayerStatsModal
        visible={activeBenchPlayerForStats !== null}
        player={activeBenchPlayerForStats}
        onClose={() => setActiveBenchPlayerForStats(null)}
      />
    </View>
  );
};

export default PlayMatch;
