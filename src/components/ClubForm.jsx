import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Input from "../framework/Input";
import Button from "../framework/Button";

export default function ClubForm({ onSubmit, clubData }) {
  const [name, setName] = useState("");
  const [wrongName, setWrongName] = useState("");

  useEffect(() => {
    if (clubData?.id) {
      setName(clubData.name);
    }
  }, []);

  useEffect(() => {
    setWrongName("");
  }, [name]);

  const handleSubmit = () => {
    if (name.trim() === "") return setWrongName("El campo no debe estar vacío");
    onSubmit({ name: name.trim(), id: clubData?.id });
    setName("");
  };

  return (
    <View className="w-full px-5 gap-5">
      <Input
        placeholder="Nombre del Equipo"
        value={name}
        onChange={setName}
        wrongMsg={wrongName}
      />

      <Button
        title={clubData ? "Guardar Club" : "Crear Club"}
        onPress={handleSubmit}
      />
    </View>
  );
}
