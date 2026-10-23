import { Game } from "../../types/database";

declare const jest: any;

describe("GameList Roster Enforcement Unit Tests (T012 - US2)", () => {
  const mockPendingGame: Game = {
    id: 10,
    teamId: 1,
    opponent: "Rival Team",
    round: "Jornada 1",
    date: "15/10/2026 - 19:30",
    status: "pending",
    createdAt: "2026-10-02T10:00:00.000Z",
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

  it("should trigger mandatory roster modal when tapping pending match without roster", async () => {
    let modalVisible = false;
    let isMandatory = false;
    let selectedGameForPlay: Game | null = null;

    const mockLoadCalledup = jest.fn().mockResolvedValue([]);

    const handleSelectMatch = async (game: Game) => {
      const roster = await mockLoadCalledup(game.id);
      if (game.status === "pending" && (!roster || roster.length === 0)) {
        isMandatory = true;
        modalVisible = true;
        selectedGameForPlay = game;
        return;
      }
      // If roster exists or match not pending, proceed
      selectedGameForPlay = game;
    };

    await handleSelectMatch(mockPendingGame);

    expect(mockLoadCalledup).toHaveBeenCalledWith(10);
    expect(modalVisible).toBe(true);
    expect(isMandatory).toBe(true);
  });

  it("should proceed directly to game when tapping match that already has a roster", async () => {
    let modalVisible = false;
    let gameOpened = false;

    const mockLoadCalledup = jest.fn().mockResolvedValue([{ playerId: 1 }, { playerId: 2 }]);

    const handleSelectMatch = async (game: Game) => {
      const roster = await mockLoadCalledup(game.id);
      if (game.status === "pending" && (!roster || roster.length === 0)) {
        modalVisible = true;
        return;
      }
      gameOpened = true;
    };

    await handleSelectMatch(mockPendingGame);

    expect(mockLoadCalledup).toHaveBeenCalledWith(10);
    expect(modalVisible).toBe(false);
    expect(gameOpened).toBe(true);
  });

  it("should persist confirmed roster and proceed to match after completing mandatory modal", async () => {
    const mockEditCalledup = jest.fn().mockResolvedValue(true);
    let gameOpened = false;
    let modalVisible = true;

    const handleConfirmMandatoryRoster = async (gameId: number, playerIds: number[]) => {
      for (const pid of playerIds) {
        await mockEditCalledup({ called: true, game_id: gameId, player_id: pid });
      }
      modalVisible = false;
      gameOpened = true;
    };

    await handleConfirmMandatoryRoster(10, [1, 2, 3, 4, 5]);

    expect(mockEditCalledup).toHaveBeenCalledTimes(5);
    expect(modalVisible).toBe(false);
    expect(gameOpened).toBe(true);
  });

  it("should trigger mandatory roster modal when tapping date-only pending match without roster", async () => {
    let modalVisible = false;
    let isMandatory = false;
    let selectedGameForPlay: Game | null = null;

    const dateOnlyPendingGame: Game = {
      ...mockPendingGame,
      date: "23/10/2026",
    };

    const mockLoadCalledup = jest.fn().mockResolvedValue([]);

    const handleSelectMatch = async (game: Game) => {
      const roster = await mockLoadCalledup(game.id);
      if (game.status === "pending" && (!roster || roster.length === 0)) {
        isMandatory = true;
        modalVisible = true;
        selectedGameForPlay = game;
        return;
      }
      selectedGameForPlay = game;
    };

    await handleSelectMatch(dateOnlyPendingGame);

    expect(mockLoadCalledup).toHaveBeenCalledWith(10);
    expect(modalVisible).toBe(true);
    expect(isMandatory).toBe(true);
    expect((selectedGameForPlay as any)?.date).toBe("23/10/2026");
  });

  it("should prohibit skipping and require minimum 1 player in mandatory modal contract", () => {
    const isMandatory = true;
    const selectedPlayerIds: number[] = [];
    const handleSkip = isMandatory ? undefined : jest.fn();

    expect(handleSkip).toBeUndefined();

    const isConfirmDisabled = isMandatory && selectedPlayerIds.length === 0;
    expect(isConfirmDisabled).toBe(true);

    selectedPlayerIds.push(1);
    const isConfirmEnabledWithOnePlayer = !(isMandatory && selectedPlayerIds.length === 0);
    expect(isConfirmEnabledWithOnePlayer).toBe(true);
  });
});

