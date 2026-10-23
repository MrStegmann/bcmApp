import { useMatchDetailStore } from "../store/useMatchDetailStore";
import { Game } from "../../../types/database";
import { MatchEditBuffer, PlayerRosterItem } from "../types";

describe("useMatchDetailStore Unit Tests (T010)", () => {
  const mockMatch: Game = {
    id: 1,
    teamId: 10,
    opponent: "Real Madrid",
    round: "Jornada 5",
    date: "22/10/2026 - 18:00",
    status: "finished",
    createdAt: "2026-10-22T10:00:00.000Z",
    resultC1: 20,
    resultC2: 18,
    resultC3: 22,
    resultC4: 25,
    resultExtra: 0,
    resultC1Opponent: 19,
    resultC2Opponent: 20,
    resultC3Opponent: 15,
    resultC4Opponent: 22,
    resultExtraOpponent: 0,
    foulsC1: 4,
    foulsC2: 3,
    foulsC3: 5,
    foulsC4: 4,
    foulsExtra: 0,
    foulsC1Opponent: 3,
    foulsC2Opponent: 4,
    foulsC3Opponent: 2,
    foulsC4Opponent: 5,
    foulsExtraOpponent: 0,
  };

  beforeEach(() => {
    useMatchDetailStore.setState({
      match: null,
      teamName: "",
      periods: [],
      players: [],
      advancedStats: {
        posesiones: 0,
        oer: 0,
        der: 0,
        efg: 0,
        orb: 0,
        ast: 0,
        tov: 0,
        ftr: 0,
      },
      selectedPlayer: null,
      isEditModalOpen: false,
      isLoading: false,
      isSaving: false,
      error: null,
    });
  });

  it("should initialize store with match data and parse regular 4 periods when no overtime was played", async () => {
    await useMatchDetailStore.getState().initializeMatch(mockMatch);

    const state = useMatchDetailStore.getState();
    expect(state.match).toEqual(mockMatch);
    expect(state.periods).toHaveLength(4);
    expect(state.periods[0].id).toBe("q1");
    expect(state.periods[0].teamPoints).toBe(20);
    expect(state.periods[0].teamFouls).toBe(4);
    expect(state.periods[0].rivalPoints).toBe(19);
    expect(state.periods[0].rivalFouls).toBe(3);
  });

  it("should include extra period if extra points or fouls exist", async () => {
    const overtimeMatch: Game = {
      ...mockMatch,
      resultExtra: 10,
      resultExtraOpponent: 8,
      foulsExtra: 2,
      foulsExtraOpponent: 1,
    };

    await useMatchDetailStore.getState().initializeMatch(overtimeMatch);

    const state = useMatchDetailStore.getState();
    expect(state.periods).toHaveLength(5);
    expect(state.periods[4].id).toBe("extra");
    expect(state.periods[4].teamPoints).toBe(10);
    expect(state.periods[4].teamFouls).toBe(2);
  });

  it("should update selectedPlayer when selectPlayer is called", () => {
    const dummyPlayer: PlayerRosterItem = {
      id: 5,
      statId: 50,
      jerseyNumber: "7",
      firstName: "Luka",
      lastName: "Doncic",
      fullName: "Luka Doncic",
      minutes: 32,
      points: 28,
      valuation: 34,
      t1a: 6,
      t1i: 8,
      t2a: 5,
      t2i: 9,
      t3a: 4,
      t3i: 8,
      oreb: 2,
      dreb: 7,
      totalRebounds: 9,
      asis: 8,
      rec: 2,
      per: 3,
      falt: 2,
    };

    useMatchDetailStore.getState().selectPlayer(dummyPlayer);
    expect(useMatchDetailStore.getState().selectedPlayer).toEqual(dummyPlayer);

    useMatchDetailStore.getState().selectPlayer(null);
    expect(useMatchDetailStore.getState().selectedPlayer).toBeNull();
  });

  it("should toggle edit modal state with openEditModal and closeEditModal", () => {
    expect(useMatchDetailStore.getState().isEditModalOpen).toBe(false);

    useMatchDetailStore.getState().openEditModal();
    expect(useMatchDetailStore.getState().isEditModalOpen).toBe(true);

    useMatchDetailStore.getState().closeEditModal();
    expect(useMatchDetailStore.getState().isEditModalOpen).toBe(false);
  });

  it("should sort players deterministically by valuation descending with tie-breakers", async () => {
    await useMatchDetailStore.getState().initializeMatch(mockMatch);

    const players = useMatchDetailStore.getState().players;
    for (let i = 0; i < players.length - 1; i++) {
      const current = players[i];
      const next = players[i + 1];
      if (current.valuation !== next.valuation) {
        expect(current.valuation).toBeGreaterThanOrEqual(next.valuation);
      } else if (current.points !== next.points) {
        expect(current.points).toBeGreaterThanOrEqual(next.points);
      }
    }
  });
});
