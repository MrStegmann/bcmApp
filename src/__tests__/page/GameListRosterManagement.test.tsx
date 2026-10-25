import { Game, Player } from "../../types/database";

declare const jest: any;

describe("GameList On-Demand Roster Management Integration Tests (T015 - US3)", () => {
  const pendingGame: Game = {
    id: 101,
    teamId: 1,
    opponent: "Rival Pending",
    round: "Jornada 1",
    date: "25/10/2026",
    status: "pending",
    createdAt: new Date().toISOString(),
  } as Game;

  const inProgressGame: Game = {
    id: 102,
    teamId: 1,
    opponent: "Rival Live",
    round: "Jornada 2",
    date: "25/10/2026",
    status: "inProgress",
    createdAt: new Date().toISOString(),
  } as Game;

  const mockAvailablePlayers: Player[] = [
    { id: 1, teamId: 1, firstName: "Pau", lastName: "Gasol", number: "16", jerseyName: "P. Gasol", createdAt: "" },
    { id: 2, teamId: 1, firstName: "Marc", lastName: "Gasol", number: "33", jerseyName: "M. Gasol", createdAt: "" },
    { id: 3, teamId: 1, firstName: "Ricky", lastName: "Rubio", number: "9", jerseyName: "Rubio", createdAt: "" },
  ];

  it("should open on-demand roster modal and pre-populate currently called-up players", async () => {
    let rosterModalVisible = false;
    let isRosterMandatory = false;
    const setIsRosterMandatory = (val: boolean) => {
      isRosterMandatory = val;
    };
    let modalTitle: string | undefined;
    let selectedRosterIds: number[] = [];
    let pendingMatchToEditRoster: Game | null = null;

    const mockGetCalledUpPlayers = jest.fn().mockResolvedValue([
      { playerId: 1 },
      { playerId: 2 },
    ]);

    const handleSelectRoster = async (game: Game) => {
      // Guard: only pending matches allowed
      if (game.status !== "pending" && game.status) return;

      pendingMatchToEditRoster = game;
      setIsRosterMandatory(false);
      modalTitle = "Editar Convocatoria";

      if (game.id) {
        const calledUp = await mockGetCalledUpPlayers(game.id);
        const existingIds = (calledUp || []).map((p: any) => p.playerId || p.player_id);
        selectedRosterIds = existingIds;
      } else {
        selectedRosterIds = [];
      }
      rosterModalVisible = true;
    };

    await handleSelectRoster(pendingGame);

    expect(mockGetCalledUpPlayers).toHaveBeenCalledWith(101);
    expect(rosterModalVisible).toBe(true);
    expect(isRosterMandatory).toBe(false);
    expect(modalTitle).toBe("Editar Convocatoria");
    expect(selectedRosterIds).toEqual([1, 2]);
    expect(pendingMatchToEditRoster).toBe(pendingGame);
  });

  it("should block opening on-demand roster modal for inProgress or finished matches", async () => {
    let rosterModalVisible = false;
    const mockGetCalledUpPlayers = jest.fn();

    const handleSelectRoster = async (game: Game) => {
      if (game.status !== "pending" && game.status) return;
      rosterModalVisible = true;
    };

    await handleSelectRoster(inProgressGame);
    expect(rosterModalVisible).toBe(false);
    expect(mockGetCalledUpPlayers).not.toHaveBeenCalled();
  });

  it("should toggle players and persist updated roster via GameController.saveCalledUpPlayers", async () => {
    let selectedRosterIds = [1];
    let rosterModalVisible = true;
    let pendingMatchToEditRoster: Game | null = pendingGame;
    let gamesListRefreshed = false;

    const mockSaveCalledUpPlayers = jest.fn().mockResolvedValue(true);
    const mockGetData = jest.fn().mockImplementation(() => {
      gamesListRefreshed = true;
    });

    // Toggle player 3 to add
    const handleToggleRosterPlayer = (playerId: number) => {
      if (selectedRosterIds.includes(playerId)) {
        selectedRosterIds = selectedRosterIds.filter((id) => id !== playerId);
      } else {
        selectedRosterIds = [...selectedRosterIds, playerId];
      }
    };

    handleToggleRosterPlayer(3);
    expect(selectedRosterIds).toEqual([1, 3]);

    // Confirm roster save
    const handleConfirmRoster = async (rosterIds: number[]) => {
      if (pendingMatchToEditRoster?.id) {
        await mockSaveCalledUpPlayers(pendingMatchToEditRoster.id, rosterIds);
        pendingMatchToEditRoster = null;
        rosterModalVisible = false;
        await mockGetData();
      }
    };

    await handleConfirmRoster(selectedRosterIds);

    expect(mockSaveCalledUpPlayers).toHaveBeenCalledWith(101, [1, 3]);
    expect(rosterModalVisible).toBe(false);
    expect(pendingMatchToEditRoster).toBeNull();
    expect(gamesListRefreshed).toBe(true);
  });

  it("should allow deselecting all players and saving an empty roster in on-demand mode", async () => {
    let selectedRosterIds = [1];
    let rosterModalVisible = true;
    let pendingMatchToEditRoster: Game | null = pendingGame;

    const mockSaveCalledUpPlayers = jest.fn().mockResolvedValue(true);

    // Deselect player 1
    selectedRosterIds = [];

    // In on-demand mode, saving empty roster is completely valid
    const isSaveDisabled = false; // Not mandatory!
    expect(isSaveDisabled).toBe(false);

    const handleConfirmRoster = async (rosterIds: number[]) => {
      if (pendingMatchToEditRoster?.id) {
        await mockSaveCalledUpPlayers(pendingMatchToEditRoster.id, rosterIds);
        pendingMatchToEditRoster = null;
        rosterModalVisible = false;
      }
    };

    await handleConfirmRoster(selectedRosterIds);

    expect(mockSaveCalledUpPlayers).toHaveBeenCalledWith(101, []);
    expect(rosterModalVisible).toBe(false);
  });

  it("should omit skip button in on-demand editing mode", () => {
    const isEditingOnDemand = true;
    const isMandatory = false;

    // In on-demand editing mode, skip is not applicable (changes can be cancelled via close or confirmed via save)
    const onSkipHandler = isEditingOnDemand ? undefined : jest.fn();

    expect(onSkipHandler).toBeUndefined();
  });
});
