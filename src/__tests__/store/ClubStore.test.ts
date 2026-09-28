import { useClubStore } from "../../store/ClubStore";

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
});
