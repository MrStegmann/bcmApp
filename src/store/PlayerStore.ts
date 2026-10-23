import { create } from "zustand";
import { db, players } from "../db";
import { Player, NewPlayer } from "../types/database";
import { eq } from "drizzle-orm";

export interface PlayerStoreState {
  playersList: Player[];
  players: Player[];
  selectedPlayer: Player | null;
  isLoading: boolean;
  error: string | null;

  setSelectedPlayer: (player: Player | null) => void;
  fetchPlayers: (teamId: number) => Promise<Player[]>;
  createPlayer: (playerData: NewPlayer) => Promise<Player | null>;
  updatePlayer: (playerId: number, data: Partial<NewPlayer>) => Promise<boolean>;
  deletePlayer: (playerId: number) => Promise<boolean>;
}

export const usePlayerStore = create<PlayerStoreState>((set, get) => ({
  playersList: [],
  players: [],
  selectedPlayer: null,
  isLoading: false,
  error: null,

  setSelectedPlayer: (player: Player | null) => set({ selectedPlayer: player }),

  fetchPlayers: async (teamId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await db.select().from(players).where(eq(players.teamId, teamId));
      set({ playersList: result, players: result, isLoading: false });
      return result;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch players", isLoading: false });
      return [];
    }
  },

  createPlayer: async (playerData: NewPlayer) => {
    set({ isLoading: true, error: null });
    try {
      const [newPlayer] = await db.insert(players).values(playerData).returning();
      const updated = [...get().playersList, newPlayer];
      set({ playersList: updated, players: updated, isLoading: false });
      return newPlayer;
    } catch (err: any) {
      set({ error: err.message || "Failed to create player", isLoading: false });
      return null;
    }
  },

  updatePlayer: async (playerId: number, data: Partial<NewPlayer>) => {
    set({ isLoading: true, error: null });
    try {
      await db.update(players).set(data).where(eq(players.id, playerId));
      const updatedList = get().playersList.map((p) => (p.id === playerId ? { ...p, ...data } : p));
      const currentSelected = get().selectedPlayer;
      set({
        playersList: updatedList,
        players: updatedList,
        selectedPlayer: currentSelected?.id === playerId ? { ...currentSelected, ...data } : currentSelected,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to update player", isLoading: false });
      return false;
    }
  },

  deletePlayer: async (playerId: number) => {
    set({ isLoading: true, error: null });
    try {
      await db.delete(players).where(eq(players.id, playerId));
      const updatedList = get().playersList.filter((p) => p.id !== playerId);
      set({
        playersList: updatedList,
        players: updatedList,
        selectedPlayer: get().selectedPlayer?.id === playerId ? null : get().selectedPlayer,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete player", isLoading: false });
      return false;
    }
  },
}));

export default usePlayerStore;
