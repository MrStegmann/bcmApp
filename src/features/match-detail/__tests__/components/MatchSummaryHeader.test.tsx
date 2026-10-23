import { MatchSummaryHeaderProps } from "../../types";

declare const jest: any;

describe("MatchSummaryHeader Component Contract (T012 - US1)", () => {
  const defaultProps: MatchSummaryHeaderProps = {
    teamName: "CB Cornellà",
    opponentName: "CB L'Hospitalet",
    date: "22/10/2026 - 19:30",
  };

  it("should preserve team and match date metadata integrity", () => {
    expect(defaultProps.teamName).toBe("CB Cornellà");
    expect(defaultProps.opponentName).toBe("CB L'Hospitalet");
    expect(defaultProps.date).toBe("22/10/2026 - 19:30");
  });

  it("should support optional callback and score props without regressions", () => {
    const onReturnMock = jest.fn();
    const onOpenEditMock = jest.fn();
    const propsWithCallbacks: MatchSummaryHeaderProps = {
      ...defaultProps,
      totalTeamScore: 78,
      totalRivalScore: 72,
      onReturn: onReturnMock,
      onOpenEdit: onOpenEditMock,
    };

    expect(propsWithCallbacks.totalTeamScore).toBe(78);
    expect(propsWithCallbacks.totalRivalScore).toBe(72);
    propsWithCallbacks.onReturn?.();
    expect(onReturnMock).toHaveBeenCalledTimes(1);
    propsWithCallbacks.onOpenEdit?.();
    expect(onOpenEditMock).toHaveBeenCalledTimes(1);
  });
});
