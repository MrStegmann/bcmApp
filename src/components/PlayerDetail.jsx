import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native-web";
import useDB from "../hooks/useDB";
import jersey from "../../assets/jersey.png";
import { timeFormat } from "../helpers/timeFormat";
import StatsEnums from "../Enums/StatsEnums";
import ModalInfo from "../framework/ModalInfo";

const STATS_CONFIG = [
  StatsEnums.minutes,
  StatsEnums.t1a,
  StatsEnums.t1i,
  "p1Per",
  StatsEnums.t2a,
  StatsEnums.t2i,
  "p2Per",
  StatsEnums.t3a,
  StatsEnums.t3i,
  "p3Per",
  StatsEnums.falt,
  StatsEnums.dreb,
  StatsEnums.oreb,
  StatsEnums.asis,
  StatsEnums.rec,
  StatsEnums.per,
];

const GameStats = React.memo(({ stats }) => {
  if (!stats) return null;
  return (
    <View
      className={`w-full px-5 mt-5 flex flex-col justify-center items-center`}
    >
      <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
        <Text className="text-danish-white text-sm">Val</Text>
        <Text className="text-danish-white">{`${stats.val || 0}`}</Text>
      </View>
      <View className="w-full flex flex-row flex-wrap justify-between items-center mt-5 gap-y-2">
        {STATS_CONFIG.map((stat) =>
          stat === StatsEnums.minutes ? (
            <View
              key={stat}
              className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center"
            >
              <Text className="text-danish-white text-sm">Mins</Text>
              <Text className="text-danish-white">{`${timeFormat(stats[`${stat}`]) || 0}`}</Text>
            </View>
          ) : (
            <View
              key={stat}
              className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center"
            >
              <Text className="text-danish-white capitalize text-sm">
                {stat}
              </Text>
              <Text className="text-danish-white">{`${stats[`${stat}`] || 0}`}</Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
});

const StatsByGame = React.memo(({ info, onSelect }) => {
  return (
    <TouchableOpacity
      className="flex items-center bg-danish-dark-gray rounded-lg shadow-lg shadow-danish-red p-1 border border-danish-red hover:border-danish-gold active:border-danish-gold hover:bg-danish-red active:bg-danish-red my-2"
      onPress={() => onSelect(info)}
    >
      <Text className="text-danish-white text-xs">{`${info.round} - ${info.date} ${info.opponent}`}</Text>
    </TouchableOpacity>
  );
});

const PlayerCard = React.memo(({ playerInf }) => {
  return (
    <View className={`w-full px-5 mt-5`}>
      <View className="w-full flex flex-row justify-between items-center">
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">PTS</Text>
            <Text className="text-danish-white">{`${playerInf.total_pts || 0}`}</Text>
          </View>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">Val</Text>
            <Text className="text-danish-white">{`${playerInf.total_val || 0}`}</Text>
          </View>
        </View>
      </View>
      <View className="w-full flex flex-row flex-wrap justify-between items-center mt-5 gap-y-2">
        {STATS_CONFIG.map((stat) =>
          stat === StatsEnums.minutes ? (
            <View
              key={stat}
              className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center"
            >
              <Text className="text-danish-white text-sm">Mins</Text>
              <Text className="text-danish-white">{`${timeFormat(playerInf[`total_${stat}`]) || 0}`}</Text>
            </View>
          ) : (
            <View
              key={stat}
              className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center"
            >
              <Text className="text-danish-white capitalize text-sm">
                {stat}
              </Text>
              <Text className="text-danish-white">{`${playerInf[`total_${stat}`] || 0}`}</Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
});

const PlayerDetail = ({ data }) => {
  const { PlayerController, PlayerStatsController, TraningPlayersController } =
    useDB();
  const [playerAllStats, setPlayerAllStats] = useState([]);
  const [stats, setStats] = useState([]);
  const [gameStats, setGameStats] = useState([]);
  const [gameStatSelected, setGameStatSelected] = useState(null);
  const [totalTrainings, setTotalTrainings] = useState(0);
  const [totalTrainingsAssis, setTotalTrainingsAssis] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const TOTAL_TRAININGS = await TraningPlayersController.loadByPlayer(
        data.id,
      );
      setTotalTrainings(TOTAL_TRAININGS.length);
      setTotalTrainingsAssis(
        TOTAL_TRAININGS.filter((tp) => tp.assistance).length,
      );

      const RESULT_PLAYERALLSTATS = await PlayerController.loadStats(data.id);
      setPlayerAllStats(RESULT_PLAYERALLSTATS);
      setStats(await PlayerStatsController.loadByPlayer(data.id));
      setGameStats(await PlayerStatsController.loadStatGameByPlayer(data.id));
    };

    getData();
  }, []);

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ModalInfo
        title={`${gameStatSelected?.round} - ${gameStatSelected?.date} ${gameStatSelected?.opponent}`}
        information={<GameStats stats={gameStatSelected} />}
        visible={Boolean(gameStatSelected)}
        onClose={() => setGameStatSelected(null)}
      />
      <View className="w-full flex flex-col px-5">
        <View className="w-full flex flex-row gap-2 h-12">
          <ImageBackground
            source={jersey}
            className="w-10 flex justify-center items-center"
          >
            <Text className="font-bold text-danish-white mt-4">
              {data.number}
            </Text>
          </ImageBackground>
          <View className="h-full flex justify-center items-center">
            <Text className="font-bold text-danish-white text-lg">
              {data.first_name + " " + data.last_name}
            </Text>
          </View>
        </View>
        <View className="w-full mt-5 flex flex-row flex-wrap gap-2 justify-between">
          <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
            <Text className="font-bold text-danish-white">P. J</Text>
            <Text className="font-bold text-danish-white">{`${stats.length}`}</Text>
          </View>
          <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
            <Text className="font-bold text-danish-white">E. A</Text>
            <Text className="font-bold text-danish-white">
              {totalTrainingsAssis}/{totalTrainings}
            </Text>
          </View>
          <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
            <Text className="font-bold text-danish-white">E. F</Text>
            <Text className="font-bold text-danish-white">
              {totalTrainings - totalTrainingsAssis}
            </Text>
          </View>
        </View>
      </View>
      {playerAllStats.length > 0 ? (
        <PlayerCard playerInf={playerAllStats[0]} />
      ) : (
        <View className="w-full h-20 flex justify-center items-center mt-5">
          <Text className="font-bold">
            Aun no hay registro de ninguna estadística
          </Text>
        </View>
      )}
      <View className="w-full mt-2 mb-20">
        {gameStats.map((info) => (
          <StatsByGame
            key={info.date}
            info={info}
            onSelect={setGameStatSelected}
          />
        ))}
      </View>
    </View>
  );
};

export default PlayerDetail;
