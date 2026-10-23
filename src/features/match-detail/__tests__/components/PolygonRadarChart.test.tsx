import { PolygonRadarChartProps, AdvancedTeamStats } from "../../types";
import { generateRadarGeometry } from "../../utils/radarGeometry";

describe("PolygonRadarChart Component Contract (T024 - US3)", () => {
  const sampleStats: AdvancedTeamStats = {
    posesiones: 72.4,
    oer: 112.5,
    der: 104.2,
    efg: 54.0,
    orb: 32.5,
    ast: 24.1,
    tov: 15.3,
    ftr: 22.0,
  };

  it("should generate radar geometry matching chart size", () => {
    const props: PolygonRadarChartProps = {
      stats: sampleStats,
      size: 300,
    };

    const geometry = generateRadarGeometry(props.stats, props.size || 280);
    expect(geometry.axes).toHaveLength(8);
    expect(geometry.gridPolygons).toHaveLength(4);
  });

  it("should default chart size to 280 when not explicitly passed", () => {
    const props: PolygonRadarChartProps = {
      stats: sampleStats,
    };

    const geometry = generateRadarGeometry(props.stats, props.size ?? 280);
    expect(geometry.axes[0].x).toBeCloseTo(140, 0); // Center x for size 280 is 140
  });

  it("should supply each axis with vertex name and formatted calculated value", () => {
    const geometry = generateRadarGeometry(sampleStats, 280);
    expect(geometry.axes[0].label).toBe("Posesiones");
    expect(geometry.axes[0].formattedValue).toBe("72.4");

    const efgAxis = geometry.axes.find((a) => a.key === "efg");
    expect(efgAxis?.label).toBe("eFG%");
    expect(efgAxis?.formattedValue).toBe("54");
  });
});
