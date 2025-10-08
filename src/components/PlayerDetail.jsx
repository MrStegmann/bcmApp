import React, { useEffect, useState } from "react";
import { ImageBackground, Text, View } from "react-native";
import useDB from "../hooks/useDB";
import jersey from "../../assets/jersey.png";
import { timeFormat } from "../helpers/timeFormat";
import StatsEnums from "../Enums/StatsEnums";

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

const StatsByGame = React.memo(({ info }) => {
  return (
    <View className="w-full flex flex-col">
      <Text className="text-danish-white text-xs">{`${info.round} - ${info.date} ${info.opponent}`}</Text>
      <View className="w-full flex flex-row justify-between flex-wrap gap-x-5">
        {STATS_CONFIG.map((stat) =>
          stat === StatsEnums.minutes ? (
            <Text className="text-danish-white text-xs">{`Mins: ${timeFormat(info[stat]) || 0}`}</Text>
          ) : (
            <Text className="text-danish-white capitalize text-xs">{`${stat}: ${info[stat] || 0}`}</Text>
          )
        )}
      </View>
    </View>
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
          )
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
  const [totalTrainings, setTotalTrainings] = useState(0);
  const [totalTrainingsAssis, setTotalTrainingsAssis] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const TOTAL_TRAININGS = await TraningPlayersController.loadByPlayer(
        data.id
      );
      setTotalTrainings(TOTAL_TRAININGS.length);
      setTotalTrainingsAssis(
        TOTAL_TRAININGS.filter((tp) => tp.assistance).length
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
          <StatsByGame key={info.date} info={info} />
        ))}
      </View>
    </View>
  );
};

export default PlayerDetail;
