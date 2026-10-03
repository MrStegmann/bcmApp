import { create } from "zustand";
import { db, games, playerStats } from "../db";
import { Game, NewGame, PlayerStat, NewPlayerStat } from "../types/database";
import { MatchStatus, QuarterKey, InGamePlayer } from "../types/match";
import { parseMatchTimestamp } from "../utils/dateValidation";
import { eq, desc } from "drizzle-orm";

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

export function calculatePlayerPoints(player: Partial<InGamePlayer> | any): number {
  if (!player) return 0;
  const t1a = Number(player.t1a || 0);
  const t2a = Number(player.t2a || 0);
  const t3a = Number(player.t3a || 0);
  return t1a * 1 + t2a * 2 + t3a * 3;
}

export function calculateTotalScore(scores?: Partial<Record<QuarterKey, number>> | any): number {
  if (!scores) return 0;
  const c1 = Number(scores.c1 || scores.resultC1 || scores.result_c1 || 0);
  const c2 = Number(scores.c2 || scores.resultC2 || scores.result_c2 || 0);
  const c3 = Number(scores.c3 || scores.resultC3 || scores.result_c3 || 0);
  const c4 = Number(scores.c4 || scores.resultC4 || scores.result_c4 || 0);
  const extra = Number(scores.extra || scores.resultExtra || scores.result_extra || 0);
  return c1 + c2 + c3 + c4 + extra;
}

export function validateStartingFive(playerIds: number[]): boolean {
  if (!Array.isArray(playerIds) || playerIds.length !== 5) {
    return false;
  }
  const unique = new Set(playerIds);
  return unique.size === 5;
}

export function calculateTimeoutBudget(quarterKey: QuarterKey, extraResetsCount: number = 0): number {
  if (quarterKey === "c1" || quarterKey === "c2") {
    return 2;
  }
  if (quarterKey === "c3" || quarterKey === "c4") {
    return 3;
  }
  if (quarterKey === "extra") {
    return 1 + Math.max(0, extraResetsCount);
  }
  return 2;
}

export function sortGamesByRecency(gamesList: Game[]): Game[] {
  return [...gamesList].sort((a, b) => {
    const timeA = parseMatchTimestamp(a.date)?.getTime();
    const timeB = parseMatchTimestamp(b.date)?.getTime();

    if (timeA !== undefined && timeB !== undefined && !isNaN(timeA) && !isNaN(timeB)) {
      if (timeB !== timeA) {
        return timeB - timeA;
      }
    }

    // Fallback to createdAt
    const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return createdB - createdA;
  });
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
  updateGame: (gameId: number, gameData: Partial<NewGame>) => Promise<boolean>;
  deleteGame: (gameId: number) => Promise<boolean>;
  fetchGamePlayerStats: (gameId: number) => Promise<Record<number, PlayerStat>>;
  savePlayerStat: (statData: NewPlayerStat) => Promise<boolean>;
  batchSavePlayerStats: (statsList: NewPlayerStat[]) => Promise<boolean>;
  saveQuarterScores: (
    gameId: number,
    clubScores: Record<QuarterKey, number>,
    opponentScores: Record<QuarterKey, number>
  ) => Promise<boolean>;
  startMatch: (gameId: number) => Promise<boolean>;
  finishMatch: (gameId: number, finalScores?: Partial<NewGame>) => Promise<boolean>;
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
      const sorted = sortGamesByRecency(result);
      set({ gamesList: sorted, games: sorted, isLoading: false });
      return sorted;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch games", isLoading: false });
      return [];
    }
  },

  createGame: async (gameData: NewGame) => {
    set({ isLoading: true, error: null });
    try {
      const dataToInsert = {
        status: "pending" as MatchStatus,
        ...gameData,
      };
      const [newGame] = await db.insert(games).values(dataToInsert).returning();
      const updated = sortGamesByRecency([newGame, ...get().gamesList.filter((g) => g.id !== newGame.id)]);
      set({ gamesList: updated, games: updated, isLoading: false });
      return newGame;
    } catch (err: any) {
      set({ error: err.message || "Failed to create game", isLoading: false });
      return null;
    }
  },

  updateGame: async (gameId: number, gameData: Partial<NewGame>) => {
    set({ isLoading: true, error: null });
    try {
      await db.update(games).set(gameData).where(eq(games.id, gameId));
      const updated = get().gamesList.map((g) => (g.id === gameId ? { ...g, ...gameData } : g));
      const sorted = sortGamesByRecency(updated);
      set({
        gamesList: sorted,
        games: sorted,
        selectedGame: get().selectedGame?.id === gameId ? { ...get().selectedGame!, ...gameData } : get().selectedGame,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to update game", isLoading: false });
      return false;
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

  startMatch: async (gameId: number) => {
    return get().updateGame(gameId, { status: "inProgress" });
  },

  finishMatch: async (gameId: number, finalScores?: Partial<NewGame>) => {
    return get().updateGame(gameId, { status: "finished", ...(finalScores || {}) });
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

      const existing = await db
        .select()
        .from(playerStats)
        .where(eq(playerStats.gameId, statData.gameId));

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

  batchSavePlayerStats: async (statsList: NewPlayerStat[]) => {
    if (!statsList || statsList.length === 0) return true;
    set({ isLoading: true, error: null });
    try {
      const gameId = statsList[0].gameId;
      const existing = await db
        .select()
        .from(playerStats)
        .where(eq(playerStats.gameId, gameId));

      for (const stat of statsList) {
        const val = calculatePlayerValuation(stat);
        const dataWithVal = { ...stat, valuation: val };
        const match = existing.find((s) => s.playerId === stat.playerId);

        if (match) {
          await db
            .update(playerStats)
            .set(dataWithVal)
            .where(eq(playerStats.id, match.id));
        } else {
          await db.insert(playerStats).values(dataWithVal);
        }
      }

      await get().fetchGamePlayerStats(gameId);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to batch save stats", isLoading: false });
      return false;
    }
  },

  saveQuarterScores: async (
    gameId: number,
    clubScores: Record<QuarterKey, number>,
    opponentScores: Record<QuarterKey, number>
  ) => {
    return get().updateGame(gameId, {
      resultC1: clubScores.c1,
      resultC2: clubScores.c2,
      resultC3: clubScores.c3,
      resultC4: clubScores.c4,
      resultExtra: clubScores.extra,
      resultC1Opponent: opponentScores.c1,
      resultC2Opponent: opponentScores.c2,
      resultC3Opponent: opponentScores.c3,
      resultC4Opponent: opponentScores.c4,
      resultExtraOpponent: opponentScores.extra,
    });
  },
}));

export default useGameStore;
