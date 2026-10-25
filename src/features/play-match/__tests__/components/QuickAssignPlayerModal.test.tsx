import React from "react";
import { InGamePlayer, QuickAssignPlayerModalProps } from "../../types";

declare const jest: any;

describe("QuickAssignPlayerModal (T020 - US2)", () => {
  const mockBench: InGamePlayer[] = [
    {
      id: 6,
      firstName: "Daniel",
      lastName: "Gafford",
      number: "21",
      position: "Center",
      isOnCourt: false,
      secondsPlayed: 0,
      stintSeconds: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
  ];

  it("should conform to QuickAssignPlayerModalProps contract", () => {
    const onAssignMock = jest.fn();
    const onCloseMock = jest.fn();

    const props: QuickAssignPlayerModalProps = {
      visible: true,
      positionIndex: 2,
      availableBenchPlayers: mockBench,
      onAssignPlayer: onAssignMock,
      onClose: onCloseMock,
    };

    expect(props.visible).toBe(true);
    expect(props.positionIndex).toBe(2);
    expect((props.availableBenchPlayers ?? []).length).toBe(1);

    props.onAssignPlayer(6, 2);
    expect(onAssignMock).toHaveBeenCalledWith(6, 2);

    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
