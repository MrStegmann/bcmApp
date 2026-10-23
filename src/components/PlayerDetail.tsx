import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

import useDB from "../hooks/useDB";
import jersey from "../../assets/jersey.png";

const RowData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const PlayerCard: React.FC<{ playerInf: any }> = ({ playerInf }) => {
  const t1a = Number(playerInf.total_t1a || playerInf.t1a || 0);
  const t1i = Number(playerInf.total_t1i || playerInf.t1i || 0);
  const t2a = Number(playerInf.total_t2a || playerInf.t2a || 0);
  const t2i = Number(playerInf.total_t2i || playerInf.t2i || 0);
  const t3a = Number(playerInf.total_t3a || playerInf.t3a || 0);
  const t3i = Number(playerInf.total_t3i || playerInf.t3i || 0);

  const percent = {
    t1Per: t1a === 0 && t1i === 0 ? 0 : (t1a / Math.max(1, t1i)) * 100,
    t2Per: t2a === 0 && t2i === 0 ? 0 : (t2a / Math.max(1, t2i)) * 100,
    t3Per: t3a === 0 && t3i === 0 ? 0 : (t3a / Math.max(1, t3i)) * 100,
  };

  const pts = t1a + t2a * 2 + t3i * 3;
  const oreb = Number(playerInf.total_oreb || playerInf.oreb || 0);
  const dreb = Number(playerInf.total_dreb || playerInf.dreb || 0);
  const asis = Number(playerInf.total_asis || playerInf.asis || 0);
  const rec = Number(playerInf.total_rec || playerInf.rec || 0);
  const per = Number(playerInf.total_per || playerInf.per || 0);
  const falt = Number(playerInf.total_falt || playerInf.falt || 0);

  const val =
    t2a +
    t3a +
    t1a +
    (dreb + oreb) +
    asis +
    rec -
    per -
    falt -
    Math.max(0, t2i - t2a) -
    Math.max(0, t3i - t3a) -
    Math.max(0, t1i - t1a);

  return (
    <View className="w-full px-5 mt-3">
      <View className="w-full flex flex-row justify-between items-center">
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <Text className="text-danish-white">Mins</Text>
          <Text className="text-danish-white">{`${playerInf.total_minutes || playerInf.minutes || 0}`}</Text>
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
              <Text className="text-danish-white">{`${playerInf[`total_t${key}a`] || playerInf[`t${key}a`] || 0}`}</Text>
            </View>
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="text-danish-white">T{key}I</Text>
              <Text className="text-danish-white">{`${playerInf[`total_t${key}i`] || playerInf[`t${key}i`] || 0}`}</Text>
            </View>
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="text-danish-white">T{key}%</Text>
              <Text className="text-danish-white">{`${(percent[`t${key}Per` as keyof typeof percent] || 0).toFixed(1)}%`}</Text>
            </View>
          </RowData>
        ))}

        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">OReb</Text>
          <Text className="text-danish-white">{`${oreb}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">DReb</Text>
          <Text className="text-danish-white">{`${dreb}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">Asis</Text>
          <Text className="text-danish-white">{`${asis}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">Rec</Text>
          <Text className="text-danish-white">{`${rec}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">PER</Text>
          <Text className="text-danish-white">{`${per}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">FALT</Text>
          <Text className="text-danish-white">{`${falt}`}</Text>
        </View>
      </View>
    </View>
  );
};

interface PlayerDetailProps {
  data: any;
  onReturn?: () => void;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ data }) => {
  const { PlayerController, PlayerStatsController } = useDB();
  const [playerAllStats, setPlayerAllStats] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    if (data?.id) {
      PlayerController.loadStats(data.id, (items: any[]) => {
        setPlayerAllStats(items);
      });
      PlayerStatsController.loadByPlayer(data.id, setStats);
    }
  }, [data]);

  const firstName = data?.firstName || data?.first_name || "";
  const lastName = data?.lastName || data?.last_name || "";

  return (
    <View className="w-full h-full flex flex-col items-center">
      <View className="w-full flex flex-col px-5">
        <View className="w-full flex flex-row gap-2 h-12">
          <ImageBackground
            source={jersey}
            className="w-10 flex justify-center items-center"
          >
            <Text className="font-bold text-danish-white mt-4">
              {data?.number || ""}
            </Text>
          </ImageBackground>
          <View className="h-full flex justify-center items-center">
            <Text className="font-bold text-danish-white text-lg">
              {`${firstName} ${lastName}`}
            </Text>
          </View>
        </View>
        <View className="w-full mt-2 flex flex-row flex-wrap gap-2">
          <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
            <Text className="font-bold text-danish-white">P. J</Text>
            <Text className="font-bold text-danish-white">{`${stats.length}`}</Text>
          </View>
        </View>
      </View>
      {playerAllStats.length > 0 ? (
        <PlayerCard playerInf={playerAllStats[0]} />
      ) : (
        <View className="w-full h-20 flex justify-center items-center mt-5">
          <Text className="font-bold text-danish-white">
            Aún no hay registro de ninguna estadística
          </Text>
        </View>
      )}
    </View>
  );
};

export default PlayerDetail;
