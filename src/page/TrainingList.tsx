import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import TrainingForm from "../components/TrainingForm";
import TrainingDetail from "../components/TrainingDetail";
import TraningCards from "../components/TraningCards";
import DeleteModal from "../framework/DeleteModal";

import { useClubStore } from "../store/ClubStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import { Training } from "../types/database";

interface TrainingListProps {
  onReturn?: () => void;
}

const TrainingList: React.FC<TrainingListProps> = ({ onReturn }) => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [createTraining, setCreateTraining] = useState<boolean>(false);
  const [editTraining, setEditTraining] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Training | null>(null);

  const { TrainingController } = useDB();

  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const setHeaderAction = useMenuStore((state) => state.setHeaderAction);
  const setHeaderBackAction = useMenuStore((state) => state.setHeaderBackAction);

  const openCreateTraining = useCallback(() => setCreateTraining(true), []);

  useEffect(() => {
    getTrainings();
    setMainMenu();
    return () => {
      setHeaderAction(null);
      setHeaderBackAction(null);
    };
  }, []);

  useEffect(() => {
    if (createTraining) {
      setHeaderAction(null);
      setHeaderBackAction({
        label: "Volver",
        iconName: "chevron-left",
        iconFamily: "Feather",
        onPress: () => setCreateTraining(false),
        testID: "header-back-button",
      });
    } else if (editTraining) {
      setHeaderAction(null);
      setHeaderBackAction({
        label: "Volver",
        iconName: "chevron-left",
        iconFamily: "Feather",
        onPress: () => {
          setSelectedTraining(null);
          setEditTraining(false);
        },
        testID: "header-back-button",
      });
    } else if (selectedTraining) {
      setHeaderAction(null);
      setHeaderBackAction({
        label: "Volver",
        iconName: "chevron-left",
        iconFamily: "Feather",
        onPress: () => setSelectedTraining(null),
        testID: "header-back-button",
      });
    } else {
      setHeaderAction({
        label: "Añadir",
        iconName: "plus-circle",
        iconFamily: "Feather",
        onPress: openCreateTraining,
        testID: "header-add-training",
      });
      setHeaderBackAction(null);
    }
  }, [createTraining, editTraining, selectedTraining]);

  useEffect(() => {
    if (createTraining) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setCreateTraining(false),
          children: () => <Entypo name="back" size={18} color="white" />,
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
            setSelectedTraining(null);
            setEditTraining(false);
          },
          children: () => <Entypo name="back" size={18} color="white" />,
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
          children: () => <Entypo name="back" size={18} color="white" />,
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
        children: () => <MaterialIcons name="assignment-add" size={18} color="white" />,
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn || (() => {}),
        children: () => <Entypo name="back" size={18} color="white" />,
      },
    ]);
  };

  const getTrainings = async () => {
    if (club?.id) {
      const list = await TrainingController.getAll(club.id);
      setTrainings(list);
    }
  };

  const handleAddTraining = async (data: any) => {
    await TrainingController.add(data);
    getTrainings();
    setCreateTraining(false);
  };

  const handleUpdateTraining = async (data: any) => {
    getTrainings();
    setSelectedTraining(null);
    setEditTraining(false);
  };

  const handleOpenEditForm = (item: Training) => {
    setSelectedTraining(item);
    setEditTraining(true);
  };

  const handleOpenDeleteModal = (item: Training) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete?.id) {
      await TrainingController.remove(itemToDelete.id);
      getTrainings();
      setModalVisible(false);
      setItemToDelete(null);
    }
  };

  return (
    <View className="w-full h-full px-3">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar este entrenamiento ${itemToDelete?.trainingNumber || ""}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
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
          <TraningCards
            trainings={trainings}
            onSelect={setSelectedTraining}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteModal}
          />
        ))}
    </View>
  );
};

export default TrainingList;
