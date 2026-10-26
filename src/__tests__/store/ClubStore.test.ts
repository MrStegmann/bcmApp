import { useClubStore } from "../../store/ClubStore";
import { db, teams } from "../../db";

describe("ClubStore Unit Tests (T014)", () => {
  beforeEach(() => {
    useClubStore.setState({
      club: null,
      currentTeam: null,
      teamsList: [],
      clubs: [],
      isLoading: false,
      error: null,
    });
  });

  it("should initialize with default state", () => {
    const state = useClubStore.getState();
    expect(state.club).toBeNull();
    expect(state.currentTeam).toBeNull();
    expect(state.teamsList).toEqual([]);
    expect(state.isLoading).toBeFalsy();
  });

  it("should update current team when setClub / selectTeam is called", () => {
    const mockTeam = { id: 1, name: "Furola CB", category: "Senior", createdAt: "2025-09-25" };
    
    useClubStore.getState().setClub(mockTeam);

    const state = useClubStore.getState();
    expect(state.club).toEqual(mockTeam);
    expect(state.currentTeam).toEqual(mockTeam);
  });

  it("createTeam should persist team to list while leaving club and currentTeam null", async () => {
    const newTeam = await useClubStore.getState().createTeam({
      name: "CB Test Unicaja",
      category: "Junior",
    });

    expect(newTeam).toBeDefined();
    expect(newTeam?.name).toBe("CB Test Unicaja");

    const state = useClubStore.getState();
    expect(state.teamsList.some((t) => t.id === newTeam?.id)).toBe(true);
    expect(state.club).toBeNull();
    expect(state.currentTeam).toBeNull();
  });

  it("deleteTeam should remove team and set club and currentTeam to null even if other teams exist", async () => {
    const team1 = await useClubStore.getState().createTeam({ name: "Team 1", category: "Senior" });
    const team2 = await useClubStore.getState().createTeam({ name: "Team 2", category: "Senior" });

    // Select team1
    useClubStore.getState().setClub(team1!);
    expect(useClubStore.getState().club?.id).toBe(team1!.id);

    // Delete team1
    const success = await useClubStore.getState().deleteTeam(team1!.id);
    expect(success).toBe(true);

    const state = useClubStore.getState();
    expect(state.teamsList.some((t) => t.id === team1!.id)).toBe(false);
    expect(state.teamsList.some((t) => t.id === team2!.id)).toBe(true);
    // Crucial: Must be null to avoid navigating to team2
    expect(state.club).toBeNull();
    expect(state.currentTeam).toBeNull();
  });
});
