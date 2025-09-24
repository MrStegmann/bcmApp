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
import { useAlertStore } from "../store/AlertStore";

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
        models?.TeamModel.getAll((teams) => {
          setCallback(teams);
        });
      },
      add: async (name) => {
        await models?.TeamModel.create({ name });
      },
      edit: async (id, name) => {
        await models?.TeamModel.update({ id, name });
      },
      remove: async (id) => {
        await models?.TeamModel.delete(id);
      },
    };
  }, [models]);

  const GameController = useMemo(() => {
    return {
      load: (teamId, setCallback) => {
        models?.GameModel.getAll(teamId, (items) => {
          setCallback(items);
        });
      },
      loadCalledup: async (gameId, setCallback) => {
        models?.GameRosterModel.getAllByCalled(gameId, (items) => {
          setCallback(items);
        });
      },
      add: async (data, callback) => {
        await models?.GameModel.create(data, (result) => {
          if (callback) callback(result);
        });
      },
      addCalledup: async (data) => {
        await models?.GameRosterModel.create(data);
      },
      edit: async (data, callback) => {
        await models?.GameModel.update(data, (result) => {
          if (callback) callback(result);
        });
      },
      editCalledup: async (data) => {
        await models?.GameRosterModel.update(data);
      },
      remove: async (id) => {
        await models?.GameModel.delete(id);
      },
      removeCalledupByGame: async (gameId) => {
        await models?.GameRosterModel.deleteByGame(gameId);
      },
    };
  }, [models]);

  const PlayerController = useMemo(() => {
    return {
      load: (teamId, setCallback) => {
        models?.PlayerModel.getAll(teamId, (items) => {
          setCallback(items);
        });
      },
      loadFees: (playerId, setCallback) => {
        dtos?.PlayerFeeDTO.getPlayerFees(playerId, (items) => {
          setCallback(items);
        });
      },
      loadStats: (playerId, setCallback) => {
        dtos?.PlayersStatsDTO.getTotalByPlayer(playerId, (items) => {
          setCallback(items);
        });
      },
      loadPlayerStats: (playerId, gameId, setCallback) => {
        dtos?.PlayersStatsDTO.getByGameAndPlayer(playerId, gameId, (items) => {
          setCallback(items);
        });
      },
      loadStatsByTeam: (teamId, setCallback) => {
        dtos?.PlayersStatsDTO.getTotalByTeam(teamId, (items) => {
          setCallback(items);
        });
      },
      add: async (team_id, first_name, last_name, number) => {
        await models?.PlayerModel.create({
          team_id,
          first_name,
          last_name,
          number,
        });
      },
      edit: async (id, team_id, first_name, last_name, number) => {
        await models?.PlayerModel.update({
          id,
          team_id,
          first_name,
          last_name,
          number,
        });
      },

      remove: async (id) => {
        await models?.PlayerModel.delete(id);
      },
    };
  }, [models, dtos]);

  const PlayerStatsController = useMemo(() => {
    return {
      load: (gameId, setCallback) => {
        models?.PlayerStatsModel.getAll(gameId, (items) => {
          setCallback(items);
        });
      },
      loadByPlayer: (playerId, setCallback) => {
        models?.PlayerStatsModel.getAllByPlayer(playerId, (items) => {
          setCallback(items);
        });
      },
      add: async (data) => {
        await models?.PlayerStatsModel.create(data);
      },
      edit: async (data) => {
        await models?.PlayerStatsModel.update(data);
      },
      remove: async (id) => {
        await models?.PlayerStatsModel.delete(id);
      },
    };
  }, [models]);

  const FeesController = useMemo(() => {
    return {
      load: (teamId, setCallback) => {
        models?.FeeModel.getAll(teamId, (items) => {
          setCallback(items);
        });
      },
      loadFeesByGame: (teamId, setCallback) => {
        dtos?.PlayerFeeDTO.getTeamFees(teamId, (items) => {
          setCallback(items);
        });
      },
      add: async (team_id, player_id, season, month) => {
        await models?.FeeModel.create({ team_id, season, month, player_id });
      },
      edit: async (id, team_id, player_id, season, month, paid) => {
        await models?.FeeModel.update({
          id,
          team_id,
          player_id,
          season,
          month,
          paid,
        });
      },
      remove: async (id) => {
        await models?.FeeModel.delete(id);
      },
    };
  }, [models, dtos]);

  const TrainingController = useMemo(() => {
    return {
      load: (teamId, setCallback) => {
        models?.TrainingsModel.getAll(teamId, (teams) => {
          setCallback(teams);
        });
      },
      loadTPlayers: (trainingId, setCallback) => {
        dtos?.TrainingPlayerDTO.get(trainingId, (items) => {
          setCallback(items);
        });
      },
      add: async (data) => {
        models?.TrainingsModel.create(data);
      },
      edit: async (data) => {
        models?.TrainingsModel.update(data);
      },
      remove: async (id) => {
        models?.TrainingsModel.delete(id);
      },
    };
  }, [models, dtos]);

  const TraningPlayersController = useMemo(() => {
    return {
      load: (trainingId, setCallback) => {
        models?.TrainingPlayersModel.getAll(trainingId, (items) => {
          setCallback(items);
        });
      },
      loadByPlayer: (playerId, setCallback) => {
        models?.TrainingPlayersModel.getAllByPlayer(playerId, (items) => {
          setCallback(items);
        });
      },
      add: async (data) => {
        models?.TrainingPlayersModel.create(data);
      },
      edit: async (data) => {
        models?.TrainingPlayersModel.update(data);
      },
      remove: async (id) => {
        models?.TrainingPlayersModel.delete(id);
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
