import { PeriodBreakdownTableProps, PeriodBreakdownItem } from "../../types";

describe("PeriodBreakdownTable Component Contract (T013 - US1)", () => {
  const samplePeriods: PeriodBreakdownItem[] = [
    {
      id: "q1",
      label: "Period 1",
      teamPoints: 14,
      teamFouls: 3,
      rivalPoints: 10,
      rivalFouls: 4,
      isExtra: false,
    },
    {
      id: "q2",
      label: "Period 2",
      teamPoints: 10,
      teamFouls: 5,
      rivalPoints: 12,
      rivalFouls: 2,
      isExtra: false,
    },
    {
      id: "q3",
      label: "Period 3",
      teamPoints: 18,
      teamFouls: 2,
      rivalPoints: 14,
      rivalFouls: 3,
      isExtra: false,
    },
    {
      id: "q4",
      label: "Period 4",
      teamPoints: 16,
      teamFouls: 4,
      rivalPoints: 15,
      rivalFouls: 5,
      isExtra: false,
    },
  ];

  const defaultProps: PeriodBreakdownTableProps = {
    periods: samplePeriods,
    totalTeamPoints: 58,
    totalRivalPoints: 51,
    totalTeamFouls: 14,
    totalRivalFouls: 14,
  };

  it("should support 4 regular quarters without extra time", () => {
    expect(defaultProps.periods).toHaveLength(4);
    expect(defaultProps.periods.some((p) => p.isExtra)).toBe(false);
  });

  it("should support inclusion of Extra period when extra time occurred", () => {
    const extraPeriod: PeriodBreakdownItem = {
      id: "extra",
      label: "Extra",
      teamPoints: 8,
      teamFouls: 2,
      rivalPoints: 6,
      rivalFouls: 1,
      isExtra: true,
    };

    const propsWithOvertime: PeriodBreakdownTableProps = {
      ...defaultProps,
      periods: [...samplePeriods, extraPeriod],
      totalTeamPoints: 66,
      totalRivalPoints: 57,
      totalTeamFouls: 16,
      totalRivalFouls: 15,
    };

    expect(propsWithOvertime.periods).toHaveLength(5);
    expect(propsWithOvertime.periods[4].isExtra).toBe(true);
    expect(propsWithOvertime.periods[4].teamPoints).toBe(8);
  });

  it("should compute cumulative totals matching period sums", () => {
    const sumTeamPts = defaultProps.periods.reduce((acc, p) => acc + p.teamPoints, 0);
    const sumRivalPts = defaultProps.periods.reduce((acc, p) => acc + p.rivalPoints, 0);
    const sumTeamFouls = defaultProps.periods.reduce((acc, p) => acc + p.teamFouls, 0);
    const sumRivalFouls = defaultProps.periods.reduce((acc, p) => acc + p.rivalFouls, 0);

    expect(sumTeamPts).toBe(defaultProps.totalTeamPoints);
    expect(sumRivalPts).toBe(defaultProps.totalRivalPoints);
    expect(sumTeamFouls).toBe(defaultProps.totalTeamFouls);
    expect(sumRivalFouls).toBe(defaultProps.totalRivalFouls);
  });
});
