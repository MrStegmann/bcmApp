import { useEffect, useMemo, useState } from "react";
import { View } from "react-native-web";
import { useClubStore } from "../store/ClubStore";
import Input from "../framework/Input";
import TopMenuEnums from "../Enums/TopMenuEnums";
import { useMenuStore } from "../store/MenuStore";

const PlayerForm = ({ onSubmit, onCancel, playerData }) => {
  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const [firstName, setFirstName] = useState("");
  const [wrongFirstName, setWrongFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [wrongLastName, setWrongLastName] = useState("");
  const [number, setNumber] = useState("");
  const [wrongNumber, setWrongNumber] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTopMenu([
        {
          id: TopMenuEnums.SAVE,
          name: "Guardar",
          onPress: handleSubmit,
          icon: TopMenuEnums.SAVE,
        },
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: onCancel,
          icon: TopMenuEnums.GO_BACK,
        },
      ]);
    }, 25);
    return () => clearTimeout(timeout);
  }, [firstName, lastName, number]);

  useEffect(() => {
    if (playerData) {
      setFirstName(playerData.first_name);
      setLastName(playerData.last_name);
      setNumber(playerData.number);
    }
  }, []);

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
    if (isNaN(number)) return setWrongNumber("Debes introducir un número.");

    onSubmit({
      ...(playerData?.id != null && { id: playerData?.id }),
      team_id: club.id,
      first_name: firstName,
      last_name: lastName,
      number,
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
    </View>
  );
};

export default PlayerForm;
