import { useEffect, useState } from "react";
import { View } from "react-native-web";
import { useClubStore } from "../store/ClubStore";
import TrainingForm from "../components/TrainingForm";
import TrainingDetail from "../components/TrainingDetail";
import DeleteModal from "../framework/DeleteModal";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import useDB from "../hooks/useDB";
import TraningCards from "../components/TraningCards";

const TrainingList = ({ onReturn }) => {
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [createTraining, setCreateTraining] = useState(false);
  const [editTraining, setEditTraining] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { TrainingController } = useDB();

  const club = useClubStore((state) => state.club);
  const trainings = useClubStore((state) => state.trainings);
  const setTrainings = useClubStore((state) => state.setTrainings);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    getTrainings();
    setMainMenu();
  }, []);

  useEffect(() => {
    if (!createTraining || !editTraining) {
      setMainMenu();
    }
  }, [createTraining, editTraining]);

  useEffect(() => {
    if (editTraining) return;
    if (selectedTraining) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setSelectedTraining(null),
          icon: TopMenuEnums.GO_BACK,
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
        icon: TopMenuEnums.ADD_NEW_SESSION,
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        icon: TopMenuEnums.GO_BACK,
      },
    ]);
  };

  const getTrainings = async () => {
    setTrainings(await TrainingController.load(club.id));
  };

  const handleSaveTraining = async (data) => {
    await TrainingController.save(data);
    setCreateTraining(false);
    setSelectedTraining(null);
    setEditTraining(false);
    if (data.id)
      setTrainings([...trainings.filter((t) => t.id !== data.id), data]);
    else getTrainings();
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
          onSubmit={handleSaveTraining}
          onCancel={() => setCreateTraining(false)}
        />
      )}
      {!createTraining && editTraining && (
        <TrainingForm
          onSubmit={handleSaveTraining}
          trainingData={selectedTraining}
          onCancel={() => {
            setEditTraining(false);
            setSelectedTraining(null);
          }}
        />
      )}
      {!createTraining &&
        !editTraining &&
        (selectedTraining ? (
          <TrainingDetail data={selectedTraining} />
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
