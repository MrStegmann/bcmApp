import React, { useCallback, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import { useMatchPlayerStore, useMatchStore } from "../store/MatchStore";
import QuintetPlayer from "./QuintetPlayer";
import { useAlertStore } from "../store/AlertStore";
import { Entypo } from "@expo/vector-icons";
import useDB from "../hooks/useDB";

const playerStats = {
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
};
const SHOTS_KEY = ["1a", "1i", "2a", "2i", "3a", "3i"];

const BenchPlayer = React.memo(({ playerInf, isInToQuintet, onSelect }) => {
  return (
    <TouchableOpacity
      className={`border rounded-lg w-22 py-1 px-2 ${isInToQuintet() ? "border-danish-gold" : "border-danish-red"}`}
      onPress={() => onSelect(playerInf.id)}
    >
      <Text className="text-danish-white text-center text-xs">
        {`${playerInf.number} - ${playerInf.first_name}`}
      </Text>
    </TouchableOpacity>
  );
});

const Quintet = React.memo(({ quarter }) => {
  const { GameController } = useDB();
  const matchStore = useMatchStore((state) => state); // Contiene resultado total del partido y funciones para aumentar o disminuir
  const matchPlayers = useMatchPlayerStore((state) => state); // Contiene toda la información de los jugadores convocados. Se encargará de gestionar sus estadisticas para posterior guardado
  const addAlert = useAlertStore((state) => state.addAlert); // Gestión de avisos y alertas

  const [quintet, setQuintet] = useState(new Set()); // Compone a los jugadores que están en el quinteto. Solo almacena el id del jugador que está jugando.
  const [bench, setBench] = useState(new Set()); // Compone todos los jugadores que están en el banquillo. Solo almacena el id del jugador
  const [toBench, setToBench] = useState(new Set()); // Son los jugadores que ESTÁN JUGANDO y van a ser sentados. Solo contiene IDs
  const [toQuintet, setToQuintet] = useState(new Set()); // Son los jugadores que NO están jugando y van a salir. Solo contiene IDs

  useEffect(() => {
    // Obtengo la lista de jugadores convocados para este partido
    getRoaster();
  }, [matchStore.gameId]);

  const getRoaster = async () => {
    const RESULT_CALLEDUP = await GameController.loadCalledup(
      matchStore.gameId
    );

    // Crear objeto de jugadores con sus nombres, numeros, id y añadir stats y propiedad booleana de bench, para que el componente sepa si está jugando o no.
    const players = {};
    for (const player of RESULT_CALLEDUP) {
      const { called, ...rest } = player;
      const playerData = { stats: { ...playerStats }, ...rest };
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

  const handleSetToQuintet = useCallback(
    (playerId) => {
      const newToQuintet = new Set(toQuintet);
      // Comprobamos si el jugador seleccionado ya está listo. Si lo está lo eliminamos.

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
    },
    [toQuintet]
  );

  const handleSetToBench = (playerId) => {
    const newToBench = new Set(toBench);
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
  };

  const handleSetQuintet = useCallback(() => {
    if (quintet.size === 0) {
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
  }, [bench, toQuintet, quintet, toBench]);

  const actualBench = [...bench.values()];
  const actualQuintet = [...quintet.values()];

  return (
    <View className="flex-1 h-full w-full flex flex-col justify-start items-start mt-3 relative">
      <View
        className="w-full px-5 flex justify-start absolute"
        style={{ top: -30 }}
      >
        <TouchableOpacity
          className="px-2 w-10 border border-danish-red bg-danish-dark-gray flex items-center justify-center"
          onPress={handleSetQuintet}
        >
          <Entypo name="swap" size={13} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-[94%] mt-1 flex flex-row border-b border-danish-light-gray gap-1">
        <View className="w-28 px-1">
          <Text className="text-danish-white text-sm">Nº - Nombre</Text>
        </View>
        <View className="w-12 px-1">
          <Text className="text-danish-white text-sm text-center">Mins</Text>
        </View>
        <View className="w-12 px-1">
          <Text className="text-danish-white text-sm text-center">Pts</Text>
        </View>
        {SHOTS_KEY.map((t) => (
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
      <View className="w-[94%] my-1 flex flex-col">
        {actualQuintet.map((id) => (
          <QuintetPlayer
            key={id}
            playerId={id}
            isInToBench={() => toBench.has(id)}
            setToBench={handleSetToBench}
            quarter={quarter}
          />
        ))}
      </View>
      <View className="w-[94%] my-1 flex flex-row">
        <FlatList
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
});

export default Quintet;
