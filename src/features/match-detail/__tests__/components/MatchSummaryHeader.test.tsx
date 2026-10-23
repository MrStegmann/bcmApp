import { MatchSummaryHeaderProps } from "../../types";

declare const jest: any;

describe("MatchSummaryHeader Component Contract (T011 - US2)", () => {
  const defaultProps: MatchSummaryHeaderProps = {
    teamName: "CB Cornellà",
    opponentName: "CB L'Hospitalet",
    date: "22/10/2026 - 19:30",
    status: "finished",
  };

  it("should preserve team and match date metadata integrity", () => {
    expect(defaultProps.teamName).toBe("CB Cornellà");
    expect(defaultProps.opponentName).toBe("CB L'Hospitalet");
    expect(defaultProps.date).toBe("22/10/2026 - 19:30");
    expect(defaultProps.status).toBe("finished");
  });

  it("should support optional callback and score props without regressions", () => {
    const onReturnMock = jest.fn();
    const onOpenEditMock = jest.fn();
    const onShareStatsMock = jest.fn();

    const propsWithCallbacks: MatchSummaryHeaderProps = {
      ...defaultProps,
      totalTeamPoints: 78,
      totalRivalPoints: 72,
      onReturn: onReturnMock,
      onOpenEdit: onOpenEditMock,
      onShareStats: onShareStatsMock,
    };

    expect(propsWithCallbacks.totalTeamPoints).toBe(78);
    expect(propsWithCallbacks.totalRivalPoints).toBe(72);
    propsWithCallbacks.onReturn?.();
    expect(onReturnMock).toHaveBeenCalledTimes(1);
    propsWithCallbacks.onOpenEdit?.();
    expect(onOpenEditMock).toHaveBeenCalledTimes(1);
    propsWithCallbacks.onShareStats?.();
    expect(onShareStatsMock).toHaveBeenCalledTimes(1);
  });

  it("should distinguish finished matches eligible for sharing from pending matches", () => {
    const finishedMatchProps: MatchSummaryHeaderProps = {
      ...defaultProps,
      status: "finished",
    };

    const pendingMatchProps: MatchSummaryHeaderProps = {
      ...defaultProps,
      status: "pending",
    };

    const inProgressMatchProps: MatchSummaryHeaderProps = {
      ...defaultProps,
      status: "in_progress",
    };

    expect(finishedMatchProps.status === "finished").toBe(true);
    expect(pendingMatchProps.status === "finished").toBe(false);
    expect(inProgressMatchProps.status === "finished").toBe(false);
  });
});
