import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StartingFiveModalProps } from "../types/match";
import Button from "../framework/Button";

export const StartingFiveModal: React.FC<StartingFiveModalProps> = ({
  visible,
  roster,
  onConfirmStartingFive,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleTogglePlayer = (playerId: number) => {
    const idNum = Number(playerId);
    setSelectedIds((prev) => {
      const exists = prev.some((id) => Number(id) === idNum);
      if (exists) {
        return prev.filter((id) => Number(id) !== idNum);
      } else if (prev.length < 5) {
        return [...prev, idNum];
      }
      return prev;
    });
  };

  const isComplete = selectedIds.length === 5;

  const handleConfirm = () => {
    if (isComplete) {
      onConfirmStartingFive(selectedIds);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/80 px-4 py-8">
        <View className="w-full max-h-[85%] bg-danish-dark-gray border-2 border-danish-gold rounded-3xl p-5 shadow-2xl flex-col justify-between">
          {/* Header */}
          <View className="border-b border-gray-700 pb-3 mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-2">
                <Ionicons name="people" size={22} color="#F59E0B" />
                <Text className="text-xl font-black text-danish-white tracking-wide">
                  Seleccionar 5 Inicial
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full border ${
                  isComplete
                    ? "bg-emerald-950 border-emerald-500"
                    : "bg-amber-950 border-amber-500"
                }`}
              >
                <Text
                  className={`text-xs font-black ${
                    isComplete ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {selectedIds.length} / 5
                </Text>
              </View>
            </View>
            <Text className="text-xs text-gray-300">
              Elige exactamente 5 jugadores para comenzar el partido en pista.
            </Text>
          </View>

          {/* Roster List */}
          <ScrollView
            className="my-2 max-h-80"
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          >
            {roster.length === 0 ? (
              <View className="py-8 items-center justify-center">
                <Text className="text-gray-400 text-sm text-center font-medium">
                  No hay jugadores convocados para este partido.
                </Text>
              </View>
            ) : (
              roster.map((player) => {
                const isSelected = selectedIds.some(
                  (id) => Number(id) === Number(player.id)
                );
                return (
                  <TouchableOpacity
                    key={player.id}
                    activeOpacity={0.7}
                    onPress={() => handleTogglePlayer(player.id)}
                    className={`flex-row items-center justify-between p-3 rounded-2xl border ${
                      isSelected
                        ? "bg-amber-950/60 border-danish-gold shadow-md"
                        : "bg-gray-800/80 border-gray-700"
                    }`}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      {/* Jersey Number */}
                      <View
                        className={`w-9 h-9 rounded-full items-center justify-center font-bold border ${
                          isSelected
                            ? "bg-danish-gold border-danish-gold"
                            : "bg-gray-700 border-gray-600"
                        }`}
                      >
                        <Text
                          className={`text-sm font-black ${
                            isSelected ? "text-gray-950" : "text-danish-white"
                          }`}
                        >
                          {player.number}
                        </Text>
                      </View>

                      {/* Name & Position */}
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-danish-white">
                          {player.firstName} {player.lastName}
                        </Text>
                        {player.position ? (
                          <Text className="text-xs text-gray-400 font-medium">
                            {player.position}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    {/* Selection Indicator */}
                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center border ${
                        isSelected
                          ? "bg-danish-gold border-danish-gold"
                          : "bg-transparent border-gray-600"
                      }`}
                    >
                      {isSelected ? (
                        <Feather name="check" size={14} color="#030712" />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Action Footer */}
          <View className="pt-3 border-t border-gray-700 mt-2">
            <TouchableOpacity
              testID="confirm-starting-five-btn"
              disabled={!isComplete}
              onPress={handleConfirm}
              className={`w-full py-3.5 rounded-xl items-center justify-center shadow-lg ${
                isComplete
                  ? "bg-danish-gold active:bg-amber-500"
                  : "bg-gray-700 opacity-50"
              }`}
            >
              <Text
                className={`text-sm font-black uppercase tracking-wider ${
                  isComplete ? "text-gray-950" : "text-gray-400"
                }`}
              >
                {isComplete
                  ? "Confirmar 5 Inicial"
                  : `Selecciona 5 jugadores (${selectedIds.length}/5)`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StartingFiveModal;
