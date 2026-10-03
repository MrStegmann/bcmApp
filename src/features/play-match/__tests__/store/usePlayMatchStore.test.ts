import { usePlayMatchStore, resetPlayMatchStore } from "../../store/usePlayMatchStore";
import { InGamePlayer, PeriodKey } from "../../types";

describe("usePlayMatchStore (T003 - Foundational Store)", () => {
  const mockRoster: InGamePlayer[] = [
    {
      id: 1,
      firstName: "Luka",
      lastName: "Doncic",
      number: "77",
      position: "Point Guard",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 2,
      firstName: "Kyrie",
      lastName: "Irving",
      number: "11",
      position: "Shooting Guard",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 3,
      firstName: "Klay",
      lastName: "Thompson",
      number: "31",
      position: "Small Forward",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 4,
      firstName: "PJ",
      lastName: "Washington",
      number: "25",
      position: "Power Forward",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 5,
      firstName: "Dereck",
      lastName: "Lively",
      number: "2",
      position: "Center",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 6,
      firstName: "Daniel",
      lastName: "Gafford",
      number: "21",
      position: "Center",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
  ];

  beforeEach(() => {
    resetPlayMatchStore();
  });

  it("should initialize match with roster and default periods", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    const state = usePlayMatchStore.getState();
    expect(state.matchId).toBe(101);
    expect(state.activePeriod).toBe("q1");
    expect(state.periods.q1.remainingSeconds).toBe(600);
    expect(state.periods.extra.remainingSeconds).toBe(300);
    expect(state.isTimerRunning).toBe(false);

    const court = state.getActiveCourtPlayers();
    expect(court.filter((p) => p !== null).length).toBe(5);
    const bench = state.getBenchPlayers();
    expect(bench.length).toBe(1);
    expect(bench[0].id).toBe(6);
  });

  it("should support quick assigning a bench player to an empty court position", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster); // No starting five -> empty court

    expect(store.getActiveCourtPlayers().every((p) => p === null)).toBe(true);

    store.assignBenchPlayerToPosition(1, 0); // Assign Luka to position 0
    const court = usePlayMatchStore.getState().getActiveCourtPlayers();
    expect(court[0]?.id).toBe(1);
    expect(court[0]?.isOnCourt).toBe(true);
    expect(court[0]?.courtPositionIndex).toBe(0);
  });

  it("should advance periods via 1-tap nextPeriod and direct setPeriod", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    expect(usePlayMatchStore.getState().activePeriod).toBe("q1");
    store.nextPeriod();
    expect(usePlayMatchStore.getState().activePeriod).toBe("q2");
    store.nextPeriod();
    expect(usePlayMatchStore.getState().activePeriod).toBe("q3");
    store.nextPeriod();
    expect(usePlayMatchStore.getState().activePeriod).toBe("q4");
    store.nextPeriod();
    expect(usePlayMatchStore.getState().activePeriod).toBe("extra");

    // Direct selection
    store.setPeriod("q2");
    expect(usePlayMatchStore.getState().activePeriod).toBe("q2");
  });

  it("should toggle timer and accumulate played minutes for on-court quintet during tickTimer", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    store.toggleTimer();
    expect(usePlayMatchStore.getState().isTimerRunning).toBe(true);

    store.tickTimer(1);
    const state1 = usePlayMatchStore.getState();
    expect(state1.periods.q1.remainingSeconds).toBe(599);
    expect(state1.players.find((p) => p.id === 1)?.secondsPlayed).toBe(1);
    expect(state1.players.find((p) => p.id === 6)?.secondsPlayed).toBe(0); // Bench player unchanged

    store.toggleTimer();
    expect(usePlayMatchStore.getState().isTimerRunning).toBe(false);
  });

  it("should allow manual time configuration via setPeriodTime", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    store.setPeriodTime("q1", 450); // 07:30
    expect(usePlayMatchStore.getState().periods.q1.remainingSeconds).toBe(450);
  });

  it("should reset extra time crono to 5:00, preserve scores and award +1 timeout", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);
    store.setPeriod("extra");

    // Add stats to extra period
    store.recordPlayerStat(1, "t2a", null);
    store.adjustRivalScore(3);
    store.setPeriodTime("extra", 0);

    expect(usePlayMatchStore.getState().periods.extra.teamScore).toBe(2);
    expect(usePlayMatchStore.getState().periods.extra.rivalScore).toBe(3);
    expect(usePlayMatchStore.getState().getAvailableTimeouts()).toBe(1);

    store.resetExtraTimeCrono();

    const state = usePlayMatchStore.getState();
    expect(state.periods.extra.remainingSeconds).toBe(300);
    expect(state.periods.extra.teamScore).toBe(2);
    expect(state.periods.extra.rivalScore).toBe(3);
    expect(state.getAvailableTimeouts()).toBe(2); // +1 timeout awarded
  });

  it("should record shooting stats (t1a, t2a, t3a with assists, misses) and auto-calculate total score", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    // 1pt made by Luka
    store.recordPlayerStat(1, "t1a", null);
    // 2pt made by Kyrie assisted by Luka
    store.recordPlayerStat(2, "t2a", 1);
    // 3pt made by Klay (no assist)
    store.recordPlayerStat(3, "t3a", null);
    // Missed 3pt by PJ
    store.recordPlayerStat(4, "t3i", null);

    const state = usePlayMatchStore.getState();
    const luka = state.players.find((p) => p.id === 1);
    const kyrie = state.players.find((p) => p.id === 2);
    const klay = state.players.find((p) => p.id === 3);
    const pj = state.players.find((p) => p.id === 4);

    expect(luka?.t1a).toBe(1);
    expect(luka?.asis).toBe(1);
    expect(kyrie?.t2a).toBe(1);
    expect(klay?.t3a).toBe(1);
    expect(pj?.t3i).toBe(1);

    expect(state.periods.q1.teamScore).toBe(6); // 1 + 2 + 3
    expect(state.getTotalTeamScore()).toBe(6);
  });

  it("should record personal foul, increment period team fouls and auto-pause running clock", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    store.toggleTimer();
    expect(usePlayMatchStore.getState().isTimerRunning).toBe(true);

    store.recordPlayerStat(1, "fault", null);

    const state = usePlayMatchStore.getState();
    expect(state.players.find((p) => p.id === 1)?.falt).toBe(1);
    expect(state.periods.q1.teamFouls).toBe(1);
    expect(state.isTimerRunning).toBe(false); // Clock auto-paused
  });

  it("should record rebounds, steals, turnovers and update player valuations", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    store.recordPlayerStat(1, "oreb", null);
    store.recordPlayerStat(1, "dreb", null);
    store.recordPlayerStat(1, "recovers", null);
    store.recordPlayerStat(1, "lost", null);

    const luka = usePlayMatchStore.getState().players.find((p) => p.id === 1);
    expect(luka?.oreb).toBe(1);
    expect(luka?.dreb).toBe(1);
    expect(luka?.rec).toBe(1);
    expect(luka?.per).toBe(1);
  });

  it("should manage rival points and fouls with auto-stop on foul addition", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    store.adjustRivalScore(3);
    store.adjustRivalScore(-1);
    expect(usePlayMatchStore.getState().periods.q1.rivalScore).toBe(2);
    expect(usePlayMatchStore.getState().getTotalRivalScore()).toBe(2);

    store.toggleTimer();
    expect(usePlayMatchStore.getState().isTimerRunning).toBe(true);

    store.adjustRivalFouls(1);
    expect(usePlayMatchStore.getState().periods.q1.rivalFouls).toBe(1);
    expect(usePlayMatchStore.getState().isTimerRunning).toBe(false); // Auto-paused
  });

  it("should enforce balanced substitutions in Swap mode and restrict to paused clock", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    // Disallow toggle swap when timer running
    store.toggleTimer();
    expect(() => store.toggleSwapMode()).toThrow();
    store.toggleTimer(); // Pause

    store.toggleSwapMode();
    expect(usePlayMatchStore.getState().swap.isSwapMode).toBe(true);

    // Select 1 court player (Luka) and 1 bench player (Gafford)
    store.selectSwapCourtPlayer(1);
    store.selectSwapBenchPlayer(6);
    expect(usePlayMatchStore.getState().swap.selectedCourtPlayerIds).toEqual([1]);
    expect(usePlayMatchStore.getState().swap.selectedBenchPlayerIds).toEqual([6]);

    store.confirmSwap();

    const state = usePlayMatchStore.getState();
    expect(state.swap.isSwapMode).toBe(false);
    expect(state.players.find((p) => p.id === 1)?.isOnCourt).toBe(false);
    expect(state.players.find((p) => p.id === 6)?.isOnCourt).toBe(true);
    expect(state.getActiveCourtPlayers().filter((p) => p !== null).length).toBe(5);
  });

  it("should enforce phase-based timeout allowances and floor at 0", () => {
    const store = usePlayMatchStore.getState();
    store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

    // Q1 -> 2 timeouts
    expect(store.getAvailableTimeouts()).toBe(2);
    store.decreaseTimeout();
    expect(usePlayMatchStore.getState().getAvailableTimeouts()).toBe(1);
    store.decreaseTimeout();
    expect(usePlayMatchStore.getState().getAvailableTimeouts()).toBe(0);
    store.decreaseTimeout();
    expect(usePlayMatchStore.getState().getAvailableTimeouts()).toBe(0); // Floor

    // Switch to Q2 -> shared pool of Q1-Q2 (0 left)
    store.setPeriod("q2");
    expect(usePlayMatchStore.getState().getAvailableTimeouts()).toBe(0);

    // Switch to Q3 -> 3 timeouts for second half
    store.setPeriod("q3");
    expect(usePlayMatchStore.getState().getAvailableTimeouts()).toBe(3);
  });
});
