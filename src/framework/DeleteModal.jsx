import { Modal, Text, TouchableOpacity, View } from "react-native";

const DeleteModal = ({ visible, onCancel, onDelete, title }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="w-full h-full flex justify-center items-center">
        <View className="w-3/4 h-1/4 flex flex-col justify-center items-center bg-blue-200 rounded-xl border-blue-600 border-4 px-5">
          <Text className="w-full text-xl text-blue-950 text-center">
            {title}
          </Text>
          <View className="w-full flex flex-row justify-between mt-5 px-5">
            <TouchableOpacity
              className="px-4 py-2 bg-red-600 rounded-2xl"
              onPress={onDelete}
            >
              <Text className="text-red-100">Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-blue-600 rounded-2xl"
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
