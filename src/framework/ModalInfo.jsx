import { Modal, Text, TouchableOpacity, View } from "react-native";

const ModalInfo = ({ visible, onClose, title, information }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="w-full h-full flex justify-center items-center">
        <View className="w-5/6 h-4/5 flex flex-col justify-center items-center bg-gray-950 rounded-xl border-danish-red border-2 shadow-2xl shadow-danish-dark-gold px-5 py-5">
          <Text className="w-full text-xl text-danish-white text-center mb-5">
            {title}
          </Text>
          <Text className="w-full text-xl text-danish-white text-center flex-1">
            {information}
          </Text>
          <View className="w-full flex flex-row justify-center items-center px-5">
            <TouchableOpacity
              className="px-4 py-2 border-danish-white border-2 bg-danish-dark-gray shadow-inner shadow-danish-white rounded-lg"
              onPress={onClose}
            >
              <Text className="text-danish-white">Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalInfo;
