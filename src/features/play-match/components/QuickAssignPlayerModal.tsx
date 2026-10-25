import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { QuickAssignPlayerModalProps } from "../types";

export const QuickAssignPlayerModal: React.FC<QuickAssignPlayerModalProps> = ({
  visible,
  positionIndex,
  targetPositionIndex,
  availableBenchPlayers,
  benchPlayers,
  onAssignPlayer,
  onClose,
}) => {
  const pos = positionIndex ?? targetPositionIndex ?? 0;
  const benchList = availableBenchPlayers ?? benchPlayers ?? [];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/75 justify-center items-center p-4">
        <View className="bg-surface-container border border-slate-border w-full max-w-sm rounded-2xl p-5 shadow-2xl">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-white">Asignar Posición #{pos + 1}</Text>
            <TouchableOpacity onPress={onClose} testID="close-quick-assign-modal" className="p-2 min-h-[48px] min-w-[48px] items-center justify-center">
              <Text className="text-slate-400 font-bold text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-slate-400 text-xs mb-4">
            Selecciona un jugador del banquillo para colocarlo en esta posición de la pista:
          </Text>

          {benchList.length === 0 ? (
            <View className="py-6 items-center justify-center bg-surface-dim/60 rounded-xl border border-slate-border mb-4">
              <Text className="text-slate-400 text-sm font-medium">No hay jugadores en el banquillo</Text>
            </View>
          ) : (
            <ScrollView className="max-h-72 mb-4">
              {benchList.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    onAssignPlayer(player.id, pos);
                    onClose();
                  }}
                  testID={`assign-player-${player.id}`}
                  className="flex-row items-center justify-between p-3 min-h-[48px] mb-2 rounded-xl bg-surface-elevated border border-slate-border active:bg-court-orange/20 active:border-court-orange"
                >
                  <View className="flex-row items-center space-x-3">
                    <View className="w-9 h-9 rounded-full bg-slate-border items-center justify-center">
                      <Text className="text-white font-bold text-sm">
                        {player.number ? `#${player.number}` : "-"}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-semibold text-sm">
                        {player.firstName} {player.lastName}
                      </Text>
                      {player.position && (
                        <Text className="text-slate-400 text-xs">{player.position}</Text>
                      )}
                    </View>
                  </View>
                  <Text className="text-court-orange font-bold text-xs bg-court-orange/10 px-2 py-1 rounded">
                    + Asignar
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            className="py-3 min-h-[48px] rounded-xl bg-surface-elevated border border-slate-border items-center justify-center active:bg-slate-border"
          >
            <Text className="text-slate-300 font-semibold text-sm">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
