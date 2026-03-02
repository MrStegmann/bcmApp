import { create } from "zustand";
import clientApi from "../helpers/ClientApi";
import { useAuthStore } from "./AuthStore";

const playerStats = () => ({
  t1a: 0,
  t1i: 0,
  t2a: 0,
  t2i: 0,
  t3a: 0,
  t3i: 0,
  foult: 0,
  asis: 0,
  dreb: 0,
  oreb: 0,
  rec: 0,
  per: 0,
  minutes: 0,
});

const setDefaultMarker = () => ({ c1: 0, c2: 0, c3: 0, c4: 0, extra: 0 });
const getTime = (minuts) => minuts * 60 * 1000;

export const useMatchStore = create((set) => ({
  loading: false,
  fetchGamesByTeam: async (teamId) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.get(
        `/games/withresults/${teamId}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  fetchRoaster: async (matchId) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.get(`/gameroaster/${matchId}`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  fetchQuarters: async (matchId) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.get(
        `/quarterresults/${matchId}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  fetchPlayersStatsByMatchId: async (matchId) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.get(
        `/playerstats/match/${matchId}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  saveQuarters: async (quarters) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.post(
        "/quarterresults/saveAll",
        quarters,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  saveStats: async (playerStats) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.post(
        "/playerstats/saveAll",
        playerStats,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  saveMatch: async (matchData) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.post("/games", matchData, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  saveCallup: async (callup) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      return await clientApi.post("/gameroaster/saveAll", callup, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  deleteMatch: async (matchId) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      await clientApi.delete(`/games/${matchId}`, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
}));

export const useBenchAndQuintetStore = create((set) => ({
  bench: [],
  setBench: (playersId) => set({ bench: playersId }),

  toQuintet: [],
  setToQuintet: (toQuintet) => set({ toQuintet }),

  quintet: [],
  setQuintet: (quintet) => set({ quintet }),

  toBench: [],
  setToBench: (toBench) => set({ toBench }),

  usePreQuintet: false,
  setUsePreQuintet: (usePreQuintet) => set({ usePreQuintet }),

  reset: () => set({ bench: [], toQuintet: [], quintet: [], toBench: [] }),
}));

export const usePlayPlayersStore = create((set, get) => ({
  loading: false,
  players: {},
  getPlayer: (playerId) => get().players[playerId],

  fetchRoasterByMatch: async (matchId) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.get(`/gameroaster/${matchId}`, config);
      const called = response.data.filter((p) => p.called);
      const players = Object.fromEntries(
        called.map((value) => [
          value.player.id,
          {
            lastname: value.player.lastname,
            name: value.player.name,
            number: value.player.number,
            id: value.player.id,
            stats: playerStats(),
          },
        ])
      );
      set({ players });
      return players;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  setPlayersTime: (playersId, elapse) => {
    playersId.forEach((playerId) => {
      const player = get().players[playerId];
      const playerStats = get().players[playerId].stats;
      const minutes = playerStats.minutes;
      playerStats.minutes = minutes + elapse;

      set((state) => ({
        players: {
          ...state.players,
          [playerId]: {
            ...player,
            stats: playerStats,
          },
        },
      }));
    });
  },

  addPlayerStat: (playerId, stat) => {
    if (!playerId) return;
    const player = get().players[playerId];
    const playerStats = get().players[playerId].stats;
    const playerStat = get().players[playerId].stats[stat];

    playerStats[stat] = playerStat + 1;
    if (["t1a", "t2a", "t3a"].includes(stat)) {
      const shot = stat === "t1a" ? "t1i" : stat === "t2a" ? "t2i" : "t3i";
      const playerti = get().players[playerId].stats[shot];
      playerStats[shot] = playerti + 1;
    }

    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...player,
          stats: playerStats,
        },
      },
    }));
  },
  substractPlayerStat: (playerId, stat) => {
    if (!playerId) return;
    const player = get().players[playerId];
    const playerStats = get().players[playerId].stats;
    const playerStat = get().players[playerId].stats[stat];

    if (["t1a", "t2a", "t3a"].includes(stat) && playerStats[stat] > 0) {
      const shot = stat === "t1a" ? "t1i" : stat === "t2a" ? "t2i" : "t3i";
      const playerti = get().players[playerId].stats[shot];
      playerStats[shot] = Math.max(0, playerti - 1);
    }
    if (["t1i", "t2i", "t3i"].includes(stat)) {
      const shot = stat === "t1i" ? "t1a" : stat === "t2i" ? "t2a" : "t3a";
      const playerta = get().players[playerId].stats[shot];
      if (playerStat - 1 < playerta) return;
    }

    playerStats[stat] = Math.max(0, playerStat - 1);

    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...player,
          stats: playerStats,
        },
      },
    }));
  },

  reset: () => set({ players: {} }),
}));

export const useCronoStore = create((set, get) => ({
  crono: {
    c1: getTime(10),
    c2: getTime(10),
    c3: getTime(10),
    c4: getTime(10),
    extra: getTime(5),
  },
  quarter: "c1",
  setQuarter: (quarter) => set({ quarter }),
  setCrono: (value) =>
    set((state) => ({ crono: { ...state.crono, [get().quarter]: value } })),
  getCrono: () => get().crono[get().quarter],
  isRunning: false,
  setRunning: (isRunning) => set({ isRunning }),

  reset: () =>
    set({
      crono: {
        c1: getTime(10),
        c2: getTime(10),
        c3: getTime(10),
        c4: getTime(10),
        extra: getTime(5),
      },
      quarter: "c1",
      isRunning: false,
    }),
}));

export const useMarketStore = create((set, get) => ({
  rivalPoints: setDefaultMarker(),
  teamPoints: setDefaultMarker(),
  rivalFoults: setDefaultMarker(),
  teamFoults: setDefaultMarker(),

  quarter: "c1",
  setQuarter: (quarter) => set({ quarter }),

  addTeamPoints: (value) => {
    const quarter = get().quarter;
    const teamPoints = get().teamPoints;
    const actualPoints = teamPoints[quarter];

    const newPoints = actualPoints + value;

    set({
      teamPoints: {
        ...teamPoints,
        [quarter]: newPoints,
      },
    });
  },
  substractTeamPoints: (value) => {
    const quarter = get().quarter;
    const teamPoints = get().teamPoints;
    const actualPoints = teamPoints[quarter];

    const newPoints = Math.max(0, actualPoints - value);

    set({
      teamPoints: {
        ...teamPoints,
        [quarter]: newPoints,
      },
    });
  },

  addTeamFoult: () =>
    set((state) => ({
      teamFoults: {
        ...state.teamFoults,
        [get().quarter]: state.teamFoults[get().quarter] + 1,
      },
    })),
  substractTeamFoult: () =>
    set((state) => ({
      teamFoults: {
        ...state.teamFoults,
        [get().quarter]: Math.max(0, state.teamFoults[get().quarter] - 1),
      },
    })),

  addRivalFoult: () =>
    set((state) => ({
      rivalFoults: {
        ...state.rivalFoults,
        [get().quarter]: state.rivalFoults[get().quarter] + 1,
      },
    })),
  substractRivalFoult: () =>
    set((state) => ({
      rivalFoults: {
        ...state.rivalFoults,
        [get().quarter]: Math.max(0, state.rivalFoults[get().quarter] - 1),
      },
    })),

  addOneRivalPoints: () =>
    set((state) => ({
      rivalPoints: {
        ...state.rivalPoints,
        [get().quarter]: state.rivalPoints[get().quarter] + 1,
      },
    })),
  addTwoRivalPoints: () =>
    set((state) => ({
      rivalPoints: {
        ...state.rivalPoints,
        [get().quarter]: state.rivalPoints[get().quarter] + 2,
      },
    })),
  addThreeRivalPoints: () =>
    set((state) => ({
      rivalPoints: {
        ...state.rivalPoints,
        [get().quarter]: state.rivalPoints[get().quarter] + 3,
      },
    })),
  substractOneRivalPoints: () =>
    set((state) => ({
      rivalPoints: {
        ...state.rivalPoints,
        [get().quarter]: Math.max(0, state.rivalPoints[get().quarter] - 1),
      },
    })),

  reset: () =>
    set({
      rivalPoints: setDefaultMarker(),
      teamPoints: setDefaultMarker(),
      rivalFoults: setDefaultMarker(),
      teamFoults: setDefaultMarker(),

      quarter: "c1",
    }),
}));
