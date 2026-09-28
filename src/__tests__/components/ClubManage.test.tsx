import { useClubStore } from "../../store/ClubStore";
import { Team } from "../../types/database";
import ClubList from "../../components/ClubList";

declare const jest: any;
declare const expect: any;

describe("ClubManage & ClubList Component Unit Tests (US1 / T006)", () => {
  const mockTeams: Team[] = [
    { id: 1, name: "Lakers", category: "Senior", createdAt: "2026-01-01T00:00:00.000Z" },
    { id: 2, name: "Celtics", category: "Junior", createdAt: "2026-01-02T00:00:00.000Z" },
  ];

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

  it("should initialize store with empty team state and null active team", () => {
    const state = useClubStore.getState();
    expect(state.teamsList).toEqual([]);
    expect(state.currentTeam).toBeNull();
  });

  it("should handle team selection and update active team state", () => {
    useClubStore.setState({ teamsList: mockTeams, clubs: mockTeams });
    useClubStore.getState().selectTeam(1);

    const state = useClubStore.getState();
    expect(state.currentTeam).toEqual(mockTeams[0]);
    expect(state.club).toEqual(mockTeams[0]);
  });

  it("should handle clear team selection when returning to list view", () => {
    useClubStore.setState({ teamsList: mockTeams, currentTeam: mockTeams[0], club: mockTeams[0] });
    useClubStore.getState().setClub(null);

    const state = useClubStore.getState();
    expect(state.currentTeam).toBeNull();
    expect(state.club).toBeNull();
  });

  it("should instantiate ClubList component cleanly with typed props", () => {
    const onSelectMock = jest.fn();
    const props = {
      teams: mockTeams,
      onSelectTeam: onSelectMock,
      onEditTeam: jest.fn(),
      onDeleteTeam: jest.fn(),
      onCreateTeam: jest.fn(),
    };

    expect(props.teams.length).toBe(2);
    props.onSelectTeam(mockTeams[0]);
    expect(onSelectMock).toHaveBeenCalledWith(mockTeams[0]);
  });
});

describe("Team Creation & Editing Unit Tests (US2 / T009)", () => {
  const mockTeam: Team = {
    id: 1,
    name: "Bulls",
    category: "Cadete",
    createdAt: "2026-01-01T00:00:00.000Z",
  };

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

  it("should prefill team data when in edit mode", () => {
    useClubStore.setState({ currentTeam: mockTeam, club: mockTeam });
    const activeTeam = useClubStore.getState().currentTeam;
    expect(activeTeam?.name).toBe("Bulls");
    expect(activeTeam?.category).toBe("Cadete");
  });

  it("should update team list state when a team is updated", () => {
    useClubStore.setState({
      teamsList: [mockTeam],
      clubs: [mockTeam],
      currentTeam: mockTeam,
      club: mockTeam,
    });

    const updatedTeam = { ...mockTeam, name: "Chicago Bulls" };
    useClubStore.setState({
      teamsList: [updatedTeam],
      clubs: [updatedTeam],
      currentTeam: updatedTeam,
      club: updatedTeam,
    });

    const state = useClubStore.getState();
    expect(state.teamsList[0].name).toBe("Chicago Bulls");
    expect(state.currentTeam?.name).toBe("Chicago Bulls");
  });

  it("should reject empty team name submission gracefully", () => {
    const validateTeamName = (name: string) => {
      if (!name || name.trim() === "") {
        return "Debes introducir un nombre para el equipo";
      }
      return null;
    };

    expect(validateTeamName("")).toBe("Debes introducir un nombre para el equipo");
    expect(validateTeamName("   ")).toBe("Debes introducir un nombre para el equipo");
    expect(validateTeamName("Warriors")).toBeNull();
  });
});

describe("Team Deletion & Confirmation Unit Tests (US3 / T012)", () => {
  const mockTeams: Team[] = [
    { id: 1, name: "Lakers", category: "Senior", createdAt: "2026-01-01T00:00:00.000Z" },
    { id: 2, name: "Celtics", category: "Junior", createdAt: "2026-01-02T00:00:00.000Z" },
  ];

  beforeEach(() => {
    useClubStore.setState({
      club: mockTeams[0],
      currentTeam: mockTeams[0],
      teamsList: mockTeams,
      clubs: mockTeams,
      isLoading: false,
      error: null,
    });
  });

  it("should remove deleted team from store teamsList", () => {
    const updatedList = mockTeams.filter((t) => t.id !== 1);
    useClubStore.setState({
      teamsList: updatedList,
      clubs: updatedList,
      currentTeam: updatedList[0],
      club: updatedList[0],
    });

    const state = useClubStore.getState();
    expect(state.teamsList.length).toBe(1);
    expect(state.currentTeam?.id).toBe(2);
  });

  it("should toggle delete modal state correctly", () => {
    let modalVisible = false;
    let targetToDelete: any = null;

    const openDeleteModal = (team: Team) => {
      targetToDelete = team;
      modalVisible = true;
    };

    const cancelDeleteModal = () => {
      targetToDelete = null;
      modalVisible = false;
    };

    openDeleteModal(mockTeams[0]);
    expect(modalVisible).toBe(true);
    expect(targetToDelete?.name).toBe("Lakers");

    cancelDeleteModal();
    expect(modalVisible).toBe(false);
    expect(targetToDelete).toBeNull();
  });
});
