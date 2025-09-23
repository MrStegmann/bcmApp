import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import Input from "../framework/Input";
import Button from "../framework/Button";

const PlayerForm = ({ onSubmit, onCancel, playerData }) => {
  const club = useClubStore((state) => state.club);
  const [firstName, setFirstName] = useState("");
  const [wrongFirstName, setWrongFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [wrongLastName, setWrongLastName] = useState("");
  const [number, setNumber] = useState("");
  const [wrongNumber, setWrongNumber] = useState("");

  useEffect(() => {
    if (playerData) {
      setFirstName(playerData.first_name);
      setLastName(playerData.last_name);
      setNumber(playerData.number);
    }
  }, []);

  const handleSubmit = () => {
    if ([firstName, lastName, number].includes("")) return;

    onSubmit({
      teamId: club.id,
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
      />
      <Button
        title={playerData ? "Guardar" : "Añadir jugador"}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default PlayerForm;
