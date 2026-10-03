import React from "react";
import { Game } from "../../../../types/database";
import { PlayMatchProps } from "../../types";

declare const jest: any;

describe("PlayMatch Integration Tests (T024 - Phase 7)", () => {
  const mockMatch: Game = {
    id: 1,
    teamId: 1,
    opponent: "Lakers",
    round: "1",
    date: "2026-10-03",
    status: "inProgress",
    createdAt: new Date().toISOString(),
    resultC1: 0,
    resultC2: 0,
    resultC3: 0,
    resultC4: 0,
    resultExtra: 0,
    resultC1Opponent: 0,
    resultC2Opponent: 0,
    resultC3Opponent: 0,
    resultC4Opponent: 0,
    resultExtraOpponent: 0,
  };

  it("should conform to PlayMatchProps contract", () => {
    const onFinishMock = jest.fn();
    const onReturnMock = jest.fn();

    const props: PlayMatchProps = {
      match: mockMatch,
      onFinishMatch: onFinishMock,
      onReturn: onReturnMock,
    };

    expect(props.match.id).toBe(1);
    expect(props.match.opponent).toBe("Lakers");

    props.onFinishMatch();
    expect(onFinishMock).toHaveBeenCalledTimes(1);

    props.onReturn();
    expect(onReturnMock).toHaveBeenCalledTimes(1);
  });
});
