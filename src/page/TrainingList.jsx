import { useEffect, useState } from "react";
import { View } from "react-native";
import { useClubStore } from "../store/ClubStore";
import TrainingForm from "../components/TrainingForm";
import TrainingDetail from "../components/TrainingDetail";
import DeleteModal from "../framework/DeleteModal";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useDB from "../hooks/useDB";
import TraningCards from "../components/TraningCards";

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
            (setSelectedTraining(null), setEditTraining(false));
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
        children: () => (
          <MaterialIcons name="assignment-add" size={18} color="white" />
        ),
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        children: () => <Entypo name="back" size={18} color="white" />,
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
    <View className="w-full h-full px-3">
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
