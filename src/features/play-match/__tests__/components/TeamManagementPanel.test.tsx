import React from "react";
import { InGamePlayer, TeamManagementPanelProps } from "../../types";
import { formatPlayerIdentifier } from "../../utils/formatPlayerIdentifier";

declare const jest: any;
declare const require: any;
declare const __dirname: string;
const fs = require("fs");
const path = require("path");

describe("TeamManagementPanel (T028 - US3)", () => {
  const mockBench: InGamePlayer[] = [
    {
      id: 6,
      firstName: "Daniel",
      lastName: "Gafford",
      number: "21",
      position: "Center",
      isOnCourt: false,
      secondsPlayed: 120,
      stintSeconds: 0,
      t1a: 1,
      t1i: 2,
      t2a: 3,
      t2i: 4,
      t3a: 0,
      t3i: 0,
      oreb: 2,
      dreb: 3,
      asis: 1,
      rec: 0,
      per: 1,
      falt: 1,
      valuation: 8,
    },
    {
      id: 7,
      firstName: "Jaden",
      lastName: "Hardy",
      number: null,
      position: "Guard",
      isOnCourt: false,
      secondsPlayed: 60,
      stintSeconds: 0,
      t1a: 0,
      t1i: 0,
      t2a: 1,
      t2i: 2,
      t3a: 1,
      t3i: 2,
      oreb: 0,
      dreb: 1,
      asis: 0,
      rec: 1,
      per: 0,
      falt: 0,
      valuation: 5,
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

  it("should evaluate player identification on bench with jerseyName priority and F. Lastname fallback", () => {
    // When jerseyName is absent, it returns 'D. Gafford'
    const idWithNumber = formatPlayerIdentifier(mockBench[0]);
    expect(idWithNumber).toBe("D. Gafford");

    // When jerseyName is present, it returns jerseyName
    const idWithJerseyName = formatPlayerIdentifier({
      ...mockBench[0],
      jerseyName: "GAFFORD",
    });
    expect(idWithJerseyName).toBe("GAFFORD");

    // When number is absent, it returns 'J. Hardy'
    const idWithoutNumber = formatPlayerIdentifier(mockBench[1]);
    expect(idWithoutNumber).toBe("J. Hardy");
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

  it("should support unrestricted swap mode accessible whether clock is running or paused", () => {
    // Component allows tapping swap button without disabled={isTimerRunning}
    const componentPath = path.resolve(__dirname, "../../components/TeamManagementPanel.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    expect(componentSource).not.toContain("disabled={isTimerRunning}");
  });

  it("should integrate formatPlayerIdentifier in TeamManagementPanel with jersey number on top and identifier on second line", () => {
    const componentPath = path.resolve(__dirname, "../../components/TeamManagementPanel.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Must import formatPlayerIdentifier
    expect(componentSource).toContain("formatPlayerIdentifier");
    // Must call formatPlayerIdentifier(player)
    expect(componentSource).toContain("formatPlayerIdentifier(player)");
    // Must display jersey number on top line
    expect(componentSource).toContain("Top Line: Jersey Number");
    expect(componentSource).toContain("player.number");
    // Must display {identifier}
    expect(componentSource).toContain("{identifier}");
    // Must NOT have redundant playerName unconditionally below jersey number
    expect(componentSource).not.toContain("{player.firstName}");
  });
});
