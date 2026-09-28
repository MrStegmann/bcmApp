import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Input from "../framework/Input";
import Button from "../framework/Button";
import { Team, NewTeam } from "../types/database";

export interface ClubFormProps {
  onSubmit: (data: { name: string; category?: string; id?: number }) => void | Promise<void>;
  clubData?: Team | null;
  initialData?: Team | null;
  onCancel?: () => void;
}

export default function ClubForm({ onSubmit, clubData, initialData, onCancel }: ClubFormProps) {
  const targetData = initialData ?? clubData;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [wrongName, setWrongName] = useState("");

  useEffect(() => {
    if (targetData?.id) {
      setName(targetData.name ?? "");
      setCategory(targetData.category ?? "");
    } else {
      setName("");
      setCategory("");
    }
  }, [targetData]);

  useEffect(() => {
    if (name.trim() !== "") {
      setWrongName("");
    }
  }, [name]);

  const handleSubmit = () => {
    if (name.trim() === "") {
      setWrongName("Debes introducir un nombre para el equipo");
      return;
    }

    onSubmit({
      name: name.trim(),
      category: category.trim() || undefined,
      id: targetData?.id,
    });

    if (!targetData) {
      setName("");
      setCategory("");
    }
  };

  const isEditing = Boolean(targetData?.id);

  return (
    <View className="w-full bg-danish-dark-gray p-6 rounded-2xl border-2 border-danish-red shadow-xl space-y-4">
      <Text className="text-danish-white font-bold text-xl text-center mb-2">
        {isEditing ? "Editar Equipo" : "Crear Nuevo Equipo"}
      </Text>

      <Input
        placeholder="Nombre del Equipo *"
        value={name}
        onChange={setName}
        wrongMsg={wrongName}
      />

      <Input
        placeholder="Categoría (ej: Senior, Junior, Infantil)"
        value={category}
        onChange={setCategory}
      />

      <View className="flex-col gap-3 mt-4">
        <Button
          title={isEditing ? "Guardar Cambios" : "Crear Equipo"}
          onPress={handleSubmit}
        />

        {onCancel ? (
          <TouchableOpacity
            onPress={onCancel}
            className="w-full py-3 bg-gray-700 rounded-xl items-center active:bg-gray-600"
          >
            <Text className="text-gray-300 font-semibold text-base">Cancelar</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
