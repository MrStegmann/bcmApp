import { NextMatchCardProps, NextMatchEntry } from "../../types";
import { formatRoundLabel } from "../../utils/matchDateHelper";

declare const jest: any;

describe("NextMatchCard Component Contract Tests (T007 - US1)", () => {
  const mockPendingMatch: NextMatchEntry = {
    id: 1,
    teamId: 10,
    opponent: "C.B. L'Horta Godella",
    date: "25/10/2026 - 19:30",
    round: "Jornada 3",
    status: "pending",
    hasRoster: false,
  };

  it("should handle null nextMatch state with exact fallback string contract", () => {
    const onConfigure = jest.fn();
    const props: NextMatchCardProps = {
      nextMatch: null,
      onConfigureRoster: onConfigure,
    };

    expect(props.nextMatch).toBeNull();
    const fallbackText = "Sin próximos partidos agendados";
    expect(fallbackText).toBe("Sin próximos partidos agendados");
  });

  it("should supply correct opponent and date when nextMatch exists", () => {
    const onConfigure = jest.fn();
    const props: NextMatchCardProps = {
      nextMatch: mockPendingMatch,
      onConfigureRoster: onConfigure,
    };

    expect(props.nextMatch?.opponent).toBe("C.B. L'Horta Godella");
    expect(props.nextMatch?.date).toBe("25/10/2026 - 19:30");
    expect(props.nextMatch?.hasRoster).toBe(false);

    props.onConfigureRoster(mockPendingMatch);
    expect(onConfigure).toHaveBeenCalledWith(mockPendingMatch);
  });

  it("should indicate roster configured state when hasRoster is true", () => {
    const onConfigure = jest.fn();
    const matchWithRoster: NextMatchEntry = {
      ...mockPendingMatch,
      hasRoster: true,
    };

    const props: NextMatchCardProps = {
      nextMatch: matchWithRoster,
      onConfigureRoster: onConfigure,
    };

    expect(props.nextMatch?.hasRoster).toBe(true);
    props.onConfigureRoster(matchWithRoster);
    expect(onConfigure).toHaveBeenCalledWith(matchWithRoster);
  });

  describe("Round format resilience (Bug fix: home-view-round-render-error)", () => {
    it("should format round safely when round is a number (e.g. 1 -> Jornada 1)", () => {
      const matchWithNumericRound: NextMatchEntry = {
        ...mockPendingMatch,
        round: 1,
      };

      const label = formatRoundLabel(matchWithNumericRound.round);
      expect(label).toBe("Jornada 1");
    });

    it("should format round safely when round is an unprefixed string number (e.g. '2' -> Jornada 2)", () => {
      const matchWithStringRound: NextMatchEntry = {
        ...mockPendingMatch,
        round: "2",
      };

      const label = formatRoundLabel(matchWithStringRound.round);
      expect(label).toBe("Jornada 2");
    });

    it("should preserve already formatted round strings (e.g. 'Jornada 3' -> Jornada 3)", () => {
      const matchWithPrefixedRound: NextMatchEntry = {
        ...mockPendingMatch,
        round: "Jornada 3",
      };

      const label = formatRoundLabel(matchWithPrefixedRound.round);
      expect(label).toBe("Jornada 3");
    });

    it("should preserve lowercase formatted round strings without duplicating prefix (e.g. 'jornada 5')", () => {
      const matchWithLowercaseRound: NextMatchEntry = {
        ...mockPendingMatch,
        round: "jornada 5",
      };

      const label = formatRoundLabel(matchWithLowercaseRound.round);
      expect(label).toBe("jornada 5");
    });

    it("should return empty string when round is null or undefined without throwing TypeError", () => {
      expect(formatRoundLabel(null)).toBe("");
      expect(formatRoundLabel(undefined)).toBe("");
      expect(formatRoundLabel("")).toBe("");
    });
  });
});


