import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import Input from "../framework/Input";
import Button from "../framework/Button";

interface PlayerFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  playerData?: any;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmit, onCancel, playerData }) => {
  const club = useClubStore((state) => state.club);
  const [firstName, setFirstName] = useState("");
  const [wrongFirstName, setWrongFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [wrongLastName, setWrongLastName] = useState("");
  const [number, setNumber] = useState("");
  const [wrongNumber, setWrongNumber] = useState("");

  useEffect(() => {
    if (playerData) {
      setFirstName(playerData.firstName || playerData.first_name || "");
      setLastName(playerData.lastName || playerData.last_name || "");
      setNumber(playerData.number ? String(playerData.number) : "");
    }
  }, [playerData]);

  useEffect(() => {
    setWrongFirstName("");
  }, [firstName]);
  useEffect(() => {
    setWrongLastName("");
  }, [lastName]);
  useEffect(() => {
    setWrongNumber("");
  }, [number]);

  const handleSubmit = () => {
    if (firstName === "") setWrongFirstName("Debes introducir un nombre.");
    if (lastName === "") setWrongLastName("Debes introducir un apellido.");
    if (number === "") setWrongNumber("Debes introducir un número.");
    if ([firstName, lastName, number].includes("")) return;
    if (isNaN(Number(number))) return setWrongNumber("Debes introducir un número.");

    onSubmit({
      teamId: club?.id || 1,
      firstName,
      lastName,
      number,
      id: playerData?.id,
    });
  };

  return (
    <View className="w-full px-5 flex-1 gap-5">
      <Input
        placeholder="Nombre del Jugador"
        value={firstName}
        onChange={setFirstName}
        wrongMsg={wrongFirstName}
      />
      <Input
        placeholder="Apellido del Jugador"
        value={lastName}
        onChange={setLastName}
        wrongMsg={wrongLastName}
      />
      <Input
        placeholder="Número del Jugador"
        value={number}
        onChange={setNumber}
        wrongMsg={wrongNumber}
        keyboardType="numeric"
      />
      <Button
        title={playerData ? "Guardar" : "Añadir jugador"}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default PlayerForm;
