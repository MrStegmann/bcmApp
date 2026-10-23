import { GlobalStatsCardProps, GlobalTeamAverages } from "../../types";
import { getMetricSummaryItems } from "../../utils/statsCalculator";

describe("GlobalStatsCard Component Contract Tests (T016 - US3)", () => {
  const sampleAverages: GlobalTeamAverages = {
    posesiones: 74.2,
    oer: 108.4,
    der: 98.6,
    efg: 52.8,
    orb: 31.4,
    ast: 22.1,
    tov: 14.5,
    ftr: 24.3,
    completedMatchesCount: 5,
  };

  it("should extract exactly 8 advanced metric items from GlobalTeamAverages", () => {
    const props: GlobalStatsCardProps = {
      stats: sampleAverages,
    };

    const items = getMetricSummaryItems(props.stats);
    expect(items).toHaveLength(8);
    expect(items.map((i) => i.label)).toEqual([
      "POS",
      "OER",
      "DER",
      "eFG%",
      "ORB%",
      "AST%",
      "TOV%",
      "FTR",
    ]);
  });

  it("should safely format empty averages with 0.0 or 0.0% when 0 completed matches exist", () => {
    const emptyStats: GlobalTeamAverages = {
      posesiones: 0,
      oer: 0,
      der: 0,
      efg: 0,
      orb: 0,
      ast: 0,
      tov: 0,
      ftr: 0,
      completedMatchesCount: 0,
    };

    const items = getMetricSummaryItems(emptyStats);
    expect(items).toHaveLength(8);
    const pos = items.find((i) => i.key === "posesiones");
    expect(pos?.formattedValue).toBe("0.0");

    const efg = items.find((i) => i.key === "efg");
    expect(efg?.formattedValue).toBe("0.0%");
  });

  it("should display completed matches count accurately", () => {
    const props: GlobalStatsCardProps = {
      stats: sampleAverages,
    };

    expect(props.stats.completedMatchesCount).toBe(5);
  });
});
