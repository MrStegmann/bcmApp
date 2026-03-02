import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import {
  usePlayPlayersStore,
  useBenchAndQuintetStore,
  useCronoStore,
} from "../../store/MatchStore";
import { errorAlert, infoAlert } from "../../helpers/AlertHelper";

import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalStore } from "../../store/LocalStore";
import StorageEnums from "../../Enums/StorageEnums";

const BenchAndQuintet = React.memo(
  ({ isSwapping, setSwapping, playerSelected, setPlayerSelected }) => {
    const players = usePlayPlayersStore((state) => state.players);

    const bench = useBenchAndQuintetStore((state) => state.bench);
    const setBench = useBenchAndQuintetStore((state) => state.setBench);

    const toBench = useBenchAndQuintetStore((state) => state.toBench);
    const setToBench = useBenchAndQuintetStore((state) => state.setToBench);

    const quintet = useBenchAndQuintetStore((state) => state.quintet);
    const setQuintet = useBenchAndQuintetStore((state) => state.setQuintet);

    const toQuintet = useBenchAndQuintetStore((state) => state.toQuintet);
    const setToQuintet = useBenchAndQuintetStore((state) => state.setToQuintet);

    const usePreQuintet = useBenchAndQuintetStore(
      (state) => state.usePreQuintet,
    );
    const getData = useLocalStore((state) => state.getData);

    const quarter = useCronoStore((state) => state.quarter);

    useEffect(() => {
      loadSavedQuintet(quarter);
    }, [quarter]);

    const loadSavedQuintet = async (quarter) => {
      if (usePreQuintet) {
        try {
          const configQuintets = await getData(StorageEnums.QUINTET_STORAGE);
          if (configQuintets) {
            setQuintet(configQuintets[quarter]);
            const playersId = Object.keys(players);
            if (playersId.length === 0)
              throw new Error("No hay jugadores para este partido");
            setBench([
              ...playersId.filter(
                (x) => !new Set(configQuintets[quarter]).has(x),
              ),
            ]);
          }
        } catch (error) {
          errorAlert(error.message);
        }
      }
    };

    // Control de cambios
    const SwappControl = useCallback(() => {
      if (!isSwapping) return setSwapping(true);
      if (isSwapping && toBench.length === 0 && toQuintet.length === 0)
        return setSwapping(false);

      // Añadir jugadores iniciales
      if (quintet.length === 0) {
        if (toQuintet.length !== 5)
          return infoAlert("Debes seleccionar 5 jugadores iniciales");
        SwappBetweenBenchAndQuintet();
        return setSwapping(false);
      }

      // Cambio de jugadores
      if (toBench.length !== toQuintet.length)
        return infoAlert("Debes cambiar al mismo número de jugadores");
      SwappBetweenBenchAndQuintet();
      return setSwapping(false);
    }, [quintet, bench, toQuintet, toBench, isSwapping]);

    const resetQuintetAndBench = () => {
      const playersId = Object.keys(players);
      if (playersId.length === 0)
        throw new Error("No hay jugadores para este partido");
      setBench([...playersId]);
      setQuintet([]);
      setToBench([]);
      setToQuintet([]);
    };

    const SwappBetweenBenchAndQuintet = useCallback(() => {
      /// Primero quito del quinteto los jugadores que van al banquillo, después añado los jugadores preparados para jugar al quinteto
      const newQuintet = [
        ...quintet.filter((x) => !new Set(toBench).has(x)),
        ...toQuintet,
      ];

      // Primero quito del banquillo los jugadores que entran a jugar, después añado los jugadores que se van a sentar
      const newBench = [
        ...bench.filter((x) => !new Set(toQuintet).has(x)),
        ...toBench,
      ];

      // Aplico los cambios del quinteto y el banquillo
      setQuintet(newQuintet);
      setBench(newBench);

      // Vacio los states preparatorios
      setToQuintet([]);
      setToBench([]);
    }, [bench, toQuintet, quintet, toBench]);

    // Prepara los jugadores para jugar
    const preparePlayersToQuintet = (playerId) => {
      const idx = toQuintet.indexOf(playerId);
      let newToQuintet;
      if (idx !== -1) {
        newToQuintet = [...toQuintet.filter((pid) => pid !== playerId)];
      } else {
        newToQuintet = [...toQuintet, playerId];
      }
      if (newToQuintet.length > 5)
        return infoAlert("No puedes añadir más de 5 jugadores al quinteto");
      setToQuintet(newToQuintet);
    };

    // Prepara los jugadores para sentarse
    const preparePlayersToBench = (playerId) => {
      const idx = toBench.indexOf(playerId);
      let newToBench;
      if (idx !== -1) {
        newToBench = [...toBench.filter((pid) => pid !== playerId)];
      } else {
        newToBench = [...toBench, playerId];
      }
      setToBench(newToBench);
    };

    const isSelectedInBench = (id) => {
      if (isSwapping) return toQuintet.includes(id);
      return playerSelected === id;
    };

    const isSelectedInQuintet = (id) => {
      if (isSwapping) return toBench.includes(id);

      return playerSelected === id;
    };
    return (
      <View className="w-full flex-col items-center pb-5 p-2">
        <View className="w-full flex flex-row justify-center">
          <TouchableOpacity
            className={`p-1 w-7 h-7 rounded-lg border ${isSwapping ? "border-danish-red" : "border-black"} flex items-center justify-center mb-1`}
            onPress={SwappControl}
          >
            <Entypo name="swap" size={11} color="black" />
          </TouchableOpacity>
          <View className="p-3" />
          <TouchableOpacity
            className={`p-1 w-7 h-7 rounded-lg border flex items-center justify-center mb-1`}
            onPress={resetQuintetAndBench}
          >
            <MaterialCommunityIcons name="reload" size={11} color="black" />
          </TouchableOpacity>
        </View>
        <View className="w-full flex-col">
          {/* Quinteto */}
          <View className="flex-row gap-2 mb-1 items-center justify-center">
            <Text className="text-center">Q</Text>
            <FlatList
              contentContainerStyle={{ gap: 5 }}
              scrollEnabled={false}
              horizontal
              data={quintet}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item}
                  className={`border rounded-lg w-7 h-7 p-1 ${isSelectedInQuintet(item) ? "border-danish-gold" : "border-danish-red"} flex justify-center items-center`}
                  onPress={() =>
                    isSwapping
                      ? preparePlayersToBench(item)
                      : setPlayerSelected((bef) => (bef === item ? -1 : item))
                  }
                >
                  <Text className="text-center text-xs">{`${players[item].number}`}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>

          <View className="border-y p-0.5 my-1 border-gray-300" />
          {/* Banquillo */}
          <View className="flex-row gap-2 mt-1 items-center justify-center">
            <Text className="text-center">B</Text>

            <FlatList
              contentContainerStyle={{ gap: 5 }}
              scrollEnabled={false}
              horizontal
              data={bench}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item}
                  className={`border rounded-lg w-7 h-7 p-1 ${isSelectedInBench(item) ? "border-danish-gold" : "border-danish-red"} flex justify-center items-center`}
                  onPress={() =>
                    isSwapping
                      ? preparePlayersToQuintet(item)
                      : setPlayerSelected((bef) => (bef === item ? -1 : item))
                  }
                >
                  <Text className="text-center text-xs">{`${players[item].number}`}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </View>
    );
  },
);

export default BenchAndQuintet;
