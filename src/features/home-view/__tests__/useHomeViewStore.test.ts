import { useHomeViewStore } from "../store/useHomeViewStore";
import { db, games, playerStats } from "../../../db";

jest.mock("../../../db", () => {
  return {
    db: {
      select: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
    },
    games: { teamId: "team_id", id: "id" },
    playerStats: { gameId: "game_id", playerId: "player_id", id: "id" },
  };
});

describe("useHomeViewStore Unit Tests (T005)", () => {
  const mockGamesList = [
    {
      id: 1,
      teamId: 10,
      opponent: "Rival Pending 1",
      round: "1",
      date: "25/10/2026 - 18:00",
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
    },
    {
      id: 2,
      teamId: 10,
      opponent: "Rival Pending 2",
      round: "2",
      date: "20/10/2026 - 18:00",
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
    },
    {
      id: 3,
      teamId: 10,
      opponent: "Rival Finished 1",
      round: "1",
      date: "15/10/2026 - 18:00",
      status: "finished",
      resultC1: 20,
      resultC2: 15,
      resultC3: 18,
      resultC4: 22,
      resultExtra: 0,
      resultC1Opponent: 18,
      resultC2Opponent: 14,
      resultC3Opponent: 20,
      resultC4Opponent: 15,
      resultExtraOpponent: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useHomeViewStore.setState({
      teamId: null,
      nextMatch: null,
      recentMatches: [],
      globalStats: {
        posesiones: 0,
        oer: 0,
        der: 0,
        efg: 0,
        orb: 0,
        ast: 0,
        tov: 0,
        ftr: 0,
        completedMatchesCount: 0,
      },
      allGames: [],
      isLoading: false,
      error: null,
    });
  });

  it("should initialize with default empty state", () => {
    const state = useHomeViewStore.getState();
    expect(state.teamId).toBeNull();
    expect(state.nextMatch).toBeNull();
    expect(state.recentMatches).toEqual([]);
    expect(state.globalStats.completedMatchesCount).toBe(0);
    expect(state.isLoading).toBe(false);
  });

  it("should load dashboard, pick earliest pending match as nextMatch, and up to 3 recent matches", async () => {
    const mockFrom = jest.fn();
    const mockWhere = jest.fn();

    // 1st call for games
    // 2nd call for playerStats of nextMatch
    // 3rd call for batch playerStats of finished games
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockImplementation((table) => {
        return {
          where: jest.fn().mockImplementation(() => {
            if (table === games) {
              return Promise.resolve(mockGamesList);
            }
            return Promise.resolve([]);
          }),
        };
      }),
    });

    await useHomeViewStore.getState().loadDashboard(10);

    const state = useHomeViewStore.getState();
    expect(state.teamId).toBe(10);
    expect(state.isLoading).toBe(false);
    expect(state.allGames).toHaveLength(3);

    // Earliest pending is id 2 (20/10 vs 25/10)
    expect(state.nextMatch).not.toBeNull();
    expect(state.nextMatch?.id).toBe(2);
    expect(state.nextMatch?.opponent).toBe("Rival Pending 2");

    // Recent matches should include finished match
    expect(state.recentMatches).toHaveLength(1);
    expect(state.recentMatches[0].id).toBe(3);
    expect(state.recentMatches[0].teamTotalScore).toBe(75);
    expect(state.recentMatches[0].rivalTotalScore).toBe(67);
    expect(state.recentMatches[0].isWinning).toBe(true);
    expect(state.recentMatches[0].periods).toHaveLength(4);
  });

  it("should set nextMatch to null when no pending matches exist", async () => {
    const finishedOnly = [mockGamesList[2]];

    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(finishedOnly),
      }),
    });

    await useHomeViewStore.getState().loadDashboard(10);

    const state = useHomeViewStore.getState();
    expect(state.nextMatch).toBeNull();
    expect(state.recentMatches).toHaveLength(1);
  });
});
