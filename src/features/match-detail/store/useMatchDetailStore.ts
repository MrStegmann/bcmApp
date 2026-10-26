import { create } from "zustand";
import { db, games, playerStats, players as playersSchema, teams } from "../../../db";
import { eq } from "drizzle-orm";
import { Game } from "../../../types/database";
import {
  MatchDetailState,
  PeriodBreakdownItem,
  PlayerRosterItem,
  MatchEditBuffer,
} from "../types";
import {
  calculatePlayerValuation,
  calculateAdvancedStats,
  aggregateTeamTotals,
} from "../utils/calculations";

export function sortRosterDeterministically(
  players: PlayerRosterItem[]
): PlayerRosterItem[] {
  return [...players].sort((a, b) => {
    // 1. Primary: Valuation descending
    if (b.valuation !== a.valuation) {
      return b.valuation - a.valuation;
    }
    // 2. Secondary: Points descending
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // 3. Tertiary: Jersey number ascending
    const numA = Number(a.jerseyNumber) || 0;
    const numB = Number(b.jerseyNumber) || 0;
    if (numA !== numB) {
      return numA - numB;
    }
    return a.jerseyNumber.localeCompare(b.jerseyNumber);
  });
}

export function parsePeriodsFromMatch(match: Game): PeriodBreakdownItem[] {
  const regular: PeriodBreakdownItem[] = [
    {
      id: "q1",
      label: "Period 1",
      teamPoints: Number(match.resultC1 || 0),
      teamFouls: Number(match.foulsC1 || 0),
      rivalPoints: Number(match.resultC1Opponent || 0),
      rivalFouls: Number(match.foulsC1Opponent || 0),
      isExtra: false,
    },
    {
      id: "q2",
      label: "Period 2",
      teamPoints: Number(match.resultC2 || 0),
      teamFouls: Number(match.foulsC2 || 0),
      rivalPoints: Number(match.resultC2Opponent || 0),
      rivalFouls: Number(match.foulsC2Opponent || 0),
      isExtra: false,
    },
    {
      id: "q3",
      label: "Period 3",
      teamPoints: Number(match.resultC3 || 0),
      teamFouls: Number(match.foulsC3 || 0),
      rivalPoints: Number(match.resultC3Opponent || 0),
      rivalFouls: Number(match.foulsC3Opponent || 0),
      isExtra: false,
    },
    {
      id: "q4",
      label: "Period 4",
      teamPoints: Number(match.resultC4 || 0),
      teamFouls: Number(match.foulsC4 || 0),
      rivalPoints: Number(match.resultC4Opponent || 0),
      rivalFouls: Number(match.foulsC4Opponent || 0),
      isExtra: false,
    },
  ];

  const hasExtra =
    Number(match.resultExtra || 0) > 0 ||
    Number(match.resultExtraOpponent || 0) > 0 ||
    Number(match.foulsExtra || 0) > 0 ||
    Number(match.foulsExtraOpponent || 0) > 0;

  if (hasExtra) {
    regular.push({
      id: "extra",
      label: "Extra",
      teamPoints: Number(match.resultExtra || 0),
      teamFouls: Number(match.foulsExtra || 0),
      rivalPoints: Number(match.resultExtraOpponent || 0),
      rivalFouls: Number(match.foulsExtraOpponent || 0),
      isExtra: true,
    });
  }

  return regular;
}

export const useMatchDetailStore = create<MatchDetailState>((set, get) => ({
  match: null,
  teamName: "Mi Equipo",
  periods: [],
  players: [],
  advancedStats: {
    posesiones: 0,
    oer: 0,
    der: 0,
    efg: 0,
    orb: 0,
    ast: 0,
    tov: 0,
    ftr: 0,
  },
  selectedPlayer: null,
  isEditModalOpen: false,
  isShareModalOpen: false,
  isSharingProcessing: false,
  isLoading: false,
  isSaving: false,
  error: null,

  initializeMatch: async (match: Game) => {
    set({ isLoading: true, error: null, match });

    let teamName = "Mi Equipo";
    try {
      const teamRows = await db
        .select()
        .from(teams)
        .where(eq(teams.id, match.teamId));
      if (teamRows.length > 0 && teamRows[0].name) {
        teamName = teamRows[0].name;
      }
    } catch {}

    const periods = parsePeriodsFromMatch(match);

    let rosterItems: PlayerRosterItem[] = [];
    try {
      let teamPlayers = await db
        .select()
        .from(playersSchema)
        .where(eq(playersSchema.teamId, match.teamId));
      const statsRows = await db
        .select()
        .from(playerStats)
        .where(eq(playerStats.gameId, match.id));
      const statsByPlayerId = new Map(statsRows.map((s) => [s.playerId, s]));

      if (statsRows.length > 0) {
        const knownPlayerIds = new Set(teamPlayers.map((p) => p.id));
        const missingPlayerIds = statsRows
          .map((s) => s.playerId)
          .filter((id) => id != null && !knownPlayerIds.has(id));

        if (missingPlayerIds.length > 0) {
          const allPlayers = await db.select().from(playersSchema);
          const extraPlayers = allPlayers.filter((p) => missingPlayerIds.includes(p.id));
          teamPlayers = [...teamPlayers, ...extraPlayers];
        }
      }

      // If match has declared stats/roster rows, strictly filter to those players.
      // If statsRows is empty (legacy match), fallback to all team players.
      const activePlayers =
        statsRows.length > 0
          ? teamPlayers.filter((player) => statsByPlayerId.has(player.id))
          : teamPlayers;

      rosterItems = activePlayers.map((player) => {
        const s = statsByPlayerId.get(player.id);
        const t1a = Number(s?.t1a || 0);
        const t1i = Number(s?.t1i || 0);
        const t2a = Number(s?.t2a || 0);
        const t2i = Number(s?.t2i || 0);
        const t3a = Number(s?.t3a || 0);
        const t3i = Number(s?.t3i || 0);
        const oreb = Number(s?.oreb || 0);
        const dreb = Number(s?.dreb || 0);
        const asis = Number(s?.asis || 0);
        const rec = Number(s?.rec || 0);
        const per = Number(s?.per || 0);
        const falt = Number(s?.falt || 0);
        const minutes = Number(s?.minutes || 0);
        const seconds = Number((s as any)?.seconds || 0);

        const points = t1a * 1 + t2a * 2 + t3a * 3;
        const valuation = calculatePlayerValuation({
          t1a,
          t1i,
          t2a,
          t2i,
          t3a,
          t3i,
          oreb,
          dreb,
          asis,
          rec,
          per,
          falt,
        });

        return {
          id: player.id,
          statId: s?.id || 0,
          jerseyNumber: player.number || "0",
          firstName: player.firstName || "",
          lastName: player.lastName || "",
          fullName: `${player.firstName || ""} ${player.lastName || ""}`.trim(),
          minutes,
          seconds,
          points,
          valuation,
          t1a,
          t1i,
          t2a,
          t2i,
          t3a,
          t3i,
          oreb,
          dreb,
          totalRebounds: oreb + dreb,
          asis,
          rec,
          per,
          falt,
        };
      });
    } catch {}

    const sortedRoster = sortRosterDeterministically(rosterItems);

    const totalRivalPoints =
      Number(match.resultC1Opponent || 0) +
      Number(match.resultC2Opponent || 0) +
      Number(match.resultC3Opponent || 0) +
      Number(match.resultC4Opponent || 0) +
      Number(match.resultExtraOpponent || 0);

    const rawTotals = aggregateTeamTotals(sortedRoster, totalRivalPoints);
    const advancedStats = calculateAdvancedStats(rawTotals);

    set({
      teamName,
      periods,
      players: sortedRoster,
      advancedStats,
      isLoading: false,
    });
  },

  selectPlayer: (player: PlayerRosterItem | null) => {
    set({ selectedPlayer: player });
  },

  openEditModal: () => {
    set({ isEditModalOpen: true });
  },

  closeEditModal: () => {
    set({ isEditModalOpen: false });
  },

  openShareModal: () => {
    set({ isShareModalOpen: true });
  },

  closeShareModal: () => {
    set({ isShareModalOpen: false });
  },

  setSharingProcessing: (isProcessing: boolean) => {
    set({ isSharingProcessing: isProcessing });
  },

  saveMatchEdits: async (buffer: MatchEditBuffer) => {
    const currentMatch = get().match;
    if (!currentMatch) return;
    set({ isSaving: true, error: null });

    try {
      const updatedGameData = {
        resultC1: buffer.periods.q1.teamPoints,
        resultC2: buffer.periods.q2.teamPoints,
        resultC3: buffer.periods.q3.teamPoints,
        resultC4: buffer.periods.q4.teamPoints,
        resultExtra: buffer.periods.extra?.teamPoints ?? 0,

        resultC1Opponent: buffer.periods.q1.rivalPoints,
        resultC2Opponent: buffer.periods.q2.rivalPoints,
        resultC3Opponent: buffer.periods.q3.rivalPoints,
        resultC4Opponent: buffer.periods.q4.rivalPoints,
        resultExtraOpponent: buffer.periods.extra?.rivalPoints ?? 0,

        foulsC1: buffer.periods.q1.teamFouls,
        foulsC2: buffer.periods.q2.teamFouls,
        foulsC3: buffer.periods.q3.teamFouls,
        foulsC4: buffer.periods.q4.teamFouls,
        foulsExtra: buffer.periods.extra?.teamFouls ?? 0,

        foulsC1Opponent: buffer.periods.q1.rivalFouls,
        foulsC2Opponent: buffer.periods.q2.rivalFouls,
        foulsC3Opponent: buffer.periods.q3.rivalFouls,
        foulsC4Opponent: buffer.periods.q4.rivalFouls,
        foulsExtraOpponent: buffer.periods.extra?.rivalFouls ?? 0,
      };

      await db
        .update(games)
        .set(updatedGameData)
        .where(eq(games.id, currentMatch.id));

      if (buffer.players) {
        for (const [playerIdStr, pStats] of Object.entries(buffer.players)) {
          const pId = Number(playerIdStr);
          const val = calculatePlayerValuation(pStats);

          const existing = await db
            .select()
            .from(playerStats)
            .where(eq(playerStats.gameId, currentMatch.id));
          const matchStat = existing.find((s) => s.playerId === pId);

          if (matchStat) {
            await db
              .update(playerStats)
              .set({ ...pStats, valuation: val })
              .where(eq(playerStats.id, matchStat.id));
          } else {
            await db.insert(playerStats).values({
              gameId: currentMatch.id,
              playerId: pId,
              ...pStats,
              valuation: val,
            });
          }
        }
      }

      const updatedMatch: Game = {
        ...currentMatch,
        ...updatedGameData,
      };

      await get().initializeMatch(updatedMatch);
      set({ isEditModalOpen: false, isSaving: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to save match edits",
        isSaving: false,
      });
    }
  },
}));
