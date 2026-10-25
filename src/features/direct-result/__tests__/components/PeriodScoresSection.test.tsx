import {
  PeriodScoresSectionProps,
  DirectResultBuffer,
  PeriodKey,
  PeriodScoreInput,
} from "../../types";
import { calculatePeriodTotals } from "../../utils/directResultCalculations";

declare const jest: any;

describe("PeriodScoresSection Contract & Logic Tests (T007 - US2)", () => {
  const defaultPeriod = (): PeriodScoreInput => ({
    teamPoints: 0,
    teamFouls: 0,
    rivalPoints: 0,
    rivalFouls: 0,
  });

  const mockBuffer: DirectResultBuffer = {
    hasExtraTime: false,
    periods: {
      q1: { teamPoints: 20, teamFouls: 3, rivalPoints: 18, rivalFouls: 2 },
      q2: { teamPoints: 15, teamFouls: 4, rivalPoints: 17, rivalFouls: 1 },
      q3: { teamPoints: 22, teamFouls: 1, rivalPoints: 19, rivalFouls: 3 },
      q4: { teamPoints: 25, teamFouls: 2, rivalPoints: 24, rivalFouls: 4 },
      extra: { teamPoints: 8, teamFouls: 1, rivalPoints: 6, rivalFouls: 2 },
    },
    players: {},
  };

  const getSectionProps = (
    buffer: DirectResultBuffer,
    hasExtraTime: boolean,
    onToggleMock: any,
    onUpdateMock: any
  ): PeriodScoresSectionProps => {
    const totals = calculatePeriodTotals(buffer.periods, hasExtraTime);
    return {
      buffer,
      hasExtraTime,
      onToggleExtraTime: onToggleMock,
      onUpdatePeriod: onUpdateMock,
      totalTeamPoints: totals.totalTeamPoints,
      totalRivalPoints: totals.totalRivalPoints,
    };
  };

  it("should calculate regulation totals (82 - 78) when extra time is disabled", () => {
    const onToggleMock = jest.fn();
    const onUpdateMock = jest.fn();
    const props = getSectionProps(mockBuffer, false, onToggleMock, onUpdateMock);

    expect(props.totalTeamPoints).toBe(20 + 15 + 22 + 25); // 82
    expect(props.totalRivalPoints).toBe(18 + 17 + 19 + 24); // 78
    expect(props.hasExtraTime).toBe(false);
  });

  it("should include extra time points (90 - 84) when extra time is enabled", () => {
    const onToggleMock = jest.fn();
    const onUpdateMock = jest.fn();
    const props = getSectionProps(mockBuffer, true, onToggleMock, onUpdateMock);

    expect(props.totalTeamPoints).toBe(82 + 8); // 90
    expect(props.totalRivalPoints).toBe(78 + 6); // 84
    expect(props.hasExtraTime).toBe(true);
  });

  it("should trigger onToggleExtraTime when toggling overtime state", () => {
    const onToggleMock = jest.fn();
    const onUpdateMock = jest.fn();
    const props = getSectionProps(mockBuffer, false, onToggleMock, onUpdateMock);

    props.onToggleExtraTime(!props.hasExtraTime);
    expect(onToggleMock).toHaveBeenCalledWith(true);
  });

  it("should trigger onUpdatePeriod with target period, field, and input value", () => {
    const onToggleMock = jest.fn();
    const onUpdateMock = jest.fn();
    const props = getSectionProps(mockBuffer, false, onToggleMock, onUpdateMock);

    props.onUpdatePeriod("q1", "teamPoints", "24");
    expect(onUpdateMock).toHaveBeenCalledWith("q1", "teamPoints", "24");

    props.onUpdatePeriod("q3", "rivalFouls", "5");
    expect(onUpdateMock).toHaveBeenCalledWith("q3", "rivalFouls", "5");
  });

  it("should support regulation periods list and conditionally render overtime", () => {
    const regulationKeys: PeriodKey[] = ["q1", "q2", "q3", "q4"];
    expect(regulationKeys.length).toBe(4);

    const getActivePeriods = (hasExtra: boolean): PeriodKey[] => {
      return hasExtra ? [...regulationKeys, "extra"] : regulationKeys;
    };

    expect(getActivePeriods(false)).toEqual(["q1", "q2", "q3", "q4"]);
    expect(getActivePeriods(true)).toEqual(["q1", "q2", "q3", "q4", "extra"]);
  });
});
