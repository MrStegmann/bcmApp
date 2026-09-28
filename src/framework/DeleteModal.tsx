import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export interface DeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
  title?: string;
  subtitle?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onCancel,
  onDelete,
  title = "¿Estás seguro de eliminar este registro?",
  subtitle = "Esta acción eliminará permanentemente el equipo y sus datos asociados.",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="w-full max-w-sm bg-gray-900 rounded-2xl border-2 border-danish-red shadow-2xl p-6 items-center">
          <View className="w-12 h-12 rounded-full bg-red-900/40 items-center justify-center mb-3">
            <Feather name="alert-triangle" size={24} color="#ef4444" />
          </View>

          <Text className="text-xl font-bold text-danish-white text-center mb-2">
            {title}
          </Text>

          {subtitle ? (
            <Text className="text-gray-400 text-sm text-center mb-6 px-2">
              {subtitle}
            </Text>
          ) : null}

          <View className="w-full flex-row space-x-3 gap-3">
            <TouchableOpacity
              className="flex-1 py-3 bg-gray-800 rounded-xl items-center border border-gray-700 active:bg-gray-700"
              onPress={onCancel}
            >
              <Text className="text-gray-300 font-semibold text-base">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-3 bg-danish-red rounded-xl items-center active:bg-red-700 shadow-md shadow-red-900"
              onPress={onDelete}
            >
              <Text className="text-white font-bold text-base">Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
