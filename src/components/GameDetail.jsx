import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import useDB from "../hooks/useDB";
import TopMenuEnums from "../Enums/TopMenuEnums";
import { useMenuStore } from "../store/MenuStore";
import * as ScreenOrientation from "expo-screen-orientation";
import { useAlertStore } from "../store/AlertStore";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useGameStore } from "../store/GameStore";

const PlayerCard = ({ player, quarter, isToBench, prepareToBench }) => {
  if (!player) return null;
  const incrementPlayerPoints = useGameStore(
    (state) => state.incrementPlayerPoints
  );
  const incrementPlayerFalts = useGameStore(
    (state) => state.incrementPlayerFalts
  );
  const incrementPlayerStat = useGameStore(
    (state) => state.incrementPlayerStat
  );
  const decrementPlayerPoints = useGameStore(
    (state) => state.decrementPlayerPoints
  );
  const decrementPlayerFalts = useGameStore(
    (state) => state.decrementPlayerFalts
  );
  const decrementPlayerStat = useGameStore(
    (state) => state.decrementPlayerStat
  );
  const timePlayed = player.stats?.[quarter].min ?? 0;

  const mins = Math.floor(timePlayed / 60)
    .toString()
    .padStart(1, "0");
  return (
    <View className="w-full my-1 flex flex-row items-center border-b border-danish-light-gray gap-1">
      <TouchableOpacity
        className="w-28 px-1"
        onPress={() => prepareToBench(player.player_id)}
      >
        <Text
          className={`text-sm ${isToBench() ? "text-red-600" : "text-danish-white"}`}
        >
          {`${player.number} - ${player.first_name}`}
        </Text>
      </TouchableOpacity>
      <View className="w-12 px-1">
        <Text className="text-danish-white text-sm text-center">{mins}</Text>
      </View>
      <View className="w-12 px-1">
        <Text className="text-danish-white text-sm text-center">
          {player.stats[quarter].pts}
        </Text>
      </View>
      {["1a", "1i", "2a", "2i", "3a", "3i"].map((t) => (
        <View
          key={`t${t}`}
          className="w-12 px-1 flex flex-row justify-center items-center"
        >
          <TouchableOpacity
            onPress={() => decrementPlayerPoints(player.player_id, `t${t}`)}
            className="flex justify-center items-center"
          >
            <MaterialIcons name="arrow-back-ios" size={10} color="white" />
          </TouchableOpacity>
          <Text className="text-danish-white text-sm text-center">
            {player.stats[quarter][`t${t}`]}
          </Text>
          <TouchableOpacity
            onPress={() => incrementPlayerPoints(player.player_id, `t${t}`)}
          >
            <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
          </TouchableOpacity>
        </View>
      ))}
      <View className="w-12 px-1 flex flex-row justify-center items-center">
        <TouchableOpacity
          className="flex justify-center items-center"
          onPress={() => decrementPlayerFalts(player.player_id)}
        >
          <MaterialIcons name="arrow-back-ios" size={10} color="white" />
        </TouchableOpacity>
        <Text className="text-danish-white text-sm text-center">
          {player.stats[quarter].falt}
        </Text>
        <TouchableOpacity
          onPress={() => incrementPlayerFalts(player.player_id)}
        >
          <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-14 px-1 flex flex-row justify-center items-center">
        <TouchableOpacity
          className="flex justify-center items-center"
          onPress={() => decrementPlayerStat(player.player_id, "dreb")}
        >
          <MaterialIcons name="arrow-back-ios" size={10} color="white" />
        </TouchableOpacity>
        <Text className="text-danish-white text-sm text-center">
          {player.stats[quarter].dreb}
        </Text>
        <TouchableOpacity
          onPress={() => incrementPlayerStat(player.player_id, "dreb")}
        >
          <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-14 px-1 flex flex-row justify-center items-center">
        <TouchableOpacity
          className="flex justify-center items-center"
          onPress={() => decrementPlayerStat(player.player_id, "oreb")}
        >
          <MaterialIcons name="arrow-back-ios" size={10} color="white" />
        </TouchableOpacity>
        <Text className="text-danish-white text-sm text-center">
          {player.stats[quarter].oreb}
        </Text>
        <TouchableOpacity
          onPress={() => incrementPlayerStat(player.player_id, "oreb")}
        >
          <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-12 px-1 flex flex-row justify-center items-center">
        <TouchableOpacity
          className="flex justify-center items-center"
          onPress={() => decrementPlayerStat(player.player_id, "asis")}
        >
          <MaterialIcons name="arrow-back-ios" size={10} color="white" />
        </TouchableOpacity>
        <Text className="text-danish-white text-sm text-center">
          {player.stats[quarter].asis}
        </Text>
        <TouchableOpacity
          onPress={() => incrementPlayerStat(player.player_id, "asis")}
        >
          <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-12 px-1 flex flex-row justify-center items-center">
        <TouchableOpacity
          className="flex justify-center items-center"
          onPress={() => decrementPlayerStat(player.player_id, "rec")}
        >
          <MaterialIcons name="arrow-back-ios" size={10} color="white" />
        </TouchableOpacity>
        <Text className="text-danish-white text-sm text-center">
          {player.stats[quarter].rec}
        </Text>
        <TouchableOpacity
          onPress={() => incrementPlayerStat(player.player_id, "rec")}
        >
          <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-12 px-1 flex flex-row justify-center items-center">
        <TouchableOpacity
          className="flex justify-center items-center"
          onPress={() => decrementPlayerStat(player.player_id, "per")}
        >
          <MaterialIcons name="arrow-back-ios" size={10} color="white" />
        </TouchableOpacity>
        <Text className="text-danish-white text-sm text-center">
          {player.stats[quarter].per}
        </Text>
        <TouchableOpacity
          onPress={() => incrementPlayerStat(player.player_id, "per")}
        >
          <MaterialIcons name="arrow-forward-ios" size={10} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BenchPlayer = ({ playerInf, isToQuintet, onSelect }) => {
  return (
    <TouchableOpacity
      className={`border rounded-lg w-22 py-1 px-2 ${isToQuintet() ? "border-danish-gold" : "border-danish-red"}`}
      onPress={() => onSelect(playerInf.player_id)}
    >
      <Text className="text-danish-white text-center text-xs">
        {`${playerInf.number} - ${playerInf.first_name}`}
      </Text>
    </TouchableOpacity>
  );
};

const GameDetail = ({ data, onReturn }) => {
  if (!data) return;
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const addAlert = useAlertStore((state) => state.addAlert);
  const {
    setID,
    setOpponent,
    setRound,
    setDate,
    decrementTime,
    quarter,
    setQuarter,
    opponentResults,
    setOpponentResults,
    quintet,
    setQuintet,
    toBench,
    setToBench,
    toQuintet,
    setToQuintet,
    bench,
    setBench,
    incrementPlayersTime,
  } = useGameStore((state) => state);

  const { PlayerController, GameController } = useDB();

  const [crono, setCrono] = useState(false);

  const interval = useRef(null);

  useEffect(() => {
    if (crono) {
      interval.current = setInterval(() => {
        decrementTime();
        incrementPlayersTime();
      }, 1000);
    } else {
      clearInterval(interval.current);
    }
  }, [crono]);

  useEffect(() => {
    // Bloquea la orientación a apaisado cuando el componente se monta
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    getRoaster();

    setID(data.id);
    setOpponent(data.opponent);
    setRound(data.round);
    setDate(data.date);

    mainMenu();

    return () => {
      // Desbloquea la orientación a la predeterminada cuando el componente se desmonta
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const getRoaster = async () => {
    const RESULT_CALLEDUP = await GameController.loadCalledup(data.id);
    const preBench = new Map();
    for (let i = 0; i < RESULT_CALLEDUP.length; i++) {
      const playerData = { ...RESULT_CALLEDUP[i] };
      playerData.stats = {
        c1: {
          pts: 0,
          t1a: 0,
          t1i: 0,
          t2a: 0,
          t2i: 0,
          t3a: 0,
          t3i: 0,
          falt: 0,
          asis: 0,
          dreb: 0,
          oreb: 0,
          rec: 0,
          per: 0,
          min: 0,
        },
        c2: {
          pts: 0,
          t1a: 0,
          t1i: 0,
          t2a: 0,
          t2i: 0,
          t3a: 0,
          t3i: 0,
          falt: 0,
          asis: 0,
          dreb: 0,
          oreb: 0,
          rec: 0,
          per: 0,
          min: 0,
        },
        c3: {
          pts: 0,
          t1a: 0,
          t1i: 0,
          t2a: 0,
          t2i: 0,
          t3a: 0,
          t3i: 0,
          falt: 0,
          asis: 0,
          dreb: 0,
          oreb: 0,
          rec: 0,
          per: 0,
          min: 0,
        },
        c4: {
          pts: 0,
          t1a: 0,
          t1i: 0,
          t2a: 0,
          t2i: 0,
          t3a: 0,
          t3i: 0,
          falt: 0,
          asis: 0,
          dreb: 0,
          oreb: 0,
          rec: 0,
          per: 0,
          min: 0,
        },
        extra: {
          pts: 0,
          t1a: 0,
          t1i: 0,
          t2a: 0,
          t2i: 0,
          t3a: 0,
          t3i: 0,
          falt: 0,
          asis: 0,
          dreb: 0,
          oreb: 0,
          rec: 0,
          per: 0,
          min: 0,
        },
        total: {
          pts: 0,
          t1a: 0,
          t1i: 0,
          t2a: 0,
          t2i: 0,
          t3a: 0,
          t3i: 0,
          falt: 0,
          asis: 0,
          dreb: 0,
          oreb: 0,
          rec: 0,
          per: 0,
          min: 0,
        },
      };
      preBench.set(playerData.player_id, playerData);
    }

    setBench(preBench);
  };

  const mainMenu = () => {
    setTopMenu([
      {
        id: TopMenuEnums.SAVE,
        name: "Guardar",
        onPress: () => console.log("test"),
        icon: TopMenuEnums.SAVE,
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        icon: TopMenuEnums.GO_BACK,
      },
    ]);
  };

  const swapPlayers = () => {
    // toBench y toQuintet son referencias. Los datos deben manejarse de bench y quintet directamente, usando las referencias
    if (quintet.size === 0) {
      if (toQuintet.size !== 5)
        return addAlert({
          msg: "Debes seleccionar a 5 jugadores",
          lifetime: 2500,
          id: Date.now(),
        });
      // añado al quinteto los jugadores del bench usando la referencia de toQuintet
      const newQuintet = new Map(quintet);
      const newBench = new Map(bench);
      toQuintet.forEach((id) => {
        const player = bench.get(id);
        if (player) {
          newQuintet.set(id, player);
        }
      });
      setQuintet(newQuintet);
      // saco del bench a los jugadores que conforman el quinteto usando la referencia de toQuintet
      toQuintet.forEach((id) => {
        const player = bench.get(id);
        if (player) {
          newBench.delete(id);
        }
      });
      setBench(newBench);
      // vacio toQuintet
      setToQuintet(new Set());
    } else {
      if (toQuintet.size === 0 || toBench.size === 0)
        return addAlert({
          msg: "No hay ningún jugador seleccionado para cambiar",
          lifetime: 2500,
          id: Date.now(),
        });
      if (toBench.size !== toQuintet.size)
        return addAlert({
          msg: "Debes cambiar el mismo número de jugadores",
          lifetime: 2500,
          id: Date.now(),
        });

      // Copias actuales
      const nuevoBench = new Map(bench);
      const nuevoQuintet = new Map(quintet);

      // Pasar seleccionados del quinteto al banquillo
      toBench.forEach((id) => {
        const player = nuevoQuintet.get(id);
        if (player) {
          nuevoBench.set(id, player);
          nuevoQuintet.delete(id);
        }
      });
      // Pasar seleccionados del banquillo al quinteto
      toQuintet.forEach((id) => {
        const player = nuevoBench.get(id);
        if (player) {
          nuevoQuintet.set(id, player);
          nuevoBench.delete(id);
        }
      });

      // Guardo la nueva colección
      setBench(nuevoBench);
      setQuintet(nuevoQuintet);

      // Reinicio las referencias de selección
      setToBench(new Set());
      setToQuintet(new Set());
    }
  };

  const prepareToPlay = (id) => {
    const newToQuintet = new Set(toQuintet);
    if (newToQuintet.has(id)) newToQuintet.delete(id);
    else {
      if (toQuintet.size === 5)
        return addAlert({
          msg: "Ya tienes seleccionado a 5 jugadores",
          lifetime: 2500,
          id: Date.now(),
        });
      newToQuintet.add(id);
    }
    setToQuintet(newToQuintet);
  };

  const prepareToBench = (id) => {
    const newToBench = new Set(toBench);
    if (newToBench.has(id)) newToBench.delete(id);
    else {
      newToBench.add(id);
    }
    setToBench(newToBench);
  };

  return (
    <View className="flex-1 px-2 h-full w-full flex flex-col justify-center">
      <View className="w-full flex flex-row justify-between">
        <View className="w-1/2 flex flex-row justify-start items-center">
          {["c1", "c2", "c3", "c4", "extra", "total"].map((key) => (
            <TouchableOpacity
              className={`px-2 py-1 w-14 border border-danish-red ${quarter === key ? "bg-danish-red" : "bg-danish-dark-gray"}`}
              key={key}
              onPress={() => setQuarter(key)}
            >
              <Text className="text-danish-white text-center text-xs capitalize">
                {key}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
            onPress={() => setCrono(!crono)}
          >
            {crono ? (
              <MaterialCommunityIcons
                name="timer-pause-outline"
                size={13}
                color="white"
              />
            ) : (
              <MaterialCommunityIcons
                name="timer-play-outline"
                size={13}
                color="white"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
            onPress={swapPlayers}
          >
            <Entypo name="swap" size={13} color="white" />
          </TouchableOpacity>
        </View>
        <View className="w-1/2 flex flex-row justify-between">
          <View className="w-1/2 flex flex-col justify-center">
            <View className="w-full flex justify-center items-center">
              <Text className="text-danish-white text-xs text-center">
                Faltas Oponente
              </Text>
            </View>

            <View className="w-full flex flex-row justify-center items-center">
              <TouchableOpacity
                className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
                onPress={() =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: {
                      ...opponentResults[quarter],
                      falts:
                        opponentResults[quarter].falts - 1 < 0
                          ? 0
                          : opponentResults[quarter].falts - 1,
                    },
                  })
                }
              >
                <Text className="text-danish-white text-center text-xs">
                  {"<"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
                onPress={() =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: {
                      ...opponentResults[quarter],
                      falts: opponentResults[quarter].falts + 1,
                    },
                  })
                }
              >
                <Text className="text-danish-white text-center text-xs">
                  {">"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-1/2 flex flex-col">
            <Text className="text-center text-danish-white text-xs">
              Puntos Oponente
            </Text>
            <View className="w-full flex flex-row justify-end">
              <TouchableOpacity
                className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
                onPress={() =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: {
                      ...opponentResults[quarter],
                      pts: opponentResults[quarter].pts + 1,
                    },
                  })
                }
              >
                <Text className="text-danish-white text-center text-xs">
                  +1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
                onPress={() =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: {
                      ...opponentResults[quarter],
                      pts: opponentResults[quarter].pts + 2,
                    },
                  })
                }
              >
                <Text className="text-danish-white text-center text-xs">
                  +2
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
                onPress={() =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: {
                      ...opponentResults[quarter],
                      pts: opponentResults[quarter].pts + 3,
                    },
                  })
                }
              >
                <Text className="text-danish-white text-center text-xs">
                  +3
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full flex flex-row justify-end">
              <TouchableOpacity
                className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
                onPress={() =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: {
                      ...opponentResults[quarter],
                      pts:
                        opponentResults[quarter].pts - 1 < 0
                          ? 0
                          : opponentResults[quarter].pts - 1,
                    },
                  })
                }
              >
                <Text className="text-danish-white text-center text-xs">
                  -1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
                onPress={() =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: {
                      ...opponentResults[quarter],
                      pts:
                        opponentResults[quarter].pts - 2 < 0
                          ? 0
                          : opponentResults[quarter].pts - 2,
                    },
                  })
                }
              >
                <Text className="text-danish-white text-center text-xs">
                  -2
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-2 py-1 w-14 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
                onPress={() =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: {
                      ...opponentResults[quarter],
                      pts:
                        opponentResults[quarter].pts - 3 < 0
                          ? 0
                          : opponentResults[quarter].pts - 3,
                    },
                  })
                }
              >
                <Text className="text-danish-white text-center text-xs">
                  -3
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View className="w-full my-1 flex flex-row border-b border-danish-light-gray gap-1">
        <View className="w-28 px-1">
          <Text className="text-danish-white text-sm">Nº - Nombre</Text>
        </View>
        <View className="w-12 px-1">
          <Text className="text-danish-white text-sm text-center">Mins</Text>
        </View>
        <View className="w-12 px-1">
          <Text className="text-danish-white text-sm text-center">Pts</Text>
        </View>
        {["1a", "1i", "2a", "2i", "3a", "3i"].map((t) => (
          <View key={`header-t${t}`} className="w-12 px-1">
            <Text className="text-danish-white text-sm text-center">{`t${t}`}</Text>
          </View>
        ))}
        <View className="w-12 px-1">
          <Text className="text-danish-white text-sm text-center">Falt</Text>
        </View>
        <View className="w-14 px-px-1">
          <Text className="text-danish-white text-sm text-center">DReb</Text>
        </View>
        <View className="w-14 px-px-1">
          <Text className="text-danish-white text-sm text-center">OReb</Text>
        </View>
        <View className="w-12 px-px-1">
          <Text className="text-danish-white text-sm text-center">Asis</Text>
        </View>
        <View className="w-12 px-px-1">
          <Text className="text-danish-white text-sm text-center">Rec</Text>
        </View>
        <View className="w-12 px-px-1">
          <Text className="text-danish-white text-sm text-center">Per</Text>
        </View>
      </View>
      <FlatList
        data={[...quintet.values()]}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            quarter={quarter}
            crono={crono}
            isToBench={() => toBench.has(item.player_id)}
            prepareToBench={prepareToBench}
          />
        )}
        keyExtractor={(item) => item.player_id}
      />

      <FlatList
        data={[...bench.values()]}
        renderItem={({ item }) => (
          <BenchPlayer
            playerInf={item}
            isToQuintet={() => toQuintet.has(item.player_id)}
            onSelect={(playerId) => prepareToPlay(playerId)}
          />
        )}
        keyExtractor={(item) => item.player_id}
        horizontal={true}
      />
    </View>
  );
};

export default GameDetail;
