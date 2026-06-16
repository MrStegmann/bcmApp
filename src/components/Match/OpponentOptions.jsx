import React, { useCallback, useEffect, useState, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import { useMatchStore } from "../../store/MatchStore";

const OpponentOptions = ({
  opponentResult,
  setOpponentResult,
  opponentFalts,
  setOpponentFalts,
  quarter,
}) => {
  const matchStore = useMatchStore((state) => state); // Contiene resultado total del partido y funciones para aumentar o disminuir

  // Funciones de control de puntos del Oponente
  const addOneOpponentPoint = () => {
    const newResult = { ...opponentResult };
    const prev = newResult[quarter];

    newResult[quarter] = prev + 1;
    matchStore.addTo("opponent", 1); // Actualiza la puntuación global que se muestra en el header
    setOpponentResult(newResult); // Actualiza la puntuación local del parcial
  };
  const addTwoOpponentPoint = () => {
    const newResult = { ...opponentResult };
    const prev = newResult[quarter];

    newResult[quarter] = prev + 2;
    matchStore.addTo("opponent", 2); // Actualiza la puntuación global que se muestra en el header
    setOpponentResult(newResult); // Actualiza la puntuación local del parcial
  };
  const addThreeOpponentPoint = () => {
    const newResult = { ...opponentResult };
    const prev = newResult[quarter];

    newResult[quarter] = prev + 3;
    matchStore.addTo("opponent", 3); // Actualiza la puntuación global que se muestra en el header
    setOpponentResult(newResult); // Actualiza la puntuación local del parcial
  };
  const substractOpponentPoint = () => {
    const newResult = { ...opponentResult };
    const prev = newResult[quarter];

    newResult[quarter] = prev - 1 < 0 ? 0 : prev - 1;
    matchStore.substractTo("opponent", 1); // Actualiza la puntuación global que se muestra en el header
    setOpponentResult(newResult); // Actualiza la puntuación local del parcial
  };

  // Funciones de control de faltas del Oponente
  const addOpponentFalt = () => {
    const newTeamFalt = { ...opponentFalts };
    const prev = newTeamFalt[quarter];

    newTeamFalt[quarter] = prev + 1;
    setOpponentFalts(newTeamFalt); // Actualiza la puntuación local del parcial
  };
  const substractOpponentFalt = () => {
    const newTeamFalt = { ...opponentFalts };

    const prev = newTeamFalt[quarter];

    newTeamFalt[quarter] = prev - 1 < 0 ? 0 : prev - 1;

    setOpponentFalts(newTeamFalt); // Actualiza la puntuación local del parcial
  };
  return (
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
  );
};

export default OpponentOptions;
