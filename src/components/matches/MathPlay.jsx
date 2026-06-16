import React, { useEffect, useCallback, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native-web";
import {
  useBenchAndQuintetStore,
  useCronoStore,
  useMarketStore,
  useMatchStore,
  usePlayPlayersStore,
} from "../../store/MatchStore";
import { errorAlert } from "../../helpers/AlertHelper";
import { useTeamStore } from "../../store/TeamStore";
import Entypo from "@expo/vector-icons/Entypo";
import QuarterResultsAndFoults from "./QuarterResultsAndFoults";
import TotalResult from "./TotalResult";
import QuarterAndCronoControls from "./QuarterAndCronoControls";
import BenchAndQuintet from "./BenchAndQuintet";
import Swapping from "./Swapping";
import PlayerOptions from "./PlayerOptions";
import RivalOptions from "./RivalOptions";
import { useNavigation } from "@react-navigation/native";
import { useLocalStore } from "../../store/LocalStore";
import StorageEnums from "../../Enums/StorageEnums";

const partials = ["c1", "c2", "c3", "c4", "extra"];

const MathPlay = React.memo(({ route }) => {
  const { onGoBack, match } = route.params;
  const navigation = useNavigation();

  const getData = useLocalStore((state) => state.getData);
  const removeData = useLocalStore((state) => state.removeData);

  const saveMatch = useMatchStore((state) => state.saveMatch);
  const saveQuarters = useMatchStore((state) => state.saveQuarters);
  const saveStats = useMatchStore((state) => state.saveStats);
  const fetchRoasterByMatch = usePlayPlayersStore(
    (state) => state.fetchRoasterByMatch,
  );
  const setBench = useBenchAndQuintetStore((state) => state.setBench);
  const setToBench = useBenchAndQuintetStore((state) => state.setToBench);
  const quintet = useBenchAndQuintetStore((state) => state.quintet);
  const setQuintet = useBenchAndQuintetStore((state) => state.setQuintet);
  const setToQuintet = useBenchAndQuintetStore((state) => state.setToQuintet);
  const setUsePreQuintet = useBenchAndQuintetStore(
    (state) => state.setUsePreQuintet,
  );
  const resetBenchAndQuintet = useBenchAndQuintetStore((state) => state.reset);
  const resetPlayers = usePlayPlayersStore((state) => state.reset);
  const resetCrono = useCronoStore((state) => state.reset);
  const resetMarket = useMarketStore((state) => state.reset);

  const team = useTeamStore((state) => state.team);

  const rivalPoints = useMarketStore((state) => state.rivalPoints);
  const teamPoints = useMarketStore((state) => state.teamPoints);
  const rivalFoults = useMarketStore((state) => state.rivalFoults);
  const teamFoults = useMarketStore((state) => state.teamFoults);
  const players = usePlayPlayersStore((state) => state.players);
  const quarter = useCronoStore((state) => state.quarter);

  const [isSwapping, setSwapping] = useState(false);
  const [playerSelected, setPlayerSelected] = useState(-1);

  useEffect(() => {
    const loadRoaster = async () => {
      try {
        const result = await fetchRoasterByMatch(match.id);
        prepareBench(result);
      } catch (error) {
        errorAlert(error.message);
      }
    };

    loadRoaster();
  }, []);

  const prepareBench = async (pls) => {
    const playersId = Object.keys(pls);
    if (playersId.length === 0)
      throw new Error("No hay jugadores para este partido");

    try {
      const configQuintets = await getData(StorageEnums.QUINTET_STORAGE);
      if (configQuintets) {
        Alert.alert(
          "Quinteto Preestablecido",
          "Hay una configuración de quintetos guardados. ¿Quieres usarlo?",
          [
            {
              text: "Cancelar",
              onPress: () => handleSetBench(quintet, playersId),
              style: "cancel",
            },
            {
              text: "Aceptar",
              onPress: () => {
                setUsePreQuintet(true);
                setQuintet(configQuintets[quarter]);
                handleSetBench(configQuintets[quarter], playersId);
              },
            },
          ],
          { cancelable: true },
        );
      }
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const handleSetBench = (quintet, playersId) => {
    setBench([...playersId.filter((x) => !new Set(quintet).has(x))]);
    setToBench([]);
    setToQuintet([]);
  };

  const handleSaveMatch = async () => {
    try {
      await saveMatch({ ...match, played: true });

      const quarters = [];

      for (const q of partials) {
        quarters.push({
          game: { id: match.id },
          quarter: q,
          teamResult: teamPoints[q],
          rivalResult: rivalPoints[q],
          teamFoult: teamFoults[q],
          rivalFoult: rivalFoults[q],
        });
      }

      await saveQuarters(quarters);

      const playerStats = [];
      for (const pl of Object.values(players)) {
        playerStats.push({
          game: { id: match.id },
          player: { id: pl.id },
          ...pl.stats,
        });
      }

      await saveStats(playerStats);

      resetBenchAndQuintet();
      resetPlayers();
      resetCrono();
      resetMarket();
      removeData(StorageEnums.QUINTET_STORAGE);

      navigation.goBack();
      onGoBack();
    } catch (error) {
      errorAlert(error.message);
    }
  };

  return (
    <View className="w-full flex-1 flex flex-col items-center">
      <TouchableOpacity
        className="mt-3 border rounded-lg p-2"
        onPress={handleSaveMatch}
      >
        <Entypo name="save" size={18} color="black" />
      </TouchableOpacity>
      {/* Componente para mostrar el resultado total del partido */}
      <TotalResult teamName={team.name} rivalName={match.rival} />

      {/* Componente para mostrar stats por cuarto- Faltas y resultados */}
      <QuarterResultsAndFoults />

      {/* Componente para controlar el crono y los cuartos */}
      <QuarterAndCronoControls />

      {/*Opciones, Stats, Cambios actuales (izquierda); y puntos y faltas rival (derecha) */}
      <View className="w-full flex-1 flex flex-row justify-between items-center mt-5 px-3">
        <View className="w-2/3 flex h-full px-2">
          {isSwapping ? (
            <Swapping />
          ) : (
            <View className="w-full h-full flex flex-col">
              <PlayerOptions playerSelected={playerSelected} />
            </View>
          )}
        </View>
        <RivalOptions />
      </View>
      {/* Banquillo y quintento */}
      <BenchAndQuintet
        setSwapping={setSwapping}
        isSwapping={isSwapping}
        playerSelected={playerSelected}
        setPlayerSelected={setPlayerSelected}
      />
    </View>
  );
});

export default MathPlay;
