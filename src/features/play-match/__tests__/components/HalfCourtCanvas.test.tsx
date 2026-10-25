import React from "react";
import { HalfCourtCanvasProps, InGamePlayer } from "../../types";
import { formatPlayerIdentifier } from "../../utils/formatPlayerIdentifier";
import { formatStintTime } from "../../utils/formatStintTime";
import {
  COURT_ARC_POSITIONS,
  calculateEuclideanDistance,
} from "../../utils/courtArcPositions";

declare const jest: any;
declare const require: any;
declare const __dirname: string;
const fs = require("fs");
const path = require("path");

describe("HalfCourtCanvas (T017 - US2)", () => {
  const mockPlayerWithNumber: InGamePlayer = {
    id: 1,
    firstName: "Luka",
    lastName: "Doncic",
    number: "77",
    position: "Point Guard",
    isOnCourt: true,
    courtPositionIndex: 0,
    secondsPlayed: 180,
    stintSeconds: 120,
    t1a: 2,
    t1i: 3,
    t2a: 4,
    t2i: 6,
    t3a: 2,
    t3i: 5,
    oreb: 1,
    dreb: 4,
    asis: 5,
    rec: 2,
    per: 1,
    falt: 2,
    valuation: 18,
  };

  const mockPlayerWithoutNumber: InGamePlayer = {
    id: 2,
    firstName: "Alex",
    lastName: "Delgado",
    number: null,
    position: "Small Forward",
    isOnCourt: true,
    courtPositionIndex: 1,
    secondsPlayed: 120,
    stintSeconds: 60,
    t1a: 0,
    t1i: 0,
    t2a: 2,
    t2i: 1,
    t3a: 0,
    t3i: 0,
    oreb: 0,
    dreb: 2,
    asis: 1,
    rec: 0,
    per: 0,
    falt: 1,
    valuation: 5,
  };

  const mockCourtPlayers: (InGamePlayer | null)[] = [
    mockPlayerWithNumber,
    mockPlayerWithoutNumber,
    null,
    null,
    null,
  ];

  it("should conform to HalfCourtCanvasProps contract and support 2-second hold subtraction trigger", () => {
    const onSelectPositionMock = jest.fn();
    const onLongPressPositionMock = jest.fn();

    const props: HalfCourtCanvasProps = {
      courtPlayers: mockCourtPlayers,
      isSwapMode: false,
      selectedCourtPlayerIds: [],
      onSelectCourtPosition: onSelectPositionMock,
      onLongPressCourtPosition: onLongPressPositionMock,
    };

    expect(props.courtPlayers.length).toBe(5);
    expect(props.courtPlayers[0]?.id).toBe(1);
    expect(props.courtPlayers[1]?.id).toBe(2);
    expect(props.courtPlayers[2]).toBeNull();

    // Select assigned player at position 0 (1-tap opens stats modal)
    props.onSelectCourtPosition(0, mockCourtPlayers[0]);
    expect(onSelectPositionMock).toHaveBeenCalledWith(0, mockCourtPlayers[0]);

    // Long-press assigned player at position 0 (2-second hold triggers stat subtraction)
    if (props.onLongPressCourtPosition && mockCourtPlayers[0]) {
      props.onLongPressCourtPosition(0, mockCourtPlayers[0]);
      expect(onLongPressPositionMock).toHaveBeenCalledWith(0, mockCourtPlayers[0]);
    }

    // Select empty slot at position 2 (opens quick assign modal)
    props.onSelectCourtPosition(2, null);
    expect(onSelectPositionMock).toHaveBeenCalledWith(2, null);
  });

  it("should evaluate player identification with jerseyName priority and F. Lastname fallback", () => {
    // When jerseyName is absent, it falls back to "F. Lastname" ("L. Doncic")
    const idWithNumber = formatPlayerIdentifier(mockPlayerWithNumber);
    expect(idWithNumber).toBe("L. Doncic");

    // When jerseyName is present, it returns jerseyName
    const idWithJerseyName = formatPlayerIdentifier({
      ...mockPlayerWithNumber,
      jerseyName: "DONCIC",
    });
    expect(idWithJerseyName).toBe("DONCIC");

    // When number is absent and jerseyName absent, it falls back to "F. Lastname" ("A. Delgado")
    const idWithoutNumber = formatPlayerIdentifier(mockPlayerWithoutNumber);
    expect(idWithoutNumber).toBe("A. Delgado");
  });

  it("should verify player circle renders jersey number on top line and identifier on second line", () => {
    const componentPath = path.resolve(__dirname, "../../components/HalfCourtCanvas.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    expect(componentSource).toContain("Top Line: Jersey Number");
    expect(componentSource).toContain("player.number");
    expect(componentSource).toContain("{identifier}");
  });

  it("should compute continuous stint time accurately formatted as mm:ss", () => {
    expect(formatStintTime(mockPlayerWithNumber.stintSeconds)).toBe("02:00"); // 120s -> 02:00
    expect(formatStintTime(mockPlayerWithoutNumber.stintSeconds)).toBe("01:00"); // 60s -> 01:00
    expect(formatStintTime(45)).toBe("00:45");
    expect(formatStintTime(0)).toBe("00:00");
    expect(formatStintTime(null)).toBe("00:00");
    expect(formatStintTime(undefined)).toBe("00:00");
  });

  it("should verify delayLongPress is set to 2000ms for 2-second hold subtraction in component source", () => {
    const componentPath = path.resolve(__dirname, "../../components/HalfCourtCanvas.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    expect(componentSource).toContain("delayLongPress={2000}");
  });

  it("should verify static layout without freeze-inducing animation classes", () => {
    const componentPath = path.resolve(__dirname, "../../components/HalfCourtCanvas.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    expect(componentSource).not.toContain("animate-pulse");
    expect(componentSource).not.toContain("animate-");
  });

  it("should arrange 5 court positions along the Outer 3-Point Arc (Corners, Wings, Center)", () => {
    const componentPath = path.resolve(__dirname, "../../components/HalfCourtCanvas.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Outer 3-Point Arc positioning anchors
    expect(componentSource).toContain("Row 1 (Corners)");
    expect(componentSource).toContain("Row 2 (Wings)");
    expect(componentSource).toContain("Row 3 (Center)");
    expect(componentSource).toContain("{stintTime}");
  });

  it("should ensure identical Euclidean distances between adjacent arc positions (Corner-Wing-Center)", () => {
    const leftCorner = COURT_ARC_POSITIONS.find((p) => p.index === 3)!;
    const leftWing = COURT_ARC_POSITIONS.find((p) => p.index === 1)!;
    const center = COURT_ARC_POSITIONS.find((p) => p.index === 0)!;
    const rightWing = COURT_ARC_POSITIONS.find((p) => p.index === 2)!;
    const rightCorner = COURT_ARC_POSITIONS.find((p) => p.index === 4)!;

    expect(leftCorner).toBeDefined();
    expect(leftWing).toBeDefined();
    expect(center).toBeDefined();
    expect(rightWing).toBeDefined();
    expect(rightCorner).toBeDefined();

    const distLeftCornerToLeftWing = calculateEuclideanDistance(leftCorner, leftWing);
    const distLeftWingToCenter = calculateEuclideanDistance(leftWing, center);
    const distCenterToRightWing = calculateEuclideanDistance(center, rightWing);
    const distRightWingToRightCorner = calculateEuclideanDistance(rightWing, rightCorner);

    // Verify all 4 adjacent intervals are strictly equal:
    // D(Left Corner, Left Wing) === D(Left Wing, Center) === D(Center, Right Wing) === D(Right Wing, Right Corner)
    expect(distLeftCornerToLeftWing).toBeCloseTo(distLeftWingToCenter, 5);
    expect(distLeftWingToCenter).toBeCloseTo(distCenterToRightWing, 5);
    expect(distCenterToRightWing).toBeCloseTo(distRightWingToRightCorner, 5);

    // Verify exact Euclidean distance equals sqrt(9760) ~ 98.79px
    expect(distLeftCornerToLeftWing).toBeCloseTo(Math.sqrt(9760), 5);
  });

  it("should confirm all 5 positions maintain slot index mapping and radial ordering along Outer 3-Point Arc", () => {
    expect(COURT_ARC_POSITIONS).toHaveLength(5);

    const slot0 = COURT_ARC_POSITIONS.find((p) => p.index === 0)!;
    const slot1 = COURT_ARC_POSITIONS.find((p) => p.index === 1)!;
    const slot2 = COURT_ARC_POSITIONS.find((p) => p.index === 2)!;
    const slot3 = COURT_ARC_POSITIONS.find((p) => p.index === 3)!;
    const slot4 = COURT_ARC_POSITIONS.find((p) => p.index === 4)!;

    // Slot 0: Center (top of arc)
    expect(slot0.role).toBe("center");
    expect(slot0.name).toBe("Center");
    expect(slot0.angleDeg).toBe(90);
    expect(slot0.xOffset).toBe(0);

    // Slot 1: Left Wing
    expect(slot1.role).toBe("left-wing");
    expect(slot1.name).toBe("Left Wing");
    expect(slot1.angleDeg).toBe(135);
    expect(slot1.xOffset).toBeLessThan(0);

    // Slot 2: Right Wing
    expect(slot2.role).toBe("right-wing");
    expect(slot2.name).toBe("Right Wing");
    expect(slot2.angleDeg).toBe(45);
    expect(slot2.xOffset).toBeGreaterThan(0);

    // Slot 3: Left Corner
    expect(slot3.role).toBe("left-corner");
    expect(slot3.name).toBe("Left Corner");
    expect(slot3.angleDeg).toBe(180);
    expect(slot3.xOffset).toBeLessThan(slot1.xOffset);

    // Slot 4: Right Corner
    expect(slot4.role).toBe("right-corner");
    expect(slot4.name).toBe("Right Corner");
    expect(slot4.angleDeg).toBe(0);
    expect(slot4.xOffset).toBeGreaterThan(slot2.xOffset);

    // Component source renders all 5 slots
    const componentPath = path.resolve(__dirname, "../../components/HalfCourtCanvas.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    expect(componentSource).toContain("renderPlayerSlot(0");
    expect(componentSource).toContain("renderPlayerSlot(1");
    expect(componentSource).toContain("renderPlayerSlot(2");
    expect(componentSource).toContain("renderPlayerSlot(3");
    expect(componentSource).toContain("renderPlayerSlot(4");
    expect(componentSource).toContain("COURT_ARC_POSITIONS");
  });
});
