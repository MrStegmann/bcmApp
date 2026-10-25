import { usePlayMatchStore, resetPlayMatchStore } from "../../store/usePlayMatchStore";
import { InGamePlayer, PeriodKey } from "../../types";

describe("usePlayMatchStore", () => {
  const mockRoster: InGamePlayer[] = [
    {
      id: 1,
      firstName: "Luka",
      lastName: "Doncic",
      number: "77",
      position: "Point Guard",
      isOnCourt: false,
      secondsPlayed: 0,
      stintSeconds: 0,
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
      stintSeconds: 0,
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
      stintSeconds: 0,
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
      stintSeconds: 0,
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
      stintSeconds: 0,
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
      stintSeconds: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
  ];

  beforeEach(() => {
    resetPlayMatchStore();
  });

  describe("Phase 2: Foundation & Initialization", () => {
    it("should initialize match with roster and default periods", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

      const state = usePlayMatchStore.getState();
      expect(state.matchId).toBe(101);
      expect(state.activePeriod).toBe("q1");
      expect(state.periods.q1.remainingSeconds).toBe(600);
      expect(state.periods.extra.remainingSeconds).toBe(300);
      expect(state.isTimerRunning).toBe(false);
      expect(state.scoreEvents).toEqual([]);

      const court = state.getActiveCourtPlayers();
      expect(court.filter((p) => p !== null).length).toBe(5);
      const bench = state.getBenchPlayers();
      expect(bench.length).toBe(1);
      expect(bench[0].id).toBe(6);
    });

    it("should support quick assigning a bench player to an empty court position with stintSeconds=0", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster); // No starting five -> empty court

      expect(store.getActiveCourtPlayers().every((p) => p === null)).toBe(true);

      store.assignBenchPlayerToPosition(1, 0); // Assign Luka to position 0
      const court = usePlayMatchStore.getState().getActiveCourtPlayers();
      expect(court[0]?.id).toBe(1);
      expect(court[0]?.isOnCourt).toBe(true);
      expect(court[0]?.courtPositionIndex).toBe(0);
      expect(court[0]?.stintSeconds).toBe(0);
    });
  });

  describe("Phase 3: User Story 1 - Game Clock, Period Control & Isolated Scoring", () => {
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
      expect(state1.players.find((p) => p.id === 1)?.stintSeconds).toBe(1);
      expect(state1.players.find((p) => p.id === 6)?.secondsPlayed).toBe(0); // Bench player unchanged
      expect(state1.players.find((p) => p.id === 6)?.stintSeconds).toBe(0);

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
  });

  describe("Phase 4: User Story 2 - Court Canvas, Stint Tracking & Stat Subtraction", () => {
    it("should accumulate stint seconds while on court and reset stint seconds upon court re-entry", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

      store.toggleTimer();
      store.tickTimer(120); // 2 minutes

      let p1 = usePlayMatchStore.getState().players.find((p) => p.id === 1);
      expect(p1?.secondsPlayed).toBe(120);
      expect(p1?.stintSeconds).toBe(120);

      // Sub out player 1 for player 6
      store.toggleSwapMode();
      store.selectSwapCourtPlayer(1);
      store.selectSwapBenchPlayer(6);
      store.confirmSwap();

      p1 = usePlayMatchStore.getState().players.find((p) => p.id === 1);
      let p6 = usePlayMatchStore.getState().players.find((p) => p.id === 6);
      expect(p1?.isOnCourt).toBe(false);
      expect(p1?.secondsPlayed).toBe(120); // Preserved
      expect(p1?.stintSeconds).toBe(0);    // Reset
      expect(p6?.isOnCourt).toBe(true);
      expect(p6?.stintSeconds).toBe(0);    // New stint starts at 0

      // Run another 60s
      store.tickTimer(60);
      p6 = usePlayMatchStore.getState().players.find((p) => p.id === 6);
      expect(p6?.secondsPlayed).toBe(60);
      expect(p6?.stintSeconds).toBe(60);

      // Sub player 1 back in for player 6
      store.toggleSwapMode();
      store.selectSwapCourtPlayer(6);
      store.selectSwapBenchPlayer(1);
      store.confirmSwap();

      p1 = usePlayMatchStore.getState().players.find((p) => p.id === 1);
      expect(p1?.isOnCourt).toBe(true);
      expect(p1?.secondsPlayed).toBe(120); // Cumulative match minutes preserved
      expect(p1?.stintSeconds).toBe(0);    // Continuous stint resets to 0!
    });

    it("should track ScoreEventLink and perform cascading assist deduction on 2pt made basket subtraction", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

      // Kyrie (id 2) scores 2pt basket assisted by Luka (id 1)
      store.recordPlayerStat(2, "t2a", 1);

      let state = usePlayMatchStore.getState();
      expect(state.periods.q1.teamScore).toBe(2);
      expect(state.players.find((p) => p.id === 2)?.t2a).toBe(1);
      expect(state.players.find((p) => p.id === 1)?.asis).toBe(1);
      expect(state.scoreEvents.length).toBe(1);
      expect(state.scoreEvents[0].assistingPlayerId).toBe(1);

      // Subtract 2pt made basket from Kyrie
      store.subtractPlayerStat(2, "t2a");

      state = usePlayMatchStore.getState();
      expect(state.periods.q1.teamScore).toBe(0);
      expect(state.players.find((p) => p.id === 2)?.t2a).toBe(0);
      expect(state.players.find((p) => p.id === 1)?.asis).toBe(0); // Luka's assist cascaded!
      expect(state.scoreEvents.length).toBe(0);
    });

    it("should perform cascading assist deduction on 3pt made basket subtraction", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

      // Klay (id 3) scores 3pt basket assisted by Kyrie (id 2)
      store.recordPlayerStat(3, "t3a", 2);

      let state = usePlayMatchStore.getState();
      expect(state.periods.q1.teamScore).toBe(3);
      expect(state.players.find((p) => p.id === 3)?.t3a).toBe(1);
      expect(state.players.find((p) => p.id === 2)?.asis).toBe(1);

      // Subtract 3pt basket
      store.subtractPlayerStat(3, "t3a");

      state = usePlayMatchStore.getState();
      expect(state.periods.q1.teamScore).toBe(0);
      expect(state.players.find((p) => p.id === 3)?.t3a).toBe(0);
      expect(state.players.find((p) => p.id === 2)?.asis).toBe(0);
    });

    it("should handle unassisted baskets correctly when subtracting made basket", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

      // Luka scores unassisted 2pt
      store.recordPlayerStat(1, "t2a", null);
      expect(usePlayMatchStore.getState().periods.q1.teamScore).toBe(2);

      store.subtractPlayerStat(1, "t2a");
      expect(usePlayMatchStore.getState().periods.q1.teamScore).toBe(0);
      expect(usePlayMatchStore.getState().players.find((p) => p.id === 1)?.t2a).toBe(0);
    });

    it("should floor stats and team fouls at 0 when subtracting", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

      store.subtractPlayerStat(1, "oreb");
      store.subtractPlayerStat(1, "dreb");
      store.subtractPlayerStat(1, "fault");
      store.subtractPlayerStat(1, "t1a");

      const luka = usePlayMatchStore.getState().players.find((p) => p.id === 1);
      expect(luka?.oreb).toBe(0);
      expect(luka?.dreb).toBe(0);
      expect(luka?.falt).toBe(0);
      expect(luka?.t1a).toBe(0);
      expect(usePlayMatchStore.getState().periods.q1.teamFouls).toBe(0);
      expect(usePlayMatchStore.getState().periods.q1.teamScore).toBe(0);
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
  });

  describe("Phase 5: User Story 3 - Unrestricted Substitutions & Timeout Control", () => {
    it("should allow swap mode toggling and confirmation while chronometer is running", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

      // Clock is running
      store.toggleTimer();
      expect(usePlayMatchStore.getState().isTimerRunning).toBe(true);

      // Unrestricted swap mode: can toggle swap mode while clock is running
      store.toggleSwapMode();
      expect(usePlayMatchStore.getState().swap.isSwapMode).toBe(true);

      store.selectSwapCourtPlayer(1);
      store.selectSwapBenchPlayer(6);
      expect(usePlayMatchStore.getState().swap.selectedCourtPlayerIds).toEqual([1]);
      expect(usePlayMatchStore.getState().swap.selectedBenchPlayerIds).toEqual([6]);

      // Confirm swap while clock is running
      store.confirmSwap();

      const state = usePlayMatchStore.getState();
      expect(state.swap.isSwapMode).toBe(false);
      expect(state.players.find((p) => p.id === 1)?.isOnCourt).toBe(false);
      expect(state.players.find((p) => p.id === 6)?.isOnCourt).toBe(true);
      expect(state.getActiveCourtPlayers().filter((p) => p !== null).length).toBe(5);
      expect(state.isTimerRunning).toBe(true); // Timer still running!
    });

    it("should allow swap mode toggling and confirmation while chronometer is paused", () => {
      const store = usePlayMatchStore.getState();
      store.initMatch(101, mockRoster, [1, 2, 3, 4, 5]);

      expect(usePlayMatchStore.getState().isTimerRunning).toBe(false);

      store.toggleSwapMode();
      expect(usePlayMatchStore.getState().swap.isSwapMode).toBe(true);

      store.selectSwapCourtPlayer(1);
      store.selectSwapBenchPlayer(6);
      store.confirmSwap();

      const state = usePlayMatchStore.getState();
      expect(state.swap.isSwapMode).toBe(false);
      expect(state.players.find((p) => p.id === 1)?.isOnCourt).toBe(false);
      expect(state.players.find((p) => p.id === 6)?.isOnCourt).toBe(true);
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

  describe("Phase 6: User Story 4 - Rival Controls", () => {
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
  });
});
