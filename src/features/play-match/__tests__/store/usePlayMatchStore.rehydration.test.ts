import { usePlayMatchStore, resetPlayMatchStore } from "../../store/usePlayMatchStore";
import { CachedMatchPayload } from "../../types/cache";

describe("usePlayMatchStore hydrateFromCache (T014)", () => {
  const cachedPayload: CachedMatchPayload = {
    version: 1,
    matchId: 99,
    activePeriod: "q2",
    periods: {
      q1: { key: "q1", label: "Q1", remainingSeconds: 0, teamScore: 22, rivalScore: 18, teamFouls: 3, rivalFouls: 4, isCompleted: true },
      q2: { key: "q2", label: "Q2", remainingSeconds: 420, teamScore: 12, rivalScore: 8, teamFouls: 1, rivalFouls: 2, isCompleted: false },
      q3: { key: "q3", label: "Q3", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
      q4: { key: "q4", label: "Q4", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
      extra: { key: "extra", label: "EXTRA", remainingSeconds: 300, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
    },
    players: [
      {
        id: 1,
        firstName: "Ricky",
        lastName: "Rubio",
        number: "9",
        isOnCourt: true,
        courtPositionIndex: 0,
        secondsPlayed: 480,
        stintSeconds: 180,
        t1a: 2,
        t1i: 0,
        t2a: 3,
        t2i: 1,
        t3a: 1,
        t3i: 2,
        oreb: 0,
        dreb: 3,
        asis: 5,
        rec: 2,
        per: 1,
        falt: 2,
        valuation: 15,
      },
      {
        id: 2,
        firstName: "Pau",
        lastName: "Gasol",
        number: "16",
        isOnCourt: false,
        courtPositionIndex: null,
        secondsPlayed: 300,
        stintSeconds: 0,
        t1a: 4,
        t1i: 1,
        t2a: 5,
        t2i: 2,
        t3a: 0,
        t3i: 0,
        oreb: 3,
        dreb: 5,
        asis: 2,
        rec: 1,
        per: 0,
        falt: 1,
        valuation: 20,
      },
    ],
    timeouts: {
      firstHalfRemaining: 1,
      secondHalfRemaining: 3,
      extraTimeRemaining: 1,
    },
    swap: {
      isSwapMode: false,
      selectedCourtPlayerIds: [],
      selectedBenchPlayerIds: [],
    },
    scoreEvents: [
      {
        id: "evt-1",
        scoringPlayerId: 1,
        period: "q2",
        shotType: "t2a",
        points: 2,
        assistingPlayerId: 2,
        timestamp: Date.now(),
      },
    ],
    savedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    resetPlayMatchStore();
  });

  it("rehydrates store state completely from cached payload", () => {
    usePlayMatchStore.getState().hydrateFromCache(cachedPayload);

    const state = usePlayMatchStore.getState();
    expect(state.matchId).toBe(99);
    expect(state.activePeriod).toBe("q2");
    expect(state.periods.q1.isCompleted).toBe(true);
    expect(state.periods.q2.remainingSeconds).toBe(420);
    expect(state.players).toHaveLength(2);
    expect(state.timeouts.firstHalfRemaining).toBe(1);
    expect(state.scoreEvents).toHaveLength(1);
    expect(state.scoreEvents[0].id).toBe("evt-1");
  });

  it("enforces paused timer (isTimerRunning = false) on rehydration", () => {
    // Start timer before rehydration
    usePlayMatchStore.getState().setTimer(true);
    expect(usePlayMatchStore.getState().isTimerRunning).toBe(true);

    usePlayMatchStore.getState().hydrateFromCache(cachedPayload);
    expect(usePlayMatchStore.getState().isTimerRunning).toBe(false);
  });

  it("calculates accurate scores and roster splits after rehydration", () => {
    usePlayMatchStore.getState().hydrateFromCache(cachedPayload);

    expect(usePlayMatchStore.getState().getTotalTeamScore()).toBe(34); // 22 + 12
    expect(usePlayMatchStore.getState().getTotalRivalScore()).toBe(26); // 18 + 8
    expect(usePlayMatchStore.getState().getActiveCourtPlayers()[0]?.id).toBe(1);
    expect(usePlayMatchStore.getState().getBenchPlayers()[0]?.id).toBe(2);
  });
});
