import { formatPlayerIdentifier } from "../../utils/formatPlayerIdentifier";

describe("formatPlayerIdentifier", () => {
  describe("Jersey Name Priority", () => {
    it("renders jerseyName when present, trimmed, and non-empty", () => {
      expect(
        formatPlayerIdentifier({
          number: "7",
          jerseyName: "SANCHEZ",
          firstName: "Gorka",
          lastName: "Sanchez",
        })
      ).toBe("SANCHEZ");
    });

    it("handles trimmed string jerseyName", () => {
      expect(
        formatPlayerIdentifier({
          number: "77",
          jerseyName: "  DONCIC  ",
          firstName: "Luka",
          lastName: "Doncic",
        })
      ).toBe("DONCIC");
    });

    it("prioritizes jerseyName over first and last names", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: "AIR",
          firstName: "Michael",
          lastName: "Jordan",
        })
      ).toBe("AIR");
    });
  });

  describe("Name Fallback Formatting 'F. Lastname' (When Jersey Name is Absent or Empty)", () => {
    it("formats 'F. Lastname' when jerseyName is missing/undefined and player has number", () => {
      expect(
        formatPlayerIdentifier({
          number: "7",
          firstName: "Gorka",
          lastName: "Sanchez",
        })
      ).toBe("G. Sanchez");
    });

    it("formats 'F. Lastname' when jerseyName is null and player has number", () => {
      expect(
        formatPlayerIdentifier({
          number: "77",
          jerseyName: null,
          firstName: "Luka",
          lastName: "Doncic",
        })
      ).toBe("L. Doncic");
    });

    it("formats 'F. Lastname' when jerseyName is empty string or spaces", () => {
      expect(
        formatPlayerIdentifier({
          number: "23",
          jerseyName: "   ",
          firstName: "Michael",
          lastName: "Jordan",
        })
      ).toBe("M. Jordan");
    });

    it("formats 'F. Lastname' when number is also absent/null", () => {
      expect(
        formatPlayerIdentifier({
          number: null,
          firstName: "Alex",
          lastName: "Delgado",
        })
      ).toBe("A. Delgado");
    });

    it("handles trimmed names and uppercase first initial", () => {
      expect(
        formatPlayerIdentifier({
          firstName: "  pablo  ",
          lastName: " stegmann ",
        })
      ).toBe("P. Stegmann");
    });
  });

  describe("Edge Cases", () => {
    it("returns last name only when first name and jerseyName are missing/empty", () => {
      expect(
        formatPlayerIdentifier({
          number: "9",
          firstName: "",
          lastName: "Ibaka",
        })
      ).toBe("Ibaka");
    });

    it("returns first name only when last name and jerseyName are missing/empty", () => {
      expect(
        formatPlayerIdentifier({
          number: "9",
          firstName: "Ricky",
          lastName: "",
        })
      ).toBe("Ricky");
    });

    it("returns 'Jugador' fallback when both names and jerseyName are missing/null", () => {
      expect(
        formatPlayerIdentifier({
          number: "7",
          firstName: null,
          lastName: null,
        })
      ).toBe("Jugador");
    });

    it("returns 'Jugador' when all names are empty strings or whitespace", () => {
      expect(
        formatPlayerIdentifier({
          number: "7",
          jerseyName: "   ",
          firstName: "   ",
          lastName: "",
        })
      ).toBe("Jugador");
    });

    it("handles empty object or undefined safely", () => {
      expect(formatPlayerIdentifier({} as any)).toBe("Jugador");
      expect(formatPlayerIdentifier(null)).toBe("Jugador");
      expect(formatPlayerIdentifier(undefined)).toBe("Jugador");
    });
  });
});

