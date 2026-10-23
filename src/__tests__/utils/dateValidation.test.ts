import {
  isValidMatchTimestamp,
  parseMatchTimestamp,
  validateMatchTimestamp,
  applyDateMask,
  validateMatchDate,
  parseMatchDate,
  isValidMatchDate,
} from "../../utils/dateValidation";

describe("dateValidation Helper Tests (T003)", () => {
  describe("applyDateMask", () => {
    it("should format consecutive numbers with slashes", () => {
      expect(applyDateMask("2")).toBe("2");
      expect(applyDateMask("23")).toBe("23");
      expect(applyDateMask("231")).toBe("23/1");
      expect(applyDateMask("2310")).toBe("23/10");
      expect(applyDateMask("23102")).toBe("23/10/2");
      expect(applyDateMask("23102026")).toBe("23/10/2026");
    });

    it("should strip non-numeric characters", () => {
      expect(applyDateMask("23a10b2026")).toBe("23/10/2026");
      expect(applyDateMask("abc")).toBe("");
      expect(applyDateMask("23-10-2026")).toBe("23/10/2026");
      expect(applyDateMask(" 23 / 10 / 2026 ")).toBe("23/10/2026");
    });

    it("should limit input to 8 digits (10 chars dd/mm/aaaa)", () => {
      expect(applyDateMask("231020269999")).toBe("23/10/2026");
    });

    it("should handle empty string and non-string inputs safely", () => {
      expect(applyDateMask("")).toBe("");
      expect(applyDateMask(null as any)).toBe("");
      expect(applyDateMask(undefined as any)).toBe("");
    });
  });

  describe("validateMatchDate", () => {
    it("should return valid result for correct dates in dd/mm/aaaa format", () => {
      expect(validateMatchDate("23/10/2026").isValid).toBe(true);
      expect(validateMatchDate("01/01/2025").isValid).toBe(true);
      expect(validateMatchDate("31/12/2024").isValid).toBe(true);
      expect(validateMatchDate("29/02/2024").isValid).toBe(true); // Leap year
    });

    it("should return error message for empty value", () => {
      const result = validateMatchDate("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Debe introducir la fecha del partido");
    });

    it("should return error message for invalid format or incomplete date", () => {
      expect(validateMatchDate("23/10/202").isValid).toBe(false);
      expect(validateMatchDate("23-10-2026").isValid).toBe(false);
      expect(validateMatchDate("2026/10/23").isValid).toBe(false);
      expect(validateMatchDate("abcdefgh").isValid).toBe(false);
    });

    it("should return error message for invalid calendar days and leap years", () => {
      expect(validateMatchDate("32/01/2026").isValid).toBe(false);
      expect(validateMatchDate("00/01/2026").isValid).toBe(false);
      expect(validateMatchDate("15/13/2026").isValid).toBe(false);
      expect(validateMatchDate("31/04/2026").isValid).toBe(false); // April has 30 days
      expect(validateMatchDate("29/02/2025").isValid).toBe(false); // 2025 is not leap year
    });
  });

  describe("isValidMatchDate", () => {
    it("should return true for valid dd/mm/aaaa dates and false otherwise", () => {
      expect(isValidMatchDate("23/10/2026")).toBe(true);
      expect(isValidMatchDate("29/02/2024")).toBe(true);
      expect(isValidMatchDate("29/02/2025")).toBe(false);
      expect(isValidMatchDate("31/04/2026")).toBe(false);
      expect(isValidMatchDate("invalid")).toBe(false);
    });
  });

  describe("parseMatchDate / parseMatchTimestamp (backward compatibility)", () => {
    it("should parse date-only dd/mm/aaaa format", () => {
      const date = parseMatchDate("23/10/2026");
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(9); // October
      expect(date?.getDate()).toBe(23);
    });

    it("should parse legacy dd/mm/aaaa - hh:mm format with parseMatchTimestamp and parseMatchDate", () => {
      const date = parseMatchTimestamp("15/10/2026 - 19:30");
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(9);
      expect(date?.getDate()).toBe(15);
      expect(date?.getHours()).toBe(19);
      expect(date?.getMinutes()).toBe(30);

      const parsedFromHelper = parseMatchDate("15/10/2026 - 19:30");
      expect(parsedFromHelper).toBeInstanceOf(Date);
      expect(parsedFromHelper?.getFullYear()).toBe(2026);
      expect(parsedFromHelper?.getDate()).toBe(15);
    });

    it("should also allow parseMatchTimestamp to parse date-only strings for backward compatibility", () => {
      const date = parseMatchTimestamp("23/10/2026");
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(9);
      expect(date?.getDate()).toBe(23);
    });

    it("should return null for invalid date strings", () => {
      expect(parseMatchDate("invalid")).toBeNull();
      expect(parseMatchDate("32/01/2026")).toBeNull();
      expect(parseMatchTimestamp("invalid")).toBeNull();
    });
  });

  describe("legacy validateMatchTimestamp", () => {
    it("should validate legacy timestamp format", () => {
      expect(validateMatchTimestamp("15/10/2026 - 19:30").isValid).toBe(true);
      expect(validateMatchTimestamp("").isValid).toBe(false);
    });
  });
});
