import { formatStintTime } from "../../utils/formatStintTime";

describe("formatStintTime", () => {
  it("formats 0 or negative seconds to 00:00", () => {
    expect(formatStintTime(0)).toBe("00:00");
    expect(formatStintTime(-10)).toBe("00:00");
    expect(formatStintTime(null)).toBe("00:00");
    expect(formatStintTime(undefined)).toBe("00:00");
  });

  it("formats seconds under one minute with zero padding", () => {
    expect(formatStintTime(5)).toBe("00:05");
    expect(formatStintTime(30)).toBe("00:30");
    expect(formatStintTime(45)).toBe("00:45");
    expect(formatStintTime(59)).toBe("00:59");
  });

  it("formats exact minutes", () => {
    expect(formatStintTime(60)).toBe("01:00");
    expect(formatStintTime(120)).toBe("02:00");
    expect(formatStintTime(600)).toBe("10:00");
  });

  it("formats minutes and seconds combined", () => {
    expect(formatStintTime(65)).toBe("01:05");
    expect(formatStintTime(145)).toBe("02:25");
    expect(formatStintTime(725)).toBe("12:05");
  });
});
