import { createContext, useState, useEffect, useMemo } from "react";
import * as SQLite from "expo-sqlite";
import { Text, View } from "react-native";
import { TeamModel } from "../models/Team";
import { PlayerModel } from "../models/Player";
import { GameModel } from "../models/Game";
import { GameRosterModel } from "../models/GameRoster";
import { PlayerStatsModel } from "../models/PlayerStats";
import { FeeModel } from "../models/Fee";
import { TrainingsModel } from "../models/Training";
import { TrainingPlayersModel } from "../models/TrainingPlayers";
import { GamePlayerDTO } from "../dtos/GamePlayerDTO";
import { PlayersStatsDTO } from "../dtos/PlayersStatsDTO";
import { TrainingPlayerDTO } from "../dtos/TrainingPlayerDTO";
import { PlayerFeeDTO } from "../dtos/PlayerFeeDTO";
import { createTeam } from "../test/team";
import { createPlayers } from "../test/player";
import { useAlertStore } from "../store/AlertStore";
import { createGame } from "../test/game";
import { createTrainings } from "../test/trainings";

const DBContext = createContext();

const DBProvider = ({ children }) => {
  const addAlert = useAlertStore((state) => state.addAlert);
  const [models, setModels] = useState(null);
  const [dtos, setDTOs] = useState(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        const dbInstance = await SQLite.openDatabaseAsync("bcm.app.db");
        await TeamModel(dbInstance).createTable();
        await PlayerModel(dbInstance).createTable();
        await GameModel(dbInstance).createTable();
        await GameRosterModel(dbInstance).createTable();
        await PlayerStatsModel(dbInstance).createTable();
        await FeeModel(dbInstance).createTable();
        await TrainingsModel(dbInstance).createTable();
        await TrainingPlayersModel(dbInstance).createTable();

        await createTeam(TeamModel(dbInstance));
        await createPlayers(PlayerModel(dbInstance));
        await createGame(GameModel(dbInstance));

        setModels({
          TeamModel: TeamModel(dbInstance),
          PlayerModel: PlayerModel(dbInstance),
          GameModel: GameModel(dbInstance),
          GameRosterModel: GameRosterModel(dbInstance),
          PlayerStatsModel: PlayerStatsModel(dbInstance),
          FeeModel: FeeModel(dbInstance),
          TrainingsModel: TrainingsModel(dbInstance),
          TrainingPlayersModel: TrainingPlayersModel(dbInstance),
        });

        setDTOs({
          GamePlayerDTO: GamePlayerDTO(dbInstance),
          PlayersStatsDTO: PlayersStatsDTO(dbInstance),
          TrainingPlayerDTO: TrainingPlayerDTO(dbInstance),
          PlayerFeeDTO: PlayerFeeDTO(dbInstance),
        });
      } catch (error) {
        addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
      }
    };
    initDb();
  }, []);

  const TeamController = useMemo(() => {
    return {
      load: async () => {
        try {
          return await models?.TeamModel.getAll();
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      add: async (name) => {
        try {
          await models?.TeamModel.create({ name });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (data) => {
        try {
          await models?.TeamModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      remove: async (id) => {
        try {
          await models?.TeamModel.delete(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
    };
  }, [models]);

  const GameController = useMemo(() => {
    return {
      load: async (teamId) => {
        try {
          return await models?.GameModel.getAll(teamId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadCalledup: async (gameId) => {
        try {
          return await models?.GameRosterModel.getAllByCalled(gameId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      add: async (data) => {
        try {
          await models?.GameModel.create(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      addCalledup: async (data) => {
        try {
          await models?.GameRosterModel.create(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (data) => {
        try {
          await models?.GameModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      editCalledup: async (data) => {
        try {
          await models?.GameRosterModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      remove: async (id) => {
        try {
          await models?.GameModel.delete(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      removeCalledupByGame: async (gameId) => {
        try {
          await models?.GameRosterModel.deleteByGame(gameId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
    };
  }, [models]);

  const PlayerController = useMemo(() => {
    return {
      load: async (teamId) => {
        try {
          return await models?.PlayerModel.getAll(teamId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadFees: async (playerId) => {
        try {
          return await dtos?.PlayerFeeDTO.getPlayerFees(playerId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadStats: async (playerId) => {
        try {
          return await dtos?.PlayersStatsDTO.getTotalByPlayer(playerId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadPlayerStats: async (playerId, gameId) => {
        try {
          return await dtos?.PlayersStatsDTO.getByGameAndPlayer(
            playerId,
            gameId
          );
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadStatsByTeam: async (teamId) => {
        try {
          return await dtos?.PlayersStatsDTO.getTotalByTeam(teamId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      add: async (data) => {
        try {
          await models?.PlayerModel.create(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (data) => {
        try {
          await models?.PlayerModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },

      remove: async (id) => {
        try {
          await models?.PlayerModel.delete(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
    };
  }, [models, dtos]);

  const PlayerStatsController = useMemo(() => {
    return {
      load: async (gameId) => {
        try {
          return await models?.PlayerStatsModel.getAll(gameId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadByPlayer: async (playerId) => {
        try {
          return await models?.PlayerStatsModel.getAllByPlayer(playerId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      add: async (data) => {
        try {
          await models?.PlayerStatsModel.create(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (data) => {
        try {
          await models?.PlayerStatsModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      remove: async (id) => {
        try {
          await models?.PlayerStatsModel.delete(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
    };
  }, [models]);

  const FeesController = useMemo(() => {
    return {
      load: async (teamId) => {
        try {
          return await models?.FeeModel.getAll(teamId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadFeesByGame: async (teamId) => {
        try {
          return await dtos?.PlayerFeeDTO.getTeamFees(teamId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      add: async (team_id, player_id, season, month) => {
        try {
          await models?.FeeModel.create({ team_id, season, month, player_id });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (id, team_id, player_id, season, month, paid) => {
        try {
          await models?.FeeModel.update({
            id,
            team_id,
            player_id,
            season,
            month,
            paid,
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      remove: async (id) => {
        try {
          await models?.FeeModel.delete(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
    };
  }, [models, dtos]);

  const TrainingController = useMemo(() => {
    return {
      load: async (teamId) => {
        try {
          return await models?.TrainingsModel.getAll(teamId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadTPlayers: async (trainingId) => {
        try {
          return await dtos?.TrainingPlayerDTO.get(trainingId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      add: async (data) => {
        try {
          await models?.TrainingsModel.create(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (data) => {
        try {
          await models?.TrainingsModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      remove: async (id) => {
        try {
          await models?.TrainingsModel.delete(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
    };
  }, [models, dtos]);

  const TraningPlayersController = useMemo(() => {
    return {
      load: async (trainingId) => {
        try {
          return await models?.TrainingPlayersModel.getAll(trainingId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadByPlayer: async (playerId) => {
        try {
          return await models?.TrainingPlayersModel.getAllByPlayer(playerId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      add: async (data) => {
        try {
          await models?.TrainingPlayersModel.create(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (data) => {
        try {
          await models?.TrainingPlayersModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      remove: async (id) => {
        try {
          await models?.TrainingPlayersModel.delete(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
    };
  }, [models]);

  return (
    <DBContext.Provider
      value={{
        TeamController,
        GameController,
        PlayerController,
        PlayerStatsController,
        FeesController,
        TrainingController,
        TraningPlayersController,
      }}
    >
      {!models || !dtos ? (
        <View className="w-full h-full flex justify-center items-center bg-gray-900">
          <Text className="text-danish-white font-bold text-xl">
            Cargando base de datos...
          </Text>
        </View>
      ) : (
        children
      )}
    </DBContext.Provider>
  );
};

export { DBProvider };

export default DBContext;
