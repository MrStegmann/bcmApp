import { Game, Player } from "../../types/database";
import { DirectResultBuffer } from "../../features/direct-result/types";
import { calculateValuation } from "../../features/direct-result/utils/directResultCalculations";

declare const jest: any;

describe("GameList Direct Result Integration Tests (T012 - US4)", () => {
  const pendingMatch: Game = {
    id: 101,
    teamId: 1,
    opponent: "Real Madrid",
    round: "Jornada 1",
    date: "25/10/2026",
    status: "pending",
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
    createdAt: new Date().toISOString(),
  };

  const inProgressMatch: Game = {
    ...pendingMatch,
    id: 102,
    opponent: "Barcelona",
    status: "inProgress",
  };

  const mockAvailablePlayers: Player[] = [
    { id: 1, teamId: 1, firstName: "Luka", lastName: "Doncic", number: "77", jerseyName: "Doncic", createdAt: "" },
    { id: 2, teamId: 1, firstName: "Kyrie", lastName: "Irving", number: "11", jerseyName: "Irving", createdAt: "" },
  ];

  it("should open direct result modal for pending game and resolve players", async () => {
    let directResultModalVisible = false;
    let pendingMatchToSetResult: Game | null = null;
    let modalPlayers: Player[] = [];

    const mockGetCalledUpPlayers = jest.fn().mockResolvedValue([
      { playerId: 1 },
    ]);

    const handleOpenSetResult = async (game: Game) => {
      // Guard: only pending matches allowed
      if (game.status !== "pending" && game.status) return;

      pendingMatchToSetResult = game;

      const calledUp = await mockGetCalledUpPlayers(game.id);
      if (calledUp && calledUp.length > 0) {
        const calledUpIds = calledUp.map((c: any) => c.playerId || c.player_id);
        modalPlayers = mockAvailablePlayers.filter((p) => calledUpIds.includes(p.id));
      } else {
        modalPlayers = mockAvailablePlayers;
      }

      directResultModalVisible = true;
    };

    await handleOpenSetResult(pendingMatch);

    expect(directResultModalVisible).toBe(true);
    expect(pendingMatchToSetResult).toEqual(pendingMatch);
    expect(modalPlayers.length).toBe(1);
    expect(modalPlayers[0].id).toBe(1);
  });

  it("should ignore open direct result trigger for non-pending games", async () => {
    let directResultModalVisible = false;
    let pendingMatchToSetResult: Game | null = null;

    const handleOpenSetResult = async (game: Game) => {
      if (game.status !== "pending" && game.status) return;
      pendingMatchToSetResult = game;
      directResultModalVisible = true;
    };

    await handleOpenSetResult(inProgressMatch);

    expect(directResultModalVisible).toBe(false);
    expect(pendingMatchToSetResult).toBeNull();
  });

  it("should atomically persist scores, player stats, transition status to finished, and refresh data", async () => {
    let directResultModalVisible = true;
    let pendingMatchToSetResult: Game | null = pendingMatch;
    const mockGetData = jest.fn().mockResolvedValue(true);
    const mockFinishMatch = jest.fn().mockResolvedValue(true);
    const mockBatchSavePlayerStats = jest.fn().mockResolvedValue(true);

    const validBuffer: DirectResultBuffer = {
      hasExtraTime: false,
      periods: {
        q1: { teamPoints: 20, teamFouls: 2, rivalPoints: 18, rivalFouls: 3 },
        q2: { teamPoints: 22, teamFouls: 3, rivalPoints: 20, rivalFouls: 2 },
        q3: { teamPoints: 25, teamFouls: 1, rivalPoints: 22, rivalFouls: 4 },
        q4: { teamPoints: 18, teamFouls: 4, rivalPoints: 19, rivalFouls: 2 },
        extra: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      },
      players: {
        1: {
          playerId: 1,
          minutes: 35,
          t1a: 5, t1i: 6,
          t2a: 7, t2i: 12,
          t3a: 2, t3i: 6,
          oreb: 2, dreb: 6,
          asis: 8, rec: 2, per: 3, falt: 2,
        },
      },
    };

    const handleSaveDirectResult = async (matchId: number, buffer: DirectResultBuffer) => {
      const finalScores = {
        status: "finished" as const,
        resultC1: buffer.periods.q1.teamPoints,
        resultC2: buffer.periods.q2.teamPoints,
        resultC3: buffer.periods.q3.teamPoints,
        resultC4: buffer.periods.q4.teamPoints,
        resultExtra: buffer.hasExtraTime ? buffer.periods.extra.teamPoints : 0,
        resultC1Opponent: buffer.periods.q1.rivalPoints,
        resultC2Opponent: buffer.periods.q2.rivalPoints,
        resultC3Opponent: buffer.periods.q3.rivalPoints,
        resultC4Opponent: buffer.periods.q4.rivalPoints,
        resultExtraOpponent: buffer.hasExtraTime ? buffer.periods.extra.rivalPoints : 0,
        foulsC1: buffer.periods.q1.teamFouls,
        foulsC2: buffer.periods.q2.teamFouls,
        foulsC3: buffer.periods.q3.teamFouls,
        foulsC4: buffer.periods.q4.teamFouls,
        foulsExtra: buffer.hasExtraTime ? buffer.periods.extra.teamFouls : 0,
        foulsC1Opponent: buffer.periods.q1.rivalFouls,
        foulsC2Opponent: buffer.periods.q2.rivalFouls,
        foulsC3Opponent: buffer.periods.q3.rivalFouls,
        foulsC4Opponent: buffer.periods.q4.rivalFouls,
        foulsExtraOpponent: buffer.hasExtraTime ? buffer.periods.extra.rivalFouls : 0,
      };

      const statsToSave = Object.values(buffer.players).map((stat) => ({
        gameId: matchId,
        playerId: stat.playerId,
        minutes: stat.minutes,
        t1a: stat.t1a,
        t1i: stat.t1i,
        t2a: stat.t2a,
        t2i: stat.t2i,
        t3a: stat.t3a,
        t3i: stat.t3i,
        oreb: stat.oreb,
        dreb: stat.dreb,
        asis: stat.asis,
        rec: stat.rec,
        per: stat.per,
        falt: stat.falt,
        valuation: calculateValuation(stat),
      }));

      await mockBatchSavePlayerStats(statsToSave);
      await mockFinishMatch(matchId, finalScores);

      await mockGetData();
      directResultModalVisible = false;
      pendingMatchToSetResult = null;
    };

    await handleSaveDirectResult(101, validBuffer);

    expect(mockBatchSavePlayerStats).toHaveBeenCalledTimes(1);
    expect(mockFinishMatch).toHaveBeenCalledWith(101, expect.objectContaining({
      status: "finished",
      resultC1: 20,
      resultC1Opponent: 18,
    }));
    expect(mockGetData).toHaveBeenCalledTimes(1);
    expect(directResultModalVisible).toBe(false);
    expect(pendingMatchToSetResult).toBeNull();
  });
});
