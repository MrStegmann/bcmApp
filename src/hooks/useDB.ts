import { useClubStore } from "../store/ClubStore";
import { usePlayerStore } from "../store/PlayerStore";
import { useGameStore } from "../store/GameStore";
import { useTrainingStore } from "../store/TrainingStore";
import { useFeesStore } from "../store/FeesStore";

export function useDB() {
  const clubStore = useClubStore();
  const playerStore = usePlayerStore();
  const gameStore = useGameStore();
  const trainingStore = useTrainingStore();
  const feesStore = useFeesStore();

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
      load: async (cb?: (players: any[]) => void, teamId?: number) => {
        const list = await playerStore.fetchPlayers(teamId || currentTeamId);
        if (cb) cb(list);
        return list;
      },
      loadStatsByTeam: async (teamId: number, cb?: (players: any[]) => void) => {
        const list = await playerStore.fetchPlayers(teamId);
        if (cb) cb(list);
        return list;
      },
      loadPlayerStats: async (playerId: number, gameId: number, cb?: (res: any) => void) => {
        const stats = await gameStore.fetchGamePlayerStats(gameId);
        const res = stats[playerId] || { id: playerId, player_id: playerId, game_id: gameId };
        if (cb) cb(res);
        return res;
      },
      loadFees: async (playerId: number, cb?: (feesList: any[]) => void) => {
        const list = await feesStore.fetchFees(currentTeamId);
        const filtered = list.filter((f) => !f.playerId || f.playerId === playerId);
        if (cb) cb(filtered);
        return filtered;
      },
      loadStats: async (playerId: number, cb?: (statsList: any[]) => void) => {
        const stats: any[] = [];
        if (cb) cb(stats);
        return stats;
      },
      add: (param1: any, param2?: any, param3?: any, param4?: any, param5?: any, param6?: any) => {
        if (typeof param2 === "string") {
          return playerStore.createPlayer({
            teamId: param1 || currentTeamId,
            firstName: param2,
            lastName: param3 || "",
            number: param4 || "0",
          });
        }
        return playerStore.createPlayer({ teamId: currentTeamId, ...param1 });
      },
      create: (data: any) => playerStore.createPlayer({ teamId: currentTeamId, ...data }),
      edit: (id: number, param2: any, param3?: any, param4?: any, param5?: any, param6?: any) => {
        if (typeof param3 === "string") {
          return playerStore.updatePlayer(id, {
            firstName: param3,
            lastName: param4 || "",
            number: param5 || "0",
          });
        }
        return playerStore.updatePlayer(id, param2);
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
      loadCalledup: async (gameId: number, cb?: (res: any[]) => void) => {
        const list: any[] = [];
        if (cb) cb(list);
        return list;
      },
      editCalledup: async (data: any) => {
        return true;
      },
      add: (data: any) => gameStore.createGame({ teamId: currentTeamId, ...data }),
      create: (data: any) => gameStore.createGame({ teamId: currentTeamId, ...data }),
      edit: (data: any) => Promise.resolve(true),
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
        const list: any[] = [];
        if (cb) cb(list);
        return list;
      },
      add: (data: any) => gameStore.savePlayerStat(data),
      create: (data: any) => gameStore.savePlayerStat(data),
      edit: (data: any) => gameStore.savePlayerStat(data),
      save: (data: any) => gameStore.savePlayerStat(data),
    },

    // Training Controller
    TrainingController: {
      getAll: (teamId?: number) => trainingStore.fetchTrainings(teamId || currentTeamId),
      load: async (param1?: any, param2?: any) => {
        const teamId = typeof param1 === "number" ? param1 : currentTeamId;
        const cb = typeof param1 === "function" ? param1 : typeof param2 === "function" ? param2 : undefined;
        const list = await trainingStore.fetchTrainings(teamId);
        if (cb) cb(list);
        return list;
      },
      loadTPlayers: async (trainingId: number, cb?: (res: any[]) => void) => {
        const roster = await playerStore.fetchPlayers(currentTeamId);
        const attMap = await trainingStore.fetchTrainingAttendance(trainingId);
        const result = roster.map((p) => ({
          ...p,
          first_name: p.firstName,
          last_name: p.lastName,
          assistance: attMap[p.id] ? attMap[p.id].attended === 1 : false,
        }));
        if (cb) cb(result);
        return result;
      },
      add: (data: any) => trainingStore.createTraining({ teamId: currentTeamId, ...data }),
      create: (data: any) => trainingStore.createTraining({ teamId: currentTeamId, ...data }),
      edit: (data: any) => Promise.resolve(true),
      remove: (id: number) => trainingStore.deleteTraining(id),
      delete: (id: number) => trainingStore.deleteTraining(id),
    },

    // Training Players Attendance Controller
    TraningPlayersController: {
      getAll: (trainingId: number) => trainingStore.fetchTrainingAttendance(trainingId),
      load: async (cb?: (attendanceMap: any) => void, trainingId?: number) => {
        if (!trainingId) return {};
        const map = await trainingStore.fetchTrainingAttendance(trainingId);
        if (cb) cb(map);
        return map;
      },
      loadByPlayer: async (playerId: number, cb?: (results: any[]) => void) => {
        const results: any[] = [];
        if (cb) cb(results);
        return results;
      },
      edit: (data: any) =>
        trainingStore.togglePlayerAttendance(data.trainingId || data.training_id, data.playerId || data.player_id, data.assistance || data.attended),
      toggle: (trainingId: number, playerId: number, attended: boolean) =>
        trainingStore.togglePlayerAttendance(trainingId, playerId, attended),
    },
    TrainingPlayersController: {
      getAll: (trainingId: number) => trainingStore.fetchTrainingAttendance(trainingId),
      load: async (cb?: (attendanceMap: any) => void, trainingId?: number) => {
        if (!trainingId) return {};
        const map = await trainingStore.fetchTrainingAttendance(trainingId);
        if (cb) cb(map);
        return map;
      },
      loadByPlayer: async (playerId: number, cb?: (results: any[]) => void) => {
        const results: any[] = [];
        if (cb) cb(results);
        return results;
      },
      edit: (data: any) =>
        trainingStore.togglePlayerAttendance(data.trainingId || data.training_id, data.playerId || data.player_id, data.assistance || data.attended),
      toggle: (trainingId: number, playerId: number, attended: boolean) =>
        trainingStore.togglePlayerAttendance(trainingId, playerId, attended),
    },

    // Fees Controller
    FeesController: {
      getAll: (teamId?: number) => feesStore.fetchFees(teamId || currentTeamId),
      load: async (param1?: any, param2?: any) => {
        const teamId = typeof param1 === "number" ? param1 : currentTeamId;
        const cb = typeof param1 === "function" ? param1 : typeof param2 === "function" ? param2 : undefined;
        const list = await feesStore.fetchFees(teamId);
        if (cb) cb(list);
        return list;
      },
      loadFeesByGame: async (teamId: number, cb?: (feesList: any[]) => void) => {
        const list = await feesStore.fetchFees(teamId);
        if (cb) cb(list);
        return list;
      },
      add: (data: any) => feesStore.createFee({ teamId: currentTeamId, ...data }),
      create: (data: any) => feesStore.createFee({ teamId: currentTeamId, ...data }),
      edit: (feeId: number, teamId: any, playerId: any, season: any, month: any, paid: boolean, clubId?: any) =>
        feesStore.toggleFeePayment(feeId, paid),
      toggle: (feeId: number, paid: boolean) => feesStore.toggleFeePayment(feeId, paid),
      remove: (id: number) => feesStore.deleteFee(id),
      delete: (id: number) => feesStore.deleteFee(id),
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
