import {
  AdvancedTeamStats,
  RadarAxis,
  RadarPolygonData,
} from "../types";

export const RADAR_METRIC_ORDER: (keyof AdvancedTeamStats)[] = [
  "posesiones",
  "oer",
  "der",
  "efg",
  "orb",
  "ast",
  "tov",
  "ftr",
];

export const METRIC_LABELS: Record<keyof AdvancedTeamStats, string> = {
  posesiones: "Posesiones",
  oer: "OER",
  der: "DER",
  efg: "eFG%",
  orb: "ORB%",
  ast: "AST%",
  tov: "TOV%",
  ftr: "FTR",
};

export const METRIC_BOUNDS: Record<
  keyof AdvancedTeamStats,
  { min: number; max: number }
> = {
  posesiones: { min: 45, max: 95 },
  oer: { min: 60, max: 135 },
  der: { min: 60, max: 135 },
  efg: { min: 30, max: 70 },
  orb: { min: 10, max: 50 },
  ast: { min: 10, max: 40 },
  tov: { min: 5, max: 30 },
  ftr: { min: 10, max: 45 },
};

/**
 * Formats a metric value for display below the vertex name.
 * e.g.: Posesiones 80, OER: 14.75, eFG%: 17.39
 */
export function formatMetricValue(
  key: keyof AdvancedTeamStats,
  rawValue: number
): string {
  if (rawValue === 0) return "0";
  if (key === "posesiones") {
    return Number.isInteger(rawValue) ? String(rawValue) : rawValue.toFixed(1);
  }
  return Number.isInteger(rawValue) ? String(rawValue) : rawValue.toFixed(2);
}

/**
 * Normalizes a raw metric value to a 0.1 - 1.0 range based on competitive basketball benchmarks.
 */
export function normalizeMetric(
  key: keyof AdvancedTeamStats,
  rawValue: number
): number {
  const bounds = METRIC_BOUNDS[key] || { min: 0, max: 100 };
  const ratio = (rawValue - bounds.min) / (bounds.max - bounds.min);
  const normalized = 0.1 + 0.9 * Math.max(0, Math.min(1, ratio));
  return Number(normalized.toFixed(3));
}

/**
 * Generates geometric axes, data polygon SVG points, and concentric web polygons
 * for rendering the 8-axis tactical radar chart.
 */
export function generateRadarGeometry(
  stats: AdvancedTeamStats,
  size: number = 280
): RadarPolygonData {
  const center = size / 2;
  const radius = center * 0.64; // Padding for outer axis labels and values
  const totalAxes = RADAR_METRIC_ORDER.length;

  const axes: RadarAxis[] = RADAR_METRIC_ORDER.map((key, index) => {
    // Start at top (-90 degrees) and rotate clockwise
    const angleDeg = -90 + index * (360 / totalAxes);
    const angleRad = (angleDeg * Math.PI) / 180;
    const rawValue = Number(stats[key] || 0);
    const normalizedValue = normalizeMetric(key, rawValue);

    const r = normalizedValue * radius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);

    return {
      key,
      label: METRIC_LABELS[key],
      formattedValue: formatMetricValue(key, rawValue),
      angleDeg,
      rawValue,
      normalizedValue,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
    };
  });

  const polygonPointsSvg = axes.map((a) => `${a.x},${a.y}`).join(" ");

  // Concentric polygon grids (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    const levelRadius = radius * level;
    return RADAR_METRIC_ORDER.map((_, index) => {
      const angleDeg = -90 + index * (360 / totalAxes);
      const angleRad = (angleDeg * Math.PI) / 180;
      const gx = center + levelRadius * Math.cos(angleRad);
      const gy = center + levelRadius * Math.sin(angleRad);
      return `${gx.toFixed(2)},${gy.toFixed(2)}`;
    }).join(" ");
  });

  return {
    axes,
    polygonPointsSvg,
    gridPolygons,
  };
}
