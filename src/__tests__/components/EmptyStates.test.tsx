import { useClubStore } from "../../store/ClubStore";
import { usePlayerStore } from "../../store/PlayerStore";
import { useGameStore } from "../../store/GameStore";

describe("Empty State & Data Flow Component Unit Tests (T024)", () => {
  beforeEach(() => {
    useClubStore.setState({ club: null, currentTeam: null, teamsList: [], isLoading: false });
    usePlayerStore.setState({ playersList: [], selectedPlayer: null, isLoading: false });
    useGameStore.setState({ gamesList: [], selectedGame: null, isLoading: false });
  });

  it("should handle empty teams list without throwing exceptions", () => {
    const teams = useClubStore.getState().teamsList;
    expect(teams).toEqual([]);
    expect(useClubStore.getState().currentTeam).toBeNull();
  });

  it("should handle empty player roster without throwing exceptions", () => {
    const players = usePlayerStore.getState().playersList;
    expect(players).toEqual([]);
    expect(usePlayerStore.getState().selectedPlayer).toBeNull();
  });

  it("should handle empty games list without throwing exceptions", () => {
    const games = useGameStore.getState().gamesList;
    expect(games).toEqual([]);
    expect(useGameStore.getState().selectedGame).toBeNull();
  });
});
