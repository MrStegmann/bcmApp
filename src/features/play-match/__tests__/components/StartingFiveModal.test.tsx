import React from "react";
import { InGamePlayer, StartingFiveModalProps } from "../../types";

declare const jest: any;

describe("StartingFiveModal (T005 - Lineup Modal)", () => {
  const mockRoster: InGamePlayer[] = [
    {
      id: 1,
      firstName: "Luka",
      lastName: "Doncic",
      number: "77",
      position: "Point Guard",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 2,
      firstName: "Kyrie",
      lastName: "Irving",
      number: "11",
      position: "Shooting Guard",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 3,
      firstName: "Klay",
      lastName: "Thompson",
      number: "31",
      position: "Small Forward",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 4,
      firstName: "PJ",
      lastName: "Washington",
      number: "25",
      position: "Power Forward",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 5,
      firstName: "Dereck",
      lastName: "Lively",
      number: "2",
      position: "Center",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 6,
      firstName: "Daniel",
      lastName: "Gafford",
      number: "21",
      position: "Center",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
  ];

  it("should validate that exactly 5 players must be selected", () => {
    let selectedPlayerIds: number[] = [];

    const togglePlayer = (id: number) => {
      if (selectedPlayerIds.includes(id)) {
        selectedPlayerIds = selectedPlayerIds.filter((pId) => pId !== id);
      } else if (selectedPlayerIds.length < 5) {
        selectedPlayerIds.push(id);
      }
    };

    togglePlayer(1);
    togglePlayer(2);
    togglePlayer(3);
    togglePlayer(4);
    expect(selectedPlayerIds.length).toBe(4);
    expect(selectedPlayerIds.length === 5).toBe(false);

    togglePlayer(5);
    expect(selectedPlayerIds.length).toBe(5);
    expect(selectedPlayerIds.length === 5).toBe(true);

    // Cannot add a 6th player
    togglePlayer(6);
    expect(selectedPlayerIds.length).toBe(5);
    expect(selectedPlayerIds).toEqual([1, 2, 3, 4, 5]);

    // Deselect player 1
    togglePlayer(1);
    expect(selectedPlayerIds.length).toBe(4);
    expect(selectedPlayerIds).toEqual([2, 3, 4, 5]);
  });

  it("should conform to StartingFiveModalProps contract", () => {
    const onConfirmMock = jest.fn();
    const props: StartingFiveModalProps = {
      visible: true,
      roster: mockRoster,
      onConfirmStartingFive: onConfirmMock,
    };

    expect(props.visible).toBe(true);
    expect(props.roster.length).toBe(6);
    props.onConfirmStartingFive([1, 2, 3, 4, 5]);
    expect(onConfirmMock).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
  });
});
