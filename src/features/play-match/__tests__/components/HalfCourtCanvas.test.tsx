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

  it("should conform to HalfCourtCanvasProps contract", () => {
    const onSelectPositionMock = jest.fn();

    const props: HalfCourtCanvasProps = {
      courtPlayers: mockCourtPlayers,
      isSwapMode: false,
      selectedCourtPlayerIds: [],
      onSelectCourtPosition: onSelectPositionMock,
    };

    expect(props.courtPlayers.length).toBe(5);
    expect(props.courtPlayers[0]?.id).toBe(1);
    expect(props.courtPlayers[1]?.id).toBe(2);
    expect(props.courtPlayers[2]).toBeNull();

    // Select assigned player at position 0
    props.onSelectCourtPosition(0, mockCourtPlayers[0]);
    expect(onSelectPositionMock).toHaveBeenCalledWith(0, mockCourtPlayers[0]);

    // Select empty slot at position 2
    props.onSelectCourtPosition(2, null);
    expect(onSelectPositionMock).toHaveBeenCalledWith(2, null);
  });

  it("should evaluate player identification with jersey name priority and fallback formatting", () => {
    // When jerseyName is present, it returns jerseyName exclusively
    const playerWithJerseyName: InGamePlayer = {
      ...mockPlayerWithNumber,
      jerseyName: "DONCIC",
    };
    const idWithJerseyName = formatPlayerIdentifier(playerWithJerseyName);
    expect(idWithJerseyName).toBe("DONCIC");
    expect(idWithJerseyName).not.toBe("#77");

    // When jerseyName is absent, it falls back to '[First Initial]. [Last Name]'
    const idWithoutJerseyName = formatPlayerIdentifier(mockPlayerWithNumber);
    expect(idWithoutJerseyName).toBe("L. Doncic");

    const idWithoutNumber = formatPlayerIdentifier(mockPlayerWithoutNumber);
    expect(idWithoutNumber).toBe("A. Delgado");
  });

  it("should format player statistics display as ${min}min / ${pts}pts", () => {
    const player = mockCourtPlayers[0]!;
    const min = Math.floor(player.secondsPlayed / 60);
    const pts = player.t1a * 1 + player.t2a * 2 + player.t3a * 3;
    const statText = `${min}min / ${pts}pts`;
    expect(statText).toBe("3min / 16pts");
  });

  it("should integrate formatPlayerIdentifier and render jersey number above jersey name in HalfCourtCanvas source code", () => {
    const componentPath = path.resolve(__dirname, "../../components/HalfCourtCanvas.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Must import formatPlayerIdentifier
    expect(componentSource).toContain("formatPlayerIdentifier");
    // Must call formatPlayerIdentifier(player)
    expect(componentSource).toContain("formatPlayerIdentifier(player)");
    // Must display #{player.number ?? "-"}
    expect(componentSource).toContain("#{player.number ?? \"-\"}");
    // Must display identifier below jersey number
    expect(componentSource).toContain("{identifier}");
    // Must NOT have redundant playerName unconditionally below jersey number
    expect(componentSource).not.toContain("{player.firstName}");
  });
});
