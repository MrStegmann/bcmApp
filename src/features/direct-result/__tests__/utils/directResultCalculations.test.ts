import {
  sanitizePositiveInteger,
  calculatePeriodTotals,
  calculatePlayerPoints,
  calculateValuation,
  validateDirectResult,
  buildInitialDirectResultBuffer,
} from "../../utils/directResultCalculations";
import { DirectResultBuffer, PeriodKey, PeriodScoreInput } from "../../types";
import { Player } from "../../../../types/database";

describe("directResultCalculations (T003 / T004)", () => {
  describe("sanitizePositiveInteger", () => {
    it("should parse valid positive strings and numbers", () => {
      expect(sanitizePositiveInteger("12")).toBe(12);
      expect(sanitizePositiveInteger(25)).toBe(25);
      expect(sanitizePositiveInteger("0")).toBe(0);
    });

    it("should return 0 for empty, null, undefined or whitespace", () => {
      expect(sanitizePositiveInteger("")).toBe(0);
      expect(sanitizePositiveInteger("   ")).toBe(0);
      expect(sanitizePositiveInteger(null as any)).toBe(0);
      expect(sanitizePositiveInteger(undefined as any)).toBe(0);
    });

    it("should convert negative numbers or negative strings to 0", () => {
      expect(sanitizePositiveInteger("-5")).toBe(0);
      expect(sanitizePositiveInteger(-10)).toBe(0);
    });

    it("should handle floating point numbers by truncating / rounding to integer", () => {
      expect(sanitizePositiveInteger("12.8")).toBe(12);
      expect(sanitizePositiveInteger(15.2)).toBe(15);
    });
  });

  describe("calculatePeriodTotals", () => {
    const mockPeriods: Record<PeriodKey, PeriodScoreInput> = {
      q1: { teamPoints: 20, teamFouls: 3, rivalPoints: 15, rivalFouls: 4 },
      q2: { teamPoints: 18, teamFouls: 4, rivalPoints: 22, rivalFouls: 2 },
      q3: { teamPoints: 25, teamFouls: 2, rivalPoints: 20, rivalFouls: 5 },
      q4: { teamPoints: 17, teamFouls: 5, rivalPoints: 23, rivalFouls: 3 },
      extra: { teamPoints: 10, teamFouls: 1, rivalPoints: 8, rivalFouls: 2 },
    };

    it("should sum regulation periods Q1-Q4 when hasExtraTime is false", () => {
      const totals = calculatePeriodTotals(mockPeriods, false);
      expect(totals.totalTeamPoints).toBe(20 + 18 + 25 + 17); // 80
      expect(totals.totalRivalPoints).toBe(15 + 22 + 20 + 23); // 80
      expect(totals.totalTeamFouls).toBe(3 + 4 + 2 + 5); // 14
      expect(totals.totalRivalFouls).toBe(4 + 2 + 5 + 3); // 14
    });

    it("should include extra period when hasExtraTime is true", () => {
      const totals = calculatePeriodTotals(mockPeriods, true);
      expect(totals.totalTeamPoints).toBe(80 + 10); // 90
      expect(totals.totalRivalPoints).toBe(80 + 8); // 88
      expect(totals.totalTeamFouls).toBe(14 + 1); // 15
      expect(totals.totalRivalFouls).toBe(14 + 2); // 16
    });

    it("should handle missing or partial period structures safely", () => {
      const totals = calculatePeriodTotals({} as any, false);
      expect(totals.totalTeamPoints).toBe(0);
      expect(totals.totalRivalPoints).toBe(0);
      expect(totals.totalTeamFouls).toBe(0);
      expect(totals.totalRivalFouls).toBe(0);
    });
  });

  describe("calculatePlayerPoints", () => {
    it("should accurately calculate points from made shots", () => {
      expect(calculatePlayerPoints({ t1a: 4, t2a: 5, t3a: 2 })).toBe(4 * 1 + 5 * 2 + 2 * 3); // 20
      expect(calculatePlayerPoints({ t1a: 0, t2a: 0, t3a: 0 })).toBe(0);
    });
  });

  describe("calculateValuation", () => {
    it("should calculate correct FIBA PIR valuation", () => {
      const stat = {
        t1a: 2,
        t1i: 3, // 1 miss
        t2a: 4,
        t2i: 6, // 2 miss
        t3a: 1,
        t3i: 2, // 1 miss
        oreb: 2,
        dreb: 3, // 5 reb
        asis: 4,
        rec: 2,
        per: 1,
        falt: 2,
      };

      // Made: 2 + 4 + 1 = 7
      // Rebounds: 5
      // Asis: 4, Rec: 2
      // Positive: 7 + 5 + 4 + 2 = 18
      // Negative: per(1) + falt(2) + miss(1+2+1=4) = 7
      // Valuation: 18 - 7 = 11
      expect(calculateValuation(stat)).toBe(11);
    });

    it("should handle empty or zero stats without NaN", () => {
      expect(calculateValuation({} as any)).toBe(0);
    });
  });

  describe("validateDirectResult", () => {
    it("should return valid for well-formed buffer", () => {
      const buffer: DirectResultBuffer = {
        hasExtraTime: false,
        periods: {
          q1: { teamPoints: 10, teamFouls: 2, rivalPoints: 12, rivalFouls: 3 },
          q2: { teamPoints: 15, teamFouls: 1, rivalPoints: 10, rivalFouls: 2 },
          q3: { teamPoints: 20, teamFouls: 4, rivalPoints: 18, rivalFouls: 1 },
          q4: { teamPoints: 12, teamFouls: 2, rivalPoints: 14, rivalFouls: 4 },
          extra: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
        },
        players: {
          1: {
            playerId: 1,
            minutes: 15,
            t1a: 1,
            t1i: 2,
            t2a: 3,
            t2i: 5,
            t3a: 0,
            t3i: 1,
            oreb: 1,
            dreb: 2,
            asis: 1,
            rec: 0,
            per: 1,
            falt: 2,
          },
        },
      };

      const result = validateDirectResult(buffer);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect attempt less than made shots", () => {
      const buffer: DirectResultBuffer = {
        hasExtraTime: false,
        periods: {
          q1: { teamPoints: 10, teamFouls: 2, rivalPoints: 12, rivalFouls: 3 },
          q2: { teamPoints: 15, teamFouls: 1, rivalPoints: 10, rivalFouls: 2 },
          q3: { teamPoints: 20, teamFouls: 4, rivalPoints: 18, rivalFouls: 1 },
          q4: { teamPoints: 12, teamFouls: 2, rivalPoints: 14, rivalFouls: 4 },
          extra: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
        },
        players: {
          1: {
            playerId: 1,
            minutes: 15,
            t1a: 3,
            t1i: 1, // Invalid: made > attempted
            t2a: 0,
            t2i: 0,
            t3a: 0,
            t3i: 0,
            oreb: 0,
            dreb: 0,
            asis: 0,
            rec: 0,
            per: 0,
            falt: 0,
          },
        },
      };

      const result = validateDirectResult(buffer);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("buildInitialDirectResultBuffer", () => {
    it("should initialize default buffer with empty periods and players", () => {
      const mockPlayers: Player[] = [
        { id: 1, teamId: 10, firstName: "Luka", lastName: "Doncic", number: "77", jerseyName: "Doncic", createdAt: "" },
        { id: 2, teamId: 10, firstName: "Kyrie", lastName: "Irving", number: "11", jerseyName: "Irving", createdAt: "" },
      ];

      const buffer = buildInitialDirectResultBuffer(mockPlayers);
      expect(buffer.hasExtraTime).toBe(false);
      expect(buffer.periods.q1).toEqual({ teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 });
      expect(buffer.periods.extra).toEqual({ teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 });
      expect(buffer.players[1]).toBeDefined();
      expect(buffer.players[1].playerId).toBe(1);
      expect(buffer.players[1].minutes).toBe(0);
      expect(buffer.players[2]).toBeDefined();
      expect(buffer.players[2].playerId).toBe(2);
    });
  });
});
