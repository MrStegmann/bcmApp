import React from "react";
import { Modal, Text, View, ScrollView, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import { RosterSelectionModalProps } from "../types/match";
import Button from "../framework/Button";

const RosterSelectionModal: React.FC<RosterSelectionModalProps> = ({
  visible,
  isMandatory,
  availablePlayers = [],
  selectedPlayerIds = [],
  onTogglePlayer,
  onConfirm,
  onSkip,
  onClose,
}) => {
  const handleConfirm = () => {
    if (isMandatory && selectedPlayerIds.length === 0) {
      return;
    }
    onConfirm(selectedPlayerIds);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/80 px-4 py-8">
        <View className="w-full max-h-[85%] bg-danish-dark-gray border-2 border-danish-red rounded-2xl p-4 shadow-2xl flex flex-col justify-between">
          {/* Modal Header */}
          <View className="w-full flex-row justify-between items-center pb-3 border-b border-gray-700">
            <View className="flex-1 pr-2">
              <Text className="text-xl font-bold text-danish-white">
                {isMandatory ? "Convocatoria Obligatoria" : "Declarar Convocatoria"}
              </Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                {`Convocados: ${selectedPlayerIds.length} / 12 jugadores`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="p-1 rounded-full bg-gray-800"
              testID="close-roster-modal"
            >
              <Feather name="x" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Player Selection List */}
          <ScrollView className="my-3 max-h-80" showsVerticalScrollIndicator={true}>
            {availablePlayers.length === 0 ? (
              <View className="py-8 items-center justify-center">
                <Text className="text-gray-400 text-sm text-center">
                  No hay jugadores registrados en el equipo.
                </Text>
              </View>
            ) : (
              availablePlayers.map((player) => {
                const isSelected = selectedPlayerIds.includes(player.id);
                return (
                  <TouchableOpacity
                    key={player.id}
                    onPress={() => onTogglePlayer(player.id)}
                    className={`flex-row items-center justify-between p-3 my-1.5 rounded-xl border-2 ${
                      isSelected
                        ? "bg-gray-800/90 border-danish-gold"
                        : "bg-gray-800/40 border-gray-700"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`w-9 h-9 rounded-full items-center justify-center font-bold ${
                          isSelected ? "bg-danish-gold" : "bg-gray-700"
                        }`}
                      >
                        <Text
                          className={`font-extrabold text-sm ${
                            isSelected ? "text-gray-950" : "text-gray-300"
                          }`}
                        >
                          {player.number}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-sm font-semibold text-danish-white">
                          {`${player.firstName} ${player.lastName}`}
                        </Text>
                        {player.position ? (
                          <Text className="text-xs text-gray-400">{player.position}</Text>
                        ) : null}
                      </View>
                    </View>

                    <View className="pr-1">
                      {isSelected ? (
                        <FontAwesome6 name="person-circle-check" size={22} color="#EAB308" />
                      ) : (
                        <FontAwesome6
                          name="person-circle-plus"
                          size={22}
                          color="#6B7280"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View className="w-full flex-col gap-2 pt-2 border-t border-gray-700">
            <Button
              title="Confirmar Convocatoria"
              onPress={handleConfirm}
              disabled={isMandatory && selectedPlayerIds.length === 0}
            />
            {!isMandatory && onSkip ? (
              <TouchableOpacity
                onPress={onSkip}
                className="w-full py-2.5 items-center justify-center rounded-xl bg-gray-800 active:bg-gray-700"
              >
                <Text className="text-gray-300 font-semibold text-sm">Omitir</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RosterSelectionModal;
