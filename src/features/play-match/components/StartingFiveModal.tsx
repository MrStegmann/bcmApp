import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StartingFiveModalProps } from "../types";

export const StartingFiveModal: React.FC<StartingFiveModalProps> = ({
  visible,
  roster,
  onConfirmStartingFive,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pId) => pId !== id);
      }
      if (prev.length < 5) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    if (selectedIds.length === 5) {
      onConfirmStartingFive(selectedIds);
    }
  };

  const isReady = selectedIds.length === 5;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/70 justify-center items-center p-4">
        <View className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-5 shadow-2xl">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-white">Seleccionar 5 Inicial</Text>
            <View className={`px-3 py-1 rounded-full ${isReady ? "bg-emerald-500/20 border border-emerald-500" : "bg-slate-800 border border-slate-700"}`}>
              <Text className={`font-semibold ${isReady ? "text-emerald-400" : "text-slate-300"}`}>
                {selectedIds.length} / 5
              </Text>
            </View>
          </View>

          <Text className="text-slate-400 text-sm mb-4">
            Selecciona exactamente 5 jugadores para comenzar el partido en pista.
          </Text>

          <ScrollView className="max-h-80 mb-4">
            {roster.map((player) => {
              const isSelected = selectedIds.includes(player.id);
              return (
                <TouchableOpacity
                  key={player.id}
                  activeOpacity={0.7}
                  onPress={() => handleToggle(player.id)}
                  className={`flex-row items-center justify-between p-3 mb-2 rounded-xl border ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500"
                      : "bg-slate-800/60 border-slate-700"
                  }`}
                >
                  <View className="flex-row items-center space-x-3">
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${isSelected ? "bg-amber-500" : "bg-slate-700"}`}>
                      <Text className={`font-bold text-base ${isSelected ? "text-slate-950" : "text-white"}`}>
                        {player.number ? `#${player.number}` : "-"}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-semibold text-base">
                        {player.firstName} {player.lastName}
                      </Text>
                      {player.position && (
                        <Text className="text-slate-400 text-xs">{player.position}</Text>
                      )}
                    </View>
                  </View>

                  <View
                    className={`w-6 h-6 rounded-full border items-center justify-center ${
                      isSelected
                        ? "bg-amber-500 border-amber-500"
                        : "border-slate-500"
                    }`}
                  >
                    {isSelected && <Text className="text-slate-950 font-bold text-xs">✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!isReady}
            onPress={handleConfirm}
            className={`py-3.5 rounded-xl items-center justify-center ${
              isReady ? "bg-amber-500" : "bg-slate-800 opacity-50"
            }`}
          >
            <Text className={`font-bold text-base ${isReady ? "text-slate-950" : "text-slate-400"}`}>
              Confirmar 5 Inicial
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
