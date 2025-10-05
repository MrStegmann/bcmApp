import React, { useCallback, useEffect, useState, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useMatchStore } from "../store/MatchStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import StopwatchTimer from "react-native-animated-stopwatch-timer";
import Quintet from "./Quintet";

const VisualFalts = ({ falts }) => {
  return (
    <View className="flex flex-row gap-2">
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 0 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 1 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 2 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 3 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 4 ? "bg-danish-red" : "bg-danish-light-gray"}`}
      />
    </View>
  );
};

const Quarter = ({
  result,
  time,
  teamFalt,
  quarter,
  setTime,
  setResult,
  setTeamFalt,
}) => {
  const matchStore = useMatchStore((state) => state); // Contiene resultado total del partido y funciones para aumentar o disminuir
  const [crono, setCrono] = useState(false); // Estado auxiliar para controlar el crono.

  const stopwatchTimerRef = useRef(null); // Referencia para el Crono. Necesario para que funcione la librería correctamente

  // Control del Crono
  const play = useCallback(() => stopwatchTimerRef.current?.play(), []);
  const pause = useCallback(() => stopwatchTimerRef.current?.pause(), []);
  const getTime = useCallback(
    () => stopwatchTimerRef.current?.getSnapshot(),
    []
  );
  const handleEndedCrono = () => {
    setCrono(false);
    pause();
    setTime({ ...time, [quarter]: 0 });
  };
  const handleCrono = () => {
    if (crono) {
      setCrono(false);
      pause();
      setTime({ ...time, [quarter]: getTime() });
    } else {
      setCrono(true);
      play();
    }
  };

  // Funciones de control de puntos del Oponente
  const addOneOpponentPoint = () => {
    const newResult = { ...result };
    const prev = newResult[quarter].opponent;

    newResult[quarter].opponent = prev + 1;
    matchStore.addTo("opponent", 1); // Actualiza la puntuación global que se muestra en el header
    setResult(newResult); // Actualiza la puntuación local del parcial
  };
  const addTwoOpponentPoint = () => {
    const newResult = { ...result };
    const prev = newResult[quarter].opponent;

    newResult[quarter].opponent = prev + 2;
    matchStore.addTo("opponent", 2); // Actualiza la puntuación global que se muestra en el header
    setResult(newResult); // Actualiza la puntuación local del parcial
  };
  const addThreeOpponentPoint = () => {
    const newResult = { ...result };
    const prev = newResult[quarter].opponent;

    newResult[quarter].opponent = prev + 3;
    matchStore.addTo("opponent", 3); // Actualiza la puntuación global que se muestra en el header
    setResult(newResult); // Actualiza la puntuación local del parcial
  };
  const substractOpponentPoint = () => {
    const newResult = { ...result };
    const prev = newResult[quarter].opponent;

    newResult[quarter].opponent = prev - 1 < 0 ? 0 : prev - 1;
    matchStore.substractTo("opponent", 1); // Actualiza la puntuación global que se muestra en el header
    setResult(newResult); // Actualiza la puntuación local del parcial
  };

  // Funciones de control de faltas del Oponente
  const addOpponentFalt = () => {
    const newTeamFalt = { ...teamFalt };
    const prev = newTeamFalt[quarter].opponent;

    newTeamFalt[quarter].opponent = prev + 1;
    setTeamFalt(newTeamFalt); // Actualiza la puntuación local del parcial
  };
  const substractOpponentFalt = () => {
    const newTeamFalt = { ...teamFalt };

    const prev = newTeamFalt[quarter].opponent;

    newTeamFalt[quarter].opponent = prev - 1 < 0 ? 0 : prev - 1;

    setTeamFalt(newTeamFalt); // Actualiza la puntuación local del parcial
  };

  return (
    <View className="flex-1 h-full w-full flex flex-col justify-center items-center relative">
      {/* Controles de puntos y faltas del oponente */}
      <View className="absolute right-0 top-0 flex flex-col z-10">
        <Text className="text-danish-white text-xs text-center">Pts. Op.</Text>
        <TouchableOpacity
          className={`py-1 px-2 border border-danish-red bg-danish-dark-gray`}
          onPress={addThreeOpponentPoint}
        >
          <Text className="text-danish-white text-xs text-center capitalize">
            +3
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-1 px-2 border border-danish-red bg-danish-dark-gray`}
          onPress={addTwoOpponentPoint}
        >
          <Text className="text-danish-white text-xs text-center capitalize">
            +2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-1 px-2 border border-danish-red bg-danish-dark-gray`}
          onPress={addOneOpponentPoint}
        >
          <Text className="text-danish-white text-xs text-center capitalize">
            +1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-1 px-2 border border-danish-red bg-danish-dark-gray`}
          onPress={substractOpponentPoint}
        >
          <Text className="text-danish-white text-xs text-center capitalize">
            -1
          </Text>
        </TouchableOpacity>
        <Text className="text-danish-white text-xs text-center mt-1">
          Fal. Op.
        </Text>
        <TouchableOpacity
          className={`py-1 px-2 border border-danish-red bg-danish-dark-gray`}
          onPress={addOpponentFalt}
        >
          <Text className="text-danish-white text-xs text-center capitalize">
            +1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-1 px-2 border border-danish-red bg-danish-dark-gray`}
          onPress={substractOpponentFalt}
        >
          <Text className="text-danish-white text-xs text-center capitalize">
            -1
          </Text>
        </TouchableOpacity>
      </View>
      {/* Resultado Parcial + Crono + Faltas de Equipo  */}
      <View className="w-1/2 flex flex-row justify-between items-center mt-2">
        <VisualFalts falts={teamFalt[quarter].team} />
        <Text className="text-danish-white text-xs font-bold text-center">
          {result[quarter].team}
        </Text>
        <TouchableOpacity onPress={handleCrono}>
          <StopwatchTimer
            mode="timer"
            key={quarter}
            ref={stopwatchTimerRef}
            initialTimeInMs={time[quarter]}
            animationDelay={0}
            animationDuration={0}
            onFinish={handleEndedCrono}
            containerStyle={{
              display: "flex",
              justifyContent: "center",
            }}
            textCharStyle={{
              color: "#F8F8F8",
              fontSize: 14,
              lineHeight: 20,
            }}
          />
        </TouchableOpacity>

        <Text className="text-danish-white text-xs font-bold text-center">
          {result[quarter].opponent}
        </Text>
        <VisualFalts falts={teamFalt[quarter].opponent} />
      </View>
      <Quintet
        crono={crono}
        onSetResult={setResult}
        result={result}
        quarter={quarter}
        teamFalt={teamFalt}
        onSetTeamFalt={setTeamFalt}
      />
    </View>
  );
};

export default Quarter;
