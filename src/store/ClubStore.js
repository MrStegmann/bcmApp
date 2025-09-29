// src/store/useCounterStore.js
import { create } from "zustand";

export const useClubStore = create((set) => ({
  club: null,
  setClub: (club) => set({ club }), // función para cambiarlo

  players: [],
  setPlayers: (players) => set({ players }),
  addPlayer: (player) =>
    set((state) => ({ ...state, players: [...state.players, player] })),
  updatePlayer: (player) =>
    set((state) => {
      const pFound = state.players.find((p) => p.id === player.id);
      for (const [key, value] of Object.entries(player)) {
        if (pFound.hasOwnProperty(key)) {
          pFound[key] = value;
        }
      }

      return {
        ...state,
        players: [...state.players.filter((p) => p.id !== pFound.id), pFound],
      };
    }),

  trainings: [],
  setTrainings: (trainings) => set({ trainings }),

  games: [],
  setGames: (games) => set({ games }),
}));
