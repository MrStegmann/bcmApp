import React, { useEffect, useCallback, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  useBenchAndQuintetStore,
  useCronoStore,
  useMarketStore,
  usePlayPlayersStore,
} from "../../store/MatchStore";
import { timeFormat } from "../../helpers/timeFormat";
import { infoAlert } from "../../helpers/AlertHelper";

const quarters = ["c1", "c2", "c3", "c4", "extra"];

const Quarter = React.memo(({ q }) => {
  const quarter = useMarketStore((state) => state.quarter);
  const setMarketQuarter = useMarketStore((state) => state.setQuarter);
  const setCronoQuarter = useCronoStore((state) => state.setQuarter);

  const handleSetQuarter = (quarter) => {
    setMarketQuarter(quarter);
    setCronoQuarter(quarter);
  };
  return (
    <TouchableOpacity
      key={q}
      onPress={() => handleSetQuarter(q)}
      className={`px-2 py-1 border ${quarter === q ? "border-blue-600" : "border-black"}`}
    >
      <Text className="text-sm capitalize">{q}</Text>
    </TouchableOpacity>
  );
});

const Crono = React.memo(() => {
  const crono = useCronoStore((state) => state).getCrono(); // Optiene el contador regresivo del crono en milisegundos
  const setCrono = useCronoStore((state) => state.setCrono); // Actualizado el estado del crono en milisegundos.
  const isRunning = useCronoStore((state) => state.isRunning); // Indica si está o no en marcha el crono
  const setRunning = useCronoStore((state) => state.setRunning); // Obtiene el estado del crono
  const quintet = useBenchAndQuintetStore((state) => state.quintet);
  const setPlayersTime = usePlayPlayersStore((state) => state.setPlayersTime);

  const cronoInterval = useRef(null);
  const [timeLeft, setTimeLeft] = useState(crono);
  const [lastTimeStarted, setLastTimeStarted] = useState(0);
  useEffect(() => {
    if (isRunning) {
      setLastTimeStarted(timeLeft);
      cronoInterval.current = setInterval(() => {
        setTimeLeft((bef) => bef - 100);
      }, 100);
    } else {
      if (cronoInterval.current) {
        clearInterval(cronoInterval.current);
        cronoInterval.current = null;

        const now = timeLeft;
        const elapsed = lastTimeStarted - now;

        setPlayersTime(quintet, elapsed);

        setCrono(timeLeft);
      }
    }
    return () => clearInterval(cronoInterval.current);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(cronoInterval.current);
      cronoInterval.current = null;
      setRunning(false);
      const now = timeLeft;
      const elapsed = lastTimeStarted - now;

      setPlayersTime(quintet, elapsed);

      setCrono(0);
    }
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(crono);
  }, [crono]);

  const handlePlayOrStop = () => {
    if (quintet.length === 0)
      return infoAlert("No tienes ningún jugador en el quinteto");
    setRunning(!isRunning);
  };

  return (
    <TouchableOpacity
      onPress={handlePlayOrStop}
      className={`px-2 py-1 border ${isRunning ? "border-blue-500" : "border-black"} rounded-3xl flex justify-center items-center`}
    >
      <Text>{`${timeFormat(timeLeft)}`}</Text>
    </TouchableOpacity>
  );
});

const QuarterAndCronoControls = React.memo(() => {
  return (
    <View className="flex flex-col justify-center items-center">
      <View className="flex flex-row">
        {quarters.map((q) => (
          <Quarter key={q} q={q} />
        ))}
      </View>
      <View className="mt-2">
        <Crono />
      </View>
    </View>
  );
});

export default QuarterAndCronoControls;
