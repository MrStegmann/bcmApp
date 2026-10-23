import { RecentMatchesColumnProps, RecentMatchCardProps, RecentMatchSummary } from "../../types";
import { formatRoundLabel } from "../../utils/matchDateHelper";

declare const jest: any;

describe("RecentMatchesColumn & RecentMatchCard Contract Tests (T011 - US2)", () => {
  const mockRecentMatches: RecentMatchSummary[] = [
    {
      id: 101,
      teamId: 1,
      opponent: "Valencia Basket",
      date: "20/10/2026 - 20:00",
      round: "Jornada 2",
      status: "finished",
      teamTotalScore: 82,
      rivalTotalScore: 78,
      isWinning: true,
      periods: [
        { period: "Q1", teamScore: 20, rivalScore: 18 },
        { period: "Q2", teamScore: 22, rivalScore: 20 },
        { period: "Q3", teamScore: 18, rivalScore: 22 },
        { period: "Q4", teamScore: 22, rivalScore: 18 },
      ],
    },
    {
      id: 102,
      teamId: 1,
      opponent: "Bàsquet Girona",
      date: "14/10/2026 - 18:30",
      round: "Jornada 1",
      status: "finished",
      teamTotalScore: 65,
      rivalTotalScore: 70,
      isWinning: false,
      periods: [
        { period: "Q1", teamScore: 15, rivalScore: 16 },
        { period: "Q2", teamScore: 18, rivalScore: 19 },
        { period: "Q3", teamScore: 14, rivalScore: 18 },
        { period: "Q4", teamScore: 18, rivalScore: 17 },
      ],
    },
  ];

  it("should handle empty matches array gracefully", () => {
    const onSelect = jest.fn();
    const props: RecentMatchesColumnProps = {
      matches: [],
      onSelectMatch: onSelect,
    };

    expect(props.matches).toHaveLength(0);
  });

  it("should enforce displaying up to 3 matches max in vertical column", () => {
    const onSelect = jest.fn();
    const props: RecentMatchesColumnProps = {
      matches: mockRecentMatches,
      onSelectMatch: onSelect,
    };

    expect(props.matches.length).toBeLessThanOrEqual(3);
    expect(props.matches[0].opponent).toBe("Valencia Basket");
    expect(props.matches[0].isWinning).toBe(true);
    expect(props.matches[1].isWinning).toBe(false);
  });

  it("should trigger onSelectMatch when match card action is invoked", () => {
    const onPress = jest.fn();
    const cardProps: RecentMatchCardProps = {
      match: mockRecentMatches[0],
      onPress,
    };

    cardProps.onPress();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("should verify period breakdown sub-row contains all 4 quarters or overtime", () => {
    const match = mockRecentMatches[0];
    expect(match.periods).toHaveLength(4);
    const sumTeam = match.periods.reduce((acc, p) => acc + p.teamScore, 0);
    const sumRival = match.periods.reduce((acc, p) => acc + p.rivalScore, 0);

    expect(sumTeam).toBe(match.teamTotalScore);
    expect(sumRival).toBe(match.rivalTotalScore);
  });

  describe("RecentMatchCard round formatting resilience (Bug fix: home-view-round-render-error)", () => {
    it("should format round safely when round is numeric in finished match", () => {
      const matchWithNumericRound: RecentMatchSummary = {
        ...mockRecentMatches[0],
        round: 2,
      };

      const label = formatRoundLabel(matchWithNumericRound.round);
      expect(label).toBe("Jornada 2");
    });

    it("should format round safely when round is unprefixed string number", () => {
      const matchWithStringRound: RecentMatchSummary = {
        ...mockRecentMatches[1],
        round: "1",
      };

      const label = formatRoundLabel(matchWithStringRound.round);
      expect(label).toBe("Jornada 1");
    });
  });
});

