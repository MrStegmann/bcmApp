import { usePlayerStore } from "../../store/PlayerStore";
import { Player } from "../../types/database";

describe("PlayerStore Unit Tests (T015)", () => {
  beforeEach(() => {
    usePlayerStore.setState({
      playersList: [],
      players: [],
      selectedPlayer: null,
      isLoading: false,
    });
  });

  it("should initialize with empty players list", () => {
    const state = usePlayerStore.getState();
    expect(state.playersList).toEqual([]);
    expect(state.selectedPlayer).toBeNull();
  });

  it("should set selected player correctly", () => {
    const mockPlayer: Player = {
      id: 1,
      teamId: 1,
      firstName: "Patrick",
      lastName: "Stegmann",
      number: "10",
      position: "Base",
      notes: null,
      createdAt: "2025-09-25",
    };

    usePlayerStore.getState().setSelectedPlayer(mockPlayer);

    const state = usePlayerStore.getState();
    expect(state.selectedPlayer).toEqual(mockPlayer);
  });
});
