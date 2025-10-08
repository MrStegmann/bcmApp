import { createContext, useState, useEffect, useMemo } from "react";
import * as SQLite from "expo-sqlite";
import { Text, View } from "react-native";
import { TeamModel } from "../models/Team";
import { PlayerModel } from "../models/Player";
import { GameModel } from "../models/Game";
import { GameRosterModel } from "../models/GameRoster";
import { PlayerStatsModel } from "../models/PlayerStats";
import { TrainingsModel } from "../models/Training";
import { TrainingPlayersModel } from "../models/TrainingPlayers";
import { PlayersStatsDTO } from "../dtos/PlayersStatsDTO";
import { TrainingPlayerDTO } from "../dtos/TrainingPlayerDTO";
import { useAlertStore } from "../store/AlertStore";
import { GameResults } from "../models/GameResults";
import { GameResultsOpponent } from "../models/GameResultsOpponent";
import { GameResultsDTO } from "../dtos/GameResultsDTO";
import { dropAllTables } from "../test/dropTables";
import { CreaTeam } from "../test/CreateTeam";

const DBContext = createContext();

const DBProvider = ({ children }) => {
  const addAlert = useAlertStore((state) => state.addAlert);
  const [models, setModels] = useState(null);
  const [dtos, setDTOs] = useState(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        const dbInstance = await SQLite.openDatabaseAsync("bcm.app.db");

        await dropAllTables(dbInstance);

        await TeamModel(dbInstance).createTable();
        await PlayerModel(dbInstance).createTable();
        await GameModel(dbInstance).createTable();
        await GameRosterModel(dbInstance).createTable();
        await GameResults(dbInstance).createTable();
        await GameResultsOpponent(dbInstance).createTable();
        await PlayerStatsModel(dbInstance).createTable();
        await TrainingsModel(dbInstance).createTable();
        await TrainingPlayersModel(dbInstance).createTable();

        const models = {
          TeamModel: TeamModel(dbInstance),
          PlayerModel: PlayerModel(dbInstance),
          GameModel: GameModel(dbInstance),
          GameRosterModel: GameRosterModel(dbInstance),
          GameResults: GameResults(dbInstance),
          GameResultsOpponent: GameResultsOpponent(dbInstance),
          PlayerStatsModel: PlayerStatsModel(dbInstance),
          TrainingsModel: TrainingsModel(dbInstance),
          TrainingPlayersModel: TrainingPlayersModel(dbInstance),
        };

        await CreaTeam(models);

        setModels(models);

        setDTOs({
          PlayersStatsDTO: PlayersStatsDTO(dbInstance),
          TrainingPlayerDTO: TrainingPlayerDTO(dbInstance),
          GameResultsDTO: GameResultsDTO(dbInstance),
        });
      } catch (error) {
        addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
      }
    };
    initDb();
  }, []);

  const TeamController = useMemo(() => {
    return {
      load: async (id) => {
        try {
          return await models?.TeamModel.get(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      save: async (data) => {
        try {
          await models?.TeamModel.save(data);
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
      loadCalledup: async (gameId) => {
        try {
          return await models?.GameRosterModel.getAllByCalled(gameId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      getGameResults: async (teamId) => {
        try {
          return await dtos?.GameResultsDTO.get(teamId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      getLastGameResults: async (teamId) => {
        try {
          return await dtos?.GameResultsDTO.getLasts(teamId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      getRoasterStats: async (gameId) => {
        try {
          return await dtos?.PlayersStatsDTO.getByRoaster(gameId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      save: async (data) => {
        try {
          await models?.GameModel.save(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      saveResults: async (data) => {
        try {
          await models?.GameResults.save(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      saveOpponentResults: async (data) => {
        try {
          await models?.GameResultsOpponent.save(data);
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
    };
  }, [models, dtos]);

  const PlayerController = useMemo(() => {
    return {
      loadStats: async (playerId) => {
        try {
          return await dtos?.PlayersStatsDTO.getTotalByPlayer(playerId);
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
      save: async (data) => {
        try {
          await models?.PlayerModel.save(data);
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
      loadByPlayer: async (playerId) => {
        try {
          return await models?.PlayerStatsModel.getAllByPlayer(playerId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      loadStatGameByPlayer: async (playerId) => {
        try {
          return await dtos?.PlayersStatsDTO.getStatGameByPlayer(playerId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      save: async (data) => {
        try {
          await models?.PlayerStatsModel.save(data);
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
      save: async (data) => {
        try {
          await models?.TrainingsModel.save(data);
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
      loadByPlayer: async (playerId) => {
        try {
          return await models?.TrainingPlayersModel.getAllByPlayer(playerId);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
          return [];
        }
      },
      edit: async (data) => {
        try {
          await models?.TrainingPlayersModel.update(data);
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
