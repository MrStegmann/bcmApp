import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useClubStore } from "../store/ClubStore";
import Input from "../framework/Input";
import Button from "../framework/Button";
import {
  validatePlayerForm,
  createPlayerPayload,
} from "../utils/playerValidation";

export { validatePlayerForm, createPlayerPayload };

export interface PlayerFormProps {
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
  const [jerseyName, setJerseyName] = useState("");
  const [wrongJerseyName, setWrongJerseyName] = useState("");

  useEffect(() => {
    if (playerData) {
      setFirstName(playerData.firstName || playerData.first_name || "");
      setLastName(playerData.lastName || playerData.last_name || "");
      setNumber(playerData.number ? String(playerData.number) : "");
      setJerseyName(playerData.jerseyName || playerData.jersey_name || "");
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
  useEffect(() => {
    setWrongJerseyName("");
  }, [jerseyName]);

  const handleSubmit = () => {
    const validation = validatePlayerForm({
      firstName,
      lastName,
      number,
      jerseyName,
    });

    if (!validation.isValid) {
      if (validation.errors.firstName) setWrongFirstName(validation.errors.firstName);
      if (validation.errors.lastName) setWrongLastName(validation.errors.lastName);
      if (validation.errors.number) setWrongNumber(validation.errors.number);
      if (validation.errors.jerseyName) setWrongJerseyName(validation.errors.jerseyName);
      return;
    }

    const payload = createPlayerPayload(
      {
        teamId: club?.id || 1,
        firstName,
        lastName,
        number,
        jerseyName,
      },
      playerData?.id
    );

    onSubmit(payload);
  };

  return (
    <KeyboardAwareScrollView
      className="w-full flex-1"
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="w-full px-4 flex-1 gap-4 py-2">
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
        <Input
          placeholder="Nombre en camiseta (opcional)"
          value={jerseyName}
          onChange={setJerseyName}
          wrongMsg={wrongJerseyName}
        />
        <View className="w-full flex flex-col gap-2.5 mt-2">
          <Button
            title={playerData ? "Guardar" : "Añadir jugador"}
            onPress={handleSubmit}
          />
          {onCancel ? (
            <TouchableOpacity
              onPress={onCancel}
              className="w-full min-h-[48px] py-3 items-center justify-center rounded-xl bg-slate-card border border-slate-border active:bg-slate-dark"
            >
              <Text className="text-on-surface font-semibold text-base">Cancelar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PlayerForm;
