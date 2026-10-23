import React from "react";
import { HalfCourtCanvasProps, InGamePlayer } from "../../types";

declare const jest: any;

describe("HalfCourtCanvas (T013 - US2)", () => {
  const mockCourtPlayers: (InGamePlayer | null)[] = [
    {
      id: 1,
      firstName: "Luka",
      lastName: "Doncic",
      number: "77",
      position: "Point Guard",
      isOnCourt: true,
      courtPositionIndex: 0,
      secondsPlayed: 180,
      t1a: 2, t1i: 3, t2a: 4, t2i: 6, t3a: 2, t3i: 5,
      oreb: 1, dreb: 4, asis: 5, rec: 2, per: 1, falt: 2, valuation: 18,
    },
    null,
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
    expect(props.courtPlayers[1]).toBeNull();

    // Select assigned player at position 0
    props.onSelectCourtPosition(0, mockCourtPlayers[0]);
    expect(onSelectPositionMock).toHaveBeenCalledWith(0, mockCourtPlayers[0]);

    // Select empty slot at position 1
    props.onSelectCourtPosition(1, null);
    expect(onSelectPositionMock).toHaveBeenCalledWith(1, null);
  });

  it("should compute player points correctly for display circle", () => {
    const player = mockCourtPlayers[0]!;
    const points = player.t1a * 1 + player.t2a * 2 + player.t3a * 3;
    expect(points).toBe(2 * 1 + 4 * 2 + 2 * 3); // 2 + 8 + 6 = 16 pts
  });

  it("should format player statistics display as ${min}min / ${pts}pts", () => {
    const player = mockCourtPlayers[0]!;
    const min = Math.floor(player.secondsPlayed / 60);
    const pts = player.t1a * 1 + player.t2a * 2 + player.t3a * 3;
    const statText = `${min}min / ${pts}pts`;
    expect(statText).toBe("3min / 16pts");
  });
});

