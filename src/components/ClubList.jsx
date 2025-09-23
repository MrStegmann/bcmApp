import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Table from "../framework/Table";
import DeleteModal from "../framework/DeleteModal";

const TableHeader = () => {
  return (
    <>
      <Text className="font-bold w-[70%] text-danish-dark-gray">
        Nombre del Club
      </Text>
      <Text className="font-bold w-[30%] text-danish-dark-gray">Opciones</Text>
    </>
  );
};
const TableBody = ({ items, onSelect, handleOpenDeleteModal }) => {
  return (
    <>
      {items.map((item) => (
        <View
          key={item.id}
          className="w-full flex flex-row items-center border-b border-x px-3 border-danish-light-gray py-2"
        >
          <View className="w-[70%]">
            <Text className="font-semibold text-danish-dark-gray">
              {item.name}
            </Text>
          </View>

          <View className="w-[20%] flex flex-row justify-end items-center gap-3">
            <TouchableOpacity color="green" onPress={() => onSelect(item)}>
              <Feather name="info" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              color="red"
              onPress={() => handleOpenDeleteModal(item)}
            >
              <Feather name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
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

      {clubs.length ? (
        <Table
          header={<TableHeader />}
          body={
            <TableBody
              items={clubs}
              onSelect={onSelect}
              handleOpenDeleteModal={handleOpenDeleteModal}
            />
          }
        />
      ) : (
        <Text className="text-center font-bold text-danish-dark-gray">
          No hay ningún Equipo registrado
        </Text>
      )}
    </View>
  );
}
