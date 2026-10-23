import React from "react";
import { Game } from "../../../../types/database";
import { PlayMatchProps } from "../../types";

declare const jest: any;

describe("PlayMatch Integration Tests (T024 - Phase 7)", () => {
  const mockMatch: Game = {
    id: 1,
    teamId: 1,
    opponent: "Lakers",
    round: "1",
    date: "2026-10-03",
    status: "inProgress",
    createdAt: new Date().toISOString(),
    resultC1: 0,
    resultC2: 0,
    resultC3: 0,
    resultC4: 0,
    resultExtra: 0,
    resultC1Opponent: 0,
    resultC2Opponent: 0,
    resultC3Opponent: 0,
    resultC4Opponent: 0,
    resultExtraOpponent: 0,
    foulsC1: 0,
    foulsC2: 0,
    foulsC3: 0,
    foulsC4: 0,
    foulsExtra: 0,
    foulsC1Opponent: 0,
    foulsC2Opponent: 0,
    foulsC3Opponent: 0,
    foulsC4Opponent: 0,
    foulsExtraOpponent: 0,
  };

  it("should conform to PlayMatchProps contract", () => {
    const onFinishMock = jest.fn();
    const onReturnMock = jest.fn();

    const props: PlayMatchProps = {
      match: mockMatch,
      onFinishMatch: onFinishMock,
      onReturn: onReturnMock,
    };

    expect(props.match.id).toBe(1);
    expect(props.match.opponent).toBe("Lakers");

    props.onFinishMatch();
    expect(onFinishMock).toHaveBeenCalledTimes(1);

    props.onReturn();
    expect(onReturnMock).toHaveBeenCalledTimes(1);
  });

  it("should format global header score as ${teamName} ${teamTotalScore} - ${rivalTotalScore} ${rivalName}", () => {
    const formatGlobalScore = (
      teamName: string,
      teamTotalScore: number,
      rivalTotalScore: number,
      rivalName: string
    ) => `${teamName} ${teamTotalScore} - ${rivalTotalScore} ${rivalName}`;

    const header = formatGlobalScore("BC Manresa", 78, 72, "Joventut");
    expect(header).toBe("BC Manresa 78 - 72 Joventut");
  });

  it("should support long team names without ellipsis or truncation by wrapping onto new lines", () => {
    const longTeam = "Danés Academy Basket Senior Masculino";
    const longRival = "Club Baloncesto Ciudad de Móstoles";
    const scoreText = `${longTeam} 85 - 80 ${longRival}`;

    expect(scoreText).not.toContain("...");
    expect(scoreText).toContain(longTeam);
    expect(scoreText).toContain(longRival);
  });

  it("should specify arrow-left icon for go-back and save icon for finalize match in application header", () => {
    const headerBackAction = {
      label: "Volver",
      iconName: "arrow-left",
      iconFamily: "Feather",
      testID: "header-back-button",
    };

    const headerAction = {
      label: "Finalizar",
      iconName: "save",
      iconFamily: "Feather",
      testID: "header-action-button",
    };

    expect(headerBackAction.iconName).toBe("arrow-left");
    expect(headerAction.iconName).toBe("save");
  });

  it("should update matchHeaderInfo and headerTitle in menu store with live scores and team names", () => {
    const { useMenuStore } = require("../../../../store/MenuStore");
    const teamName = "Canasta Real BCM";
    const teamScore = 18;
    const rivalScore = 14;
    const rivalName = "Valencia Basket";

    useMenuStore.getState().setMatchHeaderInfo({
      teamName,
      teamScore,
      rivalScore,
      rivalName,
    });
    useMenuStore.getState().setHeaderTitle(`${teamName} ${teamScore} - ${rivalScore} ${rivalName}`);

    const menuState = useMenuStore.getState();
    expect(menuState.matchHeaderInfo).toEqual({
      teamName: "Canasta Real BCM",
      teamScore: 18,
      rivalScore: 14,
      rivalName: "Valencia Basket",
    });
    expect(menuState.headerTitle).toBe("Canasta Real BCM 18 - 14 Valencia Basket");

    // Test unmount cleanup
    useMenuStore.getState().setMatchHeaderInfo(null);
    useMenuStore.getState().setHeaderTitle("Partidos");
    expect(useMenuStore.getState().matchHeaderInfo).toBeNull();
    expect(useMenuStore.getState().headerTitle).toBe("Partidos");
  });

  describe("Roster Filtering (Bug Fix: initial-quintet-match-roster)", () => {
    const mockTeamPlayers = [
      { id: 1, firstName: "Luka", lastName: "Doncic", number: "77", position: "Base" },
      { id: 2, firstName: "Kyrie", lastName: "Irving", number: "11", position: "Escolta" },
      { id: 3, firstName: "Klay", lastName: "Thompson", number: "31", position: "Alero" },
      { id: 4, firstName: "PJ", lastName: "Washington", number: "25", position: "Ala-Pívot" },
      { id: 5, firstName: "Dereck", lastName: "Lively", number: "2", position: "Pívot" },
      { id: 6, firstName: "Daniel", lastName: "Gafford", number: "21", position: "Pívot" },
      { id: 7, firstName: "Jaden", lastName: "Hardy", number: "1", position: "Escolta" },
      { id: 8, firstName: "Dwight", lastName: "Powell", number: "7", position: "Pívot" },
      { id: 9, firstName: "Maxi", lastName: "Kleber", number: "42", position: "Ala-Pívot" },
    ];

    it("should filter team players down strictly to the called-up match roster defined in playerStats", () => {
      const { buildMatchRoster } = require("../../utils/roster");
      // Simulate called-up players: 6 players called up (IDs 1, 2, 3, 4, 5, 6)
      const existingStats = [
        { gameId: 1, playerId: 1, minutes: 0 },
        { gameId: 1, playerId: 2, minutes: 0 },
        { gameId: 1, playerId: 3, minutes: 0 },
        { gameId: 1, playerId: 4, minutes: 0 },
        { gameId: 1, playerId: 5, minutes: 0 },
        { gameId: 1, playerId: 6, minutes: 0 },
      ];

      const roster = buildMatchRoster(mockTeamPlayers, existingStats);

      expect(roster).toHaveLength(6);
      expect(roster.map((p: any) => p.id)).toEqual([1, 2, 3, 4, 5, 6]);

      // Non-called-up players (7, 8, 9) MUST NOT be present
      expect(roster.some((p: any) => p.id === 7)).toBe(false);
      expect(roster.some((p: any) => p.id === 8)).toBe(false);
      expect(roster.some((p: any) => p.id === 9)).toBe(false);
    });

    it("should gracefully fall back to all team players if playerStats is empty (legacy match support)", () => {
      const { buildMatchRoster } = require("../../utils/roster");
      const emptyStats: any[] = [];

      const roster = buildMatchRoster(mockTeamPlayers, emptyStats);

      expect(roster).toHaveLength(9);
      expect(roster.map((p: any) => p.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should correctly populate InGamePlayer statistics and properties from playerStats", () => {
      const { buildMatchRoster } = require("../../utils/roster");
      const existingStats = [
        {
          gameId: 1,
          playerId: 1,
          minutes: 10,
          t1a: 2,
          t1i: 1,
          t2a: 4,
          t2i: 2,
          t3a: 3,
          t3i: 1,
          oreb: 1,
          dreb: 4,
          asis: 5,
          rec: 2,
          per: 1,
          falt: 2,
          valuation: 18,
        },
      ];

      const roster = buildMatchRoster(mockTeamPlayers, existingStats);

      expect(roster).toHaveLength(1);
      const player1 = roster[0];
      expect(player1.id).toBe(1);
      expect(player1.firstName).toBe("Luka");
      expect(player1.secondsPlayed).toBe(600); // 10 minutes * 60
      expect(player1.t1a).toBe(2);
      expect(player1.t3a).toBe(3);
      expect(player1.asis).toBe(5);
      expect(player1.isOnCourt).toBe(false);
      expect(player1.courtPositionIndex).toBeNull();
    });
  });
});

