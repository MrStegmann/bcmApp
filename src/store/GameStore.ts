import { create } from "zustand";
import { db, games, playerStats } from "../db";
import { Game, NewGame, PlayerStat, NewPlayerStat } from "../types/database";
import { eq } from "drizzle-orm";

export function calculatePlayerValuation(stat: any): number {
  if (!stat) return 0;
  const t1a = Number(stat.t1a || 0);
  const t1i = Number(stat.t1i || 0);
  const t2a = Number(stat.t2a || 0);
  const t2i = Number(stat.t2i || 0);
  const t3a = Number(stat.t3a || 0);
  const t3i = Number(stat.t3i || 0);
  const oreb = Number(stat.oreb || 0);
  const dreb = Number(stat.dreb || 0);
  const asis = Number(stat.asis || 0);
  const rec = Number(stat.rec || 0);
  const per = Number(stat.per || 0);
  const falt = Number(stat.falt || 0);

  const madeShots = t1a + t2a + t3a;
  const missedT1 = Math.max(0, t1i - t1a);
  const missedT2 = Math.max(0, t2i - t2a);
  const missedT3 = Math.max(0, t3i - t3a);

  return madeShots + oreb + dreb + asis + rec - per - falt - missedT1 - missedT2 - missedT3;
}

export interface GameStoreState {
  gamesList: Game[];
  games: Game[];
  selectedGame: Game | null;
  playerStatsMap: Record<number, PlayerStat>; // playerId -> stat
  isLoading: boolean;
  error: string | null;

  setSelectedGame: (game: Game | null) => void;
  fetchGames: (teamId: number) => Promise<Game[]>;
  createGame: (gameData: NewGame) => Promise<Game | null>;
  deleteGame: (gameId: number) => Promise<boolean>;
  fetchGamePlayerStats: (gameId: number) => Promise<Record<number, PlayerStat>>;
  savePlayerStat: (statData: NewPlayerStat) => Promise<boolean>;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gamesList: [],
  games: [],
  selectedGame: null,
  playerStatsMap: {},
  isLoading: false,
  error: null,

  setSelectedGame: (game: Game | null) => set({ selectedGame: game }),

  fetchGames: async (teamId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await db.select().from(games).where(eq(games.teamId, teamId));
      set({ gamesList: result, games: result, isLoading: false });
      return result;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch games", isLoading: false });
      return [];
    }
  },

  createGame: async (gameData: NewGame) => {
    set({ isLoading: true, error: null });
    try {
      const [newGame] = await db.insert(games).values(gameData).returning();
      const updated = [...get().gamesList, newGame];
      set({ gamesList: updated, games: updated, isLoading: false });
      return newGame;
    } catch (err: any) {
      set({ error: err.message || "Failed to create game", isLoading: false });
      return null;
    }
  },

  deleteGame: async (gameId: number) => {
    set({ isLoading: true, error: null });
    try {
      await db.delete(games).where(eq(games.id, gameId));
      const updated = get().gamesList.filter((g) => g.id !== gameId);
      set({
        gamesList: updated,
        games: updated,
        selectedGame: get().selectedGame?.id === gameId ? null : get().selectedGame,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete game", isLoading: false });
      return false;
    }
  },

  fetchGamePlayerStats: async (gameId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await db.select().from(playerStats).where(eq(playerStats.gameId, gameId));
      const statsMap: Record<number, PlayerStat> = {};
      for (const stat of result) {
        statsMap[stat.playerId] = stat;
      }
      set({ playerStatsMap: statsMap, isLoading: false });
      return statsMap;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch player stats", isLoading: false });
      return {};
    }
  },

  savePlayerStat: async (statData: NewPlayerStat) => {
    set({ isLoading: true, error: null });
    try {
      const val = calculatePlayerValuation(statData);
      const dataWithVal = { ...statData, valuation: val };

      // Check if existing stat record exists for gameId + playerId
      const existing = await db
        .select()
        .from(playerStats)
        .where(
          eq(playerStats.gameId, statData.gameId)
        );
      
      const match = existing.find((s) => s.playerId === statData.playerId);

      if (match) {
        await db
          .update(playerStats)
          .set(dataWithVal)
          .where(eq(playerStats.id, match.id));
      } else {
        await db.insert(playerStats).values(dataWithVal);
      }

      await get().fetchGamePlayerStats(statData.gameId);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to save player stat", isLoading: false });
      return false;
    }
  },
}));

export default useGameStore;
