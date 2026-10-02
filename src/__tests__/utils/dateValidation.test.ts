import {
  isValidMatchTimestamp,
  parseMatchTimestamp,
  validateMatchTimestamp,
} from "../../utils/dateValidation";

describe("dateValidation Helper Tests (T003)", () => {
  describe("isValidMatchTimestamp", () => {
    it("should return true for valid timestamps in dd/mm/aaaa - hh:mm format", () => {
      expect(isValidMatchTimestamp("15/10/2026 - 19:30")).toBe(true);
      expect(isValidMatchTimestamp("01/01/2025 - 00:00")).toBe(true);
      expect(isValidMatchTimestamp("31/12/2024 - 23:59")).toBe(true);
      expect(isValidMatchTimestamp("29/02/2024 - 12:00")).toBe(true); // Leap year
    });

    it("should return false for incorrect formats or delimiters", () => {
      expect(isValidMatchTimestamp("")).toBe(false);
      expect(isValidMatchTimestamp("15-10-2026 19:30")).toBe(false);
      expect(isValidMatchTimestamp("15/10/2026-19:30")).toBe(false);
      expect(isValidMatchTimestamp("15/10/26 - 19:30")).toBe(false);
      expect(isValidMatchTimestamp("2026/10/15 - 19:30")).toBe(false);
      expect(isValidMatchTimestamp("15/10/2026 - 19:30:00")).toBe(false);
    });

    it("should return false for invalid calendar dates or times", () => {
      expect(isValidMatchTimestamp("32/01/2026 - 10:00")).toBe(false); // Invalid day
      expect(isValidMatchTimestamp("00/01/2026 - 10:00")).toBe(false); // Zero day
      expect(isValidMatchTimestamp("15/13/2026 - 10:00")).toBe(false); // Invalid month
      expect(isValidMatchTimestamp("31/04/2026 - 10:00")).toBe(false); // April has 30 days
      expect(isValidMatchTimestamp("29/02/2025 - 10:00")).toBe(false); // 2025 is not a leap year
      expect(isValidMatchTimestamp("15/10/2026 - 24:00")).toBe(false); // 24 hour invalid
      expect(isValidMatchTimestamp("15/10/2026 - 12:60")).toBe(false); // 60 min invalid
    });
  });

  describe("parseMatchTimestamp", () => {
    it("should parse valid timestamp string into Date object", () => {
      const date = parseMatchTimestamp("15/10/2026 - 19:30");
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(9); // 0-indexed: October is 9
      expect(date?.getDate()).toBe(15);
      expect(date?.getHours()).toBe(19);
      expect(date?.getMinutes()).toBe(30);
    });

    it("should return null for invalid timestamp string", () => {
      expect(parseMatchTimestamp("invalid")).toBeNull();
      expect(parseMatchTimestamp("32/01/2026 - 10:00")).toBeNull();
    });
  });

  describe("validateMatchTimestamp", () => {
    it("should return error message for empty or invalid format", () => {
      expect(validateMatchTimestamp("").isValid).toBe(false);
      expect(validateMatchTimestamp("").error).toBe("Debe introducir la fecha del partido");

      expect(validateMatchTimestamp("1234").isValid).toBe(false);
      expect(validateMatchTimestamp("1234").error).toBe("Formato de fecha inválido. Utilice dd/mm/aaaa - hh:mm");
    });

    it("should return valid result for correct timestamp", () => {
      const result = validateMatchTimestamp("15/10/2026 - 19:30");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
