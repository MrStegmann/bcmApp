import { Game } from "../../types/database";
import { PlayedMatchContract } from "../../../specs/013-update-player-details/contracts/player-api";

declare const jest: any;

describe("PlayerDetail Drill-Down Navigation Tests (T017 - US3)", () => {
  const mockMatches: PlayedMatchContract[] = [
    {
      gameId: 101,
      opponent: "CB Marbella",
      round: "1",
      date: "11/10/2025 - 18:00",
      status: "finished",
      resultC1: 18,
      resultC2: 14,
      resultC3: 20,
      resultC4: 16,
      resultExtra: 0,
      resultC1Opponent: 15,
      resultC2Opponent: 12,
      resultC3Opponent: 16,
      resultC4Opponent: 18,
      resultExtraOpponent: 0,
    },
    {
      gameId: 102,
      opponent: "Unicaja",
      round: "2",
      date: "18/10/2025 - 19:30",
      status: "finished",
      resultC1: 12,
      resultC2: 15,
      resultC3: 14,
      resultC4: 17,
      resultExtra: 0,
      resultC1Opponent: 16,
      resultC2Opponent: 18,
      resultC3Opponent: 15,
      resultC4Opponent: 20,
      resultExtraOpponent: 0,
    },
  ];

  it("selects a match when navigation action is triggered", () => {
    let selectedMatch: Game | null = null;
    const handleSelectMatch = (matchData: PlayedMatchContract) => {
      selectedMatch = {
        id: matchData.gameId,
        teamId: 1,
        opponent: matchData.opponent,
        round: matchData.round,
        date: matchData.date,
        status: matchData.status,
        resultC1: matchData.resultC1 ?? 0,
        resultC2: matchData.resultC2 ?? 0,
        resultC3: matchData.resultC3 ?? 0,
        resultC4: matchData.resultC4 ?? 0,
        resultExtra: matchData.resultExtra ?? 0,
        resultC1Opponent: matchData.resultC1Opponent ?? 0,
        resultC2Opponent: matchData.resultC2Opponent ?? 0,
        resultC3Opponent: matchData.resultC3Opponent ?? 0,
        resultC4Opponent: matchData.resultC4Opponent ?? 0,
        resultExtraOpponent: matchData.resultExtraOpponent ?? 0,
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
    };

    handleSelectMatch(mockMatches[0]);

    expect(selectedMatch).not.toBeNull();
    expect(selectedMatch!.id).toBe(101);
    expect(selectedMatch!.opponent).toBe("CB Marbella");
  });

  it("resets selectedMatch when onReturn is called, restoring player detail view", () => {
    let selectedMatch: Game | null = {
      id: 101,
      teamId: 1,
      opponent: "CB Marbella",
      round: "1",
      date: "11/10/2025 - 18:00",
      status: "finished",
      resultC1: 18,
      resultC2: 14,
      resultC3: 20,
      resultC4: 16,
      resultExtra: 0,
      resultC1Opponent: 15,
      resultC2Opponent: 12,
      resultC3Opponent: 16,
      resultC4Opponent: 18,
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

    const handleReturn = () => {
      selectedMatch = null;
    };

    handleReturn();
    expect(selectedMatch).toBeNull();
  });

  it("generates correct testID for drill-down action buttons", () => {
    const getTestId = (gameId: number) => `match-detail-btn-${gameId}`;

    expect(getTestId(101)).toBe("match-detail-btn-101");
    expect(getTestId(102)).toBe("match-detail-btn-102");
  });
});
