import React, { useCallback, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import { useMatchPlayerStore, useMatchStore } from "../../store/MatchStore";
import { useAlertStore } from "../../store/AlertStore";
import { Entypo } from "@expo/vector-icons";
import useDB from "../../hooks/useDB";
import Changes from "./Changes";
import PlayerInfo from "./PlayerInfo";
import BenchPlayer from "./BenchPlayer";
import QuintetPlayers from "./QuintetPlayers";
import PlayerOptions from "./PlayerOptions";

const playerStats = () => ({
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
  minutes: 0,
});

const Quintet = React.memo(
  ({ quarter, time, lastTimeLeft, setLastTimeLeft }) => {
    const { GameController } = useDB();
    const matchStore = useMatchStore((state) => state); // Contiene resultado total del partido y funciones para aumentar o disminuir
    const matchPlayers = useMatchPlayerStore((state) => state); // Contiene toda la información de los jugadores convocados. Se encargará de gestionar sus estadisticas para posterior guardado
    const players = useMatchPlayerStore((state) => state.players);

    const addAlert = useAlertStore((state) => state.addAlert); // Gestión de avisos y alertas

    const [quintet, setQuintet] = useState(new Set()); // Compone a los jugadores que están en el quinteto. Solo almacena el id del jugador que está jugando.
    const [bench, setBench] = useState(new Set()); // Compone todos los jugadores que están en el banquillo. Solo almacena el id del jugador
    const [toBench, setToBench] = useState(new Set()); // Son los jugadores que ESTÁN JUGANDO y van a ser sentados. Solo contiene IDs
    const [toQuintet, setToQuintet] = useState(new Set()); // Son los jugadores que NO están jugando y van a salir. Solo contiene IDs
    const [prepareSwap, setPrepareSwap] = useState(false); // Indica si se está preparando un cambio de jugadores entre quinteto y banquillo

    useEffect(() => {
      // Obtengo la lista de jugadores convocados para este partido
      getRoaster();
    }, [matchStore.gameId]);

    useEffect(() => {
      // Obtengo la información de los jugadores que están JUGANDO
      const playerIds = [...quintet.values()];
      const newplayers = { ...players };

      // Actualizo los minutos jugados de los jugadores que están en el quinteto
      for (const id of playerIds) {
        const prevMinutes = newplayers[id].stats.minutes || 0;
        const additionalMinutes = lastTimeLeft - time[quarter];
        newplayers[id].stats.minutes = prevMinutes + additionalMinutes;
      }

      matchPlayers.setPlayers(newplayers);

      setLastTimeLeft(time[quarter]);
    }, [time]);

    const getRoaster = async () => {
      const RESULT_CALLEDUP = await GameController.loadCalledup(
        matchStore.gameId
      );

      // Crear objeto de jugadores con sus nombres, numeros, id y añadir stats
      const players = {};
      for (const player of RESULT_CALLEDUP) {
        const { called, ...rest } = player;
        const playerData = { stats: playerStats(), ...rest };
        players[playerData.player_id] = playerData;
      }

      matchPlayers.setPlayers(players);
      handleSetBench(players);
    };

    const handleSetBench = (players) => {
      const newBench = new Set();
      Object.keys(players).forEach((id) => {
        newBench.add(Number(id));
      });

      setBench(newBench);
    };

    const handleSetToQuintet = (playerId) => {
      const newToQuintet = new Set(toQuintet);
      // Comprobamos si el jugador seleccionado ya está listo. Si lo está lo eliminamos.
      if (prepareSwap) {
        if (newToQuintet.has(playerId)) newToQuintet.delete(playerId);
        else {
          // Comprobamos el tamaño de los que van a salir a jugar.
          if (newToQuintet.size === 5)
            return addAlert({
              msg: "Ya tienes seleccionado a 5 jugadores",
              lifetime: 2500,
              id: Date.now(),
            });
          newToQuintet.add(playerId);
        }
        setToQuintet(newToQuintet);
      } else {
        const newToBench = new Set(toBench);
        newToBench.clear();
        if (newToQuintet.has(playerId)) newToQuintet.delete(playerId);
        else {
          newToQuintet.clear();
          newToQuintet.add(playerId);
        }
        setToBench(newToBench);
        setToQuintet(newToQuintet);
      }
    };

    const handleSetToBench = (playerId) => {
      const newToBench = new Set(toBench);
      if (prepareSwap) {
        if (newToBench.has(playerId)) newToBench.delete(playerId);
        else {
          if (newToBench.size === 5)
            return addAlert({
              msg: "Ya tienes seleccionado a 5 jugadores",
              lifetime: 2500,
              id: Date.now(),
            });
          newToBench.add(playerId);
        }
        setToBench(newToBench);
      } else {
        const newToQuintet = new Set(toQuintet);
        newToQuintet.clear();
        if (newToBench.has(playerId)) newToBench.delete(playerId);
        else {
          newToBench.clear();
          newToBench.add(playerId);
        }
        setToBench(newToBench);
        setToQuintet(newToQuintet);
      }
    };

    const handleSetQuintet = useCallback(() => {
      if (prepareSwap) {
        if (quintet.size === 0) {
          if (toQuintet.size !== 5)
            return addAlert({
              msg: "Debes sacar a 5 jugadores para el quinteto",
              lifetime: 2500,
              id: Date.now(),
            });
          const newBench = new Set(bench);

          // Quito del banquillo a los jugadores que entran
          for (const id of toQuintet) {
            if (newBench.has(id)) newBench.delete(id);
          }
          setQuintet(new Set(toQuintet));
          setBench(newBench);
          setToQuintet(new Set());
        } else {
          if (toQuintet.size === 0 && toBench.size === 0) {
            return addAlert({
              msg: "No hay ningún jugador seleccionado para cambiar",
              lifetime: 2500,
              id: Date.now(),
            });
          }
          if (toBench.size !== toQuintet.size) {
            return addAlert({
              msg: "Debes cambiar el mismo número de jugadores",
              lifetime: 2500,
              id: Date.now(),
            });
          }
          // Copias actuales
          const newBench = new Set(bench);
          const newQuintet = new Set(quintet);

          // Quitamos del quinteto los jugadores que se van a sentar y los añadimos al banquillo
          for (const id of toBench) {
            if (newQuintet.has(id)) {
              newQuintet.delete(id);
              newBench.add(id);
            }
          }

          // Quitamos del banquillo los jugadores que salen y los añadimos al quinteto
          for (const id of toQuintet) {
            if (newBench.has(id)) {
              newBench.delete(id);
              newQuintet.add(id);
            }
          }

          // Guardo la nueva colección
          setBench(newBench);
          setQuintet(newQuintet);

          // Reinicio las referencias de selección
          setToBench(new Set());
          setToQuintet(new Set());
        }
        setPrepareSwap(false);
      } else {
        setPrepareSwap(true);
      }
    }, [bench, toQuintet, quintet, toBench]);

    const actualBench = [...bench.values()];
    const actualQuintet = [...quintet.values()];

    return (
      <View className="flex-1 h-full w-full flex flex-col justify-start items-start mt-2 relative">
        <View className="flex flex-row jsutify-between w-full flex-1">
          <View className="flex flex-col mt-1">
            <TouchableOpacity
              className={`px-2 w-8 h-8 rounded-lg border ${prepareSwap ? "border-danish-gold" : "border-danish-red"} bg-danish-dark-gray flex items-center justify-center mb-2`}
              onPress={handleSetQuintet}
            >
              <Entypo name="swap" size={13} color="white" />
            </TouchableOpacity>
            <FlatList
              data={actualQuintet}
              renderItem={({ item }) => (
                <QuintetPlayers
                  playerInf={matchPlayers.players[item]}
                  inInToBench={() => toBench.has(Number(item))}
                  onSelect={handleSetToBench}
                />
              )}
              keyExtractor={(item) => item}
            />
          </View>
          <View className="flex flex-col justify-center items-center w-2/5">
            {!prepareSwap && (toBench.size <= 1 || toQuintet.size <= 1) && (
              <PlayerInfo
                {...players[
                  toBench.size === 1 ? [...toBench][0] : [...toQuintet][0]
                ]}
              />
            )}
            {prepareSwap && (
              <Changes
                toBench={toBench}
                toQuintet={toQuintet}
                matchPlayers={matchPlayers}
              />
            )}
          </View>
          <View className="flex flex-col justify-center items-center w-1/2">
            <PlayerOptions toBench={toBench} quarter={quarter} />
          </View>
        </View>

        <Text className="text-danish-white font-bold text-sm mt-1">
          Banquillo
        </Text>
        <View className="w-full flex flex-row">
          <FlatList
            style={{ gap: 10 }}
            data={actualBench}
            renderItem={({ item }) => (
              <BenchPlayer
                playerInf={matchPlayers.players[item]}
                isInToQuintet={() => toQuintet.has(Number(item))}
                onSelect={handleSetToQuintet}
              />
            )}
            keyExtractor={(item) => item}
            horizontal={true}
          />
        </View>
      </View>
    );
  }
);

export default Quintet;
