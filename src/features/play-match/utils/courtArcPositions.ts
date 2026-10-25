export interface CourtArcPosition {
  index: number;
  role: "center" | "left-wing" | "right-wing" | "left-corner" | "right-corner";
  name: string;
  angleDeg: number;
  xOffset: number; // horizontal offset in px from canvas center (50%)
  y: number; // vertical position in px from canvas top
}

export const ARC_RADIUS = 112;
export const ARC_CENTER_Y = 84;

export const COURT_ARC_POSITIONS: CourtArcPosition[] = [
  {
    index: 0,
    role: "center",
    name: "Center",
    angleDeg: 90,
    xOffset: 0,
    y: 224,
  },
  {
    index: 1,
    role: "left-wing",
    name: "Left Wing",
    angleDeg: 135,
    xOffset: -92,
    y: 188,
  },
  {
    index: 2,
    role: "right-wing",
    name: "Right Wing",
    angleDeg: 45,
    xOffset: 92,
    y: 188,
  },
  {
    index: 3,
    role: "left-corner",
    name: "Left Corner",
    angleDeg: 180,
    xOffset: -128,
    y: 96,
  },
  {
    index: 4,
    role: "right-corner",
    name: "Right Corner",
    angleDeg: 0,
    xOffset: 128,
    y: 96,
  },
];

export const calculateEuclideanDistance = (
  p1: { xOffset: number; y: number },
  p2: { xOffset: number; y: number }
): number => {
  const dx = p1.xOffset - p2.xOffset;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};
