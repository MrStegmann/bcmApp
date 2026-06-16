import { Modal, Text, TouchableOpacity, View } from "react-native-web";

const DeleteModal = ({ visible, onCancel, onDelete, title }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="w-full h-full flex justify-center items-center">
        <View className="w-3/4 h-1/4 flex flex-col justify-center items-center bg-gray-950 rounded-xl border-danish-red border-2 shadow-2xl shadow-danish-dark-gold px-5">
          <Text className="w-full text-xl text-danish-white text-center">
            {title}
          </Text>
          <View className="w-full flex flex-row justify-between mt-5 px-5">
            <TouchableOpacity
              className="px-4 py-2 border-2 border-danish-red shadow-inner shadow-danish-red rounded-2xl"
              onPress={onDelete}
            >
              <Text className="text-red-100">Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 border-danish-white border-2 shadow-inner shadow-danish-white rounded-2xl"
              onPress={onCancel}
            >
              <Text className="text-blue-100">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
