import React, { useEffect, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import {
  useBenchAndQuintetStore,
  useCronoStore,
  useMarketStore,
  usePlayPlayersStore,
} from "../../store/MatchStore";
import StatsEnums from "../../Enums/StatsEnums";
import { shallow } from "zustand/shallow";
import { timeFormat } from "../../helpers/timeFormat";

const POINTS = ["t1", "t2", "t3"];
const OTHERSTATS = [
  StatsEnums.foult,
  StatsEnums.dreb,
  StatsEnums.oreb,
  StatsEnums.asis,
  StatsEnums.rec,
  StatsEnums.per,
];

const StatValue = React.memo(({ value }) => (
  <Text className="text-center text-xs">{value}</Text>
));

const PlayerInfo = React.memo(({ playerSelected }) => {
  const player = usePlayPlayersStore((state) => state.players[playerSelected]);
  return (
    <Text className="text-center text-xs">{`${player?.number} - ${player?.name} ${player?.lastname}`}</Text>
  );
});

const MinutesAndPoints = React.memo(({ playerSelected }) => {
  const player = usePlayPlayersStore((state) => state.players[playerSelected]);

  const pts = player?.stats
    ? player.stats.t1a + player.stats.t2a * 2 + player.stats.t3a * 3
    : 0;

  return (
    <View className="flex flex-row flex-wrap justify-between w-full mb-5">
      <View className="flex flex-col justify-center items-center">
        <Text className="text-center text-xs capitalize">Minutos</Text>
        <StatValue value={timeFormat(player?.stats?.minutes || 0)} />
      </View>

      <View className="flex flex-col justify-center items-center">
        <Text className="text-center text-xs capitalize">Puntos</Text>
        <StatValue value={pts} />
      </View>
    </View>
  );
});

const StatButton = React.memo(({ onPress, label, hidden }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-5 h-5 border rounded-lg flex items-center justify-center ${hidden ? "hidden" : ""}`}
  >
    <Text className="text-center text-xs">{label}</Text>
  </TouchableOpacity>
));

const AsistModal = React.memo(({ setShowAsistModal, playerSelected }) => {
  const players = usePlayPlayersStore((state) => state.players, shallow);
  const addPlayerStat = usePlayPlayersStore((state) => state.addPlayerStat);
  const quintet = useBenchAndQuintetStore((state) => state.quintet);

  const handleAddScoreAssistant = useCallback(
    (playerId) => {
      addPlayerStat(playerId, StatsEnums.asis);
      setShowAsistModal(false);
    },
    [players],
  );
  return (
    <View className="w-full h-full flex justify-center items-center">
      <View className="w-2/3 h-2/5 bg-slate-50 border rounded-lg flex flex-col justify-center items-center">
        <Text className="font-bold mb-5">Asistente</Text>
        <FlatList
          contentContainerStyle={{ gap: 5 }}
          data={quintet.filter((id) => id !== playerSelected)}
          scrollEnabled={false}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleAddScoreAssistant(item)}
              className="px-1 py-2 rounded-lg border"
            >
              <PlayerInfo playerSelected={item} />
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          onPress={() => setShowAsistModal(false)}
          className="px-2 py-3 border rounded-lg mb-2"
        >
          <Text className="font-bold">Sin asistencia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const StatsOptions = React.memo(({ s, playerSelected }) => {
  const player = usePlayPlayersStore(
    (state) => state.players[playerSelected],
    shallow,
  );
  const bench = useBenchAndQuintetStore((state) => state.bench);
  const addPlayerStat = usePlayPlayersStore((state) => state.addPlayerStat);
  const substractPlayerStat = usePlayPlayersStore(
    (state) => state.substractPlayerStat,
  );
  const addTeamFoult = useMarketStore((state) => state.addTeamFoult);
  const substractTeamFoult = useMarketStore(
    (state) => state.substractTeamFoult,
  );
  const setRunning = useCronoStore((state) => state.setRunning);

  const handleAddStat = useCallback(
    (playerId, stat) => {
      addPlayerStat(playerId, stat);
      if (stat === StatsEnums.foult) {
        addTeamFoult();
        setRunning(false);
      }
    },
    [playerSelected],
  );
  const handleSubstractStat = useCallback(
    (playerId, stat) => {
      substractPlayerStat(playerId, stat);
      if (stat === StatsEnums.foult) {
        substractTeamFoult();
      }
    },
    [playerSelected],
  );

  const onCheckDisableButtons = useCallback(() => {
    return bench.includes(playerSelected) || playerSelected === -1;
  }, [bench, playerSelected]);

  return (
    <View className={`w-20 h-20`}>
      <Text className="text-center text-xs capitalize">{s}</Text>
      <View className="w-full border-t flex flex-row justify-center pt-1">
        <View className="flex flex-col justify-center items-center">
          <StatValue value={player?.stats[s] || 0} />

          <View className="flex flex-row gap-1 items-center justify-center">
            <StatButton
              onPress={() => handleSubstractStat(playerSelected, s)}
              hidden={onCheckDisableButtons()}
              label={"-"}
            />

            <StatButton
              onPress={() => handleAddStat(playerSelected, s)}
              hidden={onCheckDisableButtons()}
              label={"+"}
            />
          </View>
        </View>
      </View>
    </View>
  );
});

const PointsOptions = React.memo(({ p, playerSelected }) => {
  const [showAsistModal, setShowAsistModal] = useState(false);
  const player = usePlayPlayersStore(
    (state) => state.players[playerSelected],
    shallow,
  );

  const bench = useBenchAndQuintetStore((state) => state.bench, shallow);

  const addPlayerStat = usePlayPlayersStore((state) => state.addPlayerStat);
  const substractPlayerStat = usePlayPlayersStore(
    (state) => state.substractPlayerStat,
  );

  const addTeamPoints = useMarketStore((state) => state.addTeamPoints);
  const substractTeamPoints = useMarketStore(
    (state) => state.substractTeamPoints,
  );

  const handleAddSuccess = useCallback(
    (playerId, stat) => {
      addPlayerStat(playerId, stat);

      switch (stat) {
        case "t1a":
          addTeamPoints(1);
          break;
        case "t2a":
          addTeamPoints(2);
          setShowAsistModal(true);
          break;
        default:
          addTeamPoints(3);
          setShowAsistModal(true);
          break;
      }
    },
    [playerSelected],
  );
  const handleSubstractSuccess = useCallback(
    (playerId, stat) => {
      if (player.stats[stat] === 0) return;
      substractPlayerStat(playerId, stat);
      switch (stat) {
        case "t1a":
          substractTeamPoints(1);
          break;
        case "t2a":
          substractTeamPoints(2);
          break;
        default:
          substractTeamPoints(3);
          break;
      }
    },
    [playerSelected],
  );

  const onCheckDisableButtons = useCallback(() => {
    return bench.includes(playerSelected) || playerSelected === -1;
  }, [bench, playerSelected]);

  return (
    <View className={`w-20 h-20`}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAsistModal}
        onRequestClose={() => setShowAsistModal(false)}
      >
        <AsistModal
          setShowAsistModal={setShowAsistModal}
          playerSelected={playerSelected}
        />
      </Modal>
      <Text className="text-center text-xs capitalize">{p}</Text>
      <View className="w-full border-t flex flex-row justify-center pt-1">
        <View className="flex flex-col justify-center items-center border-r px-1">
          <Text className="text-center text-xs">A</Text>
          <StatValue value={player?.stats[`${p}a`] || 0} />

          <StatButton
            onPress={() => handleAddSuccess(playerSelected, `${p}a`)}
            hidden={onCheckDisableButtons()}
            label={"+"}
          />

          <StatButton
            onPress={() => handleSubstractSuccess(playerSelected, `${p}a`)}
            hidden={onCheckDisableButtons()}
            label={"-"}
          />
        </View>

        <View className="flex flex-col justify-center items-center px-1">
          <Text className="text-center text-xs">I</Text>
          <StatValue value={player?.stats[`${p}i`] || 0} />

          <StatButton
            onPress={() => addPlayerStat(playerSelected, `${p}i`)}
            hidden={onCheckDisableButtons()}
            label={"+"}
          />

          <StatButton
            onPress={() => substractPlayerStat(playerSelected, `${p}i`)}
            hidden={onCheckDisableButtons()}
            label={"-"}
          />
        </View>
      </View>
    </View>
  );
});

const PlayerOptions = React.memo(({ playerSelected }) => {
  return (
    <View className="w-full h-full flex flex-col justify-center items-center">
      {playerSelected !== -1 ? (
        <PlayerInfo playerSelected={playerSelected} />
      ) : (
        <Text className="text-center text-xs">Ningún jugador seleccionado</Text>
      )}
      <MinutesAndPoints playerSelected={playerSelected} />
      <View className="flex flex-row flex-wrap justify-between w-full mb-5">
        {POINTS.map((p) => (
          <PointsOptions key={p} p={p} playerSelected={playerSelected} />
        ))}
      </View>
      <View className="flex flex-row flex-wrap justify-between w-full mt-5">
        {OTHERSTATS.map((s) => (
          <StatsOptions key={s} s={s} playerSelected={playerSelected} />
        ))}
      </View>
    </View>
  );
});

export default PlayerOptions;
