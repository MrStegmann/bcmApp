import { formatThrowStat } from "../../utils/formatThrowStat";

describe("formatThrowStat", () => {
  it("formats successful and attempted throws as 's/a (#%)'", () => {
    // 4 made, 1 missed -> 4/5 (80%)
    expect(formatThrowStat(4, 1)).toBe("4/5 (80%)");
    // 2 made, 1 missed -> 2/3 (67%)
    expect(formatThrowStat(2, 1)).toBe("2/3 (67%)");
    // 1 made, 3 missed -> 1/4 (25%)
    expect(formatThrowStat(1, 3)).toBe("1/4 (25%)");
    // 3 made, 0 missed -> 3/3 (100%)
    expect(formatThrowStat(3, 0)).toBe("3/3 (100%)");
  });

  it("handles zero attempts safely returning '0/0 (0%)'", () => {
    expect(formatThrowStat(0, 0)).toBe("0/0 (0%)");
  });

  it("handles 0 made with missed attempts", () => {
    expect(formatThrowStat(0, 3)).toBe("0/3 (0%)");
  });

  it("handles negative or invalid values gracefully", () => {
    expect(formatThrowStat(-1, 0)).toBe("0/0 (0%)");
    expect(formatThrowStat(NaN, 2)).toBe("0/0 (0%)");
    expect(formatThrowStat(undefined as any, null as any)).toBe("0/0 (0%)");
  });
});
