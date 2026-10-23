import {
  normalizeMetric,
  generateRadarGeometry,
  RADAR_METRIC_ORDER,
} from "../utils/radarGeometry";
import { AdvancedTeamStats } from "../types";

describe("Radar Geometry & Normalization Unit Tests (T008)", () => {
  describe("normalizeMetric", () => {
    it("should clamp normalized values between 0.1 and 1.0", () => {
      // Extremely low or zero value should clamp to 0.1
      expect(normalizeMetric("posesiones", 0)).toBe(0.1);
      expect(normalizeMetric("efg", 0)).toBe(0.1);

      // Extremely high values should clamp to 1.0
      expect(normalizeMetric("posesiones", 150)).toBe(1.0);
      expect(normalizeMetric("oer", 200)).toBe(1.0);
      expect(normalizeMetric("efg", 90)).toBe(1.0);
    });

    it("should scale mid-range values proportionally", () => {
      const efgNorm = normalizeMetric("efg", 50); // within [30, 70]
      expect(efgNorm).toBeGreaterThan(0.1);
      expect(efgNorm).toBeLessThan(1.0);
      expect(efgNorm).toBeCloseTo(0.55, 1);
    });
  });

  describe("generateRadarGeometry", () => {
    const sampleStats: AdvancedTeamStats = {
      posesiones: 70,
      oer: 105,
      der: 98,
      efg: 52,
      orb: 30,
      ast: 22,
      tov: 16,
      ftr: 25,
    };

    it("should generate 8 axes corresponding to RADAR_METRIC_ORDER", () => {
      const geometry = generateRadarGeometry(sampleStats, 280);

      expect(geometry.axes).toHaveLength(8);
      expect(geometry.axes.map((a) => a.key)).toEqual(RADAR_METRIC_ORDER);
    });

    it("should generate valid SVG polygon points string for data polygon", () => {
      const geometry = generateRadarGeometry(sampleStats, 280);

      expect(typeof geometry.polygonPointsSvg).toBe("string");
      const points = geometry.polygonPointsSvg.split(" ");
      expect(points).toHaveLength(8);
      points.forEach((pt) => {
        const [x, y] = pt.split(",").map(Number);
        expect(Number.isFinite(x)).toBe(true);
        expect(Number.isFinite(y)).toBe(true);
      });
    });

    it("should generate concentric grid polygons for 25%, 50%, 75%, and 100% webs", () => {
      const geometry = generateRadarGeometry(sampleStats, 280);

      expect(geometry.gridPolygons).toHaveLength(4);
      geometry.gridPolygons.forEach((poly) => {
        const points = poly.split(" ");
        expect(points).toHaveLength(8);
      });
    });

    it("should format vertex names and calculated values as expected (e.g. Posesiones 80, OER 14.75, eFG% 17.39)", () => {
      const customStats: AdvancedTeamStats = {
        posesiones: 80,
        oer: 14.75,
        der: 12.30,
        efg: 17.39,
        orb: 25.0,
        ast: 18.55,
        tov: 11.2,
        ftr: 30,
      };

      const geometry = generateRadarGeometry(customStats, 280);
      const posAxis = geometry.axes.find((a) => a.key === "posesiones");
      expect(posAxis?.label).toBe("Posesiones");
      expect(posAxis?.formattedValue).toBe("80");

      const oerAxis = geometry.axes.find((a) => a.key === "oer");
      expect(oerAxis?.label).toBe("OER");
      expect(oerAxis?.formattedValue).toBe("14.75");

      const efgAxis = geometry.axes.find((a) => a.key === "efg");
      expect(efgAxis?.label).toBe("eFG%");
      expect(efgAxis?.formattedValue).toBe("17.39");
    });
  });
});
