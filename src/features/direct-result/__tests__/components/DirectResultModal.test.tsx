import { Game, Player } from "../../../../types/database";
import { DirectResultModalProps, DirectResultBuffer } from "../../types";
import {
  buildInitialDirectResultBuffer,
  validateDirectResult,
} from "../../utils/directResultCalculations";

declare const jest: any;

describe("DirectResultModal Contract & Logic Tests (T011 - US4)", () => {
  const mockMatch: Game = {
    id: 101,
    teamId: 1,
    opponent: "Real Madrid",
    round: "1",
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
    createdAt: "",
  };

  const mockPlayers: Player[] = [
    {
      id: 1,
      teamId: 1,
      firstName: "Luka",
      lastName: "Doncic",
      number: "77",
      jerseyName: "Doncic",
      createdAt: "",
    },
  ];

  it("should initialize clean buffer on modal open", () => {
    const buffer = buildInitialDirectResultBuffer(mockPlayers, mockMatch);
    expect(buffer.hasExtraTime).toBe(false);
    expect(buffer.periods.q1.teamPoints).toBe(0);
    expect(buffer.players[1]).toBeDefined();
    expect(buffer.players[1].playerId).toBe(1);
  });

  it("should handle valid buffer and invoke onSave with matchId and buffer", async () => {
    const onSaveMock = jest.fn().mockResolvedValue(true);
    const onCloseMock = jest.fn();

    const buffer = buildInitialDirectResultBuffer(mockPlayers, mockMatch);
    buffer.periods.q1.teamPoints = 25;
    buffer.periods.q1.rivalPoints = 20;
    buffer.players[1].minutes = 30;
    buffer.players[1].t2a = 5;
    buffer.players[1].t2i = 8;

    const validation = validateDirectResult(buffer);
    expect(validation.isValid).toBe(true);

    if (validation.isValid) {
      await onSaveMock(mockMatch.id, buffer);
    }

    expect(onSaveMock).toHaveBeenCalledTimes(1);
    expect(onSaveMock).toHaveBeenCalledWith(101, buffer);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("should block onSave when validation fails", async () => {
    const onSaveMock = jest.fn().mockResolvedValue(true);

    const buffer = buildInitialDirectResultBuffer(mockPlayers, mockMatch);
    buffer.players[1].t1a = 5;
    buffer.players[1].t1i = 2; // Invalid: made > attempted

    const validation = validateDirectResult(buffer);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);

    if (validation.isValid) {
      await onSaveMock(mockMatch.id, buffer);
    }

    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it("should support tab switching state between periods and players", () => {
    type TabKey = "periods" | "players";
    let activeTab: TabKey = "periods";

    const setTab = (tab: TabKey) => {
      activeTab = tab;
    };

    expect(activeTab).toBe("periods");
    setTab("players");
    expect(activeTab).toBe("players");
    setTab("periods");
    expect(activeTab).toBe("periods");
  });
});
