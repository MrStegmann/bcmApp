import { formatPlayerIdentifier } from "../../utils/formatPlayerIdentifier";

describe("formatPlayerIdentifier", () => {
  describe("Jersey Name Priority (Exclusive Rendering)", () => {
    it("renders 'jerseyName' when present, even when number and names are present", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: "SANCHEZ",
          number: "7",
          firstName: "Gorka",
          lastName: "Sanchez",
        })
      ).toBe("SANCHEZ");
    });

    it("handles trimmed string jersey names", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: "  DONCIC  ",
          number: "77",
          firstName: "Luka",
          lastName: "Doncic",
        })
      ).toBe("DONCIC");
    });

    it("preserves custom casing of jersey name", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: "P. Stegmann",
          number: "10",
          firstName: "Pablo",
          lastName: "Stegmann",
        })
      ).toBe("P. Stegmann");
    });
  });

  describe("Name Fallback Formatting (When Jersey Name is Absent or Empty)", () => {
    it("formats '[First Initial]. [Last Name]' when jerseyName is null", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: null,
          number: "12",
          firstName: "Alex",
          lastName: "Delgado",
        })
      ).toBe("A. Delgado");
    });

    it("formats '[First Initial]. [Last Name]' when jerseyName is undefined", () => {
      expect(
        formatPlayerIdentifier({
          number: "30",
          firstName: "Stephen",
          lastName: "Curry",
        })
      ).toBe("S. Curry");
    });

    it("formats '[First Initial]. [Last Name]' when jerseyName is empty string or spaces", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: "   ",
          number: "23",
          firstName: "Pablo",
          lastName: "Stegmann",
        })
      ).toBe("P. Stegmann");
    });

    it("handles trimmed names and uppercase first initial", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: "",
          number: "5",
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
          jerseyName: null,
          number: "9",
          firstName: "",
          lastName: "Ibaka",
        })
      ).toBe("Ibaka");
    });

    it("returns first name only when last name and jerseyName are missing/empty", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: "",
          number: "9",
          firstName: "Ricky",
          lastName: "",
        })
      ).toBe("Ricky");
    });

    it("returns '#[number]' when jerseyName and both names are missing/empty but number is present", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: null,
          number: "23",
          firstName: null,
          lastName: null,
        })
      ).toBe("#23");
    });

    it("returns 'Jugador' fallback when both names, jerseyName, and number are missing/null", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: null,
          number: null,
          firstName: null,
          lastName: null,
        })
      ).toBe("Jugador");
    });

    it("returns 'Jugador' when names, jerseyName, and number are empty strings or whitespace", () => {
      expect(
        formatPlayerIdentifier({
          jerseyName: "  ",
          number: " ",
          firstName: "   ",
          lastName: "",
        })
      ).toBe("Jugador");
    });

    it("handles empty object or undefined safely", () => {
      expect(formatPlayerIdentifier({} as any)).toBe("Jugador");
    });
  });
});
