import { create } from "zustand";
import { InGamePlayer, PeriodData, PeriodKey, StatActionType, SwapState, TimeoutBudget } from "../types";

export function calculatePlayerValuation(player: Partial<InGamePlayer>): number {
  if (!player) return 0;
  const t1a = Number(player.t1a || 0);
  const t1i = Number(player.t1i || 0);
  const t2a = Number(player.t2a || 0);
  const t2i = Number(player.t2i || 0);
  const t3a = Number(player.t3a || 0);
  const t3i = Number(player.t3i || 0);
  const oreb = Number(player.oreb || 0);
  const dreb = Number(player.dreb || 0);
  const asis = Number(player.asis || 0);
  const rec = Number(player.rec || 0);
  const per = Number(player.per || 0);
  const falt = Number(player.falt || 0);

  const madeShots = t1a + t2a + t3a;
  const missedT1 = Math.max(0, t1i - t1a);
  const missedT2 = Math.max(0, t2i - t2a);
  const missedT3 = Math.max(0, t3i - t3a);

  return madeShots + oreb + dreb + asis + rec - per - falt - missedT1 - missedT2 - missedT3;
}

export function calculatePlayerPoints(player: Partial<InGamePlayer>): number {
  if (!player) return 0;
  return Number(player.t1a || 0) * 1 + Number(player.t2a || 0) * 2 + Number(player.t3a || 0) * 3;
}

export const createInitialPeriods = (): Record<PeriodKey, PeriodData> => ({
  q1: { key: "q1", label: "Q1", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
  q2: { key: "q2", label: "Q2", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
  q3: { key: "q3", label: "Q3", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
  q4: { key: "q4", label: "Q4", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
  extra: { key: "extra", label: "EXTRA", remainingSeconds: 300, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
});

export const createInitialTimeouts = (): TimeoutBudget => ({
  firstHalfRemaining: 2,
  secondHalfRemaining: 3,
  extraTimeRemaining: 1,
});

export const createInitialSwap = (): SwapState => ({
  isSwapMode: false,
  selectedCourtPlayerIds: [],
  selectedBenchPlayerIds: [],
});

export interface PlayMatchStoreState {
  matchId: number;
  activePeriod: PeriodKey;
  periods: Record<PeriodKey, PeriodData>;
  isTimerRunning: boolean;
  players: InGamePlayer[];
  timeouts: TimeoutBudget;
  swap: SwapState;

  // Actions
  initMatch: (matchId: number, roster: InGamePlayer[], startingFiveIds?: number[]) => void;
  setStartingFive: (playerIds: number[]) => void;
  assignBenchPlayerToPosition: (playerId: number, positionIndex: number) => void;
  toggleTimer: () => void;
  setTimer: (running: boolean) => void;
  tickTimer: (secondsDelta?: number) => void;
  setPeriodTime: (period: PeriodKey, seconds: number) => void;
  nextPeriod: () => void;
  setPeriod: (period: PeriodKey) => void;
  resetExtraTimeCrono: () => void;
  recordPlayerStat: (playerId: number, statType: StatActionType, assistingPlayerId?: number | null) => void;
  adjustRivalScore: (delta: number) => void;
  adjustRivalFouls: (delta: number) => void;
  toggleSwapMode: () => void;
  selectSwapCourtPlayer: (playerId: number) => void;
  selectSwapBenchPlayer: (playerId: number) => void;
  confirmSwap: () => void;
  cancelSwap: () => void;
  increaseTimeout: () => void;
  decreaseTimeout: () => void;

  // Getters & Selectors
  getTotalTeamScore: () => number;
  getTotalRivalScore: () => number;
  getActiveCourtPlayers: () => (InGamePlayer | null)[];
  getBenchPlayers: () => InGamePlayer[];
  getAvailableTimeouts: () => number;
}

const PERIOD_ORDER: PeriodKey[] = ["q1", "q2", "q3", "q4", "extra"];

export const usePlayMatchStore = create<PlayMatchStoreState>((set, get) => ({
  matchId: 0,
  activePeriod: "q1",
  periods: createInitialPeriods(),
  isTimerRunning: false,
  players: [],
  timeouts: createInitialTimeouts(),
  swap: createInitialSwap(),

  initMatch: (matchId, roster, startingFiveIds) => {
    let startingSet = new Set<number>();
    if (startingFiveIds && startingFiveIds.length === 5) {
      startingSet = new Set(startingFiveIds);
    }

    const courtAssignments: number[] = [];
    if (startingFiveIds && startingFiveIds.length === 5) {
      courtAssignments.push(...startingFiveIds);
    }

    const initializedPlayers: InGamePlayer[] = roster.map((p) => {
      const isOnCourt = startingSet.has(p.id);
      const courtPositionIndex = isOnCourt ? courtAssignments.indexOf(p.id) : null;
      return {
        ...p,
        isOnCourt,
        courtPositionIndex,
        secondsPlayed: p.secondsPlayed || 0,
        t1a: p.t1a || 0,
        t1i: p.t1i || 0,
        t2a: p.t2a || 0,
        t2i: p.t2i || 0,
        t3a: p.t3a || 0,
        t3i: p.t3i || 0,
        oreb: p.oreb || 0,
        dreb: p.dreb || 0,
        asis: p.asis || 0,
        rec: p.rec || 0,
        per: p.per || 0,
        falt: p.falt || 0,
        valuation: calculatePlayerValuation(p),
      };
    });

    set({
      matchId,
      activePeriod: "q1",
      periods: createInitialPeriods(),
      isTimerRunning: false,
      players: initializedPlayers,
      timeouts: createInitialTimeouts(),
      swap: createInitialSwap(),
    });
  },

  setStartingFive: (playerIds) => {
    if (!Array.isArray(playerIds) || playerIds.length !== 5) {
      throw new Error("Starting five must contain exactly 5 unique player IDs");
    }
    const startingSet = new Set(playerIds);
    set((state) => ({
      players: state.players.map((p) => {
        const isOnCourt = startingSet.has(p.id);
        const courtPositionIndex = isOnCourt ? playerIds.indexOf(p.id) : null;
        return {
          ...p,
          isOnCourt,
          courtPositionIndex,
        };
      }),
    }));
  },

  assignBenchPlayerToPosition: (playerId, positionIndex) => {
    if (positionIndex < 0 || positionIndex > 4) return;
    set((state) => {
      // Find if another player occupies this position
      const players = state.players.map((p) => {
        if (p.id === playerId) {
          return { ...p, isOnCourt: true, courtPositionIndex: positionIndex };
        }
        if (p.courtPositionIndex === positionIndex && p.id !== playerId) {
          return { ...p, isOnCourt: false, courtPositionIndex: null };
        }
        return p;
      });
      return { players };
    });
  },

  toggleTimer: () => {
    set((state) => ({ isTimerRunning: !state.isTimerRunning }));
  },

  setTimer: (running) => {
    set({ isTimerRunning: running });
  },

  tickTimer: (secondsDelta = 1) => {
    set((state) => {
      if (!state.isTimerRunning) return state;
      const currentPeriod = state.periods[state.activePeriod];
      const newRemaining = Math.max(0, currentPeriod.remainingSeconds - secondsDelta);
      const isTimerRunning = newRemaining > 0 ? state.isTimerRunning : false;

      const updatedPlayers = state.players.map((p) => {
        if (p.isOnCourt) {
          return { ...p, secondsPlayed: p.secondsPlayed + secondsDelta };
        }
        return p;
      });

      return {
        isTimerRunning,
        periods: {
          ...state.periods,
          [state.activePeriod]: {
            ...currentPeriod,
            remainingSeconds: newRemaining,
            isCompleted: newRemaining === 0,
          },
        },
        players: updatedPlayers,
      };
    });
  },

  setPeriodTime: (period, seconds) => {
    set((state) => ({
      periods: {
        ...state.periods,
        [period]: {
          ...state.periods[period],
          remainingSeconds: Math.max(0, seconds),
        },
      },
    }));
  },

  nextPeriod: () => {
    set((state) => {
      const currentIndex = PERIOD_ORDER.indexOf(state.activePeriod);
      const nextIndex = (currentIndex + 1) % PERIOD_ORDER.length;
      return { activePeriod: PERIOD_ORDER[nextIndex] };
    });
  },

  setPeriod: (period) => {
    set({ activePeriod: period });
  },

  resetExtraTimeCrono: () => {
    set((state) => ({
      periods: {
        ...state.periods,
        extra: {
          ...state.periods.extra,
          remainingSeconds: 300,
        },
      },
      timeouts: {
        ...state.timeouts,
        extraTimeRemaining: state.timeouts.extraTimeRemaining + 1,
      },
    }));
  },

  recordPlayerStat: (playerId, statType, assistingPlayerId = null) => {
    set((state) => {
      let scoreDelta = 0;
      let foulDelta = 0;
      let shouldStopClock = false;

      const updatedPlayers = state.players.map((p) => {
        let updated = { ...p };
        if (p.id === playerId) {
          switch (statType) {
            case "t1a":
              updated.t1a += 1;
              updated.t1i += 1;
              scoreDelta = 1;
              break;
            case "t1i":
              updated.t1i += 1;
              break;
            case "t2a":
              updated.t2a += 1;
              updated.t2i += 1;
              scoreDelta = 2;
              break;
            case "t2i":
              updated.t2i += 1;
              break;
            case "t3a":
              updated.t3a += 1;
              updated.t3i += 1;
              scoreDelta = 3;
              break;
            case "t3i":
              updated.t3i += 1;
              break;
            case "oreb":
              updated.oreb += 1;
              break;
            case "dreb":
              updated.dreb += 1;
              break;
            case "fault":
              updated.falt += 1;
              foulDelta = 1;
              shouldStopClock = true;
              break;
            case "asis":
              updated.asis += 1;
              break;
            case "lost":
              updated.per += 1;
              break;
            case "recovers":
              updated.rec += 1;
              break;
          }
        } else if (assistingPlayerId !== null && p.id === assistingPlayerId) {
          updated.asis += 1;
        }

        updated.valuation = calculatePlayerValuation(updated);
        return updated;
      });

      const activePeriodData = state.periods[state.activePeriod];
      const updatedPeriodData: PeriodData = {
        ...activePeriodData,
        teamScore: activePeriodData.teamScore + scoreDelta,
        teamFouls: activePeriodData.teamFouls + foulDelta,
      };

      return {
        isTimerRunning: shouldStopClock ? false : state.isTimerRunning,
        players: updatedPlayers,
        periods: {
          ...state.periods,
          [state.activePeriod]: updatedPeriodData,
        },
      };
    });
  },

  adjustRivalScore: (delta) => {
    set((state) => {
      const activePeriodData = state.periods[state.activePeriod];
      const newScore = Math.max(0, activePeriodData.rivalScore + delta);
      return {
        periods: {
          ...state.periods,
          [state.activePeriod]: {
            ...activePeriodData,
            rivalScore: newScore,
          },
        },
      };
    });
  },

  adjustRivalFouls: (delta) => {
    set((state) => {
      const activePeriodData = state.periods[state.activePeriod];
      const newFouls = Math.max(0, activePeriodData.rivalFouls + delta);
      const shouldStopClock = delta > 0;
      return {
        isTimerRunning: shouldStopClock ? false : state.isTimerRunning,
        periods: {
          ...state.periods,
          [state.activePeriod]: {
            ...activePeriodData,
            rivalFouls: newFouls,
          },
        },
      };
    });
  },

  toggleSwapMode: () => {
    const { isTimerRunning, swap } = get();
    if (isTimerRunning) {
      throw new Error("Cannot enter substitution Swap mode while chronometer is running");
    }
    set({
      swap: {
        isSwapMode: !swap.isSwapMode,
        selectedCourtPlayerIds: [],
        selectedBenchPlayerIds: [],
      },
    });
  },

  selectSwapCourtPlayer: (playerId) => {
    set((state) => {
      const isSelected = state.swap.selectedCourtPlayerIds.includes(playerId);
      const selectedCourtPlayerIds = isSelected
        ? state.swap.selectedCourtPlayerIds.filter((id) => id !== playerId)
        : [...state.swap.selectedCourtPlayerIds, playerId];
      return { swap: { ...state.swap, selectedCourtPlayerIds } };
    });
  },

  selectSwapBenchPlayer: (playerId) => {
    set((state) => {
      const isSelected = state.swap.selectedBenchPlayerIds.includes(playerId);
      const selectedBenchPlayerIds = isSelected
        ? state.swap.selectedBenchPlayerIds.filter((id) => id !== playerId)
        : [...state.swap.selectedBenchPlayerIds, playerId];
      return { swap: { ...state.swap, selectedBenchPlayerIds } };
    });
  },

  confirmSwap: () => {
    const { swap, players } = get();
    const { selectedCourtPlayerIds, selectedBenchPlayerIds } = swap;
    if (selectedCourtPlayerIds.length === 0 || selectedCourtPlayerIds.length !== selectedBenchPlayerIds.length) {
      return;
    }

    // Capture court positions of the outgoing players
    const outgoingPositions = selectedCourtPlayerIds.map((courtId) => {
      const p = players.find((pl) => pl.id === courtId);
      return p?.courtPositionIndex ?? null;
    });

    const updatedPlayers = players.map((p) => {
      if (selectedCourtPlayerIds.includes(p.id)) {
        return { ...p, isOnCourt: false, courtPositionIndex: null };
      }
      const benchIndex = selectedBenchPlayerIds.indexOf(p.id);
      if (benchIndex !== -1) {
        return { ...p, isOnCourt: true, courtPositionIndex: outgoingPositions[benchIndex] };
      }
      return p;
    });

    set({
      players: updatedPlayers,
      swap: createInitialSwap(),
    });
  },

  cancelSwap: () => {
    set({ swap: createInitialSwap() });
  },

  increaseTimeout: () => {
    set((state) => {
      const { activePeriod, timeouts } = state;
      if (activePeriod === "q1" || activePeriod === "q2") {
        return { timeouts: { ...timeouts, firstHalfRemaining: timeouts.firstHalfRemaining + 1 } };
      }
      if (activePeriod === "q3" || activePeriod === "q4") {
        return { timeouts: { ...timeouts, secondHalfRemaining: timeouts.secondHalfRemaining + 1 } };
      }
      return { timeouts: { ...timeouts, extraTimeRemaining: timeouts.extraTimeRemaining + 1 } };
    });
  },

  decreaseTimeout: () => {
    set((state) => {
      const { activePeriod, timeouts } = state;
      if (activePeriod === "q1" || activePeriod === "q2") {
        return { timeouts: { ...timeouts, firstHalfRemaining: Math.max(0, timeouts.firstHalfRemaining - 1) } };
      }
      if (activePeriod === "q3" || activePeriod === "q4") {
        return { timeouts: { ...timeouts, secondHalfRemaining: Math.max(0, timeouts.secondHalfRemaining - 1) } };
      }
      return { timeouts: { ...timeouts, extraTimeRemaining: Math.max(0, timeouts.extraTimeRemaining - 1) } };
    });
  },

  getTotalTeamScore: () => {
    const { periods } = get();
    return (
      periods.q1.teamScore +
      periods.q2.teamScore +
      periods.q3.teamScore +
      periods.q4.teamScore +
      periods.extra.teamScore
    );
  },

  getTotalRivalScore: () => {
    const { periods } = get();
    return (
      periods.q1.rivalScore +
      periods.q2.rivalScore +
      periods.q3.rivalScore +
      periods.q4.rivalScore +
      periods.extra.rivalScore
    );
  },

  getActiveCourtPlayers: () => {
    const { players } = get();
    const court: (InGamePlayer | null)[] = [null, null, null, null, null];
    players
      .filter((p) => p.isOnCourt)
      .forEach((p) => {
        if (p.courtPositionIndex !== null && p.courtPositionIndex !== undefined && p.courtPositionIndex >= 0 && p.courtPositionIndex < 5) {
          court[p.courtPositionIndex] = p;
        } else {
          // Fill first empty slot
          const emptyIndex = court.findIndex((slot) => slot === null);
          if (emptyIndex !== -1) {
            court[emptyIndex] = p;
          }
        }
      });
    return court;
  },

  getBenchPlayers: () => {
    const { players } = get();
    return players.filter((p) => !p.isOnCourt);
  },

  getAvailableTimeouts: () => {
    const { activePeriod, timeouts } = get();
    if (activePeriod === "q1" || activePeriod === "q2") {
      return timeouts.firstHalfRemaining;
    }
    if (activePeriod === "q3" || activePeriod === "q4") {
      return timeouts.secondHalfRemaining;
    }
    return timeouts.extraTimeRemaining;
  },
}));

export const resetPlayMatchStore = () => {
  usePlayMatchStore.setState({
    matchId: 0,
    activePeriod: "q1",
    periods: createInitialPeriods(),
    isTimerRunning: false,
    players: [],
    timeouts: createInitialTimeouts(),
    swap: createInitialSwap(),
  });
};
