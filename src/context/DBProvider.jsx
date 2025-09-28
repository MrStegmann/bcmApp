import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
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
      load: (setCallback) => {
        try {
          models?.TeamModel.getAll((teams) => {
            setCallback(teams);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      add: async (name) => {
        try {
          await models?.TeamModel.create({ name });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (id, name) => {
        try {
          await models?.TeamModel.update({ id, name });
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
      load: (teamId, setCallback) => {
        try {
          models?.GameModel.getAll(teamId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadCalledup: async (gameId, setCallback) => {
        try {
          models?.GameRosterModel.getAllByCalled(gameId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      add: async (data, callback) => {
        try {
          await models?.GameModel.create(data, (result) => {
            if (callback) callback(result);
          });
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
      edit: async (data, callback) => {
        try {
          await models?.GameModel.update(data, (result) => {
            if (callback) callback(result);
          });
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
      load: (teamId, setCallback) => {
        try {
          models?.PlayerModel.getAll(teamId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadFees: (playerId, setCallback) => {
        try {
          dtos?.PlayerFeeDTO.getPlayerFees(playerId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadStats: (playerId, setCallback) => {
        try {
          dtos?.PlayersStatsDTO.getTotalByPlayer(playerId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadPlayerStats: (playerId, gameId, setCallback) => {
        try {
          dtos?.PlayersStatsDTO.getByGameAndPlayer(
            playerId,
            gameId,
            (items) => {
              setCallback(items);
            }
          );
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadStatsByTeam: (teamId, setCallback) => {
        try {
          dtos?.PlayersStatsDTO.getTotalByTeam(teamId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      add: async (team_id, first_name, last_name, number) => {
        try {
          await models?.PlayerModel.create({
            team_id,
            first_name,
            last_name,
            number,
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (id, team_id, first_name, last_name, number) => {
        try {
          await models?.PlayerModel.update({
            id,
            team_id,
            first_name,
            last_name,
            number,
          });
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
      load: (gameId, setCallback) => {
        try {
          models?.PlayerStatsModel.getAll(gameId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadByPlayer: (playerId, setCallback) => {
        try {
          models?.PlayerStatsModel.getAllByPlayer(playerId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
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
      load: (teamId, setCallback) => {
        try {
          models?.FeeModel.getAll(teamId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadFeesByGame: (teamId, setCallback) => {
        try {
          dtos?.PlayerFeeDTO.getTeamFees(teamId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
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
      load: (teamId, setCallback) => {
        try {
          models?.TrainingsModel.getAll(teamId, (teams) => {
            setCallback(teams);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadTPlayers: (trainingId, setCallback) => {
        try {
          dtos?.TrainingPlayerDTO.get(trainingId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      add: async (data) => {
        try {
          models?.TrainingsModel.create(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (data) => {
        try {
          models?.TrainingsModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      remove: async (id) => {
        try {
          models?.TrainingsModel.delete(id);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
    };
  }, [models, dtos]);

  const TraningPlayersController = useMemo(() => {
    return {
      load: (trainingId, setCallback) => {
        try {
          models?.TrainingPlayersModel.getAll(trainingId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      loadByPlayer: (playerId, setCallback) => {
        try {
          models?.TrainingPlayersModel.getAllByPlayer(playerId, (items) => {
            setCallback(items);
          });
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      add: async (data) => {
        try {
          models?.TrainingPlayersModel.create(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      edit: async (data) => {
        try {
          models?.TrainingPlayersModel.update(data);
        } catch (error) {
          addAlert({ msg: error.message, lifetime: 2500, id: Date.now() });
        }
      },
      remove: async (id) => {
        try {
          models?.TrainingPlayersModel.delete(id);
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
