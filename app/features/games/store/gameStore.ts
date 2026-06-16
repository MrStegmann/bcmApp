import { create } from "zustand";
import { Game } from "../types";

interface GameStoreState {
  game: Game | null;
  setGame: (game: Game | null) => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  game: null,
  setGame: (game) => set({ game }),
}));
