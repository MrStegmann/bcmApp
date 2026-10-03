import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { usePlayMatchStore } from "./store/usePlayMatchStore";
import { TimeScoreFoulsController } from "./components/TimeScoreFoulsController";
import { TeamManagementCanvas } from "./components/TeamManagementCanvas";
import { RivalPanelControl } from "./components/RivalPanelControl";
import { StartingFiveModal } from "./components/StartingFiveModal";
import { PeriodSelectModal } from "./components/PeriodSelectModal";
import { ManualTimeModal } from "./components/ManualTimeModal";
import { QuickAssignPlayerModal } from "./components/QuickAssignPlayerModal";
import { PlayerStatsModal } from "./components/PlayerStatsModal";
import { InGamePlayer, PlayMatchProps } from "./types";
import { useDB } from "../../hooks/useDB";
import { db, games, playerStats } from "../../db";
import { eq } from "drizzle-orm";

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
    tickTimer,
    setPeriodTime,
    nextPeriod,
    setPeriod,
    resetExtraTimeCrono,
    recordPlayerStat,
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

  // Local Modal Visibility States
  const [isStartingFiveModalOpen, setIsStartingFiveModalOpen] = useState(false);
  const [isPeriodSelectModalOpen, setIsPeriodSelectModalOpen] = useState(false);
  const [isManualTimeModalOpen, setIsManualTimeModalOpen] = useState(false);
  const [quickAssignSlotIndex, setQuickAssignSlotIndex] = useState<number | null>(null);
  const [activePlayerForStats, setActivePlayerForStats] = useState<InGamePlayer | null>(null);

  // Initialize Match and Players from DB on mount
  useEffect(() => {
    const loadMatchData = async () => {
      try {
        const teamPlayers = await PlayerController.getAll(match.teamId);
        const existingStats = await db
          .select()
          .from(playerStats)
          .where(eq(playerStats.gameId, match.id));

        const roster: InGamePlayer[] = (teamPlayers || []).map((p: any) => {
          const stat = existingStats.find((s) => s.playerId === p.id);
          return {
            id: p.id,
            firstName: p.firstName || p.first_name || "Jugador",
            lastName: p.lastName || p.last_name || `#${p.number}`,
            number: String(p.number || "0"),
            position: p.position || null,
            isOnCourt: false,
            courtPositionIndex: null,
            secondsPlayed: (stat?.minutes || 0) * 60,
            t1a: stat?.t1a || 0,
            t1i: stat?.t1i || 0,
            t2a: stat?.t2a || 0,
            t2i: stat?.t2i || 0,
            t3a: stat?.t3a || 0,
            t3i: stat?.t3i || 0,
            oreb: stat?.oreb || 0,
            dreb: stat?.dreb || 0,
            asis: stat?.asis || 0,
            rec: stat?.rec || 0,
            per: stat?.per || 0,
            falt: stat?.falt || 0,
            valuation: stat?.valuation || 0,
          };
        });

        initMatch(match.id, roster);

        // If newly created and no players on court, prompt Starting 5 modal
        if (roster.length >= 5) {
          setIsStartingFiveModalOpen(true);
        }
      } catch (err) {
        console.error("Failed to load match roster:", err);
      }
    };

    loadMatchData();
  }, [match.id]);

  // Real-time Chronometer Interval
  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        tickTimer(1);
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
  }, [isTimerRunning]);

  // Handle Court Position Tap
  const handleSelectCourtPosition = (positionIndex: number, player: InGamePlayer | null) => {
    if (swap.isSwapMode) {
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

  // Handle Bench Player Tap
  const handleSelectBenchPlayer = (player: InGamePlayer) => {
    if (swap.isSwapMode) {
      selectSwapBenchPlayer(player.id);
    }
  };

  // Confirm Starting Five
  const handleConfirmStartingFive = (selectedIds: number[]) => {
    setStartingFive(selectedIds);
    setIsStartingFiveModalOpen(false);
  };

  // Finish Match & Persist to SQLite
  const handleFinishMatch = async () => {
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
              // Update Game Record
              await db
                .update(games)
                .set({
                  status: "finished",
                  resultC1: periods.q1.teamScore,
                  resultC2: periods.q2.teamScore,
                  resultC3: periods.q3.teamScore,
                  resultC4: periods.q4.teamScore,
                  resultExtra: periods.extra.teamScore,
                  resultC1Opponent: periods.q1.rivalScore,
                  resultC2Opponent: periods.q2.rivalScore,
                  resultC3Opponent: periods.q3.rivalScore,
                  resultC4Opponent: periods.q4.rivalScore,
                  resultExtraOpponent: periods.extra.rivalScore,
                })
                .where(eq(games.id, match.id));

              // Save Player Stats
              for (const p of players) {
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

              onFinishMatch();
            } catch (err) {
              console.error("Failed to finish match:", err);
            }
          },
        },
      ]
    );
  };

  const courtPlayers = getActiveCourtPlayers();
  const benchPlayers = getBenchPlayers();
  const courtTeammates = courtPlayers.filter((p): p is InGamePlayer => p !== null);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onReturn}
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
        >
          <Text className="text-slate-300 font-bold text-xs">← Volver</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            VS {match.opponent}
          </Text>
          <Text className="text-amber-400 font-extrabold text-sm">Panel de Partido</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleFinishMatch}
          className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/50"
        >
          <Text className="text-rose-300 font-bold text-xs">Finalizar</Text>
        </TouchableOpacity>
      </View>

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
        onSelectBenchPlayer={handleSelectBenchPlayer}
        onToggleSwapMode={toggleSwapMode}
        onConfirmSwap={confirmSwap}
        onCancelSwap={cancelSwap}
        onIncreaseTimeout={increaseTimeout}
        onDecreaseTimeout={decreaseTimeout}
      />

      {/* Component 3: Rival Panel Control */}
      <RivalPanelControl
        activePeriod={activePeriod}
        rivalPeriodScore={periods[activePeriod].rivalScore}
        rivalPeriodFouls={periods[activePeriod].rivalFouls}
        totalRivalScore={getTotalRivalScore()}
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
    </SafeAreaView>
  );
};

export default PlayMatch;
