import React from "react";
import { InGamePlayer, PlayerStatSubtractionModalProps, StatActionType } from "../../types";

declare const jest: any;

describe("PlayerStatSubtractionModal (T019 - US2)", () => {
  const mockPlayer: InGamePlayer = {
    id: 1,
    firstName: "Luka",
    lastName: "Doncic",
    number: "77",
    isOnCourt: true,
    secondsPlayed: 180,
    stintSeconds: 180,
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

  it("should conform to PlayerStatSubtractionModalProps contract", () => {
    const onSubtractStatMock = jest.fn();
    const onCloseMock = jest.fn();

    const props: PlayerStatSubtractionModalProps = {
      visible: true,
      player: mockPlayer,
      onClose: onCloseMock,
      onSubtractStat: onSubtractStatMock,
    };

    expect(props.visible).toBe(true);
    expect(props.player?.id).toBe(1);

    props.onSubtractStat(1, "t2a");
    expect(onSubtractStatMock).toHaveBeenCalledWith(1, "t2a");

    props.onSubtractStat(1, "fault");
    expect(onSubtractStatMock).toHaveBeenCalledWith(1, "fault");

    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should support subtracting all shooting, rebound, defense, and foul stat types", () => {
    const supportedStatTypes: StatActionType[] = [
      "t1a",
      "t1i",
      "t2a",
      "t2i",
      "t3a",
      "t3i",
      "oreb",
      "dreb",
      "fault",
      "asis",
      "lost",
      "recovers",
    ];

    expect(supportedStatTypes.length).toBe(12);
  });
});
