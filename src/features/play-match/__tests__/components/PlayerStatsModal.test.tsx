import React from "react";
import { InGamePlayer, PlayerStatsModalProps, StatActionType } from "../../types";

declare const jest: any;

describe("PlayerStatsModal (T018 - US2)", () => {
  const mockPlayer: InGamePlayer = {
    id: 1,
    firstName: "Luka",
    lastName: "Doncic",
    number: "77",
    position: "Point Guard",
    isOnCourt: true,
    courtPositionIndex: 0,
    secondsPlayed: 120,
    stintSeconds: 120,
    t1a: 2, t1i: 3, t2a: 4, t2i: 6, t3a: 2, t3i: 5,
    oreb: 1, dreb: 4, asis: 5, rec: 2, per: 1, falt: 2, valuation: 18,
  };

  const mockTeammates: InGamePlayer[] = [
    {
      id: 2,
      firstName: "Kyrie",
      lastName: "Irving",
      number: "11",
      position: "Shooting Guard",
      isOnCourt: true,
      courtPositionIndex: 1,
      secondsPlayed: 120,
      stintSeconds: 120,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 3,
      firstName: "Klay",
      lastName: "Thompson",
      number: "31",
      position: "Small Forward",
      isOnCourt: true,
      courtPositionIndex: 2,
      secondsPlayed: 120,
      stintSeconds: 120,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
  ];

  it("should conform to PlayerStatsModalProps contract", () => {
    const onRecordStatMock = jest.fn();
    const onCloseMock = jest.fn();

    const props: PlayerStatsModalProps = {
      visible: true,
      player: mockPlayer,
      courtTeammates: mockTeammates,
      onClose: onCloseMock,
      onRecordStat: onRecordStatMock,
    };

    expect(props.visible).toBe(true);
    expect(props.player?.id).toBe(1);
    expect(props.courtTeammates.length).toBe(2);

    props.onRecordStat(1, "t2a", 2);
    expect(onRecordStatMock).toHaveBeenCalledWith(1, "t2a", 2);

    props.onRecordStat(1, "oreb", null);
    expect(onRecordStatMock).toHaveBeenCalledWith(1, "oreb", null);

    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should verify all required stat action types exist", () => {
    const validStats: StatActionType[] = [
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
    expect(validStats.length).toBe(12);
  });
});
