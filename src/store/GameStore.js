import { create } from "zustand";

export const useMarkerStore = create((set, get, store) => ({
  time: {
    c1: 10 * 60 * 1000,
    c2: 10 * 60 * 1000,
    c3: 10 * 60 * 1000,
    c4: 10 * 60 * 1000,
    extra: 5 * 60 * 1000,
  },
  results: {
    c1: { pts: 0, falts: 0 },
    c2: { pts: 0, falts: 0 },
    c3: { pts: 0, falts: 0 },
    c4: { pts: 0, falts: 0 },
    extra: { pts: 0, falts: 0 },
    total: { pts: 0, falts: 0 },
  },
  opponentResults: {
    c1: { pts: 0, falts: 0 },
    c2: { pts: 0, falts: 0 },
    c3: { pts: 0, falts: 0 },
    c4: { pts: 0, falts: 0 },
    extra: { pts: 0, falts: 0 },
    total: { pts: 0, falts: 0 },
  },
  quarter: "c1",
  opponent: "",
  setOpponent: (opponent) => set({ opponent }),
  setQuarter: (quarter) => set({ quarter }),

  setTime: (time) => set({ time }),
  addOneResults: (to) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state[to] };
      const prev = newResults[currentQuarter].pts;
      newResults[currentQuarter].pts = prev + 1;

      return { ...state, [to]: newResults };
    }),
  addTwoResults: (to) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state[to] };
      const prev = newResults[currentQuarter].pts;
      newResults[currentQuarter].pts = prev + 2;

      return { ...state, [to]: newResults };
    }),
  addThreeResults: (to) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state[to] };
      const prev = newResults[currentQuarter].pts;
      newResults[currentQuarter].pts = prev + 3;

      return { ...state, [to]: newResults };
    }),
  addTeamFalt: (to) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state[to] };
      const prev = newResults[currentQuarter].falts;
      newResults[currentQuarter].falts = prev + 1;

      return { ...state, [to]: newResults };
    }),

  substractOneResults: (to) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state[to] };
      const prev = newResults[currentQuarter].pts;
      newResults[currentQuarter].pts = prev - 1 < 0 ? 0 : prev - 1;

      return { ...state, [to]: newResults };
    }),
  substractTwoResults: (to) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state[to] };
      const prev = newResults[currentQuarter].pts;
      newResults[currentQuarter].pts = prev - 2 < 0 ? 0 : prev - 2;

      return { ...state, [to]: newResults };
    }),
  substractThreeResults: (to) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state[to] };
      const prev = newResults[currentQuarter].pts;
      newResults[currentQuarter].pts = prev - 3 < 0 ? 0 : prev - 3;

      return { ...state, [to]: newResults };
    }),
  substractTeamFalt: (to) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state[to] };
      const prev = newResults[currentQuarter].falts;
      newResults[currentQuarter].falts = prev - 1 < 0 ? 0 : prev - 1;

      return { ...state, [to]: newResults };
    }),

  setTotalResults: () =>
    set((state) => {
      const totalPts =
        state.results.c1.pts +
        state.results.c2.pts +
        state.results.c3.pts +
        state.results.c4.pts +
        state.results.extra.pts;
      const totalFalts =
        state.results.c1.falts +
        state.results.c2.falts +
        state.results.c3.falts +
        state.results.c4.falts +
        state.results.extra.falts;
      const total = { pts: totalPts, falts: totalFalts };

      return {
        ...state,
        results: {
          ...state.results,
          total,
        },
      };
    }),
  setResults: (results) =>
    set((state) => {
      return {
        ...state,
        results,
      };
    }),

  setTotalOpponentResults: () =>
    set((state) => {
      const totalPts =
        state.opponentResults.c1.pts +
        state.opponentResults.c2.pts +
        state.opponentResults.c3.pts +
        state.opponentResults.c4.pts +
        state.opponentResults.extra.pts;
      const totalFalts =
        state.opponentResults.c1.falts +
        state.opponentResults.c2.falts +
        state.opponentResults.c3.falts +
        state.opponentResults.c4.falts +
        state.opponentResults.extra.falts;
      const total = { pts: totalPts, falts: totalFalts };

      return {
        ...state,
        opponentResults: {
          ...state.opponentResults,
          total,
        },
      };
    }),

  setOpponentResults: (opponentResults) =>
    set((state) => {
      return {
        ...state,
        opponentResults,
      };
    }),

  reset: () => {
    set(store.getInitialState());
  },
}));

export const useQuintetStore = create((set, get, store) => ({
  quintet: new Map(),
  setQuintet: (quintet) => set({ quintet }),
  setPlayersTime: (actualTime, lastTime) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);

      nuevoQuintet.forEach((player, id) => {
        const prev = player.stats?.min ?? 0;
        const min = prev + (lastTime - actualTime);

        nuevoQuintet.set(id, {
          ...player,
          stats: {
            ...player.stats,
            min,
          },
        });
      });

      return { quintet: nuevoQuintet };
    }),
  addOnePlayer: (id) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentStats = { ...player.stats };
      const prev = currentStats.t1a ?? 0;
      currentStats.t1a = prev + 1;
      currentStats.t1i += 1;
      const pts =
        currentStats.t1a + currentStats.t2a * 2 + currentStats.t3a * 3;

      currentStats.pts = pts;
      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  addTwoPlayer: (id) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentStats = { ...player.stats };
      const prev = currentStats.t2a ?? 0;
      currentStats.t2a = prev + 1;
      currentStats.t2i += 1;
      const pts =
        currentStats.t1a + currentStats.t2a * 2 + currentStats.t3a * 3;

      currentStats.pts = pts;
      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  addThreePlayer: (id) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentStats = { ...player.stats };
      const prev = currentStats.t3a ?? 0;
      currentStats.t3a = prev + 1;
      currentStats.t3i += 1;
      const pts =
        currentStats.t1a + currentStats.t2a * 2 + currentStats.t3a * 3;

      currentStats.pts = pts;
      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),

  addPlayerFalt: (id) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);
      const currentStats = { ...player.stats };
      const prev = currentStats.falt ?? 0;
      currentStats.falt = prev + 1;

      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  addPlayerStat: (id, key) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);
      const currentStats = { ...player.stats };
      const prev = currentStats[key] ?? 0;
      currentStats[key] = prev + 1;

      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  substractOnePlayer: (id) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentStats = { ...player.stats };
      const prev = currentStats.t1a ?? 0;
      currentStats.t1a = prev - 1 < 0 ? 0 : prev - 1;
      currentStats.t1i = currentStats.t1i - 1 < 0 ? 0 : currentStats.t1i - 1;
      const pts =
        currentStats.t1a + currentStats.t2a * 2 + currentStats.t3a * 3;

      currentStats.pts = pts;
      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  substractTwoPlayer: (id) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentStats = { ...player.stats };
      const prev = currentStats.t2a ?? 0;
      currentStats.t2a = prev - 1 < 0 ? 0 : prev - 1;
      currentStats.t2i = currentStats.t2i - 1 < 0 ? 0 : currentStats.t2i - 1;
      const pts =
        currentStats.t1a + currentStats.t2a * 2 + currentStats.t3a * 3;

      currentStats.pts = pts;
      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  substractThreePlayer: (id, currentQuarter) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentStats = { ...player.stats };
      const prev = currentStats.t3a ?? 0;
      currentStats.t3a = prev - 1 < 0 ? 0 : prev - 1;
      currentStats.t3i = currentStats.t3i - 1 < 0 ? 0 : currentStats.t3i - 1;
      const pts =
        currentStats.t1a + currentStats.t2a * 2 + currentStats.t3a * 3;

      currentStats.pts = pts;
      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  substractPlayerFalt: (id, currentQuarter) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentStats = { ...player.stats };
      const prev = currentStats.falt ?? 0;
      currentStats.falt = prev - 1 < 0 ? 0 : prev - 1;

      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  substractPlayerStat: (id, key) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentStats = { ...player.stats };
      const prev = currentStats[key] ?? 0;
      currentStats[key] = prev - 1 < 0 ? 0 : prev - 1;

      nuevoQuintet.set(id, {
        ...player,
        stats: currentStats,
      });

      return { quintet: nuevoQuintet };
    }),
  reset: () => {
    set(store.getInitialState());
  },
}));

export const useSwapStore = create((set, get, store) => ({
  toQuintet: new Set(),
  setToQuintet: (toQuintet) => set({ toQuintet }),
  toBench: new Set(),
  setToBench: (toBench) => set({ toBench }),
  reset: () => {
    set(store.getInitialState());
  },
}));

export const useBenchStore = create((set, get, store) => ({
  bench: new Map(),
  setBench: (bench) => set({ bench }),
  setTotalPlayerStats: () =>
    set((state) => {
      const nuevoBench = new Map(state.bench);

      nuevoBench.forEach((player, id) => {
        const stats = player.stats;
        const total = {
          min:
            stats.c1.min +
            stats.c2.min +
            stats.c3.min +
            stats.c4.min +
            stats.extra.min,
          pts:
            stats.c1.pts +
            stats.c2.pts +
            stats.c3.pts +
            stats.c4.pts +
            stats.extra.pts,
          t1a:
            stats.c1.t1a +
            stats.c2.t1a +
            stats.c3.t1a +
            stats.c4.t1a +
            stats.extra.t1a,
          t1i:
            stats.c1.t1i +
            stats.c2.t1i +
            stats.c3.t1i +
            stats.c4.t1i +
            stats.extra.t1i,
          t2a:
            stats.c1.t2a +
            stats.c2.t2a +
            stats.c3.t2a +
            stats.c4.t2a +
            stats.extra.t2a,
          t2i:
            stats.c1.t2i +
            stats.c2.t2i +
            stats.c3.t2i +
            stats.c4.t2i +
            stats.extra.t2i,
          t3a:
            stats.c1.t3a +
            stats.c2.t3a +
            stats.c3.t3a +
            stats.c4.t3a +
            stats.extra.t3a,
          t3i:
            stats.c1.t3i +
            stats.c2.t3i +
            stats.c3.t3i +
            stats.c4.t3i +
            stats.extra.t3i,
          falt:
            stats.c1.falt +
            stats.c2.falt +
            stats.c3.falt +
            stats.c4.falt +
            stats.extra.falt,
          dreb:
            stats.c1.dreb +
            stats.c2.dreb +
            stats.c3.dreb +
            stats.c4.dreb +
            stats.extra.dreb,
          oreb:
            stats.c1.oreb +
            stats.c2.oreb +
            stats.c3.oreb +
            stats.c4.oreb +
            stats.extra.oreb,
          asis:
            stats.c1.asis +
            stats.c2.asis +
            stats.c3.asis +
            stats.c4.asis +
            stats.extra.asis,
          rec:
            stats.c1.rec +
            stats.c2.rec +
            stats.c3.rec +
            stats.c4.rec +
            stats.extra.rec,
          per:
            stats.c1.per +
            stats.c2.per +
            stats.c3.per +
            stats.c4.per +
            stats.extra.per,
        };

        nuevoBench.set(id, {
          ...player,
          stats: {
            ...stats,
            total,
          },
        });
      });
      return { bench: nuevoBench };
    }),
  reset: () => {
    set(store.getInitialState());
  },
}));

export const useGameStore = create((set, get, store) => ({
  id: null,
  setID: (id) => set({ id }),
  round: null,
  setRound: (round) => set({ round }),
  date: "",
  setDate: (date) => set({ date }),
  reset: () => {
    set(store.getInitialState());
  },
}));
