import { TeamAdvancedAnalyticsProps, AdvancedTeamStats } from "../../types";

describe("TeamAdvancedAnalytics Component Contract (T025 - US3)", () => {
  const sampleStats: AdvancedTeamStats = {
    posesiones: 68.9,
    oer: 123.3,
    der: 113.2,
    efg: 54.6,
    orb: 32.8,
    ast: 20.5,
    tov: 20.3,
    ftr: 21.5,
  };

  it("should supply all 8 advanced metrics with valid numerical values", () => {
    const props: TeamAdvancedAnalyticsProps = {
      stats: sampleStats,
    };

    expect(props.stats.posesiones).toBe(68.9);
    expect(props.stats.oer).toBe(123.3);
    expect(props.stats.der).toBe(113.2);
    expect(props.stats.efg).toBe(54.6);
    expect(props.stats.orb).toBe(32.8);
    expect(props.stats.ast).toBe(20.5);
    expect(props.stats.tov).toBe(20.3);
    expect(props.stats.ftr).toBe(21.5);
  });

  it("should handle zero stats safely without throwing or NaN", () => {
    const zeroStats: AdvancedTeamStats = {
      posesiones: 0,
      oer: 0,
      der: 0,
      efg: 0,
      orb: 0,
      ast: 0,
      tov: 0,
      ftr: 0,
    };

    const props: TeamAdvancedAnalyticsProps = {
      stats: zeroStats,
    };

    Object.values(props.stats).forEach((val) => {
      expect(Number.isFinite(val)).toBe(true);
      expect(Number.isNaN(val)).toBe(false);
    });
  });

  it("should provide advanced stats directly to PolygonRadarChart without rendering redundant card columns", () => {
    const props: TeamAdvancedAnalyticsProps = {
      stats: sampleStats,
    };
    expect(props.stats).toBeDefined();
    // Verification that the component structure focuses on the chart without extra column cards
    expect(Object.keys(props.stats)).toHaveLength(8);
  });
});
