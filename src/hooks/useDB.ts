import { useClubStore } from "../store/ClubStore";
import { usePlayerStore } from "../store/PlayerStore";
import { useGameStore } from "../store/GameStore";
import { db, players, games, playerStats } from "../db";
import { eq, desc } from "drizzle-orm";

export function useDB() {
  const clubStore = useClubStore();
  const playerStore = usePlayerStore();
  const gameStore = useGameStore();

  const currentTeamId = clubStore.currentTeam?.id || 1;

  return {
    currentTeam: clubStore.currentTeam,
    currentTeamId,

    // Team Controller
    TeamController: {
      getAll: () => clubStore.fetchTeams(),
      load: async (cb?: (teamsList: any[]) => void) => {
        const list = await clubStore.fetchTeams();
        if (cb) cb(list);
        return list;
      },
      add: (name: string) => clubStore.createTeam({ name }),
      create: (data: any) => clubStore.createTeam(typeof data === "string" ? { name: data } : data),
      edit: (id: number, name: string) => dbUpdateTeamName(id, name),
      delete: (id: number) => clubStore.deleteTeam(id),
      remove: (id: number) => clubStore.deleteTeam(id),
    },

    // Player Controller
    PlayerController: {
      getAll: (teamId?: number) => playerStore.fetchPlayers(teamId || currentTeamId),
      load: async (cb?: (playersList: any[]) => void, teamId?: number) => {
        const list = await playerStore.fetchPlayers(teamId || currentTeamId);
        if (cb) cb(list);
        return list;
      },
      loadStatsByTeam: async (teamId: number, cb?: (playersList: any[]) => void) => {
        const teamPlayers = await playerStore.fetchPlayers(teamId || currentTeamId);
        try {
          const allStats = await db.select().from(playerStats);
          const enriched = teamPlayers.map((p) => {
            const pStats = allStats.filter((s) => s.playerId === p.id);
            const total_minutes = pStats.reduce((sum, s) => sum + (s.minutes || 0), 0);
            const total_t1a = pStats.reduce((sum, s) => sum + (s.t1a || 0), 0);
            const total_t1i = pStats.reduce((sum, s) => sum + (s.t1i || 0), 0);
            const total_t2a = pStats.reduce((sum, s) => sum + (s.t2a || 0), 0);
            const total_t2i = pStats.reduce((sum, s) => sum + (s.t2i || 0), 0);
            const total_t3a = pStats.reduce((sum, s) => sum + (s.t3a || 0), 0);
            const total_t3i = pStats.reduce((sum, s) => sum + (s.t3i || 0), 0);
            const total_oreb = pStats.reduce((sum, s) => sum + (s.oreb || 0), 0);
            const total_dreb = pStats.reduce((sum, s) => sum + (s.dreb || 0), 0);
            const total_asis = pStats.reduce((sum, s) => sum + (s.asis || 0), 0);
            const total_rec = pStats.reduce((sum, s) => sum + (s.rec || 0), 0);
            const total_per = pStats.reduce((sum, s) => sum + (s.per || 0), 0);
            const total_falt = pStats.reduce((sum, s) => sum + (s.falt || 0), 0);
            const total_valuation = pStats.reduce((sum, s) => sum + (s.valuation || 0), 0);
            return {
              ...p,
              first_name: p.firstName,
              last_name: p.lastName,
              total_minutes,
              total_t1a,
              total_t1i,
              total_t2a,
              total_t2i,
              total_t3a,
              total_t3i,
              total_oreb,
              total_dreb,
              total_asis,
              total_rec,
              total_per,
              total_falt,
              total_valuation,
            };
          });
          if (cb) cb(enriched);
          return enriched;
        } catch {
          if (cb) cb(teamPlayers);
          return teamPlayers;
        }
      },
      loadPlayerStats: async (playerId: number, gameId: number, cb?: (res: any) => void) => {
        let player = playerStore.playersList.find((p) => p.id === playerId);
        if (!player) {
          try {
            const [found] = await db.select().from(players).where(eq(players.id, playerId));
            player = found;
          } catch {}
        }
        const stats = await gameStore.fetchGamePlayerStats(gameId);
        const stat = stats[playerId];
        const res = {
          id: stat?.id || playerId,
          statId: stat?.id,
          game_id: gameId,
          player_id: playerId,
          first_name: player?.firstName || "",
          last_name: player?.lastName || "",
          number: player?.number ? Number(player.number) || player.number : 0,
          minutes: stat?.minutes || 0,
          t1a: stat?.t1a || 0,
          t1i: stat?.t1i || 0,
          t2a: stat?.t2a || 0,
          t2i: stat?.t2i || 0,
          t3a: stat?.t3a || 0,
          t3i: stat?.t3i || 0,
          oreb: stat?.oreb || 0,
          dreb: stat?.dreb || 0,
          asis: stat?.asis || 0,
          rec: stat?.rec || 0,
          per: stat?.per || 0,
          falt: stat?.falt || 0,
          valuation: stat?.valuation || 0,
        };
        if (cb) cb(res);
        return res;
      },
      loadStats: async (playerId: number, cb?: (statsList: any[]) => void) => {
        try {
          const pStats = await db.select().from(playerStats).where(eq(playerStats.playerId, playerId));
          if (pStats.length === 0) {
            if (cb) cb([]);
            return [];
          }
          const total_minutes = pStats.reduce((sum, s) => sum + (s.minutes || 0), 0);
          const total_t1a = pStats.reduce((sum, s) => sum + (s.t1a || 0), 0);
          const total_t1i = pStats.reduce((sum, s) => sum + (s.t1i || 0), 0);
          const total_t2a = pStats.reduce((sum, s) => sum + (s.t2a || 0), 0);
          const total_t2i = pStats.reduce((sum, s) => sum + (s.t2i || 0), 0);
          const total_t3a = pStats.reduce((sum, s) => sum + (s.t3a || 0), 0);
          const total_t3i = pStats.reduce((sum, s) => sum + (s.t3i || 0), 0);
          const total_oreb = pStats.reduce((sum, s) => sum + (s.oreb || 0), 0);
          const total_dreb = pStats.reduce((sum, s) => sum + (s.dreb || 0), 0);
          const total_asis = pStats.reduce((sum, s) => sum + (s.asis || 0), 0);
          const total_rec = pStats.reduce((sum, s) => sum + (s.rec || 0), 0);
          const total_per = pStats.reduce((sum, s) => sum + (s.per || 0), 0);
          const total_falt = pStats.reduce((sum, s) => sum + (s.falt || 0), 0);
          const total_valuation = pStats.reduce((sum, s) => sum + (s.valuation || 0), 0);
          const summary = [{
            player_id: playerId,
            total_minutes,
            total_t1a,
            total_t1i,
            total_t2a,
            total_t2i,
            total_t3a,
            total_t3i,
            total_oreb,
            total_dreb,
            total_asis,
            total_rec,
            total_per,
            total_falt,
            total_valuation,
          }];
          if (cb) cb(summary);
          return summary;
        } catch {
          if (cb) cb([]);
          return [];
        }
      },
      loadPlayedMatches: async (playerId: number, cb?: (matches: any[]) => void) => {
        try {
          const stats = await db
            .select({
              gameId: games.id,
              opponent: games.opponent,
              round: games.round,
              date: games.date,
              status: games.status,
              resultC1: games.resultC1,
              resultC2: games.resultC2,
              resultC3: games.resultC3,
              resultC4: games.resultC4,
              resultExtra: games.resultExtra,
              resultC1Opponent: games.resultC1Opponent,
              resultC2Opponent: games.resultC2Opponent,
              resultC3Opponent: games.resultC3Opponent,
              resultC4Opponent: games.resultC4Opponent,
              resultExtraOpponent: games.resultExtraOpponent,
              foulsC1: games.foulsC1,
              foulsC2: games.foulsC2,
              foulsC3: games.foulsC3,
              foulsC4: games.foulsC4,
              foulsExtra: games.foulsExtra,
              foulsC1Opponent: games.foulsC1Opponent,
              foulsC2Opponent: games.foulsC2Opponent,
              foulsC3Opponent: games.foulsC3Opponent,
              foulsC4Opponent: games.foulsC4Opponent,
              foulsExtraOpponent: games.foulsExtraOpponent,
              minutes: playerStats.minutes,
              valuation: playerStats.valuation,
            })
            .from(playerStats)
            .innerJoin(games, eq(playerStats.gameId, games.id))
            .where(eq(playerStats.playerId, playerId))
            .orderBy(desc(games.id));

          if (cb) cb(stats);
          return stats;
        } catch {
          if (cb) cb([]);
          return [];
        }
      },
      add: (param1: any, param2?: any, param3?: any, param4?: any, ...args: any[]) => {
        if (typeof param2 === "string") {
          const jerseyNameArg =
            typeof args[0] === "string" && isNaN(Number(args[0]))
              ? args[0]
              : typeof args[1] === "string"
              ? args[1]
              : typeof args[0] === "string"
              ? args[0]
              : null;
          return playerStore.createPlayer({
            teamId: typeof param1 === "number" ? param1 : currentTeamId,
            firstName: param2,
            lastName: param3 || "",
            number: String(param4 ?? "0"),
            jerseyName: jerseyNameArg || null,
          });
        }
        return playerStore.createPlayer({
          teamId: param1?.teamId || currentTeamId,
          firstName: param1?.firstName || "",
          lastName: param1?.lastName || "",
          number: String(param1?.number ?? "0"),
          jerseyName: param1?.jerseyName ?? null,
        });
      },
      create: (data: any) =>
        playerStore.createPlayer({
          teamId: data?.teamId || currentTeamId,
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          number: String(data?.number ?? "0"),
          jerseyName: data?.jerseyName ?? null,
        }),
      edit: (id: number, param2: any, param3?: any, param4?: any, param5?: any, ...args: any[]) => {
        if (typeof param3 === "string") {
          const jerseyNameArg =
            typeof args[0] === "string" && isNaN(Number(args[0]))
              ? args[0]
              : typeof args[1] === "string"
              ? args[1]
              : typeof args[0] === "string"
              ? args[0]
              : null;
          return playerStore.updatePlayer(id, {
            firstName: param3,
            lastName: param4 || "",
            number: String(param5 ?? "0"),
            jerseyName: jerseyNameArg !== undefined ? jerseyNameArg : null,
          });
        }
        return playerStore.updatePlayer(id, {
          ...(param2?.firstName !== undefined && { firstName: param2.firstName }),
          ...(param2?.lastName !== undefined && { lastName: param2.lastName }),
          ...(param2?.number !== undefined && { number: String(param2.number) }),
          ...(param2?.jerseyName !== undefined && { jerseyName: param2.jerseyName }),
        });
      },
      update: (id: number, data: any) => playerStore.updatePlayer(id, data),
      remove: (id: number) => playerStore.deletePlayer(id),
      delete: (id: number) => playerStore.deletePlayer(id),
    },

    // Game Controller
    GameController: {
      getAll: (teamId?: number) => gameStore.fetchGames(teamId || currentTeamId),
      load: async (param1?: any, param2?: any) => {
        const teamId = typeof param1 === "number" ? param1 : currentTeamId;
        const cb = typeof param1 === "function" ? param1 : typeof param2 === "function" ? param2 : undefined;
        const list = await gameStore.fetchGames(teamId);
        if (cb) cb(list);
        return list;
      },
      getRoster: async (gameId: number) => {
        try {
          const stats = await db.select().from(playerStats).where(eq(playerStats.gameId, gameId));
          return stats;
        } catch {
          return [];
        }
      },
      loadCalledup: async (gameId: number, cb?: (res: any[]) => void) => {
        try {
          const stats = await db.select().from(playerStats).where(eq(playerStats.gameId, gameId));
          const list = stats.map((s) => ({
            ...s,
            player_id: s.playerId,
            game_id: s.gameId,
          }));
          if (cb) cb(list);
          return list;
        } catch {
          if (cb) cb([]);
          return [];
        }
      },
      editCalledup: async (data: any) => {
        const gameId = data.game_id || data.gameId;
        const playerId = data.player_id || data.playerId;
        const isCalled = data.called ?? true;
        if (!gameId || !playerId) return false;
        try {
          if (isCalled) {
            const existing = await db.select().from(playerStats).where(eq(playerStats.gameId, gameId));
            const match = existing.find((s) => s.playerId === playerId);
            if (!match) {
              await db.insert(playerStats).values({
                gameId,
                playerId,
                minutes: 0,
                t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
                oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
              });
            }
          } else {
            const existing = await db.select().from(playerStats).where(eq(playerStats.gameId, gameId));
            const match = existing.find((s) => s.playerId === playerId);
            if (match) {
              await db.delete(playerStats).where(eq(playerStats.id, match.id));
            }
          }
          return true;
        } catch {
          return false;
        }
      },
      add: (data: any) =>
        gameStore.createGame({
          teamId: currentTeamId,
          opponent: data.rivalTeamName || data.opponent || "",
          round: data.round ? String(data.round) : "1",
          date: data.date || data.timeStamp || "",
          status: data.status || "pending",
          ...data,
        }),
      create: (data: any) =>
        gameStore.createGame({
          teamId: currentTeamId,
          opponent: data.rivalTeamName || data.opponent || "",
          round: data.round ? String(data.round) : "1",
          date: data.date || data.timeStamp || "",
          status: data.status || "pending",
          ...data,
        }),
      edit: async (data: any) => {
        if (!data?.id) return false;
        const payload: any = {};
        if (data.result_c1 !== undefined) payload.resultC1 = Number(data.result_c1);
        if (data.result_c2 !== undefined) payload.resultC2 = Number(data.result_c2);
        if (data.result_c3 !== undefined) payload.resultC3 = Number(data.result_c3);
        if (data.result_c4 !== undefined) payload.resultC4 = Number(data.result_c4);
        if (data.result_extra !== undefined) payload.resultExtra = Number(data.result_extra);
        if (data.result_c1_opponent !== undefined) payload.resultC1Opponent = Number(data.result_c1_opponent);
        if (data.result_c2_opponent !== undefined) payload.resultC2Opponent = Number(data.result_c2_opponent);
        if (data.result_c3_opponent !== undefined) payload.resultC3Opponent = Number(data.result_c3_opponent);
        if (data.result_c4_opponent !== undefined) payload.resultC4Opponent = Number(data.result_c4_opponent);
        if (data.result_extra_opponent !== undefined) payload.resultExtraOpponent = Number(data.result_extra_opponent);
        if (data.opponent !== undefined || data.rivalTeamName !== undefined) payload.opponent = data.rivalTeamName || data.opponent;
        if (data.round !== undefined) payload.round = String(data.round);
        if (data.date !== undefined || data.timeStamp !== undefined) payload.date = data.timeStamp || data.date;
        if (data.status !== undefined) payload.status = data.status;
        return gameStore.updateGame(data.id, payload);
      },
      startMatch: (gameId: number) => gameStore.startMatch(gameId),
      finishMatch: (gameId: number, finalScores?: any) => gameStore.finishMatch(gameId, finalScores),
      saveQuarterScores: (
        gameId: number,
        clubScores: Record<string, number>,
        opponentScores: Record<string, number>
      ) => gameStore.saveQuarterScores(gameId, clubScores as any, opponentScores as any),
      remove: (id: number) => gameStore.deleteGame(id),
      delete: (id: number) => gameStore.deleteGame(id),
    },

    // Player Stats Controller
    PlayerStatsController: {
      getAll: (gameId: number) => gameStore.fetchGamePlayerStats(gameId),
      load: async (cb?: (stats: any) => void, gameId?: number) => {
        if (!gameId) return {};
        const stats = await gameStore.fetchGamePlayerStats(gameId);
        if (cb) cb(stats);
        return stats;
      },
      loadByPlayer: async (playerId: number, cb?: (stats: any[]) => void) => {
        try {
          const list = await db.select().from(playerStats).where(eq(playerStats.playerId, playerId));
          if (cb) cb(list);
          return list;
        } catch {
          if (cb) cb([]);
          return [];
        }
      },
      add: (data: any) => gameStore.savePlayerStat(data),
      create: (data: any) => gameStore.savePlayerStat(data),
      edit: (data: any) => gameStore.savePlayerStat(data),
      save: (data: any) => gameStore.savePlayerStat(data),
      batchSave: (statsList: any[]) => gameStore.batchSavePlayerStats(statsList),
    },
  };
}

async function dbUpdateTeamName(id: number, name: string) {
  const clubStore = useClubStore.getState();
  const current = clubStore.currentTeam;
  if (current && current.id === id) {
    clubStore.setClub({ ...current, name });
  }
  return true;
}

export default useDB;
