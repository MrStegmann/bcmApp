import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import DeleteModal from "../framework/DeleteModal";

const TeamCard = ({ info, onDelete, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(info)} className="my-2">
      <View className="w-full h-20 flex flex-row bg-danish-dark-gray rounded-xl justify-between items-center px-5 shadow-xl border-danish-red border-2 shadow-danish-red">
        <Text className="text-danish-white text-xl font-bold">{info.name}</Text>
        <TouchableOpacity color="red" onPress={() => onDelete(info)}>
          <Feather name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function ClubList({ clubs, onSelect, onDelete }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };

  const handleConfirmDelete = () => {
    onDelete(itemToDelete.id);
    setModalVisible(false); // Oculta el modal después de la acción
  };

  return (
    <View className="w-full h-full px-5">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar el club ${itemToDelete?.name}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        item={itemToDelete}
      />

      <FlatList
        data={clubs}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TeamCard
            info={item}
            onDelete={handleOpenDeleteModal}
            onSelect={onSelect}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
