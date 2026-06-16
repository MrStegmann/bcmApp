import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native-web";
import { TimerPickerModal } from "react-native-timer-picker";
import StatsEnums from "../../Enums/StatsEnums";
import { MaterialIcons } from "@expo/vector-icons";
import { timeFormat } from "../../helpers/timeFormat";

const PlayerInfo = ({ numberText, nameText, bgColor }) => (
  <View className="flex flex-row justify-between items-center">
    <Text
      className={`w-7 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {numberText}
    </Text>
    <Text
      className={`w-20 text-sm p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {nameText}
    </Text>
  </View>
);

const PlayerStatsInfo = ({ stats, bgColor }) => (
  <View className="flex flex-row justify-between items-center">
    <Text
      className={`w-12 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.min}
    </Text>
    <Text
      className={`w-12 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.pts}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t2a}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t2i}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t2per}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t3a}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t3i}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t3per}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t1a}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t1i}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.t1per}
    </Text>
    <Text
      className={`w-12 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.dreb}
    </Text>
    <Text
      className={`w-12 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.oreb}
    </Text>
    <Text
      className={`w-11 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.treb}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.asis}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.rec}
    </Text>
    <Text
      className={`w-10 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.per}
    </Text>
    <Text
      className={`w-11 text-sm text-center p-1 border ${bgColor ? "bg-gray-50" : "bg-gray-300"}`}
    >
      {stats.foult}
    </Text>
  </View>
);

// --- Componente Auxiliar para Contadores Genéricos (Rebotes, Asistencias, Pérdidas) ---
const StatCounter = ({ statKey, currentValue, increment, decrement }) => {
  return (
    <View
      className={`w-16 h-16 p-2 flex flex-col justify-center items-center border `}
    >
      <Text className=" text-xs text-center mb-1 capitalize">{statKey}</Text>
      <View className="w-full flex flex-row">
        <TouchableOpacity
          onPress={() => decrement(statKey)}
          style={{ padding: 0, marginRight: -10, marginLeft: -5 }}
        >
          <MaterialIcons name="arrow-left" size={16} color="black" />
        </TouchableOpacity>
        <Text className="text-xs text-center mb-1 capitalize w-full">
          {currentValue}
        </Text>
        <TouchableOpacity
          onPress={() => increment(statKey)}
          style={{ padding: 0, marginRight: -5, marginLeft: -10 }}
        >
          <MaterialIcons name="arrow-right" size={16} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Configuración de Estadísticas para mapeo ---
const STATS_CONFIG = Object.values(StatsEnums);

const EditPlayerStat = ({ data, setPlayers, onClose }) => {
  if (!data) return null;
  const [player, setPlayer] = useState({ ...data });
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const minutes = Math.floor(data.minutes / 60000);
    const seconds = Math.floor((data.minutes % 60000) / 1000);
    setTime({ minutes, seconds });
  }, [data]);

  const addStat = (stat) => {
    const newPlayer = { ...player };
    const prev = newPlayer[stat];

    if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
      const shot =
        stat === StatsEnums.t1a
          ? StatsEnums.t1i
          : stat === StatsEnums.t2a
            ? StatsEnums.t2i
            : StatsEnums.t3i;
      const playerti = newPlayer[shot];
      newPlayer[shot] = playerti + 1;
    }

    newPlayer[stat] = prev + 1;

    setPlayer(newPlayer);

    setPlayers((bef) => {
      const newPlayers = [...bef];
      const idx = newPlayers.findIndex((pl) => pl.id === player.id);
      newPlayers.splice(idx, 1, newPlayer);

      return newPlayers;
    });
  };

  const substractStat = (stat) => {
    const newPlayer = { ...player };
    const prev = newPlayer[stat];

    if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
      const shotI =
        stat === StatsEnums.t1a
          ? StatsEnums.t1i
          : stat === StatsEnums.t2a
            ? StatsEnums.t2i
            : StatsEnums.t3i;
      newPlayer[shotI] = Math.max(0, newPlayer[shotI] - 1);
    }

    newPlayer[stat] = Math.max(0, prev - 1);
    setPlayer(newPlayer);
    setPlayers((bef) => {
      const newPlayers = [...bef];
      const idx = newPlayers.findIndex((pl) => pl.id === player.id);
      newPlayers.splice(idx, 1, newPlayer);

      return newPlayers;
    });
  };

  const onChangeTime = (pickedDuration) => {
    const totalMillis =
      pickedDuration.minutes * 60000 + pickedDuration.seconds * 1000;
    const newPlayer = { ...player, minutes: totalMillis };
    setPlayer(newPlayer);
    setPlayers((bef) => {
      const newPlayers = [...bef];
      const idx = newPlayers.findIndex((pl) => pl.id === player.id);
      newPlayers.splice(idx, 1, newPlayer);

      return newPlayers;
    });
    setTime({
      minutes: pickedDuration.minutes,
      seconds: pickedDuration.seconds,
    });
    setShowPicker(false);
  };

  const pts = (player.t1a || 0) + (player.t2a || 0) * 2 + (player.t3a || 0) * 3;

  const val =
    player.t1a +
    player.t2a +
    player.t3a +
    player.asis +
    player.rec +
    player.dreb +
    player.oreb -
    player.per -
    player.foult -
    (player.t1i - player.t1a) -
    (player.t2i - player.t2a) -
    (player.t3i - player.t3a);
  return (
    <View className="flex-1 px-5 py-20 flex items-center justify-center">
      <View className="w-full bg-gray-50 z-10 my-1 flex flex-col items-center border border-gray-300 rounded-xl">
        <TimerPickerModal
          visible={showPicker}
          setIsVisible={setShowPicker}
          hideHours
          hideDays
          onConfirm={onChangeTime}
          onCancel={() => setShowPicker(false)}
          closeOnOverlayPress
          styles={{
            theme: "dark",
            confirmButton: {
              backgroundColor: "#1D2633",
              borderColor: "#FFD700",
            },
            cancelButton: {
              backgroundColor: "#1D2633",
              borderColor: "#78081d",
            },
          }}
          modalProps={{
            overlayOpacity: 0.2,
          }}
        />
        <View className="w-full px-2 py-3 flex justify-center items-center border-b border-danish-white">
          <Text className="text-sm ">
            {`${player.player.number} - ${player.player.name} ${player.player.lastname}`}
          </Text>
        </View>

        <View className="w-full px-2 py-3 flex flex-row justify-center items-centere">
          <View className="w-16 h-16 p-2 flex flex-col justify-center items-center">
            <Text className="text-sm text-center mb-1">Pts</Text>
            <Text className="text-sm text-center">{pts}</Text>
          </View>

          <View className="w-16 h-16 p-2 flex flex-col justify-center items-center">
            <Text className="text-sm text-center mb-1">Val</Text>
            <Text className="text-sm text-center">{val}</Text>
          </View>
        </View>

        <View className="w-full flex flex-row flex-wrap justify-between p-2 gap-2">
          <View className="w-16 h-16 p-2 flex flex-col justify-center items-center border ">
            <Text className="text-sm text-center mb-1">Min</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text className="text-sm text-center">
                {`${time.minutes.toString().padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")} `}
              </Text>
            </TouchableOpacity>
          </View>

          {STATS_CONFIG.map((key) => (
            <StatCounter
              key={key}
              statKey={key}
              currentValue={player[key] || 0}
              increment={addStat}
              decrement={substractStat}
            />
          ))}
        </View>

        <View className="w-full flex justify-center items-center my-2">
          <TouchableOpacity
            className="py-3 px-5 border flex justify-center items-center rounded-xl"
            onPress={onClose}
          >
            <Text className=" text-sm text-center">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const PlayerStats = ({ p, index }) => {
  const calcShotPorcent = (ta, ti) => {
    const percent = ta / ti;
    if (isNaN(percent)) return 0;
    return percent.toFixed(2);
  };
  const pts = p.t1a + p.t2a * 2 + p.t3a * 3;
  const treb = p.dreb + p.oreb;

  return (
    <PlayerStatsInfo
      bgColor={index % 2 === 0}
      stats={{
        min: timeFormat(p.minutes),
        pts: pts,

        t2per: calcShotPorcent(p.t2a, p.t2i),

        t3per: calcShotPorcent(p.t3a, p.t3i),

        t1per: calcShotPorcent(p.t3a, p.t3i),

        treb: treb,

        ...p,
      }}
    />
  );
};

const StatsTable = ({ players, setPlayers }) => {
  const [editingStats, setEditingStats] = useState(false);
  const [playerSelected, setPlayerSelected] = useState(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const onBodyHorizontalScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    headerRef.current?.scrollTo({ x, animated: false });
  };

  return (
    <View className="w-full flex flex-col mt-2">
      <Modal
        animationType="slide"
        transparent={true}
        visible={editingStats}
        onRequestClose={() => setEditingStats(false)}
      >
        <EditPlayerStat
          data={playerSelected}
          setPlayers={setPlayers}
          onClose={() => {
            setEditingStats(false);
            setPlayerSelected(null);
          }}
        />
      </Modal>
      <View className="w-full flex flex-row">
        <PlayerInfo numberText={"Nº"} nameText={"Number"} bgColor={true} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          ref={headerRef}
        >
          <PlayerStatsInfo
            bgColor={true}
            stats={{
              min: "Min",
              pts: "Pts",
              t2a: "T2A",
              t2i: "T2I",
              t2per: "T2%",
              t3a: "T3A",
              t3i: "T3I",
              t3per: "T3%",
              t1a: "T1A",
              t1i: "T1I",
              t1per: "T1%",
              dreb: "DReb",
              oreb: "OReb",
              treb: "TReb",
              asis: "Asis",
              rec: "Rec",
              per: "Per",
              foult: "Falt",
            }}
          />
        </ScrollView>
      </View>

      <View className="w-full flex flex-row">
        <View className="flex flex-col justify-between items-center">
          {players.map((p, index) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => {
                setPlayerSelected(p);
                setEditingStats(true);
              }}
            >
              <PlayerInfo
                bgColor={index % 2 === 0}
                numberText={p.player.number}
                nameText={p.player.name}
              />
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          ref={bodyRef}
          onScroll={onBodyHorizontalScroll}
        >
          <View className="flex flex-col justify-between items-center">
            {players.map((p, index) => (
              <PlayerStats p={p} index={index} key={p.id + "stats"} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default StatsTable;
