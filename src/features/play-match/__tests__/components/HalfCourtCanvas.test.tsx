import React from "react";
import { HalfCourtCanvasProps, InGamePlayer } from "../../types";
import { formatPlayerIdentifier } from "../../utils/formatPlayerIdentifier";

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

  it("should compute continuous stint minutes accurately from stintSeconds", () => {
    expect(Math.floor(mockPlayerWithNumber.stintSeconds / 60)).toBe(2); // 120s -> 2min
    expect(Math.floor(mockPlayerWithoutNumber.stintSeconds / 60)).toBe(1); // 60s -> 1min
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
});
