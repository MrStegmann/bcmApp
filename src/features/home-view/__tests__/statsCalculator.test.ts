import {
  computeGameAdvancedMetrics,
  computeGlobalAverages,
  formatMetricValue,
  GameStatsRecord,
} from "../utils/statsCalculator";
import { PlayerStat } from "../../../types/database";

describe("statsCalculator Unit Tests (T015 - US3)", () => {
  const dummyPlayerStat1: PlayerStat = {
    id: 1,
    gameId: 10,
    playerId: 101,
    minutes: 25,
    t1a: 4,
    t1i: 6,
    t2a: 5,
    t2i: 10,
    t3a: 2,
    t3i: 6,
    oreb: 3,
    dreb: 5,
    asis: 4,
    rec: 2,
    per: 3,
    falt: 2,
    valuation: 15,
  };

  const dummyPlayerStat2: PlayerStat = {
    id: 2,
    gameId: 10,
    playerId: 102,
    minutes: 20,
    t1a: 2,
    t1i: 4,
    t2a: 3,
    t2i: 6,
    t3a: 1,
    t3i: 4,
    oreb: 2,
    dreb: 4,
    asis: 2,
    rec: 1,
    per: 2,
    falt: 1,
    valuation: 9,
  };

  describe("computeGameAdvancedMetrics", () => {
    it("should compute all 8 metrics accurately for a game", () => {
      // Team totals:
      // t1a: 6, t1i: 10
      // t2a: 8, t2i: 16
      // t3a: 3, t3i: 10
      // oreb: 5, dreb: 9, asis: 6, rec: 3, per: 5, falt: 3
      // Total Points = 6 + 16 + 9 = 31
      // Total Rival Points = 28
      // fga = 16 + 10 = 26
      // rawPos = 0.96 * (26 + 0.44 * 10 + 5 - 5) = 0.96 * (30.4) = 29.184
      const metrics = computeGameAdvancedMetrics(
        [dummyPlayerStat1, dummyPlayerStat2],
        31,
        28
      );

      expect(metrics.posesiones).toBeCloseTo(29.184, 2);
      expect(metrics.oer).toBeCloseTo((31 / 29.184) * 100, 2);
      expect(metrics.der).toBeCloseTo((28 / 29.184) * 100, 2);
      // efg: 100 * (8 + 3 + 1.5) / 26 = 100 * 12.5 / 26 = 48.077%
      expect(metrics.efg).toBeCloseTo(48.077, 2);
      // orb%: 100 * (5 / ((16-8) + (10-3) + 0.44 * (10-6))) = 100 * (5 / (8 + 7 + 1.76)) = 100 * (5 / 16.76) = 29.833%
      expect(metrics.orb).toBeCloseTo(29.833, 2);
      // ast%: 100 * (6 / (26 + 4.4 + 5)) = 100 * (6 / 35.4) = 16.949%
      expect(metrics.ast).toBeCloseTo(16.949, 2);
      // tov%: 100 * (5 / 29.184) = 17.133%
      expect(metrics.tov).toBeCloseTo(17.133, 2);
      // ftr: 100 * (6 / 26) = 23.077%
      expect(metrics.ftr).toBeCloseTo(23.077, 2);
    });

    it("should return zeros safely when player stats or denominators are zero (division-by-zero protection)", () => {
      const metrics = computeGameAdvancedMetrics([], 0, 0);

      expect(metrics.posesiones).toBe(0);
      expect(metrics.oer).toBe(0);
      expect(metrics.der).toBe(0);
      expect(metrics.efg).toBe(0);
      expect(metrics.orb).toBe(0);
      expect(metrics.ast).toBe(0);
      expect(metrics.tov).toBe(0);
      expect(metrics.ftr).toBe(0);
    });
  });

  describe("computeGlobalAverages", () => {
    it("should compute exact arithmetic mean across completed games", () => {
      const game1: GameStatsRecord = {
        gameId: 1,
        totalPoints: 75,
        totalRivalPoints: 70,
        playerStats: [dummyPlayerStat1],
      };
      const game2: GameStatsRecord = {
        gameId: 2,
        totalPoints: 80,
        totalRivalPoints: 75,
        playerStats: [dummyPlayerStat2],
      };

      const m1 = computeGameAdvancedMetrics(game1.playerStats, 75, 70);
      const m2 = computeGameAdvancedMetrics(game2.playerStats, 80, 75);

      const averages = computeGlobalAverages([game1, game2]);

      expect(averages.completedMatchesCount).toBe(2);
      expect(averages.posesiones).toBeCloseTo((m1.posesiones + m2.posesiones) / 2, 2);
      expect(averages.oer).toBeCloseTo((m1.oer + m2.oer) / 2, 2);
      expect(averages.der).toBeCloseTo((m1.der + m2.der) / 2, 2);
      expect(averages.efg).toBeCloseTo((m1.efg + m2.efg) / 2, 2);
      expect(averages.orb).toBeCloseTo((m1.orb + m2.orb) / 2, 2);
      expect(averages.ast).toBeCloseTo((m1.ast + m2.ast) / 2, 2);
      expect(averages.tov).toBeCloseTo((m1.tov + m2.tov) / 2, 2);
      expect(averages.ftr).toBeCloseTo((m1.ftr + m2.ftr) / 2, 2);
    });

    it("should return clean 0.0 averages when 0 completed games exist", () => {
      const averages = computeGlobalAverages([]);

      expect(averages.completedMatchesCount).toBe(0);
      expect(averages.posesiones).toBe(0);
      expect(averages.oer).toBe(0);
      expect(averages.der).toBe(0);
      expect(averages.efg).toBe(0);
      expect(averages.orb).toBe(0);
      expect(averages.ast).toBe(0);
      expect(averages.tov).toBe(0);
      expect(averages.ftr).toBe(0);
    });
  });

  describe("formatMetricValue", () => {
    it("should format percentages with % symbol and decimal precision", () => {
      expect(formatMetricValue(54.234, true)).toBe("54.2%");
      expect(formatMetricValue(0, true)).toBe("0.0%");
    });

    it("should format rating or counts with single decimal precision", () => {
      expect(formatMetricValue(112.56, false)).toBe("112.6");
      expect(formatMetricValue(0, false)).toBe("0.0");
    });
  });
});
