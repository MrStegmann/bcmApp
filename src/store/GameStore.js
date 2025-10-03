import { create } from "zustand";

export const useGameStore = create((set) => ({
  id: null,
  setID: (id) => set({ id }),
  opponent: "",
  setOpponent: (opponent) => set({ opponent }),
  round: null,
  setRound: (round) => set({ round }),
  date: "",
  setDate: (date) => set({ date }),
  quarter: "c1",
  setQuarter: (quarter) => set({ quarter }),

  time: {
    c1: 10 * 60,
    c2: 10 * 60,
    c3: 10 * 60,
    c4: 10 * 60,
    extra: 5 * 60,
  },
  setTime: (time) => set({ time }),

  decrementTime: () =>
    set((state) => {
      const currentQuarter = state.quarter;
      const currentTime = state.time[currentQuarter];

      return {
        time: {
          ...state.time,
          [currentQuarter]: currentTime - 1 < 0 ? 0 : currentTime - 1,
        },
      };
    }),

  results: {
    c1: { pts: 0, falts: 0 },
    c2: { pts: 0, falts: 0 },
    c3: { pts: 0, falts: 0 },
    c4: { pts: 0, falts: 0 },
    extra: { pts: 0, falts: 0 },
    total: { pts: 0, falts: 0 },
  },
  incrementResults: (key, value) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state.results };
      newResults[currentQuarter][key] += value;

      return { ...state, results: newResults };
    }),

  decrementResults: (key, value) =>
    set((state) => {
      const currentQuarter = state.quarter;
      const newResults = { ...state.results };
      newResults[currentQuarter][key] -= value;

      return { ...state, results: newResults };
    }),
  setResults: (results) =>
    set((state) => {
      return {
        ...state,
        results,
      };
    }),
  opponentResults: {
    c1: { pts: 0, falts: 0 },
    c2: { pts: 0, falts: 0 },
    c3: { pts: 0, falts: 0 },
    c4: { pts: 0, falts: 0 },
    extra: { pts: 0, falts: 0 },
    total: { pts: 0, falts: 0 },
  },

  setOpponentResults: (opponentResults) =>
    set((state) => {
      return {
        ...state,
        opponentResults,
      };
    }),

  quintet: new Map(),
  setQuintet: (quintet) => set({ quintet }),
  incrementPlayersTime: () =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);

      nuevoQuintet.forEach((player, id) => {
        const currentQuarter = state.quarter;
        const prev = player.stats?.[currentQuarter].min ?? 0;

        nuevoQuintet.set(id, {
          ...player,
          stats: {
            ...player.stats,
            [currentQuarter]: {
              ...player.stats[currentQuarter],
              min: prev + 1,
            },
          },
        });
      });

      return { quintet: nuevoQuintet };
    }),
  incrementPlayerPoints: (id, key) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentQuarter = state.quarter;
      const currentStats = { ...player.stats?.[currentQuarter] };
      const prev = currentStats[key] ?? 0;
      currentStats[key] = prev + 1;
      currentStats.pts = 0;
      if (key === "t1a") {
        currentStats.t1i += 1;
        currentStats.pts +=
          currentStats[key] + currentStats.t2a * 2 + currentStats.t3a * 3;
      } else if (key === "t2a") {
        currentStats.t2i += 1;
        currentStats.pts +=
          currentStats.t1a + currentStats[key] * 2 + currentStats.t3a * 3;
      } else if (key === "t3a") {
        currentStats.t3i += 1;
        currentStats.pts +=
          currentStats.t1a + currentStats.t2a * 2 + currentStats[key] * 3;
      }

      state.incrementResults("pts", currentStats.pts);
      nuevoQuintet.set(id, {
        ...player,
        stats: {
          ...player.stats,
          [currentQuarter]: currentStats,
        },
      });

      return { quintet: nuevoQuintet };
    }),
  incrementPlayerFalts: (id) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);
      const currentQuarter = state.quarter;
      const currentStats = { ...player.stats?.[currentQuarter] };
      const prev = currentStats.falt ?? 0;
      currentStats.falt = prev + 1;

      state.incrementResults("falts", 1);
      nuevoQuintet.set(id, {
        ...player,
        stats: {
          ...player.stats,
          [currentQuarter]: currentStats,
        },
      });

      return { quintet: nuevoQuintet };
    }),
  incrementPlayerStat: (id, key) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentQuarter = state.quarter;
      const currentStats = { ...player.stats?.[currentQuarter] };
      const prev = currentStats[key] ?? 0;
      currentStats[key] = prev + 1;

      nuevoQuintet.set(id, {
        ...player,
        stats: {
          ...player.stats,
          [currentQuarter]: currentStats,
        },
      });

      return { quintet: nuevoQuintet };
    }),
  decrementPlayerPoints: (id, key) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentQuarter = state.quarter;
      const currentStats = { ...player.stats?.[currentQuarter] };
      const prev = currentStats[key] ?? 0;
      currentStats[key] = prev - 1 < 0 ? 0 : prev - 1;
      currentStats.pts = 0;
      if (key === "t1a") {
        currentStats.t1i = currentStats.t1i - 1 < 0 ? 0 : currentStats.t1i - 1;
        currentStats.pts +=
          currentStats[key] + currentStats.t2a * 2 + currentStats.t3a * 3;
      } else if (key === "t2a") {
        currentStats.t2i = currentStats.t2i - 1 < 0 ? 0 : currentStats.t2i - 1;
        currentStats.pts +=
          currentStats.t1a + currentStats[key] * 2 + currentStats.t3a * 3;
      } else if (key === "t3a") {
        currentStats.t3i = currentStats.t3i - 1 < 0 ? 0 : currentStats.t3i - 1;
        currentStats.pts +=
          currentStats.t1a + currentStats.t2a * 2 + currentStats[key] * 3;
      }
      state.decrementResults("pts", currentStats.pts);
      nuevoQuintet.set(id, {
        ...player,
        stats: {
          ...player.stats,
          [currentQuarter]: currentStats,
        },
      });

      return { quintet: nuevoQuintet };
    }),
  decrementPlayerFalts: (id) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentQuarter = state.quarter;
      const currentStats = { ...player.stats?.[currentQuarter] };
      const prev = currentStats.falt ?? 0;
      currentStats.falt = prev - 1 < 0 ? 0 : prev - 1;

      state.decrementResults("falts", 1);
      nuevoQuintet.set(id, {
        ...player,
        stats: {
          ...player.stats,
          [currentQuarter]: currentStats,
        },
      });

      return { quintet: nuevoQuintet };
    }),
  decrementPlayerStat: (id, key) =>
    set((state) => {
      const nuevoQuintet = new Map(state.quintet);
      const player = nuevoQuintet.get(id);

      const currentQuarter = state.quarter;
      const currentStats = { ...player.stats?.[currentQuarter] };
      const prev = currentStats[key] ?? 0;
      currentStats[key] = prev - 1 < 0 ? 0 : prev - 1;

      nuevoQuintet.set(id, {
        ...player,
        stats: {
          ...player.stats,
          [currentQuarter]: currentStats,
        },
      });

      return { quintet: nuevoQuintet };
    }),

  toBench: new Set(),
  setToBench: (toBench) => set({ toBench }),

  bench: new Map(),
  setBench: (bench) => set({ bench }),

  toQuintet: new Set(),
  setToQuintet: (toQuintet) => set({ toQuintet }),
}));
