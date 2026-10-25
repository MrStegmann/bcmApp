import {
  COURT_ARC_POSITIONS,
  calculateEuclideanDistance,
  ARC_RADIUS,
  ARC_CENTER_Y,
} from "../../utils/courtArcPositions";

describe("courtArcPositions utility", () => {
  it("should define exactly 5 outer 3-point arc positions", () => {
    expect(COURT_ARC_POSITIONS).toHaveLength(5);
  });

  it("should have correct slot indices and basketball role mappings", () => {
    const indices = COURT_ARC_POSITIONS.map((p) => p.index).sort();
    expect(indices).toEqual([0, 1, 2, 3, 4]);

    const center = COURT_ARC_POSITIONS.find((p) => p.index === 0)!;
    const leftWing = COURT_ARC_POSITIONS.find((p) => p.index === 1)!;
    const rightWing = COURT_ARC_POSITIONS.find((p) => p.index === 2)!;
    const leftCorner = COURT_ARC_POSITIONS.find((p) => p.index === 3)!;
    const rightCorner = COURT_ARC_POSITIONS.find((p) => p.index === 4)!;

    expect(center.role).toBe("center");
    expect(center.name).toBe("Center");
    expect(center.angleDeg).toBe(90);

    expect(leftWing.role).toBe("left-wing");
    expect(leftWing.name).toBe("Left Wing");
    expect(leftWing.angleDeg).toBe(135);

    expect(rightWing.role).toBe("right-wing");
    expect(rightWing.name).toBe("Right Wing");
    expect(rightWing.angleDeg).toBe(45);

    expect(leftCorner.role).toBe("left-corner");
    expect(leftCorner.name).toBe("Left Corner");
    expect(leftCorner.angleDeg).toBe(180);

    expect(rightCorner.role).toBe("right-corner");
    expect(rightCorner.name).toBe("Right Corner");
    expect(rightCorner.angleDeg).toBe(0);
  });

  it("should have exact bilateral symmetry across the court vertical axis", () => {
    const center = COURT_ARC_POSITIONS.find((p) => p.index === 0)!;
    const leftWing = COURT_ARC_POSITIONS.find((p) => p.index === 1)!;
    const rightWing = COURT_ARC_POSITIONS.find((p) => p.index === 2)!;
    const leftCorner = COURT_ARC_POSITIONS.find((p) => p.index === 3)!;
    const rightCorner = COURT_ARC_POSITIONS.find((p) => p.index === 4)!;

    // Center is on vertical axis
    expect(center.xOffset).toBe(0);

    // Wings are mirror images
    expect(leftWing.xOffset).toBe(-rightWing.xOffset);
    expect(leftWing.y).toBe(rightWing.y);

    // Corners are mirror images
    expect(leftCorner.xOffset).toBe(-rightCorner.xOffset);
    expect(leftCorner.y).toBe(rightCorner.y);
  });

  it("should guarantee identical Euclidean distances for all adjacent arc pairs (Corner-Wing-Center)", () => {
    const center = COURT_ARC_POSITIONS.find((p) => p.index === 0)!;
    const leftWing = COURT_ARC_POSITIONS.find((p) => p.index === 1)!;
    const rightWing = COURT_ARC_POSITIONS.find((p) => p.index === 2)!;
    const leftCorner = COURT_ARC_POSITIONS.find((p) => p.index === 3)!;
    const rightCorner = COURT_ARC_POSITIONS.find((p) => p.index === 4)!;

    const distLeftCornerToLeftWing = calculateEuclideanDistance(leftCorner, leftWing);
    const distLeftWingToCenter = calculateEuclideanDistance(leftWing, center);
    const distCenterToRightWing = calculateEuclideanDistance(center, rightWing);
    const distRightWingToRightCorner = calculateEuclideanDistance(rightWing, rightCorner);

    const expectedDistance = Math.sqrt(9760);

    expect(distLeftCornerToLeftWing).toBeCloseTo(expectedDistance, 6);
    expect(distLeftWingToCenter).toBeCloseTo(expectedDistance, 6);
    expect(distCenterToRightWing).toBeCloseTo(expectedDistance, 6);
    expect(distRightWingToRightCorner).toBeCloseTo(expectedDistance, 6);

    // Strict equality check between intervals
    expect(distLeftCornerToLeftWing).toBe(distRightWingToRightCorner);
    expect(distLeftWingToCenter).toBe(distCenterToRightWing);
    expect(distLeftCornerToLeftWing).toBe(distLeftWingToCenter);
  });

  it("should guarantee sufficient clearance between slot circles to prevent touch collisions", () => {
    const center = COURT_ARC_POSITIONS.find((p) => p.index === 0)!;
    const leftWing = COURT_ARC_POSITIONS.find((p) => p.index === 1)!;
    const rightWing = COURT_ARC_POSITIONS.find((p) => p.index === 2)!;
    const leftCorner = COURT_ARC_POSITIONS.find((p) => p.index === 3)!;
    const rightCorner = COURT_ARC_POSITIONS.find((p) => p.index === 4)!;

    const adjacentPairs = [
      [leftCorner, leftWing],
      [leftWing, center],
      [center, rightWing],
      [rightWing, rightCorner],
    ];

    const slotDiameter = 70; // 70dp for w-20 in NativeWind

    for (const [p1, p2] of adjacentPairs) {
      const distance = calculateEuclideanDistance(p1, p2);
      const edgeToEdgeGap = distance - slotDiameter;

      // Ensure at least 15px gap between circles
      expect(edgeToEdgeGap).toBeGreaterThan(15);
    }
  });

  it("should correctly compute distance with calculateEuclideanDistance helper", () => {
    expect(calculateEuclideanDistance({ xOffset: 0, y: 0 }, { xOffset: 0, y: 0 })).toBe(0);
    expect(calculateEuclideanDistance({ xOffset: 0, y: 0 }, { xOffset: 3, y: 4 })).toBe(5);
    expect(calculateEuclideanDistance({ xOffset: -10, y: 20 }, { xOffset: -10, y: 50 })).toBe(30);
    expect(calculateEuclideanDistance({ xOffset: 10, y: 5 }, { xOffset: 20, y: 5 })).toBe(10);
  });
});
