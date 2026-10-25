import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalInfoProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  information?: string;
}

const ModalInfo: React.FC<ModalInfoProps> = ({
  visible,
  onClose,
  title,
  information,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="w-full h-full flex justify-center items-center bg-black/70 px-5">
        <View className="w-full max-w-sm flex flex-col justify-center items-center bg-surface-container rounded-2xl border border-slate-border shadow-2xl p-6">
          {title ? (
            <Text className="w-full text-xl font-bold text-white text-center mb-3">
              {title}
            </Text>
          ) : null}
          {information ? (
            <Text className="w-full text-base text-on-surface text-center mb-6">
              {information}
            </Text>
          ) : null}
          <View className="w-full flex flex-row justify-center items-center">
            <TouchableOpacity
              className="min-h-[48px] px-6 py-3 border border-tactical-blue bg-tactical-blue/10 active:bg-tactical-blue/20 rounded-lg items-center justify-center"
              onPress={onClose}
            >
              <Text className="text-tactical-blue-light font-bold">Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalInfo;
