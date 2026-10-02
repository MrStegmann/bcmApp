import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import Button from "../framework/Button";
import Input from "../framework/Input";
import { validateMatchTimestamp } from "../utils/dateValidation";

interface GameFormProps {
  gameData?: any;
  onSubmit: (game: any) => void;
  onCancel?: () => void;
}

const GameForm: React.FC<GameFormProps> = ({ gameData, onSubmit, onCancel }) => {
  const [rivalTeamName, setRivalTeamName] = useState("");
  const [wrongRivalTeamName, setWrongRivalTeamName] = useState("");
  const [round, setRound] = useState("");
  const [wrongRound, setWrongRound] = useState("");
  const [timeStamp, setTimeStamp] = useState("");
  const [wrongTimeStamp, setWrongTimeStamp] = useState("");

  const club = useClubStore((state) => state.club);

  useEffect(() => {
    if (gameData) {
      setRivalTeamName(gameData.rivalTeamName || gameData.opponent || "");
      setRound(gameData.round ? String(gameData.round) : "");
      setTimeStamp(gameData.timeStamp || gameData.date || "");
    }
  }, [gameData]);

  useEffect(() => {
    if (rivalTeamName.trim() !== "") setWrongRivalTeamName("");
  }, [rivalTeamName]);

  useEffect(() => {
    if (round.trim() !== "") setWrongRound("");
  }, [round]);

  useEffect(() => {
    if (timeStamp.trim() !== "") setWrongTimeStamp("");
  }, [timeStamp]);

  const handleSubmit = () => {
    let hasError = false;

    if (!rivalTeamName || !rivalTeamName.trim()) {
      setWrongRivalTeamName("Debe introducir el nombre del equipo contrincante");
      hasError = true;
    }

    if (!round || !round.trim()) {
      setWrongRound("Debe introducir la jornada del partido");
      hasError = true;
    }

    const timeValidation = validateMatchTimestamp(timeStamp);
    if (!timeValidation.isValid) {
      setWrongTimeStamp(timeValidation.error || "Debe introducir la fecha del partido");
      hasError = true;
    }

    if (hasError) return;

    const game = {
      id: gameData?.id,
      teamId: club?.id || 1,
      rivalTeamName: rivalTeamName.trim(),
      opponent: rivalTeamName.trim(),
      round: round.trim(),
      timeStamp: timeStamp.trim(),
      date: timeStamp.trim(),
    };

    onSubmit(game);
  };

  return (
    <View className="w-full px-5 py-4 flex flex-col justify-start">
      <Input
        label="Equipo Contrario"
        placeholder="Equipo contrario"
        value={rivalTeamName}
        onChange={setRivalTeamName}
        wrongMsg={wrongRivalTeamName}
      />

      <View className="flex flex-col w-full gap-2 my-2">
        <Input
          label="Jornada"
          placeholder="Jornada"
          value={round}
          onChange={setRound}
          wrongMsg={wrongRound}
        />

        <Input
          label="Fecha y Hora"
          placeholder="dd/mm/aaaa - hh:mm"
          value={timeStamp}
          onChange={setTimeStamp}
          wrongMsg={wrongTimeStamp}
        />
      </View>

      <View className="w-full flex flex-col gap-2 mt-4">
        <Button
          title={gameData ? "Guardar" : "Añadir Partido"}
          onPress={handleSubmit}
        />
        {onCancel ? (
          <Button
            title="Cancelar"
            className="bg-gray-700"
            onPress={onCancel}
          />
        ) : null}
      </View>
    </View>
  );
};

export default GameForm;
