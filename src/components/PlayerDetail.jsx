import { useEffect, useState } from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import useDB from "../hooks/useDB";
import jersey from "../../assets/jersey.png";
import Entypo from "@expo/vector-icons/Entypo";

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
    <View className={`w-full px-5 mt-3`}>
      <View className="w-full flex flex-row justify-between items-center">
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <Text className="text-danish-white">Mins</Text>
          <Text className="text-danish-white">{`${playerInf.total_minutes || 0}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">PTS</Text>
            <Text className="text-danish-white">{`${pts}`}</Text>
          </View>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">Val</Text>
            <Text className="text-danish-white">{`${val}`}</Text>
          </View>
        </View>
      </View>
      <View className="w-full flex flex-row flex-wrap justify-between items-center mt-5 gap-y-2">
        {[1, 2, 3].map((key) => (
          <RowData key={key}>
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="text-danish-white">T{key}A</Text>
              <Text className="text-danish-white">{`${playerInf[`total_t${key}a`] || 0}`}</Text>
            </View>
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="text-danish-white">T{key}I</Text>
              <Text className="text-danish-white">{`${playerInf[`total_t${key}i`] || 0}`}</Text>
            </View>
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="text-danish-white">T{key}%</Text>
              <Text className="text-danish-white">{`${(percent[`t${key}Per`] || 0).toFixed(1)}%`}</Text>
            </View>
          </RowData>
        ))}

        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">OReb</Text>
          <Text className="text-danish-white">{`${playerInf.total_oreb || 0}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">DReb</Text>
          <Text className="text-danish-white">{`${playerInf.total_dreb || 0}`}</Text>
        </View>

        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">Asis</Text>
          <Text className="text-danish-white">{`${playerInf.total_asis || 0}`}</Text>
        </View>

        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">Rec</Text>
          <Text className="text-danish-white">{`${playerInf.total_rec || 0}`}</Text>
        </View>

        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">PER</Text>
          <Text className="text-danish-white">{`${playerInf.total_per || 0}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">FALT</Text>
          <Text className="text-danish-white">{`${playerInf.total_falt || 0}`}</Text>
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
        <View className="w-full mt-2 flex flex-row flex-wrap gap-2 justify-between">
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

      <Text className="font-bold mb-1 mt-4 text-danish-white">
        Calendario de Pagos
      </Text>
      <View className="flex flex-row flex-wrap w-full h-full px-3 gap-4 justify-center items-center">
        {playerFees.map((pf) => (
          <View
            key={pf.fee_id}
            className={`w-20 h-20 flex flex-col justify-center items-center border rounded-xl  bg-danish-dark-gray shadow-inner ${pf.paid ? "shadow-danish-gold border-danish-gold" : "shadow-danish-red border-danish-red"}  p-1`}
          >
            <Text className="text-xs w-full text-center font-bold text-danish-white">
              {pf.month}
            </Text>
            <View className="w-full flex-1 flex items-center justify-center">
              {pf.paid ? (
                <Entypo name="check" size={18} color="gold" />
              ) : (
                <Entypo name="cross" size={18} color="red" />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PlayerDetail;
