import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import useDB from "../hooks/useDB";
const RowData = ({ children }) => {
  return <>{children}</>;
};
const PlayerCard = ({ playerInf }) => {
  const percent = {
    t1Per:
      playerInf.total_t1a === "0" && playerInf.total_t1i === "0"
        ? 0
        : (Number(playerInf.total_t1a) / Number(playerInf.total_t1i)) * 100,
    t2Per:
      playerInf.total_t2a === "0" && playerInf.total_t2i === "0"
        ? 0
        : (Number(playerInf.total_t2a) / Number(playerInf.total_t2i)) * 100,
    t3Per:
      playerInf.total_t3a === "0" && playerInf.total_t3i === "0"
        ? 0
        : (Number(playerInf.total_t3a) / Number(playerInf.total_t3i)) * 100,
  };
  const pts =
    Number(playerInf.total_t1a) +
    Number(playerInf.total_t2a) * 2 +
    Number(playerInf.total_t3i) * 3;
  const val =
    Number(playerInf.total_t2a) +
    Number(playerInf.total_t3a) +
    Number(playerInf.total_t1a) +
    (Number(playerInf.total_dreb) + Number(playerInf.total_oreb)) +
    Number(playerInf.total_asis) +
    Number(playerInf.total_rec) -
    Number(playerInf.total_per) -
    Number(playerInf.total_falt) -
    (Number(playerInf.total_t2i) - Number(playerInf.total_t2a)) -
    (Number(playerInf.total_t3i) - Number(playerInf.total_t3a)) -
    (Number(playerInf.total_t1i) - Number(playerInf.total_t1a));

  return (
    <View className={`w-full flex flex-col bg-danish-red rounded-xl p-2 mt-10`}>
      <View className="w-full flex flex-row justify-between items-center mb-5">
        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white">Mins</Text>
          <Text className="text-danish-white">{`${playerInf.total_minutes || 0}`}</Text>
        </View>
        <View className="w-1/4">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">PTS</Text>
            <Text className="text-danish-white">{`${pts}`}</Text>
          </View>
        </View>
        <View className="w-1/4">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">Val</Text>
            <Text className="text-danish-white">{`${val}`}</Text>
          </View>
        </View>
      </View>
      <View className="w-full flex flex-row flex-wrap mb-1 gap-3 justify-between items-center">
        {[1, 2, 3].map((key) => (
          <RowData key={key}>
            <View className="w-1/4 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">T{key}A</Text>
              <Text className="text-danish-white text-sm">{`${playerInf[`total_t${key}a`] || 0}`}</Text>
            </View>
            <View className="w-1/4 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">T{key}I</Text>
              <Text className="text-danish-white text-sm">{`${playerInf[`total_t${key}i`] || 0}`}</Text>
            </View>
            <View className="w-1/4 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">T{key}%</Text>
              <Text className="text-danish-white text-sm ">{`${(percent[`t${key}Per`] || 0).toFixed(1)}%`}</Text>
            </View>
          </RowData>
        ))}

        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">OReb</Text>
          <Text className="text-danish-white text-sm">{`${playerInf.total_oreb || 0}`}</Text>
        </View>
        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">DReb</Text>
          <Text className="text-danish-white text-sm">{`${playerInf.total_dreb || 0}`}</Text>
        </View>

        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">Asis</Text>
          <Text className="text-danish-white text-sm">{`${playerInf.total_asis || 0}`}</Text>
        </View>

        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">Rec</Text>
          <Text className="text-danish-white text-sm">{`${playerInf.total_rec || 0}`}</Text>
        </View>

        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">PER</Text>
          <Text className="text-danish-white text-sm">{`${playerInf.total_per || 0}`}</Text>
        </View>
        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">FALT</Text>
          <Text className="text-danish-white text-sm">{`${playerInf.total_falt || 0}`}</Text>
        </View>
      </View>
    </View>
  );
};

const PlayerDetail = ({ data }) => {
  const { PlayerController, PlayerStatsController, TraningPlayersController } =
    useDB();
  const [playerFees, setPlayerFees] = useState([]);
  const [playerAllStats, setPlayerAllStats] = useState([]);
  const [stats, setStats] = useState([]);
  const [totalTrainings, setTotalTrainings] = useState(0);
  const [totalTrainingsAssis, setTotalTrainingsAssis] = useState(0);

  useEffect(() => {
    TraningPlayersController.loadByPlayer(data.id, (results) => {
      setTotalTrainings(results.length);
      setTotalTrainingsAssis(results.filter((tp) => tp.assistance).length);
    });
    PlayerController.loadFees(data.id, setPlayerFees);
    PlayerController.loadStats(data.id, (items) => {
      setPlayerAllStats(
        items.map((item) => ({
          ...item,
          pts: item.total_t2a * 2 + item.total_t3a * 3 + item.total_t1a,
          total_t1per: item.total_t1a / item.total_t1i,
          total_t2per: item.total_t2a / item.total_t2i,
          total_t3per: item.total_t3a / item.total_t3i,
          total_reb: item.total_dreb + item.total_oreb,
          val:
            item.total_t2a +
            item.total_t3a +
            item.total_t1a +
            (item.total_dreb + item.total_oreb) +
            item.total_asis +
            item.total_rec -
            item.total_per -
            item.total_falt -
            (item.total_t2i - item.total_t2a) -
            (item.total_t3i - item.total_t3a) -
            (item.total_t1i - item.total_t1a),
        }))
      );
    });
    PlayerStatsController.loadByPlayer(data.id, setStats);
  }, []);

  return (
    <View className="w-full h-full flex flex-col items-center">
      <View className="w-full flex flex-col px-5">
        <Text className="font-bold text-xl">
          Nombre:{" "}
          <Text className="font-normal">
            {data.first_name + " " + data.last_name}
          </Text>
        </Text>
        <Text className="font-bold text-xl">
          Dorsal: <Text className="font-normal">{data.number}</Text>
        </Text>
        <Text className="font-bold text-xl">
          Partidos jugados:{" "}
          <Text className="font-normal">{`${stats.length}`}</Text>
        </Text>
        <Text className="font-bold text-xl">
          Entrenamientos asistidos:{" "}
          <Text className="font-normal">
            {totalTrainingsAssis}/{totalTrainings}
          </Text>
        </Text>
        <Text className="font-bold text-xl">
          Entrenamientos faltados:{" "}
          <Text className="font-normal">
            {totalTrainings - totalTrainingsAssis}
          </Text>
        </Text>
      </View>
      <View className="flex flex-row w-full px-3 mt-5 gap-4 justify-center items-center">
        <ScrollView horizontal={true}>
          {playerFees.map((pf) => (
            <View
              key={pf.fee_id}
              className="w-28 h-28 flex flex-col justify-center items-center border border-danish-gold bg-danish-white"
            >
              <Text className="h-[2rem] w-full text-center font-bold text-danish-red py-1">
                {pf.month}
              </Text>
              <Text
                className={`h-[4rem] w-full text-center ${pf.paid ? "text-danish-dark-gray" : "text-danish-red"} py-1`}
              >
                {pf.paid ? "Pagado" : "No pagado"}
              </Text>
            </View>
          ))}
        </ScrollView>
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
    </View>
  );
};

export default PlayerDetail;
