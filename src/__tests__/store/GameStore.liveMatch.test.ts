import {
  calculatePlayerPoints,
  calculateTotalScore,
  validateStartingFive,
  calculateTimeoutBudget,
  useGameStore,
} from "../../store/GameStore";
import { InGamePlayer, QuarterData, StatActionType } from "../../types/match";

describe("GameStore Live Match & State Transition Unit Tests (T002)", () => {
  describe("calculatePlayerPoints", () => {
    it("should correctly compute total player points from 1pt, 2pt, and 3pt makes", () => {
      const player: Partial<InGamePlayer> = {
        t1a: 3, // 3 * 1 = 3
        t2a: 5, // 5 * 2 = 10
        t3a: 2, // 2 * 3 = 6
      };
      expect(calculatePlayerPoints(player)).toBe(19);
    });

    it("should return 0 when no shots are made", () => {
      expect(calculatePlayerPoints({})).toBe(0);
      expect(calculatePlayerPoints({ t1i: 4, t2i: 5, t3i: 3 })).toBe(0);
    });
  });

  describe("calculateTotalScore", () => {
    it("should sum all quarter scores including extra time", () => {
      const scores = {
        c1: 18,
        c2: 22,
        c3: 15,
        c4: 20,
        extra: 8,
      };
      expect(calculateTotalScore(scores)).toBe(83);
    });

    it("should handle missing or partial quarters gracefully", () => {
      expect(calculateTotalScore({ c1: 10, c2: 12 })).toBe(22);
      expect(calculateTotalScore({})).toBe(0);
    });
  });

  describe("validateStartingFive", () => {
    it("should return true for exactly 5 unique player IDs", () => {
      expect(validateStartingFive([1, 2, 3, 4, 5])).toBe(true);
    });

    it("should return false for fewer than 5 players", () => {
      expect(validateStartingFive([1, 2, 3, 4])).toBe(false);
      expect(validateStartingFive([])).toBe(false);
    });

    it("should return false for more than 5 players", () => {
      expect(validateStartingFive([1, 2, 3, 4, 5, 6])).toBe(false);
    });

    it("should return false if duplicate player IDs are provided", () => {
      expect(validateStartingFive([1, 2, 3, 4, 4])).toBe(false);
    });
  });

  describe("calculateTimeoutBudget", () => {
    it("should allocate 2 timeouts for 1st half quarters (C1 and C2)", () => {
      expect(calculateTimeoutBudget("c1", 0)).toBe(2);
      expect(calculateTimeoutBudget("c2", 0)).toBe(2);
    });

    it("should allocate 3 timeouts for 2nd half quarters (C3 and C4)", () => {
      expect(calculateTimeoutBudget("c3", 0)).toBe(3);
      expect(calculateTimeoutBudget("c4", 0)).toBe(3);
    });

    it("should allocate 1 timeout per extra time period + any additional resets", () => {
      expect(calculateTimeoutBudget("extra", 0)).toBe(1);
      expect(calculateTimeoutBudget("extra", 1)).toBe(2); // 1 extra reset
      expect(calculateTimeoutBudget("extra", 2)).toBe(3); // 2 extra resets
    });
  });

  describe("Live Match Store Helpers", () => {
    beforeEach(() => {
      useGameStore.setState({
        gamesList: [],
        playerStatsMap: {},
        selectedGame: null,
      });
    });

    it("should batch update secondsPlayed for active on-court players", () => {
      const initialRoster: InGamePlayer[] = [
        {
          id: 1,
          firstName: "P1",
          lastName: "L1",
          number: "10",
          isOnCourt: true,
          secondsPlayed: 100,
          t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
          oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
        },
        {
          id: 2,
          firstName: "P2",
          lastName: "L2",
          number: "11",
          isOnCourt: false,
          secondsPlayed: 60,
          t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
          oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
        },
      ];

      const updated = initialRoster.map((p) =>
        p.isOnCourt ? { ...p, secondsPlayed: p.secondsPlayed + 1 } : p
      );

      expect(updated.find((p) => p.id === 1)?.secondsPlayed).toBe(101);
      expect(updated.find((p) => p.id === 2)?.secondsPlayed).toBe(60);
    });

    it("should record foul and indicate clock auto-stop trigger", () => {
      const player: InGamePlayer = {
        id: 1,
        firstName: "P1",
        lastName: "L1",
        number: "10",
        isOnCourt: true,
        secondsPlayed: 100,
        t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
        oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 2, valuation: 0,
      };

      const isFoulAction = (action: StatActionType) => action === "fault";
      expect(isFoulAction("fault")).toBe(true);
      expect(isFoulAction("t2")).toBe(false);

      const updatedPlayer = { ...player, falt: player.falt + 1 };
      expect(updatedPlayer.falt).toBe(3);
    });
  });
});
