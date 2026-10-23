import {
  calculatePlayerValuation,
  calculateAdvancedStats,
  aggregateTeamTotals,
} from "../utils/calculations";
import { RawTeamTotals, PlayerRosterItem } from "../types";

describe("Match Detail Calculations & Formulas (T006)", () => {
  describe("calculatePlayerValuation", () => {
    it("should compute exact valuation based on made shots, rebounds, assists, steals, turnovers, fouls, and misses", () => {
      const stats = {
        t1a: 3,
        t1i: 4, // 1 miss
        t2a: 5,
        t2i: 8, // 3 miss
        t3a: 2,
        t3i: 4, // 2 miss
        oreb: 2,
        dreb: 5,
        asis: 4,
        rec: 2,
        per: 3,
        falt: 2,
      };

      // made: 3 + 5 + 2 = 10
      // oreb: 2, dreb: 5, asis: 4, rec: 2
      // positive = 10 + 2 + 5 + 4 + 2 = 23
      // per: 3, falt: 2
      // misses: (4-3) + (8-5) + (4-2) = 1 + 3 + 2 = 6
      // negative = 3 + 2 + 6 = 11
      // valuation = 23 - 11 = 12
      expect(calculatePlayerValuation(stats)).toBe(12);
    });

    it("should return negative valuation if negative contributions exceed positives", () => {
      const stats = {
        t1a: 0,
        t1i: 2,
        t2a: 0,
        t2i: 4,
        t3a: 0,
        t3i: 3,
        oreb: 0,
        dreb: 1,
        asis: 0,
        rec: 0,
        per: 4,
        falt: 3,
      };
      // positive = 0 + 0 + 1 + 0 + 0 = 1
      // negative = 4 + 3 + (2 + 4 + 3) = 16
      // valuation = 1 - 16 = -15
      expect(calculatePlayerValuation(stats)).toBe(-15);
    });

    it("should handle null or zero stats gracefully", () => {
      expect(calculatePlayerValuation(null as any)).toBe(0);
      expect(
        calculatePlayerValuation({
          t1a: 0,
          t1i: 0,
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
        })
      ).toBe(0);
    });
  });

  describe("calculateAdvancedStats", () => {
    const sampleTotals: RawTeamTotals = {
      totalPoints: 85,
      totalRivalPoints: 78,
      t1a: 14,
      t1i: 20,
      t2a: 22,
      t2i: 40,
      t3a: 9,
      t3i: 25,
      oreb: 12,
      dreb: 24,
      asis: 18,
      rec: 8,
      per: 14,
      falt: 18,
    };

    it("should compute all 8 advanced metrics accurately", () => {
      const stats = calculateAdvancedStats(sampleTotals);

      // Posesiones = 0.96 * (40 + 25 + 0.44 * 20 + 12 - 14)
      // = 0.96 * (65 + 8.8 + 12 - 14) = 0.96 * 71.8 = 68.928
      expect(stats.posesiones).toBeCloseTo(68.93, 1);

      // OER = (85 / 68.928) * 100 = 123.32
      expect(stats.oer).toBeCloseTo(123.32, 1);

      // DER = (78 / 68.928) * 100 = 113.16
      expect(stats.der).toBeCloseTo(113.16, 1);

      // eFG% = 100 * ((22 + 9 + 0.5 * 9) / (40 + 25)) = 100 * (35.5 / 65) = 54.62%
      expect(stats.efg).toBeCloseTo(54.62, 1);

      // ORB% = 100 * (12 / ((40 - 22) + (25 - 9) + 0.44 * (20 - 14)))
      // missed 2pt = 18, missed 3pt = 16, 0.44 * 6 = 2.64
      // denom = 18 + 16 + 2.64 = 36.64
      // 100 * (12 / 36.64) = 32.75%
      expect(stats.orb).toBeCloseTo(32.75, 1);

      // AST% = 100 * (18 / (40 + 25 + 0.44 * 20 + 14))
      // denom = 65 + 8.8 + 14 = 87.8
      // 100 * (18 / 87.8) = 20.5%
      expect(stats.ast).toBeCloseTo(20.5, 1);

      // TOV% = 100 * (14 / 68.928) = 20.31%
      expect(stats.tov).toBeCloseTo(20.31, 1);

      // FTR = 100 * (14 / (40 + 25)) = 100 * (14 / 65) = 21.54%
      expect(stats.ftr).toBeCloseTo(21.54, 1);
    });

    it("should safely return 0.0 for division by zero scenarios", () => {
      const zeroTotals: RawTeamTotals = {
        totalPoints: 0,
        totalRivalPoints: 0,
        t1a: 0,
        t1i: 0,
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
      };

      const stats = calculateAdvancedStats(zeroTotals);
      expect(stats.posesiones).toBe(0);
      expect(stats.oer).toBe(0);
      expect(stats.der).toBe(0);
      expect(stats.efg).toBe(0);
      expect(stats.orb).toBe(0);
      expect(stats.ast).toBe(0);
      expect(stats.tov).toBe(0);
      expect(stats.ftr).toBe(0);
    });
  });

  describe("aggregateTeamTotals", () => {
    it("should aggregate all player items into RawTeamTotals", () => {
      const players: PlayerRosterItem[] = [
        {
          id: 1,
          statId: 101,
          jerseyNumber: "7",
          firstName: "Luka",
          lastName: "Doncic",
          fullName: "Luka Doncic",
          minutes: 36,
          points: 30,
          valuation: 35,
          t1a: 6,
          t1i: 8,
          t2a: 6,
          t2i: 10,
          t3a: 4,
          t3i: 10,
          oreb: 2,
          dreb: 8,
          totalRebounds: 10,
          asis: 9,
          rec: 2,
          per: 3,
          falt: 2,
        },
        {
          id: 2,
          statId: 102,
          jerseyNumber: "11",
          firstName: "Kyrie",
          lastName: "Irving",
          fullName: "Kyrie Irving",
          minutes: 34,
          points: 25,
          valuation: 28,
          t1a: 4,
          t1i: 4,
          t2a: 6,
          t2i: 11,
          t3a: 3,
          t3i: 7,
          oreb: 1,
          dreb: 3,
          totalRebounds: 4,
          asis: 6,
          rec: 1,
          per: 2,
          falt: 3,
        },
      ];

      const totals = aggregateTeamTotals(players, 65);
      expect(totals.totalPoints).toBe(55);
      expect(totals.totalRivalPoints).toBe(65);
      expect(totals.t1a).toBe(10);
      expect(totals.t1i).toBe(12);
      expect(totals.t2a).toBe(12);
      expect(totals.t2i).toBe(21);
      expect(totals.t3a).toBe(7);
      expect(totals.t3i).toBe(17);
      expect(totals.oreb).toBe(3);
      expect(totals.dreb).toBe(11);
      expect(totals.asis).toBe(15);
      expect(totals.rec).toBe(3);
      expect(totals.per).toBe(5);
      expect(totals.falt).toBe(5);
    });

    it("should handle empty player roster gracefully", () => {
      const totals = aggregateTeamTotals([], 40);
      expect(totals.totalPoints).toBe(0);
      expect(totals.totalRivalPoints).toBe(40);
      expect(totals.t1a).toBe(0);
    });
  });
});
