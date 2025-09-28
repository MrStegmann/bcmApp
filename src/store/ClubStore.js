// src/store/useCounterStore.js
import { create } from "zustand";

export const useClubStore = create((set) => ({
  club: null,
  setClub: (club) => set({ club }), // función para cambiarlo

  players: [],
  setPlayers: (players) => set({ players }),
  games: [],
  setGames: (games) => set({ games }),
}));
