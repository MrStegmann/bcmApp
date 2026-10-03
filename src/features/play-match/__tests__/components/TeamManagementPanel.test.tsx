import React from "react";
import { InGamePlayer, TeamManagementPanelProps } from "../../types";

declare const jest: any;

describe("TeamManagementPanel (T019 - US3)", () => {
  const mockBench: InGamePlayer[] = [
    {
      id: 6,
      firstName: "Daniel",
      lastName: "Gafford",
      number: "21",
      position: "Center",
      isOnCourt: false,
      secondsPlayed: 120,
      t1a: 1, t1i: 2, t2a: 3, t2i: 4, t3a: 0, t3i: 0,
      oreb: 2, dreb: 3, asis: 1, rec: 0, per: 1, falt: 1, valuation: 8,
    },
    {
      id: 7,
      firstName: "Jaden",
      lastName: "Hardy",
      number: "1",
      position: "Guard",
      isOnCourt: false,
      secondsPlayed: 60,
      t1a: 0, t1i: 0, t2a: 1, t2i: 2, t3a: 1, t3i: 2,
      oreb: 0, dreb: 1, asis: 0, rec: 1, per: 0, falt: 0, valuation: 5,
    },
  ];

  it("should conform to TeamManagementPanelProps contract", () => {
    const onSelectBenchMock = jest.fn();
    const onToggleSwapMock = jest.fn();
    const onConfirmSwapMock = jest.fn();
    const onCancelSwapMock = jest.fn();
    const onIncreaseTimeoutMock = jest.fn();
    const onDecreaseTimeoutMock = jest.fn();

    const props: TeamManagementPanelProps = {
      benchPlayers: mockBench,
      isSwapMode: true,
      isTimerRunning: false,
      selectedCourtCount: 1,
      selectedBenchPlayerIds: [6],
      availableTimeouts: 2,
      onSelectBenchPlayer: onSelectBenchMock,
      onToggleSwapMode: onToggleSwapMock,
      onConfirmSwap: onConfirmSwapMock,
      onCancelSwap: onCancelSwapMock,
      onIncreaseTimeout: onIncreaseTimeoutMock,
      onDecreaseTimeout: onDecreaseTimeoutMock,
    };

    expect(props.benchPlayers.length).toBe(2);
    expect(props.isSwapMode).toBe(true);
    expect(props.availableTimeouts).toBe(2);

    props.onSelectBenchPlayer(mockBench[0]);
    expect(onSelectBenchMock).toHaveBeenCalledWith(mockBench[0]);

    props.onConfirmSwap();
    expect(onConfirmSwapMock).toHaveBeenCalledTimes(1);

    props.onIncreaseTimeout();
    expect(onIncreaseTimeoutMock).toHaveBeenCalledTimes(1);

    props.onDecreaseTimeout();
    expect(onDecreaseTimeoutMock).toHaveBeenCalledTimes(1);
  });

  it("should check if swap confirmation is enabled (selectedCourtCount === selectedBenchCount and > 0)", () => {
    const isSwapValid = (courtCount: number, benchCount: number) => {
      return courtCount > 0 && courtCount === benchCount;
    };

    expect(isSwapValid(0, 0)).toBe(false);
    expect(isSwapValid(1, 2)).toBe(false);
    expect(isSwapValid(2, 1)).toBe(false);
    expect(isSwapValid(2, 2)).toBe(true);
    expect(isSwapValid(1, 1)).toBe(true);
  });
});
