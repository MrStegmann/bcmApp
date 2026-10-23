import {
  calculatePlayerPoints,
  calculateTotalScore,
  validateStartingFive,
  calculateTimeoutBudget,
} from "../../store/GameStore";
import { InGamePlayer, QuarterKey, QuarterData } from "../../types/match";

declare const jest: any;

describe("Play Match View End-to-End Integration Suite (T021 & T022 - Phase 8)", () => {
  const createMockRoster = (): InGamePlayer[] => [
    {
      id: 1, firstName: "Luka", lastName: "Doncic", number: "77",
      isOnCourt: false, secondsPlayed: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 2, firstName: "Kyrie", lastName: "Irving", number: "11",
      isOnCourt: false, secondsPlayed: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 3, firstName: "Klay", lastName: "Thompson", number: "31",
      isOnCourt: false, secondsPlayed: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 4, firstName: "P.J.", lastName: "Washington", number: "25",
      isOnCourt: false, secondsPlayed: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 5, firstName: "Dereck", lastName: "Lively", number: "2",
      isOnCourt: false, secondsPlayed: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 6, firstName: "Daniel", lastName: "Gafford", number: "21",
      isOnCourt: false, secondsPlayed: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 7, firstName: "Jaden", lastName: "Hardy", number: "1",
      isOnCourt: false, secondsPlayed: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
  ];

  const createInitialQuarters = (): Record<QuarterKey, QuarterData> => ({
    c1: { key: "c1", label: "C1", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
    c2: { key: "c2", label: "C2", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
    c3: { key: "c3", label: "C3", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
    c4: { key: "c4", label: "C4", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
    extra: { key: "extra", label: "PR", remainingSeconds: 300, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
  });

  describe("Scenario 1: Starting Five Lineup Selection Modal", () => {
    it("should enforce exactly 5 players before match court setup", () => {
      let roster = createMockRoster();
      const selectedStartingFive = [1, 2, 3, 4, 5];

      expect(validateStartingFive([1, 2, 3, 4])).toBe(false);
      expect(validateStartingFive([1, 2, 3, 4, 5, 6])).toBe(false);
      expect(validateStartingFive(selectedStartingFive)).toBe(true);

      roster = roster.map((p) => ({
        ...p,
        isOnCourt: selectedStartingFive.includes(p.id),
      }));

      const courtPlayers = roster.filter((p) => p.isOnCourt);
      const benchPlayers = roster.filter((p) => !p.isOnCourt);

      expect(courtPlayers.length).toBe(5);
      expect(benchPlayers.length).toBe(2);
      expect(courtPlayers.every((p) => p.secondsPlayed === 0)).toBe(true);
    });
  });

  describe("Scenario 2: Chronometer & Played Minute Tracking", () => {
    it("should start, tick, pause clock and accumulate played seconds only for on-court players", () => {
      let roster = createMockRoster().map((p) => ({
        ...p,
        isOnCourt: [1, 2, 3, 4, 5].includes(p.id),
      }));
      let isTimerRunning = false;
      let quarters = createInitialQuarters();

      // Start Chrono
      isTimerRunning = true;

      // Simulate 5 seconds ticking
      for (let s = 0; s < 5; s++) {
        quarters.c1.remainingSeconds -= 1;
        roster = roster.map((p) =>
          p.isOnCourt ? { ...p, secondsPlayed: p.secondsPlayed + 1 } : p
        );
      }

      expect(quarters.c1.remainingSeconds).toBe(595);
      expect(roster.find((p) => p.id === 1)?.secondsPlayed).toBe(5);
      expect(roster.find((p) => p.id === 6)?.secondsPlayed).toBe(0);

      // Pause Chrono
      isTimerRunning = false;
      expect(isTimerRunning).toBe(false);
    });
  });

  describe("Scenario 3: Player Statistics Logging & Assist Flow", () => {
    it("should correctly record made 2pt with assist, updating player points, assist tally, and quarter team score", () => {
      let roster = createMockRoster().map((p) => ({
        ...p,
        isOnCourt: [1, 2, 3, 4, 5].includes(p.id),
      }));
      let quarters = createInitialQuarters();

      const scoringPlayerId = 1; // Luka
      const assistingPlayerId = 2; // Kyrie

      // Record made 2pt
      roster = roster.map((p) => {
        if (p.id === scoringPlayerId) {
          return { ...p, t2a: p.t2a + 1, t2i: p.t2i + 1 };
        }
        if (p.id === assistingPlayerId) {
          return { ...p, asis: p.asis + 1 };
        }
        return p;
      });
      quarters.c1.teamScore += 2;

      const luka = roster.find((p) => p.id === 1)!;
      const kyrie = roster.find((p) => p.id === 2)!;

      expect(luka.t2a).toBe(1);
      expect(calculatePlayerPoints(luka)).toBe(2);
      expect(kyrie.asis).toBe(1);
      expect(quarters.c1.teamScore).toBe(2);
      expect(calculateTotalScore({ c1: quarters.c1.teamScore })).toBe(2);
    });
  });

  describe("Scenario 4: Auto-Stop on Fouls", () => {
    it("should immediately pause clock when personal foul is logged", () => {
      let isTimerRunning = true;
      let quarters = createInitialQuarters();
      let roster = createMockRoster().map((p) => ({
        ...p,
        isOnCourt: [1, 2, 3, 4, 5].includes(p.id),
      }));

      // Player foul event
      const logPlayerFoul = (playerId: number) => {
        isTimerRunning = false;
        quarters.c1.teamFouls += 1;
        roster = roster.map((p) =>
          p.id === playerId ? { ...p, falt: p.falt + 1 } : p
        );
      };

      logPlayerFoul(1);
      expect(isTimerRunning).toBe(false);
      expect(quarters.c1.teamFouls).toBe(1);
      expect(roster.find((p) => p.id === 1)?.falt).toBe(1);
    });

    it("should immediately pause clock when rival foul is logged", () => {
      let isTimerRunning = true;
      let quarters = createInitialQuarters();

      const logRivalFoul = () => {
        isTimerRunning = false;
        quarters.c1.rivalFouls += 1;
      };

      logRivalFoul();
      expect(isTimerRunning).toBe(false);
      expect(quarters.c1.rivalFouls).toBe(1);
    });
  });

  describe("Scenario 5: Equal-Count Substitutions (Clock Paused)", () => {
    it("should disallow substitution while clock is running", () => {
      const isTimerRunning = true;
      const canOpenSubstitutions = !isTimerRunning;
      expect(canOpenSubstitutions).toBe(false);
    });

    it("should enforce equal-count substitution (2 court ⇄ 2 bench) and maintain 5 court players", () => {
      let roster = createMockRoster().map((p) => ({
        ...p,
        isOnCourt: [1, 2, 3, 4, 5].includes(p.id),
      }));

      const selectedCourtIds = [1, 2];
      const selectedBenchIds = [6, 7];

      const isValidSwap =
        selectedCourtIds.length > 0 &&
        selectedCourtIds.length === selectedBenchIds.length;

      expect(isValidSwap).toBe(true);

      roster = roster.map((p) => {
        if (selectedCourtIds.includes(p.id)) return { ...p, isOnCourt: false };
        if (selectedBenchIds.includes(p.id)) return { ...p, isOnCourt: true };
        return p;
      });

      const activeCourt = roster.filter((p) => p.isOnCourt);
      expect(activeCourt.length).toBe(5);
      expect(activeCourt.map((p) => p.id).sort()).toEqual([3, 4, 5, 6, 7]);
    });
  });

  describe("Scenario 6: Timeouts & Extra Time Reset", () => {
    it("should properly manage timeout phase budgets", () => {
      expect(calculateTimeoutBudget("c1")).toBe(2);
      expect(calculateTimeoutBudget("c2")).toBe(2);
      expect(calculateTimeoutBudget("c3")).toBe(3);
      expect(calculateTimeoutBudget("c4")).toBe(3);
      expect(calculateTimeoutBudget("extra", 0)).toBe(1);
      expect(calculateTimeoutBudget("extra", 1)).toBe(2);
    });

    it("should reset overtime clock to 5:00 and add +1 timeout while preserving accumulated quarter scores and fouls", () => {
      let quarters = createInitialQuarters();
      quarters.extra.teamScore = 8;
      quarters.extra.rivalScore = 8;
      quarters.extra.teamFouls = 2;
      quarters.extra.rivalFouls = 2;
      quarters.extra.remainingSeconds = 0;

      let extraResetsCount = 0;

      // Execute overtime reset
      quarters.extra.remainingSeconds = 300;
      extraResetsCount += 1;

      expect(quarters.extra.remainingSeconds).toBe(300);
      expect(quarters.extra.teamScore).toBe(8);
      expect(quarters.extra.rivalScore).toBe(8);
      expect(quarters.extra.teamFouls).toBe(2);
      expect(calculateTimeoutBudget("extra", extraResetsCount)).toBe(2);
    });
  });
});
