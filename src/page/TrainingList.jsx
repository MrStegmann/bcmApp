import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import { useClubStore } from "../store/ClubStore";
import TrainingForm from "../components/TrainingForm";
import Training from "../models/Training";
import TrainingDetail from "../components/TrainingDetail";
import { Feather } from "@expo/vector-icons";
import DeleteModal from "../framework/DeleteModal";
import Table from "../framework/Table";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useDB from "../hooks/useDB";

const TableHeader = () => {
  return (
    <>
      <Text className="font-bold w-[70%] text-danish-dark-gray text-left">
        Sesión
      </Text>
      <Text className="font-bold w-[25%] text-danish-dark-gray text-center">
        Opciones
      </Text>
    </>
  );
};

const TableBody = ({
  items,
  onSelect,
  handleOpenEditForm,
  handleOpenDeleteModal,
}) => {
  return (
    <>
      {items.map((item) => (
        <View
          key={item.id}
          className="w-full flex flex-row items-center border-b px-3 border-danish-light-gray py-2"
        >
          <Text className="text-lg font-bold w-[70%]">
            Sesión {item.training_number} - {item.date}
          </Text>
          <View className="w-[25%] flex flex-row justify-between items-center">
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Feather name="info" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOpenEditForm(item)}>
              <Feather name="edit" size={24} color="blue" />
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

const TrainingList = ({ onReturn }) => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [createTraining, setCreateTraining] = useState(false);
  const [editTraining, setEditTraining] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { TrainingController } = useDB();

  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    getTrainings();
    setMainMenu();
  }, []);

  useEffect(() => {
    if (createTraining) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setCreateTraining(false),
          children: () => <Entypo name="back" size={24} color="red" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [createTraining]);

  useEffect(() => {
    if (editTraining) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => {
            (setSelectedTraining(null), setEditTraining(false));
          },
          children: () => <Entypo name="back" size={24} color="red" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [editTraining]);

  useEffect(() => {
    if (editTraining) return;
    if (selectedTraining) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setSelectedTraining(null),
          children: () => <Entypo name="back" size={24} color="red" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [selectedTraining]);

  const setMainMenu = () => {
    setTopMenu([
      {
        id: TopMenuEnums.ADD_NEW_SESSION,
        name: "Añadir Sesión",
        onPress: () => setCreateTraining(true),
        children: () => (
          <MaterialIcons name="assignment-add" size={24} color="red" />
        ),
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        children: () => <Entypo name="back" size={24} color="red" />,
      },
    ]);
  };

  const getTrainings = async () => {
    TrainingController.load(club.id, setTrainings);
  };

  const handleAddTraining = async (data) => {
    TrainingController.add(data);
    getTrainings();
    setCreateTraining(false);
  };

  const handleUpdateTraining = async (data) => {
    TrainingController.edit(data);
    getTrainings();
    setSelectedTraining(null);
    setEditTraining(false);
  };

  const handleOpenEditForm = (item) => {
    setSelectedTraining(item);
    setEditTraining(true);
  };

  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    TrainingController.remove(itemToDelete.id);
    getTrainings();
    setModalVisible(false);
    setItemToDelete(null);
  };
  return (
    <View className="flex-1 w-full h-full justify-start items-center">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar este entrenamiento ${itemToDelete?.training_number}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        item={itemToDelete}
      />

      {createTraining && !editTraining && (
        <TrainingForm
          onSubmit={handleAddTraining}
          onCancel={() => setCreateTraining(false)}
        />
      )}
      {!createTraining && editTraining && (
        <TrainingForm
          onSubmit={handleUpdateTraining}
          trainingData={selectedTraining}
          onCancel={() => setEditTraining(false)}
        />
      )}
      {!createTraining &&
        !editTraining &&
        (selectedTraining ? (
          <TrainingDetail
            data={selectedTraining}
            onReturn={() => setSelectedTraining(null)}
          />
        ) : (
          <Table
            header={<TableHeader />}
            body={
              <TableBody
                items={trainings}
                onSelect={setSelectedTraining}
                handleOpenEditForm={handleOpenEditForm}
                handleOpenDeleteModal={handleOpenDeleteModal}
              />
            }
          />
        ))}
    </View>
  );
};

export default TrainingList;
