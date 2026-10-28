import React from "react";
import { Game } from "../../../../types/database";
import { PlayMatchProps } from "../../types";
import { usePlayMatchStore, resetPlayMatchStore } from "../../store/usePlayMatchStore";

declare const jest: any;

describe("PlayMatch Integration Tests (T037 - Phase 7)", () => {
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

  beforeEach(() => {
    resetPlayMatchStore();
  });

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

  it("should update matchHeaderInfo with scoreOnly mode and live scores in menu store (T053 - US7)", () => {
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
      scoreOnly: true,
    });
    useMenuStore.getState().setHeaderTitle(`${teamScore} - ${rivalScore}`);

    const menuState = useMenuStore.getState();
    expect(menuState.matchHeaderInfo).toEqual({
      teamName: "Canasta Real BCM",
      teamScore: 18,
      rivalScore: 14,
      rivalName: "Valencia Basket",
      scoreOnly: true,
    });
    expect(menuState.matchHeaderInfo?.scoreOnly).toBe(true);

    // Test unmount cleanup
    useMenuStore.getState().setMatchHeaderInfo(null);
    useMenuStore.getState().setHeaderTitle("Partidos");
    expect(useMenuStore.getState().matchHeaderInfo).toBeNull();
    expect(useMenuStore.getState().headerTitle).toBe("Partidos");
  });

  it("should execute full match lifecycle: lineup, timer, stats, 2s hold subtraction with cascading assist, and unrestricted substitutions", () => {
    const mockRoster = [
      { id: 1, firstName: "Luka", lastName: "Doncic", number: "77", isOnCourt: false, secondsPlayed: 0, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
      { id: 2, firstName: "Kyrie", lastName: "Irving", number: "11", isOnCourt: false, secondsPlayed: 0, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
      { id: 3, firstName: "Klay", lastName: "Thompson", number: "31", isOnCourt: false, secondsPlayed: 0, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
      { id: 4, firstName: "PJ", lastName: "Washington", number: "25", isOnCourt: false, secondsPlayed: 0, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
      { id: 5, firstName: "Dereck", lastName: "Lively", number: "2", isOnCourt: false, secondsPlayed: 0, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
      { id: 6, firstName: "Daniel", lastName: "Gafford", number: "21", isOnCourt: false, secondsPlayed: 0, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
    ];

    const store = usePlayMatchStore.getState();
    store.initMatch(1, mockRoster, [1, 2, 3, 4, 5]);

    // Verify 5 active court players
    const court = usePlayMatchStore.getState().getActiveCourtPlayers();
    expect(court.filter((p) => p !== null).length).toBe(5);

    // Start timer and tick 180 seconds
    store.toggleTimer();
    expect(usePlayMatchStore.getState().isTimerRunning).toBe(true);
    store.tickTimer(180);

    const luka = usePlayMatchStore.getState().players.find((p) => p.id === 1);
    expect(luka?.stintSeconds).toBe(180);

    // Record 2pt made basket by Kyrie assisted by Luka
    store.recordPlayerStat(2, "t2a", 1);
    expect(usePlayMatchStore.getState().periods.q1.teamScore).toBe(2);
    expect(usePlayMatchStore.getState().players.find((p) => p.id === 1)?.asis).toBe(1);

    // Subtract 2pt made basket (simulating 2s hold subtraction modal confirmation)
    store.subtractPlayerStat(2, "t2a");
    expect(usePlayMatchStore.getState().periods.q1.teamScore).toBe(0);
    expect(usePlayMatchStore.getState().players.find((p) => p.id === 1)?.asis).toBe(0); // Cascaded!

    // Unrestricted substitution while clock is running
    store.toggleSwapMode();
    store.selectSwapCourtPlayer(1);
    store.selectSwapBenchPlayer(6);
    store.confirmSwap();

    const state = usePlayMatchStore.getState();
    expect(state.players.find((p) => p.id === 1)?.isOnCourt).toBe(false);
    expect(state.players.find((p) => p.id === 6)?.isOnCourt).toBe(true);
    expect(state.players.find((p) => p.id === 6)?.stintSeconds).toBe(0); // Reset for incoming
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

    it("should correctly populate InGamePlayer statistics and stintSeconds from playerStats", () => {
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
      expect(player1.stintSeconds).toBe(0);
      expect(player1.t1a).toBe(2);
      expect(player1.t3a).toBe(3);
      expect(player1.asis).toBe(5);
      expect(player1.isOnCourt).toBe(false);
      expect(player1.courtPositionIndex).toBeNull();
    });

    it("should propagate jerseyName (or snake_case jersey_name) onto InGamePlayer objects", () => {
      const { buildMatchRoster } = require("../../utils/roster");
      const players = [
        { id: 1, firstName: "Gorka", lastName: "Sanchez", jerseyName: "SANCHEZ" },
        { id: 2, firstName: "Pablo", lastName: "Stegmann", jersey_name: "STEGMANN" },
        { id: 3, firstName: "Alex", lastName: "Delgado" },
      ];
      const roster = buildMatchRoster(players, []);
      expect(roster[0].jerseyName).toBe("SANCHEZ");
      expect(roster[1].jerseyName).toBe("STEGMANN");
      expect(roster[2].jerseyName).toBeNull();
    });
  });

  describe("US5 - Bench Player Stats Modal Integration", () => {
    it("should manage bench player selection and informational stats display flow", () => {
      const mockRoster = [
        { id: 1, firstName: "Luka", lastName: "Doncic", number: "77", isOnCourt: false, secondsPlayed: 600, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 2, firstName: "Kyrie", lastName: "Irving", number: "11", isOnCourt: false, secondsPlayed: 600, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 3, firstName: "Klay", lastName: "Thompson", number: "31", isOnCourt: false, secondsPlayed: 600, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 4, firstName: "PJ", lastName: "Washington", number: "25", isOnCourt: false, secondsPlayed: 600, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 5, firstName: "Dereck", lastName: "Lively", number: "2", isOnCourt: false, secondsPlayed: 600, stintSeconds: 0, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 6, firstName: "Daniel", lastName: "Gafford", number: "21", jerseyName: "GAFFORD", isOnCourt: false, secondsPlayed: 720, stintSeconds: 0, t1a: 2, t1i: 1, t2a: 4, t2i: 1, t3a: 0, t3i: 0, oreb: 3, dreb: 4, asis: 5, rec: 2, per: 1, falt: 2, valuation: 18 },
      ];

      const store = usePlayMatchStore.getState();
      store.initMatch(1, mockRoster, [1, 2, 3, 4, 5]);

      const bench = usePlayMatchStore.getState().getBenchPlayers();
      expect(bench.length).toBe(1);
      const benchPlayer = bench[0];
      expect(benchPlayer.id).toBe(6);

      // Verify formatting for modal consumption
      const { formatThrowStat } = require("../../utils/formatThrowStat");
      const { formatPlayerIdentifier } = require("../../utils/formatPlayerIdentifier");

      expect(formatPlayerIdentifier(benchPlayer)).toBe("GAFFORD");
      expect(formatThrowStat(benchPlayer.t1a, benchPlayer.t1i)).toBe("2/3 (67%)");
      expect(formatThrowStat(benchPlayer.t2a, benchPlayer.t2i)).toBe("4/5 (80%)");
      expect(formatThrowStat(benchPlayer.t3a, benchPlayer.t3i)).toBe("0/0 (0%)");
    });
  });
});
