import { create } from "zustand";
import { db, games, playerStats } from "../../../db";
import { eq, inArray } from "drizzle-orm";
import { Game, PlayerStat } from "../../../types/database";
import {
  HomeViewState,
  NextMatchEntry,
  RecentMatchSummary,
  PeriodScoreItem,
  GlobalTeamAverages,
} from "../types";
import { sortPendingMatches, sortFinishedMatches } from "../utils/matchDateHelper";
import { computeGlobalAverages, GameStatsRecord } from "../utils/statsCalculator";

const initialGlobalStats: GlobalTeamAverages = {
  posesiones: 0,
  oer: 0,
  der: 0,
  efg: 0,
  orb: 0,
  ast: 0,
  tov: 0,
  ftr: 0,
  completedMatchesCount: 0,
};

export function parsePeriodScores(game: Game): PeriodScoreItem[] {
  const periods: PeriodScoreItem[] = [
    {
      period: "Q1",
      teamScore: Number(game.resultC1 || 0),
      rivalScore: Number(game.resultC1Opponent || 0),
    },
    {
      period: "Q2",
      teamScore: Number(game.resultC2 || 0),
      rivalScore: Number(game.resultC2Opponent || 0),
    },
    {
      period: "Q3",
      teamScore: Number(game.resultC3 || 0),
      rivalScore: Number(game.resultC3Opponent || 0),
    },
    {
      period: "Q4",
      teamScore: Number(game.resultC4 || 0),
      rivalScore: Number(game.resultC4Opponent || 0),
    },
  ];

  if ((game.resultExtra || 0) > 0 || (game.resultExtraOpponent || 0) > 0) {
    periods.push({
      period: "OT",
      teamScore: Number(game.resultExtra || 0),
      rivalScore: Number(game.resultExtraOpponent || 0),
    });
  }

  return periods;
}

export const useHomeViewStore = create<HomeViewState>((set, get) => ({
  teamId: null,
  nextMatch: null,
  recentMatches: [],
  globalStats: initialGlobalStats,
  allGames: [],
  isLoading: false,
  error: null,

  loadDashboard: async (teamId: number) => {
    set({ isLoading: true, error: null, teamId });
    try {
      // 1. Fetch all games for this team
      const teamGames = await db
        .select()
        .from(games)
        .where(eq(games.teamId, teamId));

      const pendingGames = teamGames.filter((g) => g.status === "pending");
      const finishedGames = teamGames.filter((g) => g.status === "finished");

      // 2. Identify Next Match (earliest pending)
      const sortedPending = sortPendingMatches(pendingGames);
      let nextMatchEntry: NextMatchEntry | null = null;

      if (sortedPending.length > 0) {
        const earliest = sortedPending[0];
        // Check if roster callup exists
        const rosterRows = await db
          .select()
          .from(playerStats)
          .where(eq(playerStats.gameId, earliest.id));

        nextMatchEntry = {
          id: earliest.id,
          teamId: earliest.teamId,
          opponent: earliest.opponent,
          date: earliest.date,
          round: earliest.round != null ? String(earliest.round) : "1",
          status: "pending",
          hasRoster: rosterRows.length > 0,
        };
      }

      // 3. Identify Recent Matches (up to 3, sorted descending)
      const sortedFinished = sortFinishedMatches(finishedGames);
      const recentSlice = sortedFinished.slice(0, 3);

      const recentMatchesList: RecentMatchSummary[] = recentSlice.map((game) => {
        const periods = parsePeriodScores(game);
        const teamTotalScore =
          Number(game.resultC1 || 0) +
          Number(game.resultC2 || 0) +
          Number(game.resultC3 || 0) +
          Number(game.resultC4 || 0) +
          Number(game.resultExtra || 0);

        const rivalTotalScore =
          Number(game.resultC1Opponent || 0) +
          Number(game.resultC2Opponent || 0) +
          Number(game.resultC3Opponent || 0) +
          Number(game.resultC4Opponent || 0) +
          Number(game.resultExtraOpponent || 0);

        return {
          id: game.id,
          teamId: game.teamId,
          opponent: game.opponent,
          date: game.date,
          round: game.round != null ? String(game.round) : "1",
          status: "finished",
          teamTotalScore,
          rivalTotalScore,
          isWinning: teamTotalScore > rivalTotalScore,
          periods,
        };
      });

      // 4. Batch query PlayerStats across all completed matches for Global Stats (T019)
      let computedGlobalStats = initialGlobalStats;
      if (finishedGames.length > 0) {
        const finishedGameIds = finishedGames.map((g) => g.id);
        const allFinishedStats: PlayerStat[] = await db
          .select()
          .from(playerStats)
          .where(inArray(playerStats.gameId, finishedGameIds));

        // Group player stats by gameId
        const statsByGameId = new Map<number, PlayerStat[]>();
        for (const stat of allFinishedStats) {
          const list = statsByGameId.get(stat.gameId) || [];
          list.push(stat);
          statsByGameId.set(stat.gameId, list);
        }

        const gameRecords: GameStatsRecord[] = finishedGames.map((game) => {
          const totalPoints =
            Number(game.resultC1 || 0) +
            Number(game.resultC2 || 0) +
            Number(game.resultC3 || 0) +
            Number(game.resultC4 || 0) +
            Number(game.resultExtra || 0);

          const totalRivalPoints =
            Number(game.resultC1Opponent || 0) +
            Number(game.resultC2Opponent || 0) +
            Number(game.resultC3Opponent || 0) +
            Number(game.resultC4Opponent || 0) +
            Number(game.resultExtraOpponent || 0);

          return {
            gameId: game.id,
            totalPoints,
            totalRivalPoints,
            playerStats: statsByGameId.get(game.id) || [],
          };
        });

        computedGlobalStats = computeGlobalAverages(gameRecords);
      }

      set({
        nextMatch: nextMatchEntry,
        recentMatches: recentMatchesList,
        globalStats: computedGlobalStats,
        allGames: teamGames,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err?.message || "Error al cargar el panel del equipo",
      });
    }
  },

  refreshDashboard: async () => {
    const { teamId, loadDashboard } = get();
    if (teamId) {
      await loadDashboard(teamId);
    }
  },

  saveRosterCallup: async (gameId: number, playerIds: number[]) => {
    try {
      // Delete existing roster for gameId
      await db.delete(playerStats).where(eq(playerStats.gameId, gameId));

      // Insert new roster callups
      for (const pid of playerIds) {
        await db.insert(playerStats).values({
          gameId,
          playerId: pid,
          minutes: 0,
          t1a: 0,
          t1i: 0,
          t2a: 0,
          t2i: 0,
          t3a: 0,
          t3i: 0,
          oreb: 0,
          dreb: 0,
          asis: 0,
          rec: 0,
          per: 0,
          falt: 0,
          valuation: 0,
        });
      }

      // Update nextMatch hasRoster if it matches gameId
      const currentNext = get().nextMatch;
      if (currentNext && currentNext.id === gameId) {
        set({
          nextMatch: {
            ...currentNext,
            hasRoster: playerIds.length > 0,
          },
        });
      }
    } catch (err: any) {
      set({ error: err?.message || "Error al guardar la convocatoria" });
      throw err;
    }
  },
}));
