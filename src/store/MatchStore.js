import { create } from "zustand";

export const useMatchStore = create((set) => ({
  playing: false, // Atributo para el header, indicando que debe mostrar los detalles del partido.
  results: { team: 0, opponent: 0 }, // Resultado global del partido. Global. Se usa para el header
  gameId: "",
  opponent: "", // Nombre del oponente para mostrarlo en el header.
  setOpponent: (opponent) => set({ opponent }),
  setGameId: (gameId) => set({ gameId }),
  setPlaying: (playing) => set({ playing }),

  setResults: (results) => set({ results }),
  addTo: (key, value) =>
    set((state) => {
      const newResults = state.results;
      const prev = newResults[key];

      newResults[key] = prev + value;

      return {
        ...state,
        results: newResults,
      };
    }),
  substractTo: (key, value) =>
    set((state) => {
      const newResults = state.results;
      const prev = newResults[key];

      newResults[key] = prev - value < 0 ? 0 : prev - value;

      return {
        ...state,
        results: newResults,
      };
    }),
}));

export const useMatchPlayerStore = create((set, get) => ({
  players: {}, // [playerId]: { stats: {pts: 0,  t1a: 0,  t1i: 0,  t2a: 0,  t2i: 0,  t3a: 0,  t3i: 0,  falt: 0,  asis: 0,  dreb: 0,  oreb: 0,  rec: 0,  per: 0,  min: 0}, isBench: true, player_id: 1, first_name: "Jugador", last_name: "Uno", number: 1 }
  setPlayers: (players) => set({ players }),
  setPlayerById: (id, player) =>
    set((state) => ({ players: { ...state.players, [id]: player } })),
  getPlayerForBenchById: (id) => {
    const { player_id, first_name, last_name, number } = get().players[id];
    return { id: player_id, first_name, last_name, number };
  },
}));
