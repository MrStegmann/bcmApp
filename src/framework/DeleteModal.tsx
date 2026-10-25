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
      <View className="flex-1 bg-black/75 justify-center items-center px-6">
        <View className="w-full max-w-sm bg-surface-container rounded-2xl border border-slate-border shadow-2xl p-6 items-center">
          <View className="w-12 h-12 rounded-full bg-error-container/30 items-center justify-center mb-3">
            <Feather name="alert-triangle" size={24} color="#EF4444" />
          </View>

          <Text className="text-xl font-bold text-white text-center mb-2">
            {title}
          </Text>

          {subtitle ? (
            <Text className="text-on-surface-variant text-sm text-center mb-6 px-2">
              {subtitle}
            </Text>
          ) : null}

          <View className="w-full flex-row space-x-3 gap-3">
            <TouchableOpacity
              className="flex-1 min-h-[48px] py-3 bg-slate-card rounded-xl items-center justify-center border border-slate-border active:bg-slate-dark"
              onPress={onCancel}
            >
              <Text className="text-on-surface font-semibold text-base">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-h-[48px] py-3 bg-error-container rounded-xl items-center justify-center active:bg-[#690005] shadow-md"
              onPress={onDelete}
            >
              <Text className="text-[#FFDAD6] font-bold text-base">Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
